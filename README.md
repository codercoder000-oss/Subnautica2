# Subnautica 2 攻略站

深海迷航 2 中文社区攻略站。粉丝制作，与 Unknown Worlds Entertainment 无关。

> Fan-made guide site, not affiliated with Unknown Worlds Entertainment.
> All game assets © Unknown Worlds Entertainment.

## 技术栈

- **Astro 5** —— 静态站点框架，零 JS 默认
- **React 18** —— 交互组件岛屿（地图、计算器）
- **Tailwind CSS 4** —— 样式
- **Leaflet** —— 互动地图
- **Pagefind** —— 静态全文搜索
- **MDX** —— 内容写作
- **GitHub Actions + Pages** —— CI/CD

## 本地开发

```bash
# 安装依赖（推荐 pnpm）
pnpm install

# 启动开发服务器
pnpm dev

# 生产构建（含搜索索引）
pnpm build

# 预览构建结果
pnpm preview
```

## 项目结构

```
src/
├── content/           # 攻略内容（Markdown / MDX）
│   ├── creatures/     # 生物图鉴
│   ├── items/         # 物品蓝图
│   ├── biomes/        # 生物群落
│   ├── guides/        # 主线流程
│   └── changelog/     # 版本日志
├── components/        # UI 组件
│   ├── InteractiveMap.tsx   # 互动地图（React）
│   ├── RecipeCalculator.tsx # 配方计算器（React）
│   ├── VersionBadge.astro   # 版本徽章
│   └── Spoiler.astro        # 剧透遮罩
├── data/              # 结构化数据
│   └── map-markers.ts # 地图标记数据
├── layouts/           # 布局
├── pages/             # 路由页面
├── styles/            # 全局样式
└── consts.ts          # 站点常量（含游戏版本）
```

## 核心功能

- ✅ 互动地图（多层深度、剧透分级、自定义标记）
- ✅ 生物图鉴（攻击性、恐惧症友好标签）
- ✅ 物品蓝图与配方计算器（递归展开、库存扣减）
- ✅ 主线流程（节点式、剧透分级、进度勾选）
- ✅ 版本标签系统（每条内容标注适用版本）
- ✅ 站内全文搜索（Pagefind）
- ✅ SEO 优化（sitemap、JSON-LD、OG）
- ⏳ 科技树可视化（建设中）

## 上线流程

1. 创建 GitHub 仓库并推送代码
2. 仓库 Settings → Pages → Source 选 `GitHub Actions`
3. 在域名注册商把域名 CNAME 解析到 `<username>.github.io`
4. 修改 `astro.config.mjs` 中的 `site` 和 `public/CNAME`
5. push 到 `main` 分支自动部署

> 推荐用 Cloudflare Pages 替代 GitHub Pages，国内访问更快。

## 内容贡献

每篇内容必须填写 `gameVersion` 字段，过时内容请标 `outdated: true` 而不是删除。
详见 [贡献指南](https://subnautica2-guide.com/contribute/)。

## License

- 站点代码：MIT
- 原创内容：CC BY-NC-SA 4.0
- 游戏资源：版权归 Unknown Worlds Entertainment
