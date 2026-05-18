// 站点常量集中管理
export const SITE = {
  // 官方简体中文名（Steam）
  title: 'Subnautica 2 异星水域 攻略站',
  titleEn: 'Subnautica 2 Guide',
  description: 'Subnautica 2 异星水域中文攻略：互动地图、生物图鉴（含 Biomod 特性）、蓝图配方、Pioneer 主线、阿里阿德涅之臂区域指南',
  domain: 'subnautica2-guide.com',
  author: 'Subnautica 2 Guide Team',
  // 当前游戏版本，每次游戏更新就改这里，全站自动跟着变
  gameVersion: 'EA 0.1.0',
  gameVersionDate: '2026-05-14',
  // Fan-made 声明
  disclaimer: 'Fan-made guide site, not affiliated with Unknown Worlds Entertainment. SUBNAUTICA and UNKNOWNWORLDS are trademarks of Unknown Worlds Entertainment, Inc. All game assets © Unknown Worlds Entertainment.',
  // 游戏世界观关键词（贯穿首页、关于页）
  lore: {
    company: '阿尔特拉公司',     // Alterra
    companyEn: 'Alterra',
    ship: '鸣蝉号',              // CICADA
    shipEn: 'CICADA',
    pioneer: '拓荒人员',          // Pioneer
    galaxy: '阿里阿德涅之臂',     // Ariadne Arm
    galaxyEn: 'Ariadne Arm',
  },
} as const;

// 主导航
export const NAV = [
  { href: '/', label: '首页' },
  { href: '/map/', label: '互动地图' },
  { href: '/creatures/', label: '生物图鉴' },
  { href: '/biomods/', label: 'Biomod 特性' },
  { href: '/items/', label: '物品蓝图' },
  { href: '/biomes/', label: '区域 / 群落' },
  { href: '/vehicles/', label: '载具' },
  { href: '/guides/', label: '主线流程' },
  { href: '/tools/calculator/', label: '配方计算器' },
  { href: '/changelog/', label: '版本日志' },
] as const;

// 二代生态角色分类（官方使用）
export const ROLE = {
  predator: { label: '掠食者', desc: '主动追击玩家的肉食生物', color: 'aggression-aggressive' },
  leviathan: { label: '利维坦', desc: '顶级掠食者，体型巨大且不可击杀', color: 'aggression-lethal' },
  carnivore: { label: '食肉动物', desc: '中等体型机会主义者', color: 'aggression-cautious' },
  herbivore: { label: '食草动物', desc: '一般温和，被逼急才反击', color: 'aggression-passive' },
  passive: { label: '被动生物', desc: '一见玩家就逃跑', color: 'aggression-passive' },
  other: { label: '其他', desc: '难以归类的特殊生物', color: '' },
} as const;

// 攻击性等级定义（保留，给筛选用）
export const AGGRESSION = {
  passive: { label: '被动', color: 'aggression-passive', desc: '不会主动攻击玩家' },
  cautious: { label: '警戒', color: 'aggression-cautious', desc: '受刺激才反击' },
  aggressive: { label: '主动', color: 'aggression-aggressive', desc: '靠近会主动攻击' },
  lethal: { label: '致命', color: 'aggression-lethal', desc: '高威胁，谨慎接近' },
} as const;

// 恐惧症标签
export const PHOBIA_TAGS = {
  large: '大型生物',
  jumpscare: 'Jump Scare',
  enclosed: '幽闭空间',
  deepdark: '深渊黑暗',
  swarm: '群居恐惧',
  void: '虚空开阔水域',
} as const;

// 二代核心提示
export const KEY_FACTS = {
  // 利维坦不可击杀
  leviathansInvulnerable: '本作所有利维坦级生物均不可击杀，这是开发组明确的设计选择。遭遇时只能扫描、规避或逃跑。',
  // DNA / Biomod 系统
  biomodSystem: 'Biomod 是本作核心新机制，扫描生物可获得其特性应用到拓荒人员身上，替代了一代的升级模块。',
  // 多人
  multiplayer: '支持 1-4 人合作，PC × Xbox 跨平台。',
} as const;
