const mathjs = require('mathjs')

import { OptionType } from "./components/optionTypeSelector"

function cdfNormal (x:number) {
  return (1 - mathjs.erf((0 - x ) / (Math.sqrt(2) * 1))) / 2
}
export function bsModel(S: number, sigma: number, r: number, q: number, T: number, K: number, optionType: OptionType): string {
    const d1 = (Math.log(S / K) + (r - q) * (T)) / (sigma * Math.sqrt(T)) + (sigma / 2) * Math.sqrt(T)
    const d2 = d1 - sigma * Math.sqrt(T)
    const callPrice = S * Math.exp(-q * T) * cdfNormal(d1) - K * Math.exp(-r * (T)) * cdfNormal(d2)
    const putPrice = K * Math.exp(-r * (T)) * cdfNormal(-d2) - S * Math.exp(-q * T) * cdfNormal(-d1)
    return `${optionType} Option [S(0)=${S}, σ=${sigma}, r=${r}, q=${q}, T=${T}, K=${K}] Price:${optionType === OptionType.CALL ? callPrice : putPrice}`
}


