import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import Display from './components/Display';
import Keypad from './components/Keypad';
import HistoryDrawer from './components/HistoryDrawer';
import GraphCanvas from './components/GraphCanvas';
import ConverterModal from './components/ConverterModal';

import { evaluateExpression } from './utils/mathEngine';
import { sound } from './utils/audio';

export default function App() {
  // Theme & App State with Safe LocalStorage Access
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('qc_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('calc');

  // Math State
  const [expression, setExpression] = useState('');
  const [livePreview, setLivePreview] = useState('');
  const [evalError, setEvalError] = useState(null);
  const [angleMode, setAngleMode] = useState('DEG');
  const [notation, setNotation] = useState('STD');
  const [memoryVal, setMemoryVal] = useState(0);
  const [is2ndActive, setIs2ndActive] = useState(false);

  // History & Drawer with Safe LocalStorage Parsing
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('qc_history')) || [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Canvas Effect Trigger
  const [effectCount, setEffectCount] = useState(0);

  // Theme attribute application
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('qc_theme', theme);
    } catch {}
  }, [theme]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('qc_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  // Real-time Live Expression Evaluation
  useEffect(() => {
    if (!expression || expression.trim() === '') {
      setLivePreview('');
      setEvalError(null);
      return;
    }

    const { result, error } = evaluateExpression(expression, angleMode, notation);
    if (error) {
      setLivePreview('');
      setEvalError(error);
    } else {
      setLivePreview(result);
      setEvalError(null);
    }
  }, [expression, angleMode, notation]);

  // Input Handler
  const handleInput = (val) => {
    setExpression((prev) => prev + val);
  };

  const handleClear = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const handleAllClear = () => {
    setExpression('');
    setLivePreview('');
    setEvalError(null);
  };

  const handleEvaluate = () => {
    if (!expression || evalError || !livePreview) return;

    sound.playClick('equals');

    // Confetti burst for fun calculations
    if (Math.random() < 0.25 || expression.length > 8) {
      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch {}
    }

    const newHistoryItem = {
      id: Date.now(),
      expression,
      result: livePreview,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHistory((prev) => [newHistoryItem, ...prev.slice(0, 49)]);
    setExpression(livePreview);
  };

  const handleMemoryAction = (action) => {
    const { rawResult } = evaluateExpression(expression || livePreview || '0', angleMode, notation);
    const num = typeof rawResult === 'number' && !isNaN(rawResult) ? rawResult : 0;

    if (action === 'MC') setMemoryVal(0);
    else if (action === 'MR') setExpression((prev) => prev + memoryVal.toString());
    else if (action === 'M+') setMemoryVal((m) => m + num);
    else if (action === 'M-') setMemoryVal((m) => m - num);
    else if (action === 'MS') setMemoryVal(num);
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT') return;

      const key = e.key;

      if (key >= '0' && key <= '9') {
        handleInput(key);
      } else if (key === '+' || key === '-' || key === '*' || key === '/' || key === '.' || key === '(' || key === ')') {
        const symbol = key === '*' ? '×' : key === '/' ? '÷' : key;
        handleInput(symbol);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEvaluate();
      } else if (key === 'Backspace') {
        e.preventDefault();
        handleClear();
      } else if (key === 'Escape') {
        e.preventDefault();
        handleAllClear();
      } else if (key === 's') {
        handleInput('sin(');
      } else if (key === 'c') {
        handleInput('cos(');
      } else if (key === 't') {
        handleInput('tan(');
      } else if (key === 'l') {
        handleInput('log(');
      } else if (key === 'n') {
        handleInput('ln(');
      } else if (key === '^') {
        handleInput('^');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expression, livePreview, evalError, angleMode, notation]);

  return (
    <>
      <BackgroundCanvas triggerEffect={effectCount} />

      <div className="app-wrapper">
        <div className="calc-card">
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            theme={theme}
            setTheme={setTheme}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            onOpenHistory={() => setIsHistoryOpen(true)}
            historyCount={history.length}
          />

          {activeTab === 'calc' && (
            <>
              <Display
                expression={expression}
                livePreview={livePreview}
                angleMode={angleMode}
                setAngleMode={setAngleMode}
                notation={notation}
                setNotation={setNotation}
                memoryVal={memoryVal}
                is2ndActive={is2ndActive}
                onBackspace={handleClear}
                evalError={evalError}
              />

              <Keypad
                onInput={handleInput}
                onClear={handleClear}
                onAllClear={handleAllClear}
                onEvaluate={handleEvaluate}
                onMemoryAction={handleMemoryAction}
                is2ndActive={is2ndActive}
                setIs2ndActive={setIs2ndActive}
                onTriggerCanvasEffect={() => setEffectCount((c) => c + 1)}
              />
            </>
          )}

          {activeTab === 'graph' && (
            <GraphCanvas defaultFunction={expression.includes('x') ? expression : 'sin(x)'} />
          )}

          {activeTab === 'converter' && (
            <ConverterModal
              onInsertToCalc={(val) => {
                setExpression((prev) => prev + val);
                setActiveTab('calc');
              }}
            />
          )}
        </div>
      </div>

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
        onRestoreHistory={(expr) => setExpression(expr)}
      />
    </>
  );
}
