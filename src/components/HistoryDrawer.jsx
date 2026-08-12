import React from 'react';
import { X, Trash2, Download, Copy, CornerDownLeft } from 'lucide-react';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onRestoreHistory,
}) {
  if (!isOpen) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Timestamp,Expression,Result\n' +
      history.map((h) => `"${h.timestamp}","${h.expression}","${h.result}"`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quantumcalc_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title">
            <span>Calculation History</span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {history.length > 0 && (
              <>
                <button
                  className="icon-btn"
                  onClick={handleExportCSV}
                  title="Export History to CSV"
                >
                  <Download size={16} />
                </button>
                <button
                  className="icon-btn"
                  onClick={onClearHistory}
                  title="Clear History"
                  style={{ color: '#ef4444' }}
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            <button className="icon-btn" onClick={onClose} title="Close">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', marginTop: '2rem' }}>
              No previous calculations found.
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="history-item">
                <div
                  style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.7rem',
                    color: 'var(--text-dim)',
                  }}
                >
                  <span>{item.timestamp}</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      onClick={() => handleCopy(item.result)}
                      title="Copy result"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      style={{ background: 'none', border: 'none', color: 'var(--preview-color)', cursor: 'pointer' }}
                      onClick={() => {
                        onRestoreHistory(item.expression);
                        onClose();
                      }}
                      title="Restore formula to calculator"
                    >
                      <CornerDownLeft size={13} />
                    </button>
                  </div>
                </div>
                <div className="history-expr">{item.expression} =</div>
                <div className="history-res">{item.result}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
