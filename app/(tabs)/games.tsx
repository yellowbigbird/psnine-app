import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameList } from '../../hooks/useGameList';
import { useSettings } from '../../hooks/useSettings';
import { GameCard } from '../../components/GameCard';
import { FilterBar } from '../../components/FilterBar';
import { Loading, ErrorView } from '../../components/Loading';
import type { PlatformFilter, SortOrder, DlcFilter } from '../../lib/types';
import { Spacing, FontSize } from '../../constants/theme';

const platformOptions = [
  { label: '全部', value: 'all' as PlatformFilter },
  { label: 'PS5', value: 'ps5' as PlatformFilter },
  { label: 'PS4', value: 'ps4' as PlatformFilter },
  { label: 'PS3', value: 'ps3' as PlatformFilter },
  { label: 'PSV', value: 'psvita' as PlatformFilter },
];

const sortOptions = [
  { label: '最新', value: 'date' as SortOrder },
  { label: '进度最快', value: 'ratio' as SortOrder },
  { label: '进度最慢', value: 'slow' as SortOrder },
  { label: '完美难度', value: 'difficulty' as SortOrder },
];

export default function GamesScreen() {
  const { psnId, colors } = useSettings();
  const insets = useSafeAreaInsets();
  const [platform, setPlatform] = useState<PlatformFilter>('all');
  const [sort, setSort] = useState<SortOrder>('date');
  const [dlc, setDlc] = useState<DlcFilter>('all');
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');

  const {
    data,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGameList({ psnId, platform, sort, dlc, title });

  const games = data?.pages.flatMap((p) => p.games) ?? [];
  const totalGames = data?.pages[0]?.totalGames ?? 0;

  const handleSearch = () => {
    setTitle(query.trim());
  };

  const handleClearSearch = () => {
    setQuery('');
    setTitle('');
  };

  if (isLoading) return <Loading text="加载游戏中..." />;
  if (error)
    return (
      <ErrorView message={error.message} onRetry={() => refetch()} />
    );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={games}
        keyExtractor={(item, i) => `${item.id}-${i}`}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <View style={{ paddingTop: insets.top }}>
            <Text style={[styles.title, { color: colors.text }]}>
              游戏 ({totalGames})
            </Text>
            <View style={styles.searchRow}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="搜索单个游戏..."
                placeholderTextColor={colors.textSecondary}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
              />
              <TouchableOpacity
                style={[styles.searchBtn, { backgroundColor: colors.primary }]}
                onPress={handleSearch}
              >
                <Text style={styles.searchBtnText}>搜索</Text>
              </TouchableOpacity>
              {title ? (
                <TouchableOpacity
                  style={[styles.clearBtn, { borderColor: colors.border }]}
                  onPress={handleClearSearch}
                >
                  <Text
                    style={[styles.clearBtnText, { color: colors.textSecondary }]}
                  >
                    清空
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
            {title ? (
              <Text style={[styles.searchHint, { color: colors.textSecondary }]}>
                当前搜索：{title}
              </Text>
            ) : null}
            <FilterBar
              options={platformOptions}
              selected={platform}
              onSelect={setPlatform}
            />
            <FilterBar
              options={sortOptions}
              selected={sort}
              onSelect={setSort}
            />
          </View>
        }
        renderItem={({ item }) => <GameCard game={item} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <Text style={[styles.loadingMore, { color: colors.textSecondary }]}>
              加载更多...
            </Text>
          ) : null
        }
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            {title ? '未找到匹配的游戏' : '暂无游戏'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginLeft: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    fontSize: FontSize.md,
  },
  searchBtn: {
    height: 44,
    paddingHorizontal: Spacing.lg,
    borderRadius: 10,
    justifyContent: 'center',
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: FontSize.md,
  },
  clearBtn: {
    height: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: 10,
    justifyContent: 'center',
    borderWidth: 1,
  },
  clearBtnText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  searchHint: {
    marginLeft: Spacing.lg,
    marginBottom: Spacing.xs,
    fontSize: FontSize.sm,
  },
  loadingMore: {
    textAlign: 'center',
    padding: Spacing.lg,
    fontSize: FontSize.sm,
  },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: FontSize.md,
  },
});
