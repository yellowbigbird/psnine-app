import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTrophyDetail } from '../../hooks/useTrophyDetail';
import { useSettings } from '../../hooks/useSettings';
import { Loading, ErrorView } from '../../components/Loading';
import { Spacing, FontSize } from '../../constants/theme';

const typeColors: Record<string, string> = {
  platinum: '#a8b8d8',
  gold: '#ffd700',
  silver: '#c0c0c0',
  bronze: '#cd7f32',
};

const typeLabels: Record<string, string> = {
  platinum: '白金',
  gold: '金',
  silver: '银',
  bronze: '铜',
};

export default function TrophyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useSettings();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, isLoading, error, refetch } = useTrophyDetail(id);

  if (isLoading) return <Loading text="加载奖杯详情..." />;
  if (error || !data)
    return (
      <ErrorView
        message={error?.message || '加载奖杯详情失败'}
        onRetry={refetch}
      />
    );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data.tips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 20 }}
        ListHeaderComponent={
          <View>
            {/* Back button */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Text style={{ color: colors.primary, fontSize: FontSize.md }}>
                {'< 返回'}
              </Text>
            </TouchableOpacity>

            {/* Trophy header */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
              <Image source={{ uri: data.iconUrl }} style={styles.trophyIcon} />
              <Text style={[styles.trophyName, { color: colors.text }]}>
                {data.name}
              </Text>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: typeColors[data.type] },
                ]}
              >
                <Text style={styles.typeBadgeText}>
                  {typeLabels[data.type]}
                </Text>
              </View>
              <Text
                style={[
                  styles.trophyDesc,
                  { color: colors.textSecondary },
                ]}
              >
                {data.description}
              </Text>
            </View>

            {/* Game info */}
            {data.gameId ? (
              <TouchableOpacity
                style={[styles.gameCard, { backgroundColor: colors.surface }]}
                onPress={() => router.push(`/game/${data.gameId}`)}
              >
                {data.gameThumbnailUrl ? (
                  <Image
                    source={{ uri: data.gameThumbnailUrl }}
                    style={styles.gameThumb}
                  />
                ) : null}
                <View style={styles.gameInfo}>
                  <Text
                    style={[styles.gameName, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {data.gameName}
                  </Text>
                  <View style={styles.platforms}>
                    {data.platform.map((p) => (
                      <View
                        key={p}
                        style={[
                          styles.platformBadge,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <Text style={styles.platformText}>{p}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ) : null}

            {/* Tips section title */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              奖杯心得 ({data.tips.length})
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[styles.tipCard, { backgroundColor: colors.surface }]}
          >
            <View style={styles.tipHeader}>
              <Image
                source={{ uri: item.authorAvatar }}
                style={styles.tipAvatar}
              />
              <View style={styles.tipMeta}>
                <Text style={[styles.tipAuthor, { color: colors.text }]}>
                  {item.authorName}
                </Text>
                <Text
                  style={[
                    styles.tipTime,
                    { color: colors.textSecondary },
                  ]}
                >
                  {item.timestamp}
                  {item.location ? `  ${item.location}` : ''}
                </Text>
              </View>
            </View>
            <Text style={[styles.tipContent, { color: colors.text }]}>
              {item.content}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            暂无奖杯心得
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { padding: Spacing.lg },
  header: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  trophyIcon: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  trophyName: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: Spacing.sm,
  },
  typeBadgeText: {
    color: '#1a1a2e',
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  trophyDesc: {
    fontSize: FontSize.md,
    marginTop: Spacing.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  gameCard: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  gameThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  gameInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  gameName: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  platforms: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  platformBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 3,
  },
  platformText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  tipCard: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xs,
    padding: Spacing.md,
    borderRadius: 10,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tipAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  tipMeta: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  tipAuthor: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  tipTime: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  tipContent: {
    fontSize: FontSize.sm,
    lineHeight: 22,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: FontSize.md,
  },
});
