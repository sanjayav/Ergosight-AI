'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon: LucideIcon;
  colorClass?: string;
}

export default function KPICard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon: Icon,
  colorClass = 'gradient-blue'
}: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {trend && (
              <span className={cn(
                'text-sm font-semibold',
                trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
              )}>
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', colorClass)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

