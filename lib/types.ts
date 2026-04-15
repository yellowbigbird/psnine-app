export interface UserProfile {
  psnId: string;
  avatarUrl: string;
  level: number;
  levelProgress: number;
  rank: number;
  isPlus: boolean;
  trophies: {
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
    total: number;
  };
  totalGames: number;
  perfectGames: number;
  abandonedGames: number;
  completionRate: number;
  recentGames: GameItem[];
}

export interface GameItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  platform: string[];
  lastPlayed: string;
  playtime?: string;
  difficulty?: string;
  completionRate: number;
  perfectRate?: string;
  trophies: {
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
  };
  earnedTrophies: number;
  totalTrophies: number;
}

export interface GameListResult {
  games: GameItem[];
  currentPage: number;
  totalPages: number;
  totalGames: number;
}

export interface Trophy {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  type: 'platinum' | 'gold' | 'silver' | 'bronze';
  rarity: number;
  rarityLabel: string;
  earned: boolean;
  earnedDate?: string;
  url?: string;
}

export interface GameDetail {
  id: string;
  title: string;
  thumbnailUrl: string;
  platform: string[];
  trophySummary: {
    platinum: number;
    gold: number;
    silver: number;
    bronze: number;
    total: number;
  };
  completionRate: number;
  difficulty?: string;
  trophies: Trophy[];
  dlcSections?: { name: string; trophies: Trophy[] }[];
}

export interface TrophyTip {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  location?: string;
}

export interface TrophyDetail {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  type: Trophy['type'];
  gameName: string;
  gameId: string;
  gameThumbnailUrl: string;
  platform: string[];
  tips: TrophyTip[];
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  location?: string;
  replies?: Comment[];
}

export interface SearchResult {
  psnId: string;
  avatarUrl: string;
  level: number;
  trophyCount: number;
}

export type PlatformFilter = 'all' | 'ps5' | 'ps4' | 'ps3' | 'psvita';
export type SortOrder = 'date' | 'ratio' | 'slow' | 'difficulty';
export type DlcFilter = 'all' | 'dlc' | 'nodlc';
