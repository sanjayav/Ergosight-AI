# ErgoSight – Ingress/Egress AI Portal

Enterprise-grade AI portal for predicting and optimizing vehicle ingress/egress performance for Mahindra vehicles.

## 🎯 Overview

ErgoSight is a comprehensive PoC dashboard that delivers:

- **Predictive Analytics**: AI-powered ratings (1-10) for ease of ingress/egress across Mahindra's passenger vehicle portfolio
- **Multi-Profile Analysis**: Performance evaluation across P5F, P50M, P95M, and Senior 65+ anthropometry profiles
- **What-If Simulations**: Interactive design parameter testing with real-time rating updates
- **AI Copilot**: Natural language interface for engineering insights and recommendations
- **Validation Metrics**: Model performance tracking with 95.6% accuracy

## 🚀 Features

### 1. Portfolio Overview
- KPI tiles showing average ratings, at-risk vehicles, and best performers
- Interactive heatmap of vehicles vs user profiles
- Comprehensive model comparison table

### 2. Vehicle Detail
- Deep-dive analysis with profile-specific ratings
- Feature contribution charts showing design drivers
- Geometric KPI visualization
- Context-aware AI assistance

### 3. Scenario Lab
- Interactive parameter sliders (sill height, door width, etc.)
- Real-time rating calculation
- Delta insights showing impact of changes
- Design optimization recommendations

### 4. Model Performance
- Accuracy metrics and validation results
- Error distribution analysis
- Actual vs predicted scatter plots
- Data coverage by vehicle

### 5. Data Inspector
- Raw data browser with filtering
- Detailed run-by-run inspection
- Export capabilities for further analysis

### 6. Ergo AI Copilot
- Natural language query interface
- Context-aware responses
- Design recommendations
- Portfolio summaries and comparisons

### 7. CAD Preprocessing AI Chatbot ⭐ NEW
- Specialized AI assistant for CAD data preprocessing
- Expert guidance on .stp file processing methods
- Door opening & seat geometry extraction algorithms
- Complete feature engineering pipeline (24 KPIs)
- Anthropometry integration strategies
- 95% model accuracy optimization tips
- Python code examples and best practices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Access

Open [http://localhost:4000](http://localhost:4000) in your browser after starting the development server.

## 🎨 Design Philosophy

**Automotive-Grade UI**
- Clean, minimal interface optimized for engineering workflows
- Mahindra brand colors with professional gradients
- Responsive design supporting desktop and tablet viewports
- Subtle animations for smooth, premium feel
- High contrast for readability in various lighting conditions

**Enterprise Features**
- Role-based access (simulated with user chip)
- Comprehensive filtering and search
- Exportable data and insights
- Audit-ready logging infrastructure
- SSO integration ready (simulated)

## 📊 Mock Data

The PoC includes realistic mock data covering:
- 6 vehicle models (XUV700, XUV300, Scorpio-N, Thar, XUV400, Bolero)
- 4 anthropometry profiles per vehicle
- 24 geometric KPIs per variant
- 1,213 simulated training samples
- Model performance metrics

## 🤖 AI Copilot Capabilities

The Ergo AI Copilot can:
- Answer questions about specific vehicle ratings
- Compare multiple vehicles
- Suggest design improvements
- Generate review summaries
- Explain feature contributions
- Perform natural language what-if analysis

**Example Queries:**
- "Which three models are worst for ingress for seniors?"
- "What happens if I reduce sill height by 20mm for Thar?"
- "Compare Scorpio-N vs XUV700 for P95 male"
- "Write a design review summary for XUV700"

## 🔐 Security & Compliance

- Authentication via Mahindra SSO (ready for integration)
- All queries logged for audit trail
- Role-based access control architecture
- Data privacy compliance ready
- Secure API endpoints (backend ready)

## 📈 Future Enhancements

- Real AI/ML model integration
- Live CAD data import
- Multi-variant batch analysis
- Advanced optimization algorithms
- Mobile app companion
- Export to engineering reports
- Integration with PLM systems

## 👥 User Roles

- **Engineers**: Deep analysis, scenario testing, design optimization
- **Team Leads**: Portfolio overview, cross-model comparisons
- **Management**: KPI dashboards, summary reports
- **Data Scientists**: Model performance, validation metrics

## 📝 License

Proprietary - Mahindra & Mahindra Ltd.

## 🤝 Support

For questions or support, contact the ErgoSight team or Mahindra Engineering IT.

---

**Built with excellence for Mahindra's engineering teams**

