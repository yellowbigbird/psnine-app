import * as cheerio from 'cheerio';

const BASE_URL = 'https://www.psnine.com';

export async function fetchPage(path: string): Promise<cheerio.CheerioAPI> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }
  const html = await res.text();
  return cheerio.load(html);
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http')) return path;
  if (path.startsWith('//')) return `https:${path}`;
  return `${BASE_URL}${path}`;
}
