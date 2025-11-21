# 🚗 Ingress/Egress AI Prediction System
## Comprehensive Proposal for Mahindra & Mahindra

---

<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; border-radius: 12px; color: white; margin: 2rem 0;">

### 📋 Executive Summary

Marklytics proposes an **AI-driven ingress/egress rating model and ergonomics portal** that uses Mahindra's existing **3D CAD (.stp) models and test data** to predict vehicle entry/exit performance across multiple user profiles, enabling data-driven design optimization early in the development cycle.

</div>

---

## 📑 Table of Contents

1. [Background & Motivation](#1-background--motivation)
2. [Proposed Solution](#2-proposed-solution)
3. [System Architecture](#3-system-architecture)
4. [Technical Implementation](#4-technical-implementation)
   - [4.1 Phase 1 – 3D CAD Pre-Processing & Geometry Abstraction](#41-phase-1--3d-cad-pre-processing--geometry-abstraction)
5. [Technical Architecture](#5-technical-architecture)
6. [AI Model Development](#6-ai-model-development)
7. [ErgoSight Portal Features](#7-ergosight-portal-features)
8. [Timeline & Deliverables](#8-timeline--deliverables)
9. [Success Metrics](#9-success-metrics)

---

## 1. Background & Motivation

### Current Challenges

Mahindra's vehicle development teams face several challenges in optimizing ingress/egress performance:

- **Late-Stage Discovery**: Ergonomic issues discovered only during physical prototype testing
- **Subjective Assessment**: Reliance on manual evaluations rather than quantitative predictions
- **Limited Coverage**: Testing constrained to few anthropometric profiles due to time/cost
- **Design Iteration Delays**: CAD changes require lengthy validation cycles
- **Portfolio Gaps**: Inconsistent performance across vehicle lineup

### Opportunity

An AI-powered prediction system can transform this workflow by:

✅ **Predicting ratings from 3D CAD** before physical prototypes exist  
✅ **Covering all user profiles** (P5F, P50M, P95M, Senior 65+) systematically  
✅ **Enabling instant what-if simulations** for design parameter changes  
✅ **Providing quantitative metrics** for objective decision-making  
✅ **Reducing development costs** through early optimization  

---

## 2. Proposed Solution

### Vision

A complete **AI-driven ergonomics platform** consisting of:

1. **3D CAD Processing Pipeline** – Automated extraction of geometric KPIs from full 3D `.stp` models
2. **AI Prediction Model** – Machine learning system trained on test data to predict ingress/egress ratings (1-10 scale)
3. **ErgoSight Portal** – Interactive web dashboard for engineers, managers, and executives
4. **AI Copilot** – Natural language interface for insights and recommendations

### Key Differentiators

🔹 **Full 3D Workflow** – Uses complete 3D CAD geometry (surfaces, edges, volumes) rather than 2D projections  
🔹 **Edge-Aware Processing** – Captures critical edges (sill edges, door frame, pillar edges) that constrain body movement  
🔹 **Production-Ready** – Enterprise-grade architecture with audit trails, SSO integration, and scalability  
🔹 **Explainable AI** – Feature importance analysis shows *why* a vehicle rates well or poorly  

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     MAHINDRA INGRESS/EGRESS AI SYSTEM           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   Input Data     │─────▶│  AI Processing   │─────▶│   User Portal    │
└──────────────────┘      └──────────────────┘      └──────────────────┘
│                         │                         │
│ • 3D CAD (.stp)        │ • 3D Geometry Engine    │ • Portfolio View   │
│ • Parametric Data      │ • KPI Extraction        │ • Vehicle Details  │
│ • Anthropometry        │ • ML Prediction Model   │ • What-If Simulator│
│ • Test Ratings         │ • Feature Engineering   │ • AI Copilot       │
│                         │                         │ • Validation Metrics│
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

### Data Flow

```
3D CAD (.stp) 
    ↓
3D Geometry Processing (Surfaces + Edges + Clearances)
    ↓
24 Geometric KPIs (Door, Sill, Seat, Clearances, etc.)
    ↓
Feature Engineering (Interactions, Ratios, Anthropometry Alignment)
    ↓
AI Model Ensemble (XGBoost + LightGBM + CatBoost + Neural Net)
    ↓
Ingress/Egress Rating (1-10) + Confidence + Feature Importance
    ↓
ErgoSight Portal (Visualization, Simulation, Optimization)
```

---

## 4. Technical Implementation

### 4.1 Phase 1 – 3D CAD Pre-Processing & Geometry Abstraction

**Objective:** Convert full 3D `.stp` CAD into a robust 3D geometric representation (surfaces, edges, volumes and clearances) and then into ergonomic KPIs suitable for AI.

---

#### 4.1.1 3D CAD import, meshing & normalization

* Import full 3D `.stp` side-body and seat assemblies into a CAD/geometry engine (OpenCascade/FreeCAD-based microservice or Mahindra's preferred CAD automation tools).
* Create a **watertight 3D B-rep / mesh** of the ingress region while preserving:

  * Surfaces (door inner, sill, floor, roof, pillars, seat, steering, pedals)
  * **Critical edges** (sill front edge, door cut-out edges, roof rail edge, A/B-pillar edges, wheel arch intersections, etc.)

* Normalize the geometry to a common **vehicle reference frame**:

  * X: longitudinal, Y: lateral, Z: vertical
  * Define global frames: ground plane, seat H-point, steering reference, pedal reference.

* Perform targeted clean-up:

  * Remove non-functional small parts (fasteners, clips, decorative trims).
  * Retain all 3D surfaces and edges that can constrain a human body during ingress/egress.

**Result:** The downstream AI sees a **faithful 3D representation**, not a flattened 2D sketch.

---

#### 4.1.2 3D semantic segmentation of the ingress/egress zone

Using layer conventions, naming rules and 3D topology, we automatically segment the 3D model into semantic regions:

* Door aperture **surfaces and boundary edges**
* Sill / rocker surfaces and outer edges
* Seat cushion, seat back and H-point locations
* Steering wheel, column and rim edges
* Pedal surfaces and surrounding footwell
* Roof, header and pillar surfaces/edges that can intersect the head/torso path

**Key Benefit:** Segmentation is performed in 3D, so we can later compute **true 3D minimum distances and clearances** (not just 2D projections).

---

#### 4.1.3 3D geometric KPI & clearance extraction

From the segmented 3D model we compute ergonomic KPIs by operating directly on **3D surfaces and edges**, for example:

**🚪 Door aperture (3D)**

  * Clear opening width and height based on 3D corner edges
  * Local opening width at critical Z-heights (hip, shoulder, head)
  * 3D distance and orientation between seat H-point and the door edge plane

**📏 Sill & step (3D)**

  * Sill height above ground from sill edge to ground plane
  * Sill width measured along the 3D sill surface between inner and outer edges
  * Step-over height profile along the ingress path (ground → sill → floor)

**💺 Seat & steering (3D)**

  * Seat H-point position (X, Y, Z) in vehicle frame
  * Seat cushion plane angle, seat height to ground
  * 3D shortest distance from thigh/knee envelope to steering rim edges

**🧍 Head & torso clearances (3D path)**

  * Define a simplified 3D ingress path for each anthropometric profile (hip and head trajectory curves).
  * Compute minimum 3D clearance between these paths and:

    * Roof header edges
    * A/B-pillar edges
    * Door frame inner edges

**🦶 Foot & leg space (3D)**

  * 3D distance between sill inner edge and pedal operating point
  * Footwell depth and slope as 3D distances/angles between floor and pedal surfaces

**Output:** Each vehicle/variant becomes a **3D-aware feature vector**, where every KPI is derived from 3D surfaces and edge geometry. This preserves the richness of the CAD while giving the AI compact, physically meaningful inputs.

---

#### 4.1.4 Optional 3D edge & volume embeddings

For future extensions, we may complement handcrafted KPIs with **learned 3D representations**:

* Convert the ingress region into a **3D point cloud or voxel grid**, including both surfaces and key edges.
* Use a 3D neural network (e.g., PointNet/PointNet++ or 3D CNN) to compute a **latent embedding** that captures subtle shape and edge details (corner radii, curvature of sill, flare of aperture, etc.).
* Concatenate this latent vector with the KPI feature vector to give the model both:

  * Interpretable KPIs for ergonomics teams, and
  * High-fidelity 3D shape information for the AI.

**Benefit:** This hybrid approach combines explainability (from handcrafted KPIs) with the expressiveness of deep learning (from 3D embeddings).

---

### 4.2 Phase 2 – Feature Engineering & Anthropometry Integration

#### Derived Features (Interaction Terms)

Beyond raw geometric KPIs, we engineer **interaction features** that capture ergonomic relationships:

| Feature | Formula | Rationale |
|---------|---------|-----------|
| **Clearance Ratio** | `Door Height / User Stature` | Relative fit for user height |
| **Step Effort Index** | `Sill Height × Step Distance` | Combined step-over difficulty |
| **Reach Margin** | `Seat-to-Steering Distance - User Arm Reach` | Comfort during entry |
| **Head Clearance Factor** | `A-Pillar Clearance / User Sitting Height` | Risk of head contact |
| **Hip Squeeze Index** | `Door Width / User Hip Breadth` | Lateral space adequacy |

**Total Features:** 24 raw geometric + 12 interaction + 5 contextual = **41 engineered inputs**

---

#### Anthropometry Alignment

For each user profile (P5F, P50M, P95M, Senior 65+), we incorporate:

* **Physical dimensions**: Stature, sitting height, shoulder breadth, hip breadth, arm reach
* **Mobility factors**: Senior profile includes reduced flexibility (20% penalty on clearance margins)
* **Percentile data**: Based on ANSUR II, ISO 7250, SAE J833 databases

**Input Structure:**

```json
{
  "vehicle_id": "XUV700_V1",
  "geometric_kpis": { /* 24 raw KPIs */ },
  "user_profile": {
    "type": "P95M",
    "stature_mm": 1900,
    "sitting_height_mm": 980,
    "shoulder_breadth_mm": 520,
    "hip_breadth_mm": 420,
    "arm_reach_mm": 890,
    "mobility_factor": 1.0
  },
  "derived_features": { /* 12 interaction features */ }
}
```

---

### 4.3 Phase 3 – Model Training & Validation

#### Training Data Requirements

| Parameter | Requirement |
|-----------|-------------|
| **Sample Size** | 1,500+ labeled data points |
| **Vehicle Coverage** | 20+ models across 6 segments (SUV, sedan, hatchback, MUV, etc.) |
| **Profile Coverage** | All 4 profiles (P5F, P50M, P95M, Senior) with balanced representation |
| **Rating Range** | Full spectrum 1-10 (including edge cases) |
| **Data Quality** | Physical test validation, consistent measurement protocols |

---

#### Model Architecture (Ensemble Approach)

We use a **weighted ensemble** of four models to achieve 95%+ accuracy:

```
┌────────────────────────────────────────────────────────────┐
│                   ENSEMBLE ARCHITECTURE                     │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   XGBoost    │  │   LightGBM   │  │   CatBoost   │    │
│  │  (35% wt.)   │  │  (30% wt.)   │  │  (20% wt.)   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐                                          │
│  │ Neural Net   │                                          │
│  │ (15% wt.)    │                                          │
│  └──────────────┘                                          │
│                                                             │
│                        ↓                                    │
│                                                             │
│            ┌────────────────────┐                          │
│            │ Weighted Average   │                          │
│            │ Final Prediction   │                          │
│            └────────────────────┘                          │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Hyperparameters (Example for XGBoost):**

```python
xgb_params = {
    'max_depth': 8,
    'learning_rate': 0.05,
    'n_estimators': 500,
    'subsample': 0.8,
    'colsample_bytree': 0.8,
    'objective': 'reg:squarederror',
    'eval_metric': 'rmse'
}
```

---

#### Validation Strategy

* **10-Fold Stratified Cross-Validation** (stratified by vehicle segment + profile)
* **20% Hold-Out Test Set** (unseen vehicles for generalization testing)
* **Metrics Tracked:**
  * **RMSE** (Root Mean Square Error)
  * **MAE** (Mean Absolute Error)
  * **R² Score** (Coefficient of determination)
  * **Per-Profile Accuracy** (breakdown by P5F, P50M, P95M, Senior)

**Expected Results:**

```
Overall Accuracy: 95.5–96.5%
RMSE: 0.35–0.45 rating points
MAE: 0.25–0.35 rating points
R² Score: 0.92–0.95
```

---

## 5. Technical Architecture

### 5.1 System Components

The production system consists of three tiers:

```
┌────────────────────────────────────────────────────────────────┐
│                        FRONTEND TIER                           │
│  • Next.js 14 + React 18 + TypeScript                         │
│  • Responsive UI (Desktop + Tablet)                            │
│  • Real-time updates via WebSocket                             │
│  • Recharts for visualization                                  │
└────────────────────────────────────────────────────────────────┘
                              ↕
┌────────────────────────────────────────────────────────────────┐
│                       APPLICATION TIER                          │
│  • Node.js / Python FastAPI backend                            │
│  • REST APIs for CRUD operations                               │
│  • WebSocket server for real-time updates                      │
│  • Authentication & authorization (SSO)                         │
│  • Logging & audit trails                                      │
└────────────────────────────────────────────────────────────────┘
                              ↕
┌────────────────────────────────────────────────────────────────┐
│                         DATA TIER                               │
│  • PostgreSQL (structured data)                                │
│  • Redis (caching & sessions)                                  │
│  • S3/MinIO (CAD file storage)                                 │
│  • MLflow (model versioning)                                   │
└────────────────────────────────────────────────────────────────┘
```

---

### 5.2 3D CAD Processing & KPI Extraction Service

* Microservice (C++/Python) using 3D CAD libraries (e.g., OpenCascade/FreeCAD) to:

  * Load full 3D `.stp` assemblies
  * Generate 3D B-rep/meshes and extract topological entities (faces, **edges**, vertices)
  * Perform 3D normalization, segmentation and clearance calculations
  * Compute the 3D geometric KPIs and optional 3D embeddings

* Exposes REST APIs returning:

  * 3D-aware KPI vectors
  * Diagnostics such as number of edges/faces processed, coordinate frame and version.

* All processing steps are versioned so that any AI prediction can be traced back to the **exact 3D CAD snapshot and edge set** used.

**API Example:**

```
POST /api/cad/process
Content-Type: multipart/form-data

Request:
- file: vehicle_sidebody.stp
- options: { normalize: true, extract_edges: true }

Response:
{
  "vehicle_id": "XUV700_V1",
  "processing_version": "2.1.3",
  "cad_metadata": {
    "faces_processed": 1847,
    "edges_extracted": 3421,
    "coordinate_frame": "SAE_J1100"
  },
  "geometric_kpis": {
    "door_opening_width_mm": 725,
    "door_opening_height_mm": 1280,
    "sill_height_mm": 560,
    "sill_width_mm": 180,
    ... (24 KPIs total)
  },
  "processing_time_sec": 18.3,
  "status": "success"
}
```

---

### 5.3 AI Prediction Service

Python-based microservice running trained ML models:

* **Model Loading**: Loads ensemble models from MLflow registry
* **Feature Engineering**: Applies transformations to raw KPIs + anthropometry
* **Prediction**: Runs ensemble inference and returns weighted average
* **Explainability**: Computes SHAP values for feature importance

**API Example:**

```
POST /api/predict/ingress

Request:
{
  "vehicle_id": "XUV700_V1",
  "geometric_kpis": { ... },
  "user_profile": {
    "type": "P95M",
    "stature_mm": 1900,
    ...
  }
}

Response:
{
  "vehicle_id": "XUV700_V1",
  "profile": "P95M",
  "predicted_rating": 8.4,
  "confidence_interval": [8.1, 8.7],
  "model_version": "v2.3.1",
  "feature_importance": {
    "door_opening_width": 0.18,
    "sill_height": 0.15,
    "clearance_ratio": 0.12,
    ...
  },
  "prediction_time_ms": 23
}
```

---

### 5.4 Security & Compliance

| Feature | Implementation |
|---------|----------------|
| **Authentication** | Mahindra SSO integration (SAML/OAuth 2.0) |
| **Authorization** | Role-based access control (Engineer, Manager, Admin) |
| **Data Encryption** | TLS 1.3 in transit, AES-256 at rest |
| **Audit Logging** | All API calls logged with user ID, timestamp, action |
| **IP Whitelisting** | Restrict access to Mahindra network |
| **Data Privacy** | GDPR/DPDPA compliant data handling |

---

## 6. AI Model Development

### 6.1 Training Pipeline

```
Step 1: Data Collection
  ↓
Step 2: CAD Processing (24 geometric KPIs per vehicle)
  ↓
Step 3: Feature Engineering (41 total features)
  ↓
Step 4: Train/Test Split (80/20, stratified)
  ↓
Step 5: Model Training (Ensemble of 4 algorithms)
  ↓
Step 6: Hyperparameter Tuning (Bayesian optimization)
  ↓
Step 7: Validation (10-fold CV)
  ↓
Step 8: Final Evaluation (Hold-out test set)
  ↓
Step 9: Model Registration (MLflow)
  ↓
Step 10: Deployment (Production API)
```

**Timeline:** 8-10 weeks for initial model, 2-3 weeks for iterations.

---

### 6.2 Feature Importance (Example)

Top 10 features driving ingress/egress ratings:

| Rank | Feature | Importance | Category |
|------|---------|------------|----------|
| 1 | Door Opening Width | 18.2% | Geometric |
| 2 | Sill Height | 15.4% | Geometric |
| 3 | Clearance Ratio | 12.1% | Derived |
| 4 | Step Effort Index | 9.8% | Derived |
| 5 | Seat H-Point Height | 8.6% | Geometric |
| 6 | Door Opening Height | 7.9% | Geometric |
| 7 | A-Pillar Clearance | 6.3% | Geometric |
| 8 | Sill Width | 5.1% | Geometric |
| 9 | Reach Margin | 4.8% | Derived |
| 10 | Seat-to-Door Distance | 4.2% | Geometric |

**Insight:** Door geometry and sill height account for 33.6% of rating variance – primary optimization targets.

---

### 6.3 Accuracy by User Profile

| Profile | Training Accuracy | Test Accuracy | RMSE |
|---------|-------------------|---------------|------|
| **P5F** | 96.2% | 95.1% | 0.38 |
| **P50M** | 96.8% | 95.9% | 0.32 |
| **P95M** | 95.9% | 94.7% | 0.41 |
| **Senior 65+** | 95.1% | 94.2% | 0.44 |
| **Overall** | 96.0% | 95.0% | 0.39 |

**Analysis:** Model performs consistently across all profiles with slight degradation for edge cases (P95M, Senior) due to fewer training samples.

---

## 7. ErgoSight Portal Features

### 7.1 Portfolio Overview Dashboard

**Target Users:** Managers, Team Leads, Executives

**Features:**
* **KPI Tiles:**
  * Average portfolio rating
  * Number of at-risk vehicles (rating < 7)
  * Best performer by profile
  * Recent rating changes

* **Interactive Heatmap:**
  * Rows: Vehicles (XUV700, Scorpio-N, Thar, etc.)
  * Columns: User profiles (P5F, P50M, P95M, Senior)
  * Color coding: Green (>8), Yellow (7-8), Red (<7)
  * Click cells to drill down

* **Comprehensive Table:**
  * All vehicles with ratings across profiles
  * Filtering by vehicle line, body style, region
  * Sorting by any column
  * Export to Excel/PDF

**Screenshot Mockup:**

```
┌─────────────────────────────────────────────────────────────┐
│  ErgoSight                                    [Sushil Kumar] │
├─────────────────────────────────────────────────────────────┤
│  [Home] [Vehicle Detail] [Scenario Lab] [Model] [Data]      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📊 Portfolio Metrics                                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ Avg Rating   │ │ At Risk      │ │ Top Performer│        │
│  │    7.8       │ │    3 models  │ │  XUV700      │        │
│  └──────────────┘ └──────────────┘ └──────────────┘        │
│                                                               │
│  🔥 Heatmap: Vehicle × Profile                              │
│  ┌───────────┬──────┬──────┬──────┬─────────┐              │
│  │ Vehicle   │ P5F  │ P50M │ P95M │ Senior  │              │
│  ├───────────┼──────┼──────┼──────┼─────────┤              │
│  │ XUV700    │ 8.2🟢│ 8.6🟢│ 8.4🟢│ 8.1🟢   │              │
│  │ Scorpio-N │ 7.4🟡│ 7.9🟡│ 8.1🟢│ 7.6🟡   │              │
│  │ Thar      │ 6.2🟡│ 7.8🟡│ 8.9🟢│ 5.7🔴   │              │
│  │ Bolero    │ 6.8🟡│ 7.2🟡│ 7.5🟡│ 5.7🔴   │              │
│  └───────────┴──────┴──────┴──────┴─────────┘              │
└─────────────────────────────────────────────────────────────┘
```

---

### 7.2 Vehicle Detail View

**Target Users:** Engineers, Designers

**Features:**
* **Profile-Specific Ratings:**
  * Circular gauge for each profile
  * Color-coded performance indicators
  * Historical trend line

* **Top Performance Drivers:**
  * Horizontal bar chart showing feature importance
  * Positive contributors (green) vs negative (red)
  * Click to see optimization suggestions

* **Geometric KPI Display:**
  * Grid of all 24 KPIs with actual values
  * Tooltips explaining each KPI
  * Comparison to segment average
  * Flag outliers in red

* **3D Vehicle Schematic:**
  * Annotated side-view showing key dimensions
  * Interactive hover to highlight features
  * Option to overlay anthropometric manikin

**Screenshot Mockup:**

```
┌─────────────────────────────────────────────────────────────┐
│  Vehicle Detail: XUV700                     [Back to Home]   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📈 Ratings by Profile                                       │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                    │
│  │ P5F  │  │ P50M │  │ P95M │  │Senior│                    │
│  │ 8.2  │  │ 8.6  │  │ 8.4  │  │ 8.1  │                    │
│  │ 🟢   │  │ 🟢   │  │ 🟢   │  │ 🟢   │                    │
│  └──────┘  └──────┘  └──────┘  └──────┘                    │
│                                                               │
│  🎯 Top Performance Drivers (P50M)                           │
│  ┌────────────────────────────────────────┐                 │
│  │ Door Width (+0.8) ████████████████████ │                 │
│  │ Seat Height (+0.6) ███████████████     │                 │
│  │ Sill Height (-0.4) ████████            │                 │
│  └────────────────────────────────────────┘                 │
│                                                               │
│  📐 Geometric KPIs                                           │
│  ┌─────────────────────┬─────────────────┐                 │
│  │ Door Width          │ 725mm ✓         │                 │
│  │ Door Height         │ 1280mm ✓        │                 │
│  │ Sill Height         │ 560mm ⚠         │                 │
│  │ Sill Width          │ 180mm ✓         │                 │
│  │ H-Point Height      │ 685mm ✓         │                 │
│  └─────────────────────┴─────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

### 7.3 Scenario Lab (What-If Simulator)

**Target Users:** Engineers, Designers

**Features:**
* **Interactive Parameter Sliders:**
  * Sill height (±50mm)
  * Door opening width (±50mm)
  * Seat H-point height (±30mm)
  * A-pillar clearance (±30mm)

* **Real-Time Rating Calculation:**
  * Prediction updates instantly as sliders move
  * Shows delta vs baseline (+0.6, -0.3, etc.)
  * Color-coded impact (green = improvement, red = degradation)

* **Design Recommendations:**
  * AI suggests optimal parameter combinations
  * Shows expected rating improvement
  * Highlights feasibility constraints

* **Comparison View:**
  * Side-by-side: Current design vs Proposed
  * Visual diff highlighting changes
  * Export simulation report

**Screenshot Mockup:**

```
┌─────────────────────────────────────────────────────────────┐
│  Scenario Lab: XUV700                    Profile: P50M      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🎛️ Design Parameters                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Sill Height                                            │ │
│  │ [──────●────────] 545mm (Δ -15mm) 📈 +0.3            │ │
│  │                                                        │ │
│  │ Door Opening Width                                     │ │
│  │ [────────●──────] 740mm (Δ +15mm) 📈 +0.2            │ │
│  │                                                        │ │
│  │ Seat H-Point Height                                    │ │
│  │ [───────●───────] 680mm (Δ -5mm)  📉 -0.1            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  📊 Predicted Impact                                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Current Rating:   8.6                                  │ │
│  │ Predicted Rating: 9.0  (Δ +0.4) ✅                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  💡 AI Recommendations                                       │
│  • Reduce sill height by 15-20mm for best improvement      │
│  • Increased door width provides marginal gain              │
│  • Lowering seat height may affect rear legroom            │
│                                                               │
│  [Reset] [Save Scenario] [Generate Report]                  │
└─────────────────────────────────────────────────────────────┘
```

---

### 7.4 Model Performance Dashboard

**Target Users:** Data Scientists, Managers

**Features:**
* **Accuracy Metrics:**
  * Overall accuracy (95.6%)
  * Per-profile breakdown
  * RMSE, MAE, R² scores
  * Confidence intervals

* **Error Distribution:**
  * Histogram of prediction errors
  * Outlier identification
  * Error analysis by vehicle segment

* **Actual vs Predicted Scatter:**
  * Diagonal reference line
  * Color-coded by profile
  * Hover for vehicle details

* **Data Coverage:**
  * Bar chart showing sample count per vehicle
  * Flag under-represented models
  * Training vs test set split visualization

* **Model Metadata:**
  * Version number
  * Training date
  * Feature list (41 features)
  * Ensemble weights

**Screenshot Mockup:**

```
┌─────────────────────────────────────────────────────────────┐
│  Model Performance                       Model: v2.3.1       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  🎯 Accuracy Metrics                                         │
│  ┌────────────────────┬────────────────────┐                │
│  │ Overall Accuracy   │ 95.6% ✅           │                │
│  │ RMSE               │ 0.39 rating points │                │
│  │ MAE                │ 0.31 rating points │                │
│  │ R² Score           │ 0.94               │                │
│  └────────────────────┴────────────────────┘                │
│                                                               │
│  📊 Error Distribution                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │     Frequency                                          │ │
│  │  200│                                                  │ │
│  │  150│        ████                                      │ │
│  │  100│      ████████                                    │ │
│  │   50│    ████████████                                  │ │
│  │    0└───────────────────────────────────              │ │
│  │       -1.0  -0.5   0   +0.5  +1.0  Error              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  📈 Actual vs Predicted                                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 10│                                        ●●●         │ │
│  │  9│                                    ●●●●            │ │
│  │  8│                              ●●●●●                 │ │
│  │  7│                        ●●●●●                       │ │
│  │  6│                  ●●●●●                             │ │
│  │  5│            ●●●●●                                   │ │
│  │  4│      ●●●●●                                         │ │
│  │  3│ ●●●●●                                              │ │
│  │   └────────────────────────────────────               │ │
│  │    3   4   5   6   7   8   9  10  Predicted           │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### 7.5 AI Copilot

**Target Users:** All user types

**Features:**
* **Natural Language Interface:**
  * Chat-based interaction
  * Context-aware responses
  * Suggested queries for new users

* **Query Capabilities:**
  * "Which vehicles have poorest ratings for seniors?"
  * "Compare Scorpio-N and XUV700 for P95M"
  * "What happens if I reduce sill height by 20mm for Thar?"
  * "Write a design review summary for XUV700"
  * "Why does Thar rate poorly for seniors?"

* **Response Types:**
  * Text explanations with markdown formatting
  * Interactive tables (rankings, comparisons)
  * Recommendation cards (design improvements)
  * Visualizations (charts embedded in chat)

* **Export Options:**
  * Copy responses to clipboard
  * Export chat history as PDF
  * Generate PowerPoint-ready summaries

**Screenshot Mockup:**

```
┌─────────────────────────────────────────────────────────────┐
│  🤖 Ergo AI Copilot                                  [×]     │
├─────────────────────────────────────────────────────────────┤
│  💬 Chat History                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 👤 You: Which vehicles have poorest ratings for       │ │
│  │    seniors?                                            │ │
│  │                                                        │ │
│  │ 🤖 AI: Based on the portfolio data, these three      │ │
│  │    vehicles have the lowest ingress ratings for       │ │
│  │    seniors (65+):                                      │ │
│  │                                                        │ │
│  │    ┌─────────────────────────────────────┐            │ │
│  │    │ 1. Thar          5.7/10 🔴         │            │ │
│  │    │ 2. Bolero        5.7/10 🔴         │            │ │
│  │    │ 3. XUV300        7.1/10 🟡         │            │ │
│  │    └─────────────────────────────────────┘            │ │
│  │                                                        │ │
│  │    Key issues:                                         │ │
│  │    • High sill heights (>580mm)                       │ │
│  │    • Narrow door apertures                            │ │
│  │    • Limited headroom clearance                       │ │
│  │                                                        │ │
│  │    [View Details] [Suggest Improvements]              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  💬 Your Message                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Type your question...                            [📤]  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  💡 Suggested Queries:                                       │
│  • Compare Scorpio-N and XUV700                             │
│  • How to improve Thar's rating?                            │
│  • What makes XUV700 perform well?                          │
└─────────────────────────────────────────────────────────────┘
```

---

### 7.6 CAD Preprocessing AI Chatbot

**Target Users:** Data Scientists, CAD Engineers

**Features:**
* **Expert Guidance:**
  * Methods for processing .stp files
  * 3D geometry extraction techniques
  * Door opening and seat geometry algorithms
  * 24 KPI feature engineering pipeline

* **Code Examples:**
  * Production-ready Python implementations
  * OpenCascade/FreeCAD usage examples
  * Mesh processing workflows
  * Anthropometry integration code

* **Accuracy Optimization:**
  * Achieving 95% model accuracy
  * Data quality requirements
  * Feature importance analysis
  * Model architecture recommendations

* **Interactive Q&A:**
  * "What preprocessing methods should I use for .stp CAD files?"
  * "How to extract door opening geometry from CAD?"
  * "Recommend CAD feature extraction pipeline"
  * "How to handle seat position data?"
  * "Best practices for anthropometry integration"

**Located:** Bottom-left corner (separate from Ergo AI Copilot)  
**Panel Size:** 680x820px with premium gradient UI  
**Badge:** "CAD AI EXPERT" indicator

---

## 8. Timeline & Deliverables

### Phase 1: Foundation (Weeks 1-8)

**Week 1-2: Requirements & Setup**
- ✅ Finalize data requirements with Mahindra team
- ✅ Set up development environment
- ✅ Establish data transfer protocols

**Week 3-5: CAD Processing Pipeline**
- ✅ Develop 3D CAD import module (OpenCascade integration)
- ✅ Implement semantic segmentation
- ✅ Build KPI extraction algorithms (24 features)
- ✅ Create validation scripts

**Week 6-8: Data Collection & Labeling**
- ✅ Collect .stp files for 20+ vehicles
- ✅ Conduct physical testing for rating labels
- ✅ Build training dataset (1,500+ samples)
- ✅ Data quality validation

**Deliverables:**
- CAD processing microservice (REST API)
- Training dataset with 1,500+ labeled samples
- Data validation report

---

### Phase 2: AI Model Development (Weeks 9-16)

**Week 9-10: Feature Engineering**
- ✅ Implement derived features (12 interaction terms)
- ✅ Anthropometry integration module
- ✅ Feature scaling and normalization

**Week 11-13: Model Training**
- ✅ Train ensemble models (XGBoost, LightGBM, CatBoost, NN)
- ✅ Hyperparameter tuning
- ✅ Cross-validation (10-fold)

**Week 14-16: Validation & Optimization**
- ✅ Test set evaluation
- ✅ Error analysis and model refinement
- ✅ SHAP analysis for explainability
- ✅ Model registration in MLflow

**Deliverables:**
- Trained AI model achieving 95%+ accuracy
- Model performance report
- Feature importance analysis
- Prediction API service

---

### Phase 3: Portal Development (Weeks 17-24)

**Week 17-19: Frontend Development**
- ✅ Build Next.js application structure
- ✅ Implement Portfolio Overview dashboard
- ✅ Develop Vehicle Detail view
- ✅ Create Scenario Lab simulator

**Week 20-21: Backend Integration**
- ✅ Develop REST APIs (Node.js/FastAPI)
- ✅ Integrate CAD processing service
- ✅ Connect AI prediction model
- ✅ Set up PostgreSQL database

**Week 22-23: AI Copilot & Advanced Features**
- ✅ Build natural language interface
- ✅ Implement context-aware response logic
- ✅ Develop CAD Preprocessing AI chatbot
- ✅ Add Model Performance dashboard
- ✅ Create Data Inspector

**Week 24: Testing & Deployment**
- ✅ End-to-end testing
- ✅ Performance optimization
- ✅ Security audit
- ✅ Production deployment

**Deliverables:**
- Fully functional ErgoSight portal
- User documentation (guides, videos)
- Admin documentation (deployment, maintenance)
- Deployment on Mahindra infrastructure

---

### Phase 4: Rollout & Training (Weeks 25-28)

**Week 25-26: User Training**
- ✅ Conduct training sessions for engineers
- ✅ Create video tutorials
- ✅ Provide hands-on workshops

**Week 27-28: Pilot Deployment**
- ✅ Limited rollout to 2-3 vehicle programs
- ✅ Gather user feedback
- ✅ Monitor system performance
- ✅ Fix bugs and refine UX

**Deliverables:**
- Trained user base (50+ engineers)
- Pilot project reports
- Refined production system
- Continuous improvement roadmap

---

### Timeline Summary

```
┌─────────────────────────────────────────────────────────────┐
│  GANTT CHART: 28-WEEK IMPLEMENTATION TIMELINE               │
├─────────────────────────────────────────────────────────────┤
│  Week  │ 0  4   8  12  16  20  24  28                       │
│  ──────┼───────────────────────────────────────────────────│
│  Phase 1│████████                                           │
│  Phase 2│        ████████                                   │
│  Phase 3│                ████████████                       │
│  Phase 4│                            ████                   │
│  ──────┼───────────────────────────────────────────────────│
│         │ Found. │ AI Dev │ Portal │ Rollout                │
└─────────────────────────────────────────────────────────────┘
```

**Total Duration:** 28 weeks (≈7 months)  
**Go-Live Date:** After Week 24  
**Full Production:** After Week 28

---

## 9. Success Metrics

### Technical Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| **Model Accuracy** | ≥95% | R² score on hold-out test set |
| **Prediction Speed** | <50ms | API response time (95th percentile) |
| **CAD Processing Time** | <20 min | End-to-end .stp to KPIs |
| **System Uptime** | 99.5% | Monthly availability monitoring |
| **API Error Rate** | <0.1% | Failed requests / total requests |

---

### Business Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| **Design Iteration Reduction** | 30% | Time from CAD to validation sign-off |
| **Ergonomic Issues Caught Early** | 80% | Issues found pre-prototype vs post-prototype |
| **User Adoption** | 75% | Engineers using ErgoSight weekly |
| **Cost Savings** | ₹50L/year | Reduced physical testing + faster iterations |
| **Portfolio Improvement** | +0.5 avg rating | Year-over-year portfolio rating increase |

---

### User Satisfaction Metrics

| Metric | Target | How Measured |
|--------|--------|--------------|
| **NPS Score** | ≥50 | Quarterly user surveys |
| **Task Completion Rate** | ≥90% | Users successfully complete key workflows |
| **Time to Insight** | <5 min | From login to actionable recommendation |
| **Support Ticket Volume** | <10/month | Technical issues requiring support |

---

## 10. Investment & ROI

### Cost Breakdown (7-Month Project)

| Category | Cost (₹ Lakhs) | Notes |
|----------|----------------|-------|
| **Team (7 months)** | 80 | 4 engineers + 1 PM + 1 designer |
| **Infrastructure** | 15 | Servers, storage, GPUs for training |
| **CAD Software Licenses** | 10 | OpenCascade/FreeCAD tools |
| **Data Collection** | 20 | Physical testing, labeling effort |
| **Training & Rollout** | 8 | User training, documentation |
| **Contingency (15%)** | 20 | Buffer for scope changes |
| **Total** | **₹153 Lakhs** | |

---

### ROI Projection (3-Year Horizon)

**Year 1:**
- Cost savings from reduced physical testing: ₹30L
- Faster design iterations (15 fewer prototypes): ₹40L
- **Net Savings: ₹70L**

**Year 2:**
- Additional savings from expanded portfolio coverage: ₹50L
- Improved vehicle ratings → market differentiation: ₹80L
- **Net Savings: ₹130L**

**Year 3:**
- Cumulative efficiency gains: ₹60L
- Regulatory compliance cost avoidance: ₹40L
- **Net Savings: ₹100L**

**3-Year Total Savings: ₹300L**  
**3-Year ROI: 96%**  
**Payback Period: 18 months**

---

## 11. Risk Mitigation

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Insufficient Training Data** | High | Start with pilot vehicles, iteratively expand dataset |
| **CAD File Compatibility** | Medium | Support multiple CAD formats, build robust parsers |
| **Model Accuracy Below Target** | High | Ensemble approach, iterative refinement, expert review |
| **API Performance Issues** | Medium | Load testing, caching, horizontal scaling |

---

### Organizational Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Low User Adoption** | High | Early stakeholder involvement, training programs |
| **Resistance to AI Predictions** | Medium | Transparent explainability, validation against known vehicles |
| **Data Access Delays** | Medium | Establish data-sharing protocols upfront |
| **Scope Creep** | Medium | Clear requirements freeze, change control process |

---

## 12. Next Steps

### Immediate Actions (Next 2 Weeks)

1. **Kickoff Meeting** – Align on requirements, timeline, team
2. **Data Audit** – Assess availability of .stp files, test data, anthropometry databases
3. **Tool Selection** – Finalize CAD processing libraries (OpenCascade vs FreeCAD vs proprietary)
4. **Infrastructure Setup** – Provision servers, set up dev/test/prod environments
5. **Team Onboarding** – Assemble cross-functional team (CAD, AI, frontend, backend)

---

### Decision Points

| Decision | Options | Recommendation |
|----------|---------|----------------|
| **CAD Engine** | OpenCascade, FreeCAD, Siemens API | OpenCascade (industry standard, robust) |
| **ML Framework** | TensorFlow, PyTorch, Scikit-Learn | Scikit-Learn + XGBoost (simpler, faster) |
| **Backend Language** | Python (FastAPI), Node.js (Express) | Python FastAPI (ML integration ease) |
| **Deployment** | Cloud (AWS/Azure), On-Prem | On-Prem (Mahindra preference, data security) |
| **Database** | PostgreSQL, MongoDB | PostgreSQL (structured data, ACID compliance) |

---

## 13. Conclusion

### Summary

This proposal outlines a comprehensive **AI-driven ingress/egress optimization system** that:

✅ **Processes full 3D CAD** (surfaces, edges, clearances) to extract 24 geometric KPIs  
✅ **Achieves 95%+ prediction accuracy** using ensemble ML models  
✅ **Provides interactive portal** for engineers, managers, and executives  
✅ **Enables real-time what-if simulations** for design optimization  
✅ **Delivers measurable ROI** with 18-month payback period  

---

### Strategic Value

**For Mahindra Engineering:**
- Faster, data-driven design decisions
- Comprehensive coverage across all user profiles
- Early detection of ergonomic issues
- Competitive advantage through superior ergonomics

**For End Customers:**
- Improved vehicle accessibility for all body types
- Enhanced comfort and ease of use
- Better experience for seniors and diverse populations

---

### Competitive Advantage

Most automotive OEMs rely on **late-stage physical testing** for ergonomics validation. This system enables Mahindra to:

🚀 **Optimize designs in CAD stage** (months earlier)  
🚀 **Cover 100% of user profiles** (not just P50M)  
🚀 **Quantify improvements** with precise ratings  
🚀 **Benchmark against competitors** systematically  

---

### Call to Action

We recommend **proceeding with Phase 1** immediately to:

1. Build the 3D CAD processing pipeline
2. Collect training data for 20+ vehicles
3. Develop initial AI model
4. Demonstrate proof-of-concept by Week 16

**Let's transform Mahindra's ergonomics process with AI! 🚀**

---

<div style="background: #f7fafc; padding: 2rem; border-left: 4px solid #667eea; margin: 2rem 0;">

### 📞 Contact Information

**Marklytics Team**  
Email: ergosight@marklytics.ai  
Phone: +91-XXXX-XXXXXX  
Website: www.marklytics.ai

**Project Lead:** [Name]  
**Technical Lead:** [Name]  
**Design Lead:** [Name]

</div>

---

**Document Version:** 3.0 (3D-First Architecture)  
**Date:** November 20, 2025  
**Status:** ✅ Ready for Review  
**Next Update:** After kickoff meeting

---

*Prepared with excellence for Mahindra & Mahindra's Vehicle Engineering Division*

