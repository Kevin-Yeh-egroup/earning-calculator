import React from 'react';
import { Card } from '@/components/ui/card';

const Disclaimer: React.FC = () => {
  return (
    <Card className="p-8 bg-muted/10 border-muted">
      <h2 className="text-2xl font-bold text-foreground mb-4">💬 溫和提醒</h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        <p>
          這個工具是用固定條件幫你做估算。<br />
          幫助你先看到一個方向。
        </p>
        <p>
          實際的結果，會因為收入、習慣、環境而不同。<br />
          這不是保證的數字，而是一個參考起點。
        </p>
        <div className="pt-4 border-t border-muted">
          <p className="text-sm">
            💡 <span className="font-medium">小建議：</span>
            用這個工具做出的計劃，最重要的是開始行動。
            不需要一次完美，穩定地存錢，就已經贏了。
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Disclaimer;
