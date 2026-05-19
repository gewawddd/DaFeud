import React, { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { LandingScreen } from './pages/LandingScreen';
import { SetupScreen } from './pages/SetupScreen';
import { GameBoard } from './pages/GameBoard';
import { Survey, loadSurvey, clearGame } from './lib/storage';
type Screen = 'landing' | 'setup' | 'game';
export function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const s = loadSurvey();
    if (s) setSurvey(s);
    setHydrated(true);
  }, []);
  function handleStart(s: Survey) {
    setSurvey(s);
    clearGame();
    setScreen('game');
  }
  function handleBackToSetup() {
    setScreen('setup');
  }
  if (!hydrated) {
    return <div className="min-h-screen w-full bg-blue-950" />;
  }
  return (
    <div className="relative min-h-screen w-full text-white font-body">
      <div className="rotate-overlay" role="alert" aria-live="assertive">
        <div className="rotate-card">
          <div className="rotate-phone" aria-hidden="true" />
          <div className="rotate-title">Rotate device</div>
          <div className="rotate-subtitle">This game runs in landscape.</div>
        </div>
      </div>

      <div className="landscape-shell">
        <div className="landscape-frame">
          <div className="relative h-full w-full bg-stage text-white font-body">
            {/* Stage backdrop layers */}
            <div className="pointer-events-none absolute inset-0 stage-spotlights" />
            <div className="pointer-events-none absolute inset-0 stage-vignette" />

            <div className="relative z-10 landscape-scroll">
              {screen === 'landing' ?
              <LandingScreen onEnter={() => setScreen('setup')} /> :
              screen === 'setup' ?
              <SetupScreen initialSurvey={survey} onStart={handleStart} /> :
              survey ?
              <GameBoard
                survey={survey}
                onBackToSetup={handleBackToSetup} /> :


              <SetupScreen initialSurvey={null} onStart={handleStart} />
              }
            </div>
          </div>
        </div>
      </div>

      <Toaster
        position="top-center"
        theme="dark"
        toastOptions={{
          style: {
            background: 'rgba(10, 20, 60, 0.9)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            color: '#fff',
            backdropFilter: 'blur(12px)'
          }
        }} />
    </div>);

}