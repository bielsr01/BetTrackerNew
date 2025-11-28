import { Octokit } from '@octokit/rest'
import fs from 'fs'
import path from 'path'

let connectionSettings

async function getAccessToken() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null

  if (!xReplitToken) throw new Error('Token not found')

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0])

  return connectionSettings?.settings?.access_token
}

const IGNORE = [
  'node_modules', '.git', 'dist', 'build', '.env', 'attached_assets',
  'neon_backup.sql', 'package-lock.json', '*.js', '.cache'
]

function shouldIgnore(p) {
  return IGNORE.some(i => p.includes(i) || p.endsWith(i))
}

async function getFiles(dir, base = '') {
  const files = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const e of entries) {
    const full = path.join(dir, e.name)
    const rel = path.join(base, e.name)
    if (shouldIgnore(rel)) continue
    if (e.isDirectory()) {
      files.push(...await getFiles(full, rel))
    } else {
      files.push(rel)
    }
  }
  return files
}

async function uploadFiles() {
  const token = await getAccessToken()
  const octokit = new Octokit({ auth: token })
  
  console.log('🚀 Uploading to GitHub...\n')
  
  const files = await getFiles('/home/runner/workspace')
  console.log(`📦 ${files.length} files found\n`)
  
  let uploaded = 0, failed = 0
  
  // Upload em batch de 5 paralelos
  for (let i = 0; i < files.length; i += 5) {
    const batch = files.slice(i, i + 5)
    
    await Promise.all(batch.map(async (file) => {
      try {
        const content = fs.readFileSync(path.join('/home/runner/workspace', file), 'utf8')
        await octokit.repos.createOrUpdateFileContents({
          owner: 'bielsr01',
          repo: 'BetTrackerNew',
          path: file,
          message: `Add ${file}`,
          content: Buffer.from(content).toString('base64'),
          branch: 'main'
        })
        uploaded++
      } catch (e) {
        failed++
      }
    }))
    
    console.log(`✓ ${Math.min(uploaded + failed, files.length)}/${files.length}`)
  }
  
  console.log(`\n✅ Complete! Uploaded: ${uploaded}, Failed: ${failed}`)
  console.log('📍 https://github.com/bielsr01/BetTrackerNew\n')
}

uploadFiles().catch(e => {
  console.error('❌', e.message)
  process.exit(1)
})
