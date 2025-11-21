# ErgoSight – User Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Navigation](#dashboard-navigation)
3. [Portfolio Overview](#portfolio-overview)
4. [Vehicle Detail Analysis](#vehicle-detail-analysis)
5. [Scenario Lab](#scenario-lab)
6. [Model Performance](#model-performance)
7. [Data Inspector](#data-inspector)
8. [AI Copilot](#ai-copilot)
9. [Best Practices](#best-practices)
10. [FAQ](#faq)

---

## Getting Started

### First Login

1. Access ErgoSight through your company SSO portal
2. Your profile displays in the top-right corner (e.g., "Sushil Kumar")
3. Default view is **Portfolio Overview** dashboard

### User Interface Overview

The ErgoSight interface consists of:
- **Left Sidebar**: Main navigation between dashboards
- **Top Header**: Filters, user profile, and product branding
- **Main Content Area**: Active dashboard view
- **AI Copilot Button**: Floating button (bottom-right) for assistance

---

## Dashboard Navigation

### Available Dashboards

| Dashboard | Purpose | Primary Users |
|-----------|---------|---------------|
| **Portfolio Overview** | High-level KPIs and model comparison | Leadership, Team Leads |
| **Vehicle Detail** | Deep-dive analysis of specific vehicles | Engineers, Designers |
| **Scenario Lab** | What-if design simulations | Engineers, R&D |
| **Model Performance** | AI model validation metrics | Data Scientists, QA |
| **Data Inspector** | Raw data browser | Advanced Users, Auditors |

### Quick Navigation Tips

- Click any navigation item in the left sidebar to switch dashboards
- Use "View Details" buttons in Portfolio Overview to jump to Vehicle Detail
- "Back to Portfolio" button returns to overview from Vehicle Detail
- All navigation preserves your filter settings

---

## Portfolio Overview

### KPI Tiles

**Average Ingress/Egress Rating**
- Overall portfolio performance (1-10 scale)
- Trend indicator shows change vs. previous design round
- Green trend = improvement, Red = decline

**Vehicles At Risk**
- Count of models with rating < 6.0
- Requires immediate design attention
- Click tile to filter table to at-risk vehicles

**Best Rated Vehicle**
- Top performer in current portfolio
- Benchmark for design excellence
- Use as reference for improvements

**Model Coverage**
- Number of variants with AI predictions
- Indicates data completeness
- All vehicles should have coverage

### Performance Heatmap

**How to Read**
- **Rows**: Vehicle models (XUV700, Thar, etc.)
- **Columns**: User profiles (P5F, P50M, P95M, Senior 65+)
- **Colors**: 
  - 🟢 Green (≥7.5): Good performance
  - 🟡 Amber (6.0-7.5): Fair, monitor closely
  - 🔴 Red (<6.0): At risk, needs improvement

**Interactions**
- Hover over cells for detailed tooltip
- Shows rating + top limiting factor
- Click cell to navigate to detailed view

### Models Table

**Columns Explained**
- **Model**: Vehicle name and platform
- **Body Style**: SUV, MUV, Compact SUV, etc.
- **Avg Rating**: Mean across all profiles
- **Worst Profile**: Most challenging user group
- **Key Issue**: Primary design constraint
- **Actions**: "View Details" opens Vehicle Detail

**Sorting & Filtering**
- Click column headers to sort
- Use top filters to narrow results
- Filter by Vehicle Line, Body Style, Region, or Profile

---

## Vehicle Detail Analysis

### Selecting a Vehicle

1. From Portfolio Overview, click "View Details" on any vehicle
2. Or use AI Copilot: "Show me details for XUV700"

### Rating Gauge

**Central Display**
- Large rating (e.g., 8.4 / 10) for selected profile
- Circular gauge visualizes rating visually
- Color-coded: Green (good), Amber (fair), Red (at risk)

### Profile Tabs

Switch between anthropometry profiles:
- **P5F**: 5th percentile female (smaller stature)
- **P50M**: 50th percentile male (average)
- **P95M**: 95th percentile male (larger stature)
- **Senior 65+**: Elderly users with mobility considerations

**Each tab shows**:
- Profile-specific rating
- Adjusted performance drivers
- Tailored recommendations

### Top Performance Drivers

**Horizontal Bar Chart**
- **Green bars**: Positive contributors (good design aspects)
- **Red bars**: Negative contributors (areas for improvement)
- Hover for detailed description
- Ranked by impact magnitude

**Example Interpretation**:
- "Door Aperture Width +0.9" → Wide opening improves entry
- "Sill Height -0.8" → High sill creates difficulty

### Geometry Snapshot

**Visual Schematic**
- Simplified side-view of vehicle door area
- Key dimensions highlighted
- Color-coded elements:
  - Red: Sill height
  - Blue: Door aperture
  - Green: Seat position

### Key Geometry KPIs

**List of Critical Measurements**
- **Door Aperture Width**: Horizontal opening (mm)
- **Door Aperture Height**: Vertical opening (mm)
- **Sill Height from Ground**: Step-over height (mm)
- **Seat H-point Height**: Seat reference point (mm)
- **Seat–Steering Distance**: Entry clearance (mm)
- **A-Pillar Angle**: Windshield angle (degrees)

**Hover Info Icons** (ⓘ) for detailed tooltips

---

## Scenario Lab

### Purpose

Test "what-if" scenarios by adjusting design parameters and seeing real-time impact on ingress/egress ratings.

### Using the Simulator

**Step 1: Current Design**
- Left card shows baseline rating and parameters
- Default values from production spec

**Step 2: Adjust Parameters**
- Use sliders to modify:
  - Sill Height (520-620 mm)
  - Door Aperture Width (650-780 mm)
  - Seat H-point Height (580-650 mm)
  - Seat–Steering Distance (430-520 mm)

**Step 3: View Proposed Design**
- Right card updates in real-time
- Shows new rating and delta vs. current
- Delta displayed as ▲+0.9 (improvement) or ▼-0.5 (decline)

### Delta Insights Panel

**Automatically Generated**
- Lists each parameter change
- Shows individual impact on rating
- Describes why change helps or hurts

**Example**:
```
-20 mm sill height → +0.4 rating
Lower sill improves entry ease
```

### Anthropometry Profile Selector

Change user profile to see how adjustments affect different body types:
- P5 Female
- P50 Male
- P95 Male
- Senior 65+

### Optimization Tips

- **Green tip box** suggests most efficient improvements
- Based on design feasibility + rating impact
- Use as starting point for design reviews

### Reset to Default

Click "Reset to Default" button to restore baseline parameters.

---

## Model Performance

### Understanding Model Accuracy

**Overall Accuracy: 95.6%**
- Percentage of predictions within ±1 rating point
- High accuracy = reliable AI model
- Meets enterprise AI standards

### Error Distribution Chart

**Histogram Analysis**
- X-axis: Prediction error (rating points)
- Y-axis: Frequency (number of predictions)
- Peak at zero = most predictions very accurate
- Green bars = within ±1 point (acceptable)
- Amber bars = beyond ±1 point (rare outliers)

### Actual vs Predicted Scatter

**Interpretation**
- Each dot = one prediction
- Diagonal line = perfect prediction (y=x)
- Points near line = accurate
- Tight clustering = consistent model performance
- Outliers = investigate specific cases

### Data Coverage by Vehicle

**Bar Chart**
- Shows training sample count per vehicle
- All vehicles should have >150 samples minimum
- Higher sample count = more reliable predictions
- Balanced dataset ensures fair AI

### Model Metadata

**Key Information**
- **Model Type**: Gradient Boosting Regressor (machine learning algorithm)
- **Version**: v2.3.1 (semantic versioning)
- **Training Date**: Jan 15, 2025
- **Features**: 24 geometric KPIs used as inputs
- **Retrain Cadence**: Quarterly updates

---

## Data Inspector

### Purpose

Advanced users can inspect raw data underlying AI predictions.

### Search & Filter

**Search Bar**
- Search by vehicle name, run ID, or date
- Real-time filtering

**Dropdowns**
- Filter by specific vehicle
- Filter by anthropometry profile
- Combine filters for precise queries

### Data Table

**Columns**
- **Run ID**: Unique identifier (e.g., RUN-2025001)
- **Vehicle**: Model name
- **Profile**: User anthropometry
- **Geometric KPIs**: Sill height, door width, seat height (mm)
- **Predicted**: AI model output
- **Actual**: Ground truth (if available)
- **Date**: Prediction timestamp

**Export Options** (Coming Soon)
- CSV download for Excel analysis
- API export for integration

### Pagination

Navigate through records:
- 15 records per page
- Total count displayed
- Jump to specific page

---

## AI Copilot

### Accessing the Copilot

Click the **floating red button** (bottom-right) with sparkle icon (✨)

### What Copilot Can Do

**1. Explain Ratings**
> "Why is Scorpio-N ingress poor for seniors?"

**2. Compare Vehicles**
> "Compare Scorpio-N vs XUV700 for P95 male"

**3. Summarize Portfolio**
> "Which three models are worst for seniors?"

**4. What-If Analysis**
> "What happens if I reduce sill height by 20mm for Thar?"

**5. Generate Reports**
> "Write a design review summary for XUV700"

**6. Optimization Suggestions**
> "What minimal changes improve XUV300 above 8.0?"

### Using Copilot Effectively

**Best Practices**
- Ask specific, complete questions
- Provide context (vehicle name, profile)
- Use natural language (no need for technical syntax)
- Review suggested queries for examples

**Context Awareness**
- Copilot knows which dashboard you're viewing
- In Vehicle Detail, it knows selected vehicle
- In Scenario Lab, it knows current slider values

**Example Conversations**

```
You: "Why is XUV300 rated 7.2?"
Copilot: "XUV300's rating of 7.2 is primarily limited by 
narrow door aperture width (700mm) which restricts P95 
male access. Recommend increasing by 30-40mm..."

You: "What if we increase door width by 40mm?"
Copilot: "Increasing door width from 700mm to 740mm would 
improve rating by approximately +0.4 points, bringing 
overall score to 7.6/10..."
```

### Suggested Queries

Click any suggested query chip to auto-populate input field.

---

## Best Practices

### For Design Engineers

1. **Start with Portfolio Overview** to identify problem areas
2. **Use Vehicle Detail** for root cause analysis
3. **Test fixes in Scenario Lab** before CAD changes
4. **Ask Copilot** for optimization suggestions
5. **Document findings** using Copilot's review summaries

### For Team Leads

1. **Monitor KPI tiles** weekly for trends
2. **Review heatmap** to spot systematic issues across profiles
3. **Prioritize at-risk vehicles** (rating < 6.0)
4. **Use Copilot** for executive summaries
5. **Track Model Performance** to ensure AI reliability

### For Program Managers

1. **Compare variants** within same vehicle line
2. **Benchmark** against best-rated vehicle
3. **Review Data Inspector** for data coverage gaps
4. **Generate reports** via Copilot for stakeholder meetings
5. **Track improvement trends** over design cycles

---

## FAQ

**Q: What does the rating scale mean?**
A: 1-10 scale where 10 = excellent ingress/egress ease, 1 = very difficult. Ratings ≥7.5 are considered good, <6.0 require attention.

**Q: How often is data updated?**
A: Real-time for new predictions. Model retrained quarterly with latest data.

**Q: Can I export data?**
A: Currently via Data Inspector table (CSV export coming soon). Contact IT for API access.

**Q: What if I find incorrect data?**
A: Use Copilot to report: "Data issue for [vehicle] on [date]" or email support.

**Q: How accurate is the AI model?**
A: 95.6% accuracy (within ±1 rating point). See Model Performance dashboard for details.

**Q: Can I compare multiple vehicles at once?**
A: Use AI Copilot: "Compare XUV700, Scorpio-N, and Thar for P95 male"

**Q: What's the difference between profiles?**
A: P5F/P50M/P95M represent body size percentiles. Senior 65+ accounts for age-related mobility limitations.

**Q: How do I share insights with my team?**
A: Use Copilot to generate summaries, then copy/paste into reports. Screenshot feature coming soon.

**Q: Who has access to ErgoSight?**
A: Mahindra engineering teams, design teams, and leadership (SSO controlled).

**Q: Can I save my scenario simulations?**
A: Feature planned for next release. Currently use Copilot to document optimal parameters.

---

## Support

**Technical Issues**: ergosight-support@mahindra.com
**Feature Requests**: Submit via Jira (ERGO project)
**Training**: Contact your team lead for onboarding session

---

**Version**: 1.0.0  
**Last Updated**: November 19, 2025  
**Document Owner**: ErgoSight Product Team

