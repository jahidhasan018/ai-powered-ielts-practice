import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export default function Settings() {
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (!auth.currentUser) return;
      const docRef = doc(db, `users`, auth.currentUser.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        setProfile({
          name: auth.currentUser?.displayName || '',
          targetBand: 0,
          dailyStudyTime: 60
        });
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser || !profile) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, `users`, auth.currentUser.uid), {
        name: profile.name,
        targetBand: Number(profile.targetBand),
        dailyStudyTime: Number(profile.dailyStudyTime),
        updatedAt: serverTimestamp()
      });
      alert('Settings saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return <div className="p-8 text-sm font-medium text-slate-500">Loading settings...</div>;

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-8">
        <div>
           <h2 className="text-xl font-bold text-slate-900 tracking-tight">Preferences</h2>
           <p className="text-sm text-slate-500 mt-1">Manage your IELTS profile and study goals.</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Display Name</label>
            <input 
              type="text"
              value={profile.name || ''} 
              onChange={(e) => setProfile({...profile, name: e.target.value})} 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Target Band</label>
              <input 
                type="number" 
                step="0.5" 
                min="0"
                max="9"
                value={profile.targetBand || 0} 
                onChange={(e) => setProfile({...profile, targetBand: e.target.value})} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Daily Goal (mins)</label>
              <input 
                type="number" 
                value={profile.dailyStudyTime || 0} 
                onChange={(e) => setProfile({...profile, dailyStudyTime: e.target.value})} 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow transition-colors"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              onClick={handleSave} 
              disabled={saving} 
              className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
