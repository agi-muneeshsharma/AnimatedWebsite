import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/lib/utils';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Replace this URL with your actual sound file path
  const audioSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.error("Playback failed:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      <audio ref={audioRef} src={audioSrc} loop />
      
      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 p-2 rounded-full shadow-2xl">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full text-cyan-400 hover:text-cyan-300 hover:bg-white/10"
            >
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 bg-black/80 backdrop-blur-xl border-white/10 p-4 mb-2">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-cyan-500/60">
                <span>Volume</span>
                <span>{isMuted ? 0 : volume}%</span>
              </div>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={(vals) => {
                  setVolume(vals[0]);
                  if (vals[0] > 0) setIsMuted(false);
                }}
                className="cursor-pointer"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Button
          onClick={togglePlay}
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-full transition-all duration-300",
            isPlaying 
              ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
              : "text-cyan-400 hover:text-cyan-300 hover:bg-white/10"
          )}
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-0.5" fill="currentColor" />}
        </Button>
      </div>
    </div>
  );
};

export default MusicPlayer;