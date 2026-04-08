export interface CalculationInputs {
  initialAmount: number;
  monthlyPayment: number;
  years: number;
  annualRate: number;
  paymentTiming: 'beginning' | 'end';
  compoundFrequency: 'annual' | 'semiannual' | 'quarterly' | 'monthly';
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

export function calculateCompound(inputs: CalculationInputs): CalculationResult {
  const {
    initialAmount,
    monthlyPayment,
    years,
    annualRate,
    paymentTiming,
    compoundFrequency,
  } = inputs;

  const periodsPerYear = getPeriodsPerYear(compoundFrequency);
  const periodRate = annualRate / periodsPerYear;
  const totalPeriods = years * periodsPerYear;

  let finalAmount = initialAmount;
  let totalPayment = initialAmount;
  const annualBreakdown: AnnualBreakdown[] = [];

  // Monthly payment converted to per-period payment
  const paymentPerPeriod = monthlyPayment * 12 / periodsPerYear;

  for (let year = 1; year <= years; year++) {
    const startAmount = finalAmount;
    let yearlyPayment = 0;
    let yearlyInterest = 0;

    for (let p = 0; p < periodsPerYear; p++) {
      // Add payment at beginning or end
      if (paymentTiming === 'beginning') {
        finalAmount += paymentPerPeriod;
        yearlyPayment += paymentPerPeriod;
      }

      // Calculate interest
      if (periodRate !== 0) {
        const interest = finalAmount * periodRate;
        finalAmount += interest;
        yearlyInterest += interest;
      }

      // Add payment at end
      if (paymentTiming === 'end') {
        finalAmount += paymentPerPeriod;
        yearlyPayment += paymentPerPeriod;
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
    paymentTiming,
    compoundFrequency,
    targetAmount = 500000,
  } = inputs;

  const periodsPerYear = getPeriodsPerYear(compoundFrequency);
  const periodRate = annualRate / periodsPerYear;
  const totalPeriods = years * periodsPerYear;

  let requiredMonthlyPayment = 0;

  if (periodRate === 0) {
    // No interest
    requiredMonthlyPayment = Math.max(0, (targetAmount - initialAmount) / (years * 12));
  } else {
    // Calculate using formula
    const compoundFactor = Math.pow(1 + periodRate, totalPeriods);
    const futureValueOfInitial = initialAmount * compoundFactor;
    const remainingTarget = Math.max(0, targetAmount - futureValueOfInitial);

    let paymentFactor: number;
    if (paymentTiming === 'beginning') {
      paymentFactor = (1 + periodRate) * ((compoundFactor - 1) / periodRate);
    } else {
      paymentFactor = (compoundFactor - 1) / periodRate;
    }

    const paymentPerPeriod = remainingTarget / paymentFactor;
    requiredMonthlyPayment = Math.max(0, (paymentPerPeriod * periodsPerYear) / 12);
  }

  // Now calculate with this payment
  const calculationInputs: CalculationInputs = {
    ...inputs,
    monthlyPayment: requiredMonthlyPayment,
  };

  return calculateCompound(calculationInputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
