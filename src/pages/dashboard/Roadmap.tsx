import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { format, differenceInDays } from 'date-fns';

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState<any>(null);

  useEffect(() => {
    async function fetchRoadmap() {
      if (!auth.currentUser) return;
      const docRef = doc(db, `users/${auth.currentUser.uid}/roadmaps`, 'current_roadmap');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setRoadmap({ id: snap.id, ...snap.data() });
      }
    }
    fetchRoadmap();
  }, []);

  if (!roadmap) return <div className="p-8 text-sm font-medium text-slate-500">Loading roadmap...</div>;

  const startDate = new Date(roadmap.startDate);
  const endDate = new Date(roadmap.endDate);
  const totalDays = differenceInDays(endDate, startDate);
  const daysPassed = Math.max(0, differenceInDays(new Date(), startDate));
  const progress = Math.min(100, Math.round((daysPassed / totalDays) * 100));
  const currentWeek = Math.floor(daysPassed / 7) + 1;

  // Let's generate a list of dates for the next 6 days to fit the visualizer pattern
  const timelineDays = Array.from({length: 6}).map((_, i) => {
     const date = new Date();
     date.setDate(date.getDate() + (i - 1)); // start from yesterday
     return date;
  });

  return (
    <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-5">
      {/* Main Roadmap Visualizer */}
      <div className="md:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col h-full min-h-[320px]">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Weekly Strategy</h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider">
            WEEK {Math.min(currentWeek, roadmap.durationWeeks)} / {roadmap.durationWeeks}
          </span>
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
           <div className="flex-1 flex items-center justify-between px-2 md:px-4 relative mb-10">
             <div className="absolute left-4 right-4 h-1 bg-slate-100 top-1/2 -translate-y-1/2 z-0 rounded-full"></div>
             
             {timelineDays.map((date, i) => {
               const diff = differenceInDays(date, new Date());
               const isPast = diff < 0;
               const isToday = diff === 0;
               const isMockTest = i === timelineDays.length - 1; // Arbitrarily make the last one a mock test
               
               if (isMockTest) {
                 return (
                   <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white text-xs font-bold shadow-md">MT</div>
                     <p className="text-[10px] font-bold text-orange-500 uppercase">Mock Test</p>
                   </div>
                 );
               }

               return (
                  <div key={i} className={`relative z-10 flex flex-col items-center gap-3 ${!isPast && !isToday ? 'opacity-40' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isPast ? 'bg-blue-600 text-white' : isToday ? 'bg-blue-600 text-white ring-8 ring-blue-50' : 'bg-slate-200 text-slate-500'}`}>
                      {format(date, 'd')}
                    </div>
                    <p className={`text-[10px] font-bold uppercase ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>{format(date, 'eee')}</p>
                  </div>
               )
             })}
           </div>

           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
             <p className="text-sm font-medium">💡 <span className="text-slate-600 italic">"Today's focus is on time management. Don't spend more than 20 mins on Task 1."</span></p>
           </div>
        </div>
      </div>

       {/* Footer Info (Exam Countdown) */}
      <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4 justify-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 mb-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Exam Countdown</p>
          <p className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 mb-1">{totalDays - daysPassed > 0 ? `${totalDays - daysPassed} Days Remaining` : 'Exam Passed'}</p>
          <p className="text-xs text-slate-500">{format(endDate, 'MMM d, yyyy')} • Target Band {roadmap.targetBand || 'N/A'}</p>
        </div>
        <div className="mt-4">
           <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
           </div>
        </div>
      </div>
    </div>
  );
}
