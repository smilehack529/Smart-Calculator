import { create, all } from 'mathjs';

const math = create(all);

/**
 * Normalizes user-friendly calculator tokens into valid mathjs expressions.
 */
export function preprocessExpression(expr, angleMode = 'DEG') {
  if (!expr || typeof expr !== 'string') return '';

  let sanitized = expr;

  // Replace visual multiplication & division symbols
  sanitized = sanitized.replace(/×/g, '*').replace(/÷/g, '/');

  // Replace constants
  sanitized = sanitized.replace(/π/g, 'pi');

  // Handle Percentage: e.g. 50% => 0.5 or (number)% => (number/100)
  sanitized = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1 / 100)');

  // Handle Square Root & Cube Root
  sanitized = sanitized.replace(/√\(([^)]+)\)/g, 'sqrt($1)');
  sanitized = sanitized.replace(/√(\d+(\.\d+)?)/g, 'sqrt($1)');
  sanitized = sanitized.replace(/∛\(([^)]+)\)/g, 'cbrt($1)');
  sanitized = sanitized.replace(/∛(\d+(\.\d+)?)/g, 'cbrt($1)');

  // Handle Trigonometric angle conversion if in DEG or GRAD mode
  if (angleMode === 'DEG') {
    // Wrap trig arguments in deg2rad and inverse output in rad2deg
    sanitized = sanitized.replace(/\bsin\(([^)]+)\)/g, 'sin(($1) * pi / 180)');
    sanitized = sanitized.replace(/\bcos\(([^)]+)\)/g, 'cos(($1) * pi / 180)');
    sanitized = sanitized.replace(/\btan\(([^)]+)\)/g, 'tan(($1) * pi / 180)');
    sanitized = sanitized.replace(/\basin\(([^)]+)\)/g, '(asin($1) * 180 / pi)');
    sanitized = sanitized.replace(/\bacos\(([^)]+)\)/g, '(acos($1) * 180 / pi)');
    sanitized = sanitized.replace(/\batan\(([^)]+)\)/g, '(atan($1) * 180 / pi)');
  } else if (angleMode === 'GRAD') {
    sanitized = sanitized.replace(/\bsin\(([^)]+)\)/g, 'sin(($1) * pi / 200)');
    sanitized = sanitized.replace(/\bcos\(([^)]+)\)/g, 'cos(($1) * pi / 200)');
    sanitized = sanitized.replace(/\btan\(([^)]+)\)/g, 'tan(($1) * pi / 200)');
    sanitized = sanitized.replace(/\basin\(([^)]+)\)/g, '(asin($1) * 200 / pi)');
    sanitized = sanitized.replace(/\bacos\(([^)]+)\)/g, '(acos($1) * 200 / pi)');
    sanitized = sanitized.replace(/\batan\(([^)]+)\)/g, '(atan($1) * 200 / pi)');
  }

  // Handle nCr and nPr functions: e.g. 5 nCr 2 => combinations(5, 2)
  sanitized = sanitized.replace(/(\d+)\s*nCr\s*(\d+)/gi, 'combinations($1, $2)');
  sanitized = sanitized.replace(/(\d+)\s*nPr\s*(\d+)/gi, 'permutations($1, $2)');

  return sanitized;
}

/**
 * Safely evaluates a math expression and formats the numeric result.
 */
export function evaluateExpression(rawExpr, angleMode = 'DEG', notation = 'STD') {
  if (!rawExpr || rawExpr.trim() === '') return { result: '', rawResult: null, error: null };

  try {
    const parsedExpr = preprocessExpression(rawExpr, angleMode);
    const evalResult = math.evaluate(parsedExpr);

    if (evalResult === undefined || evalResult === null) {
      return { result: '', rawResult: null, error: null };
    }

    let numericVal = evalResult;
    if (typeof evalResult === 'object' && evalResult.isBigNumber) {
      numericVal = evalResult.toNumber();
    } else if (typeof evalResult === 'object' && evalResult.type === 'ResultSet') {
      numericVal = evalResult.entries[evalResult.entries.length - 1];
    }

    if (typeof numericVal !== 'number' && typeof numericVal !== 'boolean') {
      return { result: String(evalResult), rawResult: evalResult, error: null };
    }

    if (Number.isNaN(numericVal)) {
      return { result: 'Error: NaN', rawResult: NaN, error: 'NaN' };
    }
    if (!Number.isFinite(numericVal)) {
      return { result: 'Error: Infinity', rawResult: Infinity, error: 'Infinity' };
    }

    // Format output
    let formattedResult = '';
    if (notation === 'SCI') {
      formattedResult = numericVal.toExponential(6);
    } else if (notation === 'ENG') {
      const exp = Math.floor(Math.log10(Math.abs(numericVal)) / 3) * 3;
      const mantissa = numericVal / Math.pow(10, exp);
      formattedResult = `${mantissa.toFixed(4)}e${exp >= 0 ? '+' : ''}${exp}`;
    } else {
      // Standard output formatting
      if (Number.isInteger(numericVal)) {
        formattedResult = numericVal.toString();
      } else {
        // Limit maximum precision to 10 decimals without trailing zeros
        formattedResult = parseFloat(numericVal.toFixed(10)).toString();
      }
    }

    return { result: formattedResult, rawResult: numericVal, error: null };
  } catch (err) {
    return { result: '', rawResult: null, error: err.message || 'Syntax Error' };
  }
}
