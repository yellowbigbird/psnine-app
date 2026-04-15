import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useSettings } from '../../hooks/useSettings';
import { Spacing, FontSize } from '../../constants/theme';

export default function SettingsScreen() {
  const { psnId, setPsnId, darkMode, toggleDarkMode, colors } = useSettings();
  const [newId, setNewId] = useState(psnId);
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const handleSave = () => {
    const trimmed = newId.trim();
    if (trimmed && trimmed !== psnId) {
      setPsnId(trimmed);
      queryClient.invalidateQueries();
      Alert.alert('已保存', `PSN ID 已更改为 ${trimmed}`);
    }
  };

  const handleClearCache = () => {
    queryClient.clear();
    Alert.alert('完成', '缓存已清除');
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>设置</Text>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <Text style={[styles.label, { color: colors.text }]}>PSN ID</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            value={newId}
            onChangeText={setNewId}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="输入你的 PSN ID"
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Text style={styles.saveBtnText}>保存</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>深色模式</Text>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={handleClearCache}>
          <Text style={[styles.label, { color: colors.accent }]}>
            清除缓存
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.version, { color: colors.textSecondary }]}>
        PSNine App v{Constants.expoConfig?.version ?? '0.0.0'}
      </Text>
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
  section: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    padding: Spacing.lg,
    borderRadius: 12,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    fontSize: FontSize.md,
  },
  saveBtn: {
    height: 42,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    marginTop: Spacing.xxl,
    fontSize: FontSize.sm,
  },
});
