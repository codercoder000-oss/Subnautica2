---
title: 资源系统详解（Raw Ore 机制）
description: 二代资源获取完全不同于一代：Raw Ore 节点、Metal Salvage、有机材料
order: 6
chapter: 核心机制
prerequisites: []
spoilerLevel: none
estimatedTime: 阅读 5 分钟
gameVersion: EA 1.0
verifiedAt: 2026-05-18
---

## 二代资源系统 vs 一代

| 一代 | 二代 |
|------|------|
| 独立矿种（石灰岩→钛、铜矿→铜） | Raw Ore 节点 → 制造机随机分解 |
| 到处都是独立矿石 | 矿石节点集中在洞穴 |
| 海带种子、珊瑚样本等 | 新的有机材料体系 |

## Raw Ore 节点

这是二代最核心的资源机制：

1. 在海底找到 **Raw Ore**（灰色矿石节点）
2. 带回基地放进 **Fabricator（制造机）**
3. 制造机**随机**分解为：**钛** / **铜** / **石英**

### 哪里 Raw Ore 最多？

- **洞穴**：密度最高，优先探索
- **Coral Gardens 深处**：浅海洞穴入口
- **Star Zone**：中层区域矿脉丰富

### 效率技巧

- 一次出门带满背包 Raw Ore 回来批量分解
- 不要在外面一个个敲，效率太低
- 洞穴 > 海底表面 > 悬崖壁

## Metal Salvage（金属碎片）

- CICADA 残骸区域大量散落
- 制造机直接转化为 **Salvaged Titanium**
- 前期钛的最快来源

## 稀有资源

| 资源 | 位置 | 用途 |
|------|------|------|
| Gold | 深层洞穴、Karakorum | 高级电子 |
| Lead | 中深海矿脉 | 辐射防护 |
| Conduit Crystal | Karakorum | 电力系统 |
| Aeroshell Sponge | Star Zone | 高级合成 |
| Mineralized Clinker | 深海 | 高级合成 |

## 有机材料

| 材料 | 来源 | 用途 |
|------|------|------|
| Acid Mushroom | Coral Gardens 紫色蘑菇 | Mild Acid → 电池 |
| Cherimoya Rotsac | 深海植物 | 食物/合成 |
| Lucifer Rotsac | 发光植物 | 照明/合成 |
| Crab Feces | 螃蟹排泄物 | 生化燃料 |

## 常见误区

❌ 「我找不到铜矿」→ 二代没有独立铜矿，去挖 Raw Ore 分解
❌ 「石英在哪」→ 同上，Raw Ore 随机产出
❌ 「钛不够用」→ 优先捡 Metal Salvage，比挖矿快
