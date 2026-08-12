import React, { useState } from 'react';
import { sound } from '../utils/audio';

export default function Keypad({
  onInput,
  onClear,
  onAllClear,
  onEvaluate,
  onMemoryAction,
  is2ndActive,
  setIs2ndActive,
  onTriggerCanvasEffect
}) {
  const [ripples, setRipples] = useState([]);

  const createRipple = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = { id: Date.now(), size, x, y };
    setRipples((prev) => [...prev.slice(-10), newRipple]);
    if (onTriggerCanvasEffect) onTriggerCanvasEffect();
  };

  const handleBtnClick = (e, actionType, val, soundType = 'num') => {
    createRipple(e);
    sound.playClick(soundType);

    if (actionType === 'input') {
      onInput(val);
    } else if (actionType === 'clear') {
      onClear();
    } else if (actionType === 'ac') {
      onAllClear();
    } else if (actionType === 'eval') {
      onEvaluate();
    } else if (actionType === 'memory') {
      onMemoryAction(val);
    } else if (actionType === 'toggle2nd') {
      setIs2ndActive(!is2ndActive);
    }
  };

  return (
    <div className="keypad-grid">
      {/* LEFT SCIENTIFIC SECTION */}
      <div className="keypad-section-sci">
        {/* Row 1: Memory functions */}
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'memory', 'MC', 'op')}>MC</button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'memory', 'MR', 'op')}>MR</button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'memory', 'M+', 'op')}>M+</button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'memory', 'M-', 'op')}>M-</button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'memory', 'MS', 'op')}>MS</button>

        {/* Row 2: 2nd shift, Rad/Deg, Factorial, Permutations, Combinations */}
        <button
          className={`calc-btn btn-fn ${is2ndActive ? 'btn-shift-active' : ''}`}
          onClick={(e) => handleBtnClick(e, 'toggle2nd', null, 'op')}
        >
          2<sup>nd</sup>
        </button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', '!', 'op')}>n!</button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', is2ndActive ? ' nPr ' : ' nCr ', 'op')}>
          {is2ndActive ? 'nPr' : 'nCr'}
        </button>

        {/* Trigonometric functions */}
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', is2ndActive ? 'asin(' : 'sin(', 'op')}>
          {is2ndActive ? 'sin⁻¹' : 'sin'}
        </button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', is2ndActive ? 'acos(' : 'cos(', 'op')}>
          {is2ndActive ? 'cos⁻¹' : 'cos'}
        </button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', is2ndActive ? 'atan(' : 'tan(', 'op')}>
          {is2ndActive ? 'tan⁻¹' : 'tan'}
        </button>

        {/* Hyperbolic functions */}
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', is2ndActive ? 'asinh(' : 'sinh(', 'op')}>
          {is2ndActive ? 'asinh' : 'sinh'}
        </button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', is2ndActive ? 'acosh(' : 'cosh(', 'op')}>
          {is2ndActive ? 'acosh' : 'cosh'}
        </button>

        {/* Logarithms & Exponents */}
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', is2ndActive ? '10^(' : 'log(', 'op')}>
          {is2ndActive ? '10ˣ' : 'log'}
        </button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', is2ndActive ? 'e^(' : 'ln(', 'op')}>
          {is2ndActive ? 'eˣ' : 'ln'}
        </button>

        {/* Powers & Roots */}
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', is2ndActive ? '^3' : '^2', 'op')}>
          {is2ndActive ? 'x³' : 'x²'}
        </button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', '^', 'op')}>x<sup>y</sup></button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', is2ndActive ? '∛(' : '√(', 'op')}>
          {is2ndActive ? '∛x' : '√x'}
        </button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', '^(-1)', 'op')}>x⁻¹</button>

        {/* Constants & Misc */}
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', 'π', 'op')}>π</button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', 'e', 'op')}>e</button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', 'abs(', 'op')}>|x|</button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', ' mod ', 'op')}>mod</button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', 'random()', 'op')}>rnd</button>
      </div>

      {/* RIGHT BASIC NUMERIC & OPERATORS SECTION */}
      <div className="keypad-section-num">
        {/* Row 1 */}
        <button className="calc-btn btn-clear" onClick={(e) => handleBtnClick(e, 'ac', null, 'clear')}>AC</button>
        <button className="calc-btn btn-clear" onClick={(e) => handleBtnClick(e, 'clear', null, 'clear')}>C</button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', '(', 'op')}>(</button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', ')', 'op')}>)</button>
        <button className="calc-btn btn-op" onClick={(e) => handleBtnClick(e, 'input', '%', 'op')}>%</button>

        {/* Row 2 */}
        <button className="calc-btn btn-num" onClick={(e) => handleBtnClick(e, 'input', '7', 'num')}>7</button>
        <button className="calc-btn btn-num" onClick={(e) => handleBtnClick(e, 'input', '8', 'num')}>8</button>
        <button className="calc-btn btn-num" onClick={(e) => handleBtnClick(e, 'input', '9', 'num')}>9</button>
        <button className="calc-btn btn-op" onClick={(e) => handleBtnClick(e, 'input', '÷', 'op')}>÷</button>
        <button className="calc-btn btn-op" onClick={(e) => handleBtnClick(e, 'input', '×', 'op')}>×</button>

        {/* Row 3 */}
        <button className="calc-btn btn-num" onClick={(e) => handleBtnClick(e, 'input', '4', 'num')}>4</button>
        <button className="calc-btn btn-num" onClick={(e) => handleBtnClick(e, 'input', '5', 'num')}>5</button>
        <button className="calc-btn btn-num" onClick={(e) => handleBtnClick(e, 'input', '6', 'num')}>6</button>
        <button className="calc-btn btn-op" onClick={(e) => handleBtnClick(e, 'input', '-', 'op')}>-</button>
        <button className="calc-btn btn-op" onClick={(e) => handleBtnClick(e, 'input', '+', 'op')}>+</button>

        {/* Row 4 */}
        <button className="calc-btn btn-num" onClick={(e) => handleBtnClick(e, 'input', '1', 'num')}>1</button>
        <button className="calc-btn btn-num" onClick={(e) => handleBtnClick(e, 'input', '2', 'num')}>2</button>
        <button className="calc-btn btn-num" onClick={(e) => handleBtnClick(e, 'input', '3', 'num')}>3</button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', '(-)', 'op')}>+/-</button>
        <button
          className="calc-btn btn-equals"
          style={{ gridRow: 'span 2' }}
          onClick={(e) => handleBtnClick(e, 'eval', null, 'equals')}
        >
          =
        </button>

        {/* Row 5 */}
        <button className="calc-btn btn-num" style={{ gridColumn: 'span 2' }} onClick={(e) => handleBtnClick(e, 'input', '0', 'num')}>0</button>
        <button className="calc-btn btn-num" onClick={(e) => handleBtnClick(e, 'input', '.', 'num')}>.</button>
        <button className="calc-btn btn-fn" onClick={(e) => handleBtnClick(e, 'input', 'E', 'op')}>EXP</button>
      </div>
    </div>
  );
}
