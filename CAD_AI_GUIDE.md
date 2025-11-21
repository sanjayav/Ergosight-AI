# CAD Preprocessing AI Chatbot – User Guide

## Overview

The **CAD Preprocessing AI Chatbot** is a specialized AI assistant integrated into ErgoSight that helps engineers and data scientists preprocess vehicle CAD data for the ingress/egress prediction AI model.

---

## 🎯 Objective

Build an AI model to predict ease of ingress/egress with:
- **Input**: Vehicle CAD data (.stp format) + Parametric data + Anthropometry
- **Output**: Ingress/egress rating (1-10 scale)
- **Target Accuracy**: 95%

---

## 🤖 What the CAD AI Bot Can Do

### 1. **CAD File Processing Guidance**
- Methods to import and convert .stp files
- Recommended tools and libraries (Open CASCADE, FreeCAD, pythonOCC)
- Mesh conversion strategies (STL, OBJ formats)

### 2. **Geometry Extraction**
- Door opening area measurement algorithms
- Seat geometry (H-point, angles, dimensions)
- Sill height and step-over clearance
- A-pillar and B-pillar identification

### 3. **Feature Engineering Pipeline**
- Complete 24 KPI extraction methodology
- Parametric data integration (steering, pedals, sidestep)
- Anthropometry alignment strategies
- Interaction feature creation

### 4. **Code Examples**
- Python implementation snippets
- Processing pipelines
- Data structure formats
- Best practices

### 5. **Accuracy Optimization**
- Achieving 95% prediction accuracy
- Data quality requirements
- Model architecture recommendations
- Validation strategies

---

## 🚀 How to Use

### Accessing the Bot

1. Look for the **purple/blue Bot icon** at the bottom-right of your screen (below the red Ergo AI Copilot button)
2. Click to open the CAD Preprocessing AI chat panel
3. The bot will greet you with an introduction

### Chat Interface Features

**Header Information:**
- Shows objective: Target 95% accuracy
- Input types: .stp CAD + Parametric data
- Output format: Rating 1-10

**Message Types:**
- **Text explanations**: Detailed methodology
- **Code blocks**: Python implementation examples
- **Accuracy badges**: Expected performance metrics

**Quick Actions:**
- **Upload button**: Simulates CAD file attachment
- **Suggested queries**: Quick-start questions

---

## 📝 Example Queries

### Getting Started

**Q: "What preprocessing methods should I use for .stp CAD files?"**

**A:** The bot provides:
- Complete 4-step preprocessing pipeline
- CAD file import & conversion methods
- ROI extraction techniques
- Feature extraction checklist
- Recommended tools and libraries

---

### Door Opening Extraction

**Q: "How to extract door opening geometry from CAD?"**

**A:** The bot explains:
- Boundary detection algorithms
- Plane slicing methods
- Python code example using FreeCAD
- Key metrics to calculate (width, height, area)
- Expected accuracy: 95%

---

### Complete Feature Pipeline

**Q: "Recommend CAD feature extraction pipeline"**

**A:** The bot provides:
- 3-phase processing workflow
- All 24 geometric KPIs (door, sill, seat, clearances, steering, body structure)
- Anthropometry alignment methods
- JSON output format for AI model

---

### Seat Data Processing

**Q: "How to handle seat position data?"**

**A:** The bot covers:
- SAE J1100 H-point extraction
- Seat angles calculation (cushion, backrest)
- Seat-to-door clearance measurement
- Python code for H-point detection
- Accuracy: 93-96%

---

### Anthropometry Integration

**Q: "Best practices for anthropometry integration"**

**A:** The bot explains:
- Required anthropometry parameters (height, weight, gender, age, body segments)
- Percentile-based vs continuous scaling methods
- Feature engineering with anthropometry (clearance ratios, reach margins)
- Recommended databases (ANSUR II, ISO 7250, SAE J833)
- Model input structure with JSON example

---

### Accuracy Optimization

**Q: "How to achieve 95% accuracy?"**

**A:** The bot provides:
- 4 key factors (data quality 40%, feature engineering 30%, model architecture 20%, validation 10%)
- Minimum data requirements (1000+ samples)
- Recommended ML models (XGBoost, LightGBM, Random Forest)
- Feature importance ranking
- Accuracy breakdown by user profile
- Pro tips for model improvement

---

## 🔧 Technical Specifications

### Input Data Types

**1. Vehicle CAD Data (.stp format)**
- Side body geometry
- Door opening area
- Seat surfaces
- Interior components

**2. Vehicle Parametric Data**
- Steering wheel position (X, Y, Z coordinates)
- Sidestep width and height
- Pedal position details (X, Y, Z of operating point)
- Adjustable ranges (if applicable)

**3. Anthropometry Data**
- Height (stature)
- Weight
- Gender (M/F)
- Age
- Body segment lengths (sitting height, shoulder height, hip breadth, etc.)

### Output Format

**Rating Scale: 1-10**
- 10 = Extremely easy ingress/egress
- 7-9 = Good accessibility
- 6-7 = Fair, acceptable
- 4-6 = Challenging, needs improvement
- 1-3 = Very difficult, redesign required

---

## 🎓 Key Concepts Explained

### 1. **H-Point (Hip Point)**
SAE J1100 standard reference point representing the theoretical hip pivot of a seated occupant. Critical for all ergonomic calculations.

### 2. **Door Aperture**
The opening through which occupants enter/exit. Measured in width (horizontal) and height (vertical).

### 3. **Sill Height**
Distance from ground to the bottom edge of the door opening. High sills make entry difficult, especially for seniors.

### 4. **Step-Over Distance**
The horizontal distance the foot must travel over the sill during entry. Combined with sill height determines entry difficulty.

### 5. **Percentile Profiles**
- **P5F**: 5th percentile female (smaller stature, ~1500mm)
- **P50M**: 50th percentile male (average, ~1750mm)
- **P95M**: 95th percentile male (larger stature, ~1900mm)
- **Senior 65+**: Elderly with reduced mobility/flexibility

---

## 📊 24 Key Performance Indicators (KPIs)

The bot guides you to extract these features:

### Door Opening (4 KPIs)
1. Width (min, max, avg)
2. Height
3. Area
4. Perimeter

### Sill & Step (4 KPIs)
5. Sill height from ground
6. Sill width
7. Step-over distance
8. Entry angle

### Seat Geometry (5 KPIs)
9. H-point height (Z)
10. H-point forward position (X)
11. Seat cushion angle
12. Seat back angle
13. Seat-to-door distance

### Clearances (4 KPIs)
14. Headroom at A-pillar
15. Shoulder clearance
16. Hip clearance
17. Knee clearance

### Steering & Controls (3 KPIs)
18. Steering wheel height
19. Steering wheel reach
20. Pedal positions (X,Y,Z)

### Body Structure (4 KPIs)
21. A-pillar angle
22. B-pillar position
23. Roofline curvature
24. Floor-to-roof height

---

## 💡 Best Practices

### For CAD Processing
1. **Maintain coordinate system alignment** across all files
2. **Validate measurements** against physical vehicle when possible
3. **Document assumptions** in data processing pipeline
4. **Use consistent units** (millimeters recommended)
5. **Automate extraction** with Python scripts for repeatability

### For Model Training
1. **Collect 1000+ labeled samples** minimum
2. **Balance dataset** across vehicle types and percentiles
3. **Include edge cases** (very easy and very difficult entries)
4. **Cross-validate** on unseen vehicle platforms
5. **Retrain quarterly** with new data

### For Accuracy
1. **Focus on data quality** over model complexity
2. **Engineer interaction features** (ratios, margins, indices)
3. **Ensemble multiple models** (XGBoost + Random Forest + NN)
4. **Stratify validation** by vehicle type AND percentile
5. **Monitor feature importance** and adjust extraction methods

---

## 🔗 Recommended Tools & Libraries

### CAD Processing
- **Open CASCADE Technology (OCCT)**: Industry-standard CAD kernel
- **FreeCAD Python API**: Open-source CAD manipulation
- **pythonOCC**: Python bindings for OCCT
- **Trimesh**: Mesh processing library
- **Open3D**: 3D data processing

### Point Cloud & Mesh
- **PCL (Point Cloud Library)**: Advanced point cloud processing
- **PyMesh**: Mesh generation and processing
- **MeshLab**: Visualization and cleaning

### Data Processing
- **NumPy**: Numerical computations
- **SciPy**: Scientific computing (optimization, spatial)
- **Pandas**: Data manipulation
- **scikit-learn**: Machine learning

### Anthropometry
- **ANSUR II Database**: US military anthropometry data
- **ISO 7250 Standards**: International human measurements
- **SAE J833**: Automotive manikin dimensions

---

## 📞 Support

**Within ErgoSight:**
- Click the purple Bot icon to ask questions anytime
- Use suggested queries to get started quickly
- Review code examples provided by the bot

**Technical Issues:**
- ergosight-support@mahindra.com

**Feature Requests:**
- Submit via Jira (ERGO-CAD project)

---

## 🎯 Success Metrics

### Short-term Goals
- ✅ Successfully extract 24 KPIs from .stp files
- ✅ Process 100 vehicle variants
- ✅ Achieve 92%+ accuracy on validation set

### Long-term Goals
- ✅ 95% accuracy on production model
- ✅ < 5 minutes processing time per vehicle
- ✅ Automated pipeline end-to-end
- ✅ Integration with CAD systems (CATIA, NX)

---

## 📚 Additional Resources

### Documentation
- `README.md`: Project overview
- `USAGE_GUIDE.md`: ErgoSight dashboard usage
- `DEPLOYMENT.md`: Deployment instructions
- `CAD_AI_GUIDE.md`: This document

### Standards & References
- SAE J1100: Motor Vehicle Dimensions
- SAE J833: Human Physical Dimensions
- ISO 7250: Basic human body measurements
- ANSUR II: Anthropometric Survey

---

## 🚀 Quick Start Workflow

1. **Open ErgoSight** at http://localhost:4000
2. **Click purple Bot icon** (bottom-right, below red button)
3. **Ask**: "What preprocessing methods should I use for .stp CAD files?"
4. **Review** the complete pipeline provided
5. **Ask follow-ups** about specific steps (door extraction, seat processing, etc.)
6. **Copy code examples** and adapt to your data
7. **Validate results** against physical measurements
8. **Iterate and refine** extraction methods

---

**Version**: 1.0.0  
**Last Updated**: November 19, 2025  
**Maintained By**: ErgoSight AI Team

---

*The CAD Preprocessing AI Chatbot is your expert assistant for building production-grade ingress/egress prediction models. Ask detailed questions and receive comprehensive, actionable guidance!* 🤖✨

