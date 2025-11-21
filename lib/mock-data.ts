// Mock data for the PoC

export interface VehicleModel {
  id: string;
  name: string;
  bodyStyle: string;
  avgRating: number;
  worstProfile: string;
  keyIssue: string;
  ratings: {
    P5F: number;
    P50M: number;
    P95M: number;
    Senior: number;
  };
}

export interface ProfileRating {
  profile: string;
  rating: number;
}

export const vehicleModels: VehicleModel[] = [
  {
    id: 'xuv700',
    name: 'XUV700',
    bodyStyle: 'SUV',
    avgRating: 8.4,
    worstProfile: 'Senior 65+',
    keyIssue: 'High sill for seniors',
    ratings: { P5F: 8.8, P50M: 8.6, P95M: 7.9, Senior: 7.4 }
  },
  {
    id: 'xuv300',
    name: 'XUV300',
    bodyStyle: 'Compact SUV',
    avgRating: 7.2,
    worstProfile: 'P95M',
    keyIssue: 'Narrow door aperture',
    ratings: { P5F: 7.8, P50M: 7.4, P95M: 6.5, Senior: 7.1 }
  },
  {
    id: 'scorpio-n',
    name: 'Scorpio-N',
    bodyStyle: 'SUV',
    avgRating: 7.8,
    worstProfile: 'P5F',
    keyIssue: 'High seat H-point',
    ratings: { P5F: 6.9, P50M: 8.2, P95M: 8.1, Senior: 7.9 }
  },
  {
    id: 'thar',
    name: 'Thar',
    bodyStyle: 'Off-road',
    avgRating: 6.8,
    worstProfile: 'Senior 65+',
    keyIssue: 'High sill & step-over',
    ratings: { P5F: 7.2, P50M: 7.5, P95M: 6.8, Senior: 5.7 }
  },
  {
    id: 'xuv400',
    name: 'XUV400 EV',
    bodyStyle: 'Electric SUV',
    avgRating: 8.1,
    worstProfile: 'P95M',
    keyIssue: 'Limited headroom at A-pillar',
    ratings: { P5F: 8.6, P50M: 8.4, P95M: 7.3, Senior: 8.1 }
  },
  {
    id: 'bolero',
    name: 'Bolero',
    bodyStyle: 'MUV',
    avgRating: 6.5,
    worstProfile: 'Senior 65+',
    keyIssue: 'High step-in height',
    ratings: { P5F: 6.8, P50M: 7.1, P95M: 6.4, Senior: 5.7 }
  },
];

export const heatmapData = [
  { vehicle: 'XUV700', P5F: 8.8, P50M: 8.6, P95M: 7.9, Senior: 7.4 },
  { vehicle: 'XUV300', P5F: 7.8, P50M: 7.4, P95M: 6.5, Senior: 7.1 },
  { vehicle: 'Scorpio-N', P5F: 6.9, P50M: 8.2, P95M: 8.1, Senior: 7.9 },
  { vehicle: 'Thar', P5F: 7.2, P50M: 7.5, P95M: 6.8, Senior: 5.7 },
  { vehicle: 'XUV400', P5F: 8.6, P50M: 8.4, P95M: 7.3, Senior: 8.1 },
  { vehicle: 'Bolero', P5F: 6.8, P50M: 7.1, P95M: 6.4, Senior: 5.7 },
];

export interface GeometryKPI {
  name: string;
  value: number;
  unit: string;
  tooltip: string;
}

export const vehicleGeometry: Record<string, GeometryKPI[]> = {
  'xuv700': [
    { name: 'Door Aperture Width', value: 745, unit: 'mm', tooltip: 'Horizontal opening width at seat level' },
    { name: 'Door Aperture Height', value: 1260, unit: 'mm', tooltip: 'Vertical opening from sill to roof' },
    { name: 'Sill Height from Ground', value: 560, unit: 'mm', tooltip: 'Height of door sill above ground level' },
    { name: 'Seat H-point Height', value: 620, unit: 'mm', tooltip: 'Height of seat reference point' },
    { name: 'Seat–Steering Distance', value: 480, unit: 'mm', tooltip: 'Distance from seat to steering wheel center' },
    { name: 'A-Pillar Angle', value: 68, unit: 'deg', tooltip: 'Angle of windshield A-pillar' },
  ],
  'xuv300': [
    { name: 'Door Aperture Width', value: 700, unit: 'mm', tooltip: 'Horizontal opening width at seat level' },
    { name: 'Door Aperture Height', value: 1220, unit: 'mm', tooltip: 'Vertical opening from sill to roof' },
    { name: 'Sill Height from Ground', value: 540, unit: 'mm', tooltip: 'Height of door sill above ground level' },
    { name: 'Seat H-point Height', value: 610, unit: 'mm', tooltip: 'Height of seat reference point' },
    { name: 'Seat–Steering Distance', value: 460, unit: 'mm', tooltip: 'Distance from seat to steering wheel center' },
    { name: 'A-Pillar Angle', value: 65, unit: 'deg', tooltip: 'Angle of windshield A-pillar' },
  ],
};

export interface FeatureContribution {
  feature: string;
  impact: number;
  description: string;
}

export const featureContributions: Record<string, FeatureContribution[]> = {
  'xuv700': [
    { feature: 'Door Aperture Width', impact: 0.9, description: 'Wide opening provides excellent access' },
    { feature: 'Sill Height', impact: -0.8, description: 'High sill creates difficulty for seniors' },
    { feature: 'Seat–Steering Dist.', impact: 0.6, description: 'Good spacing for entry clearance' },
    { feature: 'Headroom at A-Pillar', impact: 0.4, description: 'Adequate clearance during entry' },
  ],
  'xuv300': [
    { feature: 'Door Aperture Width', impact: -0.7, description: 'Narrow opening restricts P95 male' },
    { feature: 'Sill Height', impact: 0.3, description: 'Moderate height aids entry' },
    { feature: 'Seat Height', impact: 0.2, description: 'Good H-point positioning' },
    { feature: 'A-Pillar Angle', impact: -0.3, description: 'Tight angle limits head clearance' },
  ],
};

export interface ModelPerformance {
  accuracy: number;
  errorDistribution: { error: number; count: number }[];
  scatterData: { actual: number; predicted: number }[];
  coverage: { vehicle: string; samples: number }[];
}

export const modelPerformance: ModelPerformance = {
  accuracy: 95.6,
  errorDistribution: [
    { error: -2, count: 2 },
    { error: -1.5, count: 8 },
    { error: -1, count: 24 },
    { error: -0.5, count: 48 },
    { error: 0, count: 65 },
    { error: 0.5, count: 51 },
    { error: 1, count: 22 },
    { error: 1.5, count: 6 },
    { error: 2, count: 1 },
  ],
  scatterData: Array.from({ length: 50 }, (_, i) => {
    const actual = 5 + Math.random() * 4;
    const predicted = actual + (Math.random() - 0.5) * 1.5;
    return { actual: parseFloat(actual.toFixed(1)), predicted: parseFloat(predicted.toFixed(1)) };
  }),
  coverage: [
    { vehicle: 'XUV700', samples: 245 },
    { vehicle: 'XUV300', samples: 198 },
    { vehicle: 'Scorpio-N', samples: 224 },
    { vehicle: 'Thar', samples: 187 },
    { vehicle: 'XUV400', samples: 156 },
    { vehicle: 'Bolero', samples: 203 },
  ],
};

export const copilotSuggestedQueries = [
  "Which three models are worst for ingress for seniors?",
  "Summarize ingress performance for XUV line-up",
  "What minimal changes would improve XUV300 rating above 8?",
  "Compare Scorpio-N vs XUV700 for P95 male",
  "Write a design review summary for Thar",
];

export function getRatingColor(rating: number): string {
  if (rating >= 7.5) return '#10B981'; // Green
  if (rating >= 6) return '#F59E0B'; // Amber
  return '#EF4444'; // Red
}

export function getRatingLabel(rating: number): string {
  if (rating >= 7.5) return 'Good';
  if (rating >= 6) return 'Fair';
  return 'At Risk';
}

