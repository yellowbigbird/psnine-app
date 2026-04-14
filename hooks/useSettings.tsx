import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, type ThemeColors } from '../constants/theme';

interface Settings {
  psnId: string;
  darkMode: boolean;
  colors: ThemeColors;
  setPsnId: (id: string) => void;
  toggleDarkMode: () => void;
}

const SettingsContext = createContext<Settings>({
  psnId: 'yellowbigbird-ps',
  darkMode: true,
  colors: Colors.dark,
  setPsnId: () => {},
  toggleDarkMode: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [psnId, setPsnIdState] = useState('yellowbigbird-ps');
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('psnId').then((v) => v && setPsnIdState(v));
    AsyncStorage.getItem('darkMode').then(
      (v) => v !== null && setDarkMode(v === 'true')
    );
  }, []);

  const setPsnId = (id: string) => {
    setPsnIdState(id);
    AsyncStorage.setItem('psnId', id);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      AsyncStorage.setItem('darkMode', (!prev).toString());
      return !prev;
    });
  };

  const colors = darkMode ? Colors.dark : Colors.light;

  return (
    <SettingsContext.Provider
      value={{ psnId, darkMode, colors, setPsnId, toggleDarkMode }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
