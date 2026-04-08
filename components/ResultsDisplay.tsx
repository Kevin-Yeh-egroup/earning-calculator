import React from 'react';
import { Card } from '@/components/ui/card';
import { CalculationResult, formatCurrency } from '@/lib/calculator';

interface ResultsDisplayProps {
  mode: 'forward' | 'backward';
  results: CalculationResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ mode, results }) => {
  const { finalAmount, totalPayment, totalInterest, inputs } = results;

  return (
    <div className="mb-10">
      {/* Main Result */}
      <Card className="p-10 mb-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <p className="text-muted-foreground text-lg mb-2">
          {mode === 'forward'
            ? `👉 照這樣下去，${inputs.years} 年後你大約可能累積到`
            : `👉 如果希望 ${inputs.years} 年後存到 ${formatCurrency(inputs.targetAmount || 0)}`}
        </p>
        <h2 className="text-5xl md:text-6xl font-bold text-primary mb-4 text-balance">
          {formatCurrency(finalAmount)}
        </h2>
        {mode === 'backward' && (
          <p className="text-lg text-foreground font-semibold">
            你現在每月大約需要存 <span className="text-primary">{formatCurrency(inputs.monthlyPayment)}</span>
          </p>
        )}
      </Card>

      {/* Result Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Accumulated */}
        <Card className="p-6 bg-white/50 border-muted">
          <p className="text-sm text-muted-foreground mb-2">幾年後可能累積到</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(finalAmount)}</p>
        </Card>

        {/* Total Payment */}
        <Card className="p-6 bg-white/50 border-muted">
          <p className="text-sm text-muted-foreground mb-2">這段時間你自己存了多少</p>
          <p className="text-3xl font-bold text-foreground">{formatCurrency(totalPayment)}</p>
        </Card>

        {/* Total Interest */}
        <Card className="p-6 bg-white/50 border-muted">
          <p className="text-sm text-muted-foreground mb-2">慢慢累積增加的金額</p>
          <p className="text-3xl font-bold text-accent">{formatCurrency(totalInterest)}</p>
        </Card>

        {/* Status */}
        <Card className="p-6 bg-white/50 border-muted">
          <p className="text-sm text-muted-foreground mb-2">
            {mode === 'backward' ? '目標達成狀況' : '累積進度'}
          </p>
          {mode === 'backward' ? (
            <p className="text-3xl font-bold text-primary">✓ 可達成</p>
          ) : (
            <div>
              <p className="text-3xl font-bold text-primary">
                {((finalAmount / (inputs.targetAmount || finalAmount)) * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {inputs.targetAmount ? `目標: ${formatCurrency(inputs.targetAmount)}` : '沒有設定目標'}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResultsDisplay;
