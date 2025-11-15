import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SemicircleGaugeProps {
  title: string;
  value: number;
  max: number;
  color: 'income' | 'expense';
}

export function SemicircleGauge({ title, value, max, color }: SemicircleGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const angle = (percentage / 100) * 180;

  const radius = 80;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (angle / 180) * circumference;

  const colorClass = color === 'income' ? 'text-income' : 'text-expense';
  const strokeColor = color === 'income' ? '#34A853' : '#EA4335';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-48 h-24">
          <svg
            className="w-full h-full"
            viewBox="0 0 200 100"
            style={{ overflow: 'visible' }}
          >
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-muted opacity-20"
              strokeLinecap="round"
            />

            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={strokeColor}
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                transformOrigin: 'center',
                transform: 'rotate(0deg)',
              }}
            />

            <text
              x="100"
              y="70"
              textAnchor="middle"
              className={`text-2xl font-bold ${colorClass} fill-current`}
            >
              {percentage.toFixed(0)}%
            </text>
          </svg>
        </div>

        <div className="mt-4 text-center space-y-1">
          <p className={`text-2xl font-bold ${colorClass}`}>
            ${value.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            of ${max.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
