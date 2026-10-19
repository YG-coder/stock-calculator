import assert from "node:assert/strict";
import { it as check } from "vitest";
import { readFileSync } from "node:fs";
import { assertImageSize, imageInfo, inspectHtml, inspectRobots, siteUrl } from "../scripts/site-url-checks.mjs";
const config = { url: 'https://xn--989a00a691bv6b3zl.kr', displayUrl: 'https://주식계산기.kr', forbiddenHosts: ['fincalc.kr'], externalJsonLdOrigins: ['https://www.nts.go.kr'] };
const page = `${config.url}/example`;
const fixture = () => `<link rel="canonical" href="https://주식계산기.kr/example"><meta property="og:url" content="${page}"><meta property="og:image" content="${config.url}/og-image.png"><meta name="twitter:image" content="https://주식계산기.kr/og-image.png"><meta name="twitter:card" content="summary_large_image"><meta property="og:type" content="website"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org', url:page, publisher:{url:'https://www.nts.go.kr'}})}</script>`;
check('Unicode/Punycode and allowed external authority', () => { assert.equal(inspectHtml(fixture(), config, page).images.length, 1); });
check('missing images and small cards fail', () => {
 for (const [pattern, replacement] of [[/<meta property="og:image"[^>]*>/, ''], [/<meta name="twitter:image"[^>]*>/, ''], [/summary_large_image/, 'summary']] as const) assert.throws(() => inspectHtml(fixture().replace(pattern, replacement), config, page));
});
check('foreign host, relative image, canonical path, duplicates fail', () => {
 for (const html of [fixture().replace(`${config.url}/og-image.png`, '/og-image.png'), fixture().replace('https://주식계산기.kr/example', 'https://other.example/example'), fixture().replace('https://주식계산기.kr/example', 'https://주식계산기.kr/wrong'), fixture()+`<link rel="canonical" href="${page}">`]) assert.throws(() => inspectHtml(html, config, page));
 assert.throws(() => siteUrl('https://fincalc.kr/', config));
 assert.throws(() => siteUrl('https://x.fincalc.kr/', config));
 assert.throws(() => siteUrl('https://user@주식계산기.kr/', config));
});
check('robots Host accepts hostname or complete URL', () => {
 for (const host of ['주식계산기.kr', config.url]) inspectRobots(`Host: ${host}\nSitemap: https://주식계산기.kr/sitemap.xml`, config);
 assert.throws(() => inspectRobots('Host: other.example\nSitemap: https://주식계산기.kr/sitemap.xml', config));
});

check('IDN host and Korean path normalize independently without double encoding', () => {
 const input = 'https://주식계산기.kr/계산';
 const expected = 'https://xn--989a00a691bv6b3zl.kr/%EA%B3%84%EC%82%B0';
 const actual = siteUrl(input, config);
 assert.equal(actual.hostname, 'xn--989a00a691bv6b3zl.kr');
 assert.equal(actual.pathname, '/%EA%B3%84%EC%82%B0');
 assert.equal(siteUrl(actual.href, config).href, expected);
 inspectHtml(fixture().replace(/\/example/g, '/계산'), config, expected);
});

check('og:type must appear exactly once with a known value', () => {
 assert.equal(inspectHtml(fixture(), config, page).type, 'website');
 assert.equal(inspectHtml(fixture().replace('content="website"', 'content="article"'), config, page).type, 'article');
 for (const html of [fixture().replace('<meta property="og:type" content="website">', ''), fixture() + '<meta property="og:type" content="article">', fixture().replace('content="website"', 'content="profile"')]) assert.throws(() => inspectHtml(html, config, page));
});

check('declared OG image size must match the actual file', () => {
 const png = readFileSync('public/og-image.png');
 assert.deepEqual(imageInfo(png), { type: 'image/png', width: 1200, height: 630 });
 const sized = fixture().replace('<meta name="twitter:image"', '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:image"');
 const [entry] = inspectHtml(sized, config, page).imageEntries;
 assert.deepEqual(entry, { url: `${config.url}/og-image.png`, width: 1200, height: 630 });
 assertImageSize(entry, png);
 assert.throws(() => assertImageSize({ ...entry, width: 1200, height: 600 }, png), /og:image:height 600/);
 assert.throws(() => assertImageSize({ ...entry, width: 800 }, png), /og:image:width 800/);
 assert.throws(() => imageInfo(Buffer.from('GIF89a not supported here')), /unsupported/);
 assert.throws(() => inspectHtml('<meta property="og:image:width" content="1200">' + fixture(), config, page), /without og:image/);
});

check('JPEG size is read from the frame header', () => {
 // SOI, APP0(len 4), SOF0(len 11, 8bit, h=630, w=1200, 1 comp)
 const jpeg = Buffer.from([0xff,0xd8, 0xff,0xe0,0x00,0x04,0x00,0x00, 0xff,0xc0,0x00,0x0b,0x08,0x02,0x76,0x04,0xb0,0x01,0x01,0x11,0x00]);
 assert.deepEqual(imageInfo(jpeg), { type: 'image/jpeg', width: 1200, height: 630 });
});
