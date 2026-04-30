import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Dreams (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Cyber Synths (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Digital Horizon (AI Gen)', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.play().catch(e => console.log('Audio playback prevented:', e));
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  const toggleMute = () => setIsMuted(!isMuted);

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="flex flex-col h-full w-full max-w-sm mx-auto p-2 border-2 border-[#00ffff] bg-black">
      <h2 className="text-xs text-[#ff00ff] uppercase tracking-widest mb-4 inline-block font-bold">NEURAL_LIBRARY</h2>
      <div className="space-y-4 flex-1">
        {TRACKS.map((track, i) => {
          const isActive = i === currentTrackIndex;
          return (
            <div 
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(i);
                setIsPlaying(true);
              }}
              className={`p-2 transition-colors flex items-center gap-3 cursor-pointer border-2 ${
                isActive 
                  ? 'bg-[#00ffff] text-black border-[#00ffff] shadow-[2px_2px_0px_#ff00ff] -translate-y-1 -translate-x-1' 
                  : 'bg-black text-[#00ffff] border-[#00ffff] hover:bg-[#ff00ff] hover:text-black hover:border-[#ff00ff]'
              }`}
            >
              <div className={`w-8 h-8 flex items-center justify-center shrink-0`}>
                <Music size={16} />
              </div>
              <div className="overflow-hidden">
                <p className={`text-[10px] font-bold truncate uppercase ${isActive ? 'text-black' : ''}`}>
                  {track.title}
                </p>
                <p className={`text-[8px] uppercase tracking-tighter ${isActive ? 'text-black font-bold' : 'text-[#ff00ff]'}`}>
                  AI_GENERATION
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
        loop={false}
      />

      <div className="mt-auto pt-6">
        <div className="bg-black p-4 border-t-4 border-[#ff00ff] mb-4">
          <p className="text-[10px] uppercase font-bold text-[#ff00ff] mb-2 animate-glitch" style={{animationDuration: '1s'}}>VISUALIZER.EXE</p>
          <div className="flex items-end gap-1 h-12">
            {[60, 40, 100, 30, 80, 50, 90, 70].map((h, i) => (
              <div 
                key={i} 
                className={`flex-1 transition-all duration-75 ${isPlaying ? 'bg-[#00ffff]' : 'bg-[#00ffff] opacity-20'}`}
                style={{ height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : `${h / 4}%` }}
              />
            ))}
          </div>
        </div>

        <div className="bg-black p-4 border-4 border-[#00ffff] shadow-[4px_4px_0px_#ff00ff]">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevTrack} className="text-[#00ffff] hover:text-[#ff00ff] hover:scale-110 p-2 transition-transform">
              <SkipBack size={24} />
            </button>
            <button onClick={togglePlay} className="w-14 h-14 bg-[#ff00ff] text-black flex items-center justify-center hover:bg-[#00ffff] hover:shadow-[4px_4px_0px_#ff00ff] transition-all border-2 border-transparent hover:border-black flex-shrink-0 animate-pulse">
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
            </button>
            <button onClick={nextTrack} className="text-[#00ffff] hover:text-[#ff00ff] hover:scale-110 p-2 transition-transform">
              <SkipForward size={24} />
            </button>
          </div>
          
          <div className="flex items-center gap-3 text-[#00ffff]">
            <button onClick={toggleMute} className="hover:text-[#ff00ff] transition-colors">
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-full h-2 bg-black border-2 border-[#00ffff] appearance-none cursor-pointer accent-[#ff00ff]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
