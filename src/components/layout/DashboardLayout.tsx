import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Timer, TrendingUp, Calendar, Settings, LogOut, Menu } from 'lucide-react';
import React, { useState } from 'react';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/useAuthStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Timer', href: '/dashboard/timer', icon: Timer },
  { name: 'Progress', href: '/dashboard/progress', icon: TrendingUp },
  { name: 'Roadmap', href: '/dashboard/roadmap', icon: Calendar },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  const handleSignOut = () => {
    signOut(auth);
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return 'U';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 flex flex-col relative overflow-hidden">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-blue-600">IELTS Roadmap</h1>
          <p className="text-slate-500 text-xs md:text-sm font-medium uppercase tracking-wider">Student Dashboard</p>
        </div>
        
        {/* Mobile menu trigger */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-white rounded-full border border-slate-200 shadow-sm">
            <Menu className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* User Badge (Desktop) */}
        <div className="hidden md:flex items-center gap-4 bg-white p-2 pr-4 rounded-full border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
            {getInitials(user?.displayName, user?.email)}
          </div>
          <div className="text-sm">
            <p className="font-bold leading-none">{user?.displayName || user?.email?.split('@')[0] || 'Student'}</p>
            <button onClick={handleSignOut} className="text-slate-400 text-xs hover:text-slate-600 font-medium">Click to Sign Out</button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full mx-auto pb-24 relative z-0">
        {children}
      </main>

      {/* Bottom Navigation (Floating) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none z-50 flex justify-center">
        <nav className="pointer-events-auto flex items-center gap-1 md:gap-2 bg-white px-3 md:px-6 py-3 rounded-full shadow-2xl border border-slate-200 overflow-x-auto max-w-full">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 md:px-4 py-2 rounded-full text-xs md:text-sm transition-colors whitespace-nowrap flex items-center gap-2",
                  isActive ? "bg-blue-600 text-white font-bold" : "text-slate-500 font-medium hover:bg-slate-50"
                )}
              >
                <item.icon className={cn("h-4 w-4 md:hidden", isActive ? "text-white" : "text-slate-500")} />
                <span className={cn("hidden md:inline", isActive && "inline")}>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

       {/* Mobile Menu Dropdown */}
       {mobileMenuOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-white z-50 flex flex-col p-6">
           <div className="flex justify-between items-center mb-8">
             <div className="font-bold text-xl text-blue-600">IELTS Roadmap</div>
             <button onClick={() => setMobileMenuOpen(false)} className="p-2 border border-slate-200 rounded-full">
               <Menu className="h-5 w-5" />
             </button>
           </div>
           
           <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-8">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xl">
                {getInitials(user?.displayName, user?.email)}
              </div>
              <div>
                <p className="font-bold">{user?.displayName || user?.email?.split('@')[0] || 'Student'}</p>
                <p className="text-slate-500 text-sm">{user?.email}</p>
              </div>
            </div>

           <div className="flex-1 space-y-4">
            {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-4 py-4 text-base font-bold text-slate-700 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <item.icon className="mr-4 h-6 w-6 text-slate-400" />
                  {item.name}
                </Link>
              ))}
           </div>

           <button onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} className="mt-8 flex items-center justify-center w-full px-6 py-4 text-base font-bold text-white bg-slate-900 rounded-2xl">
             <LogOut className="mr-3 h-5 w-5 text-slate-400" />
             Sign Out
           </button>
        </div>
      )}
    </div>
  )
}
