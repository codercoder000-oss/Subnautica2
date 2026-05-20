// 互动地图：区域覆盖层 + POI 标记 + 过滤器 + 深度工具
// 学习 wikily.gg 的效果：区域名称标签 + 分类过滤 + 合作标记
import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Region, POI } from '@/data/regions';
import { POI_CATEGORIES } from '@/data/regions';

interface Props {
  regions: Region[];
  pois: POI[];
}

// 地图尺寸（像素）
const MAP_SIZE = 4096;
// 游戏世界尺寸（米）- 半径 2km
const WORLD_RADIUS = 2000;

// 游戏坐标 → Leaflet 坐标
function gameToLeaflet(x: number, z: number): [number, number] {
  const scale = MAP_SIZE / (WORLD_RADIUS * 2);
  return [MAP_SIZE / 2 - z * scale, MAP_SIZE / 2 + x * scale];
}

export default function GameMap({ regions, pois }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);
  const regionsLayer = useRef<L.LayerGroup | null>(null);

  const [enabledCategories, setEnabledCategories] = useState<Set<string>>(
    new Set(Object.keys(POI_CATEGORIES))
  );
  const [showRegions, setShowRegions] = useState(true);
  const [showDepth, setShowDepth] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [poiCount, setPoiCount] = useState(0);

  // 初始化地图
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      minZoom: -2,
      maxZoom: 3,
      zoomControl: true,
      attributionControl: false,
    });

    const bounds: L.LatLngBoundsLiteral = [[0, 0], [MAP_SIZE, MAP_SIZE]];

    // 深海背景
    L.imageOverlay('/map/placeholder.svg', bounds).addTo(map);

    map.fitBounds(bounds);
    map.setMaxBounds(L.latLngBounds(bounds).pad(0.2));

    regionsLayer.current = L.layerGroup().addTo(map);
    markersLayer.current = L.layerGroup().addTo(map);
    leafletMap.current = map;

    return () => { map.remove(); leafletMap.current = null; };
  }, []);

  // 渲染区域覆盖层
  useEffect(() => {
    if (!regionsLayer.current) return;
    regionsLayer.current.clearLayers();
    if (!showRegions) return;

    regions.forEach((r) => {
      const [lat, lng] = gameToLeaflet(r.cx, r.cz);
      const scale = MAP_SIZE / (WORLD_RADIUS * 2);
      const pixelRadius = r.radius * scale;

      // 区域圆形
      const circle = L.circle([lat, lng], {
        radius: pixelRadius,
        color: r.color,
        fillColor: r.color,
        fillOpacity: selectedRegion === r.id ? 0.25 : 0.08,
        weight: selectedRegion === r.id ? 2 : 1,
        dashArray: selectedRegion === r.id ? undefined : '4 4',
      });

      circle.on('click', () => setSelectedRegion(r.id === selectedRegion ? null : r.id));
      circle.bindTooltip(`
        <strong>${r.nameZh}</strong> (${r.name})<br/>
        深度 ${r.depthMin}~${r.depthMax}m<br/>
        危险 ${'⚠️'.repeat(r.danger)}
      `, { sticky: true });
      circle.addTo(regionsLayer.current!);

      // 区域名称标签
      const label = L.divIcon({
        className: 'region-label',
        html: `<div style="
          color:${r.color};
          font-size:11px;
          font-weight:700;
          font-family:Orbitron,monospace;
          text-transform:uppercase;
          letter-spacing:1px;
          text-shadow:0 0 8px ${r.color}40, 0 1px 3px #000;
          white-space:nowrap;
          pointer-events:none;
          opacity:0.8;
        ">${r.name}</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });
      L.marker([lat, lng], { icon: label, interactive: false }).addTo(regionsLayer.current!);
    });
  }, [regions, showRegions, selectedRegion]);

  // 渲染 POI 标记
  useEffect(() => {
    if (!markersLayer.current) return;
    markersLayer.current.clearLayers();

    let count = 0;
    pois.forEach((poi) => {
      if (!enabledCategories.has(poi.category)) return;
      if (selectedRegion && poi.region !== selectedRegion) return;

      const [lat, lng] = gameToLeaflet(poi.x, poi.z);
      const cat = POI_CATEGORIES[poi.category as keyof typeof POI_CATEGORIES];

      const icon = L.divIcon({
        className: 'poi-marker',
        html: `<div style="
          width:22px;height:22px;border-radius:50%;
          background:${cat.color};
          display:flex;align-items:center;justify-content:center;
          font-size:11px;
          border:2px solid #061325;
          box-shadow:0 0 6px ${cat.color}80;
          cursor:pointer;
        ">${cat.icon}</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const marker = L.marker([lat, lng], { icon });
      const linkHtml = poi.link ? `<br/><a href="${poi.link}" style="color:#4dd0e1;text-decoration:underline;font-size:11px;">查看攻略 →</a>` : '';
      marker.bindPopup(`
        <div style="min-width:160px;">
          <strong style="color:#4dd0e1;">${poi.nameZh}</strong>
          <br/><small style="color:#80cbc4;">${poi.name}</small>
          <br/><small>深度 ${poi.depth}m · ${poi.region}</small>
          ${poi.desc ? `<br/><span style="font-size:11px;color:#b2dfdb;">${poi.desc}</span>` : ''}
          ${linkHtml}
        </div>
      `);
      marker.addTo(markersLayer.current!);
      count++;
    });
    setPoiCount(count);
  }, [pois, enabledCategories, selectedRegion]);

  // 切换过滤器
  const toggleCategory = (cat: string) => {
    setEnabledCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-0 rounded-xl overflow-hidden border border-deep-600">
      {/* 侧边栏 */}
      <aside className="bg-deep-800 p-4 space-y-4 text-sm border-r border-deep-600 max-h-[75vh] overflow-y-auto">
        {/* 统计 */}
        <div className="text-center pb-3 border-b border-deep-600">
          <div className="font-display text-cyan-glow text-lg">{poiCount}</div>
          <div className="text-xs text-cyan-200/50">可见标记点</div>
          <div className="text-xs text-cyan-200/30 mt-1">
            {regions.length} 区域 · 0~596m
          </div>
        </div>

        {/* 区域覆盖层 */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input
              type="checkbox"
              checked={showRegions}
              onChange={(e) => setShowRegions(e.target.checked)}
              className="rounded"
            />
            <span className="text-cyan-glow font-semibold text-xs">显示区域边界</span>
          </label>
          {selectedRegion && (
            <button
              onClick={() => setSelectedRegion(null)}
              className="text-xs text-cyan-200/50 hover:text-cyan-glow"
            >
              ✕ 清除区域筛选
            </button>
          )}
        </div>

        {/* POI 过滤器 */}
        <div>
          <h3 className="font-display text-cyan-glow text-xs mb-2">标记过滤</h3>
          <div className="space-y-1">
            {Object.entries(POI_CATEGORIES).map(([key, cat]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer hover:bg-deep-700 px-2 py-1 rounded">
                <input
                  type="checkbox"
                  checked={enabledCategories.has(key)}
                  onChange={() => toggleCategory(key)}
                  className="rounded"
                />
                <span style={{ color: cat.color }}>{cat.icon}</span>
                <span className="text-xs">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 区域列表 */}
        <div>
          <h3 className="font-display text-cyan-glow text-xs mb-2">区域</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {regions.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRegion(r.id === selectedRegion ? null : r.id)}
                className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center gap-2 transition ${
                  selectedRegion === r.id ? 'bg-deep-600' : 'hover:bg-deep-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.color }} />
                <span className="truncate">{r.nameZh}</span>
                <span className="text-cyan-200/30 ml-auto">{r.depthMax}m</span>
              </button>
            ))}
          </div>
        </div>

        {/* 图例 */}
        <div className="pt-3 border-t border-deep-600 text-xs text-cyan-200/40">
          <p>点击区域可筛选该区域 POI</p>
          <p>点击标记查看详情和攻略链接</p>
          <p className="mt-2 text-cyan-200/30">数据来源：社区众包 · 持续更新中</p>
        </div>
      </aside>

      {/* 地图 */}
      <div
        ref={mapRef}
        className="min-h-[500px] lg:min-h-[75vh]"
        style={{ background: '#030a15' }}
      />
    </div>
  );
}
