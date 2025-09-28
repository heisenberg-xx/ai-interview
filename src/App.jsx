import React, { useState, useEffect, useRef } from 'react';
import { InterviewerDashboard } from './components/interviewer/InterviewerDashboard';
import { useInterviewStore } from './store/useStore';
import { WelcomeBackModal } from './components/WelcomeBackModal';
import { User, Briefcase } from 'lucide-react';
import { Tabs, Tab } from './components/ui/Tabs';
import CandidateScreen from './components/interviewee/CandidateScreen';

const App = () => {
  const { activeTab, setActiveTab, currentCandidateId, candidates } = useInterviewStore();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const welcomeModalShownRef = useRef(false);

  useEffect(() => {
    if (welcomeModalShownRef.current) return;

    const currentCandidate = candidates.find(c => c.id === currentCandidateId);
    if (currentCandidate && currentCandidate.interview.status === 'IN_PROGRESS') {
      setShowWelcomeModal(true);
      welcomeModalShownRef.current = true;
    }
  }, [candidates, currentCandidateId]);

  const handleResume = () => {
    setActiveTab('interviewee');
    setShowWelcomeModal(false);
  };

  const handleStartNew = () => {
   
    setShowWelcomeModal(false);
  };

  return (
    <div className="min-h-screen bg-black/90 text-gray-900 font-sans">
      <header className="bg-indigo-500 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Interview Assistant</h1>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tab value="interviewee">
              <User className="w-4 h-4 mr-2" />
              Interviewee
            </Tab>
            <Tab value="interviewer">
              <Briefcase className="w-4 h-4 mr-2" />
              Interviewer
            </Tab>
          </Tabs>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {activeTab === 'interviewee' && <CandidateScreen />}
        {activeTab === 'interviewer' && <InterviewerDashboard />}
      </main>

      {showWelcomeModal && (
        <WelcomeBackModal onResume={handleResume} onStartNew={handleStartNew} />
      )}
    </div>
  );
};

export default App;
