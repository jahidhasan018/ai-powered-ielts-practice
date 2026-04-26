import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../lib/firebase';
import { Check, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

export default function DailyPlan() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const tasksRef = collection(db, `users/${auth.currentUser.uid}/tasks`);
    const q = query(tasksRef, where('date', '==', today));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (tasksData.length === 0 && snapshot.metadata.fromCache === false) {
        generateDailyTasks(today);
      } else {
        setTasks(tasksData);
        setLoading(false);
      }
    }, (error) => {
       console.error("Error fetching tasks", error);
       setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const generateDailyTasks = async (dateStr: string) => {
    if (!auth.currentUser) return;
    try {
      const defaultTasks = [
        { id: `task-1-${dateStr}`, type: 'Reading', durationMinutes: 20 },
        { id: `task-2-${dateStr}`, type: 'Listening', durationMinutes: 15 },
        { id: `task-3-${dateStr}`, type: 'Writing', durationMinutes: 25 },
      ];

      for (const t of defaultTasks) {
        await setDoc(doc(db, `users/${auth.currentUser.uid}/tasks`, t.id), {
          date: dateStr,
          type: t.type,
          durationMinutes: t.durationMinutes,
          completed: false,
          timeSpentMinutes: 0,
          courseProgress: {}, // ADDED THIS INITIALIZATION
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleTask = async (e: React.MouseEvent, taskId: string, currentCompleted: boolean) => {
    e.stopPropagation();
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, `users/${auth.currentUser.uid}/tasks`, taskId), {
        completed: !currentCompleted,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.error(e);
    }
  };

  const markAllComplete = async () => {
    if (!auth.currentUser) return;
    try {
      const incompleted = tasks.filter(t => !t.completed);
      for (const t of incompleted) {
        await updateDoc(doc(db, `users/${auth.currentUser.uid}/tasks`, t.id), {
          completed: true,
          updatedAt: serverTimestamp()
        });
      }
    } catch (e) {
       console.error(e);
    }
  };

  if (loading) return <div className="p-8 font-medium text-slate-500 text-sm">Loading daily tasks...</div>;

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          Daily Plan <span className="text-xs font-normal text-slate-400">{format(new Date(), 'MMM dd')}</span>
        </h3>
        
        {/* Progress Bar (Subtle) */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
             <span className="text-xs font-bold text-slate-500 uppercase">{completedCount} of {tasks.length} Modules</span>
             <span className="text-xs font-bold text-blue-600">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="space-y-4 flex-1 overflow-hidden">
          {tasks.map(task => {
            const isCompleted = task.completed;
            const timeSpent = task.timeSpentMinutes || 0;
            return (
              <div 
                key={task.id} 
                className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${isCompleted ? 'bg-blue-50/50 border-blue-100' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'}`}
                onClick={() => navigate(`/dashboard/module/${task.id}`)}
              >
                <button 
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${isCompleted ? 'border-blue-600 bg-blue-600' : 'border-slate-300 hover:border-blue-400'}`}
                  onClick={(e) => toggleTask(e, task.id, task.completed)}
                >
                  {isCompleted && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </button>
                <div className="flex-1">
                  <p className={`text-base font-bold ${isCompleted ? 'text-blue-900 opacity-80' : 'text-slate-800'}`}>
                    {task.type} Module
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${isCompleted ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                      {isCompleted ? 'Completed' : 'Pending'}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      ⏱ {timeSpent > 0 ? `${timeSpent}m elapsed` : `${task.durationMinutes}m est.`}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <ChevronRight className={`w-5 h-5 ${isCompleted ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-600'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
