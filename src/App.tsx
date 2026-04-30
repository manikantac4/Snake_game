import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] font-digital flex flex-col overflow-hidden border-0 sm:border-4 border-[#ff00ff]">
      <header className="h-16 border-b-4 border-[#ff00ff] flex items-center justify-between px-6 bg-black shrink-0 relative overflow-hidden">
        {/* Subtle scanline behind header */}
        <div className="absolute inset-0 bg-[rgba(255,0,255,0.1)] opacity-50 z-0 mix-blend-screen pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10 w-full">
          <div className="w-10 h-10 bg-[#00ffff] flex items-center justify-center">
            <svg className="w-6 h-6 text-[#ff00ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path strokeLinecap="none" strokeLinejoin="miter" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tighter text-[#ff00ff] uppercase animate-glitch" style={{textShadow: "2px 2px 0px #00ffff"}}>
            SYNTH-SNAKE
          </h1>
          <span className="text-[#00ffff] text-[10px] uppercase ml-auto">v1.0.4.ERR</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <aside className="w-full md:w-80 border-b-4 md:border-r-4 md:border-b-0 border-[#ff00ff] bg-black p-4 flex flex-col shrink-0 overflow-y-auto">
          <MusicPlayer />
        </aside>

        <section className="flex-1 bg-black p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #ff00ff 2px, transparent 4px)", opacity: 0.15 }} />
          <SnakeGame />
        </section>

        <aside className="w-full md:w-64 border-t-4 md:border-l-4 md:border-t-0 border-[#ff00ff] bg-black p-4 hidden xl:flex flex-col gap-6 shrink-0 overflow-y-auto z-10">
          <div>
            <h3 className="text-xs text-[#00ffff] uppercase mb-4 animate-glitch inline-block" style={{textShadow: "1px 1px 0px #ff00ff"}}>SYS.STATUS</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] uppercase mb-2 text-[#ff00ff]">
                  <span>CPU_LOAD</span>
                  <span>ERR%</span>
                </div>
                <div className="h-4 bg-black border-2 border-[#00ffff] overflow-hidden p-[2px]">
                  <div className="h-full bg-[#ff00ff] w-[42%] animate-glitch" style={{animationDuration: '0.2s'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] uppercase mb-2 text-[#00ffff]">
                  <span>MEM_LEAK</span>
                  <span>FATAL</span>
                </div>
                <div className="h-4 bg-black border-2 border-[#ff00ff] overflow-hidden p-[2px]">
                  <div className="h-full bg-[#00ffff] w-[88%] animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto bg-[#ff00ff] p-4 text-black border-4 border-[#00ffff]">
            <p className="text-[10px] uppercase leading-relaxed font-bold animate-glitch" style={{animationDuration: '2s'}}>
              &gt; WARN: AUDIO SYNTHESIS CORRUPTED. AVERT EYES FROM HIGH CONSTRAST PIXELS.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

