import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import type { UserProfile } from '../lib/types';
import { useSettings } from '../hooks/useSettings';
import { Spacing, FontSize } from '../constants/theme';

interface Props {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: Props) {
  const { colors } = useSettings();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.topRow}>
        <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={[styles.name, { color: colors.text }]}>
              {profile.psnId}
            </Text>
            {profile.isPlus && (
              <View style={[styles.plusBadge, { backgroundColor: colors.gold }]}>
                <Text style={styles.plusText}>PS+</Text>
              </View>
            )}
          </View>
          <Text style={[styles.level, { color: colors.textSecondary }]}>
            Lv {profile.level} ({profile.levelProgress}%){'  '}
            #{profile.rank}
          </Text>
        </View>
      </View>

      <View style={styles.trophyRow}>
        <TrophyBadge
          label="P"
          count={profile.trophies.platinum}
          color={colors.platinum}
          bgColor={colors.card}
        />
        <TrophyBadge
          label="G"
          count={profile.trophies.gold}
          color={colors.gold}
          bgColor={colors.card}
        />
        <TrophyBadge
          label="S"
          count={profile.trophies.silver}
          color={colors.silver}
          bgColor={colors.card}
        />
        <TrophyBadge
          label="B"
          count={profile.trophies.bronze}
          color={colors.bronze}
          bgColor={colors.card}
        />
      </View>

      <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
        <StatItem label="总游戏" value={profile.totalGames.toString()} color={colors} />
        <StatItem label="完美" value={profile.perfectGames.toString()} color={colors} />
        <StatItem label="完成率" value={`${profile.completionRate}%`} color={colors} />
        <StatItem label="奖杯" value={profile.trophies.total.toString()} color={colors} />
      </View>
    </View>
  );
}

function TrophyBadge({
  label,
  count,
  color,
  bgColor,
}: {
  label: string;
  count: number;
  color: string;
  bgColor: string;
}) {
  return (
    <View style={[styles.trophyBadge, { backgroundColor: bgColor }]}>
      <Text style={[styles.trophyLabel, { color }]}>{label}</Text>
      <Text style={[styles.trophyCount, { color }]}>{count}</Text>
    </View>
  );
}

function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: any;
}) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: color.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: color.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  info: {
    marginLeft: Spacing.lg,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  plusBadge: {
    marginLeft: Spacing.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  plusText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: '#000',
  },
  level: {
    fontSize: FontSize.sm,
    marginTop: 4,
  },
  trophyRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.lg,
  },
  trophyBadge: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    minWidth: 70,
  },
  trophyLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  trophyCount: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
});
