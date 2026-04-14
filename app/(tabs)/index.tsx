import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfile } from '../../hooks/useProfile';
import { useSettings } from '../../hooks/useSettings';
import { ProfileHeader } from '../../components/ProfileHeader';
import { GameCard } from '../../components/GameCard';
import { Loading, ErrorView } from '../../components/Loading';
import { Spacing, FontSize } from '../../constants/theme';

export default function ProfileScreen() {
  const { psnId, colors } = useSettings();
  const { data, isLoading, error, refetch, isRefetching } = useProfile(psnId);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (isLoading) return <Loading text="加载主页中..." />;
  if (error || !data)
    return (
      <ErrorView
        message={error?.message || '加载主页失败'}
        onRetry={refetch}
      />
    );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data.recentGames}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <>
            <ProfileHeader profile={data} />
            <View style={styles.sectionHeader}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/comments/[username]',
                    params: { username: psnId },
                  })
                }
                style={[styles.messageBtn, { backgroundColor: colors.card }]}
              >
                <Text style={{ color: colors.primary, fontWeight: '600' }}>
                  留言板
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              最近游戏
            </Text>
          </>
        }
        renderItem={({ item }) => <GameCard game={item} />}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            暂无最近游戏
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  messageBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginLeft: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: FontSize.md,
  },
});
