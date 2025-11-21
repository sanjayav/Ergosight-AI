'use client';

import { Award, Target, Database, RefreshCw, Box, Layers, CheckCircle2, TrendingUp, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { modelPerformance } from '@/lib/mock-data';
import { formatNumber } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, Cell } from 'recharts';

export default function ModelPerformanceView() {
  const { accuracy, errorDistribution, scatterData, coverage } = modelPerformance;

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 rounded-2xl shadow-2xl p-8 overflow-hidden border border-indigo-800/50">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                <Target className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Model Performance & Validation</h2>
            </div>
            <p className="text-indigo-200 text-lg max-w-2xl">
              Real-time validation metrics for our <span className="text-white font-semibold">XGBoost v2.3.1</span> ensemble.
              Powered by 3D geometric feature extraction.
            </p>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <div className="text-right">
              <div className="text-xs text-indigo-300 font-medium uppercase tracking-wider mb-1">Model Status</div>
              <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-400 font-bold text-sm">Production Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Processing Info - Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-100 p-1 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-slate-50 to-white p-6 rounded-xl">
          <div className="flex items-center space-x-3 mb-6">
            <Box className="w-5 h-5 text-slate-500" />
            <h3 className="text-lg font-bold text-slate-900">3D CAD Processing Pipeline</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                  <Layers className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="font-bold text-slate-900">Feature Extraction</span>
              </div>
              <p className="text-sm text-slate-500 mb-3">24 geometric KPIs extracted from 3D surfaces and edges</p>
              <div className="flex flex-wrap gap-2">
                {['Door aperture', 'Sill edges', 'Clearances'].map(tag => (
                  <span key={tag} className="px-2 py-1 bg-slate-50 text-slate-600 rounded text-[10px] font-medium border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="font-bold text-slate-900">Processing Accuracy</span>
              </div>
              <div className="flex items-end space-x-2 mb-2">
                <span className="text-3xl font-bold text-slate-900">95.6%</span>
                <span className="text-sm text-emerald-600 font-medium mb-1.5">vs 2D (85%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95.6%' }} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <span className="font-bold text-slate-900">Edge Detection</span>
              </div>
              <p className="text-sm text-slate-500 mb-3">Critical edges captured for body constraints</p>
              <div className="flex items-center -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                    3D
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-purple-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-purple-600">
                  +4
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metric Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricTile
          icon={Award}
          label="Overall Accuracy"
          value={`${accuracy}%`}
          subtext="Within ±1 rating point"
          color="emerald"
        />
        <MetricTile
          icon={Database}
          label="Total Samples"
          value="1,213"
          subtext="Training + validation"
          color="blue"
        />
        <MetricTile
          icon={Activity}
          label="Mean Abs. Error"
          value="0.24"
          subtext="Avg prediction error"
          color="purple"
        />
        <MetricTile
          icon={RefreshCw}
          label="Last Retrain"
          value="Q1 2025"
          subtext="Quarterly cycle"
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Error Distribution */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Prediction Error Distribution</h3>
            <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full">
              High Reliability
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={errorDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="error"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {errorDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={Math.abs(entry.error) <= 1 ? '#10B981' : '#F59E0B'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Actual vs Predicted */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Actual vs Predicted Ratings</h3>
            <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
              R² = 0.94
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="actual"
                  name="Actual"
                  domain={[4, 10]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  label={{ value: 'Actual Rating', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  type="number"
                  dataKey="predicted"
                  name="Predicted"
                  domain={[4, 10]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  label={{ value: 'Predicted Rating', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Scatter name="Predictions" data={scatterData} fill="#3B82F6" fillOpacity={0.6} />
                <Scatter
                  data={[{ actual: 4, predicted: 4 }, { actual: 10, predicted: 10 }]}
                  line={{ stroke: '#E31837', strokeWidth: 2, strokeDasharray: '5 5' }}
                  shape={() => <g />}
                  legendType="none"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Coverage */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Data Coverage by Vehicle</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={coverage}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="vehicle"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="samples" fill="#E31837" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function MetricTile({ icon: Icon, label, value, subtext, color }: any) {
  const colors = {
    emerald: 'text-emerald-600 bg-emerald-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    amber: 'text-amber-600 bg-amber-50',
  }[color as string] || 'text-slate-600 bg-slate-50';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <h4 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h4>
        <p className="text-sm font-medium text-slate-600 mt-1">{label}</p>
        <p className="text-xs text-slate-400 mt-1">{subtext}</p>
      </div>
    </motion.div>
  );
}

