import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { fetchPage } from '../../lib/scraper';
import { parseProfile } from '../../lib/parsers/profile';
import { useSettings } from '../../hooks/useSettings';
import { Loading, ErrorView } from '../../components/Loading';
import { Spacing, FontSize } from '../../constants/theme';

export default function SearchScreen() {
  const { colors } = useSettings();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [searchId, setSearchId] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['searchUser', searchId],
    queryFn: async () => {
      const $ = await fetchPage(`/psnid/${searchId}`);
      return parseProfile($);
    },
    enabled: !!searchId,
    retry: false,
  });

  const handleSearch = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed) setSearchId(trimmed);
  }, [query]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>搜索用户</Text>
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
          placeholder="输入 PSN ID..."
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
      </View>

      {isLoading && <Loading text="搜索中..." />}
      {error && !isLoading && (
        <View style={styles.resultCenter}>
          <Text style={{ color: colors.accent, fontSize: FontSize.md }}>
            未找到用户
          </Text>
        </View>
      )}
      {data && !isLoading && (
        <TouchableOpacity
          style={[styles.resultCard, { backgroundColor: colors.surface }]}
          onPress={() =>
            router.push({
              pathname: '/profile/[username]',
              params: { username: data.psnId },
            })
          }
        >
          <Image source={{ uri: data.avatarUrl }} style={styles.avatar} />
          <View style={styles.resultInfo}>
            <Text style={[styles.resultName, { color: colors.text }]}>
              {data.psnId}
            </Text>
            <Text style={{ color: colors.textSecondary }}>
              Lv {data.level} | {data.trophies.total} 奖杯 |{' '}
              {data.totalGames} 游戏
            </Text>
            <View style={styles.trophyMini}>
              <Text style={{ color: colors.platinum, fontWeight: '600' }}>
                P{data.trophies.platinum}
              </Text>
              <Text style={{ color: colors.gold, fontWeight: '600' }}>
                {' '}G{data.trophies.gold}
              </Text>
              <Text style={{ color: colors.silver, fontWeight: '600' }}>
                {' '}S{data.trophies.silver}
              </Text>
              <Text style={{ color: colors.bronze, fontWeight: '600' }}>
                {' '}B{data.trophies.bronze}
              </Text>
            </View>
          </View>
          <Text style={{ color: colors.primary, fontSize: 20 }}>{'>'}</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: Spacing.lg,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
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
  resultCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  resultInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  resultName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginBottom: 4,
  },
  trophyMini: {
    flexDirection: 'row',
    marginTop: 4,
  },
});
