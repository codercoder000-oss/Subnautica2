// Subnautica 2 区域数据（基于社区公开信息）
// 地图半径约 2km，深度 0-596m，16 个 regions

export interface Region {
  id: string;
  name: string;
  nameZh: string;
  // 中心坐标（相对于地图中心，单位：米）
  cx: number;
  cz: number;
  // 大致半径
  radius: number;
  // 深度范围
  depthMin: number;
  depthMax: number;
  // 颜色（用于地图渲染）
  color: string;
  // 危险等级 1-5
  danger: number;
  // 描述
  desc: string;
}

export const regions: Region[] = [
  {
    id: 'shallows',
    name: 'Shallows',
    nameZh: '浅滩',
    cx: 0, cz: 0,
    radius: 300,
    depthMin: 0, depthMax: 80,
    color: '#4dd0e1',
    danger: 1,
    desc: '起始区域，安全，资源丰富',
  },
  {
    id: 'plateaus',
    name: 'Plateaus',
    nameZh: '台地',
    cx: 200, cz: -300,
    radius: 250,
    depthMin: 50, depthMax: 150,
    color: '#81c784',
    danger: 2,
    desc: '平坦台地，银矿洞穴入口',
  },
  {
    id: 'anemone-hills',
    name: 'Anemone Hills',
    nameZh: '海葵丘陵',
    cx: -400, cz: 200,
    radius: 280,
    depthMin: 30, depthMax: 120,
    color: '#f48fb1',
    danger: 2,
    desc: '海葵覆盖的丘陵地形',
  },
  {
    id: 'tufa-towers',
    name: 'Tufa Towers',
    nameZh: '石灰华塔',
    cx: 500, cz: 300,
    radius: 220,
    depthMin: 80, depthMax: 200,
    color: '#ffcc80',
    danger: 3,
    desc: '高耸的石灰华柱状结构',
  },
  {
    id: 'north-raceway',
    name: 'North Raceway',
    nameZh: '北部水道',
    cx: 100, cz: -600,
    radius: 200,
    depthMin: 60, depthMax: 180,
    color: '#90caf9',
    danger: 2,
    desc: '强水流区域，适合放 Hydroelectric Turbine',
  },
  {
    id: 'south-raceway',
    name: 'South Raceway',
    nameZh: '南部水道',
    cx: -100, cz: 600,
    radius: 200,
    depthMin: 60, depthMax: 180,
    color: '#80deea',
    danger: 2,
    desc: '南侧水流通道',
  },
  {
    id: 'blighted-coral',
    name: 'Blighted Coral',
    nameZh: '枯萎珊瑚',
    cx: -600, cz: -300,
    radius: 250,
    depthMin: 100, depthMax: 250,
    color: '#ce93d8',
    danger: 3,
    desc: 'Bloom 病毒感染区域，需要 Sonic Resonator 清除',
  },
  {
    id: 'leadzone',
    name: 'Leadzone',
    nameZh: '铅矿区',
    cx: 700, cz: -200,
    radius: 200,
    depthMin: 120, depthMax: 280,
    color: '#a1887f',
    danger: 3,
    desc: '铅矿主产区，CICADA 残骸散布',
  },
  {
    id: 'root-canyon',
    name: 'Root Canyon',
    nameZh: '根系峡谷',
    cx: -300, cz: -700,
    radius: 250,
    depthMin: 150, depthMax: 350,
    color: '#a5d6a7',
    danger: 4,
    desc: '巨大根系穿过的深海峡谷',
  },
  {
    id: 'graveyard',
    name: 'Graveyard',
    nameZh: '墓地',
    cx: 400, cz: 700,
    radius: 220,
    depthMin: 200, depthMax: 400,
    color: '#78909c',
    danger: 4,
    desc: '巨型生物骨骼散布的深海区域',
  },
  {
    id: 'observatory',
    name: 'Observatory',
    nameZh: '观测站',
    cx: -800, cz: 500,
    radius: 180,
    depthMin: 180, depthMax: 350,
    color: '#fff176',
    danger: 3,
    desc: '先驱者观测设施遗迹',
  },
  {
    id: 'power-plant',
    name: 'Power Plant',
    nameZh: '发电站',
    cx: 800, cz: 500,
    radius: 180,
    depthMin: 200, depthMax: 400,
    color: '#ffab40',
    danger: 4,
    desc: '地热能源设施，Thermal Plant 最佳位置',
  },
];

// POI 标记点（基于社区攻略已公开的坐标信息）
export interface POI {
  id: string;
  name: string;
  nameZh: string;
  category: 'lifepod' | 'blackbox' | 'supply-crate' | 'resource' | 'blueprint' | 'creature' | 'structure' | 'landmark';
  x: number;
  z: number;
  depth: number;
  region: string;
  desc?: string;
  link?: string;
}

export const pois: POI[] = [
  // Lifepod & 起始
  { id: 'lifepod', name: 'Lifepod', nameZh: '救生舱', category: 'lifepod', x: 0, z: 0, depth: -10, region: 'shallows', desc: '玩家起始位置' },
  { id: 'welcome-center', name: 'Welcome Center', nameZh: '欢迎中心', category: 'structure', x: 150, z: 100, depth: -30, region: 'shallows', desc: '解锁 Habitat Builder + Biolab', link: '/guides/01-first-hour/' },

  // Black Boxes
  { id: 'bb-anita', name: 'Anita Blackbox', nameZh: 'Anita 黑匣子', category: 'blackbox', x: 100, z: -150, depth: -40, region: 'shallows', desc: 'Angel Comb 附近' },
  { id: 'bb-wander', name: 'Wander Blackbox', nameZh: 'Wander 黑匣子', category: 'blackbox', x: -200, z: 100, depth: -50, region: 'shallows' },
  { id: 'bb-chap', name: 'Chap Blackbox', nameZh: 'Chap 黑匣子', category: 'blackbox', x: 50, z: 250, depth: -60, region: 'shallows' },
  { id: 'bb-zip', name: 'Zip Blackbox', nameZh: 'Zip 黑匣子（Tadpole 密码）', category: 'blackbox', x: 500, z: 200, depth: -310, region: 'tufa-towers', desc: 'Tadpole Pens 密码所在', link: '/guides/05-tadpole-pens-keycode/' },
  { id: 'bb-quaker', name: 'Quaker Signal', nameZh: 'Quaker 信号基地', category: 'blackbox', x: 0, z: -415, depth: -80, region: 'plateaus', desc: 'Sonic Resonator 碎片 1', link: '/guides/11-sonic-resonator/' },

  // 关键设施
  { id: 'tadpole-pens', name: 'Tadpole Pens', nameZh: 'Tadpole 船坞', category: 'structure', x: 690, z: 0, depth: -100, region: 'leadzone', desc: '解锁 Tadpole 载具', link: '/items/tadpole/' },
  { id: 'old-habitat', name: 'Old Habitat', nameZh: '旧栖息地', category: 'structure', x: 0, z: -380, depth: -90, region: 'plateaus', desc: '银矿洞穴 + Processor 蓝图', link: '/guides/09-silver-farming/' },

  // 资源点
  { id: 'silver-cave-1', name: 'Silver Cave (Jelly Lei)', nameZh: '银矿洞穴（水母）', category: 'resource', x: 0, z: -200, depth: -70, region: 'plateaus', desc: 'Lifepod 北方 200m，最近银矿', link: '/guides/09-silver-farming/' },
  { id: 'silver-cave-2', name: 'Silver Cave (Old Habitat)', nameZh: '银矿洞穴（旧栖息地）', category: 'resource', x: 0, z: -380, depth: -100, region: 'plateaus', desc: '100+ 银矿节点' },
  { id: 'lead-deposit', name: 'Lead Deposit', nameZh: '铅矿沉积', category: 'resource', x: 650, z: -150, depth: -150, region: 'leadzone', desc: 'CICADA Wreck 附近' },
  { id: 'gold-cave', name: 'Gold Cave', nameZh: '金矿洞穴', category: 'resource', x: -500, z: -400, depth: -200, region: 'blighted-coral' },
  { id: 'necrolei-field', name: 'Necrolei Field', nameZh: 'Necrolei 田（Strong Acid 原料）', category: 'resource', x: -250, z: -100, depth: -80, region: 'anemone-hills', desc: 'Lifepod 西北 300m' },

  // 生物
  { id: 'collector-patrol', name: 'Collector Leviathan', nameZh: '收集者利维坦巡逻区', category: 'creature', x: -700, z: -500, depth: -300, region: 'root-canyon', desc: '⚠️ 不可击杀', link: '/creatures/collector-leviathan/' },
  { id: 'void-leviathan', name: 'Void Leviathan', nameZh: '虚空利维坦（地图边界）', category: 'creature', x: -1200, z: 0, depth: -400, region: 'void', desc: '⚠️ 不要进入' },

  // 地标
  { id: 'angel-comb-1', name: 'Angel Comb (Digestion)', nameZh: 'Angel Comb（解锁消化）', category: 'landmark', x: 80, z: -100, depth: -30, region: 'shallows', desc: '解锁 Digestion Adaptation', link: '/guides/10-food-water-digestion/' },
  { id: 'hot-caves', name: 'Hot Caves', nameZh: '热洞穴', category: 'landmark', x: 400, z: 150, depth: -250, region: 'tufa-towers', desc: 'Zip Blackbox 所在洞穴系统' },
  { id: 'cicada-wreck', name: 'CICADA Wreck', nameZh: 'CICADA 残骸', category: 'structure', x: 650, z: -100, depth: -80, region: 'leadzone', desc: '大量 Metal Salvage + 蓝图' },

  // Supply Crates
  { id: 'crate-1', name: 'Supply Crate', nameZh: '补给箱', category: 'supply-crate', x: -100, z: -50, depth: -20, region: 'shallows' },
  { id: 'crate-2', name: 'Supply Crate', nameZh: '补给箱', category: 'supply-crate', x: 200, z: -100, depth: -40, region: 'shallows' },
  { id: 'crate-3', name: 'Supply Crate', nameZh: '补给箱', category: 'supply-crate', x: -300, z: 300, depth: -50, region: 'anemone-hills' },
  { id: 'crate-4', name: 'Supply Crate', nameZh: '补给箱', category: 'supply-crate', x: 400, z: -300, depth: -70, region: 'tufa-towers' },
];

// 过滤器类别
export const POI_CATEGORIES = {
  lifepod: { label: '救生舱', color: '#4dd0e1', icon: '🏠' },
  blackbox: { label: '黑匣子', color: '#ff8a65', icon: '📦' },
  'supply-crate': { label: '补给箱', color: '#fff176', icon: '📋' },
  resource: { label: '资源点', color: '#ffd54f', icon: '⛏️' },
  blueprint: { label: '蓝图', color: '#90caf9', icon: '📐' },
  creature: { label: '危险生物', color: '#ef5350', icon: '🦈' },
  structure: { label: '设施', color: '#ce93d8', icon: '🏗️' },
  landmark: { label: '地标', color: '#a5d6a7', icon: '📍' },
} as const;
