'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GarciaLogo from './GarciaLogo';

interface LandingPageProps {
  onSuccess: () => void;
}

// Simplified but accurate-ish NJ silhouette path
// NJ is roughly a trapezoid with the Delaware River on the west, coastline on the east
const NJ_PATH = `M 150,10
  L 155,18 L 158,28 L 160,42 L 158,55 L 155,65
  L 150,75 L 143,88 L 138,96 L 132,105
  L 126,112 L 120,118 L 112,124 L 105,130
  L 97,138 L 90,148 L 83,158 L 77,168
  L 72,178 L 68,188 L 65,198 L 63,208
  L 61,218 L 60,228 L 60,238 L 61,245
  L 62,252 L 64,258 L 67,262 L 70,265
  L 74,267 L 78,265 L 80,260 L 78,254
  L 74,248 L 72,242 L 72,236 L 74,230
  L 78,225 L 82,220 L 84,212 L 83,204
  L 80,196 L 76,190 L 73,182 L 73,175
  L 76,170 L 80,168 L 86,170 L 90,178
  L 91,187 L 88,196 L 85,205 L 84,214
  L 86,222 L 90,228 L 95,232 L 100,232
  L 104,228 L 105,222 L 103,215 L 99,208
  L 96,200 L 95,192 L 97,184 L 102,178
  L 108,175 L 113,178 L 116,184 L 115,192
  L 112,200 L 110,208 L 111,216 L 115,222
  L 120,226 L 125,224 L 128,218 L 128,210
  L 125,202 L 122,194 L 122,186 L 125,180
  L 130,177 L 135,180 L 138,188 L 138,197
  L 135,206 L 132,215 L 132,224 L 136,230
  L 141,232 L 146,228 L 148,220 L 146,212
  L 143,204 L 142,196 L 144,188 L 148,184
  L 152,186 L 154,192 L 152,200 L 150,208
  L 150,216 L 154,222 L 158,222 L 160,216
  L 160,208 L 158,200 L 157,192 L 158,184
  L 160,178 L 162,172 L 162,164 L 160,156
  L 157,148 L 153,140 L 149,133 L 145,125
  L 140,118 L 135,110 L 130,102 L 125,93
  L 120,84 L 116,74 L 113,64 L 111,54
  L 110,44 L 110,34 L 112,24 L 115,16
  L 118,10 Z`;

export default function LandingPage({ onSuccess }: LandingPageProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [videoFading, setVideoFading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const correctPassword = process.env.NEXT_PUBLIC_PASSWORD || 'hdg3';

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (password.toLowerCase() === correctPassword.toLowerCase()) {
      setVideoFading(true);
      await new Promise(r => setTimeout(r, 600));
      setTransitioning(true);
      sessionStorage.setItem('garcia-auth', 'true');
      await new Promise(r => setTimeout(r, 1800));
      onSuccess();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #B8C8E0 0%, #ABBE9C 100%)' }}
      animate={transitioning ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.8, delay: transitioning ? 0.8 : 0 }}
    >
      {/* Logo above silhouette */}
      <motion.div
        className="mb-4 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <GarciaLogo width={180} height={90} color="#1A2744" />
      </motion.div>

      {/* NJ Silhouette with video */}
      <motion.div
        className="relative z-10"
        style={{ width: 300, height: 320 }}
        animate={
          transitioning
            ? { scale: 4, y: 200 }
            : { scale: 1, y: 0 }
        }
        transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <svg
          viewBox="0 0 320 340"
          width="300"
          height="320"
          style={{ filter: 'drop-shadow(0 8px 24px rgba(26,39,68,0.35))' }}
        >
          <defs>
            <clipPath id="nj-clip">
              <path d={NJ_PATH} transform="scale(1.0)" />
            </clipPath>
          </defs>

          {/* Video inside silhouette */}
          <foreignObject x="0" y="0" width="320" height="340" clipPath="url(#nj-clip)">
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                background: '#000',
              }}
            >
              <motion.div
                style={{ width: '100%', height: '100%' }}
                animate={videoFading ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <iframe
                  src="https://www.youtube.com/embed/he6_qMIM3wY?autoplay=1&mute=1&loop=1&playlist=he6_qMIM3wY&controls=0&showinfo=0&rel=0&modestbranding=1"
                  style={{
                    width: '160%',
                    height: '160%',
                    marginLeft: '-30%',
                    marginTop: '-30%',
                    border: 'none',
                    pointerEvents: 'none',
                  }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              </motion.div>
            </div>
          </foreignObject>

          {/* NJ outline stroke */}
          <path
            d={NJ_PATH}
            fill="none"
            stroke="#1A2744"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* Password form */}
      <motion.div
        className="mt-8 z-10 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={transitioning ? { opacity: 0 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className={`px-6 py-3 bg-cream border-2 border-navy text-navy text-center text-lg tracking-widest outline-none rounded-none transition-all ${
              shake ? 'shake' : ''
            } ${error ? 'border-rose' : 'border-navy'}`}
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              letterSpacing: '0.15em',
              minWidth: 240,
            }}
            autoFocus
          />
          <button
            type="submit"
            className="px-8 py-3 bg-navy text-cream text-lg tracking-widest hover:bg-rose transition-colors duration-300"
            style={{ fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: '0.2em' }}
          >
            Enter →
          </button>
        </form>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-rose text-sm tracking-wider"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              Incorrect password
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
