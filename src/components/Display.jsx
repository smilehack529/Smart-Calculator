import React from 'react';
import { Delete } from 'lucide-react';

export default function Display({
  expression,
  livePreview,
  angleMode,
  setAngleMode,
  notation,
  setNotation,
  memoryVal,
  is2ndActive,
  onBackspace,
  evalError,
}) {
  const toggleAngleMode = () => {
    if (angleMode === 'DEG') setAngleMode('RAD');
    else if (angleMode === 'RAD') setAngleMode('GRAD');
    else setAngleMode('DEG');
  };

  const toggleNotation = () => {
    if (notation === 'STD') setNotation('SCI');
    else if (notation === 'SCI') setNotation('ENG');
    else setNotation('STD');
  };

  return (
    <div className="display-container">
      <div className="display-badges">
        <div className="badge-group">
          <button
            className="badge active"
            onClick={toggleAngleMode}
            title="Click to toggle angle mode (DEG / RAD / GRAD)"
            style={{ cursor: 'pointer', border: 'none' }}
          >
            {angleMode}
          </button>
          <button
            className="badge"
            onClick={toggleNotation}
            title="Click to toggle notation mode (STD / SCI / ENG)"
            style={{ cursor: 'pointer', border: 'none' }}
          >
            {notation}
          </button>
          {is2ndActive && <span className="badge active" style={{ background: '#ec4899' }}>2ND</span>}
          {memoryVal !== 0 && <span className="badge active" style={{ background: '#10b981' }}>M</span>}
        </div>
        <button
          onClick={onBackspace}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.8rem'
          }}
          title="Backspace (Delete last token)"
        >
          <Delete size={16} />
        </button>
      </div>

      <div className="display-expression-wrapper">
        <span className="display-expression">
          {expression || '0'}
        </span>
      </div>

      <div className="display-preview-wrapper">
        <span className="eval-status">
          {expression ? 'Live Eval:' : 'Ready'}
        </span>
        <span className={`display-preview ${evalError ? 'error' : ''}`}>
          {evalError ? 'Invalid Format' : (livePreview || '')}
        </span>
      </div>
    </div>
  );
}
