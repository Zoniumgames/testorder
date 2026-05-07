import React, { useState, useEffect, useCallback } from 'react';
import { Search, History, AlertCircle, ExternalLink, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const BACKGROUNDS = [
  {
    name: 'Sophisticated Dark',
    bg1: '#0f172a',
    bg2: '#1e293b',
    primary: '#00d2ff',
    secondary: '#9d50bb',
    image: 'https://images.pexels.com/photos/27085003/pexels-photo-27085003.jpeg?_gl=1*1ikeyvi*_ga*MTQ3MTA3MzE4NC4xNzc4MTI5MDQ0*_ga_8JE65Q40S6*czE3NzgxMjkwNDQkbzEkZzEkdDE3NzgxMjkwOTckajckbDAkaDA.', // USER: Put your image URL here
  },
  {
    name: 'Midnight Rose',
    bg1: '#1a1a2e',
    bg2: '#16213e',
    primary: '#e94560',
    secondary: '#0f3460',
    image: 'https://images.pexels.com/photos/4626277/pexels-photo-4626277.jpeg?_gl=1*4le2qg*_ga*MTQ3MTA3MzE4NC4xNzc4MTI5MDQ0*_ga_8JE65Q40S6*czE3NzgxMjkwNDQkbzEkZzEkdDE3NzgxMjk0NjIkajQxJGwwJGgw', // USER: Put your image URL here
  },
  {
    name: 'Neon Oasis',
    bg1: '#070b0d',
    bg2: '#1a2a2f',
    primary: '#00ffa3',
    secondary: '#00a8ff',
    image: 'https://images.pexels.com/photos/13729358/pexels-photo-13729358.png?_gl=1*1d5jl2h*_ga*MTQ3MTA3MzE4NC4xNzc4MTI5MDQ0*_ga_8JE65Q40S6*czE3NzgxMjkwNDQkbzEkZzEkdDE3NzgxMjk1MDUkajU5JGwwJGgw', // USER: Put your image URL here
  }
];

export default function App() {
  const [orderNumber, setOrderNumber] = useState('');
  const [history, setHistory] = useState<{ number: string; time: string }[]>([]);
  const [status, setStatus] = useState<'idle' | 'valid' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [bgIndex, setBgIndex] = useState(0);

  // Background change every 20 minutes (1200000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 75000); 

    return () => clearInterval(interval);
  }, []);

  const handleSearch = useCallback((value?: string) => {
    const targetValue = value ?? orderNumber;
    
    // Reset states
    setStatus('idle');
    setErrorMessage('');

    // Validation: Exactly as in original code
    if (!/^\d+$/.test(targetValue)) {
      setErrorMessage("Invalid Order Format");
      setStatus('error');
      return;
    }

    // Success
    setStatus('valid');
    const urlFinal = `https://manowar.hover.to/orders/${targetValue}`;
    window.open(urlFinal, "_blank");

    // History logic
    setHistory((prev) => {
      const exists = prev.find(h => h.number === targetValue);
      if (exists) return prev;
      const newHist = [{ number: targetValue, time: 'Just now' }, ...prev];
      return newHist.slice(0, 5);
    });

    setOrderNumber('');

    // Reset valid state after animation
    setTimeout(() => {
      setStatus('idle');
    }, 2000);
  }, [orderNumber]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const currentBg = BACKGROUNDS[bgIndex];

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans perspective-1000">
      {/* Dynamic Background */}
      <div 
        className="liquid-bg" 
        style={{ 
          background: currentBg.image 
            ? `url(${currentBg.image}) center/cover no-repeat` 
            : `linear-gradient(135deg, ${currentBg.bg1}, ${currentBg.bg2})` 
        }}
      >
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [-20, 20, -20], y: [-20, 20, -20] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="blob w-[800px] h-[800px] -top-[200px] -left-[200px]"
          style={{ background: `radial-gradient(circle, ${currentBg.primary}26 0%, ${currentBg.secondary}26 100%)` }}
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], x: [20, -20, 20], y: [20, -20, 20] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="blob w-[700px] h-[700px] -bottom-[200px] -right-[200px]"
          style={{ background: `radial-gradient(circle, ${currentBg.secondary}26 0%, ${currentBg.primary}26 100%)` }}
        />
      </div>

      {/* Decorative Image Placeholders */}
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-[10px] text-white/20 text-center uppercase tracking-widest hidden lg:flex">
        [HOVER]
      </div>
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center text-[10px] text-white/20 text-center uppercase tracking-widest hidden lg:flex">
        []
      </div>

      {/* Main Glass Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 40, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card w-full max-w-[440px] p-10 rounded-[2rem] relative z-20 mx-4"
      >
        <header className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter title-gradient mb-1">Order Lookup</h1>
            <p className="text-white/40 text-[13px] font-medium uppercase tracking-[0.15em]">Secure Order Vault</p>
          </div>
          <div className="status-dot mt-3" />
        </header>

        <div className="space-y-6">
          <div className="relative group">
            <motion.input
              animate={status === 'error' ? { x: [-4, 4, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Order Number (e.g. 55012)"
              className="w-full bg-black/40 border border-white/20 p-5 rounded-2xl text-lg text-white font-medium outline-none transition-all duration-300 placeholder:text-white/30
                focus:bg-black/60 focus:border-cyan-400 group-hover:border-white/30 focus:shadow-[0_0_30px_rgba(0,210,255,0.2)]"
              style={{ borderColor: status === 'error' ? '#ff4b2b' : status === 'valid' ? '#4ade80' : undefined }}
            />
            <AnimatePresence>
              {status === 'valid' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-400 drop-shadow-md"
                >
                  <CheckCircle2 className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="flex items-center gap-2 text-[#ff4b2b] text-[13px] font-bold tracking-wide drop-shadow-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSearch()}
            className="w-full py-5 rounded-2xl font-bold text-lg text-white shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
            style={{ 
              background: `linear-gradient(135deg, ${currentBg.primary}, ${currentBg.secondary})`,
              boxShadow: `0 10px 40px -10px ${currentBg.primary}80` 
            }}
          >
            <span className="relative z-10">Initiate Lookup</span>
            <ExternalLink className="w-5 h-5 relative z-10" />
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        </div>

        {history.length > 0 && (
          <div className="mt-12">
            <h4 className="text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] mb-4">Recent History</h4>
            <div className="space-y-2.5">
              <AnimatePresence initial={false}>
                {history.map((h) => (
                  <motion.div
                    key={h.number}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.15)' }}
                    onClick={() => handleSearch(h.number)}
                    className="flex justify-between items-center p-4 bg-white/[0.03] rounded-xl border border-white/[0.05] cursor-pointer transition-all duration-200"
                  >
                    <span className="font-mono text-white text-sm font-semibold tracking-wider">#{h.number}</span>
                    <span className="text-[10px] text-white/30 font-medium">{h.time}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>

      {/* Atmospheric Info Overlay */}
      <div className="fixed bottom-8 left-8 flex items-center gap-4 pointer-events-none opacity-30 select-none">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-white tracking-[0.3em] uppercase">Phase Status</span>
          <span className="text-[9px] font-medium text-white/50 tracking-[0.1em]">ENCRYPTION ACTIVE v4.2.1</span>
        </div>
      </div>
      
      <div className="fixed top-8 right-8 pointer-events-none opacity-20 select-none">
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      </div>
    </div>
  );
}
