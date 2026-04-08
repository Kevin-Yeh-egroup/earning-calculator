import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalculationInputs } from '@/lib/calculator';

interface InputFormProps {
  mode: 'forward' | 'backward';
  inputs: CalculationInputs;
  onInputChange: (inputs: CalculationInputs) => void;
  onCalculate: () => void;
}

const InputForm: React.FC<InputFormProps> = ({ mode, inputs, onInputChange, onCalculate }) => {
  const handleChange = (field: keyof CalculationInputs, value: any) => {
    onInputChange({
      ...inputs,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate();
  };

  return (
    <Card className="mb-10 p-8 bg-white/80 backdrop-blur-sm border-muted">
      <h2 className="text-2xl font-semibold text-foreground mb-8">輸入資料</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current Savings */}
          <div>
            <label className="block text-lg font-medium text-foreground mb-2">
              你現在已經有多少存款？
            </label>
            <Input
              type="number"
              value={inputs.initialAmount}
              onChange={(e) => handleChange('initialAmount', parseFloat(e.target.value) || 0)}
              className="text-base"
              min="0"
              step="1000"
            />
            <p className="text-sm text-muted-foreground mt-2">
              如果目前還沒有存款，可以填 0
            </p>
          </div>

          {/* Monthly Payment or Target */}
          <div>
            <label className="block text-lg font-medium text-foreground mb-2">
              {mode === 'forward' ? '你每月想固定存多少？' : '你希望最後累積到多少錢？'}
            </label>
            <Input
              type="number"
              value={mode === 'forward' ? inputs.monthlyPayment : inputs.targetAmount || 500000}
              onChange={(e) =>
                handleChange(
                  mode === 'forward' ? 'monthlyPayment' : 'targetAmount',
                  parseFloat(e.target.value) || 0
                )
              }
              className="text-base"
              min="0"
              step="1000"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {mode === 'forward'
                ? '先填一個你覺得比較做得到的金額，例如 1,000、3,000 或 5,000'
                : '例如旅遊基金、緊急預備金、教育金、買房準備金'}
            </p>
          </div>

          {/* Years */}
          <div>
            <label className="block text-lg font-medium text-foreground mb-2">
              你希望幾年後看到成果？
            </label>
            <Input
              type="number"
              value={inputs.years}
              onChange={(e) => handleChange('years', parseFloat(e.target.value) || 1)}
              className="text-base"
              min="1"
              max="50"
              step="1"
            />
            <p className="text-sm text-muted-foreground mt-2">
              可以先試 3 年、5 年、10 年看看差別
            </p>
          </div>

          {/* Annual Rate */}
          <div>
            <label className="block text-lg font-medium text-foreground mb-2">
              你預期每年平均成長多少？
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={inputs.annualRate * 100}
                onChange={(e) => handleChange('annualRate', (parseFloat(e.target.value) || 0) / 100)}
                className="text-base"
                min="0"
                max="20"
                step="0.1"
              />
              <span className="text-lg font-medium text-foreground">%</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              這是假設數字，用來幫你估算未來，不代表保證結果
            </p>
          </div>

          {/* Payment Timing */}
          <div>
            <label className="block text-lg font-medium text-foreground mb-2">
              你是什麼時候把錢存進去？
            </label>
            <select
              value={inputs.paymentTiming}
              onChange={(e) => handleChange('paymentTiming', e.target.value as 'beginning' | 'end')}
              className="w-full px-3 py-2 rounded-md border border-muted bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="beginning">每個月一開始存</option>
              <option value="end">每個月月底存</option>
            </select>
            <p className="text-sm text-muted-foreground mt-2">
              如果是每月一開始就存，累積效果通常會再多一些
            </p>
          </div>

          {/* Compound Frequency */}
          <div>
            <label className="block text-lg font-medium text-foreground mb-2">
              成長多久計算一次？
            </label>
            <select
              value={inputs.compoundFrequency}
              onChange={(e) => handleChange('compoundFrequency', e.target.value as any)}
              className="w-full px-3 py-2 rounded-md border border-muted bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="annual">每年一次</option>
              <option value="semiannual">每半年一次</option>
              <option value="quarterly">每季一次</option>
              <option value="monthly">每月一次</option>
            </select>
            <p className="text-sm text-muted-foreground mt-2">
              通常選「每月一次」會比較貼近日常存錢情況
            </p>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors"
          >
            開始試算看看
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default InputForm;
