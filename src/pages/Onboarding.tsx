import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Check, Download, X } from 'lucide-react';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { Button } from '../components/ui/Button';

const levels = ['Beginner', 'Intermediate', 'Advanced'];
const bands = [6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];
const durations = [
  { label: '1 Week', value: 1 },
  { label: '2 Weeks', value: 2 },
  { label: '1 Month', value: 4 },
  { label: '2 Months', value: 8 },
  { label: '3 Months', value: 12 },
];
const times = [
  { label: '30 min/day', value: 30 },
  { label: '1 hr/day', value: 60 },
  { label: '2 hr/day', value: 120 },
  { label: '3+ hr/day', value: 180 },
];
const skills = ['Reading', 'Writing', 'Listening', 'Speaking'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { step, setStep, preferences, updatePreferences } = useOnboardingStore();

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 0: return preferences.currentLevel !== '';
      case 1: return preferences.targetBand !== null;
      case 2: return preferences.durationWeeks > 0;
      case 3: return preferences.dailyStudyTime > 0;
      case 4: return preferences.focusSkills.length > 0;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-3xl font-bold mb-8">What exactly is your current English level?</h2>
            <div className="space-y-4">
              {levels.map(level => (
                <button
                  key={level}
                  onClick={() => updatePreferences({ currentLevel: level })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${preferences.currentLevel === level ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-slate-800">{level}</span>
                    {preferences.currentLevel === level && <Check className="text-blue-600" />}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 1:
         return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-3xl font-bold mb-8">What is your target IELTS band?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {bands.map(band => (
                <button
                  key={band}
                  onClick={() => updatePreferences({ targetBand: band })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${preferences.targetBand === band ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                >
                  <span className="text-xl font-bold text-slate-800">{band}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-3xl font-bold mb-8">How long do you have to prepare?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {durations.map(dur => (
                <button
                  key={dur.value}
                  onClick={() => updatePreferences({ durationWeeks: dur.value })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${preferences.durationWeeks === dur.value ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                >
                  <span className="text-lg font-medium text-slate-800">{dur.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-3xl font-bold mb-8">How much time can you study daily?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {times.map(t => (
                <button
                  key={t.value}
                  onClick={() => updatePreferences({ dailyStudyTime: t.value })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${preferences.dailyStudyTime === t.value ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                >
                  <span className="text-lg font-medium text-slate-800">{t.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 4:
         return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="text-3xl font-bold mb-2">Which skills do you want to focus on most?</h2>
            <p className="text-slate-500 mb-8">Select all that apply (weak areas).</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map(skill => {
                const isSelected = preferences.focusSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    onClick={() => {
                      if (isSelected) {
                        updatePreferences({ focusSkills: preferences.focusSkills.filter(s => s !== skill) });
                      } else {
                        updatePreferences({ focusSkills: [...preferences.focusSkills, skill] });
                      }
                    }}
                    className={`p-4 rounded-xl border-2 text-left flex items-center justify-between transition-all ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-blue-300'}`}
                  >
                    <span className="text-lg font-medium text-slate-800">{skill}</span>
                    {isSelected && <Check className="text-blue-600 h-5 w-5" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        );
      case 5:
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Your Roadmap is Ready!</h2>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              We've created a custom {preferences.durationWeeks}-week study plan aiming for Band {preferences.targetBand}, focusing on your weak areas.
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl max-w-sm mx-auto mb-8 border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-4 border-b pb-2">Preview: Day 1</h4>
              <ul className="text-left space-y-3">
                {preferences.focusSkills.length > 0 ? preferences.focusSkills.slice(0, 2).map((skill, i) => (
                  <li key={i} className="flex items-center text-sm text-slate-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {skill} Practice ({Math.round(preferences.dailyStudyTime / 2)} min)
                  </li>
                )) : (
                  <li className="flex items-center text-sm text-slate-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Full mock reading test
                  </li>
                )}
              </ul>
            </div>
            <Button size="lg" className="w-full max-w-sm text-lg h-14" onClick={() => navigate('/login?signup=true')}>
              Save Plan & Sign Up
            </Button>
            <p className="mt-4 text-sm text-slate-500">
              Already have an account? <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">Log in</button>
            </p>
          </motion.div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-20 tooltip"
        title="Close and save progress"
      >
        <X className="h-6 w-6 text-slate-500" />
      </button>
      <div className="w-full bg-slate-100 h-2">
        <div 
          className="bg-blue-600 h-full transition-all duration-500" 
          style={{ width: `${(step / 5) * 100}%` }}
        ></div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {step < 5 && (
            <div className="mt-12 flex items-center justify-between pt-6 border-t border-slate-100">
              <Button variant="ghost" onClick={handleBack} disabled={step === 0} className={step === 0 ? 'invisible' : ''}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleNext} disabled={!isStepValid()}>
                Continue <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
