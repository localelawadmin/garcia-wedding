'use client';

import { useEffect, useState } from 'react';
import {
  MAP_W, MAP_H, INSET_W, INSET_H,
  MAP_PATHS, INSET_PATHS, PLACES, INSET_PLACES,
} from './capeMayGeo';

const CREAM='#FDFDFC', OLIVE='#AFB885', PISTACHIO='#E2E8CE',
      SKY='#DEE9F2', INK='#4E5B37', SAND='#F4EFE3';
const ICON='/photos/agenda/';

// Hotels stay a matched set — a ring marks a planned shuttle pickup, not a colour change.
type Hotel = { n:string; addr:string; stop?:boolean; nudge?:[number,number] };
const HOTELS: Hotel[] = [
  { n:'Marquis de Lafayette',  addr:'501 Beach Ave' },
  { n:'Beach Club on Madison', addr:'605 Madison Ave', stop:true },
  { n:'Montreal Beach Resort', addr:'1025 Beach Ave', nudge:[-7,5] },
  { n:'Ocean Club Hotel',      addr:'1035 Beach Ave', nudge:[9,-3] },
  { n:'The Grand Hotel',       addr:'1045 Beach Ave', stop:true, nudge:[-6,3] },
  { n:'ICONA Cape May',        addr:'1101 Beach Ave', nudge:[9,0] },
  { n:'La Mer',                addr:'1317 Beach Ave', stop:true },
];

type Ev = { n:string; sub:string; img:string; place?:string; dy?:number };
const ON_MAP: Ev[] = [
  { n:'Welcome Drinks', sub:'The Pier House at La Mer', img:'pier-house.png', place:'La Mer', dy:-78 },
  { n:'Nuptial Mass',   sub:'Our Lady Star of the Sea', img:'osos.png',       place:'Nuptial Mass' },
  { n:'After Party',    sub:"Carney's",                 img:'carneys.png',    place:'After Party', dy:64 },
];
const KEY_ONLY: Ev[] = [
  { n:'Reception', sub:'Isaac Smith Vineyard', img:'reception-tent.png' },
  { n:'Beach Day', sub:'Cape May Beach',       img:'beach.png' },
];

const at = (name:string) => {
  const p = PLACES.find(p => p.name === name);
  return p ? { x:p.x, y:p.y } : { x:0, y:0 };
};

export default function CapeMayMap({ open, onClose }:{ open:boolean; onClose:()=>void }) {
  const [sel, setSel] = useState<string|null>(null);

  useEffect(() => {
    if (!open) return;
    const esc = (e:KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Map of Cape May" onClick={onClose}
      style={{ position:'fixed', inset:0, zIndex:400, background:'rgba(40,46,30,.55)',
               display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:CREAM, color:INK,   // must be explicit: this overlay inherits
                                                 // colour from wherever it is mounted
                 border:'1px solid rgba(175,184,133,.65)', maxWidth:1120,
                 width:'100%', maxHeight:'92vh', overflowY:'auto', padding:'26px 28px 22px', position:'relative' }}>
        <button onClick={onClose} aria-label="Close map"
          style={{ position:'absolute', top:16, right:16, width:32, height:32, borderRadius:'50%',
                   border:'1px solid '+INK, background:'transparent', color:INK, cursor:'pointer',
                   fontSize:16, lineHeight:1, padding:0 }}>&times;</button>

        <h2 className="heading" style={{ fontSize:40, lineHeight:1, margin:'0 0 6px', fontWeight:400 }}>Around Cape May</h2>
        <p style={{ fontSize:13.5, lineHeight:1.55, opacity:.78, margin:'0 0 18px', maxWidth:540 }}>
          Every hotel sits on the same mile of Beach Avenue &mdash; the two far ends are about a 20&#8209;minute walk apart.
        </p>

        <div className="cmm-row" style={{ display:'flex', gap:26, alignItems:'flex-start' }}>
          <div style={{ flex:'1 1 auto', minWidth:0 }}>
            <svg viewBox={'0 0 '+MAP_W+' '+MAP_H} style={{ width:'100%', height:'auto', display:'block' }}>
              <defs>
                <filter id="cmm-ink" colorInterpolationFilters="sRGB">
                  <feFlood floodColor={INK} /><feComposite in2="SourceAlpha" operator="in" />
                </filter>
                <clipPath id="cmm-clip"><rect x="0" y="0" width={MAP_W} height={MAP_H} /></clipPath>
                <clipPath id="cmm-inset-clip"><rect x="0" y="0" width={INSET_W} height={INSET_H} /></clipPath>
              </defs>

              <g clipPath="url(#cmm-clip)">
                <rect width={MAP_W} height={MAP_H} fill={SKY} />
                <path d={MAP_PATHS.coast} fill={CREAM} stroke={SAND} strokeWidth={9} />
                <path d={MAP_PATHS.coast} fill="none" stroke={INK} strokeWidth={1.1} strokeOpacity={.45} />
                <path d={MAP_PATHS.water} fill={SKY} stroke={INK} strokeWidth={.8} strokeOpacity={.3} />
                <path d={MAP_PATHS.lafayette}  fill="none" stroke={INK} strokeWidth={.8} strokeOpacity={.25} />
                <path d={MAP_PATHS.madison}    fill="none" stroke={INK} strokeWidth={.8} strokeOpacity={.3} />
                <path d={MAP_PATHS.washington} fill="none" stroke={INK} strokeWidth={1}  strokeOpacity={.4} />
                <path d={MAP_PATHS.beachAve}   fill="none" stroke={INK} strokeWidth={2.4} />
              </g>

              {ON_MAP.map(e=>{
                const p = at(e.place as string); const y = p.y + (e.dy ?? 0);
                return (
                  <g key={e.n}>
                    {e.dy ? <line x1={p.x} y1={p.y-12} x2={p.x} y2={y+26} stroke={INK} strokeOpacity={.4} strokeDasharray="3 3" /> : null}
                    <image href={ICON+e.img} x={p.x-26} y={y-26} width={52} height={52} filter="url(#cmm-ink)" opacity={.92} />
                    <text x={p.x} y={y+44} textAnchor="middle" fontSize={12} fontWeight={500} fill={INK}>{e.n}</text>
                    <text x={p.x} y={y+55} textAnchor="middle" fontSize={8.6} fill={INK} opacity={.55} letterSpacing=".7">{e.sub.toUpperCase()}</text>
                  </g>
                );
              })}

              {HOTELS.map((h,i)=>{
                const p = at(h.n);
                const x = p.x + (h.nudge?.[0] ?? 0), y = p.y + (h.nudge?.[1] ?? 0);
                const on = sel === h.n;
                return (
                  <g key={h.n} style={{ cursor:'pointer' }}
                     onMouseEnter={()=>setSel(h.n)} onMouseLeave={()=>setSel(null)}>
                    {h.stop && <circle cx={x} cy={y} r={14} fill="none" stroke={INK} strokeOpacity={.45} />}
                    <circle cx={x} cy={y} r={10.5} fill={on?OLIVE:CREAM} stroke={INK} strokeWidth={1.6} />
                    <text x={x} y={y+3.8} textAnchor="middle" fontSize={11} fontWeight={500} fill={INK}>{i+1}</text>
                    <circle cx={x} cy={y} r={17} fill="transparent" />
                  </g>
                );
              })}

              {/* the vineyard is the only thing off the island — locator inset */}
              <g transform={'translate(16 '+(MAP_H-INSET_H-16)+')'}>
                <g clipPath="url(#cmm-inset-clip)">
                  <rect width={INSET_W} height={INSET_H} fill={SKY} />
                  <path d={INSET_PATHS.coast} fill={PISTACHIO} stroke={INK} strokeWidth={.7} strokeOpacity={.35} />
                  <path d={INSET_PATHS.water} fill={SKY} stroke={INK} strokeWidth={.5} strokeOpacity={.25} />
                  <path d={INSET_PATHS.canal} fill="none" stroke={SKY} strokeWidth={4} />
                </g>
                <rect width={INSET_W} height={INSET_H} fill="none" stroke={INK} strokeOpacity={.4} />
                {INSET_PLACES.map(p=>(
                  <g key={p.name}>
                    <circle cx={p.x} cy={p.y} r={p.name==='Reception'?7:4}
                            fill={p.name==='Reception'?OLIVE:CREAM} stroke={INK} strokeWidth={1.3} />
                    {p.name==='Reception' && <text x={p.x+12} y={p.y+3.5} fontSize={10} fontWeight={500} fill={INK}>Reception</text>}
                  </g>
                ))}
                <text x={9} y={15} fontSize={8} letterSpacing="1.1" fill={INK} opacity={.55}>ISAAC SMITH VINEYARD</text>
                <text x={9} y={INSET_H-9} fontSize={8} fill={INK} opacity={.55}>&#8776; 8 min drive north</text>
              </g>

              <text x={14} y={MAP_H-12} fontSize={9} letterSpacing="1.3" fill={INK} opacity={.45}>BEACH AVENUE</text>
            </svg>
          </div>

          <div className="cmm-key" style={{ flex:'0 0 210px' }}>
            <h4 style={{ fontSize:8.6, letterSpacing:'.15em', textTransform:'uppercase', opacity:.5, margin:'0 0 9px', fontWeight:500 }}>Where to stay</h4>
            {HOTELS.map((h,i)=>(
              <div key={h.n} onMouseEnter={()=>setSel(h.n)} onMouseLeave={()=>setSel(null)}
                style={{ display:'flex', gap:9, alignItems:'center', marginBottom:7, fontSize:12.5 }}>
                <span style={{ flex:'0 0 19px', height:19, borderRadius:'50%', border:'1.4px solid '+INK,
                               background: sel===h.n?OLIVE:CREAM, fontSize:10, display:'inline-flex',
                               alignItems:'center', justifyContent:'center', fontWeight:500,
                               boxShadow: h.stop ? '0 0 0 2.4px '+CREAM+', 0 0 0 3.5px rgba(78,91,55,.45)' : undefined }}>{i+1}</span>
                <span>{h.n}<br /><span style={{ opacity:.5, fontSize:10, letterSpacing:'.07em' }}>{h.addr.toUpperCase()}</span></span>
              </div>
            ))}
            <h4 style={{ fontSize:8.6, letterSpacing:'.15em', textTransform:'uppercase', opacity:.5, margin:'16px 0 9px', fontWeight:500 }}>The weekend</h4>
            {ON_MAP.concat(KEY_ONLY).map(e=>(
              <div key={e.n} style={{ display:'flex', gap:9, alignItems:'center', marginBottom:7, fontSize:12.5 }}>
                <img src={ICON+e.img} alt="" style={{ width:26, height:26, objectFit:'contain', opacity:.85 }} />
                <span>{e.n}<br /><span style={{ opacity:.5, fontSize:10, letterSpacing:'.07em' }}>{e.sub.toUpperCase()}</span></span>
              </div>
            ))}
            <p style={{ fontSize:10.5, opacity:.6, lineHeight:1.5, marginTop:14 }}>Ringed markers are planned shuttle pickups.</p>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 780px) {
            :global(.cmm-row) { flex-direction: column !important; }
            :global(.cmm-key) { flex: 1 1 auto !important; width: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
}
