'use client';

import { TrendingUp, AlertTriangle, Award, Grid3x3, ArrowRight } from 'lucide-react';
import { vehicleModels, heatmapData, getRatingColor, getRatingLabel } from '@/lib/mock-data';

interface HomeViewProps {
  onVehicleSelect: (vehicleId: string) => void;
}

export default function HomeView({ onVehicleSelect }: HomeViewProps) {
  const avgRating = vehicleModels.reduce((sum, v) => sum + v.avgRating, 0) / vehicleModels.length;
  const atRiskCount = vehicleModels.filter(v => v.avgRating < 6).length;
  const bestVehicle = vehicleModels.reduce((best, v) => v.avgRating > best.avgRating ? v : best);
  const modelCoverage = vehicleModels.length;

  return (
    <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Average Rating</p>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{avgRating.toFixed(1)}</h3>
          <p className="text-xs text-gray-500 mt-1">Portfolio Score</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Vehicles At Risk</p>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{atRiskCount}</h3>
          <p className="text-xs text-gray-500 mt-1">Rating &lt; 6.0</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Best Performer</p>
            <Award className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{bestVehicle.name}</h3>
          <p className="text-xs text-gray-500 mt-1">{bestVehicle.avgRating.toFixed(1)} / 10</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Model Coverage</p>
            <Grid3x3 className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{modelCoverage}</h3>
          <p className="text-xs text-gray-500 mt-1">Active Variants</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap Section */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Performance Heatmap</h3>
              <p className="text-sm text-gray-500">Ingress/Egress ratings by user profile</p>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">P5 Female</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">P50 Male</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">P95 Male</th>
                      <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Senior 65+</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapData.map((row) => (
                      <tr key={row.vehicle} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-gray-900">{row.vehicle}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold text-white" style={{ backgroundColor: getRatingColor(row.P5F) }}>
                            {row.P5F.toFixed(1)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold text-white" style={{ backgroundColor: getRatingColor(row.P50M) }}>
                            {row.P50M.toFixed(1)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold text-white" style={{ backgroundColor: getRatingColor(row.P95M) }}>
                            {row.P95M.toFixed(1)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg font-bold text-white" style={{ backgroundColor: getRatingColor(row.Senior) }}>
                            {row.Senior.toFixed(1)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle List Section */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Vehicle Portfolio</h3>
              <p className="text-sm text-gray-500">Click to view details</p>
            </div>

            <div className="divide-y divide-gray-100">
              {vehicleModels.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer group"
                  onClick={() => onVehicleSelect(vehicle.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm"
                      style={{ backgroundColor: getRatingColor(vehicle.avgRating) }}
                    >
                      {vehicle.avgRating.toFixed(1)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{vehicle.name}</h4>
                      <div className="text-xs text-gray-500 mt-0.5">
                        <span>{vehicle.bodyStyle}</span>
                        <span className="mx-1">•</span>
                        <span>Issue: {vehicle.keyIssue}</span>
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
