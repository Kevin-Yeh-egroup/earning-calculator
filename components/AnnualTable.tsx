import React from 'react';
import { Card } from '@/components/ui/card';
import { CalculationResult, formatCurrency } from '@/lib/calculator';

interface AnnualTableProps {
  results: CalculationResult;
}

const AnnualTable: React.FC<AnnualTableProps> = ({ results }) => {
  const { annualBreakdown } = results;

  return (
    <Card className="mb-10 p-6 bg-white/80 border-muted">
      <h2 className="text-2xl font-bold text-foreground mb-6">📋 年度明細</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-muted">
              <th className="text-left py-3 px-4 text-foreground font-semibold">年度</th>
              <th className="text-right py-3 px-4 text-foreground font-semibold">目前大約累積</th>
              <th className="text-right py-3 px-4 text-foreground font-semibold">今年自己存了</th>
              <th className="text-right py-3 px-4 text-foreground font-semibold">今年增加的</th>
              <th className="text-right py-3 px-4 text-foreground font-semibold">總共自己存</th>
            </tr>
          </thead>
          <tbody>
            {annualBreakdown.map((item, index) => (
              <tr
                key={index}
                className={`border-b border-muted/50 ${
                  index % 2 === 0 ? 'bg-white/50' : 'bg-background/30'
                } hover:bg-secondary/20 transition-colors`}
              >
                <td className="py-4 px-4 text-foreground font-medium">第 {item.year} 年</td>
                <td className="py-4 px-4 text-right text-primary font-semibold">
                  {formatCurrency(item.totalAmount)}
                </td>
                <td className="py-4 px-4 text-right text-foreground">
                  {formatCurrency(item.yearlyPayment)}
                </td>
                <td className="py-4 px-4 text-right text-accent">
                  {formatCurrency(item.yearlyInterest)}
                </td>
                <td className="py-4 px-4 text-right text-muted-foreground font-medium">
                  {formatCurrency(item.totalPayment)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AnnualTable;
