import React from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useProfile } from '../../hooks/useProfile';
import { useSettings } from '../../hooks/useSettings';
import { ProfileHeader } from '../../components/ProfileHeader';
import { GameCard } from '../../components/GameCard';
import { Loading, ErrorView } from '../../components/Loading';
import { Spacing, FontSize } from '../../constants/theme';

export default function OtherProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { colors } = useSettings();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data, isLoading, error, refetch } = useProfile(username);

  if (isLoading) return <Loading text={`加载 ${username} 中...`} />;
  if (error || !data)
    return (
      <ErrorView
        message={error?.message || '未找到用户'}
        onRetry={refetch}
      />
    );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data.recentGames}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 20 }}
        ListHeaderComponent={
          <>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Text style={{ color: colors.primary, fontSize: FontSize.md }}>
                {'< 返回'}
              </Text>
            </TouchableOpacity>
            <ProfileHeader profile={data} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              最近游戏
            </Text>
          </>
        }
        renderItem={({ item }) => <GameCard game={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { padding: Spacing.lg },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginLeft: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
});
