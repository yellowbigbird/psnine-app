import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import type { Trophy } from '../lib/types';
import { useSettings } from '../hooks/useSettings';
import { Spacing, FontSize } from '../constants/theme';

interface Props {
  trophy: Trophy;
}

const typeColors: Record<Trophy['type'], string> = {
  platinum: '#a8b8d8',
  gold: '#ffd700',
  silver: '#c0c0c0',
  bronze: '#cd7f32',
};

export function TrophyCard({ trophy }: Props) {
  const { colors } = useSettings();
  const router = useRouter();

  const handlePress = () => {
    // Extract trophy ID from URL like https://www.psnine.com/trophy/26546001
    const match = trophy.url?.match(/\/trophy\/(\d+)/);
    if (match) {
      router.push(`/trophy/${match[1]}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={!trophy.url}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          opacity: trophy.earned ? 1 : 0.5,
        },
      ]}
    >
      <Image source={{ uri: trophy.iconUrl }} style={styles.icon} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View
            style={[
              styles.typeDot,
              { backgroundColor: typeColors[trophy.type] },
            ]}
          />
          <Text
            style={[styles.name, { color: colors.text }]}
            numberOfLines={1}
          >
            {trophy.name}
          </Text>
        </View>
        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {trophy.description}
        </Text>
      </View>
      <View style={styles.rarityColumn}>
        <Text style={[styles.rarityPct, { color: colors.text }]}>
          {trophy.rarity}%
        </Text>
        <Text style={[styles.rarityLabel, { color: colors.textSecondary }]}>
          {trophy.rarityLabel}
        </Text>
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
    alignItems: 'center',
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 6,
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
  typeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: '600',
    flexShrink: 1,
  },
  description: {
    fontSize: FontSize.sm,
    marginTop: 3,
    lineHeight: 18,
  },
  rarityColumn: {
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
  },
  rarityPct: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  rarityLabel: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
});
