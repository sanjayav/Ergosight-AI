'use client';

import { useState } from 'react';
import { Home, Car, FlaskConical, BarChart3, Database, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'home', label: 'Portfolio Overview', icon: Home },
  { id: 'vehicle', label: 'Vehicle Detail', icon: Car },
  { id: 'scenario', label: 'Scenario Lab', icon: FlaskConical },
  { id: 'performance', label: 'Model Performance', icon: BarChart3 },
  { id: 'data', label: 'Data Inspector', icon: Database },
  { id: 'upload', label: 'CAD Upload', icon: Upload },
];

export default function Navigation({ activeView, onViewChange }: NavigationProps) {
  return (
    <nav className="bg-white border-r border-gray-200 w-64 flex-shrink-0 shadow-sm">
      <div className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                'w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-mahindra-red text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-gray-500')} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

