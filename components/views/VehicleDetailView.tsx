'use client';

import { useState } from 'react';
import { ArrowLeft, Info, Box, Layers, Activity, Target, Shield, Zap, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { vehicleModels, vehicleGeometry, featureContributions, getRatingColor } from '@/lib/mock-data';
import type { GeometryKPI } from '@/lib/mock-data';
import { formatNumber } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface VehicleDetailViewProps {
  vehicleId: string;
  onBack?: () => void;
}

export default function VehicleDetailView({ vehicleId, onBack }: VehicleDetailViewProps) {
  const vehicle = vehicleModels.find(v => v.id === vehicleId);
  const [activeProfile, setActiveProfile] = useState<'P5F' | 'P50M' | 'P95M' | 'Senior'>('P95M');

  if (!vehicle) return null;

  const geometry = vehicleGeometry[vehicleId] || vehicleGeometry['xuv700'];
  const contributions = featureContributions[vehicleId] || featureContributions['xuv700'];
  const currentRating = vehicle.ratings[activeProfile];

  const chartData = contributions.map(c => ({
    name: c.feature,
    value: c.impact,
    description: c.description,
  }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      className="max-w-[1600px] mx-auto px-6 py-8 text-gray-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="bg-white shadow-md border border-gray-100 rounded-2xl p-6 mb-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group/btn"
          >
            <div className="p-2 rounded-full bg-gray-100 group-hover/btn:bg-indigo-500 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm tracking-wide">BACK TO PORTFOLIO</span>
          </button>

          <div className="flex items-end justify-between">
            <div>
              <motion.h2
                className="text-4xl font-bold text-gray-900 mb-2 tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {vehicle.name}
              </motion.h2>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gray-100/50 border border-gray-300/50 text-xs font-medium">
                  <Box className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{vehicle.bodyStyle}</span>
                </span>
                <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gray-100/50 border border-gray-300/50 text-xs font-medium">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live Analysis</span>
                </span>
                <span className="text-xs opacity-60">Last model run: Nov 19, 2025 at 09:42</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-gray-900 text-sm font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center space-x-2">
                <Maximize2 className="w-4 h-4" />
                <span>Full Report</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        {/* 1A. Anthropometric Performance Card (4 columns) */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4 bg-white shadow-md border border-gray-100 rounded-2xl p-6 flex flex-col min-h-[420px] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target className="w-32 h-32 text-gray-900" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <span>ErgoScore™ Rating</span>
          </h3>

          {/* Circular Gauge */}
          <div className="flex items-center justify-center flex-1 mb-8 relative">
            <div className="relative w-56 h-56">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full" />

              <svg className="transform -rotate-90 relative z-10 drop-shadow-2xl" viewBox="0 0 200 200">
                {/* Track */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="#1e293b"
                  strokeWidth="12"
                  fill="none"
                  className="opacity-50"
                />
                {/* Progress */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke={getRatingColor(currentRating)}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray="502.4"
                  strokeDashoffset={502.4 - (currentRating / 10) * 502.4}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 502.4 }}
                  animate={{ strokeDashoffset: 502.4 - (currentRating / 10) * 502.4 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <motion.span
                  className="text-6xl font-bold text-gray-900 tracking-tighter"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {formatNumber(currentRating)}
                </motion.span>
                <span className="text-sm text-gray-600 font-medium uppercase tracking-widest mt-1">out of 10</span>
              </div>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="grid grid-cols-4 gap-2 mb-6 bg-gray-800/50 p-1.5 rounded-xl border border-slate-800">
            {(['P5F', 'P50M', 'P95M', 'Senior'] as const).map((profile) => (
              <button
                key={profile}
                onClick={() => setActiveProfile(profile)}
                className={`relative px-2 py-2.5 rounded-lg text-xs font-medium transition-all duration-300 ${activeProfile === profile
                  ? 'text-gray-900 shadow-lg'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                  }`}
              >
                {activeProfile === profile && (
                  <motion.div
                    layoutId="activeProfile"
                    className="absolute inset-0 bg-indigo-600 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center">
                  <span className="mb-0.5">{profile === 'Senior' ? '65+' : profile}</span>
                  <span className={`text-[10px] ${activeProfile === profile ? 'text-indigo-200' : 'text-slate-600'}`}>
                    {formatNumber(vehicle.ratings[profile])}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Insight */}
          <div className="bg-gray-100/50 rounded-lg p-3 border border-gray-300/50">
            <p className="text-xs text-gray-700 leading-relaxed">
              <span className="text-indigo-400 font-bold mr-1">INSIGHT:</span>
              {activeProfile === 'P95M' && "Main penalty from sill height > 560 mm. Door aperture provides compensation."}
              {activeProfile === 'Senior' && "High sill height challenges seniors. Lower by 20-30mm for improvement."}
              {activeProfile === 'P5F' && "Excellent performance across all parameters. Optimal door and seat positioning."}
              {activeProfile === 'P50M' && "Strong overall ratings. All geometric parameters within recommended ranges."}
            </p>
          </div>
        </motion.div>

        {/* 1B. 3D Geometry Visualization Card (8 columns) */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8 bg-white shadow-md border border-gray-100 rounded-2xl p-1 flex flex-col min-h-[420px]">
          <div className="flex-1 relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-[#0B1120] to-slate-900">
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start pointer-events-none">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 drop-shadow-lg">3D Geometry Visualization</h3>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded uppercase tracking-wider backdrop-blur-md">
                    Live Render
                  </span>
                  <span className="px-2 py-0.5 bg-slate-700/40 border border-slate-600/30 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider backdrop-blur-md">
                    OpenCascade 7.6
                  </span>
                </div>
              </div>
            </div>

            {/* 3D Canvas */}
            <div className="absolute inset-0">
              <GeometrySnapshot3D geometry={geometry} compact={true} />
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-5 gap-1 p-1">
            {geometry.slice(0, 5).map((kpi, idx) => {
              const shortName = kpi.name.includes('Door Aperture Width') ? 'Door Width' :
                kpi.name.includes('Door Aperture Height') ? 'Door Height' :
                  kpi.name.includes('Sill Height') ? 'Sill Height' :
                    kpi.name.includes('H-point') ? 'H-Point' :
                      kpi.name.includes('Hip Clearance') ? 'Hip Clear.' : kpi.name;
              return (
                <motion.div
                  key={kpi.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="bg-gray-100/40 hover:bg-gray-100/80 rounded-lg p-3 border border-gray-300/30 transition-colors group cursor-default"
                >
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 group-hover:text-indigo-400 transition-colors">{shortName}</div>
                  <div className="flex items-baseline space-x-1">
                    <div className="text-lg font-bold text-gray-900">{kpi.value}</div>
                    <div className="text-[10px] font-medium text-gray-500">{kpi.unit}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Row 2: Performance Drivers + Numeric KPIs */}
      <div className="grid grid-cols-12 gap-6">
        {/* 2A. Top Performance Drivers (7 columns) */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-7 bg-white shadow-md border border-gray-100 rounded-2xl p-6 relative overflow-hidden group">
          {/* Subtle animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Performance Drivers</span>
              </h3>
              <motion.span
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold rounded-full"
              >
                {activeProfile} Analysis
              </motion.span>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} opacity={0.3} />
                  <XAxis type="number" domain={[-1, 1]} hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={140}
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#334155', opacity: 0.2 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        const data = payload[0].payload;
                        return (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gray-800/95 backdrop-blur-xl p-4 rounded-xl shadow-2xl border border-gray-300"
                          >
                            <p className="font-bold text-gray-900 mb-1">{data.name}</p>
                            <p className="text-xs text-gray-600 mb-3 max-w-[200px]">{data.description}</p>
                            <div className={`text-sm font-bold px-2 py-1 rounded inline-block ${data.value > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                              Impact: {data.value > 0 ? '+' : ''}{formatNumber(data.value)}
                            </div>
                          </motion.div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.value > 0 ? '#10B981' : '#EF4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 rounded-xl bg-gray-100/30 border border-gray-300/30 backdrop-blur-sm"
            >
              <p className="text-xs text-gray-600 leading-relaxed flex items-start space-x-2">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  {activeProfile === 'P95M' && "Negative impact from sill height; door aperture provides partial compensation."}
                  {activeProfile === 'Senior' && "Sill height significantly impacts senior users. Door aperture helps but not fully."}
                  {activeProfile === 'P5F' && "All drivers show positive impact. Optimal geometry for P5F profile."}
                  {activeProfile === 'P50M' && "Balanced performance. Minor improvements possible in sill height."}
                </span>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* 2B. Key Geometry KPIs (5 columns) */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-5 bg-white shadow-md border border-gray-100 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>Key Geometry KPIs</span>
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {geometry.map((kpi, idx) => (
              <motion.div
                key={kpi.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (idx * 0.1) }}
                className="group relative overflow-hidden rounded-xl bg-gray-100/40 border border-gray-300/50 hover:bg-gray-100/60 hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/0 group-hover:via-indigo-500/5 transition-all duration-500" />

                <div className="relative p-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{kpi.name}</div>
                    <div className="text-2xl font-bold text-gray-900 tracking-tight">{kpi.value} <span className="text-sm text-gray-500 font-medium ml-1">{kpi.unit}</span></div>
                  </div>

                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                      <Info className="w-4 h-4 text-gray-600 group-hover:text-indigo-400" />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute right-0 bottom-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 pointer-events-none z-20 w-64">
                      <div className="bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-300 text-xs text-gray-700 leading-relaxed">
                        {kpi.tooltip}
                        <div className="absolute bottom-[-5px] right-3 w-2 h-2 bg-gray-800 border-b border-r border-gray-300 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Enterprise-Grade A 3D Visualization Component
interface GeometrySnapshot3DProps {
  geometry: GeometryKPI[];
  compact?: boolean;
}

function GeometrySnapshot3D({ geometry, compact = false }: GeometrySnapshot3DProps) {
  const [isInteractive, setIsInteractive] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  const getValue = (name: string) => geometry.find((kpi) => kpi.name === name)?.value;
  const doorWidth = getValue('Door Aperture Width');
  const doorHeight = getValue('Door Aperture Height');
  const sillHeight = getValue('Sill Height from Ground');
  const seatHeight = getValue('Seat H-point Height');
  const hipClearance = getValue('Hip Clearance');
  const headClearance = getValue('Head Clearance');

  const gridLines = Array.from({ length: 8 });

  return (
    <div className="relative w-full h-full group/3d">
      {/* Interactive Toggle */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <button
          onClick={() => setIsInteractive(!isInteractive)}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 shadow-lg backdrop-blur-md border ${isInteractive
            ? 'bg-indigo-500 text-gray-900 border-indigo-400 shadow-indigo-500/20'
            : 'bg-gray-800/60 text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
        >
          {isInteractive ? 'Interactive Mode Active' : 'Enable Interactive Mode'}
        </button>
      </div>

      <svg className="w-full h-full" viewBox="0 0 480 320" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Enhanced Gradients */}
          <linearGradient id="floorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#1e293b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.98" />
          </linearGradient>

          <linearGradient id="doorPlane" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="doorPlaneHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="sillEdge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>

          <linearGradient id="seatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="trajectoryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#e879f9" />
          </linearGradient>

          {/* Glow Effects */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Markers */}
          <marker id="arrowZ" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="white" />
          </marker>

          <marker id="arrowBlue" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#60a5fa" />
          </marker>

          {/* Patterns */}
          <pattern id="hatchPattern" patternUnits="userSpaceOnUse" width="4" height="4">
            <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </pattern>
        </defs>

        {/* Enhanced Floor plane with depth */}
        <g className={highlightedElement === 'floor' ? 'opacity-100' : 'opacity-95'}>
          <polygon
            points="100,240 280,185 420,240 230,290"
            fill="url(#floorGradient)"
            stroke="#1e293b"
            strokeWidth="1"
            onMouseEnter={() => isInteractive && setHighlightedElement('floor')}
            onMouseLeave={() => isInteractive && setHighlightedElement(null)}
            className="transition-all duration-300 cursor-pointer"
          />
          <polygon
            points="100,240 280,185 420,240 230,290"
            fill="url(#hatchPattern)"
            opacity="0.5"
          />
        </g>

        {/* Enhanced Floor grid */}
        {gridLines.map((_, index) => {
          const offset = index * 25;
          const opacity = 0.1 - (index * 0.01);
          return (
            <line
              key={`grid-x-${index}`}
              x1={110 + offset}
              y1={236 - offset * 0.25}
              x2={300 + offset}
              y2={265 - offset * 0.15}
              stroke={`rgba(255,255,255,${opacity})`}
              strokeWidth={1}
              strokeLinecap="round"
            />
          );
        })}
        {gridLines.map((_, index) => {
          const offset = index * 40;
          const opacity = 0.1 - (index * 0.01);
          return (
            <line
              key={`grid-y-${index}`}
              x1={120 + offset}
              y1={235}
              x2={200 + offset}
              y2={290}
              stroke={`rgba(255,255,255,${opacity})`}
              strokeWidth={1}
              strokeLinecap="round"
            />
          );
        })}

        {/* Enhanced Coordinate System */}
        <g filter={isInteractive ? "url(#glow)" : ""}>
          {/* Z-axis (Height) */}
          <line
            x1="100" y1="240" x2="100" y2="90"
            stroke="#475569"
            strokeWidth="2"
            markerEnd="url(#arrowZ)"
            strokeLinecap="round"
          />
          <text x="70" y="85" fill="white" fontSize="12" fontWeight="700">Z</text>
          <text x="50" y="105" fill="#64748b" fontSize="9" fontWeight="600">Height</text>

          {/* Y-axis (Depth) */}
          <line
            x1="100" y1="240" x2="230" y2="280"
            stroke="#475569"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text x="175" y="285" fill="white" fontSize="12" fontWeight="700">Y</text>
          <text x="155" y="298" fill="#64748b" fontSize="9" fontWeight="600">Depth</text>

          {/* X-axis (Lateral) */}
          <line
            x1="100" y1="240" x2="280" y2="190"
            stroke="#475569"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text x="290" y="190" fill="white" fontSize="12" fontWeight="700">X</text>
          <text x="270" y="205" fill="#64748b" fontSize="9" fontWeight="600">Lateral</text>
        </g>

        {/* Door aperture plane - Interactive */}
        <g
          className={`transition-all duration-300 ${highlightedElement === 'door' ? 'opacity-100' : 'opacity-80'}`}
          onMouseEnter={() => isInteractive && setHighlightedElement('door')}
          onMouseLeave={() => isInteractive && setHighlightedElement(null)}
        >
          <polygon
            points="230,100 380,60 420,160 275,200"
            fill={highlightedElement === 'door' ? "url(#doorPlaneHighlight)" : "url(#doorPlane)"}
            stroke="#3b82f6"
            strokeOpacity={highlightedElement === 'door' ? 1 : 0.6}
            strokeWidth={highlightedElement === 'door' ? 2 : 1.5}
            filter={highlightedElement === 'door' ? "url(#strongGlow)" : ""}
            className={isInteractive ? "cursor-pointer" : ""}
          />

          {/* Door frame edges */}
          <polyline
            points="230,100 235,240 100,240"
            stroke="#475569"
            strokeWidth="2"
            strokeLinecap="round"
            fill="transparent"
            opacity="0.6"
          />
          <polyline
            points="380,60 390,220 235,240"
            stroke="#475569"
            strokeWidth="2"
            strokeLinecap="round"
            fill="transparent"
            opacity="0.6"
          />

          {/* Door aperture annotation with edge values */}
          {highlightedElement === 'door' && (
            <g>
              <rect x="285" y="40" width="160" height="50" rx="10" fill="#1e40af" opacity="0.95" stroke="#3b82f6" strokeWidth="2" />
              <text x="365" y="58" fill="white" fontSize="12" fontWeight="700" textAnchor="middle">Door Aperture</text>
              <text x="365" y="74" fill="#93c5fd" fontSize="12" fontWeight="700" textAnchor="middle">
                W: {doorWidth || '--'} × H: {doorHeight || '--'} mm
              </text>
              <text x="365" y="88" fill="#bfdbfe" fontSize="10" fontWeight="600" textAnchor="middle">3D Clear Opening</text>
            </g>
          )}
        </g>

        {/* Enhanced Sill edge - Critical Component with Edge Value */}
        <g
          className={`transition-all duration-300 ${highlightedElement === 'sill' ? 'opacity-100' : 'opacity-90'}`}
          onMouseEnter={() => isInteractive && setHighlightedElement('sill')}
          onMouseLeave={() => isInteractive && setHighlightedElement(null)}
        >
          <line
            x1="235" y1="240" x2="390" y2="215"
            stroke="url(#sillEdge)"
            strokeWidth={highlightedElement === 'sill' ? 8 : 6}
            strokeLinecap="round"
            filter={highlightedElement === 'sill' ? "url(#strongGlow)" : "url(#glow)"}
            className={isInteractive ? "cursor-pointer" : ""}
          />

          {/* Sill measurement indicator */}
          <line x1="235" y1="240" x2="235" y2="270" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
          <line x1="100" y1="270" x2="235" y2="270" stroke="#ef4444" strokeWidth="1" markerEnd="url(#arrowBlue)" opacity="0.6" />

          {highlightedElement === 'sill' ? (
            <g>
              <rect x="250" y="275" width="140" height="40" rx="9" fill="#991b1b" opacity="0.95" stroke="#dc2626" strokeWidth="2" />
              <text x="320" y="293" fill="white" fontSize="11" fontWeight="700" textAnchor="middle">Critical Sill Edge</text>
              <text x="320" y="308" fill="#fca5a5" fontSize="13" fontWeight="700" textAnchor="middle">
                {sillHeight || '--'} mm
              </text>
            </g>
          ) : (
            highlightedElement !== 'sill' && (
              <text x="320" y="265" fill="#fca5a5" fontSize="10" fontWeight={700} textAnchor="middle" opacity="0.7">
                Sill: {sillHeight || '--'} mm
              </text>
            )
          )}
        </g>

        {/* Enhanced Seat Assembly with H-Point */}
        <g
          className={`transition-all duration-300 ${highlightedElement === 'seat' ? 'opacity-100' : 'opacity-80'}`}
          onMouseEnter={() => isInteractive && setHighlightedElement('seat')}
          onMouseLeave={() => isInteractive && setHighlightedElement(null)}
        >
          {/* Seat cushion */}
          <polygon
            points="160,200 245,175 285,205 200,235"
            fill="url(#seatGradient)"
            stroke="#065f46"
            strokeWidth={highlightedElement === 'seat' ? 2 : 1.5}
            filter={highlightedElement === 'seat' ? "url(#glow)" : ""}
            className={isInteractive ? "cursor-pointer" : ""}
          />

          {/* Seat back */}
          <polygon
            points="160,145 185,130 220,140 195,155"
            fill="url(#seatGradient)"
            stroke="#065f46"
            strokeWidth={highlightedElement === 'seat' ? 2 : 1.5}
            opacity="0.8"
          />

          {/* Seat back support */}
          <line
            x1="195" y1="235" x2="195" y2="155"
            stroke="#047857"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* H-point indicator */}
          <circle
            cx="195"
            cy="200"
            r={highlightedElement === 'seat' ? 6 : 5}
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="2"
            filter="url(#strongGlow)"
          />

          {/* H-point measurement line */}
          <line
            x1="195" y1="200" x2="195" y2="95"
            stroke="#22c55e"
            strokeWidth="1"
            strokeDasharray="6 3"
            markerEnd="url(#arrowZ)"
            opacity="0.6"
          />

          {highlightedElement === 'seat' ? (
            <g>
              <rect x="80" y="45" width="160" height="42" rx="10" fill="#047857" opacity="0.95" stroke="#10b981" strokeWidth="2" />
              <text x="160" y="64" fill="white" fontSize="11" fontWeight="700" textAnchor="middle">SAE J1100 H-Point</text>
              <text x="160" y="80" fill="#6ee7b7" fontSize="13" fontWeight="700" textAnchor="middle">
                {seatHeight || '--'} mm
              </text>
            </g>
          ) : (
            highlightedElement !== 'seat' && (
              <text x="160" y="60" fill="#22c55e" fontSize="10" fontWeight={700} textAnchor="middle" opacity="0.7">
                H-Pt: {seatHeight || '--'} mm
              </text>
            )
          )}
        </g>

        {/* Enhanced Occupant Trajectory with Animated Path */}
        <g
          className={`transition-all duration-300 ${highlightedElement === 'trajectory' ? 'opacity-100' : 'opacity-70'}`}
          onMouseEnter={() => isInteractive && setHighlightedElement('trajectory')}
          onMouseLeave={() => isInteractive && setHighlightedElement(null)}
        >
          {/* Animated Ingress/egress path */}
          <path
            d="M 170 265 Q 280 230 360 150"
            stroke="url(#trajectoryGradient)"
            strokeWidth={highlightedElement === 'trajectory' ? 4 : 3}
            strokeDasharray="10 5"
            fill="none"
            strokeLinecap="round"
            filter={highlightedElement === 'trajectory' ? "url(#strongGlow)" : "url(#glow)"}
            className={isInteractive ? "cursor-pointer" : ""}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="30"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>

          {/* Clearance indicators with edge values */}
          {highlightedElement === 'trajectory' && (
            <>
              {/* Hip clearance zone */}
              <circle cx="280" cy="210" r="30" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
              <g>
                <rect x="220" y="250" width="125" height="32" rx="8" fill="#7c3aed" opacity="0.95" stroke="#a855f7" strokeWidth="2" />
                <text x="282" y="270" fill="white" fontSize="11" fontWeight="700" textAnchor="middle">
                  Hip: {hipClearance || '--'} mm
                </text>
              </g>

              {/* Head clearance zone */}
              <circle cx="340" cy="135" r="26" fill="none" stroke="#e879f9" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
              <g>
                <rect x="295" y="90" width="125" height="32" rx="8" fill="#a855f7" opacity="0.95" stroke="#e879f9" strokeWidth="2" />
                <text x="357" y="110" fill="white" fontSize="11" fontWeight="700" textAnchor="middle">
                  Head: {headClearance || '--'} mm
                </text>
              </g>
            </>
          )}

          {highlightedElement === 'trajectory' ? (
            <g>
              <rect x="180" y="160" width="170" height="34" rx="10" fill="#7c3aed" opacity="0.95" stroke="#a855f7" strokeWidth="2" />
              <text x="265" y="180" fill="white" fontSize="12" fontWeight="700" textAnchor="middle">
                3D Anthropometric Path
              </text>
            </g>
          ) : (
            highlightedElement !== 'trajectory' && (
              <text x="265" y="170" fill="#c084fc" fontSize="10" fontWeight={700} textAnchor="middle" opacity="0.7">
                3D Hip/Head Path
              </text>
            )
          )}
        </g>

        {/* Enhanced Human Manikin */}
        <g className={`transition-all duration-300 ${highlightedElement === 'trajectory' ? 'opacity-100' : 'opacity-60'}`}>
          <ellipse
            cx="325"
            cy="165"
            rx="22"
            ry="32"
            fill="#a78bfa"
            stroke="#7c3aed"
            strokeWidth="2"
            filter="url(#glow)"
            opacity="0.5"
          />
          <circle
            cx="325"
            cy="125"
            r="15"
            fill="#c4b5fd"
            stroke="#7c3aed"
            strokeWidth="2"
            filter="url(#glow)"
            opacity="0.5"
          />
          <line x1="311" y1="175" x2="290" y2="200" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <line x1="339" y1="175" x2="360" y2="200" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* Legend Panel */}
        {!highlightedElement && (
          <g opacity="0.9">
            <rect x="15" y="15" width="170" height="115" rx="12" fill="#0f172a" opacity="0.8" stroke="#334155" strokeWidth="1" />
            <text x="100" y="38" fill="white" fontSize="12" fontWeight="700" textAnchor="middle">3D CAD Components</text>
            <circle cx="28" cy="58" r="4" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1" />
            <text x="44" y="62" fill="white" fontSize="10" fontWeight="600">Door Aperture</text>
            <circle cx="28" cy="78" r="4" fill="#ef4444" stroke="#dc2626" strokeWidth="1" />
            <text x="44" y="82" fill="white" fontSize="10" fontWeight="600">Sill Edge (Critical)</text>
            <circle cx="28" cy="98" r="4" fill="#10b981" stroke="#059669" strokeWidth="1" />
            <text x="44" y="102" fill="white" fontSize="10" fontWeight="600">Seat H-Point</text>
            <circle cx="28" cy="118" r="4" fill="#a855f7" stroke="#7c3aed" strokeWidth="1" />
            <text x="44" y="122" fill="white" fontSize="10" fontWeight="600">Anthro Path</text>
          </g>
        )}

        {/* Technical Metadata */}
        <g opacity="0.6">
          <text x="15" y="310" fill="#64748b" fontSize="9" fontWeight="600">
            Vehicle Reference Frame • SAE J1100 Standard • OpenCascade 7.6
          </text>
        </g>

        {/* Interactive hint - Bottom-right corner */}
        {isInteractive && !highlightedElement && (
          <g opacity="0.9">
            <rect x="300" y="280" width="170" height="28" rx="14" fill="#4f46e5" opacity="0.9" stroke="#6366f1" strokeWidth="1" />
            <text x="385" y="298" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">
              👆 Hover for edge values
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
