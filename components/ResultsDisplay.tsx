import React from 'react';
import { Card } from '@/components/ui/card';
import { CalculationResult, formatCurrency } from '@/lib/calculator';

interface ResultsDisplayProps {
  mode: 'forward' | 'backward';
  results: CalculationResult;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ mode, results }) => {
  const { finalAmount, totalPayment, totalInterest, inputs } = results;
  const targetAmount = inputs.targetAmount ?? 0;
  const meetsOrExceedsTarget = mode !== 'backward' || finalAmount >= targetAmount - 1;

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
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground leading-relaxed">
              若預期年利率為{' '}
              <span className="font-semibold text-foreground">
                {(inputs.annualRate * 100).toFixed(1).replace(/\.0$/, '')}%／年
              </span>
              ，且複利方式與上方「輸入資料」所選相同，
            </p>
            <p className="text-lg text-foreground font-semibold">
              你現在每月大約需要存{' '}
              <span className="text-primary">{formatCurrency(inputs.monthlyPayment)}</span>
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-primary/10 mt-3">
              此金額為公式算出後<strong className="text-foreground font-medium">四捨五入到整數元</strong>
              ，再依該整數逐月試算；因此「每月應存 × 12」會與年度明細「今年自己存了」一致。四捨五入後，最後累積可能
              <strong className="text-foreground font-medium">略高或略低於</strong>
              目標金額，屬正常誤差；若略低，可將月存調高 1 元後再試算一次。
            </p>
          </div>
        )}
      </Card>

      {/* Result Cards Grid：目標／累積進度僅在「反向試算」情境顯示 */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${mode === 'backward' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}
      >
        {/* Total Accumulated */}
        <Card className="p-6 bg-white/50 border-muted">
          <p className="text-sm text-muted-foreground mb-2">幾年後可能累積到</p>
          <p className="text-3xl font-bold text-primary">{formatCurrency(finalAmount)}</p>
        </Card>

        {/* Total Payment — 與「增加金額」用色區隔 */}
        <Card className="p-6 border-2 border-blue-200 bg-blue-50/90 dark:border-blue-800 dark:bg-blue-950/40">
          <p className="text-sm text-blue-900/80 dark:text-blue-200/90 mb-2">這段時間你自己存了多少</p>
          <p className="text-3xl font-bold text-blue-800 dark:text-blue-100">{formatCurrency(totalPayment)}</p>
        </Card>

        {/* Total Interest */}
        <Card className="p-6 border-2 border-emerald-200 bg-emerald-50/90 dark:border-emerald-800 dark:bg-emerald-950/40">
          <p className="text-sm text-emerald-900/80 dark:text-emerald-200/90 mb-2">慢慢累積增加的金額</p>
          <p className="text-3xl font-bold text-emerald-800 dark:text-emerald-100">{formatCurrency(totalInterest)}</p>
        </Card>

        {mode === 'backward' && (
          <Card className="p-6 bg-white/50 border-muted">
            <p className="text-sm text-muted-foreground mb-2">目標達成狀況</p>
            {meetsOrExceedsTarget ? (
              <p className="text-3xl font-bold text-primary">✓ 達成或超過目標</p>
            ) : (
              <p className="text-3xl font-bold text-amber-700 dark:text-amber-500">略低於目標</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              目標 {formatCurrency(targetAmount)}
              {!meetsOrExceedsTarget && (
                <span className="block mt-1 text-amber-800/90 dark:text-amber-400/90">
                  因月存四捨五入為整數，累積可能差一點點；可微調月存後再試算。
                </span>
              )}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
