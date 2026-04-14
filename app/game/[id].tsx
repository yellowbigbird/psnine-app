import React, { useState } from 'react';
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
import { useGameDetail } from '../../hooks/useGameDetail';
import { useSettings } from '../../hooks/useSettings';
import { TrophyCard } from '../../components/TrophyCard';
import { Loading, ErrorView } from '../../components/Loading';
import { Spacing, FontSize } from '../../constants/theme';

export default function GameDetailScreen() {
  const { id, psnId: paramPsnId } = useLocalSearchParams<{
    id: string;
    psnId?: string;
  }>();
  const { psnId: settingsPsnId, colors } = useSettings();
  const psnId = paramPsnId || settingsPsnId;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, isLoading, error, refetch } = useGameDetail(id, psnId);
  const [filter, setFilter] = useState<'all' | 'earned' | 'unearned'>('all');

  if (isLoading) return <Loading text="加载奖杯中..." />;
  if (error || !data)
    return (
      <ErrorView
        message={error?.message || '加载游戏失败'}
        onRetry={refetch}
      />
    );

  const filteredTrophies = data.trophies.filter((t) => {
    if (filter === 'earned') return t.earned;
    if (filter === 'unearned') return !t.earned;
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredTrophies}
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

            {/* Game header */}
            <View style={[styles.header, { backgroundColor: colors.surface }]}>
              {data.thumbnailUrl ? (
                <Image
                  source={{ uri: data.thumbnailUrl }}
                  style={styles.thumbnail}
                />
              ) : null}
              <Text style={[styles.title, { color: colors.text }]}>
                {data.title}
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

              {/* Trophy summary */}
              <View style={styles.summaryRow}>
                <Text style={{ color: colors.platinum, fontWeight: '700' }}>
                  P {data.trophySummary.platinum}
                </Text>
                <Text style={{ color: colors.gold, fontWeight: '700' }}>
                  G {data.trophySummary.gold}
                </Text>
                <Text style={{ color: colors.silver, fontWeight: '700' }}>
                  S {data.trophySummary.silver}
                </Text>
                <Text style={{ color: colors.bronze, fontWeight: '700' }}>
                  B {data.trophySummary.bronze}
                </Text>
                <Text style={{ color: colors.textSecondary }}>
                  共 {data.trophySummary.total}
                </Text>
              </View>

              {data.completionRate > 0 && (
                <View style={styles.completionRow}>
                  <View
                    style={[
                      styles.progressBar,
                      { backgroundColor: colors.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: colors.primary,
                          width: `${Math.min(data.completionRate, 100)}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={{
                      color: colors.text,
                      fontWeight: '600',
                      marginLeft: 8,
                    }}
                  >
                    {data.completionRate}%
                  </Text>
                </View>
              )}
            </View>

            {/* Filter tabs */}
            <View style={styles.filterRow}>
              {(['all', 'earned', 'unearned'] as const).map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterBtn,
                    {
                      backgroundColor:
                        filter === f ? colors.primary : colors.card,
                    },
                  ]}
                  onPress={() => setFilter(f)}
                >
                  <Text
                    style={{
                      color: filter === f ? '#fff' : colors.textSecondary,
                      fontWeight: '600',
                      fontSize: FontSize.sm,
                    }}
                  >
                    {f === 'all'
                      ? `全部 (${data.trophies.length})`
                      : f === 'earned'
                        ? `已获得 (${data.trophies.filter((t) => t.earned).length})`
                        : `未获得 (${data.trophies.filter((t) => !t.earned).length})`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => <TrophyCard trophy={item} />}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            暂无奖杯
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: {
    padding: Spacing.lg,
  },
  header: {
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  thumbnail: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  platforms: {
    flexDirection: 'row',
    gap: 6,
    marginTop: Spacing.sm,
  },
  platformBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  platformText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: Spacing.md,
  },
  completionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    width: '100%',
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: FontSize.md,
  },
});
