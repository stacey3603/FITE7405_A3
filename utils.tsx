const mathjs = require("mathjs");

import { OptionType } from "./components/optionTypeSelector";

function cdfNormal(x: number) {
  return (1 - mathjs.erf((0 - x) / (Math.sqrt(2) * 1))) / 2;
}
export function bsModel(
  S: number,
  sigma: number,
  r: number,
  q: number,
  T: number,
  K: number,
  optionType: OptionType
): number {
  const d1 =
    (Math.log(S / K) + (r - q) * T) / (sigma * Math.sqrt(T)) +
    (sigma / 2) * Math.sqrt(T);
  const d2 = d1 - sigma * Math.sqrt(T);
  const callPrice =
    S * Math.exp(-q * T) * cdfNormal(d1) - K * Math.exp(-r * T) * cdfNormal(d2);
  const putPrice =
    K * Math.exp(-r * T) * cdfNormal(-d2) -
    S * Math.exp(-q * T) * cdfNormal(-d1);
  return optionType === OptionType.CALL ? callPrice : putPrice;
}

export function printBsModel(
  S: number,
  sigma: number,
  r: number,
  q: number,
  T: number,
  K: number,
  optionType: OptionType
) {
  const price = bsModel(S, sigma, r, q, T, K, optionType);
  return `European ${optionType} Option [S(0)=${S}, σ=${sigma}, r=${r}, q=${q}, T=${T}, K=${K}] Price is:${price}`;
}

export function impliedVolatility(
  S: number,
  r: number,
  q: number,
  T: number,
  K: number,
  premium: number,
  optionType: OptionType
): string {
  const optionTrue = premium;
  let sigma = Math.sqrt(2 * Math.abs((Math.log(S / K) + r * T) / T));
  let sigmaDiff = 1;
  const nMax = 100;
  const tol = 1 / 100000000;
  console.log(tol, "tol");
  for (let n = 1; n < nMax; n++) {
    if (sigmaDiff < tol) break;
    const optionPrice = bsModel(S, sigma, r, q, T, K, optionType);
    const optionVega = mathjs.derivative(optionPrice, sigma);
    const increment = (optionPrice - optionTrue) / optionVega;
    sigma = sigma - increment;
    sigmaDiff = Math.abs(increment);
  }

  return `${optionType} Option [S(0)=${S}, σ=${sigma}, r=${r}, q=${q}, T=${T}, K=${K}] Implied Volatility:${sigma}`;
}

export function btAmerican(
  S: number,
  sigma: number,
  r: number,
  T: number,
  K: number,
  steps: number,
  optionType: OptionType
): string {
  const deltaT = T / steps;
  const u = Math.exp(sigma * Math.sqrt(deltaT));
  const d = 1 / u;
  const p = (Math.exp(r * deltaT) - d) / (u - d);
  const discountFactor = Math.exp(-r * deltaT);
  let valueOnFinalStep: number[] = [];
  let lastStepsValue: number[] = [];

  for (let i = 0; i <= steps; i++) {
    const stockPrice = (S * d) ^ ((steps - i) * u) ^ i;
    const value =
      optionType === OptionType.CALL
        ? Math.max(0, stockPrice - K)
        : Math.max(0, K - stockPrice);
    valueOnFinalStep.push(value);
  }
  lastStepsValue = valueOnFinalStep;
  for (let i = 1; i <= steps; i++) {
    let stepsValue: number[] = [];
    for (let i = 0; i < lastStepsValue.length; i++) {
      const stockPrice =
        discountFactor *
        (lastStepsValue[i] * p + lastStepsValue[i + 1] * (1 - p));
      const value =
        optionType === OptionType.CALL
          ? Math.max(0, stockPrice - K)
          : Math.max(0, K - stockPrice);
      stepsValue.push(value);
    }
    console.log(lastStepsValue);
    lastStepsValue = stepsValue;
  }

  return `American ${optionType} option price calculated by Binomial Tree model [S(0)=${S}, σ=${sigma}, r=${r}, T=${T}, K=${K}], steps=${steps}. Price is:${lastStepsValue[0]} `;
}
export function bsModel(S: number, sigma: number, r: number, q: number, T: number, K: number, optionType: OptionType): string {
    const d1 = (Math.log(S / K) + (r - q) * (T)) / (sigma * Math.sqrt(T)) + (sigma / 2) * Math.sqrt(T)
    const d2 = d1 - sigma * Math.sqrt(T)
    const callPrice = S * Math.exp(-q * T) * cdfNormal(d1) - K * Math.exp(-r * (T)) * cdfNormal(d2)
    const putPrice = K * Math.exp(-r * (T)) * cdfNormal(-d2) - S * Math.exp(-q * T) * cdfNormal(-d1)
    return `${optionType} Option [S(0)=${S}, σ=${sigma}, r=${r}, q=${q}, T=${T}, K=${K}] Price:${optionType === OptionType.CALL ? callPrice : putPrice}`
}


