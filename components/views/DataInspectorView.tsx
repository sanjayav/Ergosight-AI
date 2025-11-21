'use client';

import { useState } from 'react';
import { Database, Search, Download, Filter, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { vehicleModels } from '@/lib/mock-data';

export default function DataInspectorView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('All Vehicles');
  const [selectedProfile, setSelectedProfile] = useState('All Profiles');
  const [currentPage, setCurrentPage] = useState(1);

  const generateMockData = () => {
    const data = [];
    for (let i = 0; i < 15; i++) {
      const vehicle = vehicleModels[i % vehicleModels.length];
      const profiles = ['P5F', 'P50M', 'P95M', 'Senior'];
      const profile = profiles[i % profiles.length];
      const predicted = (6.5 + Math.random() * 2.5).toFixed(1);
      const actual = (6.4 + Math.random() * 2.6).toFixed(1);
      const diff = (parseFloat(predicted) - parseFloat(actual)).toFixed(1);

      data.push({
        runId: `RUN-${String(2025001 + i).padStart(7, '0')}`,
        vehicle: vehicle.name,
        profile,
        sillHeight: 540 + Math.floor(Math.random() * 60),
        doorWidth: 680 + Math.floor(Math.random() * 80),
        seatHeight: 590 + Math.floor(Math.random() * 50),
        predicted: parseFloat(predicted),
        actual: parseFloat(actual),
        diff: parseFloat(diff),
        date: `Nov ${10 + (i % 10)}, 2025`
      });
    }
    return data;
  };

  const mockData = generateMockData();

  return (
    <div className="p-6 space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-mahindra-red to-red-600 rounded-xl flex items-center justify-center shadow-sm">
              <Database className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Data & Input Inspector</h2>
              <p className="text-sm text-gray-600 mt-1">
                Detailed view of raw geometric KPIs, parametric inputs, and prediction data
              </p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-mahindra-red to-red-600 text-white rounded-lg font-semibold hover:shadow-md transition-all">
            <Download className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-600 mb-1 font-medium uppercase">Total Records</div>
            <div className="text-2xl font-bold text-gray-900">1,213</div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+12% this month</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-600 mb-1 font-medium uppercase">Avg Accuracy</div>
            <div className="text-2xl font-bold text-gray-900">95.6%</div>
            <div className="text-xs text-emerald-600 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+2.3% improvement</span>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-600 mb-1 font-medium uppercase">Vehicles</div>
            <div className="text-2xl font-bold text-gray-900">{vehicleModels.length}</div>
            <div className="text-xs text-gray-500 mt-1">Models analyzed</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-600 mb-1 font-medium uppercase">Last Updated</div>
            <div className="text-lg font-bold text-gray-900">Just now</div>
            <div className="text-xs text-gray-600 mt-1 flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-1"></span>
              <span>Live data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by vehicle, run ID, or date..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-mahindra-red/20 focus:border-mahindra-red transition-all text-gray-700"
            />
          </div>

          <select
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 font-medium hover:border-mahindra-red/30 focus:outline-none focus:ring-2 focus:ring-mahindra-red/20 focus:border-mahindra-red cursor-pointer transition-all"
          >
            <option>All Vehicles</option>
            {vehicleModels.map(v => (
              <option key={v.id}>{v.name}</option>
            ))}
          </select>

          <select
            value={selectedProfile}
            onChange={(e) => setSelectedProfile(e.target.value)}
            className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 font-medium hover:border-mahindra-red/30 focus:outline-none focus:ring-2 focus:ring-mahindra-red/20 focus:border-mahindra-red cursor-pointer transition-all"
          >
            <option>All Profiles</option>
            <option>P5F</option>
            <option>P50M</option>
            <option>P95M</option>
            <option>Senior 65+</option>
          </select>

          <button className="flex items-center space-x-2 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-medium hover:border-mahindra-red/30 hover:bg-gray-100 transition-all">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Run ID</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Vehicle</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Profile</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Sill Height</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Door Width</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Seat Height</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Predicted</th>
                <th className="text-center py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Actual</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockData.map((row, i) => {
                const getDiffColor = (diff: number) => {
                  const absDiff = Math.abs(diff);
                  if (absDiff <= 0.3) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
                  if (absDiff <= 0.6) return 'text-amber-700 bg-amber-50 border-amber-200';
                  return 'text-red-700 bg-red-50 border-red-200';
                };

                const getDiffIcon = (diff: number) => {
                  if (Math.abs(diff) <= 0.3) return <TrendingUp className="w-3 h-3" />;
                  if (diff > 0) return <TrendingUp className="w-3 h-3" />;
                  if (diff < 0) return <TrendingDown className="w-3 h-3" />;
                  return <Minus className="w-3 h-3" />;
                };

                return (
                  <tr
                    key={i}
                    className="hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6 text-sm font-mono text-gray-700 font-semibold group-hover:text-mahindra-red transition-colors">
                      {row.runId}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-gray-900">{row.vehicle}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                        {row.profile}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-sm font-semibold text-gray-700">{row.sillHeight}</span>
                      <span className="text-xs text-gray-500 ml-1">mm</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-sm font-semibold text-gray-700">{row.doorWidth}</span>
                      <span className="text-xs text-gray-500 ml-1">mm</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-sm font-semibold text-gray-700">{row.seatHeight}</span>
                      <span className="text-xs text-gray-500 ml-1">mm</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                        {row.predicted}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold bg-gray-100 text-gray-900 border border-gray-300">
                          {row.actual}
                        </span>
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getDiffColor(row.diff)}`}>
                          {getDiffIcon(row.diff)}
                          <span>{row.diff > 0 ? '+' : ''}{row.diff}</span>
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                      {row.date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between bg-white rounded-xl shadow-md p-5 border border-gray-100">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Showing <span className="text-mahindra-red">{(currentPage - 1) * 15 + 1}-{currentPage * 15}</span> of <span className="text-mahindra-red">1,213</span> records
          </p>
          <p className="text-xs text-gray-500 mt-1">Displaying all recent runs</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:border-mahindra-red/30 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === page
                    ? 'bg-gradient-to-r from-mahindra-red to-red-600 text-white shadow-md'
                    : 'bg-gray-50 border border-gray-300 text-gray-700 hover:border-mahindra-red/30 hover:bg-gray-100'
                  }`}
              >
                {page}
              </button>
            ))}
            <span className="text-gray-400 px-2">...</span>
            <button
              onClick={() => setCurrentPage(81)}
              className="w-10 h-10 rounded-lg text-sm font-bold bg-gray-50 border border-gray-300 text-gray-700 hover:border-mahindra-red/30 hover:bg-gray-100 transition-all"
            >
              81
            </button>
          </div>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === 81}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:border-mahindra-red/30 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
