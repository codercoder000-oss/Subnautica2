// 科技树可视化：展示物品依赖关系图
import { useMemo, useState, useRef, useEffect } from 'react';

export interface TechNode {
  id: string;
  name: string;
  category: string;
  recipe: { itemId: string; qty: number }[];
  isRaw: boolean;
}

interface Props {
  items: TechNode[];
}

// 类别颜色
const CATEGORY_COLORS: Record<string, string> = {
  raw: '#ffd54f',
  basic: '#81c784',
  advanced: '#4dd0e1',
  equipment: '#ba68c8',
  vehicle: '#ff8a65',
  base: '#90a4ae',
  tool: '#7986cb',
  food: '#a5d6a7',
};

const CATEGORY_LABELS: Record<string, string> = {
  raw: '基础材料',
  basic: '基础合成',
  advanced: '高级合成',
  equipment: '装备',
  vehicle: '载具',
  base: '基地',
  tool: '工具',
  food: '食物',
};

// 简单力导向布局（纯前端，不依赖 D3）
interface NodePos {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

function layoutNodes(items: TechNode[], width: number, height: number): Map<string, { x: number; y: number }> {
  // 按层级分配 Y 坐标：raw 在底部，越高级越靠上
  const levels: Record<string, number> = {};

  function getLevel(id: string, visited = new Set<string>()): number {
    if (levels[id] !== undefined) return levels[id];
    if (visited.has(id)) return 0;
    visited.add(id);
    const item = items.find((i) => i.id === id);
    if (!item || item.isRaw || item.recipe.length === 0) {
      levels[id] = 0;
      return 0;
    }
    const maxChild = Math.max(...item.recipe.map((r) => getLevel(r.itemId, visited)));
    levels[id] = maxChild + 1;
    return levels[id];
  }

  items.forEach((i) => getLevel(i.id));

  // 按层分组
  const byLevel: Record<number, TechNode[]> = {};
  items.forEach((i) => {
    const lv = levels[i.id] ?? 0;
    (byLevel[lv] ??= []).push(i);
  });

  const maxLevel = Math.max(...Object.keys(byLevel).map(Number));
  const result = new Map<string, { x: number; y: number }>();

  Object.entries(byLevel).forEach(([lvStr, nodes]) => {
    const lv = Number(lvStr);
    const y = height - (lv / Math.max(maxLevel, 1)) * (height - 100) - 50;
    const spacing = width / (nodes.length + 1);
    nodes.forEach((n, i) => {
      result.set(n.id, { x: spacing * (i + 1), y });
    });
  });

  return result;
}

export default function TechTree({ items }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions] = useState({ width: 1200, height: 800 });

  // 过滤
  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return items;
    return items.filter((i) => i.category === selectedCategory);
  }, [items, selectedCategory]);

  // 布局
  const positions = useMemo(
    () => layoutNodes(filteredItems, dimensions.width, dimensions.height),
    [filteredItems, dimensions]
  );

  // 边（依赖关系）
  const edges = useMemo(() => {
    const result: { from: string; to: string; qty: number }[] = [];
    filteredItems.forEach((item) => {
      item.recipe.forEach((r) => {
        if (positions.has(r.itemId)) {
          result.push({ from: r.itemId, to: item.id, qty: r.qty });
        }
      });
    });
    return result;
  }, [filteredItems, positions]);

  // 高亮相关节点
  const relatedNodes = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const related = new Set<string>([hoveredNode]);
    const item = items.find((i) => i.id === hoveredNode);
    if (item) {
      item.recipe.forEach((r) => related.add(r.itemId));
    }
    // 谁依赖我
    items.forEach((i) => {
      if (i.recipe.some((r) => r.itemId === hoveredNode)) {
        related.add(i.id);
      }
    });
    return related;
  }, [hoveredNode, items]);

  return (
    <div className="space-y-4">
      {/* 过滤器 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded text-sm transition ${
            selectedCategory === 'all' ? 'bg-cyan-glow text-deep-900' : 'bg-deep-700 hover:bg-deep-600'
          }`}
        >
          全部
        </button>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-3 py-1.5 rounded text-sm transition ${
              selectedCategory === key ? 'bg-cyan-glow text-deep-900' : 'bg-deep-700 hover:bg-deep-600'
            }`}
            style={{ borderLeft: `3px solid ${CATEGORY_COLORS[key]}` }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap gap-4 text-xs text-cyan-200/70">
        <span>⬆ 越高级越靠上</span>
        <span>⬇ 基础材料在底部</span>
        <span>线条 = 合成依赖</span>
        <span>悬停节点高亮依赖链</span>
      </div>

      {/* SVG 画布 */}
      <div className="overflow-x-auto bg-deep-800 border border-deep-600 rounded-lg">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="min-w-full"
          style={{ minHeight: '600px' }}
        >
          {/* 边 */}
          {edges.map((e, i) => {
            const from = positions.get(e.from);
            const to = positions.get(e.to);
            if (!from || !to) return null;
            const isHighlighted = hoveredNode && (relatedNodes.has(e.from) && relatedNodes.has(e.to));
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={isHighlighted ? '#4dd0e1' : '#18324f'}
                strokeWidth={isHighlighted ? 2 : 1}
                opacity={hoveredNode ? (isHighlighted ? 1 : 0.2) : 0.6}
              />
            );
          })}

          {/* 节点 */}
          {filteredItems.map((item) => {
            const pos = positions.get(item.id);
            if (!pos) return null;
            const color = CATEGORY_COLORS[item.category] ?? '#4dd0e1';
            const isHighlighted = !hoveredNode || relatedNodes.has(item.id);
            const isHovered = hoveredNode === item.id;
            return (
              <g
                key={item.id}
                onMouseEnter={() => setHoveredNode(item.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
                opacity={isHighlighted ? 1 : 0.3}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered ? 20 : 14}
                  fill={color}
                  opacity={0.8}
                  stroke={isHovered ? '#fff' : 'none'}
                  strokeWidth={2}
                />
                <text
                  x={pos.x}
                  y={pos.y + 28}
                  textAnchor="middle"
                  fill={isHighlighted ? '#e0f7fa' : '#4a6a7a'}
                  fontSize={isHovered ? 12 : 10}
                  fontWeight={isHovered ? 'bold' : 'normal'}
                >
                  {item.name}
                </text>
                {isHovered && (
                  <text
                    x={pos.x}
                    y={pos.y - 24}
                    textAnchor="middle"
                    fill="#4dd0e1"
                    fontSize={11}
                  >
                    {CATEGORY_LABELS[item.category]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* 悬停详情 */}
      {hoveredNode && (() => {
        const item = items.find((i) => i.id === hoveredNode);
        if (!item) return null;
        return (
          <div className="bg-deep-800 border border-cyan-glow/30 rounded-lg p-4 text-sm">
            <h3 className="font-display text-cyan-glow text-lg">{item.name}</h3>
            <p className="text-cyan-200/60">{CATEGORY_LABELS[item.category]}</p>
            {item.recipe.length > 0 && (
              <div className="mt-2">
                <span className="text-cyan-200/70">需要：</span>
                {item.recipe.map((r, i) => {
                  const sub = items.find((it) => it.id === r.itemId);
                  return (
                    <span key={i} className="ml-2">
                      {sub?.name ?? r.itemId} ×{r.qty}
                    </span>
                  );
                })}
              </div>
            )}
            {/* 谁需要我 */}
            {(() => {
              const usedBy = items.filter((i) => i.recipe.some((r) => r.itemId === hoveredNode));
              if (usedBy.length === 0) return null;
              return (
                <div className="mt-1">
                  <span className="text-cyan-200/70">被用于：</span>
                  {usedBy.slice(0, 5).map((u, i) => (
                    <span key={i} className="ml-2">{u.name}</span>
                  ))}
                  {usedBy.length > 5 && <span className="ml-2 text-cyan-200/50">等 {usedBy.length} 项</span>}
                </div>
              );
            })()}
          </div>
        );
      })()}
    </div>
  );
}
