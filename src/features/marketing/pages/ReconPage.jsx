import { useEffect, useRef, useState } from 'react'
import { Search, Globe, Server, MapPin, Wifi, AlertCircle, Loader } from 'lucide-react'
import * as THREE from 'three'
import { useSEO } from '@/core/utils/useSEO'

/* ─── helpers ─────────────────────────────────────────────────── */
function latLonToVec3(lat, lon, r = 1) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  )
}

function buildCurve(from, to) {
  const mid = from.clone().add(to).normalize().multiplyScalar(1.4)
  return new THREE.QuadraticBezierCurve3(from, mid, to)
}

/* ─── Globe ────────────────────────────────────────────────────── */
function GlobeCanvas({ targetLat, targetLon, scanning }) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const frameRef = useRef(null)
  const markerRef = useRef(null)
  const arcRef = useRef(null)
  const pulseRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    const W = el.clientWidth, H = el.clientHeight

    // Scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
    camera.position.set(0, 0, 2.8)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Globe sphere
    const geo = new THREE.SphereGeometry(1, 64, 64)
    const mat = new THREE.MeshPhongMaterial({
      color: 0x030404,
      emissive: 0x0a1a0a,
      wireframe: false,
      transparent: true,
      opacity: 0.95,
    })
    const globe = new THREE.Mesh(geo, mat)
    scene.add(globe)

    // Wireframe overlay
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x88ad7c, wireframe: true, transparent: true, opacity: 0.08 })
    const wire = new THREE.Mesh(new THREE.SphereGeometry(1.001, 32, 32), wireMat)
    scene.add(wire)

    // Atmosphere glow
    const atmGeo = new THREE.SphereGeometry(1.08, 64, 64)
    const atmMat = new THREE.MeshBasicMaterial({ color: 0x88ad7c, transparent: true, opacity: 0.04, side: THREE.BackSide })
    scene.add(new THREE.Mesh(atmGeo, atmMat))

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.3))
    const dirLight = new THREE.DirectionalLight(0x88ad7c, 0.8)
    dirLight.position.set(5, 3, 5)
    scene.add(dirLight)
    const rimLight = new THREE.DirectionalLight(0x4488ff, 0.4)
    rimLight.position.set(-5, -3, -5)
    scene.add(rimLight)

    // Stars
    const starGeo = new THREE.BufferGeometry()
    const starVerts = []
    for (let i = 0; i < 2000; i++) {
      starVerts.push((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80)
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVerts, 3))
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.6 })))

    // Origin dot (South Africa)
    const originPos = latLonToVec3(-30, 25, 1.02)
    const originGeo = new THREE.SphereGeometry(0.018, 16, 16)
    const originMat = new THREE.MeshBasicMaterial({ color: 0x88ad7c })
    const originDot = new THREE.Mesh(originGeo, originMat)
    originDot.position.copy(originPos)
    scene.add(originDot)

    // Animate
    let t = 0
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)
      t += 0.005
      globe.rotation.y += 0.002
      wire.rotation.y += 0.002

      // Pulse origin
      const s = 1 + 0.3 * Math.sin(t * 3)
      originDot.scale.setScalar(s)

      // Pulse marker
      if (markerRef.current) {
        markerRef.current.rotation.y += 0.002
        const ms = 1 + 0.4 * Math.sin(t * 4)
        if (pulseRef.current) pulseRef.current.scale.setScalar(ms)
      }

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [])

  // Add/update target marker when lat/lon changes
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene || targetLat === null || targetLon === null) return

    // Remove old
    if (markerRef.current) { scene.remove(markerRef.current); markerRef.current = null }
    if (arcRef.current) { scene.remove(arcRef.current); arcRef.current = null }
    if (pulseRef.current) { scene.remove(pulseRef.current); pulseRef.current = null }

    const targetPos = latLonToVec3(targetLat, targetLon, 1.02)
    const originPos = latLonToVec3(-30, 25, 1.02)

    // Target dot
    const dotGeo = new THREE.SphereGeometry(0.022, 16, 16)
    const dotMat = new THREE.MeshBasicMaterial({ color: 0x00aaff })
    const dot = new THREE.Mesh(dotGeo, dotMat)
    dot.position.copy(targetPos)
    scene.add(dot)
    markerRef.current = dot

    // Pulse ring
    const ringGeo = new THREE.RingGeometry(0.03, 0.05, 32)
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.copy(targetPos)
    ring.lookAt(new THREE.Vector3(0, 0, 0))
    scene.add(ring)
    pulseRef.current = ring

    // Arc
    const curve = buildCurve(originPos, targetPos)
    const points = curve.getPoints(80)
    const arcGeo = new THREE.BufferGeometry().setFromPoints(points)
    const arcMat = new THREE.LineBasicMaterial({ color: 0x00aaff, transparent: true, opacity: 0.7 })
    const arc = new THREE.Line(arcGeo, arcMat)
    scene.add(arc)
    arcRef.current = arc

    // Rotate globe to face target
    const globeMesh = scene.children.find(c => c.geometry?.type === 'SphereGeometry' && !c.material?.wireframe)
    if (globeMesh) {
      const targetAngle = -((targetLon + 180) * Math.PI / 180) + Math.PI
      globeMesh.rotation.y = targetAngle
    }
  }, [targetLat, targetLon])

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  )
}

/* ─── DNS fetch via public APIs (no key needed) ─────────────────── */
async function lookupDomain(domain) {
  const clean = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim()

  // DNS over HTTPS (Cloudflare)
  const dohFetch = (type) =>
    fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(clean)}&type=${type}`, {
      headers: { Accept: 'application/dns-json' },
    }).then(r => r.json())

  const [aRes, mxRes, nsRes, txtRes] = await Promise.all([
    dohFetch('A'), dohFetch('MX'), dohFetch('NS'), dohFetch('TXT'),
  ])

  const extract = (res, type) =>
    (res.Answer || []).filter(r => r.type === type).map(r => r.data)

  const aRecords = extract(aRes, 1)
  const ip = aRecords[0] || null

  let geo = null
  if (ip) {
    try {
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`)
      geo = await geoRes.json()
    } catch { /* ignore */ }
  }

  return {
    domain: clean,
    ip,
    aRecords,
    mxRecords: extract(mxRes, 15),
    nsRecords: extract(nsRes, 2),
    txtRecords: extract(txtRes, 16),
    geo,
  }
}

/* ─── Result display ────────────────────────────────────────────── */
function RecordGroup({ label, records }) {
  if (!records?.length) return null
  return (
    <div className="space-y-1">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">{label}</p>
      {records.map((r, i) => (
        <p key={i} className="font-mono text-xs text-accent bg-accent/5 border border-accent/20 px-3 py-1.5 break-all">{r}</p>
      ))}
    </div>
  )
}

/* ─── Main page ─────────────────────────────────────────────────── */
export default function ReconPage() {
  useSEO({ title: 'Domain Recon', description: 'Live domain reconnaissance — DNS records, IP geolocation, and 3D globe tracking.', path: '/recon' })

  const [domain, setDomain] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleScan = async (e) => {
    e.preventDefault()
    if (!domain.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await lookupDomain(domain)
      setResult(data)
    } catch (err) {
      setError('Scan failed. Check the domain and try again.')
    } finally {
      setLoading(false)
    }
  }

  const lat = result?.geo?.latitude ?? null
  const lon = result?.geo?.longitude ?? null

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">

      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 border-b border-[var(--border)] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-64 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(136,173,124,0.08) 0%, transparent 70%)' }} />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="font-mono text-accent text-xs uppercase tracking-widest mb-3">// domain recon</p>
          <h1 className="font-mono font-black text-4xl md:text-5xl text-[var(--text-primary)] mb-4 leading-tight">Domain Recon Globe</h1>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-xl mx-auto">
            Enter a domain to resolve its DNS records, geolocate the server, and track it live on the 3D globe.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-10 px-4 sm:px-6 border-b border-[var(--border)]">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleScan} className="flex gap-0">
            <div className="flex-1 relative">
              <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="example.com"
                className="input-field pl-9 w-full font-mono text-sm"
                disabled={loading}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <button type="submit" disabled={loading || !domain.trim()} className="btn-primary px-6 flex items-center gap-2 text-sm disabled:opacity-50">
              {loading ? <Loader size={15} className="animate-spin" /> : <Search size={15} />}
              {loading ? 'Scanning...' : 'Scan'}
            </button>
          </form>
          {error && (
            <div className="mt-3 flex items-center gap-2 text-xs font-mono text-red-400 border border-red-400/20 bg-red-400/5 px-3 py-2">
              <AlertCircle size={13} /> {error}
            </div>
          )}
        </div>
      </section>

      {/* Main content */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Globe */}
          <div className="relative border border-[var(--border)] bg-black overflow-hidden" style={{ height: '480px' }}>
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
              <span className={`w-2 h-2 ${lat !== null ? 'bg-accent' : 'bg-[var(--text-muted)]'} animate-pulse`} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
                {lat !== null ? `${result?.geo?.city || ''} ${result?.geo?.country_name || ''}` : 'Awaiting target'}
              </span>
            </div>
            <GlobeCanvas targetLat={lat} targetLon={lon} scanning={loading} />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20">
                <div className="flex flex-col items-center gap-3">
                  <Loader size={28} className="text-accent animate-spin" />
                  <p className="font-mono text-xs text-accent uppercase tracking-widest">Scanning...</p>
                </div>
              </div>
            )}
          </div>

          {/* Results panel */}
          <div className="space-y-4">
            {!result && !loading && (
              <div className="border border-[var(--border)] p-8 text-center space-y-3">
                <Globe size={32} className="text-[var(--text-muted)] mx-auto" />
                <p className="font-mono text-sm text-[var(--text-muted)]">Enter a domain to begin recon</p>
                <p className="font-mono text-xs text-[var(--text-muted)] opacity-60">DNS records, IP, and geolocation will appear here</p>
              </div>
            )}

            {result && (
              <>
                {/* IP + Geo */}
                <div className="card p-5 space-y-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">// target identified</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-[var(--border)] p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-[var(--text-muted)]"><Server size={11} /><span className="font-mono text-[10px] uppercase tracking-widest">IP Address</span></div>
                      <p className="font-mono text-sm text-accent font-bold">{result.ip || 'N/A'}</p>
                    </div>
                    <div className="border border-[var(--border)] p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-[var(--text-muted)]"><MapPin size={11} /><span className="font-mono text-[10px] uppercase tracking-widest">Location</span></div>
                      <p className="font-mono text-sm text-[var(--text-primary)]">{result.geo?.city || '—'}, {result.geo?.country_name || '—'}</p>
                    </div>
                    <div className="border border-[var(--border)] p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-[var(--text-muted)]"><Wifi size={11} /><span className="font-mono text-[10px] uppercase tracking-widest">ISP / Org</span></div>
                      <p className="font-mono text-xs text-[var(--text-secondary)] break-words">{result.geo?.org || '—'}</p>
                    </div>
                    <div className="border border-[var(--border)] p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-[var(--text-muted)]"><Globe size={11} /><span className="font-mono text-[10px] uppercase tracking-widest">Timezone</span></div>
                      <p className="font-mono text-xs text-[var(--text-secondary)]">{result.geo?.timezone || '—'}</p>
                    </div>
                  </div>
                </div>

                {/* DNS Records */}
                <div className="card p-5 space-y-4">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">// dns records</p>
                  <RecordGroup label="A Records" records={result.aRecords} />
                  <RecordGroup label="MX Records" records={result.mxRecords} />
                  <RecordGroup label="NS Records" records={result.nsRecords} />
                  <RecordGroup label="TXT Records" records={result.txtRecords} />
                  {!result.aRecords?.length && !result.mxRecords?.length && !result.nsRecords?.length && (
                    <p className="font-mono text-xs text-[var(--text-muted)]">No DNS records found for this domain.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
