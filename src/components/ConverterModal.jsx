import React, { useState } from 'react';
import { Copy, Plus, Sparkles } from 'lucide-react';

export default function ConverterModal({ onInsertToCalc }) {
  const [activeTab, setActiveTab] = useState('units'); // 'units' or 'constants'
  const [category, setCategory] = useState('length');
  const [valFrom, setValFrom] = useState('1');
  const [unitFrom, setUnitFrom] = useState('m');
  const [unitTo, setUnitTo] = useState('ft');

  // Scientific Constants database
  const constantsList = [
    { name: 'Speed of Light (c)', symbol: 'c', val: '299792458', unit: 'm/s' },
    { name: 'Planck Constant (h)', symbol: 'h', val: '6.62607015e-34', unit: 'J·s' },
    { name: 'Gravitational Constant (G)', symbol: 'G', val: '6.67430e-11', unit: 'm³/(kg·s²)' },
    { name: 'Avogadro Number (N₇)', symbol: 'N_A', val: '6.02214076e23', unit: 'mol⁻¹' },
    { name: 'Boltzmann Constant (k_B)', symbol: 'k_B', val: '1.380649e-23', unit: 'J/K' },
    { name: 'Elementary Charge (e)', symbol: 'e', val: '1.602176634e-19', unit: 'C' },
    { name: 'Gas Constant (R)', symbol: 'R', val: '8.314462618', unit: 'J/(mol·K)' },
    { name: 'Golden Ratio (φ)', symbol: 'φ', val: '1.6180339887', unit: '' },
    { name: 'Euler-Mascheroni (γ)', symbol: 'γ', val: '0.5772156649', unit: '' },
  ];

  // Unit conversion factors (base unit relative)
  const unitRatios = {
    length: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      ft: 0.3048,
      in: 0.0254,
      mi: 1609.344,
      yd: 0.9144,
    },
    mass: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.45359237,
      oz: 0.028349523,
      ton: 1000,
    },
    speed: {
      'm/s': 1,
      'km/h': 0.277778,
      mph: 0.44704,
      knot: 0.514444,
    },
    data: {
      B: 1,
      KB: 1024,
      MB: 1048576,
      GB: 1073741824,
      TB: 1099511627776,
    },
  };

  const computeConversion = () => {
    const num = parseFloat(valFrom);
    if (isNaN(num)) return '0';

    if (category === 'temp') {
      if (unitFrom === 'C' && unitTo === 'F') return ((num * 9) / 5 + 32).toFixed(4);
      if (unitFrom === 'F' && unitTo === 'C') return (((num - 32) * 5) / 9).toFixed(4);
      if (unitFrom === 'C' && unitTo === 'K') return (num + 273.15).toFixed(4);
      if (unitFrom === 'K' && unitTo === 'C') return (num - 273.15).toFixed(4);
      if (unitFrom === 'F' && unitTo === 'K') return (((num - 32) * 5) / 9 + 273.15).toFixed(4);
      if (unitFrom === 'K' && unitTo === 'F') return (((num - 273.15) * 9) / 5 + 32).toFixed(4);
      return num.toString();
    }

    const rates = unitRatios[category];
    if (!rates || !rates[unitFrom] || !rates[unitTo]) return '0';

    const baseVal = num * rates[unitFrom];
    const converted = baseVal / rates[unitTo];
    return parseFloat(converted.toFixed(8)).toString();
  };

  const convertedVal = computeConversion();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="converter-tabs">
        <button
          className={`nav-tab-btn ${activeTab === 'units' ? 'active' : ''}`}
          onClick={() => setActiveTab('units')}
        >
          Unit Converter
        </button>
        <button
          className={`nav-tab-btn ${activeTab === 'constants' ? 'active' : ''}`}
          onClick={() => setActiveTab('constants')}
        >
          Scientific Constants
        </button>
      </div>

      {activeTab === 'units' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['length', 'mass', 'temp', 'speed', 'data'].map((cat) => (
              <button
                key={cat}
                className={`badge ${category === cat ? 'active' : ''}`}
                onClick={() => {
                  setCategory(cat);
                  if (cat === 'length') { setUnitFrom('m'); setUnitTo('ft'); }
                  else if (cat === 'mass') { setUnitFrom('kg'); setUnitTo('lb'); }
                  else if (cat === 'temp') { setUnitFrom('C'); setUnitTo('F'); }
                  else if (cat === 'speed') { setUnitFrom('m/s'); setUnitTo('km/h'); }
                  else if (cat === 'data') { setUnitFrom('MB'); setUnitTo('GB'); }
                }}
                style={{ cursor: 'pointer', border: 'none', padding: '0.4rem 0.8rem', textTransform: 'capitalize' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="converter-grid">
            <div className="converter-field">
              <label>From:</label>
              <input
                type="number"
                className="converter-input"
                value={valFrom}
                onChange={(e) => setValFrom(e.target.value)}
              />
              <select
                className="converter-select"
                value={unitFrom}
                onChange={(e) => setUnitFrom(e.target.value)}
              >
                {category === 'temp' ? (
                  <>
                    <option value="C">Celsius (°C)</option>
                    <option value="F">Fahrenheit (°F)</option>
                    <option value="K">Kelvin (K)</option>
                  </>
                ) : (
                  Object.keys(unitRatios[category] || {}).map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))
                )}
              </select>
            </div>

            <div className="converter-field">
              <label>To (Result):</label>
              <input
                type="text"
                className="converter-input"
                value={convertedVal}
                readOnly
                style={{ color: 'var(--preview-color)', fontWeight: 'bold' }}
              />
              <select
                className="converter-select"
                value={unitTo}
                onChange={(e) => setUnitTo(e.target.value)}
              >
                {category === 'temp' ? (
                  <>
                    <option value="C">Celsius (°C)</option>
                    <option value="F">Fahrenheit (°F)</option>
                    <option value="K">Kelvin (K)</option>
                  </>
                ) : (
                  Object.keys(unitRatios[category] || {}).map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          <button
            className="calc-btn btn-equals"
            style={{ width: '100%', marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}
            onClick={() => onInsertToCalc(convertedVal)}
          >
            <Plus size={18} />
            Insert Converted Value into Calculator
          </button>
        </div>
      ) : (
        <div className="constants-grid">
          {constantsList.map((c) => (
            <div
              key={c.symbol}
              className="constant-card"
              onClick={() => onInsertToCalc(c.val)}
              title="Click to insert value into calculator"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="constant-symbol">{c.symbol}</span>
                <Sparkles size={14} color="var(--accent-color)" />
              </div>
              <span className="constant-name">{c.name}</span>
              <span className="constant-val">{c.val} {c.unit}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
