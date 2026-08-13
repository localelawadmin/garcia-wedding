'use client';

import { useEffect, useState } from 'react';
import {
  MAP_W, MAP_H, MAP_PATHS, PLACES,
} from './capeMayGeo';

const CREAM='#FDFDFC', OLIVE='#AFB885', PISTACHIO='#E2E8CE',
      SKY='#DEE9F2', INK='#4E5B37', SAND='#F4EFE3';
const ICON='/photos/agenda/';

/** Bed glyph, drawn to sit inside a 24x24 box. One shape so it stays legible at 13px. */
const BED = 'M2.6 13.2h18.8c1.2 0 2.1.9 2.1 2.1v4.1c0 .5-.4.9-.9.9s-.9-.4-.9-.9v-.8c0-.3-.2-.5-.5-.5H3.8c-.3 0-.5.2-.5.5v.8c0 .5-.4.9-.9.9s-.9-.4-.9-.9v-4.1c0-1.2.9-2.1 2.1-2.1z'
          + 'M4.6 12.1V7.4c0-1.6 1.3-2.9 2.9-2.9h9c1.6 0 2.9 1.3 2.9 2.9v4.7c0 .2-.2.3-.4.3-.5-.1-1-.1-1.5-.1h-.3c-.1 0-.2-.1-.2-.2-.2-1-1-1.7-2-1.7h-2.4c-1 0-1.8.7-2 1.7 0 .1-.1.2-.2.2h-1c-.1 0-.2-.1-.2-.2-.2-1-1-1.7-2-1.7H8.8c-1 0-1.8.7-2 1.7 0 .1-.1.2-.2.2h-.3c-.5 0-1 0-1.5.1-.2 0-.4-.1-.4-.3z';

type Hotel = { n:string; addr:string; nudge?:[number,number] };
const HOTELS: Hotel[] = [
  { n:'Marquis de Lafayette',  addr:'501 Beach Ave' },
  { n:'Beach Club on Madison', addr:'605 Madison Ave' },
  { n:'Montreal Beach Resort', addr:'1025 Beach Ave', nudge:[-8,6] },
  { n:'Ocean Club Hotel',      addr:'1035 Beach Ave', nudge:[10,-4] },
  { n:'The Grand Hotel',       addr:'1045 Beach Ave', nudge:[-7,4] },
  { n:'ICONA Cape May',        addr:'1101 Beach Ave', nudge:[11,0] },
  { n:'La Mer',                addr:'1317 Beach Ave' },
];

type Ev = { n:string; sub:string; img:string; place?:string; dx?:number; dy?:number; at?:[number,number] };
const ON_MAP: Ev[] = [
  { n:'Welcome Drinks', sub:'The Pier House',        img:'pier-house.png', place:'La Mer',       dx:-16, dy:-84 },
  { n:'Nuptial Mass',   sub:'Our Lady Star of the Sea', img:'osos.png',    place:'Nuptial Mass', dx:62, dy:-6 },
  { n:'After Party',    sub:"Carney's",              img:'carneys.png',    place:'After Party', dx:-70, dy:-56 },
  { n:'Beach Day',      sub:'Cape May Beach',        img:'beach.png',      at:[548, 396] },
];

const at = (n:string) => { const p = PLACES.find(p=>p.name===n); return p ? {x:p.x,y:p.y} : {x:0,y:0}; };

export default function CapeMayMap({ open, onClose }:{ open:boolean; onClose:()=>void }) {
  const [sel, setSel] = useState<string|null>(null);

  useEffect(() => {
    if (!open) return;
    const esc=(e:KeyboardEvent)=>{ if(e.key==='Escape') onClose(); };
    window.addEventListener('keydown',esc);
    const prev=document.body.style.overflow; document.body.style.overflow='hidden';
    return ()=>{ window.removeEventListener('keydown',esc); document.body.style.overflow=prev; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label="Map of Cape May" onClick={onClose}
      style={{ position:'fixed', inset:0, zIndex:400, background:'rgba(40,46,30,.55)',
               display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:CREAM, color:INK, border:'1px solid rgba(175,184,133,.65)',
                 maxWidth:1120, width:'100%', maxHeight:'92vh', overflowY:'auto',
                 padding:'26px 28px 22px', position:'relative' }}>
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
                {/* soft cream halo — covers icon and label, no hard rim */}
                <radialGradient id="cmm-halo">
                  <stop offset="0%" stopColor={CREAM} stopOpacity={.97} />
                  <stop offset="58%" stopColor={CREAM} stopOpacity={.94} />
                  <stop offset="100%" stopColor={CREAM} stopOpacity={0} />
                </radialGradient>
                {/* the far north-west corner is empty suburb — fade it out rather than cut it */}
                <radialGradient id="cmm-fade" cx="0.1" cy="0.04" r="0.62">
                  <stop offset="0%" stopColor="#000" />
                  <stop offset="52%" stopColor="#000" />
                  <stop offset="100%" stopColor="#fff" />
                </radialGradient>
                <mask id="cmm-streetmask">
                  <rect width={MAP_W} height={MAP_H} fill="url(#cmm-fade)" />
                </mask>
                <clipPath id="cmm-clip"><rect x="0" y="0" width={MAP_W} height={MAP_H} /></clipPath>
              </defs>

              <g clipPath="url(#cmm-clip)">
                <rect width={MAP_W} height={MAP_H} fill={SKY} />
                <path d={MAP_PATHS.land} fill={CREAM} />
                <path d={MAP_PATHS.coastLine} fill="none" stroke={SAND} strokeWidth={10} />
                <path d={MAP_PATHS.coastLine} fill="none" stroke={INK} strokeWidth={1.1} strokeOpacity={.45} />
                <path d={MAP_PATHS.islets} fill={CREAM} stroke={INK} strokeWidth={.8} strokeOpacity={.35} />
                
                <path d={MAP_PATHS.streets} fill="none" stroke={INK} strokeWidth={.7} strokeOpacity={.22} mask="url(#cmm-streetmask)" />
                <path d={MAP_PATHS.washington} fill="none" stroke={INK} strokeWidth={1.2} strokeOpacity={.42} />
                <path d={MAP_PATHS.beachAve} fill="none" stroke={INK} strokeWidth={2.6} />
              </g>

              {/* street labels, so the pins sit on something named */}
              <text x={18} y={MAP_H-14} fontSize={9.5} letterSpacing="1.4" fill={INK} opacity={.5}>BEACH AVENUE</text>
              <text x={300} y={MAP_H-40} fontSize={16} fill={INK} opacity={.38} textAnchor="middle"
                    fontStyle="italic" fontFamily="'Cormorant Garamond',Georgia,serif">The Atlantic</text>

              {/* events: cream disc behind the line art so both icon and label read on any ground */}
              {ON_MAP.map(e=>{
                const base = e.at ? {x:e.at[0],y:e.at[1]} : at(e.place as string);
                const x = base.x + (e.dx ?? 0), y = base.y + (e.dy ?? 0);
                return (
                  <g key={e.n}>
                    <ellipse cx={x} cy={y+16} rx={70} ry={56} fill="url(#cmm-halo)" />
                    <image href={ICON+e.img} x={x-23} y={y-23} width={46} height={46} filter="url(#cmm-ink)" opacity={.95} />
                    <text x={x} y={y+47} textAnchor="middle" fontSize={12.5} fontWeight={500} fill={INK}
                          stroke={CREAM} strokeWidth={3.2} paintOrder="stroke">{e.n}</text>
                    <text x={x} y={y+58} textAnchor="middle" fontSize={8.6} fill={INK} opacity={.7} letterSpacing=".7"
                          stroke={CREAM} strokeWidth={2.6} paintOrder="stroke">{e.sub.toUpperCase()}</text>
                  </g>
                );
              })}

              {/* hotels: one colour, one glyph. A small badge marks a planned shuttle pickup. */}
              {HOTELS.map(h=>{
                const p=at(h.n);
                const x=p.x+(h.nudge?.[0] ?? 0), y=p.y+(h.nudge?.[1] ?? 0);
                const on = sel===h.n;
                return (
                  <g key={h.n} style={{cursor:'pointer'}}
                     onMouseEnter={()=>setSel(h.n)} onMouseLeave={()=>setSel(null)}>
                    <circle cx={x} cy={y} r={14} fill={on?OLIVE:PISTACHIO} stroke={INK} strokeWidth={1.5} />
                    <g transform={`translate(${x-8} ${y-8}) scale(0.667)`}>
                      <path d={BED} fill={INK} />
                    </g>
                    <circle cx={x} cy={y} r={20} fill="transparent" />
                  </g>
                );
              })}

              {/* The reception is off the map. A callout reads far better than a tiny mini-map. */}
              <g transform={`translate(18 16)`}>
                <rect width={252} height={102} rx={2} fill={CREAM} stroke={INK} strokeOpacity={.5} />
                <image href={ICON+'reception-tent.png'} x={10} y={28} width={48} height={48}
                       filter="url(#cmm-ink)" opacity={.95} />
                <text x={66} y={28} fontSize={8.4} letterSpacing="1.3" fill={INK} opacity={.55}>THE RECEPTION</text>
                <text x={66} y={49} fontSize={15} fontWeight={500} fill={INK}>Isaac Smith Vineyard</text>
                <text x={66} y={66} fontSize={10.5} fill={INK} opacity={.7}>2.5 miles north</text>
                <text x={66} y={80} fontSize={10.5} fill={INK} opacity={.7}>about an 8 minute drive</text>
              </g>
            </svg>
          </div>

          <div className="cmm-key" style={{ flex:'0 0 214px' }}>
            <h4 style={{ fontSize:8.6, letterSpacing:'.15em', textTransform:'uppercase', opacity:.5, margin:'0 0 9px', fontWeight:500 }}>Where to stay</h4>
            {HOTELS.map(h=>(
              <div key={h.n} onMouseEnter={()=>setSel(h.n)} onMouseLeave={()=>setSel(null)}
                style={{ display:'flex', gap:9, alignItems:'center', marginBottom:7, fontSize:12.5, cursor:'pointer' }}>
                <span style={{ flex:'0 0 22px', height:22, borderRadius:'50%', border:'1.4px solid '+INK,
                               background: sel===h.n?OLIVE:PISTACHIO, display:'inline-flex',
                               alignItems:'center', justifyContent:'center' }}>
                  <svg viewBox="0 0 24 24" width={13} height={13}><path d={BED} fill={INK} /></svg>
                </span>
                <span>{h.n}<br />
                  <span style={{ opacity:.5, fontSize:10, letterSpacing:'.07em' }}>
                    {h.addr.toUpperCase()}
                  </span>
                </span>
              </div>
            ))}
            <h4 style={{ fontSize:8.6, letterSpacing:'.15em', textTransform:'uppercase', opacity:.5, margin:'16px 0 9px', fontWeight:500 }}>The weekend</h4>
            {ON_MAP.concat([{n:'Reception',sub:'Isaac Smith Vineyard',img:'reception-tent.png'}]).map(e=>(
              <div key={e.n} style={{ display:'flex', gap:9, alignItems:'center', marginBottom:7, fontSize:12.5 }}>
                <img src={ICON+e.img} alt="" style={{ width:26, height:26, objectFit:'contain', opacity:.85 }} />
                <span>{e.n}<br /><span style={{ opacity:.5, fontSize:10, letterSpacing:'.07em' }}>{e.sub.toUpperCase()}</span></span>
              </div>
            ))}
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
