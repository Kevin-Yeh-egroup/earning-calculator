import React from 'react';
import { Card } from '@/components/ui/card';
import { CalculationResult, formatCurrency, formatNumberTW } from '@/lib/calculator';
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

/** 左側留足空間，避免 Y 軸千分位（如 500,000、1,000,000）被裁切 */
const CHART_MARGIN = { top: 12, right: 16, left: 20, bottom: 8 };
const Y_AXIS_WIDTH = 112;

/** 堆疊長條：深褐＝自己存的（主題 chart 深色系），淺金＝增加（同 primary），對比明顯仍屬同一暖色調 */
const BAR_PAYMENT = '#5e4634';
const BAR_INTEREST = '#d4a574';

const ChartsSection: React.FC<ChartsSectionProps> = ({ results }) => {
  const { annualBreakdown } = results;

  // Prepare data for visualization
  const chartData = annualBreakdown.map((item) => ({
    year: `年 ${item.year}`,
    total: item.totalAmount,
    payment: item.totalPayment,
    interest: item.yearlyInterest,
  }));

  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold text-foreground mb-8">📊 視覺化你的累積變化</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accumulation Over Time */}
        <Card className="overflow-visible p-6 bg-white/80 border-muted">
          <h3 className="text-xl font-semibold text-foreground mb-2">你的累積變化</h3>
          <p className="text-sm text-muted-foreground mb-4">
            看看這筆錢是怎麼隨時間慢慢增加的
          </p>
          <div className="w-full min-w-0 overflow-visible">
            <ResponsiveContainer width="100%" height={300} debounce={50}>
              <LineChart data={chartData} margin={CHART_MARGIN}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8dcd0" />
                <XAxis dataKey="year" stroke="#6b5d52" tick={{ fontSize: 12 }} />
                <YAxis
                  width={Y_AXIS_WIDTH}
                  tickMargin={8}
                  stroke="#6b5d52"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => formatNumberTW(Number(v))}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8dcd0',
                    borderRadius: '8px',
                  }}
                  formatter={(value) =>
                    typeof value === 'number' ? formatCurrency(value) : formatCurrency(Number(value))
                  }
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
          </div>
        </Card>

        {/* Payment vs Interest */}
        <Card className="overflow-visible p-6 bg-white/80 border-muted">
          <h3 className="text-xl font-semibold text-foreground mb-2">自己存的 vs 增加的</h3>
          <p className="text-sm text-muted-foreground mb-4">
            幫助你理解哪些是自己存的，哪些是慢慢累積出來的
          </p>
          <div className="w-full min-w-0 overflow-visible">
            <ResponsiveContainer width="100%" height={300} debounce={50}>
              <BarChart data={chartData} margin={CHART_MARGIN}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8dcd0" />
                <XAxis dataKey="year" stroke="#6b5d52" tick={{ fontSize: 12 }} />
                <YAxis
                  width={Y_AXIS_WIDTH}
                  tickMargin={8}
                  stroke="#6b5d52"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => formatNumberTW(Number(v))}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e8dcd0',
                    borderRadius: '8px',
                  }}
                  formatter={(value) =>
                    typeof value === 'number' ? formatCurrency(value) : formatCurrency(Number(value))
                  }
                />
                <Legend />
                <Bar dataKey="payment" stackId="a" fill={BAR_PAYMENT} name="自己存的" />
                <Bar dataKey="interest" stackId="a" fill={BAR_INTEREST} name="增加的金額" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChartsSection;
