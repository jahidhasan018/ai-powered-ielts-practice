import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, getAdditionalUserInfo } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useOnboardingStore } from '../store/useOnboardingStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

enum OperationType { CREATE = 'create', WRITE = 'write' }
interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email
    }
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const isSignup = searchParams.get('signup') === 'true';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { preferences } = useOnboardingStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignup) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        
        try {
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            name: name,
            targetBand: preferences.targetBand || 0,
            currentLevel: preferences.currentLevel || '',
            dailyStudyTime: preferences.dailyStudyTime || 0,
            focusSkills: preferences.focusSkills || [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (dbError) {
          handleFirestoreError(dbError, OperationType.CREATE, `users/${user.uid}`);
        }

        const roadmapId = 'current_roadmap';
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + (preferences.durationWeeks || 4) * 7);

        try {
          await setDoc(doc(db, `users/${user.uid}/roadmaps`, roadmapId), {
            durationWeeks: preferences.durationWeeks || 4,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (dbError) {
          handleFirestoreError(dbError, OperationType.CREATE, `users/${user.uid}/roadmaps/${roadmapId}`);
        }

        try {
          await setDoc(doc(db, `users/${user.uid}/progress`, 'stats'), {
            totalTimeMinutes: 0,
            streak: 0,
            completedTasks: 0,
            lastStudyDate: '',
            updatedAt: serverTimestamp(),
          });
        } catch (dbError) {
           handleFirestoreError(dbError, OperationType.CREATE, `users/${user.uid}/progress/stats`);
        }

      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      if (err.message?.includes('operation-not-allowed')) {
          setError('Email/Password login is not enabled. Please use Google Sign-In or enable Email/Password in Firebase Console.');
      } else {
          setError(err.message || 'An error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const additionalInfo = getAdditionalUserInfo(result);
      
      const user = result.user;

      if (additionalInfo?.isNewUser) {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            name: user.displayName || name || '',
            targetBand: preferences.targetBand || 0,
            currentLevel: preferences.currentLevel || '',
            dailyStudyTime: preferences.dailyStudyTime || 0,
            focusSkills: preferences.focusSkills || [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (dbError) {
          handleFirestoreError(dbError, OperationType.CREATE, `users/${user.uid}`);
        }

        const roadmapId = 'current_roadmap';
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + (preferences.durationWeeks || 4) * 7);

        try {
          await setDoc(doc(db, `users/${user.uid}/roadmaps`, roadmapId), {
            durationWeeks: preferences.durationWeeks || 4,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (dbError) {
          handleFirestoreError(dbError, OperationType.CREATE, `users/${user.uid}/roadmaps/${roadmapId}`);
        }

        try {
          await setDoc(doc(db, `users/${user.uid}/progress`, 'stats'), {
            totalTimeMinutes: 0,
            streak: 0,
            completedTasks: 0,
            lastStudyDate: '',
            updatedAt: serverTimestamp(),
          });
        } catch (dbError) {
           handleFirestoreError(dbError, OperationType.CREATE, `users/${user.uid}/progress/stats`);
        }
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google Sign-In');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isSignup ? 'Create your account' : 'Sign in to your account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignup && (
               <div>
                 <label className="block text-sm font-medium text-gray-700">Name</label>
                 <div className="mt-1">
                   <Input value={name} onChange={e => setName(e.target.value)} required />
                 </div>
               </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1">
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processing...' : isSignup ? 'Sign up' : 'Sign in'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 items-center transition-colors"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>

            <div className="mt-6 text-center">
              {isSignup ? (
                <p className="text-sm text-slate-600">Already have an account? <a href="/login" className="text-blue-600 hover:text-blue-500 font-bold tracking-tight">Sign in</a></p>
              ) : (
                <p className="text-sm text-slate-600">Don't have an account? <a href="/login?signup=true" className="text-blue-600 hover:text-blue-500 font-bold tracking-tight">Sign up</a></p>
              )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
