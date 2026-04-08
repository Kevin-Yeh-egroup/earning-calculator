import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { CalculationResult } from '@/lib/calculator';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartsSectionProps {
  results: CalculationResult;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ results }) => {
  const { annualBreakdown } = results;

  // Prepare data for visualization
  const chartData = annualBreakdown.map((item) => ({
    year: `年 ${item.year}`,
    total: item.totalAmount,
    payment: item.totalPayment,
    interest: item.yearlyInterest,
  }));

  const comparisonData = useMemo(() => {
    // Simulate comparison with different interest rates
    const scenarios = [
      { rate: 0.02, name: '2% 年息' },
      { rate: 0.04, name: '4% 年息 (目前)' },
      { rate: 0.06, name: '6% 年息' },
    ];

    return annualBreakdown.map((item) => {
      const result: any = { year: item.year };
      scenarios.forEach((scenario) => {
        result[scenario.name] = item.totalAmount; // Simplified for display
      });
      return result;
    });
  }, [annualBreakdown]);

  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold text-foreground mb-8">📊 視覺化你的累積變化</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accumulation Over Time */}
        <Card className="p-6 bg-white/80 border-muted">
          <h3 className="text-xl font-semibold text-foreground mb-2">你的累積變化</h3>
          <p className="text-sm text-muted-foreground mb-4">
            看看這筆錢是怎麼隨時間慢慢增加的
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8dcd0" />
              <XAxis dataKey="year" stroke="#6b5d52" />
              <YAxis stroke="#6b5d52" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e8dcd0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#d4a574"
                strokeWidth={3}
                dot={{ fill: '#d4a574', r: 4 }}
                activeDot={{ r: 6 }}
                name="累積金額"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Payment vs Interest */}
        <Card className="p-6 bg-white/80 border-muted">
          <h3 className="text-xl font-semibold text-foreground mb-2">自己存的 vs 增加的</h3>
          <p className="text-sm text-muted-foreground mb-4">
            幫助你理解哪些是自己存的，哪些是慢慢累積出來的
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8dcd0" />
              <XAxis dataKey="year" stroke="#6b5d52" />
              <YAxis stroke="#6b5d52" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e8dcd0',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="payment" stackId="a" fill="#d4a574" name="自己存的" />
              <Bar dataKey="interest" stackId="a" fill="#c1956f" name="增加的金額" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default ChartsSection;
