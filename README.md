# PSNine App

PSNine (psnine.com) 的非官方移动客户端，支持 Android 和 iPhone，使用 React Native + Expo 构建。

## Features

- **Profile** - 显示头像、PSN ID、等级、排名、奖杯数（白金/金/银/铜）、总游戏数、完美数、完成率
- **Game List** - 无限滚动分页（支持 1200+ 游戏），支持筛选：
  - 平台：All / PS5 / PS4 / PS3 / PSVita
  - 排序：日期 / 完成率 / 游戏时长 / 难度
  - DLC 过滤
- **Game Detail** - 奖杯列表，含图标、名称、描述、稀有度百分比，支持已获得/未获得筛选
- **User Search** - 搜索任意 PSN ID，查看其 Profile 和游戏
- **Message Board** - 留言板，显示评论、头像、时间、地区、嵌套回复
- **Settings** - 切换 PSN ID、深色/浅色主题切换、清除缓存
- **Dark Mode** - 默认深色主题，PlayStation 风格配色

## Tech Stack

| 技术 | 用途 |
|---|---|
| React Native + Expo (SDK 54) | 跨平台框架，一套代码同时运行 Android 和 iOS |
| Expo Router | 文件路由导航 |
| Cheerio | HTML 解析，抓取 PSNine 页面数据 |
| React Query (@tanstack/react-query) | 数据请求、缓存、无限分页 |
| AsyncStorage | 本地持久化（PSN ID、主题偏好） |
| TypeScript | 类型安全 |

## Project Structure

```
psnine-app/
├── app/                          # Expo Router 页面
│   ├── _layout.tsx               # 根布局（QueryClient + Settings Provider）
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab 栏配置（Profile/Games/Search/Settings）
│   │   ├── index.tsx             # 首页 - 个人资料
│   │   ├── games.tsx             # 游戏列表（筛选 + 无限滚动）
│   │   ├── search.tsx            # 搜索用户
│   │   └── settings.tsx          # 设置页
│   ├── game/[id].tsx             # 游戏详情 - 奖杯列表
│   ├── profile/[username].tsx    # 其他用户资料页
│   └── comments/[username].tsx   # 留言板
├── lib/
│   ├── scraper.ts                # HTML 抓取 + Cheerio 加载
│   ├── parsers/
│   │   ├── profile.ts            # 解析个人资料页
│   │   ├── gameList.ts           # 解析游戏列表页
│   │   ├── gameDetail.ts         # 解析游戏/奖杯详情
│   │   ├── comments.ts           # 解析留言板
│   │   └── search.ts             # 解析搜索结果
│   └── types.ts                  # TypeScript 类型定义
├── components/
│   ├── ProfileHeader.tsx         # 个人资料头部（头像、等级、奖杯统计）
│   ├── GameCard.tsx              # 游戏列表项（缩略图、进度条、奖杯）
│   ├── TrophyCard.tsx            # 奖杯卡片（图标、稀有度、描述）
│   ├── FilterBar.tsx             # 筛选栏（平台/排序 chip 选择器）
│   └── Loading.tsx               # Loading / Error 状态组件
├── hooks/
│   ├── useProfile.ts             # Profile 数据 Hook
│   ├── useGameList.ts            # 分页游戏列表 Hook
│   ├── useGameDetail.ts          # 游戏奖杯详情 Hook
│   └── useSettings.tsx           # Settings Context（PSN ID、主题）
└── constants/
    └── theme.ts                  # 颜色、间距、字号
```

## Getting Started

### Prerequisites

- Node.js >= 18
- 手机安装 [Expo Go](https://expo.dev/client)（iOS App Store / Android Play Store）

### Run

```bash
cd psnine-app
npm start
```

启动后：
- **iPhone** - 用 Expo Go 扫描终端中的 QR 码
- **Android** - 用 Expo Go 扫描终端中的 QR 码
- **iOS 模拟器** - 按 `i`
- **Android 模拟器** - 按 `a`

### Build Mobile Artifacts

```bash
# 安装 EAS CLI
npm install -g eas-cli

# 安装依赖
npm install

# 本地构建 Android APK（不消耗 EAS 云端配额）
eas build --platform android --profile production --local --output ./build.apk
```

Android 本地构建需要已安装 Java 17+ 和 Android SDK。

当前仓库发布流程只启用了 Android APK。iOS 构建步骤已在 CI 中暂时注释，等 Apple Developer 签名条件满足后再恢复。

### CI/CD

- **PR → main**: 自动运行 TypeScript 类型检查 + Expo 编译验证
- **Push tag**: 自动本地构建 Android APK 并上传到 GitHub Release Assets

发布新版本：

```bash
git tag 0.0.8
git push origin 0.0.8
```

然后在 GitHub 创建 Release 选择对应 tag，CI 会自动构建 APK 并附加到 Release 页面。

## Notes

- PSNine 没有公开 API，应用通过抓取 HTML 页面获取数据
- 解析器位于 `lib/parsers/`，每个页面类型独立，如果网站改版只需更新对应解析器
- 默认 PSN ID 为 `yellowbigbird-ps`，可在 Settings 页修改
- React Query 缓存 5-10 分钟，避免重复请求
