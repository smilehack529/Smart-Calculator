import React from 'react';
import { Calculator, Activity, ArrowRightLeft, Volume2, VolumeX, History, Sun, Moon, Zap, Eye } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Navbar({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  isMuted,
  setIsMuted,
  onOpenHistory,
  historyCount,
}) {
  const handleMuteToggle = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const themes = [
    { id: 'dark', label: 'Dark Glass', icon: Moon },
    { id: 'light', label: 'Light Clean', icon: Sun },
    { id: 'cyberpunk', label: 'Cyberpunk', icon: Zap },
    { id: 'oled', label: 'OLED Black', icon: Eye },
  ];

  return (
    <nav className="navbar">
      <div className="brand">
        <Calculator className="brand-icon" size={24} />
        <span>QuantumCalc</span>
      </div>

      <div className="nav-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'calc' ? 'active' : ''}`}
          onClick={() => setActiveTab('calc')}
          id="tab-calc"
        >
          <Calculator size={15} />
          <span>Calculator</span>
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'graph' ? 'active' : ''}`}
          onClick={() => setActiveTab('graph')}
          id="tab-graph"
        >
          <Activity size={15} />
          <span>Grapher</span>
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'converter' ? 'active' : ''}`}
          onClick={() => setActiveTab('converter')}
          id="tab-converter"
        >
          <ArrowRightLeft size={15} />
          <span>Units & Constants</span>
        </button>
      </div>

      <div className="nav-actions">
        <div className="theme-select-group" style={{ display: 'flex', gap: '4px' }}>
          {themes.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                className={`icon-btn ${theme === t.id ? 'active' : ''}`}
                title={`Theme: ${t.label}`}
                onClick={() => setTheme(t.id)}
                style={{
                  borderColor: theme === t.id ? 'var(--accent-color)' : undefined,
                  background: theme === t.id ? 'var(--accent-glow)' : undefined,
                }}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>

        <button
          className="icon-btn"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          onClick={handleMuteToggle}
          id="btn-sound-toggle"
        >
          {isMuted ? <VolumeX size={18} color="#ef4444" /> : <Volume2 size={18} color="#38bdf8" />}
        </button>

        <button
          className="icon-btn"
          title="History"
          onClick={onOpenHistory}
          style={{ position: 'relative' }}
          id="btn-history-toggle"
        >
          <History size={18} />
          {historyCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--accent-color)',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 'bold',
                borderRadius: '10px',
                padding: '1px 5px',
              }}
            >
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
