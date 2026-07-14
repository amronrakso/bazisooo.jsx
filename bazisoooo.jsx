https://claude.ai/share/f8d4ae60-00cd-4436-819f-557dc6b803b9
import { useState, useMemo } from "react";

// ── BAZ ALPHABET DATA ─────────────────────────────────────────────────────────
// 145575 unique codepoints | 154 writing systems | 17.1514 bits/symbol
// IPv6 128-bit → exactly 8 BAZ symbols (vs 39 hex chars)

const BAZ_TOTAL = 145575;
const BAZ_IPV6_WIDTH = 8;

// per-script metadata: name, colour, sample glyph, codepoint count
const SCRIPT_META = [{"n":"Latin","c":"#60a5fa","s":"A","cnt":1128},{"n":"Greek/Coptic","c":"#38bdf8","s":"Ω","cnt":528},{"n":"Cyrillic","c":"#22d3ee","s":"Я","cnt":448},{"n":"Armenian","c":"#34d399","s":"Ա","cnt":90},{"n":"Georgian","c":"#4ade80","s":"ა","cnt":192},{"n":"Glagolitic","c":"#86efac","s":"Ⰰ","cnt":144},{"n":"Runic","c":"#bbf7d0","s":"ᚠ","cnt":96},{"n":"Ogham","c":"#fde68a","s":"ᚁ","cnt":32},{"n":"Hebrew","c":"#818cf8","s":"א","cnt":58},{"n":"Arabic","c":"#60a5fa","s":"ع","cnt":1232},{"n":"Syriac","c":"#38bdf8","s":"ܐ","cnt":96},{"n":"Thaana","c":"#22d3ee","s":"ތ","cnt":64},{"n":"NKo","c":"#34d399","s":"ߊ","cnt":64},{"n":"Samaritan","c":"#4ade80","s":"ࠀ","cnt":64},{"n":"Mandaic","c":"#86efac","s":"ࡀ","cnt":32},{"n":"Adlam","c":"#86efac","s":"𞤀","cnt":96},{"n":"Hanifi Rohingya","c":"#4ade80","s":"𐴀","cnt":64},{"n":"Yezidi","c":"#34d399","s":"𐺀","cnt":64},{"n":"Sogdian","c":"#38bdf8","s":"𐼰","cnt":64},{"n":"Old Uyghur","c":"#60a5fa","s":"𐽰","cnt":64},{"n":"Old Turkic","c":"#a78bfa","s":"𐰀","cnt":80},{"n":"Old Hungarian","c":"#818cf8","s":"𐲀","cnt":128},{"n":"Avestan","c":"#e879f9","s":"𐬀","cnt":64},{"n":"Old S.Arabian","c":"#f472b6","s":"𐩠","cnt":64},{"n":"Nabataean","c":"#f87171","s":"𐢠","cnt":48},{"n":"Palmyrene","c":"#fb923c","s":"𐡠","cnt":32},{"n":"Imp.Aramaic","c":"#fbbf24","s":"𐢀","cnt":32},{"n":"Phoenician","c":"#fde68a","s":"𐤀","cnt":32},{"n":"Lydian","c":"#fb7185","s":"𐤠","cnt":32},{"n":"Insc.Pahlavi","c":"#c084fc","s":"𐭠","cnt":32},{"n":"Cypriot","c":"#fb7185","s":"𐠀","cnt":64},{"n":"Linear B","c":"#fb923c","s":"𐀀","cnt":256},{"n":"Linear A","c":"#fbbf24","s":"𐘀","cnt":384},{"n":"Ugaritic","c":"#e879f9","s":"𐎀","cnt":32},{"n":"Old Persian","c":"#f472b6","s":"𐎠","cnt":64},{"n":"Old Italic","c":"#fb923c","s":"𐌀","cnt":48},{"n":"Gothic","c":"#fbbf24","s":"𐌰","cnt":32},{"n":"Deseret","c":"#f87171","s":"𐐀","cnt":80},{"n":"Shavian","c":"#fb7185","s":"𐑐","cnt":48},{"n":"Osage","c":"#f472b6","s":"𐓂","cnt":80},{"n":"Elbasan","c":"#e879f9","s":"𐔀","cnt":48},{"n":"Vithkuqi","c":"#c084fc","s":"𐖠","cnt":80},{"n":"Old Permic","c":"#a78bfa","s":"𐍐","cnt":48},{"n":"Devanagari","c":"#fde68a","s":"क","cnt":256},{"n":"Bengali","c":"#fbbf24","s":"ক","cnt":128},{"n":"Gurmukhi","c":"#fb923c","s":"ਕ","cnt":128},{"n":"Gujarati","c":"#f87171","s":"ક","cnt":128},{"n":"Oriya","c":"#fb7185","s":"କ","cnt":128},{"n":"Tamil","c":"#f472b6","s":"க","cnt":192},{"n":"Telugu","c":"#e879f9","s":"క","cnt":128},{"n":"Kannada","c":"#c084fc","s":"ಕ","cnt":128},{"n":"Malayalam","c":"#a78bfa","s":"ക","cnt":128},{"n":"Sinhala","c":"#818cf8","s":"ක","cnt":160},{"n":"Brahmi","c":"#60a5fa","s":"𑀀","cnt":128},{"n":"Kaithi","c":"#38bdf8","s":"𑂀","cnt":80},{"n":"Sora Sompeng","c":"#22d3ee","s":"𑃐","cnt":48},{"n":"Chakma","c":"#34d399","s":"𑄀","cnt":80},{"n":"Sharada","c":"#4ade80","s":"𑆀","cnt":96},{"n":"Khojki","c":"#86efac","s":"𑈀","cnt":80},{"n":"Multani","c":"#fde68a","s":"𑊀","cnt":48},{"n":"Khudawadi","c":"#fbbf24","s":"𑋐","cnt":80},{"n":"Grantha","c":"#fb923c","s":"𑌅","cnt":128},{"n":"Newa","c":"#f87171","s":"𑐀","cnt":128},{"n":"Tirhuta","c":"#fb7185","s":"𑒀","cnt":96},{"n":"Siddham","c":"#f472b6","s":"𑖀","cnt":128},{"n":"Modi","c":"#e879f9","s":"𑘀","cnt":96},{"n":"Takri","c":"#c084fc","s":"𑚀","cnt":80},{"n":"Ahom","c":"#a78bfa","s":"𑜀","cnt":80},{"n":"Dogra","c":"#818cf8","s":"𑠀","cnt":80},{"n":"Nandinagari","c":"#60a5fa","s":"𑧐","cnt":96},{"n":"Zanabazar Sq.","c":"#38bdf8","s":"𑨀","cnt":80},{"n":"Soyombo","c":"#22d3ee","s":"𑩐","cnt":96},{"n":"Pau Cin Hau","c":"#34d399","s":"𑫀","cnt":64},{"n":"Bhaiksuki","c":"#4ade80","s":"𑰀","cnt":112},{"n":"Marchen","c":"#86efac","s":"𑱀","cnt":80},{"n":"Masaram Gondi","c":"#fde68a","s":"𑴀","cnt":96},{"n":"Gunjala Gondi","c":"#fbbf24","s":"𑶀","cnt":80},{"n":"Makasar","c":"#fb923c","s":"𑻠","cnt":32},{"n":"Kawi","c":"#f87171","s":"𑼀","cnt":96},{"n":"Thai","c":"#fb7185","s":"ก","cnt":128},{"n":"Lao","c":"#f472b6","s":"ກ","cnt":128},{"n":"Tibetan","c":"#e879f9","s":"ཀ","cnt":256},{"n":"Myanmar","c":"#c084fc","s":"က","cnt":224},{"n":"Khmer","c":"#a78bfa","s":"ក","cnt":160},{"n":"Tai Le","c":"#818cf8","s":"ᥐ","cnt":48},{"n":"New Tai Lue","c":"#60a5fa","s":"ᦀ","cnt":96},{"n":"Buginese","c":"#38bdf8","s":"ᨀ","cnt":32},{"n":"Tai Tham","c":"#22d3ee","s":"ᨠ","cnt":144},{"n":"Balinese","c":"#34d399","s":"ᬀ","cnt":128},{"n":"Sundanese","c":"#4ade80","s":"ᮀ","cnt":80},{"n":"Batak","c":"#86efac","s":"ᯀ","cnt":64},{"n":"Lepcha","c":"#fde68a","s":"ᰀ","cnt":80},{"n":"Ol Chiki","c":"#fbbf24","s":"ᱠ","cnt":48},{"n":"Tai Viet","c":"#fb923c","s":"꠰","cnt":96},{"n":"Cham","c":"#f87171","s":"ꨀ","cnt":96},{"n":"Javanese","c":"#fb7185","s":"ꦀ","cnt":96},{"n":"Kayah Li","c":"#f472b6","s":"꤀","cnt":48},{"n":"Rejang","c":"#e879f9","s":"ꤰ","cnt":48},{"n":"Saurashtra","c":"#c084fc","s":"ꢀ","cnt":96},{"n":"Syloti Nagri","c":"#a78bfa","s":"ꠀ","cnt":48},{"n":"Meetei Mayek","c":"#818cf8","s":"ꫠ","cnt":96},{"n":"Pahawh Hmong","c":"#60a5fa","s":"𖬀","cnt":144},{"n":"Miao","c":"#38bdf8","s":"𖼀","cnt":160},{"n":"Tangsa","c":"#22d3ee","s":"𖩰","cnt":96},{"n":"Hangul","c":"#34d399","s":"한","cnt":11540},{"n":"Hiragana","c":"#4ade80","s":"あ","cnt":198},{"n":"Katakana","c":"#86efac","s":"ア","cnt":374},{"n":"Bopomofo","c":"#fde68a","s":"ㄅ","cnt":75},{"n":"CJK Ext-A","c":"#fbbf24","s":"㐀","cnt":6592},{"n":"CJK Unified","c":"#fb923c","s":"字","cnt":20992},{"n":"CJK Compat","c":"#f87171","s":"豈","cnt":512},{"n":"Yi","c":"#fb7185","s":"ꀀ","cnt":1168},{"n":"Lisu","c":"#f472b6","s":"ꓐ","cnt":48},{"n":"Vai","c":"#e879f9","s":"ꔀ","cnt":320},{"n":"Bamum","c":"#c084fc","s":"ꤰ","cnt":672},{"n":"Mro","c":"#a78bfa","s":"𖩀","cnt":48},{"n":"CJK Ext-B","c":"#818cf8","s":"𠀀","cnt":42720},{"n":"CJK Ext-C","c":"#60a5fa","s":"𪜀","cnt":4160},{"n":"CJK Ext-D","c":"#38bdf8","s":"𫠠","cnt":224},{"n":"CJK Ext-E","c":"#22d3ee","s":"𫠀","cnt":5776},{"n":"CJK Ext-F","c":"#34d399","s":"𮀀","cnt":7488},{"n":"CJK Ext-G","c":"#4ade80","s":"𰀀","cnt":4944},{"n":"CJK Ext-H","c":"#86efac","s":"𱀀","cnt":4192},{"n":"CJK Ext-I","c":"#fde68a","s":"𮿰","cnt":624},{"n":"Tangut","c":"#fbbf24","s":"𗀀","cnt":7040},{"n":"Khitan Small","c":"#fb923c","s":"𘠀","cnt":512},{"n":"Nushu","c":"#f87171","s":"𛅰","cnt":400},{"n":"Ethiopic","c":"#fb7185","s":"አ","cnt":592},{"n":"Tifinagh","c":"#f472b6","s":"ⴰ","cnt":80},{"n":"Osmanya","c":"#e879f9","s":"𐒀","cnt":48},{"n":"Mende Kikakui","c":"#c084fc","s":"𞠀","cnt":224},{"n":"Medefaidrin","c":"#a78bfa","s":"𖺀","cnt":96},{"n":"Bassa Vah","c":"#818cf8","s":"𖫐","cnt":48},{"n":"Cherokee","c":"#60a5fa","s":"Ꭰ","cnt":176},{"n":"Unified Syllabics","c":"#38bdf8","s":"ᐁ","cnt":736},{"n":"Mongolian","c":"#22d3ee","s":"ᠠ","cnt":192},{"n":"Phags-pa","c":"#34d399","s":"ꡀ","cnt":64},{"n":"Cuneiform","c":"#4ade80","s":"𒀀","cnt":1360},{"n":"Egyptian Hier.","c":"#86efac","s":"𓀀","cnt":1072},{"n":"Anatolian Hier.","c":"#fde68a","s":"𔐀","cnt":640},{"n":"Cypro-Minoan","c":"#fbbf24","s":"𒐀","cnt":112},{"n":"Meroitic","c":"#c084fc","s":"𐦠","cnt":128},{"n":"Kharoshthi","c":"#a78bfa","s":"𐨀","cnt":96},{"n":"Lycian","c":"#818cf8","s":"𐊀","cnt":32},{"n":"Carian","c":"#60a5fa","s":"𐊠","cnt":64},{"n":"Braille","c":"#38bdf8","s":"⠿","cnt":256},{"n":"Musical Notation","c":"#22d3ee","s":"𝄞","cnt":512},{"n":"Math Alphanum.","c":"#34d399","s":"𝐀","cnt":1024},{"n":"Duployan","c":"#4ade80","s":"𛰀","cnt":160},{"n":"SignWriting","c":"#86efac","s":"𝠀","cnt":688},{"n":"Emoji","c":"#fbbf24","s":"😀","cnt":2048},{"n":"Misc Symbols","c":"#fb923c","s":"★","cnt":704},{"n":"Math Operators","c":"#f87171","s":"∑","cnt":688},{"n":"Mahjong/Cards","c":"#fb7185","s":"🀄","cnt":256}];

// parallel array: Unicode ranges per script (hex literals, deduped)
const SCRIPT_RANGES = [[[0x41,0x7A],[0xC0,0xD6],[0xD8,0xF6],[0xF8,0x24F],[0x250,0x2AF],[0x1E00,0x1EFF],[0x2C60,0x2C7F],[0xA720,0xA7FF],[0xAB30,0xAB6F]],[[0x370,0x3FF],[0x1F00,0x1FFF],[0x2C80,0x2CFF]],[[0x400,0x52F],[0x1C80,0x1C8F],[0x2DE0,0x2DFF],[0xA640,0xA69F]],[[0x531,0x58A]],[[0x10A0,0x10FF],[0x1C90,0x1CBF],[0x2D00,0x2D2F]],[[0x2C00,0x2C5F],[0x1E000,0x1E02F]],[[0x16A0,0x16FF]],[[0x1680,0x169F]],[[0x5D0,0x5EA],[0xFB1D,0xFB36],[0xFB38,0xFB3C]],[[0x600,0x6FF],[0x750,0x77F],[0x8A0,0x8FF],[0xFB50,0xFDFF],[0xFE70,0xFEFF]],[[0x700,0x74F],[0x860,0x86F]],[[0x780,0x7BF]],[[0x7C0,0x7FF]],[[0x800,0x83F]],[[0x840,0x85F]],[[0x1E900,0x1E95F]],[[0x10D00,0x10D3F]],[[0x10E80,0x10EBF]],[[0x10F30,0x10F6F]],[[0x10F70,0x10FAF]],[[0x10C00,0x10C4F]],[[0x10C80,0x10CFF]],[[0x10B00,0x10B3F]],[[0x10A60,0x10A9F]],[[0x10880,0x108AF]],[[0x10860,0x1087F]],[[0x10840,0x1085F]],[[0x10900,0x1091F]],[[0x10920,0x1093F]],[[0x10B60,0x10B7F]],[[0x10800,0x1083F]],[[0x10000,0x1007F],[0x10080,0x100FF]],[[0x10600,0x1077F]],[[0x10380,0x1039F]],[[0x103A0,0x103DF]],[[0x10300,0x1032F]],[[0x10330,0x1034F]],[[0x10400,0x1044F]],[[0x10450,0x1047F]],[[0x104B0,0x104FF]],[[0x10500,0x1052F]],[[0x10570,0x105BF]],[[0x10350,0x1037F]],[[0x900,0x97F],[0xA8E0,0xA8FF],[0x11B00,0x11B5F]],[[0x980,0x9FF]],[[0xA00,0xA7F]],[[0xA80,0xAFF]],[[0xB00,0xB7F]],[[0xB80,0xBFF],[0x11FC0,0x11FFF]],[[0xC00,0xC7F]],[[0xC80,0xCFF]],[[0xD00,0xD7F]],[[0xD80,0xDFF],[0x111E0,0x111FF]],[[0x11000,0x1107F]],[[0x11080,0x110CF]],[[0x110D0,0x110FF]],[[0x11100,0x1114F]],[[0x11180,0x111DF]],[[0x11200,0x1124F]],[[0x11280,0x112AF]],[[0x112B0,0x112FF]],[[0x11300,0x1137F]],[[0x11400,0x1147F]],[[0x11480,0x114DF]],[[0x11580,0x115FF]],[[0x11600,0x1165F]],[[0x11680,0x116CF]],[[0x11700,0x1174F]],[[0x11800,0x1184F]],[[0x119A0,0x119FF]],[[0x11A00,0x11A4F]],[[0x11A50,0x11AAF]],[[0x11AC0,0x11AFF]],[[0x11C00,0x11C6F]],[[0x11C70,0x11CBF]],[[0x11D00,0x11D5F]],[[0x11D60,0x11DAF]],[[0x11EE0,0x11EFF]],[[0x11F00,0x11F5F]],[[0xE00,0xE7F]],[[0xE80,0xEFF]],[[0xF00,0xFFF]],[[0x1000,0x109F],[0xA9E0,0xA9FF],[0xAA60,0xAA7F]],[[0x1780,0x17FF],[0x19E0,0x19FF]],[[0x1950,0x197F]],[[0x1980,0x19DF]],[[0x1A00,0x1A1F]],[[0x1A20,0x1AAF]],[[0x1B00,0x1B7F]],[[0x1B80,0x1BBF],[0x1CC0,0x1CCF]],[[0x1BC0,0x1BFF]],[[0x1C00,0x1C4F]],[[0x1C50,0x1C7F]],[[0xAA80,0xAADF]],[[0xAA00,0xAA5F]],[[0xA980,0xA9DF]],[[0xA900,0xA92F]],[[0xA930,0xA95F]],[[0xA880,0xA8DF]],[[0xA800,0xA82F]],[[0xABC0,0xABFF],[0xAAE0,0xAAFF]],[[0x16B00,0x16B8F]],[[0x16F00,0x16F9F]],[[0x16A70,0x16ACF]],[[0xAC00,0xD7A3],[0x1100,0x11FF],[0xA960,0xA97F],[0xD7B0,0xD7FF]],[[0x3041,0x3096],[0x1B100,0x1B12F],[0x1B130,0x1B16F]],[[0x30A1,0x30F6],[0x31F0,0x31FF],[0x1B000,0x1B0FF],[0x1AFF0,0x1AFFF]],[[0x3105,0x312F],[0x31A0,0x31BF]],[[0x3400,0x4DBF]],[[0x4E00,0x9FFF]],[[0xF900,0xFAFF]],[[0xA000,0xA48F]],[[0xA4D0,0xA4FF]],[[0xA500,0xA63F]],[[0xA6A0,0xA6FF],[0x16800,0x16A3F]],[[0x16A40,0x16A6F]],[[0x20000,0x2A6DF]],[[0x2A700,0x2B73F]],[[0x2B740,0x2B81F]],[[0x2B820,0x2CEAF]],[[0x2CEB0,0x2EBEF]],[[0x30000,0x3134F]],[[0x31350,0x323AF]],[[0x2EBF0,0x2EE5F]],[[0x17000,0x187FF],[0x18800,0x18AFF],[0x18D00,0x18D7F]],[[0x18B00,0x18CFF]],[[0x1B170,0x1B2FF]],[[0x1200,0x137F],[0x1380,0x139F],[0x2D80,0x2DDF],[0xAB00,0xAB2F],[0x1E7E0,0x1E7FF]],[[0x2D30,0x2D7F]],[[0x10480,0x104AF]],[[0x1E800,0x1E8DF]],[[0x16E40,0x16E9F]],[[0x16AD0,0x16AFF]],[[0x13A0,0x13FF],[0xAB70,0xABBF]],[[0x1400,0x167F],[0x18B0,0x18FF],[0x11AB0,0x11ABF]],[[0x1800,0x18AF],[0x11660,0x1166F]],[[0xA840,0xA87F]],[[0x12000,0x123FF],[0x12400,0x1247F],[0x12480,0x1254F]],[[0x13000,0x1342F]],[[0x14400,0x1467F]],[[0x12F90,0x12FFF]],[[0x10980,0x1099F],[0x109A0,0x109FF]],[[0x10A00,0x10A5F]],[[0x10280,0x1029F]],[[0x102A0,0x102DF]],[[0x2800,0x28FF]],[[0x1D100,0x1D1FF],[0x1D000,0x1D0FF]],[[0x1D400,0x1D7FF]],[[0x1BC00,0x1BC9F]],[[0x1D800,0x1DAAF]],[[0x1F300,0x1F9FF],[0x1FA00,0x1FAFF]],[[0x2600,0x26FF],[0x2700,0x27BF],[0x2B00,0x2BFF]],[[0x2200,0x22FF],[0x2A00,0x2AFF],[0x27C0,0x27EF],[0x2980,0x29FF]],[[0x1F000,0x1F0FF]]];

// ── ALPHABET BUILD (useMemo) ───────────────────────────────────────────────────
function buildAlphabet() {
  const pts = [];
  const seen = new Set();
  for (let si = 0; si < SCRIPT_RANGES.length; si++) {
    const ranges = SCRIPT_RANGES[si];
    for (let ri = 0; ri < ranges.length; ri++) {
      const lo = ranges[ri][0], hi = ranges[ri][1];
      for (let cp = lo; cp <= hi; cp++) {
        if (cp >= 0xD800 && cp <= 0xDFFF) continue;
        if (!seen.has(cp)) { seen.add(cp); pts.push(cp); }
      }
    }
  }
  const map = new Map(pts.map((cp, i) => [cp, i]));
  return { pts, map };
}

// ── ENCODE: bytes → BAZ (BigInt base-N) ───────────────────────────────────────
function bazEncode(bytes, pts) {
  if (!bytes.length) return "";
  const B = BigInt(pts.length);
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  if (n === 0n) return String.fromCodePoint(pts[0]);
  const digits = [];
  while (n > 0n) { digits.push(Number(n % B)); n /= B; }
  digits.reverse();
  return digits.map(d => String.fromCodePoint(pts[d])).join("");
}

// ── ENCODE FIXED-WIDTH: IPv6 128-bit → exactly W symbols ─────────────────────
function bazEncodeFixed(bytes, pts, W) {
  const B = BigInt(pts.length);
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  const digits = [];
  for (let i = 0; i < W; i++) { digits.push(Number(n % B)); n /= B; }
  digits.reverse();
  return digits.map(d => String.fromCodePoint(pts[d])).join("");
}

// ── DECODE: BAZ → bytes ───────────────────────────────────────────────────────
function bazDecode(str, pts, map) {
  const chars = [...str];
  if (!chars.length) return new Uint8Array(0);
  const B = BigInt(pts.length);
  let n = 0n;
  for (const ch of chars) {
    const cp = ch.codePointAt(0);
    const idx = map.get(cp);
    if (idx === undefined) throw new Error(`Not in BAZ alphabet: "${ch}" U+${cp.toString(16).toUpperCase()}`);
    n = n * B + BigInt(idx);
  }
  const bytes = [];
  while (n > 0n) { bytes.push(Number(n & 0xFFn)); n >>= 8n; }
  if (!bytes.length) bytes.push(0);
  return new Uint8Array(bytes.reverse());
}

// ── IPv6 HELPERS ──────────────────────────────────────────────────────────────
function parseIPv6(s) {
  s = s.trim();
  if (s.includes("::")) {
    const [l, r] = s.split("::");
    const lp = l ? l.split(":") : [];
    const rp = r ? r.split(":") : [];
    const fill = new Array(8 - lp.length - rp.length).fill("0");
    s = [...lp, ...fill, ...rp].join(":");
  }
  const g = s.split(":");
  if (g.length !== 8) throw new Error("IPv6 needs 8 groups");
  const b = new Uint8Array(16);
  for (let i = 0; i < 8; i++) {
    const v = parseInt(g[i] || "0", 16);
    if (isNaN(v) || v < 0 || v > 0xFFFF) throw new Error(`Bad group: ${g[i]}`);
    b[i*2] = (v>>8)&0xFF; b[i*2+1] = v&0xFF;
  }
  return b;
}

function formatIPv6(bytes) {
  const g = [];
  for (let i = 0; i < 16; i+=2)
    g.push(((bytes[i]<<8)|bytes[i+1]).toString(16).padStart(4,"0"));
  return g.join(":");
}

function decodeIPv6BAZ(str, pts, map) {
  const chars = [...str];
  if (chars.length !== BAZ_IPV6_WIDTH)
    throw new Error(`Need exactly ${BAZ_IPV6_WIDTH} symbols, got ${chars.length}`);
  const B = BigInt(pts.length);
  let n = 0n;
  for (const ch of chars) {
    const i = map.get(ch.codePointAt(0));
    if (i === undefined) throw new Error(`Unknown symbol: "${ch}"`);
    n = n * B + BigInt(i);
  }
  const bytes = new Uint8Array(16);
  for (let i = 15; i >= 0; i--) { bytes[i] = Number(n & 0xFFn); n >>= 8n; }
  return formatIPv6(bytes);
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────
export default function BAZiSoooo() {
  const [tab, setTab]           = useState("ipv6");
  const [ipv6In, setIpv6In]     = useState("2001:0db8:85a3:0000:0000:8a2e:0370:7334");
  const [ipv6Enc, setIpv6Enc]   = useState("");
  const [ipv6DecIn, setIpv6DecIn] = useState("");
  const [ipv6Dec, setIpv6Dec]   = useState("");
  const [textIn, setTextIn]     = useState("Hello, World!");
  const [textEnc, setTextEnc]   = useState("");
  const [bazDecIn, setBazDecIn] = useState("");
  const [textDec, setTextDec]   = useState("");
  const [err, setErr]           = useState("");
  const [loading, setLoading]   = useState(true);

  const { pts, map } = useMemo(() => {
    const r = buildAlphabet();
    setLoading(false);
    return r;
  }, []);

  const run = fn => { setErr(""); try { fn(); } catch(e) { setErr(e.message); } };

  const C = {
    bg:"#07070f", card:"#0e0e1c", border:"#1a1a2e",
    accent:"#4c9aff", text:"#e2e8f0", muted:"#6b7280",
    green:"#34d399", red:"#f87171"
  };

  const inp = {
    display:"block", width:"100%", background:"#04040c",
    border:`1px solid ${C.border}`, color:C.text,
    padding:"0.5rem 0.65rem", borderRadius:"6px",
    marginTop:"0.3rem", fontFamily:"monospace",
    fontSize:"0.92rem", boxSizing:"border-box", outline:"none"
  };
  const btnA = {
    background:C.accent, color:"#000", border:"none",
    padding:"0.45rem 1.1rem", borderRadius:"6px",
    cursor:"pointer", fontFamily:"monospace", fontWeight:"bold",
    marginTop:"0.55rem"
  };
  const btnB = {
    ...btnA, background:C.card, color:C.text,
    border:`1px solid ${C.border}`
  };
  const lbl = { color:C.muted, fontSize:"0.75rem", letterSpacing:"0.03em" };

  const ResultBox = ({ label, value, big, col }) =>
    value ? (
      <div style={{ marginTop:"0.85rem" }}>
        <div style={lbl}>{label}</div>
        <div style={{
          background:"#04040c", border:`1px solid ${col||C.accent}`,
          borderLeft:`4px solid ${col||C.accent}`, borderRadius:"6px",
          padding:"0.7rem 0.85rem", marginTop:"0.2rem",
          fontSize: big ? "1.7rem" : "0.9rem",
          wordBreak:"break-all", letterSpacing: big ? "0.06em" : "normal",
          lineHeight: big ? 1.4 : 1.6
        }}>{value}</div>
      </div>
    ) : null;

  const total = pts.length;
  const pct = n => `${((n/total)*100).toFixed(1)}%`;

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.text,
      fontFamily:"monospace", padding:"1.4rem", maxWidth:"680px", margin:"0 auto" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom:"1.3rem" }}>
        <h1 style={{ margin:0, fontSize:"1.45rem", letterSpacing:"-0.02em" }}>
          🧩 BAZiSoooo &nbsp;
          <span style={{ color:C.accent, fontWeight:900 }}>
            BASE{loading ? "…" : total.toLocaleString()}
          </span>
        </h1>
        <p style={{ margin:"0.25rem 0 0", color:C.muted, fontSize:"0.78rem", fontStyle:"italic" }}>
          "By the fog, the impossible dies" — IPv6 in {BAZ_IPV6_WIDTH} symbols · 154 writing systems
        </p>
      </div>

      {/* ── Stats bar ── */}
      {!loading && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.5rem", marginBottom:"1.3rem" }}>
          {[
            ["Symbols",     total.toLocaleString(),               "#a78bfa"],
            ["Bits/sym",    (Math.log2(total)).toFixed(2),         "#34d399"],
            ["IPv6 → BAZ",  `${BAZ_IPV6_WIDTH} symbols`,           "#fbbf24"],
            ["vs hex",      `${Math.round((1-BAZ_IPV6_WIDTH/39)*100)}% shorter`, "#f87171"],
          ].map(([l,v,c]) => (
            <div key={l} style={{ background:C.card, border:`1px solid ${C.border}`,
              padding:"0.5rem 0.65rem", borderRadius:"8px" }}>
              <div style={{ color:C.muted, fontSize:"0.62rem", textTransform:"uppercase", letterSpacing:"0.07em" }}>{l}</div>
              <div style={{ color:c, fontSize:"1rem", fontWeight:"bold", marginTop:"0.1rem" }}>{v}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Tabs ── */}
      <div style={{ display:"flex", gap:"0.35rem", marginBottom:"1rem" }}>
        {[["ipv6","🌐 IPv6"],["text","📝 Text"],["scripts","🗺 Scripts"]].map(([id,label]) => (
          <button key={id} onClick={() => { setErr(""); setTab(id); }} style={{
            background: tab===id ? C.accent : C.card,
            color: tab===id ? "#000" : C.text,
            border:`1px solid ${tab===id ? C.accent : C.border}`,
            padding:"0.38rem 0.8rem", borderRadius:"6px",
            cursor:"pointer", fontFamily:"monospace",
            fontWeight: tab===id ? "bold" : "normal", fontSize:"0.85rem"
          }}>{label}</button>
        ))}
      </div>

      {/* ── Error ── */}
      {err && (
        <div style={{ background:"#2a0808", border:`1px solid ${C.red}`,
          padding:"0.55rem 0.8rem", borderRadius:"6px",
          marginBottom:"0.9rem", color:C.red, fontSize:"0.82rem" }}>
          ⚠ {err}
        </div>
      )}

      {loading && (
        <div style={{ color:C.muted, padding:"1rem", textAlign:"center" }}>
          Building alphabet from 154 writing systems…
        </div>
      )}

      {/* ══ IPv6 TAB ══ */}
      {!loading && tab === "ipv6" && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"1.2rem" }}>
          <div style={{ color:C.accent, fontSize:"0.82rem", marginBottom:"0.9rem", fontWeight:"bold" }}>
            IPv6 ↔ BAZ — always {BAZ_IPV6_WIDTH} symbols (128 bits ÷ {(Math.log2(total)).toFixed(2)} bits/sym)
          </div>

          <div style={lbl}>IPv6 Address</div>
          <input value={ipv6In} onChange={e=>setIpv6In(e.target.value)} style={inp} />
          <button style={btnA}
            onClick={() => run(() => setIpv6Enc(bazEncodeFixed(parseIPv6(ipv6In), pts, BAZ_IPV6_WIDTH)))}>
            🔐 Encode → {BAZ_IPV6_WIDTH} symbols
          </button>

          <ResultBox
            label={`BAZ output — ${[...ipv6Enc].length} symbols (was ${ipv6In.trim().length} chars)`}
            value={ipv6Enc} big />

          <div style={{ borderTop:`1px solid ${C.border}`, margin:"1.2rem 0" }} />

          <div style={lbl}>Decode BAZ → IPv6 (paste {BAZ_IPV6_WIDTH} symbols)</div>
          <input value={ipv6DecIn} onChange={e=>setIpv6DecIn(e.target.value)}
            placeholder={`Paste ${BAZ_IPV6_WIDTH} BAZ symbols…`}
            style={{ ...inp, fontSize:"1.3rem" }} />
          <button style={btnB}
            onClick={() => run(() => setIpv6Dec(decodeIPv6BAZ(ipv6DecIn, pts, map)))}>
            🔓 Decode to IPv6
          </button>
          <ResultBox label="Decoded IPv6" value={ipv6Dec} col={C.green} />
        </div>
      )}

      {/* ══ TEXT TAB ══ */}
      {!loading && tab === "text" && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"1.2rem" }}>
          <div style={{ color:C.accent, fontSize:"0.82rem", marginBottom:"0.9rem", fontWeight:"bold" }}>
            Text / bytes → BAZ{total.toLocaleString()}
          </div>

          <div style={lbl}>Input text (UTF-8)</div>
          <textarea value={textIn} onChange={e=>setTextIn(e.target.value)}
            rows={3} style={{ ...inp, resize:"vertical" }} />
          <button style={btnA} onClick={() => run(() => {
            const bytes = new TextEncoder().encode(textIn);
            setTextEnc(bazEncode(bytes, pts));
          })}>🔐 Encode</button>

          {textEnc && <ResultBox
            label={`${new TextEncoder().encode(textIn).length} bytes → ${[...textEnc].length} BAZ symbols`}
            value={textEnc} />}

          <div style={{ borderTop:`1px solid ${C.border}`, margin:"1.2rem 0" }} />

          <div style={lbl}>Decode BAZ → Text</div>
          <textarea value={bazDecIn} onChange={e=>setBazDecIn(e.target.value)}
            rows={3} placeholder="Paste BAZ-encoded symbols…"
            style={{ ...inp, resize:"vertical" }} />
          <button style={btnB} onClick={() => run(() => {
            const bytes = bazDecode(bazDecIn, pts, map);
            setTextDec(new TextDecoder().decode(bytes));
          })}>🔓 Decode</button>
          <ResultBox label="Decoded text" value={textDec} col={C.green} />
        </div>
      )}

      {/* ══ SCRIPTS TAB ══ */}
      {!loading && tab === "scripts" && (
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:"10px", padding:"1.2rem" }}>
          <div style={{ color:C.accent, fontSize:"0.82rem", fontWeight:"bold", marginBottom:"0.3rem" }}>
            Alphabet — {total.toLocaleString()} codepoints · 154 writing systems
          </div>
          <div style={{ color:C.muted, fontSize:"0.72rem", marginBottom:"0.9rem" }}>
            Every human script: ancient → modern → symbolic
          </div>

          {/* Proportional colour bar */}
          <div style={{ display:"flex", height:"12px", borderRadius:"6px",
            overflow:"hidden", marginBottom:"1rem" }}>
            {SCRIPT_META.map(s => (
              <div key={s.n} title={`${s.n}: ${s.cnt.toLocaleString()}`}
                style={{ width:pct(s.cnt), background:s.c, minWidth:"1px" }} />
            ))}
          </div>

          {/* Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(165px,1fr))",
            gap:"0.4rem", maxHeight:"55vh", overflowY:"auto" }}>
            {[...SCRIPT_META].sort((a,b)=>b.cnt-a.cnt).map(s => (
              <div key={s.n} style={{ background:"#04040c",
                border:`1px solid ${C.border}`, borderRadius:"6px",
                padding:"0.4rem 0.55rem", display:"flex",
                alignItems:"center", gap:"0.5rem" }}>
                <span style={{ fontSize:"1.2rem", minWidth:"1.3rem", textAlign:"center" }}>{s.s}</span>
                <div>
                  <div style={{ color:s.c, fontSize:"0.68rem", fontWeight:"bold" }}>{s.n}</div>
                  <div style={{ color:C.muted, fontSize:"0.63rem" }}>{s.cnt.toLocaleString()} cp</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <div style={{ marginTop:"1.3rem", color:C.muted, fontSize:"0.65rem", textAlign:"center" }}>
        BAZiSoooo v1.0 · MIT · C89 MAP6 Atom ·&nbsp;
        <span style={{ fontStyle:"italic" }}>by the fog, the impossible dies</span>
      </div>
    </div>
  );
}