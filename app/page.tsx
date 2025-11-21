'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import AICopilot from '@/components/AICopilot';
import CADPreprocessingBot from '@/components/CADPreprocessingBot';
import HomeView from '@/components/views/HomeView';
import VehicleDetailView from '@/components/views/VehicleDetailView';
import ScenarioLabView from '@/components/views/ScenarioLabView';
import ModelPerformanceView from '@/components/views/ModelPerformanceView';
import DataInspectorView from '@/components/views/DataInspectorView';
import CADUploadView from '@/components/views/CADUploadView';

export default function Home() {
  const [activeView, setActiveView] = useState('home');
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    setActiveView('vehicle');
  };

  const handleBackToHome = () => {
    setActiveView('home');
    setSelectedVehicle(null);
  };

  const getHeaderTitle = () => {
    switch (activeView) {
      case 'home':
        return 'Portfolio Overview';
      case 'vehicle':
        return 'Vehicle Detail';
      case 'scenario':
        return 'Scenario Lab';
      case 'performance':
        return 'Model Performance';
      case 'data':
        return 'Data Inspector';
      case 'upload':
        return 'CAD Upload';
      default:
        return 'Portfolio Overview';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation activeView={activeView} onViewChange={setActiveView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getHeaderTitle()} />

        <main className="flex-1 overflow-y-auto">
          {activeView === 'home' && <HomeView onVehicleSelect={handleVehicleSelect} />}
          {activeView === 'vehicle' && selectedVehicle && (
            <VehicleDetailView vehicleId={selectedVehicle} onBack={handleBackToHome} />
          )}
          {activeView === 'scenario' && <ScenarioLabView />}
          {activeView === 'performance' && <ModelPerformanceView />}
          {activeView === 'data' && <DataInspectorView />}
          {activeView === 'upload' && <CADUploadView />}
        </main>
      </div>

      <AICopilot context={activeView} />
      <CADPreprocessingBot />
    </div>
  );
}

