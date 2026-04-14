import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import type { GameItem } from '../lib/types';
import { useSettings } from '../hooks/useSettings';
import { Spacing, FontSize } from '../constants/theme';

interface Props {
  game: GameItem;
}

export function GameCard({ game }: Props) {
  const { colors, psnId } = useSettings();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: '/game/[id]',
          params: { id: game.id, psnId },
        })
      }
    >
      <Image source={{ uri: game.thumbnailUrl }} style={styles.thumbnail} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {game.title}
          </Text>
          {game.platform.map((p) => (
            <View
              key={p}
              style={[styles.platformBadge, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.platformText}>{p}</Text>
            </View>
          ))}
        </View>

        <View style={styles.progressRow}>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${Math.min(game.completionRate, 100)}%`,
                },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.textSecondary }]}>
            {game.completionRate}%
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.trophyRow}>
            <Text style={[styles.trophyText, { color: colors.platinum }]}>
              {game.trophies.platinum}
            </Text>
            <Text style={[styles.trophyText, { color: colors.gold }]}>
              {game.trophies.gold}
            </Text>
            <Text style={[styles.trophyText, { color: colors.silver }]}>
              {game.trophies.silver}
            </Text>
            <Text style={[styles.trophyText, { color: colors.bronze }]}>
              {game.trophies.bronze}
            </Text>
          </View>
          <View style={styles.metaRow}>
            {game.difficulty && (
              <Text style={[styles.meta, { color: colors.accent }]}>
                {game.difficulty}
              </Text>
            )}
            {game.lastPlayed ? (
              <Text style={[styles.meta, { color: colors.textSecondary }]}>
                {game.lastPlayed.slice(0, 10)}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xs,
    borderRadius: 10,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: '600',
    flexShrink: 1,
  },
  platformBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  platformText: {
    color: '#fff',
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: FontSize.xs,
    minWidth: 36,
    textAlign: 'right',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  trophyRow: {
    flexDirection: 'row',
    gap: 10,
  },
  trophyText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  meta: {
    fontSize: FontSize.xs,
  },
});
