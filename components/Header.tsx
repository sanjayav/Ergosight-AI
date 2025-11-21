'use client';

import { useState } from 'react';
import { User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Portfolio Overview' }: HeaderProps) {
  const [activeFilters, setActiveFilters] = useState({
    vehicleLine: 'All',
    bodyStyle: 'All',
    region: 'India',
    userProfile: 'All',
  });

  return (
    <header className="bg-gradient-to-r from-white to-gray-50 border-b-2 border-gray-100 sticky top-0 z-40 shadow-sm backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-red rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">E</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-mahindra-dark to-gray-600 bg-clip-text text-transparent">ErgoSight</h1>
                <p className="text-xs text-gray-500 font-medium">3D CAD-Powered Ingress/Egress AI</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-gradient-to-br from-gray-50 to-white px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-br from-mahindra-red to-red-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Sushil Kumar</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          
          <div className="flex items-center space-x-3">
            <FilterButton 
              label="Vehicle Line" 
              value={activeFilters.vehicleLine}
              onChange={(v) => setActiveFilters({...activeFilters, vehicleLine: v})}
              options={['All', 'XUV Series', 'Scorpio Series', 'Thar', 'Bolero']}
            />
            <FilterButton 
              label="Body Style" 
              value={activeFilters.bodyStyle}
              onChange={(v) => setActiveFilters({...activeFilters, bodyStyle: v})}
              options={['All', 'SUV', 'Compact SUV', 'MUV', 'Off-road']}
            />
            <FilterButton 
              label="Region" 
              value={activeFilters.region}
              onChange={(v) => setActiveFilters({...activeFilters, region: v})}
              options={['India', 'Global', 'ASEAN']}
            />
            <FilterButton 
              label="User Profile" 
              value={activeFilters.userProfile}
              onChange={(v) => setActiveFilters({...activeFilters, userProfile: v})}
              options={['All', 'P5F', 'P50M', 'P95M', 'Senior 65+']}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

interface FilterButtonProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function FilterButton({ label, value, onChange, options }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-mahindra-red/30 hover:shadow-md transition-all group"
      >
        <span className="text-xs text-gray-500 font-medium">{label}:</span>
        <span className="text-sm font-bold text-gray-900">{value}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-100 py-2 z-20">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-all ${
                  value === option ? 'text-white bg-mahindra-red' : 'text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

