'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  MAP_W, MAP_H, MAP_PATHS, PLACES,
} from './capeMayGeo';

const CREAM='#FDFDFC', OLIVE='#AFB885', PISTACHIO='#E2E8CE',
      SKY='#DEE9F2', INK='#4E5B37', SAND='#EFE7D6',
      NAVY='#364C63',    // the lander's deep blue — hover state
      STREET='#D9CDB4',   // Beach Ave — the one street that should read
      STREET_FAINT='#EDE7DA';   // everything else: present, but not asking for attention
const ICON='/photos/agenda/';

/** Bed glyph, drawn to sit inside a 24x24 box. One shape so it stays legible at 13px. */
const BED = 'M2.6 13.2h18.8c1.2 0 2.1.9 2.1 2.1v4.1c0 .5-.4.9-.9.9s-.9-.4-.9-.9v-.8c0-.3-.2-.5-.5-.5H3.8c-.3 0-.5.2-.5.5v.8c0 .5-.4.9-.9.9s-.9-.4-.9-.9v-4.1c0-1.2.9-2.1 2.1-2.1z'
          + 'M4.6 12.1V7.4c0-1.6 1.3-2.9 2.9-2.9h9c1.6 0 2.9 1.3 2.9 2.9v4.7c0 .2-.2.3-.4.3-.5-.1-1-.1-1.5-.1h-.3c-.1 0-.2-.1-.2-.2-.2-1-1-1.7-2-1.7h-2.4c-1 0-1.8.7-2 1.7 0 .1-.1.2-.2.2h-1c-.1 0-.2-.1-.2-.2-.2-1-1-1.7-2-1.7H8.8c-1 0-1.8.7-2 1.7 0 .1-.1.2-.2.2h-.3c-.5 0-1 0-1.5.1-.2 0-.4-.1-.4-.3z';

type Hotel = { n:string; l1:string; l2:string; addr:string; nudge?:[number,number] };
const HOTELS: Hotel[] = [
  // same order as The Accommodations section; every name set on two lines
  { n:'La Mer',                l1:'La Mer',        l2:'Beachfront Resort', addr:'1317 Beach Ave' },
  { n:'Beach Club on Madison', l1:'The Beach Club',l2:'on Madison',        addr:'605 Madison Ave' },
  { n:'The Grand Hotel',       l1:'The Grand',     l2:'Hotel',             addr:'1045 Beach Ave', nudge:[-7,4] },
  { n:'Marquis de Lafayette',  l1:'Marquis',       l2:'de Lafayette',      addr:'501 Beach Ave' },
  { n:'Montreal Beach Resort', l1:'Montreal',      l2:'Beach Resort',      addr:'1025 Beach Ave', nudge:[-8,6] },
  { n:'ICONA Cape May',        l1:'ICONA',         l2:'Cape May',          addr:'1101 Beach Ave', nudge:[11,0] },
  { n:'Ocean Club Hotel',      l1:'Ocean Club',    l2:'Hotel',             addr:'1035 Beach Ave', nudge:[10,-4] },
];

type Ev = { n:string; sub:string; extra?:string; img:string; place?:string; dx?:number; dy?:number; at?:[number,number]; bare?:boolean };
const ON_MAP: Ev[] = [
  { n:'Welcome Drinks', sub:'The Pier House',        img:'pier-house.png', place:'La Mer',       dx:-16, dy:-112 },
  { n:'Nuptial Mass',   sub:'Our Lady Star of the Sea', img:'osos.png',    place:'Nuptial Mass', dx:189, dy:-22 },
  { n:'After Party',    sub:"Carney's",              img:'carneys.png',    place:'After Party', dx:-11, dy:-100 },
  { n:'Beach Day',      sub:'Cape May Beach',        img:'beach.png',      at:[650, 400], bare:true },
  { n:'Reception',      sub:'Isaac Smith Vineyard',  extra:'1.8 miles north', img:'reception-tent.png', at:[252, 76] },
];

const at = (n:string) => { const p = PLACES.find(p=>p.name===n); return p ? {x:p.x,y:p.y} : {x:0,y:0}; };

/** Where a marker actually sits on the map, nudges and offsets included. */
export const posOf = (name:string) => {
  const h = HOTELS.find(h=>h.n===name);
  if (h) { const p = at(h.n); return { x:p.x+(h.nudge?.[0]??0), y:p.y+(h.nudge?.[1]??0) }; }
  const e = ON_MAP.find(e=>e.n===name);
  if (e) { const b = e.at ? {x:e.at[0],y:e.at[1]} : at(e.place as string);
           return { x:b.x+(e.dx??0), y:b.y+(e.dy??0) }; }
  return null;
};

function MapSvg({ sel, setSel, box, picked, onPick }:{ sel:string|null; setSel:(v:string|null)=>void; box?:string; picked:string|null; onPick:(n:string)=>void }) {
  return (
  <svg viewBox={box ?? ('0 0 '+MAP_W+' '+MAP_H)} preserveAspectRatio="xMidYMid meet"
       style={{ width:'100%', height:'auto', display:'block' }}>
    <defs>
      <filter id="cmm-ink" colorInterpolationFilters="sRGB">
        <feFlood floodColor={INK} /><feComposite in2="SourceAlpha" operator="in" />
      </filter>
      {/* soft cream halo — covers icon and label, no hard rim */}
      <radialGradient id="cmm-halo">
        <stop offset="0%" stopColor={CREAM} stopOpacity={.97} />
        <stop offset="58%" stopColor={CREAM} stopOpacity={.94} />
        <stop offset="100%" stopColor={CREAM} stopOpacity={0} />
      </radialGradient>
      <clipPath id="cmm-clip"><rect x="0" y="0" width={MAP_W} height={MAP_H} /></clipPath>
    </defs>

    <g clipPath="url(#cmm-clip)">
      <rect width={MAP_W} height={MAP_H} fill={SKY} />
      <path d={MAP_PATHS.land} fill={CREAM} />
      {/* the beach: a real band along the shore. Filling between the road and the
          water swallowed the ocean, because the two are nowhere near parallel. */}
      <path d={MAP_PATHS.coastLine} fill="none" stroke={SAND} strokeWidth={17} strokeLinecap="round" />
      <path d={MAP_PATHS.islets} fill={CREAM} stroke={STREET_FAINT} strokeWidth={1} />
      <path d={MAP_PATHS.streets} fill="none" stroke={STREET_FAINT} strokeWidth={1} strokeOpacity={.75} />
      <path d={MAP_PATHS.washington} fill="none" stroke={STREET_FAINT} strokeWidth={1.8} />
      <path d={MAP_PATHS.beachAve} fill="none" stroke={STREET} strokeWidth={4} />
    </g>

    {/* street labels, so the pins sit on something named */}

    {/* events: cream disc behind the line art so both icon and label read on any ground */}
    {/* every halo first, on one layer: overlapping ones blend into a single
        soft field, and nothing can end up trapped behind a neighbour's disc */}
    <g>
      {ON_MAP.filter(e=>!e.bare).map(e=>{
        const b = e.at ? {x:e.at[0],y:e.at[1]} : at(e.place as string);
        const x = b.x + (e.dx ?? 0), y = b.y + (e.dy ?? 0);
        return <ellipse key={e.n} cx={x} cy={y+18} rx={140} ry={114} fill="url(#cmm-halo)" />;
      })}
    </g>
    <g>
      {ON_MAP.map(e=>{
        const b = e.at ? {x:e.at[0],y:e.at[1]} : at(e.place as string);
        const x = b.x + (e.dx ?? 0), y = b.y + (e.dy ?? 0);
        return (
          <g key={e.n} style={{cursor:'pointer'}} onClick={()=>onPick(e.n)}>
            <image href={ICON+e.img} x={x-37} y={y-37} width={74} height={74} filter="url(#cmm-ink)" opacity={.95} />
            <text x={x} y={y+53} textAnchor="middle" fontSize={15} fontWeight={500} fill={INK}>{e.n}</text>
            <text x={x} y={y+66} textAnchor="middle" fontSize={9.6} fill={INK} opacity={.65} letterSpacing=".9">{e.sub.toUpperCase()}</text>
            {e.extra && <text x={x} y={y+78} textAnchor="middle" fontSize={9.6} fill={INK} opacity={.55}>{e.extra}</text>}
          </g>
        );
      })}
    </g>

    {/* hotels: one colour, one glyph. A small badge marks a planned shuttle pickup. */}
    {HOTELS.map(h=>{
      const p=at(h.n);
      const x=p.x+(h.nudge?.[0] ?? 0), y=p.y+(h.nudge?.[1] ?? 0);
      const on = sel===h.n || picked===h.n;
      return (
        <g key={h.n} style={{cursor:'pointer'}} onClick={()=>onPick(h.n)}
           onMouseEnter={()=>setSel(h.n)} onMouseLeave={()=>setSel(null)}>
          <circle cx={x} cy={y} r={14} fill={on?NAVY:SKY} stroke={on?NAVY:INK} strokeWidth={1.5} />
          <g transform={`translate(${x-8} ${y-8}) scale(0.667)`}>
            <path d={BED} fill={on?CREAM:INK} />
          </g>
          <circle cx={x} cy={y} r={20} fill="transparent" />
        </g>
      );
    })}

  </svg>
  );
}

function KeyLists({ picked, onPick }:{ picked:string|null; onPick:(n:string)=>void }) {
const box = (on:boolean) => ({
  background: on ? SKY : 'transparent',
  borderRadius: 5,
  padding: '6px 8px',
  margin: '-6px -8px',
});
return (
  <>
    <h4 style={{ fontSize:8.2, letterSpacing:'.15em', textTransform:'uppercase', opacity:.5, margin:'0 0 6px', fontWeight:500 }}>Where to stay</h4>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(2, minmax(0,1fr))', gap:'12px 14px', gridAutoRows:'26px' }}>
      {HOTELS.map(h=>(
        <div key={h.n} onClick={()=>onPick(h.n)} role="button" tabIndex={0}
          style={{ display:'flex', gap:8, alignItems:'flex-start', fontSize:12, minWidth:0, lineHeight:1.3,
                   cursor:'pointer', transition:'background .18s ease, box-shadow .18s ease', ...box(picked===h.n) }}>
          <span style={{ flex:'0 0 20px', height:20, borderRadius:'50%', border:'1.3px solid '+INK,
                         background:SKY, display:'inline-flex', alignItems:'center', justifyContent:'center', marginTop:-1 }}>
            <svg viewBox="0 0 24 24" width={12} height={12}><path d={BED} fill={INK} /></svg>
          </span>
          <span style={{ minWidth:0 }}>{h.l1}<br />{h.l2}</span>
        </div>
      ))}
    </div>
    <h4 style={{ fontSize:8.2, letterSpacing:'.15em', textTransform:'uppercase', opacity:.5, margin:'11px 0 6px', fontWeight:500 }}>The weekend</h4>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(2, minmax(0,1fr))', gap:'12px 14px', gridAutoRows:'26px' }}>
      {ON_MAP.map(e=>(
        <div key={e.n} onClick={()=>onPick(e.n)} role="button" tabIndex={0}
          style={{ display:'flex', gap:8, alignItems:'flex-start', fontSize:12, minWidth:0, lineHeight:1.3,
                   cursor:'pointer', transition:'background .18s ease, box-shadow .18s ease', ...box(picked===e.n) }}>
          <img src={ICON+e.img} alt="" style={{ width:29, height:29, objectFit:'contain', opacity:.85, marginTop:-5 }} />
          <span style={{ minWidth:0 }}>{e.n}</span>
        </div>
      ))}
    </div>
  </>
);
}

export default function CapeMayMap({ open, onClose }:{ open:boolean; onClose:()=>void }) {
  const [sel, setSel] = useState<string|null>(null);
  const [mobile, setMobile] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [picked, setPicked] = useState<string|null>(null);
  const [view, setView] = useState({ k:1, x:0, y:0 });
  const ptrs = useRef<Map<number,{x:number;y:number}>>(new Map());
  const stage = useRef<HTMLDivElement|null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 780px), (max-height: 560px)');
    const set = () => setMobile(mq.matches);
    set(); mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  // Zooming the viewBox re-renders the vectors at full resolution. A CSS transform
  // on a promoted layer rasterises once at 1x and then scales the bitmap, which is
  // why it went soft. x/y are the viewBox origin, in map units.
  const clamp = (v:{k:number;x:number;y:number}) => {
    const k = Math.min(4, Math.max(1, v.k));
    const vw = MAP_W / k, vh = MAP_H / k;
    return { k,
      x: Math.min(MAP_W - vw, Math.max(0, v.x)),
      y: Math.min(MAP_H - vh, Math.max(0, v.y)) };
  };
  // screen px -> map units at the current zoom
  const perPx = () => {
    const el = stage.current;
    return el ? (MAP_W / view.k) / el.clientWidth : 1;
  };
  const local = (e:{clientX:number;clientY:number}) => {
    const r = stage.current!.getBoundingClientRect();
    return { x:e.clientX - r.left, y:e.clientY - r.top };
  };
  const down = (e:React.PointerEvent) => {
    ptrs.current.set(e.pointerId, { x:e.clientX, y:e.clientY });
    // capture can throw for pointers the browser no longer considers active;
    // it's an optimisation, not a requirement, so never let it break the gesture
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
  };
  const move = (e:React.PointerEvent) => {
    if (!ptrs.current.has(e.pointerId) || !stage.current) return;
    const prev = new Map(ptrs.current);
    ptrs.current.set(e.pointerId, { x:e.clientX, y:e.clientY });
    const now = [...ptrs.current.values()], was = [...prev.values()];

    if (now.length === 1) {
      const p = prev.get(e.pointerId)!;
      const s = perPx();
      setView(v => clamp({ ...v, x: v.x - (e.clientX-p.x)*s, y: v.y - (e.clientY-p.y)*s }));
      return;
    }
    if (now.length >= 2) {
      const d0 = Math.hypot(was[0].x-was[1].x, was[0].y-was[1].y);
      const d1 = Math.hypot(now[0].x-now[1].x, now[0].y-now[1].y);
      const r = stage.current.getBoundingClientRect();
      const pc = { x:(was[0].x+was[1].x)/2 - r.left, y:(was[0].y+was[1].y)/2 - r.top };
      const nc = { x:(now[0].x+now[1].x)/2 - r.left, y:(now[0].y+now[1].y)/2 - r.top };
      setView(v => {
        const k = Math.min(4, Math.max(1, v.k * (d0>0 ? d1/d0 : 1)));
        const sBefore = (MAP_W / v.k) / r.width;
        const sAfter  = (MAP_W / k)   / r.width;
        // the map point under the old finger-midpoint ends up under the new one,
        // so the map pans and zooms together the way a map app does
        const wx = v.x + pc.x * sBefore, wy = v.y + pc.y * sBefore;
        return clamp({ k, x: wx - nc.x * sAfter, y: wy - nc.y * sAfter });
      });
    }
  };
  const up = (e:React.PointerEvent) => { ptrs.current.delete(e.pointerId); };
  const wheel = (e:React.WheelEvent) => {
    if (!stage.current) return;
    const r = stage.current.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    setView(v => {
      const k = Math.min(4, Math.max(1, v.k * Math.pow(1.0015, -e.deltaY)));
      const sB = (MAP_W / v.k) / r.width, sA = (MAP_W / k) / r.width;
      return clamp({ k, x: v.x + px*sB - px*sA, y: v.y + py*sB - py*sA });
    });
  };
  const reset = () => { setView({ k:1, x:0, y:0 }); setPicked(null); };

  // clicking a marker or a key row does the same thing: highlight it, and on the
  // zoomable mobile map, bring that point to the middle
  const pick = (name:string) => {
    setPicked(p => p === name ? null : name);
    if (!mobile) return;
    const p = posOf(name); if (!p) return;
    setView(v => {
      const k = Math.max(v.k, 2.2);
      const vw = MAP_W / k, vh = MAP_H / k;
      return clamp({ k, x: p.x - vw/2, y: p.y - vh/2 });
    });
  };

  useEffect(() => {
    if (!open) return;
    const esc=(e:KeyboardEvent)=>{ if(e.key==='Escape') onClose(); };
    window.addEventListener('keydown',esc);
    const prev=document.body.style.overflow; document.body.style.overflow='hidden';
    return ()=>{ window.removeEventListener('keydown',esc); document.body.style.overflow=prev; };
  }, [open, onClose]);

  // reset the view whenever it opens or the frame changes shape
  useLayoutEffect(() => {
    if (!open) { setDrawer(false); setPicked(null); }
    setView({ k:1, x:0, y:0 });
    const onResize = () => setView({ k:1, x:0, y:0 });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, mobile]);

  if (!open) return null;

  if (mobile) return (
    <div role="dialog" aria-modal="true" aria-label="Map of Cape May" onClick={onClose}
      style={{ position:'fixed', inset:0, zIndex:400, background:'rgba(40,46,30,.55)',
               display:'flex', alignItems:'center', justifyContent:'center', padding:14 }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:CREAM, color:INK, border:'1px solid rgba(175,184,133,.65)',
                 width:'100%', maxHeight:'88vh',
                 display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ flex:'0 0 auto', display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'9px 13px', borderBottom:'1px solid rgba(175,184,133,.5)' }}>
        <div>
          <div className="heading" style={{ fontSize:20, lineHeight:1, fontWeight:400 }}>Around Cape May</div>
          <div style={{ fontSize:10, opacity:.55, marginTop:3 }}>Pinch to zoom &middot; drag to move</div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {view.k > 1.02 && (
            <button onClick={reset} aria-label="Reset zoom"
              style={{ height:32, padding:'0 12px', borderRadius:999, border:'1px solid '+INK,
                       background:'transparent', color:INK, fontSize:10, letterSpacing:'.08em',
                       textTransform:'uppercase', cursor:'pointer' }}>Reset</button>
          )}
          <button onClick={onClose} aria-label="Close map"
            style={{ width:32, height:32, borderRadius:'50%', border:'1px solid '+INK,
                     background:'transparent', color:INK, cursor:'pointer', fontSize:16, padding:0 }}>&times;</button>
        </div>
      </div>

      <div ref={stage} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={wheel}
        style={{ position:'relative', overflow:'hidden', touchAction:'none', cursor:'grab',
                 width:'100%', aspectRatio:`${MAP_W} / ${MAP_H}`, flex:'0 0 auto' }}>
        <MapSvg sel={sel} setSel={setSel} picked={picked} onPick={pick}
                box={`${view.x} ${view.y} ${MAP_W/view.k} ${MAP_H/view.k}`} />
      </div>

      <div style={{ flex:'0 1 auto', minHeight:0, overflowY:'auto',
                    borderTop:'1px solid rgba(175,184,133,.5)', padding:'11px 12px 13px' }}>
        <KeyLists picked={picked} onPick={pick} />
      </div>
      </div>
    </div>
  );

  return (
    <div role="dialog" aria-modal="true" aria-label="Map of Cape May" onClick={onClose}
      style={{ position:'fixed', inset:0, zIndex:400, background:'rgba(40,46,30,.55)',
               display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:CREAM, color:INK, border:'1px solid rgba(175,184,133,.65)',
                 maxWidth:'min(1080px, max(460px, calc((92vh - 296px) * 1.826 + 56px)))', width:'100%',
                 maxHeight:'92vh', overflowY:'auto',
                 padding:'22px 28px 18px', position:'relative' }}>
        <button onClick={onClose} aria-label="Close map"
          style={{ position:'absolute', top:16, right:16, width:32, height:32, borderRadius:'50%',
                   border:'1px solid '+INK, background:'transparent', color:INK, cursor:'pointer',
                   fontSize:16, lineHeight:1, padding:0 }}>&times;</button>

        <h2 className="heading" style={{ fontSize:34, lineHeight:1, margin:'0 0 5px', fontWeight:400 }}>Around Cape May</h2>
        <p style={{ fontSize:13, lineHeight:1.5, opacity:.78, margin:'0 0 14px', maxWidth:620 }}>
          Every hotel sits on the same mile of Beach Avenue &mdash; the two far ends are about a 20&#8209;minute walk apart.
        </p>

        <div className="cmm-row" style={{ display:'flex', flexDirection:'column', gap:14,
             width:'100%' }}>
          <div style={{ width:'100%', minWidth:0 }}>
            <MapSvg sel={sel} setSel={setSel} picked={picked} onPick={pick} />
          </div>

          <div className="cmm-key" style={{ width:'100%', display:'flex', gap:26, alignItems:'flex-start' }}>
            <div style={{ flex:'1 1 58%', minWidth:0 }}>
              <h4 style={{ fontSize:8.6, letterSpacing:'.15em', textTransform:'uppercase', opacity:.5, margin:'0 0 8px', fontWeight:500 }}>Where to stay</h4>
              <div className="cmm-chips" style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap:'14px 18px', gridAutoRows:'30px' }}>
                {HOTELS.map(h=>(
                  <div key={h.n} onClick={()=>pick(h.n)}
                    onMouseEnter={()=>setSel(h.n)} onMouseLeave={()=>setSel(null)}
                    style={{ display:'flex', gap:9, alignItems:'flex-start', fontSize:12.5, cursor:'pointer',
                             minWidth:0, lineHeight:1.35, borderRadius:5,
                             background: picked===h.n ? SKY : 'transparent',
                             padding:'6px 8px', margin:'-6px -8px',
                             transition:'background .18s ease, box-shadow .18s ease' }}>
                    <span style={{ flex:'0 0 22px', height:22, borderRadius:'50%',
                                   border:'1.4px solid '+(sel===h.n?NAVY:INK),
                                   background: sel===h.n?NAVY:SKY, display:'inline-flex',
                                   alignItems:'center', justifyContent:'center', marginTop:-2,
                                   transition:'background .15s ease' }}>
                      <svg viewBox="0 0 24 24" width={13} height={13}><path d={BED} fill={sel===h.n?CREAM:INK} /></svg>
                    </span>
                    <span style={{ minWidth:0 }}>{h.l1}<br />{h.l2}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="cmm-div" style={{ flex:'1 1 42%', minWidth:0,
                 borderLeft:'1px solid rgba(175,184,133,.5)', paddingLeft:26 }}>
              <h4 style={{ fontSize:8.6, letterSpacing:'.15em', textTransform:'uppercase', opacity:.5, margin:'0 0 8px', fontWeight:500 }}>The weekend</h4>
              <div className="cmm-chips" style={{ display:'grid', gridTemplateColumns:'repeat(2, minmax(0,1fr))', gap:'14px 18px', gridAutoRows:'30px' }}>
                {ON_MAP.map(e=>(
                  <div key={e.n} onClick={()=>pick(e.n)}
                    style={{ display:'flex', gap:9, alignItems:'flex-start', fontSize:12.5, minWidth:0, lineHeight:1.35,
                             cursor:'pointer', borderRadius:5,
                             background: picked===e.n ? SKY : 'transparent',
                             padding:'6px 8px', margin:'-6px -8px',
                             transition:'background .18s ease, box-shadow .18s ease' }}>
                    <img src={ICON+e.img} alt="" style={{ width:30, height:30, objectFit:'contain', opacity:.85, marginTop:-5 }} />
                    <span style={{ minWidth:0 }}>{e.n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 780px) {
            :global(.cmm-key) { flex-direction: column !important; gap: 12px !important; }
            :global(.cmm-div) { border-left: none !important; padding-left: 0 !important;
                                border-top: 1px solid rgba(175,184,133,.5); padding-top: 12px; }
            :global(.cmm-chips) { grid-template-columns: repeat(2, minmax(0,1fr)) !important; gap: 10px 14px !important; }
          }
        `}</style>
      </div>
    </div>
  );
}
