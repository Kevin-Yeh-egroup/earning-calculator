import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import ScenarioSelector from './ScenarioSelector';
import InputForm from './InputForm';
import ResultsDisplay from './ResultsDisplay';
import ChartsSection from './ChartsSection';
import AnnualTable from './AnnualTable';
import ThinkingPrompts from './ThinkingPrompts';
import Disclaimer from './Disclaimer';
import { calculateCompound, calculateTargetPayment, type CalculationInputs, type CalculationResult } from '@/lib/calculator';

type Mode = 'forward' | 'backward';

const Calculator: React.FC = () => {
  const [mode, setMode] = useState<Mode>('forward');
  const [inputs, setInputs] = useState<CalculationInputs>({
    initialAmount: 0,
    monthlyPayment: 3000,
    years: 5,
    annualRate: 0.04,
    paymentTiming: 'beginning',
    compoundFrequency: 'monthly',
    targetAmount: 500000,
  });

  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState<CalculationResult | null>(null);

  const handleInputChange = (newInputs: CalculationInputs) => {
    setInputs(newInputs);
  };

  const handleCalculate = () => {
    if (mode === 'forward') {
      const result = calculateCompound(inputs);
      setResults(result);
    } else {
      const result = calculateTargetPayment(inputs);
      setResults(result);
    }
    setCalculated(true);
  };

  const handleAdjustments = (adjustedInputs: CalculationInputs) => {
    setInputs(adjustedInputs);
    handleCalculate();
  };

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-balance">
            存錢試算小工具
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            用簡單的方式看看，現在開始準備，未來可能累積多少
          </p>
        </div>

        {/* Introduction Section */}
        <Card className="mb-8 p-8 bg-white/80 backdrop-blur-sm border-muted">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            先用幾個簡單的數字，看看未來的可能
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            不需要懂理財，也不用算複雜的公式。<br />
            只要輸入幾個和生活有關的數字，<br />
            就可以先看看「如果這樣做，未來大概會變怎樣」
          </p>
        </Card>

        {/* Scenario Selection */}
        <ScenarioSelector mode={mode} onModeChange={setMode} />

        {/* Input Form */}
        <InputForm
          mode={mode}
          inputs={inputs}
          onInputChange={handleInputChange}
          onCalculate={handleCalculate}
        />

        {/* Results Section */}
        {calculated && results && (
          <>
            <ResultsDisplay mode={mode} results={results} />
            <ChartsSection results={results} />
            <AnnualTable results={results} />
            <ThinkingPrompts
              inputs={inputs}
              results={results}
              onAdjustment={handleAdjustments}
            />
          </>
        )}

        {/* Disclaimer */}
        <Disclaimer />
      </div>
    </div>
  );
};

export default Calculator;
