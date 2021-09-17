import fs from 'fs/promises'

const nextID = (await fs.readdir('./projectEuler/'))
  .map(fileName => +fileName.match(/(?<=\D )\d+/))
  .sort((a, b) => {
    if (a > b) return 1
    if (a < b) return -1

    return 0
  })
  .reduce((next, current, index, pn) => {
    if (next !== 1) return next
    if (pn[index + 1] - pn[index] !== 1) return current + 1

    return next
  }, 1)

import fetch from 'node-fetch'
const id = process.argv[2] === 'next' ? nextID : process.argv[2]
const response = await fetch(`https://projecteuler.net/problem=${id}`)

import cheerio from 'cheerio'
const $ = cheerio.load(await response.text())
const toText = s => $(s).text().trim()

const [title, name, content] = [
  '#problem_info', 'h2', '.problem_content'
].map(toText)

const problemText = `# ${title}: ${name}

${content}
`

const destination = `./projectEuler/${title}`

await fs.cp('./template', destination, { recursive: true })
await fs.appendFile(`${destination}/problem.md`, problemText)
