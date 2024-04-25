const t = [
  '運', '氣', '數', '碼', '禮', '電', '親', '場', '韓', '國',
  '萬', '麗', '熱', '鍾', '喬', '禎'
]
const s = [
  '运', '气', '数', '码', '礼', '电', '亲', '场', '韩', '国',
  '万', '丽', '热', '钟', '乔', '祯'
]

const m = new Map<string, string>()
for (let idx = 0; idx < t.length; ++idx) {
  m.set(t[idx], s[idx])
}

export default function (str : string) {
  return Array.from(str).map(c => m.has(c) ? m.get(c) : c).join('')
}
