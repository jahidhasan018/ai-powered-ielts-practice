import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

// A simple Pomodoro focus timer
export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [duration, setDuration] = useState(25); // minutes

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Here you could automatically log the completed time to Firestore
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const setTime = (mins: number) => {
    setIsActive(false);
    setDuration(mins);
    setTimeLeft(mins * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = 100 - ((timeLeft / (duration * 60)) * 100);

  return (
    <div className="max-w-md mx-auto w-full pt-10">
      <div className="bg-blue-600 rounded-3xl border border-blue-700 shadow-sm p-8 flex flex-col items-center justify-center text-white">
        <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-6">Deep Focus Mode</p>

        {/* Preset Durations */}
        <div className="flex space-x-2 mb-8 bg-black/10 p-1 rounded-full">
          {[15, 25, 45].map((mins) => (
             <button
               key={mins}
               onClick={() => setTime(mins)}
               className={`px-4 py-2 rounded-full text-xs font-bold uppercase transition-all ${duration === mins ? 'bg-white text-blue-600 shadow-sm' : 'text-blue-200 hover:text-white hover:bg-black/10'}`}
             >
               {mins}m
             </button>
          ))}
        </div>

        {/* Circular Progress & Time */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="58" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle 
              cx="64" cy="64" r="58" fill="none" stroke="white" strokeWidth="8"
              strokeDasharray="364"
              strokeDashoffset={364 - (364 * progress) / 100}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute text-5xl font-mono font-bold">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          <button className="px-4 py-2 rounded-full border border-white/30 text-xs font-bold uppercase hover:bg-white/10 transition-colors" onClick={resetTimer}>
             Reset
          </button>
          <button 
            className="w-16 h-16 flex items-center justify-center rounded-full bg-white text-blue-600 shadow-lg hover:scale-105 transition-transform"
            onClick={toggleTimer}
          >
             {isActive ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current ml-1" />}
          </button>
          <button className="px-4 py-2 rounded-full border border-white/30 text-xs font-bold uppercase hover:bg-white/10 transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
