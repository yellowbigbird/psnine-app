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
import { useQuery } from '@tanstack/react-query';
import { fetchPage } from '../../lib/scraper';
import { parseComments } from '../../lib/parsers/comments';
import { useSettings } from '../../hooks/useSettings';
import { Loading, ErrorView } from '../../components/Loading';
import { Spacing, FontSize } from '../../constants/theme';
import type { Comment } from '../../lib/types';

export default function CommentsScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const { colors } = useSettings();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['comments', username],
    queryFn: async () => {
      const $ = await fetchPage(`/psnid/${username}/comment`);
      return parseComments($);
    },
    enabled: !!username,
  });

  if (isLoading) return <Loading text="加载留言中..." />;
  if (error)
    return <ErrorView message={error.message} onRetry={refetch} />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data || []}
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
            <Text style={[styles.title, { color: colors.text }]}>
              留言板 - {username}
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <CommentCard comment={item} colors={colors} />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.textSecondary }]}>
            暂无留言
          </Text>
        }
      />
    </View>
  );
}

function CommentCard({
  comment,
  colors,
}: {
  comment: Comment;
  colors: any;
}) {
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        {comment.authorAvatar ? (
          <Image
            source={{ uri: comment.authorAvatar }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.border }]} />
        )}
        <View style={styles.headerInfo}>
          <Text style={[styles.authorName, { color: colors.primary }]}>
            {comment.authorName}
          </Text>
          <View style={styles.metaRow}>
            {comment.timestamp ? (
              <Text style={{ color: colors.textSecondary, fontSize: FontSize.xs }}>
                {comment.timestamp}
              </Text>
            ) : null}
            {comment.location ? (
              <Text style={{ color: colors.textSecondary, fontSize: FontSize.xs }}>
                {' '}{comment.location}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      <Text style={[styles.content, { color: colors.text }]}>
        {comment.content}
      </Text>

      {comment.replies?.map((reply) => (
        <View
          key={reply.id}
          style={[styles.reply, { borderLeftColor: colors.border }]}
        >
          <Text style={[styles.replyAuthor, { color: colors.primary }]}>
            {reply.authorName}
          </Text>
          <Text style={{ color: colors.text, fontSize: FontSize.sm }}>
            {reply.content}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { padding: Spacing.lg },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginLeft: Spacing.lg,
    marginBottom: Spacing.md,
  },
  card: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xs,
    padding: Spacing.lg,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  authorName: {
    fontWeight: '600',
    fontSize: FontSize.md,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  content: {
    marginTop: Spacing.md,
    fontSize: FontSize.md,
    lineHeight: 22,
  },
  reply: {
    marginTop: Spacing.md,
    paddingLeft: Spacing.md,
    borderLeftWidth: 2,
  },
  replyAuthor: {
    fontWeight: '600',
    fontSize: FontSize.sm,
    marginBottom: 4,
  },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: FontSize.md,
  },
});
