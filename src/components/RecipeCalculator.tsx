// 配方计算器：递归展开依赖到基础材料
import { useMemo, useState } from 'react';

export interface RecipeItem {
  id: string;
  name: string;
  category: string;
  // 直接配方：合成此物品需要的材料
  recipe: { itemId: string; qty: number }[];
  // 是否基础材料（不可再分解）
  isRaw?: boolean;
  // 获取地点（链接到地图或攻略）
  source?: string;
}

interface Props {
  items: RecipeItem[];
}

interface MaterialNeed {
  itemId: string;
  name: string;
  qty: number;
  isRaw: boolean;
  source?: string;
}

// 递归展开配方到基础材料
function expand(
  itemId: string,
  qty: number,
  itemMap: Map<string, RecipeItem>,
  acc: Map<string, MaterialNeed>
) {
  const item = itemMap.get(itemId);
  if (!item) {
    // 未知物品：当基础材料处理
    const cur = acc.get(itemId);
    acc.set(itemId, {
      itemId,
      name: itemId,
      qty: (cur?.qty ?? 0) + qty,
      isRaw: true,
    });
    return;
  }

  // 基础材料 / 没有配方 → 累加到结果
  if (item.isRaw || item.recipe.length === 0) {
    const cur = acc.get(itemId);
    acc.set(itemId, {
      itemId,
      name: item.name,
      qty: (cur?.qty ?? 0) + qty,
      isRaw: true,
      source: item.source,
    });
    return;
  }

  // 否则继续递归
  for (const sub of item.recipe) {
    expand(sub.itemId, sub.qty * qty, itemMap, acc);
  }
}

export default function RecipeCalculator({ items }: Props) {
  const itemMap = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  // 用户选择的目标
  const [targets, setTargets] = useState<{ id: string; qty: number }[]>([
    { id: '', qty: 1 },
  ]);

  // 已有库存（扣减用）
  const [inventory, setInventory] = useState<Record<string, number>>({});

  // 可选的目标（非基础材料）
  const buildable = useMemo(
    () => items.filter((i) => !i.isRaw && i.recipe.length > 0),
    [items]
  );

  // 计算结果
  const result = useMemo(() => {
    const acc = new Map<string, MaterialNeed>();
    targets.forEach((t) => {
      if (t.id && t.qty > 0) expand(t.id, t.qty, itemMap, acc);
    });
    // 扣减库存
    const list = [...acc.values()].map((m) => ({
      ...m,
      qty: Math.max(0, m.qty - (inventory[m.itemId] ?? 0)),
    })).filter((m) => m.qty > 0);
    list.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    return list;
  }, [targets, itemMap, inventory]);

  const updateTarget = (idx: number, patch: Partial<{ id: string; qty: number }>) => {
    setTargets((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 输入区 */}
      <section className="bg-deep-800 border border-deep-600 rounded-lg p-4">
        <h2 className="font-display text-cyan-glow text-lg mb-3">目标物品</h2>
        <div className="space-y-2">
          {targets.map((t, idx) => (
            <div key={idx} className="flex gap-2">
              <select
                value={t.id}
                onChange={(e) => updateTarget(idx, { id: e.target.value })}
                className="flex-1 bg-deep-700 border border-deep-600 rounded px-2 py-1.5"
              >
                <option value="">— 选择物品 —</option>
                {buildable.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={t.qty}
                onChange={(e) => updateTarget(idx, { qty: Number(e.target.value) })}
                className="w-20 bg-deep-700 border border-deep-600 rounded px-2 py-1.5"
              />
              <button
                onClick={() => setTargets((p) => p.filter((_, i) => i !== idx))}
                className="px-3 text-red-300 hover:text-red-200"
                aria-label="删除"
                disabled={targets.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={() => setTargets((p) => [...p, { id: '', qty: 1 }])}
          className="mt-3 text-sm px-3 py-1.5 rounded bg-deep-700 hover:bg-deep-600"
        >
          ➕ 添加一项
        </button>

        {/* 库存扣减 */}
        {result.length > 0 && (
          <details className="mt-4 pt-4 border-t border-deep-600">
            <summary className="cursor-pointer text-sm text-cyan-glow">
              我已有的材料（点击展开）
            </summary>
            <div className="mt-2 space-y-1">
              {result.map((m) => (
                <div key={m.itemId} className="flex items-center gap-2 text-sm">
                  <label className="flex-1">{m.name}</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="0"
                    value={inventory[m.itemId] ?? ''}
                    onChange={(e) =>
                      setInventory((p) => ({
                        ...p,
                        [m.itemId]: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-16 bg-deep-700 border border-deep-600 rounded px-2 py-1 text-right"
                  />
                </div>
              ))}
            </div>
          </details>
        )}
      </section>

      {/* 结果区 */}
      <section className="bg-deep-800 border border-deep-600 rounded-lg p-4">
        <h2 className="font-display text-cyan-glow text-lg mb-3">所需基础材料</h2>
        {result.length === 0 ? (
          <p className="text-cyan-200/50 text-sm">选择一个目标物品开始计算</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-cyan-200/70 border-b border-deep-600">
              <tr>
                <th className="py-2">材料</th>
                <th className="py-2 text-right">数量</th>
                <th className="py-2 pl-4">获取</th>
              </tr>
            </thead>
            <tbody>
              {result.map((m) => (
                <tr key={m.itemId} className="border-b border-deep-700">
                  <td className="py-2">{m.name}</td>
                  <td className="py-2 text-right font-mono text-cyan-glow">×{m.qty}</td>
                  <td className="py-2 pl-4 text-cyan-200/60 text-xs">
                    {m.source ?? '查看物品页'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
