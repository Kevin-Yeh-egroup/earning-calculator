import React from 'react';
import { Card } from '@/components/ui/card';

interface ScenarioSelectorProps {
  mode: 'forward' | 'backward';
  onModeChange: (mode: 'forward' | 'backward') => void;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ mode, onModeChange }) => {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold text-foreground mb-6">選擇你的情境</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Forward Mode Card */}
        <Card
          className={`p-8 cursor-pointer transition-all border-2 ${
            mode === 'forward'
              ? 'border-primary bg-secondary/30'
              : 'border-muted hover:border-primary/50'
          }`}
          onClick={() => onModeChange('forward')}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              mode === 'forward' ? 'border-primary bg-primary' : 'border-muted-foreground'
            }`}>
              {mode === 'forward' && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <h3 className="text-xl font-semibold text-foreground">我這樣存下去，未來會有多少？</h3>
          </div>
          <p className="text-muted-foreground ml-9">
            已經有每月可以存的金額，想看看未來累積狀況
          </p>
        </Card>

        {/* Backward Mode Card */}
        <Card
          className={`p-8 cursor-pointer transition-all border-2 ${
            mode === 'backward'
              ? 'border-primary bg-secondary/30'
              : 'border-muted hover:border-primary/50'
          }`}
          onClick={() => onModeChange('backward')}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              mode === 'backward' ? 'border-primary bg-primary' : 'border-muted-foreground'
            }`}>
              {mode === 'backward' && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
            <h3 className="text-xl font-semibold text-foreground">我想在幾年後存到一筆錢，現在每月要存多少？</h3>
          </div>
          <p className="text-muted-foreground ml-9">
            已經有目標金額，想知道現在需要怎麼準備
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ScenarioSelector;
