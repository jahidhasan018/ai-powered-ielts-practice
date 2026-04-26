import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import DailyPlan from './dashboard/DailyPlan';
import Timer from './dashboard/Timer';
import Progress from './dashboard/Progress';
import Roadmap from './dashboard/Roadmap';
import Settings from './dashboard/Settings';
import LearningModule from './dashboard/LearningModule';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DailyPlan />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/module/:taskId" element={<LearningModule />} />
      </Routes>
    </DashboardLayout>
  );
}

