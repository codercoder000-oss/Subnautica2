---
title: 基地电力完整指南
description: Solar Panel vs Hydroelectric Turbine：配方、放置、电力管理
order: 12
chapter: 基地建设
prerequisites: [01-first-hour]
spoilerLevel: none
estimatedTime: 15 分钟
gameVersion: EA 1.0
verifiedAt: 2026-05-18
---

## 电力系统基础

屏幕左上角有两个条：
- **蓝条**：当前产电量
- **红条**：当前耗电量

**红条超过蓝条 = 系统崩溃**，所有设施停止工作。

## 发电方式对比

| 发电器 | 配方 | 产电量 | 优缺点 |
|--------|------|--------|--------|
| Solar Panel | 钛 ×1 + 石英 ×2 | 1-8/秒 | 便宜但夜间减半 |
| Hydroelectric Turbine | 需要蓝图 | ~16/秒 | 强力但需要水流 |
| Bioreactor | 需要蓝图 | 持续 | 需要有机燃料 |

## Solar Panel（太阳能板）

### 配方
- 钛 ×1 + 石英 ×2
- 在 Exterior → Energy 分类下

### 放置
- 放在基地**屋顶**或附近
- 越浅越好（深海无效）
- 白天满功率，夜间减半

### 数量建议
- 最小基地（制造机+储物）：2-3 块
- 中型基地（+Processor+Scanner）：5-6 块
- 大型基地：考虑换 Hydroelectric

### 常见错误
❌ 只放 1 块 → 开制造机就断电
❌ 放太深 → 产电量极低
❌ 夜间开所有设施 → 崩溃

## Hydroelectric Turbine（水力涡轮）

### 关键条件
必须放在**水流强的地方**。

如何识别水流：
- 看到水中有**波浪状隧道**（wavy wind tunnels）
- 游进去会被拉着走
- 这些位置就是放涡轮的地方

### 优势
- 产电量是 Solar 的 **2 倍**
- **不受昼夜影响**
- 一旦放好就是永久稳定电源

### 劣势
- 需要蓝图（不是初始解锁）
- 必须在水流位置（不能随便放）
- 可能需要 Power Transmitter 传输电力到基地

## Power Transmitter（电力传输器）

如果涡轮离基地远，需要用 Power Transmitter 连接：
- 放置在涡轮和基地之间
- 自动连接形成电力网络

## 电力管理建议

### 前期（Solar 阶段）
1. 基地建在浅海（50 米内）
2. 放 3 块 Solar Panel
3. 不要同时开所有设施
4. 夜间只保留必要设备

### 中期（Hydro 阶段）
1. 找到水流位置
2. 放 1-2 个 Hydroelectric Turbine
3. 用 Power Transmitter 连接
4. 从此电力无忧

### 后期
- Bioreactor 补充
- 多基地分布式电力
