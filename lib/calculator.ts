export interface CalculationInputs {
  initialAmount: number;
  monthlyPayment: number;
  years: number;
  annualRate: number;
  compoundFrequency: 'annual' | 'semiannual' | 'quarterly' | 'monthly' | 'daily360' | '';
  targetAmount?: number;
}

export interface AnnualBreakdown {
  year: number;
  totalAmount: number;
  yearlyPayment: number;
  yearlyInterest: number;
  totalPayment: number;
}

export interface CalculationResult {
  finalAmount: number;
  totalPayment: number;
  totalInterest: number;
  annualBreakdown: AnnualBreakdown[];
  inputs: CalculationInputs;
}

function getPeriodsPerYear(frequency: string): number {
  switch (frequency) {
    case 'annual':
      return 1;
    case 'semiannual':
      return 2;
    case 'quarterly':
      return 4;
    case 'monthly':
      return 12;
    default:
      return 12;
  }
}

/** 日複利（360/年）：每月 30 日、每年 360 日；月薪於每「月」首日投入，當日利息併入次日本金。 */
const DAYS_PER_YEAR_360 = 360;
const DAYS_PER_MONTH_360 = 30;

/**
 * 反向試算求出的「每月應存」常為非整數；若僅把畫面四捨五入、內部仍用浮點數模擬，
 * 會出現「畫面月存 ×12」與年度明細「今年自己存了」不一致。
 * 改為先四捨五入到整數元再跑模擬，使月存、明細、加總一致；最後累積可能略高或略低於目標。
 */
function roundMonthlyPaymentToInteger(yuan: number): number {
  if (yuan <= 0) return 0;
  return Math.round(yuan);
}

export function calculateCompound(inputs: CalculationInputs): CalculationResult {
  const {
    initialAmount,
    monthlyPayment,
    years,
    annualRate,
    compoundFrequency,
  } = inputs;

  let finalAmount = initialAmount;
  let totalPayment = initialAmount;
  const annualBreakdown: AnnualBreakdown[] = [];

  if (compoundFrequency === 'daily360') {
    const dailyRate = annualRate / DAYS_PER_YEAR_360;
    for (let year = 1; year <= years; year++) {
      let yearlyPayment = 0;
      let yearlyInterest = 0;

      for (let d = 0; d < DAYS_PER_YEAR_360; d++) {
        if (d % DAYS_PER_MONTH_360 === 0) {
          finalAmount += monthlyPayment;
          yearlyPayment += monthlyPayment;
        }
        if (dailyRate !== 0) {
          const interest = finalAmount * dailyRate;
          finalAmount += interest;
          yearlyInterest += interest;
        }
      }

      totalPayment += yearlyPayment;

      annualBreakdown.push({
        year,
        totalAmount: Math.round(finalAmount),
        yearlyPayment: Math.round(yearlyPayment),
        yearlyInterest: Math.round(yearlyInterest),
        totalPayment: Math.round(totalPayment),
      });
    }

    return {
      finalAmount: Math.round(finalAmount),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(finalAmount - totalPayment),
      annualBreakdown,
      inputs,
    };
  }

  const periodsPerYear = getPeriodsPerYear(compoundFrequency);
  const periodRate = annualRate / periodsPerYear;

  const paymentPerPeriod = (monthlyPayment * 12) / periodsPerYear;

  for (let year = 1; year <= years; year++) {
    let yearlyPayment = 0;
    let yearlyInterest = 0;

    for (let p = 0; p < periodsPerYear; p++) {
      finalAmount += paymentPerPeriod;
      yearlyPayment += paymentPerPeriod;

      if (periodRate !== 0) {
        const interest = finalAmount * periodRate;
        finalAmount += interest;
        yearlyInterest += interest;
      }
    }

    totalPayment += yearlyPayment;

    annualBreakdown.push({
      year,
      totalAmount: Math.round(finalAmount),
      yearlyPayment: Math.round(yearlyPayment),
      yearlyInterest: Math.round(yearlyInterest),
      totalPayment: Math.round(totalPayment),
    });
  }

  return {
    finalAmount: Math.round(finalAmount),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(finalAmount - totalPayment),
    annualBreakdown,
    inputs,
  };
}

export function calculateTargetPayment(inputs: CalculationInputs): CalculationResult {
  const {
    initialAmount,
    years,
    annualRate,
    compoundFrequency,
    targetAmount = 500000,
  } = inputs;

  if (compoundFrequency === 'daily360') {
    const fvWithZeroPayment = calculateCompound({ ...inputs, monthlyPayment: 0 }).finalAmount;
    if (fvWithZeroPayment >= targetAmount) {
      return calculateCompound({ ...inputs, monthlyPayment: 0 });
    }

    const solve = (): number => {
      if (years <= 0) return 0;
      const need = Math.max(0, targetAmount - initialAmount);
      if (need === 0) return 0;

      let low = 0;
      let high = need / (years * 12) + 1;
      while (calculateCompound({ ...inputs, monthlyPayment: high }).finalAmount < targetAmount) {
        high *= 2;
        if (high > 1e15) break;
      }
      for (let i = 0; i < 80; i++) {
        const mid = (low + high) / 2;
        const fv = calculateCompound({ ...inputs, monthlyPayment: mid }).finalAmount;
        if (fv < targetAmount) low = mid;
        else high = mid;
      }
      return high;
    };

    const requiredMonthlyPayment = roundMonthlyPaymentToInteger(solve());
    return calculateCompound({ ...inputs, monthlyPayment: requiredMonthlyPayment });
  }

  const periodsPerYear = getPeriodsPerYear(compoundFrequency);
  const periodRate = annualRate / periodsPerYear;
  const totalPeriods = years * periodsPerYear;

  let requiredMonthlyPayment = 0;

  if (periodRate === 0) {
    requiredMonthlyPayment = Math.max(0, (targetAmount - initialAmount) / (years * 12));
  } else {
    const compoundFactor = Math.pow(1 + periodRate, totalPeriods);
    const futureValueOfInitial = initialAmount * compoundFactor;
    const remainingTarget = Math.max(0, targetAmount - futureValueOfInitial);

    const paymentFactor = (1 + periodRate) * ((compoundFactor - 1) / periodRate);

    const paymentPerPeriod = remainingTarget / paymentFactor;
    requiredMonthlyPayment = Math.max(0, (paymentPerPeriod * periodsPerYear) / 12);
  }

  requiredMonthlyPayment = roundMonthlyPaymentToInteger(requiredMonthlyPayment);

  return calculateCompound({
    ...inputs,
    monthlyPayment: requiredMonthlyPayment,
  });
}

/** 整數或金額用千分位（例：1,234,567） */
export function formatNumberTW(
  amount: number,
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
): string {
  return new Intl.NumberFormat('zh-TW', {
    useGrouping: true,
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  }).format(amount);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
