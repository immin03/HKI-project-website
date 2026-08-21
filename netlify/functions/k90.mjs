import { createHash } from 'node:crypto'

const DEFAULT_PASSWORD = 'Komatsu90!'
const MAX_INQUIRIES = 400

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  })

export const config = { path: '/api/k90' }

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response('', { status: 204 })
  if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405)

  let body = {}
  try { body = await req.json() } catch { return json({ ok: false, error: 'body' }, 400) }

  const action = body.action
  try {
    if (action === 'visit') return await recordVisit()
    if (action === 'inquiry') return await recordInquiry(body)
    if (action === 'admin') return await adminData(body.password)
    return json({ ok: false, error: 'action' }, 400)
  } catch (err) {
    return json({ ok: false, error: 'store', detail: String(err && err.message || err) }, 500)
  }
}

function seoulDay(d = new Date()) {
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' })
}

function sha256(text) {
  return createHash('sha256').update(String(text || ''), 'utf8').digest('hex')
}

function safeEq(a, b) {
  if (!a || !b || a.length !== b.length) return false
  let x = 0
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return x === 0
}

function passwordOk(password) {
  const got = String(password || '')
  const expected = process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD
  if (got === expected) return true
  const expectedHash = (process.env.ADMIN_PASSWORD_SHA256 || sha256(expected)).toLowerCase()
  return safeEq(sha256(got), expectedHash)
}

function clip(v, n) {
  return String(v == null ? '' : v).trim().slice(0, n)
}

async function store() {
  const { getStore } = await import('@netlify/blobs')
  return getStore('k90-admin')
}

async function readJson(key, fallback) {
  const raw = await (await store()).get(key, { type: 'json' })
  return raw == null ? fallback : raw
}

async function writeJson(key, value) {
  await (await store()).setJSON(key, value)
}

async function recordVisit() {
  const day = seoulDay()
  const visits = await readJson('visits', {})
  visits[day] = (Number(visits[day]) || 0) + 1
  const keys = Object.keys(visits).sort()
  while (keys.length > 120) delete visits[keys.shift()]
  await writeJson('visits', visits)
  return json({ ok: true, day, count: visits[day] })
}

async function recordInquiry(body) {
  const name = clip(body.name, 30)
  const phone = clip(body.phone, 20)
  if (!name || phone.replace(/\D/g, '').length < 9) {
    return json({ ok: false, error: 'fields' }, 400)
  }
  const item = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    at: new Date().toISOString(),
    name,
    phone,
    email: clip(body.email, 80),
    interest: clip(body.interest, 40),
    region: clip(body.region, 40),
    message: clip(body.message, 1000)
  }
  const list = await readJson('inquiries', [])
  list.unshift(item)
  await writeJson('inquiries', list.slice(0, MAX_INQUIRIES))
  return json({ ok: true })
}

async function adminData(password) {
  if (!passwordOk(password)) {
    return json({ ok: false, error: 'auth' }, 401)
  }
  const visits = await readJson('visits', {})
  const inquiries = await readJson('inquiries', [])
  const today = seoulDay()
  const days = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    const key = seoulDay(d)
    days.push({ date: key, count: Number(visits[key]) || 0 })
  }
  const week = days.slice(-7).reduce((s, x) => s + x.count, 0)
  return json({
    ok: true,
    today,
    todayCount: Number(visits[today]) || 0,
    weekCount: week,
    days,
    inquiries
  })
}
