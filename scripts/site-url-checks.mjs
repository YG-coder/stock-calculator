import assert from 'node:assert/strict';

export function siteUrl(value, config, label = 'URL', allowExternal = []) {
  const url = new URL(value);
  const blocked = config.forbiddenHosts ?? [];
  assert(!blocked.some(h => { const host = new URL(`https://${h}`).hostname; return url.hostname === host || url.hostname.endsWith(`.${host}`); }), `${label}: forbidden host ${url.hostname}`);
  assert(!url.username && !url.password, `${label}: userinfo is not allowed`);
  assert([new URL(config.url).origin, ...allowExternal].includes(url.origin), `${label}: unexpected origin ${url.origin}`);
  return url;
}
export function xmlText(text) {
  const chars = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>' };
  return text.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (_, key) => key[0] === '#' ? String.fromCodePoint(key[1].toLowerCase() === 'x' ? parseInt(key.slice(2), 16) : Number(key.slice(1))) : chars[key.toLowerCase()]);
}
function attr(tag, name) { const value = tag.match(new RegExp(`\\b${name}\\s*=\\s*(['"])(.*?)\\1`, 'i'))?.[2]; return value === undefined ? undefined : xmlText(value); }
export function inspectHtml(html, config, expected) {
  const canonical = [], og = [], images = [], twitter = [], cards = [], types = [], imageEntries = [];
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) if (attr(tag, 'rel')?.split(/\s+/).includes('canonical')) canonical.push(attr(tag, 'href'));
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    const key = attr(tag, 'property') ?? attr(tag, 'name'), value = attr(tag, 'content');
    if (key === 'og:url') og.push(value);
    if (key === 'og:image') { images.push(value); imageEntries.push({ url: value }); }
    if (key === 'og:image:width' || key === 'og:image:height') {
      const entry = imageEntries[imageEntries.length - 1];
      assert(entry, `${expected}: ${key} without og:image`);
      entry[key === 'og:image:width' ? 'width' : 'height'] = Number(value);
    }
    if (key === 'og:type') types.push(value);
    if (key === 'twitter:image') twitter.push(value);
    if (key === 'twitter:card') cards.push(value);
    if (['og:image:url', 'og:image:secure_url'].includes(key)) siteUrl(value, config, key, config.imageOrigins ?? []);
  }
  assert.equal(canonical.length, 1, `${expected}: canonical count`);
  assert.equal(siteUrl(canonical[0], config, 'canonical').href, new URL(expected).href, `${expected}: canonical path`);
  assert.equal(og.length, 1, `${expected}: og:url count`); assert.equal(siteUrl(og[0], config, 'og:url').href, new URL(expected).href, `${expected}: og:url path`);
  assert(images.length, `${expected}: og:image missing`); assert(twitter.length, `${expected}: twitter:image missing`);
  assert.deepEqual(cards, ['summary_large_image'], `${expected}: twitter:card`);
  // 공유 유형(website/article)이 페이지마다 정확히 하나 출력돼야 한다. 값은 페이지 정의를 따른다.
  assert.equal(types.length, 1, `${expected}: og:type count`);
  assert(['website', 'article'].includes(types[0]), `${expected}: og:type ${types[0]}`);
  for (const url of [...images, ...twitter]) siteUrl(url, config, 'image', config.imageOrigins ?? []);
  let jsonLdCount = 0;
  function visit(value, key) {
    if (key === '@context') return;
    if (typeof value === 'string' && (key === 'url' || key === '@id')) siteUrl(value, config, `JSON-LD ${key}`, config.externalJsonLdOrigins ?? []);
    else if (Array.isArray(value)) value.forEach(item => visit(item, key));
    else if (value && typeof value === 'object') Object.entries(value).forEach(([field, item]) => visit(item, field));
  }
  for (const [tag, , body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) if (attr(tag, 'type') === 'application/ld+json') { visit(JSON.parse(body)); jsonLdCount++; }
  return { canonical, og, images, twitter, cards, jsonLdCount, type: types[0], imageEntries };
}
export function inspectRobots(text, config) {
  const values = (key) => [...text.matchAll(new RegExp(`^${key}: (.+)$`, 'gmi'))].map(m => m[1].trim());
  const maps = values('Sitemap'); assert(maps.length, 'robots Sitemap missing');
  for (const value of maps) assert.equal(siteUrl(value, config, 'robots Sitemap').href, new URL('/sitemap.xml', config.url).href);
  for (const host of values('Host')) assert.equal(new URL(host.includes('://') ? host : `https://${host}`).host, new URL(config.url).host, 'robots Host');
}

/** Sitemap inclusion is independent of whether a page allows indexing. */
export function isIndexableHtml(html) {
 for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
  if (['robots','googlebot'].includes(attr(tag,'name')?.toLowerCase()) && /(?:^|[\s,])(?:noindex|none)(?=$|[\s,])/i.test(attr(tag,'content') ?? '')) return false;
 }
 return true;
}

/**
 * 이미지 파일의 실제 형식과 크기. 공유 이미지에 선언한 og:image:width/height 를 실제 파일과 대조한다.
 * 지원 형식이 아니면 예외 — 확인하지 못한 크기를 통과시키지 않는다.
 */
export function imageInfo(buffer) {
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) && buffer.toString('ascii', 12, 16) === 'IHDR') {
    return { type: 'image/png', width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    for (let i = 2; i + 9 < buffer.length;) {
      if (buffer[i] !== 0xff) { i++; continue; }
      const marker = buffer[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { type: 'image/jpeg', width: buffer.readUInt16BE(i + 7), height: buffer.readUInt16BE(i + 5) };
      }
      i += 2 + buffer.readUInt16BE(i + 2);
    }
  }
  throw new Error('unsupported or unreadable image format');
}

/** 선언된 공유 이미지 크기가 실제 파일과 같은지 검사한다. 선언이 없으면 크기 비교는 생략한다. */
export function assertImageSize(entry, buffer, label = entry.url) {
  const info = imageInfo(buffer);
  if (entry.width !== undefined) assert.equal(entry.width, info.width, `${label}: og:image:width ${entry.width} ≠ actual ${info.width}`);
  if (entry.height !== undefined) assert.equal(entry.height, info.height, `${label}: og:image:height ${entry.height} ≠ actual ${info.height}`);
  return info;
}
