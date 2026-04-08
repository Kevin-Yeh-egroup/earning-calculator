'use client';

import React, { useState, useMemo } from 'react';
import Calculator from '@/components/Calculator';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary">
      <Calculator />
    </main>
  );
}
