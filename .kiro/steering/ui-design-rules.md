---
inclusion: fileMatch
fileMatchPattern: "src/**/*.{astro,tsx,css}"
---

# UI 设计规范（基于行业最佳实践）

## 暗色模式 4 层表面层级

参考 Material You tonal elevation + Muzli dark mode guide。
暗色模式用**明度递进**表达层级，不用阴影（阴影在暗色背景上不可见）。

| 层级 | 变量 | 色值 | 用途 |
|------|------|------|------|
| base | deep-900 | #050b1a | 页面底色 |
| raised | deep-800 | #0a1628 | 卡片、面板、侧栏 |
| overlay | deep-700 | #102339 | 嵌套卡片、hover 态 |
| elevated | deep-600 | #18324f | 弹窗、tooltip、dropdown |

## 文字颜色

- 正文：`#b2dfdb`（off-white，减少眩光）
- 标题：`#4dd0e1`（cyan-glow 强调色）
- 次要文字：`rgba(224, 242, 241, 0.7)`
- 禁用文字：`rgba(224, 242, 241, 0.4)`
- **禁止使用纯白 #FFFFFF 做正文**（对比度过高导致眼疲劳）

## 视觉层级规则

1. 用**颜色对比**和**字号差异**建立层级，不依赖阴影
2. 卡片 hover 用**边框发光** + **微亮背景**代替 drop-shadow
3. 主 CTA 用 `bg-cyan-glow text-deep-900`（反色高对比）
4. 次要按钮用 `bg-deep-700 border-deep-600 hover:border-cyan-glow`

## 间距节奏（4px 基准）

- 组件内 padding：12px / 16px / 24px
- 组件间 gap：12px / 16px / 24px
- section 间距：32px / 40px / 48px
- 保持一致，不要随意用奇数间距

## 无障碍

- 所有文字对比度 ≥ 4.5:1（WCAG AA）
- `:focus-visible` 必须有 2px cyan outline
- 移动端触摸目标 ≥ 44×44px
- 图片必须有 alt 文字
- 交互元素必须有 aria-label

## 长文可读性（Hybrid 模式）

- 攻略正文区域加 `bg-deep-800 rounded-xl p-8 border border-deep-600/60`
- 用实色 deep-800 做内容容器背景，和 deep-900 页面底色形成明确层级差
- 行高 1.65，段间距 0.8rem
- 有序列表用圆形数字徽章（视觉锚点）
- 关键信息用 Callout 组件突出

## 动效规则

- hover/active 过渡：150-200ms ease
- 页面进入动画：400ms ease-out fadeInUp
- 不要用超过 300ms 的动画（用户感知为"慢"）
- 减少动画偏好：`@media (prefers-reduced-motion: reduce)` 时禁用

## 组件设计原则

1. **一个组件一个职责**
2. **Props 最小化**：只暴露必要的定制点
3. **默认值合理**：不传 props 也能正常渲染
4. **响应式优先**：移动端 → 平板 → 桌面
5. **语义化 HTML**：nav/article/section/aside 而非全 div
