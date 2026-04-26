import { MapIcon, BookOpen, Clock, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-blue-600">
          <MapIcon className="h-6 w-6" />
          <span className="text-xl font-bold">IELTS Roadmap</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            Log in
          </Link>
          <Link to="/onboarding">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Your Personalized Path <br /> to IELTS Success
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Generate a custom daily study plan tailored to your target band, current level, and available time. Stop guessing, start preparing.
        </p>
        <Link to="/onboarding">
          <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl transition-all">
            Get Your Personalized Roadmap
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Targeted Practice</h3>
              <p className="text-slate-600">Identify your weak areas and get a plan that focuses precisely on what you need to improve.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Time Management</h3>
              <p className="text-slate-600">Built-in Pomodoro timers to keep you focused and track every minute of your study sessions.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-2xl">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Daily Tasks</h3>
              <p className="text-slate-600">Wake up to a clearly defined list of reading, writing, listening, and speaking exercises.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
