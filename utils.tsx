const mathjs = require("mathjs");
const lobos = require("lobos");
const gaussian = require("gaussian");

import { OptionType } from "./components/optionTypeSelector";

function cdfNormal(x: number) {
  return (1 - mathjs.erf((0 - x) / (Math.sqrt(2) * 1))) / 2;
}

function standardRandom(mean = 0, stdev = 1) {
  let u = 1 - Math.random(); // Converting [0,1) to (0,1]
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

function mean(array: number[]) {
  return array.reduce((a, b) => a + b, 0) / array.length;
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

export function geometricAsian(
  S: number,
  sigma: number,
  r: number,
  T: number,
  K: number,
  n: number,
  optionType: OptionType
): number {
  const sigmaHat = sigma * Math.sqrt(((n + 1) * (2 * n + 1)) / ((6 * n) ^ 2));
  const uHat =
    (((r - (1 / 2) * sigma) ^ 2) * ((n + 1) / (2 * n)) + (1 / 2) * sigmaHat) ^
    2;
  const d1Hat =
    (Math.log(S / K) + ((uHat + (1 / 2) * sigmaHat) ^ 2) * T) /
    (sigmaHat * Math.sqrt(T));
  const d2Hat = d1Hat - sigmaHat * Math.sqrt(T);
  const callPrice =
    Math.exp(-r * T) *
    (S * Math.exp(uHat * T) * cdfNormal(d1Hat) - K * cdfNormal(d2Hat));
  const putPrice =
    Math.exp(-r * T) *
    (K * cdfNormal(-d2Hat) - S * Math.exp(uHat * T) * cdfNormal(-d1Hat));

  return optionType === OptionType.CALL ? callPrice : putPrice;
}

export function geometricBasket(
  S1: number,
  S2: number,
  sigma1: number,
  sigma2: number,
  correlation: number,
  r: number,
  T: number,
  K: number,
  optionType: OptionType
): number {
  const sigmaHat = Math.sqrt(sigma1 * sigma2 * correlation);
  const uHat =
    ((r - ((1 / 2) * (sigma1 ^ (2 + sigma2) ^ 2)) / 2) * (1 / 2) * sigmaHat) ^
    2;
  const bag0 = Math.sqrt(S1 * S2);
  const d1Hat =
    (Math.log(bag0 / K) + ((uHat + (1 / 2) * sigmaHat) ^ 2) * T) /
    (sigmaHat * Math.sqrt(T));
  const d2Hat = d1Hat - sigmaHat * Math.sqrt(T);
  const callPrice =
    Math.exp(-r * T) *
    (bag0 * Math.exp(uHat * T) * cdfNormal(d1Hat) - K * cdfNormal(d2Hat));
  const putPrice =
    Math.exp(-r * T) *
    (K * cdfNormal(-d2Hat) - bag0 * Math.exp(uHat * T) * cdfNormal(-d1Hat));

  return optionType === OptionType.CALL ? callPrice : putPrice;
}

export function printGeometricAsian(
  S: number,
  sigma: number,
  r: number,
  T: number,
  K: number,
  n: number,
  optionType: OptionType
) {
  const price = geometricAsian(S, sigma, r, T, K, n, optionType);
  return `Geometric Asian ${optionType} option [S(0)=${S}, σ=${sigma}, r=${r}, T=${T}, K=${K}], observations=${n}. Price is: ${price} `;
}

export function printGeometricBasket(
  S1: number,
  S2: number,
  sigma1: number,
  sigma2: number,
  correlation: number,
  r: number,
  T: number,
  K: number,
  optionType: OptionType
) {
  const price = geometricBasket(
    S1,
    S2,
    sigma1,
    sigma2,
    correlation,
    r,
    T,
    K,
    optionType
  );
  return `Geometric Basket ${optionType} option [S1(0)=${S1}, S2(0)=${S2}, σ1=${sigma1}, σ2=${sigma2}, correlation=${correlation}, r=${r}, T=${T}, K=${K}]. Price is: ${price} `;
}

export function monteCarloAsian(
  S: number,
  sigma: number,
  r: number,
  T: number,
  K: number,
  n: number,
  optionType: OptionType,
  paths: number,
  control: boolean
) {
  const Dt = T / n;
  const drift = Math.exp(((r - 0.5 * sigma) ^ 2) * Dt);
  let arithPathPayoffArray = [];
  let geoPathPayoffArray: number[] = [];

  for (let i = 1; i <= paths; i++) {
    let interalPayoffs: number[] = [];
    let geoMean: number = 1;
    const growFactor =
      drift * Math.exp(sigma * Math.sqrt(Dt) * standardRandom());
    const s1 = S * growFactor;
    interalPayoffs.push(s1);
    geoMean = s1;
    for (let i = 2; i <= n; i++) {
      const growFactor =
        drift * Math.exp(sigma * Math.sqrt(Dt) * standardRandom());
      const Sn = interalPayoffs[i - 2] * growFactor;
      interalPayoffs.push(Sn);
      geoMean = geoMean * Sn;
    }
    const arithMean = mean(interalPayoffs);
    geoMean = geoMean ^ (1 / n);
    const arithSpathiPayoff =
      Math.exp(-r * T) *
      (optionType === OptionType.CALL
        ? Math.max(arithMean - K, 0)
        : Math.max(K - arithMean, 0));
    const geoSpathiPayoff =
      Math.exp(-r * T) *
      (optionType === OptionType.CALL
        ? Math.max(geoMean - K, 0)
        : Math.max(K - geoMean, 0));

    arithPathPayoffArray.push(arithSpathiPayoff);
    geoPathPayoffArray.push(geoSpathiPayoff);
  }

  const arithPayoff = mean(arithPathPayoffArray);
  const geoPayoff = mean(geoPathPayoffArray);

  if (!control)
    return `[${
      arithPayoff - (1.96 * mathjs.std(arithPathPayoffArray)) / Math.sqrt(paths)
    },${
      arithPayoff + (1.96 * mathjs.std(arithPathPayoffArray)) / Math.sqrt(paths)
    }]`;

  const geo = geometricAsian(S, sigma, r, T, K, n, optionType);

  const cov =
    mean(arithPathPayoffArray.map((v, i) => v * geoPathPayoffArray[i])) / 2 -
    arithPayoff * geoPayoff;
  const theta = cov / mathjs.variance(geoPathPayoffArray);
  const z = arithPathPayoffArray.map(
    (v, i) => v + theta * (geo - geoPathPayoffArray[i])
  );
  const zMean = mean(z);
  const zStd = mathjs.std(z);
  return `[${zMean - (1.96 * zStd) / Math.sqrt(paths)},${
    zMean + (1.96 * zStd) / Math.sqrt(paths)
  }]`;
}

export function monteCarloBasket(
  S1: number,
  S2: number,
  sigma1: number,
  sigma2: number,
  correlation: number,
  r: number,
  T: number,
  K: number,
  optionType: OptionType,
  paths: number,
  control: boolean
) {
  let arithPathPayoffArray = [];
  let geoPathPayoffArray: number[] = [];

  for (let i = 1; i <= paths; i++) {
    let interalPayoffs: number[] = [];
    let geoMean: number = 1;
    const s1 =
      S1 *
      Math.exp(
        ((r - (1 / 2) * sigma1) ^ 2) * T + sigma1 * T * standardRandom()
      );
    interalPayoffs.push(s1);
    const s2 =
      S2 *
      Math.exp(
        ((r - (1 / 2) * sigma2) ^ 2) * T + sigma2 * T * standardRandom()
      );
    interalPayoffs.push(s2);
    geoMean = s1 * s2;
    const arithMean = mean(interalPayoffs);
    geoMean = geoMean ^ (1 / 2);
    const arithSpathiPayoff =
      Math.exp(-r * T) *
      (optionType === OptionType.CALL
        ? Math.max(arithMean - K, 0)
        : Math.max(K - arithMean, 0));
    const geoSpathiPayoff =
      Math.exp(-r * T) *
      (optionType === OptionType.CALL
        ? Math.max(geoMean - K, 0)
        : Math.max(K - geoMean, 0));

    arithPathPayoffArray.push(arithSpathiPayoff);
    geoPathPayoffArray.push(geoSpathiPayoff);
  }

  const arithPayoff = mean(arithPathPayoffArray);
  const geoPayoff = mean(geoPathPayoffArray);

  if (!control)
    return `[${
      arithPayoff - (1.96 * mathjs.std(arithPathPayoffArray)) / Math.sqrt(paths)
    },${
      arithPayoff + (1.96 * mathjs.std(arithPathPayoffArray)) / Math.sqrt(paths)
    }]`;

  const geo = geometricBasket(
    S1,
    S2,
    sigma1,
    sigma2,
    correlation,
    r,
    T,
    K,
    optionType
  );

  const cov =
    mean(arithPathPayoffArray.map((v, i) => v * geoPathPayoffArray[i])) / 2 -
    arithPayoff * geoPayoff;
  const theta = cov / mathjs.variance(geoPathPayoffArray);
  const z = arithPathPayoffArray.map(
    (v, i) => v + theta * (geo - geoPathPayoffArray[i])
  );
  const zMean = mean(z);
  const zStd = mathjs.std(z);
  return `[${zMean - (1.96 * zStd) / Math.sqrt(paths)},${
    zMean + (1.96 * zStd) / Math.sqrt(paths)
  }]`;
}

export function kikoQMC(
  S: number,
  sigma: number,
  r: number,
  T: number,
  K: number,
  L: number,
  U: number,
  observations: number,
  rebate: number
): string {
  const options = { params: "new-joe-kuo-6.21201", resolution: 32 };
  const factor = S * Math.exp(((r - 0.5 * sigma) ^ 2) * T);
  const std = sigma * Math.sqrt(T);
  const distribution = gaussian(0, 1);
  let qmcPayoffArray: number[] = [];
  const sequence = new lobos.Sobol(1, options);
  const x: number[] = sequence.take(observations);
  const z = x.map((x) => distribution.ppf(x));
  const factorArray = z.map((z) => z * std);
  const sArray = factorArray.map((f) => factor * Math.exp(f));

  sArray.map((s) => {
    let payoff;
    if (s <= L) {
      payoff = Math.max(K - s, 0);
    } else {
      if (s > U) {
        payoff = rebate;
      } else {
        payoff = 0;
      }
    }
    qmcPayoffArray.push(payoff);
  });
  const aM = mean(qmcPayoffArray) * Math.exp(-r * T);
  return `KIKO put option [S(0)=${S}, σ=${sigma},  r=${r}, T=${T}, K=${K}, L=${L}, U=${U}, observations=${observations}, rebate=${rebate}]. Price is: ${aM} `;
}
