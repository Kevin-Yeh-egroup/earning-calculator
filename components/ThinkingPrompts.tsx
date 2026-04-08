import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalculationInputs, CalculationResult, formatCurrency } from '@/lib/calculator';

interface ThinkingPromptsProps {
  inputs: CalculationInputs;
  results: CalculationResult;
  onAdjustment: (inputs: CalculationInputs) => void;
}

const ThinkingPrompts: React.FC<ThinkingPromptsProps> = ({ inputs, results, onAdjustment }) => {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  const scenarios = [
    {
      id: 'more-payment',
      title: '每月多存一點，差多少？',
      description: '例如多 1,000 元，長期下來可能差很多',
      adjustment: () => ({
        ...inputs,
        monthlyPayment: inputs.monthlyPayment + 1000,
      }),
    },
    {
      id: 'longer-time',
      title: '多給自己幾年，會不會更輕鬆？',
      description: '時間拉長，通常每月壓力會下降',
      adjustment: () => ({
        ...inputs,
        years: inputs.years + 5,
      }),
    },
    {
      id: 'conservative',
      title: '用保守一點的成長看看',
      description: '試試較低的數字，讓規劃更安心',
      adjustment: () => ({
        ...inputs,
        annualRate: Math.max(0, inputs.annualRate - 0.02),
      }),
    },
    {
      id: 'gradual',
      title: '先從做得到的開始',
      description: '不需要一次完美，穩定開始就很重要',
      adjustment: () => ({
        ...inputs,
        monthlyPayment: Math.max(1000, inputs.monthlyPayment * 0.8),
      }),
    },
  ];

  const handleScenarioClick = (scenario: typeof scenarios[0]) => {
    const adjustedInputs = scenario.adjustment();
    onAdjustment(adjustedInputs);
    setActiveScenario(scenario.id);
  };

  return (
    <Card className="mb-10 p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-muted">
      <h2 className="text-2xl font-bold text-foreground mb-8">你也可以試試看這幾種調整</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleScenarioClick(scenario)}
            className="text-left p-6 rounded-lg bg-white border-2 border-muted hover:border-primary hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">{scenario.title}</h3>
            <p className="text-muted-foreground mb-4">{scenario.description}</p>
            <div className="flex items-center text-primary font-medium">
              試試看 →
            </div>
          </button>
        ))}
      </div>

      {activeScenario && (
        <div className="mt-8 p-6 rounded-lg bg-secondary/30 border border-primary/20">
          <h3 className="text-lg font-semibold text-foreground mb-3">這次調整的結果：</h3>
          <p className="text-lg text-primary font-bold mb-2">
            {formatCurrency(results.finalAmount)}
          </p>
          <p className="text-muted-foreground">
            {activeScenario === 'more-payment' && '多存一點，長期累積效果明顯'}
            {activeScenario === 'longer-time' && '多給自己時間，複利的威力就會展現'}
            {activeScenario === 'conservative' && '用較保守的假設，規劃會更穩健'}
            {activeScenario === 'gradual' && '從較低的金額開始，更容易執行'}
          </p>
        </div>
      )}
    </Card>
  );
};

export default ThinkingPrompts;
