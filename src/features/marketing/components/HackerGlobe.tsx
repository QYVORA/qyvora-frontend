import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ACCENT = 0x88ad7c;
const ACCENT_HEX = '#88ad7c';

const TARGETS = [
  { lat: 40.7,  lng: -74.0,  label: 'NYC', status: 'scanning' },
  { lat: 51.5,  lng: -0.1,   label: 'LON', status: 'secured'  },
  { lat: -26.2, lng: 28.0,   label: 'JHB', status: 'breach'   },
  { lat: 35.7,  lng: 139.7,  label: 'TKY', status: 'scanning' },
  { lat: 1.3,   lng: 103.8,  label: 'SGP', status: 'secured'  },
  { lat: 48.9,  lng: 2.3,    label: 'PAR', status: 'breach'   },
  { lat: -33.9, lng: 18.4,   label: 'CPT', status: 'scanning' },
  { lat: 37.8,  lng: -122.4, label: 'SFO', status: 'secured'  },
  { lat: 55.8,  lng: 37.6,   label: 'MSC', status: 'breach'   },
  { lat: 31.2,  lng: 121.5,  label: 'SHA', status: 'scanning' },
];

const STATUS_COLOR = { breach: 0xff4444, scanning: 0xffcc00, secured: ACCENT };

function latLngToVec3(lat, lng, r = 1) {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

const HackerGlobe = () => {
  const mountRef   = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    let w = el.clientWidth, h = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 2.8;

    const globe = new THREE.Group();
    scene.add(globe);

    // Atmosphere
    scene.add(new THREE.Mesh(
      new THREE.SphereGeometry(1.15, 32, 32),
      new THREE.MeshBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.04, side: THREE.BackSide })
    ));

    // Inner sphere
    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.98, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x050706, transparent: true, opacity: 0.92 })
    ));

    // Specular highlight
    const hl = new THREE.Mesh(
      new THREE.SphereGeometry(0.38, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.03 })
    );
    hl.position.set(-0.55, 0.55, 0.8);
    scene.add(hl);

    // Grid
    const gridMat = new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.06 });
    [-60,-30,0,30,60].forEach(lat => {
      const phi = (90 - lat) * (Math.PI / 180), r = Math.sin(phi), y = Math.cos(phi);
      const pts = [];
      for (let i = 0; i <= 64; i++) { const t = (i/64)*Math.PI*2; pts.push(new THREE.Vector3(r*Math.cos(t),y,r*Math.sin(t))); }
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    });
    [0,30,60,90,120,150,180,210,240,270,300,330].forEach(lng => {
      const theta = (lng*Math.PI)/180, pts = [];
      for (let i = 0; i <= 64; i++) { const phi=(i/64)*Math.PI; pts.push(new THREE.Vector3(Math.sin(phi)*Math.cos(theta),Math.cos(phi),Math.sin(phi)*Math.sin(theta))); }
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat));
    });

    // World dots — real continent bounding polygons (hardcoded, no external deps)
    // Each entry: [latMin, latMax, lngMin, lngMax]
    const LAND: [number,number,number,number][] = [
      // North America
      [25,50,-125,-65],[50,72,-140,-55],[15,30,-120,-85],[5,20,-90,-75],[8,18,-85,-60],
      // Greenland
      [60,84,-55,-15],
      // South America
      [-55,12,-82,-35],[-35,5,-75,-35],
      // Europe
      [36,72,-10,40],[55,72,15,32],[36,48,28,42],
      // Africa
      [-35,37,-18,52],[-35,0,12,40],[0,22,30,52],[22,37,10,38],
      // Asia (west)
      [36,72,26,70],[20,40,44,65],[0,25,44,60],
      // Asia (central/east)
      [20,55,65,135],[0,25,95,120],[0,20,100,120],
      // Southeast Asia
      [-10,20,95,140],[-10,5,105,120],
      // Japan/Korea
      [30,46,128,146],
      // Australia
      [-40,-10,113,154],[-45,-10,145,155],
      // New Zealand
      [-47,-34,166,178],
      // Antarctica (partial)
      [-90,-65,-180,180],
    ];

    const isLand = (lat: number, lng: number) =>
      LAND.some(([la,lb,la2,lb2]) => lat>=la && lat<=lb && lng>=la2 && lng<=lb2);

    const dotGeo = new THREE.BufferGeometry();
    const dotMat = new THREE.PointsMaterial({ color: ACCENT, size: 0.011, transparent: true, opacity: 0.75, sizeAttenuation: true });
    globe.add(new THREE.Points(dotGeo, dotMat));

    const pos: number[] = [];
    for (let lat = -70; lat <= 75; lat += 2.5) {
      for (let lng = -180; lng <= 180; lng += 2.5) {
        if (isLand(lat, lng)) {
          const v = latLngToVec3(lat, lng, 1.005);
          pos.push(v.x, v.y, v.z);
        }
      }
    }
    dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));

    // Satellite orbits
    [[1.35,0.15,Math.PI/3,0,Math.PI/6],[1.5,0.10,-Math.PI/4,Math.PI/5,0]].forEach(([r,op,rx,ry,rz]) => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(r,0.003,8,120), new THREE.MeshBasicMaterial({color:ACCENT,transparent:true,opacity:op}));
      m.rotation.set(rx,ry,rz); scene.add(m);
    });

    const mkSat = (bc, pc) => {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(0.03,0.03,0.05), new THREE.MeshBasicMaterial({color:bc})));
      [-1,1].forEach(s => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.08,0.01,0.02), new THREE.MeshBasicMaterial({color:pc,transparent:true,opacity:0.7})); p.position.set(s*0.055,0,0); g.add(p); });
      scene.add(g); return g;
    };
    const sat1 = mkSat(0xffffff, ACCENT);
    const sat2 = mkSat(ACCENT, 0xffffff);

    // Trails
    const TRAIL = 24;
    const t1pts = Array.from({length:TRAIL}, ()=>new THREE.Vector3());
    const t2pts = Array.from({length:TRAIL}, ()=>new THREE.Vector3());
    const mkTrail = pts => {
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({color:ACCENT,transparent:true,opacity:0.25}));
      scene.add(line); return geo;
    };
    const tg1 = mkTrail(t1pts), tg2 = mkTrail(t2pts);
    let ti1=0, ti2=0;

    // Pings
    const pings = [];
    TARGETS.forEach(({lat,lng,status}) => {
      const pos = latLngToVec3(lat,lng,1.012), col = STATUS_COLOR[status];
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.013,8,8), new THREE.MeshBasicMaterial({color:col}));
      dot.position.copy(pos); globe.add(dot);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.016,0.024,16), new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.8,side:THREE.DoubleSide}));
      ring.position.copy(pos); ring.lookAt(new THREE.Vector3(0,0,0)); globe.add(ring);
      pings.push({ring, phase: Math.random()*Math.PI*2});
    });

    // Arcs
    const arcs = [];
    [[0,5],[1,6],[2,9],[3,7],[4,8]].forEach(([a,b]) => {
      const s=latLngToVec3(TARGETS[a].lat,TARGETS[a].lng,1.01), e=latLngToVec3(TARGETS[b].lat,TARGETS[b].lng,1.01);
      const mid=s.clone().add(e).normalize().multiplyScalar(1.35);
      const curve=new THREE.QuadraticBezierCurve3(s,mid,e), geo=new THREE.BufferGeometry();
      const line=new THREE.Line(geo, new THREE.LineBasicMaterial({color:ACCENT,transparent:true,opacity:0.35}));
      globe.add(line); arcs.push({curve,geo,progress:Math.random(),speed:0.003+Math.random()*0.003});
    });

    // Drag
    let drag=false, prev={x:0,y:0}, vel={x:0,y:0};
    const onMD = e => { drag=true; prev={x:e.clientX,y:e.clientY}; };
    const onMM = e => { if(!drag)return; vel.y=(e.clientX-prev.x)*0.005; vel.x=(e.clientY-prev.y)*0.005; prev={x:e.clientX,y:e.clientY}; };
    const onMU = () => { drag=false; };
    const onTS = e => { drag=true; prev={x:e.touches[0].clientX,y:e.touches[0].clientY}; };
    const onTM = e => { if(!drag)return; vel.y=(e.touches[0].clientX-prev.x)*0.005; vel.x=(e.touches[0].clientY-prev.y)*0.005; prev={x:e.touches[0].clientX,y:e.touches[0].clientY}; };
    const onTE = () => { drag=false; };
    renderer.domElement.addEventListener('mousedown',onMD);
    window.addEventListener('mousemove',onMM);
    window.addEventListener('mouseup',onMU);
    renderer.domElement.addEventListener('touchstart',onTS,{passive:true});
    window.addEventListener('touchmove',onTM,{passive:true});
    window.addEventListener('touchend',onTE);

    // Tooltip
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = {threshold:0.05};
    const m2 = new THREE.Vector2();
    const hitMeshes = TARGETS.map(({lat,lng,status}) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.028,8,8), new THREE.MeshBasicMaterial({transparent:true,opacity:0}));
      m.position.copy(latLngToVec3(lat,lng,1.012)); globe.add(m); return m;
    });
    const onHover = e => {
      const rect = renderer.domElement.getBoundingClientRect();
      m2.x = ((e.clientX-rect.left)/rect.width)*2-1;
      m2.y = -((e.clientY-rect.top)/rect.height)*2+1;
      raycaster.setFromCamera(m2,camera);
      const hits = raycaster.intersectObjects(hitMeshes);
      const tip = tooltipRef.current;
      if (!tip) return;
      if (hits.length) {
        const idx = hitMeshes.indexOf(hits[0].object as unknown as THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>);
        const d = TARGETS[idx];
        const sc = d.status==='breach'?'#ff4444':d.status==='scanning'?'#ffcc00':ACCENT_HEX;
        tip.style.display='block';
        tip.style.left=`${e.clientX-rect.left+14}px`;
        tip.style.top=`${e.clientY-rect.top-10}px`;
        // Use textContent to avoid XSS — never innerHTML with external data
        tip.textContent = '';
        const labelSpan = document.createElement('span');
        labelSpan.style.cssText = `color:${ACCENT_HEX};font-weight:700`;
        labelSpan.textContent = d.label;
        const br = document.createElement('br');
        const statusSpan = document.createElement('span');
        statusSpan.style.cssText = `font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:${sc}`;
        statusSpan.textContent = d.status;
        tip.appendChild(labelSpan); tip.appendChild(br); tip.appendChild(statusSpan);
      } else { tip.style.display='none'; }
    };
    renderer.domElement.addEventListener('mousemove',onHover);

    // Loop ~30fps
    let frame, last=0, tick=0;
    const animate = now => {
      frame = requestAnimationFrame(animate);
      if (now-last < 33) return;
      last=now; tick+=0.012;

      if (!drag) {
        globe.rotation.y += 0.0015+vel.y*0.1;
        globe.rotation.x += vel.x*0.1;
        vel.x*=0.92; vel.y*=0.92;
      } else {
        globe.rotation.y+=vel.y;
        globe.rotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, globe.rotation.x+vel.x));
      }

      const a1=tick*0.6;
      sat1.position.set(1.35*Math.cos(a1),1.35*Math.sin(a1)*Math.sin(Math.PI/3),1.35*Math.sin(a1)*Math.cos(Math.PI/3));
      sat1.rotation.y=a1;
      t1pts[ti1%TRAIL].copy(sat1.position); ti1++;
      tg1.setFromPoints([...t1pts.slice(ti1%TRAIL),...t1pts.slice(0,ti1%TRAIL)]);

      const a2=tick*0.4+1.2;
      sat2.position.set(1.5*Math.cos(a2)*Math.cos(-Math.PI/4),1.5*Math.sin(a2),1.5*Math.cos(a2)*Math.sin(-Math.PI/4));
      sat2.rotation.y=a2;
      t2pts[ti2%TRAIL].copy(sat2.position); ti2++;
      tg2.setFromPoints([...t2pts.slice(ti2%TRAIL),...t2pts.slice(0,ti2%TRAIL)]);

      pings.forEach(({ring,phase}) => {
        const s=1+1.5*((Math.sin(tick*2+phase)+1)/2);
        ring.scale.setScalar(s);
        ring.material.opacity=0.6*(1-(s-1)/1.5);
      });

      arcs.forEach(arc => {
        arc.progress=(arc.progress+arc.speed)%1;
        const n=Math.max(2,Math.floor(arc.progress*60));
        arc.geo.setFromPoints(arc.curve.getPoints(n));
      });

      renderer.render(scene,camera);
    };
    requestAnimationFrame(animate);

    const onResize = () => {
      w=el.clientWidth; h=el.clientHeight;
      camera.aspect=w/h; camera.updateProjectionMatrix(); renderer.setSize(w,h);
    };
    window.addEventListener('resize',onResize);

    return () => {
      window.removeEventListener('resize',onResize);
      window.removeEventListener('mousemove',onMM);
      window.removeEventListener('mouseup',onMU);
      window.removeEventListener('touchmove',onTM);
      window.removeEventListener('touchend',onTE);
      renderer.domElement.removeEventListener('mousedown',onMD);
      renderer.domElement.removeEventListener('touchstart',onTS);
      renderer.domElement.removeEventListener('mousemove',onHover);
      cancelAnimationFrame(frame);
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full relative" style={{cursor:'grab'}}>
      <div ref={tooltipRef} style={{display:'none',position:'absolute',pointerEvents:'none',background:'rgba(5,7,6,0.92)',border:'1px solid rgba(136,173,124,0.3)',borderRadius:'4px',padding:'6px 10px',fontFamily:'JetBrains Mono,monospace',fontSize:'11px',color:'#eef4ec',zIndex:10,whiteSpace:'nowrap'}} />
    </div>
  );
};

export default HackerGlobe;
