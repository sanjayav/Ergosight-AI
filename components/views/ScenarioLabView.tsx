'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Sliders, TrendingUp, ArrowRight, RefreshCw, Save, Zap, Info, ArrowUpRight, ArrowDownRight, AlertTriangle, CheckCircle2, Lightbulb, BarChart3, Ruler, Maximize2, Armchair, Target, Activity, ArrowUpDown, ArrowLeftRight, RotateCw, Box, Layers } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getRatingColor } from '@/lib/mock-data';
import { formatNumber, formatTrend } from '@/lib/utils';

interface DesignParameters {
  sillHeight: number;
  sillWidth: number;
  doorWidth: number;
  doorHeight: number;
  seatHeight: number;
  seatSteeringDist: number;
  hipClearance: number;
  headClearance: number;
  steeringClearance: number;
  ingressSweep: number;
}

const DEFAULT_PARAMS: DesignParameters = {
  sillHeight: 580,
  sillWidth: 170,
  doorWidth: 700,
  doorHeight: 1260,
  seatHeight: 610,
  seatSteeringDist: 460,
  hipClearance: 70,
  headClearance: 65,
  steeringClearance: 45,
  ingressSweep: 62,
};

type ParameterKey = keyof DesignParameters;

interface ParameterConfig {
  key: ParameterKey;
  label: string;
  min: number;
  max: number;
  unit: string;
  tooltip: string;
  weight: number;
  insight: string;
  IconComponent: LucideIcon;
}

const PARAMETER_CONFIGS: ParameterConfig[] = [
  {
    key: 'sillHeight',
    label: 'Sill Height (Edge Z)',
    min: 520,
    max: 620,
    unit: 'mm',
    tooltip: 'Height from ground plane to sill edge. Lower values reduce step-over.',
    weight: -0.02,
    insight: 'Lower sill shortens the step-over to enter the cabin.',
    IconComponent: Ruler,
  },
  {
    key: 'sillWidth',
    label: 'Sill Width (Edge Span)',
    min: 140,
    max: 210,
    unit: 'mm',
    tooltip: '3D distance between inner and outer sill edges.',
    weight: 0.012,
    insight: 'Wider sill surface supports better foot placement.',
    IconComponent: ArrowLeftRight,
  },
  {
    key: 'doorWidth',
    label: 'Door Aperture Width',
    min: 650,
    max: 780,
    unit: 'mm',
    tooltip: '3D width measured between leading/trailing door edges at H-point height.',
    weight: 0.015,
    insight: 'Wider aperture gives more lateral clearance.',
    IconComponent: Maximize2,
  },
  {
    key: 'doorHeight',
    label: 'Door Aperture Height',
    min: 1180,
    max: 1350,
    unit: 'mm',
    tooltip: 'Height between sill edge and roof rail edge along aperture.',
    weight: 0.01,
    insight: 'Taller door cut-out improves headroom during entry.',
    IconComponent: ArrowUpDown,
  },
  {
    key: 'seatHeight',
    label: 'Seat H-Point Height',
    min: 580,
    max: 650,
    unit: 'mm',
    tooltip: 'SAE J1100 H-point height above ground.',
    weight: 0.004,
    insight: 'Higher H-point reduces squat effort.',
    IconComponent: Armchair,
  },
  {
    key: 'seatSteeringDist',
    label: 'Seat–Steering Distance',
    min: 430,
    max: 520,
    unit: 'mm',
    tooltip: '3D distance between seat H-point and steering rim center.',
    weight: 0.006,
    insight: 'More space between seat and rim eases knee passage.',
    IconComponent: Target,
  },
  {
    key: 'hipClearance',
    label: 'Hip Path Clearance',
    min: 40,
    max: 120,
    unit: 'mm',
    tooltip: 'Minimum 3D clearance between hip trajectory and door frame edge.',
    weight: 0.02,
    insight: 'Clear hip path avoids side impacts for larger occupants.',
    IconComponent: Activity,
  },
  {
    key: 'headClearance',
    label: 'Head Clearance @ Header',
    min: 30,
    max: 110,
    unit: 'mm',
    tooltip: 'Minimum 3D clearance between head trajectory and roof header edge.',
    weight: 0.018,
    insight: 'More head margin prevents roof header contact.',
    IconComponent: ArrowUpRight,
  },
  {
    key: 'steeringClearance',
    label: 'Steering Rim Clearance',
    min: 20,
    max: 90,
    unit: 'mm',
    tooltip: 'Gap between thigh envelope and steering rim edge.',
    weight: 0.015,
    insight: 'Extra rim clearance avoids knee interference.',
    IconComponent: Box,
  },
  {
    key: 'ingressSweep',
    label: 'Ingress Sweep Angle',
    min: 45,
    max: 75,
    unit: 'deg',
    tooltip: 'Angular sweep of 3D ingress path from hip pivot.',
    weight: -0.018,
    insight: 'Smaller sweep means less body rotation required.',
    IconComponent: RotateCw,
  },
];

interface AnalysisStep {
  id: string;
  label: string;
  description: string;
  duration: number;
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress: number;
}

interface AnalysisMetrics {
  cadProcessingTime: number;
  geometryEntities: number;
  clearanceChecks: number;
  aiConfidence: number;
  parametersEvaluated: number;
}

export default function ScenarioLabView() {
  const [currentParams, setCurrentParams] = useState<DesignParameters>(DEFAULT_PARAMS);
  const [proposedParams, setProposedParams] = useState<DesignParameters>(DEFAULT_PARAMS);
  const [currentRating, setCurrentRating] = useState(7.2);
  const [selectedProfile, setSelectedProfile] = useState('P95M');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisMetrics, setAnalysisMetrics] = useState<AnalysisMetrics | null>(null);
  
  const handleParamChange = useCallback((key: ParameterKey, value: number) => {
    setProposedParams((prev) => ({ ...prev, [key]: value }));
    setAnalysisComplete(false);
    setShowResults(false);
  }, []);

  const handleRunAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setShowResults(false);
    setCurrentStep(0);
    
    // Define analysis pipeline steps
    const steps: AnalysisStep[] = [
      {
        id: 'cad-load',
        label: 'Loading 3D CAD Geometry',
        description: 'Importing .stp surfaces, edges & B-rep topology',
        duration: 800,
        status: 'pending',
        progress: 0,
      },
      {
        id: 'geometry-process',
        label: 'Processing 3D Geometry',
        description: 'Normalizing vehicle frame, extracting semantic regions',
        duration: 900,
        status: 'pending',
        progress: 0,
      },
      {
        id: 'clearance-compute',
        label: 'Computing 3D Clearances',
        description: 'Calculating hip/head paths, edge distances & KPIs',
        duration: 1000,
        status: 'pending',
        progress: 0,
      },
      {
        id: 'ai-inference',
        label: 'Running AI Model Inference',
        description: 'Gradient boosted model with 3D geometric features',
        duration: 700,
        status: 'pending',
        progress: 0,
      },
      {
        id: 'validation',
        label: 'Validating Results',
        description: 'Cross-checking constraints & generating insights',
        duration: 500,
        status: 'pending',
        progress: 0,
      },
    ];
    
    setAnalysisSteps(steps);
    
    // Execute each step with progress simulation
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      
      // Update step status to processing
      setAnalysisSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: 'processing' as const } : step
      ));
      
      // Simulate progress for current step
      const progressInterval = setInterval(() => {
        setAnalysisSteps(prev => prev.map((step, idx) => {
          if (idx === i && step.progress < 100) {
            return { ...step, progress: Math.min(step.progress + 10, 100) };
          }
          return step;
        }));
      }, steps[i].duration / 10);
      
      // Wait for step to complete
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      clearInterval(progressInterval);
      
      // Mark step as complete
      setAnalysisSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: 'complete' as const, progress: 100 } : step
      ));
    }
    
    // Generate mock metrics
    const metrics: AnalysisMetrics = {
      cadProcessingTime: steps.reduce((sum, step) => sum + step.duration, 0),
      geometryEntities: 1247 + Math.floor(Math.random() * 200),
      clearanceChecks: 43 + Math.floor(Math.random() * 10),
      aiConfidence: 0.92 + Math.random() * 0.06,
      parametersEvaluated: PARAMETER_CONFIGS.length,
    };
    
    setAnalysisMetrics(metrics);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    setShowResults(true);
  }, []);

  // Memoize proposed rating calculation
  const proposedRating = useMemo(() => {
    let rating = currentRating;

    PARAMETER_CONFIGS.forEach((config) => {
      const base = currentParams[config.key];
      const proposed = proposedParams[config.key];
      const delta = proposed - base;
      rating += delta * config.weight;
    });

    const profileBias = selectedProfile === 'Senior' ? -0.2 : selectedProfile === 'P5F' ? 0.1 : 0;
    rating += profileBias;

    return Math.max(1, Math.min(10, rating));
  }, [proposedParams, currentParams, currentRating, selectedProfile]);

  const delta = proposedRating - currentRating;
  
  // Memoize insights calculation
  const insights = useMemo(() => {
    return PARAMETER_CONFIGS.map((config) => {
      const paramDelta = proposedParams[config.key] - currentParams[config.key];
      if (paramDelta === 0) return null;
      const impact = paramDelta * config.weight;
      if (impact === 0) return null;
      return {
        label: config.label,
        change: `${formatTrend(paramDelta)} ${config.unit}`,
        impact: formatTrend(impact),
        description: config.insight,
      };
    })
      .filter(Boolean)
      .sort((a, b) => Math.abs(parseFloat(b!.impact)) - Math.abs(parseFloat(a!.impact)))
      .slice(0, 4) as { label: string; change: string; impact: string; description: string }[];
  }, [proposedParams, currentParams]);

  const handleSaveScenario = useCallback(() => {
    // Mock save functionality
    const scenarioData = {
      name: `Scenario_${new Date().toISOString().split('T')[0]}`,
      profile: selectedProfile,
      parameters: proposedParams,
      rating: proposedRating,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Saving scenario:', scenarioData);
    alert(`Scenario saved successfully!\nRating: ${formatNumber(proposedRating)}\nProfile: ${selectedProfile}`);
  }, [selectedProfile, proposedParams, proposedRating]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl shadow-2xl p-8 border border-gray-200 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-mahindra-red/5 to-purple-500/5 rounded-full blur-3xl -z-0" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 gradient-red rounded-2xl flex items-center justify-center shadow-lg">
                <Sliders className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Design Scenario Lab
                </h2>
                <p className="text-gray-600 mt-1 font-medium">
                  Adjust vehicle parameters and see real-time AI predictions
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleSaveScenario}
                className="flex items-center space-x-2 px-5 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:border-mahindra-red/30 hover:shadow-lg transition-all"
              >
                <Save className="w-5 h-5" />
                <span>Save Scenario</span>
              </button>
              <button 
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className={`flex items-center space-x-2 px-5 py-3 gradient-red text-white rounded-xl font-semibold hover:shadow-xl transition-all ${
                  isAnalyzing ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                <Zap className="w-5 h-5" />
                <span>Run Analysis</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 mb-6">
            {[
              { label: '3D CAD Surfaces', Icon: Layers },
              { label: 'Critical Edges', Icon: Box },
              { label: 'Anthro Paths', Icon: Activity },
              { label: 'True Clearances', Icon: Target },
            ].map((chip) => (
              <span key={chip.label} className="flex items-center space-x-2 px-4 py-2 bg-white/70 border border-gray-200 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
                <chip.Icon className="w-3.5 h-3.5 text-mahindra-red" />
                <span>{chip.label}</span>
              </span>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-gray-600">Current Rating</span>
              </div>
              <div className="text-3xl font-bold" style={{ color: getRatingColor(currentRating) }}>
                {formatNumber(currentRating)}
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs font-semibold text-gray-600">Proposed Rating</span>
              </div>
              <div className="text-3xl font-bold transition-colors duration-300" style={{ color: getRatingColor(proposedRating) }}>
                {formatNumber(proposedRating)}
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                {delta >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span className="text-xs font-semibold text-gray-600">Delta</span>
              </div>
              <div className={`text-3xl font-bold transition-colors duration-300 ${delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {delta >= 0 ? '+' : ''}{formatNumber(delta)}
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-gray-600">Profile</span>
              </div>
              <select
                value={selectedProfile}
                onChange={(e) => setSelectedProfile(e.target.value)}
                className="text-lg font-bold text-gray-900 bg-transparent border-none outline-none cursor-pointer w-full"
              >
                <option value="P5F">P5 Female</option>
                <option value="P50M">P50 Male</option>
                <option value="P95M">P95 Male</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Progress - Enterprise Grade */}
      {isAnalyzing && (
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl shadow-2xl p-8 border-2 border-blue-400">
          <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 gradient-red rounded-2xl flex items-center justify-center shadow-lg">
                  <RefreshCw className="w-8 h-8 text-white animate-spin" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">3D CAD Analysis in Progress</h3>
                  <p className="text-sm text-gray-600 font-medium mt-1">
                    Step {currentStep + 1} of {analysisSteps.length} • Processing full 3D geometry
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold mb-1">Overall Progress</p>
                <p className="text-3xl font-bold text-blue-600">
                  {Math.round(((currentStep + 1) / analysisSteps.length) * 100)}%
                </p>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="h-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / analysisSteps.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
            </div>

            {/* Pipeline Steps */}
            <div className="space-y-3">
              {analysisSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                    step.status === 'complete'
                      ? 'bg-green-50 border-green-300 shadow-md'
                      : step.status === 'processing'
                      ? 'bg-blue-50 border-blue-400 shadow-lg scale-[1.02]'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          step.status === 'complete'
                            ? 'bg-green-500 shadow-lg'
                            : step.status === 'processing'
                            ? 'bg-blue-500 shadow-lg animate-pulse'
                            : 'bg-gray-200'
                        }`}
                      >
                        {step.status === 'complete' ? (
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        ) : step.status === 'processing' ? (
                          <RefreshCw className="w-5 h-5 text-white animate-spin" />
                        ) : (
                          <span className="text-sm font-bold text-gray-500">{idx + 1}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{step.label}</h4>
                        <p className="text-xs text-gray-600 font-medium mt-0.5">{step.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {step.status === 'complete' ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                          COMPLETE
                        </span>
                      ) : step.status === 'processing' ? (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                          {step.progress}%
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                          QUEUED
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Step Progress Bar */}
                  {step.status === 'processing' && (
                    <div className="relative w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-200"
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Technical Info */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Box className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-600">CAD Engine</span>
                </div>
                <p className="text-sm font-bold text-gray-900">OpenCascade</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-semibold text-gray-600">AI Model</span>
                </div>
                <p className="text-sm font-bold text-gray-900">XGBoost v2.1</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-semibold text-gray-600">Parameters</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{PARAMETER_CONFIGS.length} Features</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Complete - Enterprise Results Dashboard */}
      {analysisComplete && showResults && analysisMetrics && (
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl shadow-2xl p-8 border-2 border-green-400">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-green-200">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <span>Analysis Complete</span>
                  <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">SUCCESS</span>
                </h3>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  Full 3D CAD pipeline executed • {analysisMetrics.geometryEntities.toLocaleString()} entities processed
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-600 font-semibold mb-1">AI-Predicted Rating</p>
                <div className="flex items-center space-x-3">
                  <p className="text-5xl font-bold" style={{ color: getRatingColor(proposedRating) }}>
                    {formatNumber(proposedRating)}
                  </p>
                  <span className="text-2xl text-gray-400">/10</span>
                </div>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  {(analysisMetrics.aiConfidence * 100).toFixed(1)}% confidence
                </p>
          </div>
          {delta !== 0 && (
                <div className="flex flex-col items-center">
                  <p className="text-xs text-gray-600 font-semibold mb-2">Delta</p>
                  <div className={`px-5 py-3 rounded-xl font-bold text-2xl shadow-lg ${
                    delta > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {formatTrend(delta)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-green-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <RefreshCw className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-gray-600">Processing Time</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{(analysisMetrics.cadProcessingTime / 1000).toFixed(2)}s</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Full pipeline</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-green-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Box className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-gray-600">Geometry Entities</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{analysisMetrics.geometryEntities.toLocaleString()}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Faces, edges, vertices</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-green-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-semibold text-gray-600">Clearance Checks</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{analysisMetrics.clearanceChecks}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">3D path evaluations</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-green-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-gray-600">Parameters</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{analysisMetrics.parametersEvaluated}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">3D geometric KPIs</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-green-200 shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span className="text-xs font-semibold text-gray-600">AI Confidence</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{(analysisMetrics.aiConfidence * 100).toFixed(1)}%</p>
              <p className="text-xs text-gray-500 font-medium mt-1">Model certainty</p>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Pipeline Status</h4>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">All {analysisSteps.length} stages completed successfully</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-xs font-semibold">
                <span className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span>CAD Engine: OpenCascade 7.6</span>
                </span>
                <span className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <span>AI Model: XGBoost v2.1.0</span>
                </span>
                <span className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-800 rounded-lg">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  <span>Profile: {selectedProfile}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Design Comparison */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DesignCard 
          title="Current Design (XUV700)" 
          rating={currentRating} 
          params={currentParams} 
          isCurrent={true}
        />
        <DesignCard
          title="Proposed Design"
          rating={proposedRating}
          params={proposedParams}
          delta={delta}
          isAnalyzed={analysisComplete}
        />
            </div>

      {/* Parameter Controls */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 gradient-red rounded-xl flex items-center justify-center">
            <Sliders className="w-5 h-5 text-white" />
            </div>
          <h3 className="text-2xl font-bold text-gray-900">3D Design Parameters</h3>
          </div>
          
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PARAMETER_CONFIGS.map((config) => (
            <ParameterSlider
              key={config.key}
              label={config.label}
              value={proposedParams[config.key]}
              onChange={(value) => handleParamChange(config.key, value)}
              min={config.min}
              max={config.max}
              unit={config.unit}
              tooltip={config.tooltip}
              IconComponent={config.IconComponent}
            />
          ))}
                </div>
              </div>

      {/* AI Insights & Optimization */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delta Insights</h3>
            </div>
            
              {insights.length > 0 ? (
            <div className="space-y-4">
                  {insights.map((insight, idx) => (
                <div 
                      key={idx}
                  className={`p-5 rounded-xl border-2 shadow-lg transition-all duration-200 ${
                        insight.impact.startsWith('+') 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300' 
                          : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                          {insight.impact.startsWith('+') ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          )}
                        <span className="text-sm font-bold text-gray-900">{insight.label}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-600 pl-7">{insight.change}</span>
                        </div>
                        <span className={`text-2xl font-bold px-3 py-1 rounded-lg ${
                          insight.impact.startsWith('+') 
                            ? 'text-green-700 bg-green-100' 
                            : 'text-red-700 bg-red-100'
                        }`}>
                          {insight.impact}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium pl-7">{insight.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
                  <Info className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">Adjust parameters to see impact analysis</p>
            </div>
              )}
          </div>

          <div className="relative bg-gradient-to-br from-mahindra-red via-red-600 to-red-700 text-white rounded-2xl shadow-2xl p-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-lg">AI Optimization Tip</h4>
              </div>
            {analysisComplete && insights.length > 0 ? (
              <>
                <p className="text-sm opacity-95 leading-relaxed">
                  Based on 3D CAD analysis, the top improvements are: {insights[0].label} ({insights[0].change}) and {insights.length > 1 ? `${insights[1].label} (${insights[1].change})` : 'door aperture adjustments'}. 
                  Combined impact: <strong>{formatTrend(delta)}</strong> rating points.
                </p>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs opacity-75">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span>Optimized for {selectedProfile} profile</span>
                    </div>
                    <div className="text-xs opacity-75 font-semibold">
                      {PARAMETER_CONFIGS.length} 3D parameters evaluated
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
              <p className="text-sm opacity-95 leading-relaxed">
                  Reducing sill height by 25mm and increasing door width by 30mm provides the best rating improvement with minimal design impact. Click "Run Analysis" to get AI-powered recommendations.
              </p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex items-center space-x-2 text-xs opacity-75">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>Optimized for {selectedProfile} profile</span>
                </div>
              </div>
              </>
            )}
            </div>
          </div>
        </div>
    </div>
  );
}

interface DesignCardProps {
  title: string;
  rating: number;
  params: DesignParameters;
  isCurrent?: boolean;
  delta?: number;
  isAnalyzed?: boolean;
}

function DesignCard({ title, rating, params, isCurrent, delta, isAnalyzed }: DesignCardProps) {
  return (
    <div className={`relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border-2 transition-all duration-300 hover:shadow-2xl ${
        !isCurrent ? 'border-mahindra-red shadow-mahindra-red/20' : 'border-gray-200'
    }`}>
      {!isCurrent && (
        <div className="absolute -top-3 -right-3 px-4 py-1 gradient-red text-white text-xs font-bold rounded-full shadow-lg">
          PROPOSED
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        {isCurrent ? (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
            BASELINE
          </span>
        ) : isAnalyzed ? (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>ANALYZED</span>
          </span>
        ) : null}
      </div>
      
      <div className="mb-8">
        <div className="flex items-baseline space-x-3 mb-4">
          <span className="text-6xl font-bold transition-all duration-300" style={{ color: getRatingColor(rating) }}>
            {formatNumber(rating)}
          </span>
          <div>
            <span className="text-gray-400 text-xl">/ 10</span>
            {delta !== undefined && delta !== 0 && (
              <div className="flex items-center space-x-1 mt-1">
                {delta > 0 ? (
                  <ArrowUpRight className="w-5 h-5 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-2xl font-bold ${delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatTrend(delta)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className="h-4 rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${(rating / 10) * 100}%`,
              backgroundColor: getRatingColor(rating)
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PARAMETER_CONFIGS.map((config) => (
          <div
            key={`${title}-${config.key}`}
            className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:border-mahindra-red/30 transition-all duration-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <config.IconComponent className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-xs font-semibold text-gray-700 leading-tight">{config.label}</span>
            </div>
            <span className="text-base font-bold text-gray-900">
              {params[config.key]} <span className="text-[10px] text-gray-500">{config.unit}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ParameterSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit: string;
  tooltip: string;
  IconComponent?: LucideIcon;
}

function ParameterSlider({ label, value, onChange, min, max, unit, tooltip, IconComponent }: ParameterSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="p-5 bg-white rounded-2xl border-2 border-gray-200 hover:border-mahindra-red/30 transition-all duration-200 shadow-sm hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {IconComponent && (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border border-blue-100">
              <IconComponent className="w-5 h-5 text-blue-600" />
            </div>
          )}
          <label className="text-base font-bold text-gray-900">{label}</label>
        </div>
        <div className="px-4 py-2 gradient-red text-white rounded-xl font-bold text-lg shadow-lg transition-all duration-200">
          {value} <span className="text-sm opacity-90">{unit}</span>
        </div>
      </div>
      
      <div className="relative mb-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider relative z-10 transition-all duration-100"
          style={{
            background: `linear-gradient(to right, #E31837 0%, #E31837 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`
          }}
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-gray-500">{min} {unit}</span>
          <div className="w-16 h-px bg-gray-300" />
          <span className="text-xs font-semibold text-gray-500">{max} {unit}</span>
        </div>
        <div className="group relative">
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          <div className="absolute bottom-6 right-0 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-2xl z-20">
            {tooltip}
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
}
