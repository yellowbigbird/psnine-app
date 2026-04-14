import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSettings } from '../hooks/useSettings';
import { Spacing, FontSize } from '../constants/theme';

interface FilterOption<T> {
  label: string;
  value: T;
}

interface Props<T> {
  options: FilterOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

export function FilterBar<T extends string>({
  options,
  selected,
  onSelect,
}: Props<T>) {
  const { colors } = useSettings();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map((opt) => {
        const isActive = opt.value === selected;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? colors.primary : colors.card,
                borderColor: isActive ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onSelect(opt.value)}
          >
            <Text
              style={[
                styles.chipText,
                { color: isActive ? '#fff' : colors.textSecondary },
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});
