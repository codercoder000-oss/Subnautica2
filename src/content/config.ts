// 内容集合定义：用 zod schema 给所有攻略数据上类型
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 通用版本字段：每条内容都标适用版本
const versionFields = {
  // 适用游戏版本，例：'EA 0.1.0'
  gameVersion: z.string().default('EA 0.1.0'),
  // 最后验证日期
  verifiedAt: z.coerce.date().optional(),
  // 是否过时
  outdated: z.boolean().default(false),
  // 过时说明
  outdatedNote: z.string().optional(),
};

// 生物图鉴（基于二代真实分类：Predator/Leviathan/Carnivore/Herbivore/Passive/Other）
const creatures = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/creatures' }),
  schema: z.object({
    name: z.string(),                       // 中文名 / 通用译名
    nameEn: z.string(),                     // 英文名
    scientificName: z.string().optional(),  // 拉丁学名（官方设定）
    aliases: z.array(z.string()).default([]),
    // 二代生态分类（官方使用）
    role: z.enum(['predator', 'leviathan', 'carnivore', 'herbivore', 'passive', 'other']),
    // 攻击性（保留，便于过滤）
    aggression: z.enum(['passive', 'cautious', 'aggressive', 'lethal']),
    depthMin: z.number(),
    depthMax: z.number(),
    biomes: z.array(z.string()).default([]),
    size: z.enum(['small', 'large', 'leviathan']),// 二代官方仅小型/大型/利维坦三档
    phobiaTags: z.array(z.string()).default([]),
    scannable: z.boolean().default(true),
    // 扫描后可获得的 Biomod 特性（二代核心机制）
    biomod: z.string().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    isStorySpoiler: z.boolean().default(false),
    ...versionFields,
  }),
});

// 物品 / 蓝图
const items = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/items' }),
  schema: z.object({
    name: z.string(),
    nameEn: z.string(),
    category: z.enum(['raw', 'basic', 'advanced', 'equipment', 'vehicle', 'base', 'tool', 'food']),
    blueprintSource: z.array(z.string()).default([]), // 蓝图来源描述
    recipe: z.array(z.object({
      itemId: z.string(),
      qty: z.number(),
    })).default([]),
    crafter: z.enum(['fabricator', 'mobile-fabricator', 'modification-station', 'vehicle-bay', 'habitat-builder', 'none']).default('fabricator'),
    image: z.string().optional(),
    isStorySpoiler: z.boolean().default(false),
    ...versionFields,
  }),
});

// 生物群落
const biomes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/biomes' }),
  schema: z.object({
    name: z.string(),
    nameEn: z.string(),
    depthMin: z.number(),
    depthMax: z.number(),
    dangerLevel: z.number().min(1).max(5),
    keyResources: z.array(z.string()).default([]),
    keyCreatures: z.array(z.string()).default([]),
    image: z.string().optional(),
    isStorySpoiler: z.boolean().default(false),
    ...versionFields,
  }),
});

// 主线流程指引
const guides = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(0),       // 流程顺序
    chapter: z.string().default('未分类'), // 所属章节
    prerequisites: z.array(z.string()).default([]),// 前置节点 slug
    spoilerLevel: z.enum(['none', 'minor', 'major']).default('minor'),
    estimatedTime: z.string().optional(),// 预计耗时
    ...versionFields,
  }),
});

// 版本日志
const changelog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/changelog' }),
  schema: z.object({
    version: z.string(),
    releaseDate: z.coerce.date(),
    title: z.string(),
    summary: z.string(),
  }),
});

export const collections = { creatures, items, biomes, guides, changelog };
