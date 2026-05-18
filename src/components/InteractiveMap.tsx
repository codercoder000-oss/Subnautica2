// 互动地图核心组件：Leaflet + 自定义瓦片 + 标记过滤 + 剧透分级 + 自定义标记
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 标记类型
export type MarkerCategory =
  | 'biome'         // 生物群落
  | 'resource'      // 资源点
  | 'wreck'         // 残骸
  | 'signal'        // 信号
  | 'creature'      // 危险生物
  | 'lore'          // 剧情点（默认隐藏）
  | 'easter-egg';   // 彩蛋

export interface MapMarker {
  id: string;
  name: string;
  category: MarkerCategory;
  // 游戏内坐标（不是地理坐标）
  x: number;
  z: number;
  depth?: number;          // y 轴深度（米）
  description?: string;
  link?: string;           // 跳转到详情页
  isSpoiler?: boolean;     // 是否剧透
}

interface Props {
  markers: MapMarker[];
  // 地图瓦片路径，按 z/x/y 切片
  tilesUrl?: string;
  // 地图原图尺寸（像素）
  width?: number;
  height?: number;
}

// 类别配置
const CATEGORY_CONFIG: Record<MarkerCategory, { label: string; color: string; emoji: string }> = {
  biome: { label: '生物群落', color: '#4dd0e1', emoji: '🌊' },
  resource: { label: '资源点', color: '#ffd54f', emoji: '⛏️' },
  wreck: { label: '残骸', color: '#bcaaa4', emoji: '🛞' },
  signal: { label: '信号', color: '#ff80ab', emoji: '📡' },
  creature: { label: '危险生物', color: '#ef5350', emoji: '🦈' },
  lore: { label: '剧情点', color: '#ba68c8', emoji: '📖' },
  'easter-egg': { label: '彩蛋', color: '#81c784', emoji: '🥚' },
};

// 深度分层
const DEPTH_LAYERS = [
  { label: '全部', min: -2000, max: 100 },
  { label: '海面 0~-100m', min: -100, max: 100 },
  { label: '浅海 -100~-300m', min: -300, max: -100 },
  { label: '中层 -300~-500m', min: -500, max: -300 },
  { label: '深海 -500~-900m', min: -900, max: -500 },
  { label: '深渊 -900m+', min: -2000, max: -900 },
];

const CUSTOM_MARKERS_KEY = 'sub2:custom-markers';
const FILTER_KEY = 'sub2:map-filters';

export default function InteractiveMap({
  markers,
  tilesUrl,
  width = 4096,
  height = 4096,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const layerGroup = useRef<L.LayerGroup | null>(null);

  // 过滤状态
  const [enabledCategories, setEnabledCategories] = useState<Set<MarkerCategory>>(() => {
    if (typeof window === 'undefined') return new Set(Object.keys(CATEGORY_CONFIG) as MarkerCategory[]);
    const saved = localStorage.getItem(FILTER_KEY);
    if (saved) {
      try {
        return new Set(JSON.parse(saved) as MarkerCategory[]);
      } catch { /* ignore */ }
    }
    // 默认隐藏剧透类
    return new Set(['biome', 'resource', 'wreck', 'signal', 'creature', 'easter-egg'] as MarkerCategory[]);
  });

  const [showSpoilers, setShowSpoilers] = useState(false);
  const [depthLayer, setDepthLayer] = useState(0);
  const [customMarkers, setCustomMarkers] = useState<MapMarker[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(CUSTOM_MARKERS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [adding, setAdding] = useState(false);

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // 用 CRS.Simple 把游戏坐标当做平面坐标
    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: -3,
      maxZoom: 2,
      zoomControl: true,
      attributionControl: false,
    });

    // 地图边界（像素 → leaflet 坐标）
    const bounds: L.LatLngBoundsLiteral = [[0, 0], [height, width]];

    if (tilesUrl) {
      // 真正的瓦片图源
      L.tileLayer(tilesUrl, {
        minZoom: -3,
        maxZoom: 2,
        bounds: L.latLngBounds(bounds),
        noWrap: true,
      }).addTo(map);
    } else {
      // 占位：纯色背景 + 网格，方便没瓦片时调试
      L.imageOverlay('/map/placeholder.svg', bounds).addTo(map);
    }

    map.fitBounds(bounds);
    map.setMaxBounds(L.latLngBounds(bounds).pad(0.5));

    // 标记图层
    layerGroup.current = L.layerGroup().addTo(map);
    leafletMap.current = map;

    // 点击地图：自定义标记模式下添加标记
    map.on('click', (e) => {
      if (!adding) return;
      const name = window.prompt('标记名称：');
      if (!name) return;
      const newMarker: MapMarker = {
        id: `custom-${Date.now()}`,
        name,
        category: 'easter-egg',
        // 把 leaflet 坐标转回游戏坐标（这里是占位映射，按真实地图调整）
        x: Math.round(e.latlng.lng - width / 2),
        z: Math.round(height / 2 - e.latlng.lat),
        description: '玩家自定义',
      };
      setCustomMarkers((prev) => {
        const next = [...prev, newMarker];
        localStorage.setItem(CUSTOM_MARKERS_KEY, JSON.stringify(next));
        return next;
      });
      setAdding(false);
    });

    return () => {
      map.remove();
      leafletMap.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 渲染标记
  useEffect(() => {
    if (!leafletMap.current || !layerGroup.current) return;
    layerGroup.current.clearLayers();

    const all = [...markers, ...customMarkers];
    const depth = DEPTH_LAYERS[depthLayer];

    all.forEach((m) => {
      // 过滤
      if (!enabledCategories.has(m.category)) return;
      if (m.isSpoiler && !showSpoilers) return;
      if (m.depth !== undefined && (m.depth < depth.min || m.depth > depth.max)) return;

      // 游戏坐标 → leaflet 坐标（中心化偏移）
      const lat = height / 2 - m.z;
      const lng = m.x + width / 2;

      const cfg = CATEGORY_CONFIG[m.category];
      const icon = L.divIcon({
        className: 'sub2-marker',
        html: `<div style="
          background:${cfg.color};
          width:24px;height:24px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
          border:2px solid #061325;
          box-shadow:0 0 8px ${cfg.color};
          font-size:12px;
        ">${cfg.emoji}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([lat, lng], { icon });
      const linkHtml = m.link
        ? `<br/><a href="${m.link}" style="color:#4dd0e1;text-decoration:underline;">查看详情</a>`
        : '';
      const depthHtml = m.depth !== undefined ? `<br/><small>深度：${m.depth}m</small>` : '';
      marker.bindPopup(`
        <strong>${m.name}</strong>
        <br/><small style="color:${cfg.color}">${cfg.label}</small>
        ${depthHtml}
        ${m.description ? `<p>${m.description}</p>` : ''}
        ${linkHtml}
        ${m.id.startsWith('custom-') ? '<br/><button data-del-id="' + m.id + '" style="color:#f44336;cursor:pointer;">删除自定义</button>' : ''}
      `);
      marker.addTo(layerGroup.current!);
    });

    // 自定义标记删除按钮
    leafletMap.current.on('popupopen', () => {
      document.querySelectorAll<HTMLButtonElement>('[data-del-id]').forEach((btn) => {
        btn.onclick = () => {
          const id = btn.dataset.delId!;
          setCustomMarkers((prev) => {
            const next = prev.filter((m) => m.id !== id);
            localStorage.setItem(CUSTOM_MARKERS_KEY, JSON.stringify(next));
            return next;
          });
        };
      });
    });
  }, [markers, customMarkers, enabledCategories, showSpoilers, depthLayer, width, height]);

  // 切换分类
  const toggleCategory = (cat: MarkerCategory) => {
    setEnabledCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      localStorage.setItem(FILTER_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
      {/* 控制面板 */}
      <aside className="bg-deep-800 border border-deep-600 rounded-lg p-4 space-y-4 text-sm">
        <div>
          <h3 className="font-display text-cyan-glow mb-2">深度层</h3>
          <select
            value={depthLayer}
            onChange={(e) => setDepthLayer(Number(e.target.value))}
            className="w-full bg-deep-700 border border-deep-600 rounded px-2 py-1.5"
          >
            {DEPTH_LAYERS.map((l, i) => (
              <option key={i} value={i}>{l.label}</option>
            ))}
          </select>
        </div>

        <div>
          <h3 className="font-display text-cyan-glow mb-2">标记类别</h3>
          <ul className="space-y-1">
            {(Object.entries(CATEGORY_CONFIG) as [MarkerCategory, typeof CATEGORY_CONFIG[MarkerCategory]][]).map(([cat, cfg]) => (
              <li key={cat}>
                <label className="flex items-center gap-2 cursor-pointer hover:bg-deep-700 px-2 py-1 rounded">
                  <input
                    type="checkbox"
                    checked={enabledCategories.has(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  <span style={{ color: cfg.color }}>{cfg.emoji}</span>
                  <span>{cfg.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-3 border-t border-deep-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showSpoilers}
              onChange={(e) => setShowSpoilers(e.target.checked)}
            />
            <span className="text-yellow-300">显示剧情剧透标记</span>
          </label>
          <p className="text-xs text-cyan-200/50 mt-1">勾选后显示剧情相关的位置</p>
        </div>

        <div className="pt-3 border-t border-deep-600">
          <button
            onClick={() => setAdding((s) => !s)}
            className={`w-full px-3 py-2 rounded transition ${
              adding ? 'bg-cyan-glow text-deep-900' : 'bg-deep-700 hover:bg-deep-600'
            }`}
          >
            {adding ? '点击地图添加（再按取消）' : '➕ 添加自定义标记'}
          </button>
          <p className="text-xs text-cyan-200/50 mt-1">
            自定义标记保存在你的浏览器，已添加 {customMarkers.length} 个
          </p>
          {customMarkers.length > 0 && (
            <button
              onClick={() => {
                if (confirm('清空所有自定义标记？')) {
                  setCustomMarkers([]);
                  localStorage.removeItem(CUSTOM_MARKERS_KEY);
                }
              }}
              className="text-xs text-red-300 hover:text-red-200 mt-1"
            >
              清空自定义
            </button>
          )}
        </div>
      </aside>

      {/* 地图本体 */}
      <div
        ref={mapRef}
        className="rounded-lg overflow-hidden border border-deep-600"
        style={{ height: '70vh', minHeight: '500px', background: '#061325' }}
      />
    </div>
  );
}
