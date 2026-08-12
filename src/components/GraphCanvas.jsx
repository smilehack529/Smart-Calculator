import React, { useEffect, useRef, useState } from 'react';
import { evaluateExpression } from '../utils/mathEngine';
import { ZoomIn, ZoomOut, RotateCcw, Play } from 'lucide-react';

export default function GraphCanvas({ defaultFunction = 'sin(x)' }) {
  const canvasRef = useRef(null);
  const [expression, setExpression] = useState(defaultFunction);
  const [scale, setScale] = useState(40); // pixels per unit
  const [origin, setOrigin] = useState({ x: 0, y: 0 }); // offset relative to canvas center
  const [mousePos, setMousePos] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = (canvas.width = canvas.parentElement.clientWidth);
    const height = (canvas.height = canvas.parentElement.clientHeight);

    const centerX = width / 2 + origin.x;
    const centerY = height / 2 + origin.y;

    ctx.clearRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;

    const step = scale;

    // Vertical grid lines
    for (let x = centerX % step; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = centerY % step; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Main Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Plot Math Function Curve
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let isDrawing = false;

    for (let px = 0; px < width; px += 2) {
      const xVal = (px - centerX) / scale;
      const exprWithX = expression.replace(/\bx\b/g, `(${xVal})`);

      const { rawResult, error } = evaluateExpression(exprWithX, 'RAD');

      if (!error && typeof rawResult === 'number' && !isNaN(rawResult) && isFinite(rawResult)) {
        const py = centerY - rawResult * scale;

        if (py >= -500 && py <= height + 500) {
          if (!isDrawing) {
            ctx.moveTo(px, py);
            isDrawing = true;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          isDrawing = false;
        }
      } else {
        isDrawing = false;
      }
    }
    ctx.stroke();

    // Draw Mouse Cursor Crosshair & Coordinate Tooltip
    if (mousePos) {
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.6)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(mousePos.x, 0);
      ctx.lineTo(mousePos.x, height);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, mousePos.y);
      ctx.lineTo(width, mousePos.y);
      ctx.stroke();

      ctx.setLineDash([]);
    }
  }, [expression, scale, origin, mousePos]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2 + origin.x;
    const centerY = height / 2 + origin.y;

    const mathX = parseFloat(((x - centerX) / scale).toFixed(2));
    const mathY = parseFloat(((centerY - y) / scale).toFixed(2));

    setMousePos({ x, y, mathX, mathY });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <div className="graph-container">
      <div className="graph-controls">
        <div className="graph-input-group">
          <span className="graph-prefix">f(x) =</span>
          <input
            type="text"
            className="graph-input"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="e.g. sin(x) * x or x^2 - 4"
          />
        </div>

        <button className="icon-btn" onClick={() => setScale((s) => Math.min(s * 1.25, 200))} title="Zoom In">
          <ZoomIn size={18} />
        </button>
        <button className="icon-btn" onClick={() => setScale((s) => Math.max(s / 1.25, 10))} title="Zoom Out">
          <ZoomOut size={18} />
        </button>
        <button
          className="icon-btn"
          onClick={() => {
            setScale(40);
            setOrigin({ x: 0, y: 0 });
          }}
          title="Reset View"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div className="canvas-frame">
        <canvas
          ref={canvasRef}
          className="graph-canvas"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {mousePos && (
          <div className="graph-info-overlay">
            x: {mousePos.mathX}, y: {mousePos.mathY}
          </div>
        )}
      </div>
    </div>
  );
}
