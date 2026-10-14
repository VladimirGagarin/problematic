import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const samplePath = join(root, 'src', 'data', 'samplePosts.js')
const sources = ['problematic_part1.txt', 'problematic_part2.txt']

const singleLine = (value) => String(value).replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim()
const quoted = (value) => "'" + singleLine(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"

function makeTitle(question) {
  const clean = singleLine(question)
  const punct = clean.search(/[.?!]/)
  let title = punct > 14 ? clean.slice(0, punct) : clean
  if (title.length > 92) {
    const cut = title.lastIndexOf(' ', 88)
    title = (cut > 40 ? title.slice(0, cut) : title.slice(0, 88)).trim() + '\u2026'
  }
  return title
}

const entries = []
sources.forEach((file, partIndex) => {
  const text = readFileSync(join(root, file), 'utf8')
  let type = null
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim()
    if (!line) continue
    const header = line.match(/^\[([a-z-]+)\]\s*-->$/)
    if (header) {
      type = header[1]
      continue
    }
    const item = line.match(/^\[([a-z-]+)\]\s+(.+)$/)
    if (item && type) {
      entries.push({
        id: `qb-p${partIndex + 1}-${type}-${item[1]}`,
        type,
        category: item[1],
        question: item[2].trim()
      })
    }
  }
})

const base = Date.parse('2026-10-12T00:00:00Z')
const objects = entries
  .map((entry, index) => {
    const lines = [
      '  {',
      `    id: ${quoted(entry.id)},`,
      `    title: ${quoted(makeTitle(entry.question))},`,
      `    type: ${quoted(entry.type)},`,
      `    category: ${quoted(entry.category)},`,
      '    secondaryCategories: [],',
      "    difficulty: 'medium',",
      `    problem: ${quoted(entry.question)},`,
      "    author: 'Problematic Team',",
      `    createdAt: ${quoted(new Date(base + index * 60000).toISOString())},`,
      '    voteCount: 0,',
      '    commentCount: 0,',
      '    shareCount: 0,',
      "    solutionStatus: 'unsolved',",
      '    hints: []',
      '  }'
    ]
    return lines.join('\n')
  })
  .join(',\n')

const source = readFileSync(samplePath, 'utf8')
if (source.includes("id: 'qb-p1-")) {
  console.log('Question bank already imported — nothing to do.')
  process.exit(0)
}

const marker = '\n]\n\nconst commentsByPost = {'
if (!source.includes(marker)) {
  throw new Error('Could not find the end of the samplePosts array.')
}

const updated = source.replace(marker, ',\n' + objects + marker)
writeFileSync(samplePath, updated, 'utf8')

console.log(`Imported ${entries.length} questions into samplePosts.js`)
