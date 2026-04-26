import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { TrendingUp, Flame, CheckCircle, Clock } from 'lucide-react';

export default function Progress() {
  const [stats, setStats] = useState({
    totalTimeMinutes: 0,
    streak: 0,
    completedTasks: 0,
  });

  useEffect(() => {
    async function fetchProgress() {
      if (!auth.currentUser) return;
      const docRef = doc(db, `users/${auth.currentUser.uid}/progress`, 'stats');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setStats(snap.data() as any);
      }
    }
    fetchProgress();
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Target & Usage Stats (Match Current Stats) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-widest">Current Stats</p>
          <div className="mb-6">
            <p className="text-xs text-slate-500 font-medium">Study Streak</p>
            <p className="text-3xl font-bold mt-1 tracking-tight">{stats.streak} <span className="text-sm font-normal text-orange-500">Days</span></p>
          </div>
          <div className="mb-6">
            <p className="text-xs text-slate-500 font-medium">Time Studied</p>
            <p className="text-3xl font-bold mt-1 tracking-tight">{Math.round(stats.totalTimeMinutes / 60)} <span className="text-sm font-normal text-blue-500">Hours</span></p>
          </div>
          <div>
             <p className="text-xs text-slate-500 font-medium">Tasks Completed</p>
            <p className="text-3xl font-bold mt-1 tracking-tight">{stats.completedTasks} <span className="text-sm font-normal text-green-500">Tasks</span></p>
          </div>
        </div>
        <div className="mt-8">
          <div className="flex justify-between text-xs text-slate-400 font-medium mb-2">
            <span>Goal Progress</span>
            <span>75%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 w-3/4"></div>
          </div>
        </div>
      </div>

      {/* Skills Breakdown (Match Skill Breakdown) */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col">
         <p className="text-[10px] font-bold text-slate-400 uppercase mb-6 tracking-widest">Skills Health</p>
         <div className="space-y-6 flex-1 flex flex-col justify-center">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Reading</span>
                <span className="text-xs text-slate-400">85%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-emerald-400 w-[85%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Writing</span>
                 <span className="text-xs text-slate-400">45%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-orange-400 w-[45%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Listening</span>
                 <span className="text-xs text-slate-400">70%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-blue-400 w-[70%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Speaking</span>
                 <span className="text-xs text-slate-400">60%</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-purple-400 w-[60%]"></div></div>
            </div>
         </div>
      </div>
    </div>
  );
}
