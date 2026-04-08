import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalculationInputs, formatNumberTW } from '@/lib/calculator';

interface InputFormProps {
  mode: 'forward' | 'backward';
  inputs: CalculationInputs;
  onInputChange: (inputs: CalculationInputs) => void;
  onCalculate: () => void;
}

type GroupedAmountField = 'initialAmount' | 'monthlyPayment' | 'targetAmount';

function GroupedIntegerInput({
  value,
  onCommit,
  isFocused,
  onFocus,
  onBlur,
  className,
  placeholder,
}: {
  value: number;
  onCommit: (n: number) => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  className?: string;
  placeholder?: string;
}) {
  const displayUnfocused = value === 0 ? '' : formatNumberTW(value);
  return (
    <Input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder={placeholder}
      value={isFocused ? (value === 0 ? '' : String(value)) : displayUnfocused}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, '');
        onCommit(digits === '' ? 0 : parseInt(digits, 10));
      }}
      className={className}
    />
  );
}

const InputForm: React.FC<InputFormProps> = ({ mode, inputs, onInputChange, onCalculate }) => {
  const [groupedFocus, setGroupedFocus] = useState<GroupedAmountField | null>(null);

  useEffect(() => {
    setGroupedFocus(null);
  }, [mode]);

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

      <form noValidate onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current Savings */}
          <div>
            <label className="block text-lg font-medium text-foreground mb-2">
              你現在已經有多少存款？
            </label>
            <div className="flex items-center gap-2">
              <GroupedIntegerInput
                value={inputs.initialAmount}
                onCommit={(n) => handleChange('initialAmount', n)}
                isFocused={groupedFocus === 'initialAmount'}
                onFocus={() => setGroupedFocus('initialAmount')}
                onBlur={() => setGroupedFocus(null)}
                className="text-base flex-1 min-w-0"
                placeholder="請輸入"
              />
              <span className="text-lg font-medium text-foreground shrink-0">元</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              如果目前還沒有存款，可以填 0
            </p>
          </div>

          {/* Monthly Payment or Target */}
          <div>
            <label className="block text-lg font-medium text-foreground mb-2">
              {mode === 'forward' ? '你每月想固定存多少？' : '你希望最後累積到多少錢？'}
            </label>
            <div className="flex items-center gap-2">
              <GroupedIntegerInput
                value={mode === 'forward' ? inputs.monthlyPayment : inputs.targetAmount ?? 0}
                onCommit={(n) =>
                  handleChange(mode === 'forward' ? 'monthlyPayment' : 'targetAmount', n)
                }
                isFocused={
                  groupedFocus === (mode === 'forward' ? 'monthlyPayment' : 'targetAmount')
                }
                onFocus={() =>
                  setGroupedFocus(mode === 'forward' ? 'monthlyPayment' : 'targetAmount')
                }
                onBlur={() => setGroupedFocus(null)}
                className="text-base flex-1 min-w-0"
                placeholder="請輸入"
              />
              <span className="text-lg font-medium text-foreground shrink-0">元</span>
            </div>
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
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={inputs.years === 0 ? '' : inputs.years}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '') {
                    handleChange('years', 0);
                    return;
                  }
                  const n = parseInt(v, 10);
                  if (!Number.isFinite(n)) return;
                  handleChange('years', Math.min(50, Math.max(0, n)));
                }}
                className="text-base flex-1 min-w-0 max-w-[8rem]"
                min={1}
                max={50}
                step={1}
                placeholder="請輸入"
              />
              <span className="text-lg font-medium text-foreground shrink-0">年</span>
            </div>
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
                value={inputs.annualRate === 0 ? '' : inputs.annualRate * 100}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '') {
                    handleChange('annualRate', 0);
                    return;
                  }
                  const pct = parseFloat(v);
                  if (!Number.isFinite(pct)) return;
                  handleChange('annualRate', Math.min(20, Math.max(0, pct)) / 100);
                }}
                className="text-base flex-1 min-w-0 max-w-[8rem]"
                min={0}
                max={20}
                step={0.1}
                placeholder="請輸入"
              />
              <span className="text-lg font-medium text-foreground shrink-0">%／年</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              這是假設數字，用來幫你估算未來，不代表保證結果
            </p>
          </div>

          {/* Compound Frequency */}
          <div>
            <label className="block text-lg font-medium text-foreground mb-2">
              複利多久計算一次？
            </label>
            <select
              value={inputs.compoundFrequency}
              onChange={(e) =>
                handleChange(
                  'compoundFrequency',
                  e.target.value as CalculationInputs['compoundFrequency']
                )
              }
              className="w-full px-3 py-2 rounded-md border border-muted bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">請選擇</option>
              <option value="annual">每年複利一次（計息週期：1 年）</option>
              <option value="semiannual">每半年複利一次（計息週期：6 個月）</option>
              <option value="quarterly">每季複利一次（計息週期：3 個月）</option>
              <option value="monthly">每月複利一次（計息週期：1 個月）</option>
              <option value="daily360">日複利（計息週期：1 日；一年 360 日）</option>
            </select>
            <p className="text-sm text-muted-foreground mt-2">
              {inputs.compoundFrequency === '' ? (
                <>請先選擇複利計算頻率；選定後會顯示對應說明。</>
              ) : inputs.compoundFrequency === 'daily360' ? (
                <>
                  日複利中，一天的利息會併入本金、用於計算隔天的利息。本試算假設一個月 30 天、一年 360
                  天；每月存款皆在該月首日投入。與實際日曆或商品條款相比，結果可能略有差異。
                </>
              ) : (
                <>通常選「每月複利一次」會比較貼近常見的存款或基金淨值情境；每月存款皆假設在該計息期一開始投入。</>
              )}
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
