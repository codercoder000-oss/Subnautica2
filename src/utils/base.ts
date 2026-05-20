// 统一处理 base URL 前缀
// GitHub Pages 项目站点需要 /Subnautica2/ 前缀
const BASE = import.meta.env.BASE_URL;

export function withBase(path: string): string {
  if (!path) return BASE;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE}${clean}`;
}
