import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { getCourseContentForTask, TaskContent } from '../../lib/courseContent';
import { ChevronLeft, CheckCircle, Clock } from 'lucide-react';

type SectionState = 'concept' | 'guided' | 'practice' | 'review';

export default function LearningModule() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<any>(null);
  const [content, setContent] = useState<TaskContent | null>(null);
  
  const [currentSection, setCurrentSection] = useState<SectionState>('concept');
  const [guidedProgress, setGuidedProgress] = useState<Record<string, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const fetchTask = async () => {
      if (!auth.currentUser || !taskId) return;
      try {
        const docRef = doc(db, `users/${auth.currentUser.uid}/tasks`, taskId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTask({ id: docSnap.id, ...data });
          
          // Load course content based on task type
          const moduleContent = getCourseContentForTask(data.type);
          setContent(moduleContent);

          // Restore progress if it exists
          if (data.courseProgress) {
            setGuidedProgress(data.courseProgress.guidedProgress || {});
            setPracticeAnswers(data.courseProgress.practiceAnswers || {});
          }
          setTimeSpent(data.timeSpentMinutes ? data.timeSpentMinutes * 60 : 0); // Convert to seconds for local tracking
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [taskId]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const saveProgress = async (updates: any = {}) => {
    if (!auth.currentUser || !taskId) return;
    try {
      const docRef = doc(db, `users/${auth.currentUser.uid}/tasks`, taskId);
      await updateDoc(docRef, {
        courseProgress: {
          guidedProgress,
          practiceAnswers,
          ...updates
        },
        timeSpentMinutes: Math.floor(timeSpent / 60),
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkModuleComplete = async () => {
    if (!auth.currentUser || !taskId) return;
    try {
      const docRef = doc(db, `users/${auth.currentUser.uid}/tasks`, taskId);
      await updateDoc(docRef, {
        completed: true,
        courseProgress: {
          guidedProgress,
          practiceAnswers,
        },
        timeSpentMinutes: Math.floor(timeSpent / 60),
        updatedAt: serverTimestamp()
      });
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-slate-500 font-medium">Loading module...</div>;
  if (!content) return <div className="p-8 text-red-500">Module content not found.</div>;

  const sections: { id: SectionState; label: string }[] = [
    { id: 'concept', label: '1. Learn' },
    { id: 'guided', label: '2. Guided' },
    { id: 'practice', label: '3. Practice' },
    { id: 'review', label: '4. Review' }
  ];

  return (
    <div className="max-w-4xl mx-auto w-full pb-20">
      <button 
        onClick={() => {
           saveProgress();
           navigate('/dashboard');
        }} 
        className="flex items-center text-slate-500 hover:text-slate-800 font-medium mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" />
        Back to Daily Plan
      </button>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">{content.topic}</p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{content.title}</h1>
          </div>
          <div className="flex items-center text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm font-bold">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</span>
          </div>
        </div>

        {/* Progress Tabs */}
        <div className="flex overflow-x-auto gap-2 md:gap-4 mt-8 pb-2">
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => setCurrentSection(sec.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                currentSection === sec.id 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 min-h-[400px]">
        {/* Concept Section */}
        {currentSection === 'concept' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-800">{content.lessons.concept.title}</h2>
            <div className="prose prose-slate max-w-none text-slate-600 whitespace-pre-wrap">
              {content.lessons.concept.content}
            </div>
            <div className="pt-8 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setCurrentSection('guided')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Continue to Guided Practice
              </button>
            </div>
          </div>
        )}

        {/* Guided Practice Section */}
        {currentSection === 'guided' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-slate-800">Guided Practice</h2>
               <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">With Hints</span>
             </div>
             
             {content.lessons.guidedTasks.map((t, idx) => (
                <div key={t.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <p className="font-bold text-slate-800 mb-4"><span className="text-blue-600 mr-2">Q{idx + 1}.</span>{t.instruction}</p>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-600 text-sm mb-4 leading-relaxed">
                    {t.resource}
                  </div>
                  
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-4">
                    <p className="text-xs font-bold text-blue-600 uppercase mb-1 flex items-center">
                      <span className="text-lg mr-2">💡</span> Hint
                    </p>
                    <p className="text-sm text-blue-900">{t.hint}</p>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <button 
                      onClick={() => {
                        const newProg = { ...guidedProgress, [t.id]: true };
                        setGuidedProgress(newProg);
                        saveProgress({ guidedProgress: newProg });
                      }}
                      className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-colors ${guidedProgress[t.id] ? 'bg-green-100 text-green-700' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                      {guidedProgress[t.id] && <CheckCircle className="w-4 h-4 mr-2" />}
                      {guidedProgress[t.id] ? 'Completed' : 'Mark as Done'}
                    </button>
                  </div>
                </div>
             ))}

            <div className="pt-8 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setCurrentSection('practice')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Start Independent Practice
              </button>
            </div>
          </div>
        )}

        {/* Independent Practice Section */}
        {currentSection === 'practice' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold text-slate-800">Independent Practice</h2>
               <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Test Conditions</span>
             </div>

             {content.lessons.practiceTasks.map((t, idx) => (
               <div key={t.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <p className="font-bold text-slate-800 mb-6"><span className="text-blue-600 mr-2">Q{idx + 1}.</span>{t.question}</p>
                  
                  {t.type === 'mcq' && t.options && (
                    <div className="space-y-3">
                      {t.options.map((opt, oIdx) => {
                        const isSelected = practiceAnswers[t.id] === opt;
                        const hasFeedback = showFeedback[t.id];
                        const isCorrect = opt === t.correctAnswer;
                        
                        let btnStyle = "bg-white border-slate-200 text-slate-700 hover:border-slate-300";
                        if (isSelected) btnStyle = "bg-blue-50 border-blue-400 text-blue-900 font-medium z-10 relative";
                        
                        // If showing feedback, highlight right and wrong
                        if (hasFeedback) {
                           if (isCorrect) btnStyle = "bg-green-50 border-green-500 text-green-900 font-bold";
                           else if (isSelected && !isCorrect) btnStyle = "bg-red-50 border-red-400 text-red-900";
                           else btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-50";
                        }

                        return (
                          <div key={oIdx}>
                            <button
                              disabled={hasFeedback}
                              onClick={() => {
                                const newAns = { ...practiceAnswers, [t.id]: opt };
                                setPracticeAnswers(newAns);
                                saveProgress({ practiceAnswers: newAns });
                              }}
                              className={`w-full text-left px-5 py-4 rounded-xl border transition-all text-sm ${btnStyle}`}
                            >
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center shrink-0 ${isSelected ? (hasFeedback && isCorrect ? 'border-green-500 bg-green-500' : hasFeedback && !isCorrect ? 'border-red-500 bg-red-500' : 'border-blue-500 bg-blue-500') : 'border-slate-300'}`}>
                                   {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                                {opt}
                              </div>
                            </button>
                            
                            {hasFeedback && isSelected && t.optionExplanations && t.optionExplanations[opt] && (
                              <div className={`mt-2 p-3 text-sm rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                                {t.optionExplanations[opt]}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {!showFeedback[t.id] && practiceAnswers[t.id] && (
                    <div className="mt-6">
                      <button 
                        onClick={() => setShowFeedback({...showFeedback, [t.id]: true})}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors"
                      >
                        Check Answer
                      </button>
                    </div>
                  )}
               </div>
             ))}

             <div className="pt-8 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setCurrentSection('review')}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Go to Review
              </button>
            </div>
          </div>
        )}

        {/* Review Section */}
        {currentSection === 'review' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold text-slate-800">Review & Feedback</h2>
            
            {/* Show stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center items-center text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Time Elapsed</p>
                <p className="text-2xl font-bold text-slate-800">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center items-center text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-slate-800">
                  {content.lessons.practiceTasks.length > 0 ? Math.round((content.lessons.practiceTasks.filter(t => practiceAnswers[t.id] === t.correctAnswer).length / content.lessons.practiceTasks.length) * 100) : 100}%
                </p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-blue-900 mb-3">Expert Explanation</h3>
              <p className="text-blue-800 leading-relaxed text-sm">
                {content.lessons.review.explanations}
              </p>
            </div>
            
            <div className="pt-8 mt-8 border-t border-slate-100 text-center">
               <button 
                  onClick={handleMarkModuleComplete}
                  className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 w-full md:w-auto"
               >
                 🏁 Finish & Mark Module Complete
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
