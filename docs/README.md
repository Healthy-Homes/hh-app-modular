# Healthy Homes Practitioner App (shelter.health)

## Technical Overview

### What This Application Does

The Healthy Homes Practitioner App is a bilingual (English/Chinese) web-based assessment tool designed for public health practitioners, housing inspectors, and community health workers. It combines home inspection checklists with Social Determinants of Health (SDOH) questionnaires to generate comprehensive risk assessments and FHIR-compliant health data exports.

### Current Architecture

The application follows a modular ES6 architecture with clean separation of concerns:

#### **Core Modules**
- **`main.js`** - Application initialization and orchestration
- **`i18n.js`** - Internationalization system supporting dynamic language switching
- **`checklist-loader.js`** - Loads and renders home inspection checklist items from CSV data
- **`sdoh-loader.js`** - Loads and renders SDOH questionnaire from CSV data
- **`consent.js`** - Manages resident consent and identification forms

#### **Risk Assessment System**
- **`risk-model.js`** - Calculates risk scores based on assessment responses
- **`risk-weights.js`** - Configurable risk scoring weights for checklist items and SDOH factors
- **Risk Categories**: Home Risk, Social Risk, and Total Risk with Low/Moderate/High classifications

#### **Data Export & Interoperability**
- **`fhir-export.js`** - Generates HL7 FHIR-compliant bundles for health system integration
- **`pdf-export.js`** - Creates comprehensive PDF reports with assessment results
- **FHIR Structure**: Proper Patient, Observation, and Bundle resources with coded systems

#### **Geospatial Features**
- **`map.js`** - Interactive MapLibre GL map showing neighborhood risk areas
- **GeoJSON Integration**: Displays environmental risk polygons with color-coded risk levels
- **Location Services**: Automatic user location detection with fallback coordinates

#### **Data Architecture**
```
data/
├── checklist.csv     # Home inspection items (item_key, label_key, description_key, code, code_system)
├── sdoh.csv         # SDOH questions (id, label_key, opt1_key, opt2_key, opt3_key, code, code_system)
└── mock-risk-area.geojson  # Environmental risk area polygons

lang/
├── en.json          # English translations for all UI elements and form labels
└── zh.json          # Chinese translations for bilingual support
```

### Key Technical Features

#### **Modular CSV-Driven Content**
- Assessment items loaded dynamically from CSV files
- Translation keys mapped to multilingual JSON files
- Easy expansion through data file modifications without code changes

#### **FHIR Compliance**
- Generates valid HL7 FHIR R4 bundles
- Proper coding systems for interoperability
- Patient consent tracking and data provenance

#### **Risk Scoring Engine**
- Configurable weights for different risk factors
- Composite scoring across multiple domains
- Real-time score calculation and visualization

#### **Responsive Design**
- Tailwind CSS for mobile-first responsive design
- Progressive enhancement for offline capability
- Cross-browser compatibility

#### **Error Handling & Resilience**
- Graceful degradation when components fail to load
- Comprehensive error logging for debugging
- User-friendly error messages with technical details available

### Current Functionality

1. **Bilingual Assessment Interface** - Practitioners can switch between English and Chinese
2. **Home Inspection Checklist** - 27 common housing health hazards with yes/no responses
3. **SDOH Questionnaire** - 11 social determinant factors with multiple choice responses
4. **Interactive Risk Map** - Visual display of neighborhood environmental risk areas
5. **Risk Score Calculation** - Automated scoring with Low/Moderate/High classifications
6. **PDF Report Generation** - Comprehensive reports including FHIR data preview
7. **Consent Management** - Resident consent tracking and documentation

### Data Flow

```
CSV Files → Loaders → UI Components → User Input → Risk Calculation → FHIR Bundle → PDF Export
     ↓
Translation Files → i18n System → Localized UI
     ↓
GeoJSON → Map Component → Risk Area Visualization
```

### Technical Stack

- **Frontend**: Vanilla JavaScript ES6 modules, HTML5, CSS3
- **Styling**: Tailwind CSS via CDN
- **Mapping**: MapLibre GL JS with OpenStreetMap tiles
- **PDF Generation**: pdfMake library
- **Standards Compliance**: HL7 FHIR R4
- **Hosting**: GitHub Pages compatible (static files only)

---

# Enhancement Roadmap

## 🎯 Phase 1: FHIR Export Enhancement (Easy - 1 day)

### QR Code Generation
- **Library**: Use `qrcode.js` or `qrious` library
- **Implementation**: 
  - Generate QR code containing FHIR bundle JSON or a shortened URL
  - Add QR code to PDF export
  - Option to display QR code on screen for mobile scanning

### Magic Link Generation
- **Backend**: Simple Node.js/Express server or serverless function
- **Flow**: 
  1. POST FHIR bundle to server
  2. Server stores bundle with unique ID
  3. Returns shareable URL: `https://yourapp.com/report/abc123`
  4. QR code points to this URL
- **Storage**: Simple JSON file storage or lightweight database

```javascript
// Example implementation
const shareableLink = await uploadFHIRBundle(bundle);
const qrCode = generateQRCode(shareableLink);
addQRCodeToPDF(qrCode);
```

---

## 🌍 Phase 2: Environmental Data Integration (Medium - 2-3 days)

### Location-Based Data APIs

#### Air Quality APIs
- **EPA AirNow API** (US) - Real-time air quality
- **OpenWeatherMap Air Pollution API** - Global coverage
- **PurpleAir API** - Hyperlocal PM2.5 data

#### Environmental Justice APIs
- **EPA EJScreen API** - Environmental justice indicators
- **CDC Social Vulnerability Index** - Community vulnerability data
- **USGS Water Quality API** - Water contamination data

#### Climate & Weather APIs
- **NOAA Climate Data** - Temperature, humidity, precipitation
- **OpenWeatherMap** - Current/forecast weather conditions

### Implementation Strategy
```javascript
// New module: js/environmental-data.js
class EnvironmentalDataService {
  async getLocationData(lat, lon) {
    const [airQuality, ejData, climate] = await Promise.all([
      this.getAirQuality(lat, lon),
      this.getEJScreenData(lat, lon),
      this.getClimateData(lat, lon)
    ]);
    return { airQuality, ejData, climate };
  }
}
```

### Enhanced Risk Scoring
- Add environmental risk factors to `risk-weights.js`
- Weight environmental data based on health impact
- Create composite environmental risk score

---

## 🏠 Phase 3: Actionable Recommendations Engine (Complex - 4-5 days)

### Recommendation Database Structure
```javascript
// New file: js/recommendations-db.js
const RECOMMENDATIONS = {
  moldVisible: {
    priority: 'high',
    impact: 8,
    cost: 'medium',
    timeframe: '1-2 weeks',
    actions: [
      'Remove visible mold with bleach solution',
      'Fix underlying moisture source',
      'Improve ventilation in affected area'
    ],
    healthBenefit: 'Reduces respiratory issues, allergies',
    diyFriendly: true,
    professionalRequired: false
  },
  // ... more recommendations
};
```

### Prioritization Algorithm
```javascript
function calculateRecommendationPriority(item, riskScore, environmentalData, sdohFactors) {
  const baseImpact = RECOMMENDATIONS[item].impact;
  const environmentalMultiplier = getEnvironmentalMultiplier(item, environmentalData);
  const vulnerabilityMultiplier = getVulnerabilityMultiplier(sdohFactors);
  const costEffectiveness = getCostEffectiveness(item);
  
  return (baseImpact * environmentalMultiplier * vulnerabilityMultiplier) / costEffectiveness;
}
```

### Recommendation Categories
1. **Immediate Actions** (0-1 week, high impact, low cost)
2. **Short-term Improvements** (1-4 weeks, medium cost)
3. **Long-term Investments** (1-6 months, higher cost, major impact)
4. **Professional Consultations** (requires expert assessment)

---

## 🏗️ Technical Implementation Plan

### Phase 1: QR Code & Magic Links
**Files to Create/Modify:**
- `js/qr-generator.js` - QR code generation
- `js/share-service.js` - Magic link creation
- `js/pdf-export.js` - Add QR code to PDF
- Simple backend service for link storage

**Dependencies:**
```html
<script src="https://cdn.jsdelivr.net/npm/qrious@4.0.2/dist/qrious.min.js"></script>
```

### Phase 2: Environmental Data
**Files to Create/Modify:**
- `js/environmental-data.js` - API integrations
- `js/risk-model.js` - Enhanced scoring with environmental factors
- `js/risk-weights.js` - Add environmental risk weights
- `data/environmental-apis.json` - API configuration

**API Keys Needed:**
- EPA API key (free)
- OpenWeatherMap API key (free tier available)
- PurpleAir API key (free for non-commercial)

### Phase 3: Recommendations Engine
**Files to Create/Modify:**
- `js/recommendations-engine.js` - Core recommendation logic
- `js/recommendations-db.js` - Recommendation database
- `js/action-plan-generator.js` - Generate prioritized action plans
- New HTML section for recommendations display
- Enhanced PDF export with action plan

---

## 🎨 UI/UX Enhancements

### New Sections to Add
1. **Environmental Risk Panel** - Real-time environmental data
2. **Action Plan Section** - Prioritized recommendations
3. **Share Report Modal** - QR code and magic link display
4. **Progress Tracking** - Mark completed actions

### Enhanced PDF Report Structure
```
1. Executive Summary with QR Code
2. Risk Assessment Scores
3. Environmental Health Context
4. Prioritized Action Plan
   - Immediate Actions (DIY)
   - Short-term Improvements
   - Long-term Investments
   - Professional Referrals
5. Resource Links & Contacts
6. FHIR Data (Technical Section)
```

---

## 📊 Sample Enhanced Risk Calculation

```javascript
function calculateEnhancedRisk(checklist, sdoh, environmental, location) {
  const baseRisk = calculateCurrentRisk(checklist, sdoh);
  
  // Environmental multipliers
  const airQualityRisk = environmental.aqi > 100 ? 1.5 : 1.0;
  const climateRisk = environmental.humidity > 60 ? 1.2 : 1.0;
  const ejRisk = environmental.ejScore > 80 ? 1.3 : 1.0;
  
  // Vulnerability multipliers based on SDOH
  const vulnerabilityMultiplier = calculateVulnerability(sdoh);
  
  return {
    homeRisk: baseRisk.home * climateRisk,
    socialRisk: baseRisk.social * vulnerabilityMultiplier,
    environmentalRisk: (airQualityRisk + ejRisk) * 25, // Scale to 0-100
    totalRisk: Math.min(
      (baseRisk.total * airQualityRisk * climateRisk * ejRisk * vulnerabilityMultiplier),
      100
    )
  };
}
```

---

## 🚀 Implementation Timeline

### Week 1: QR Codes & Magic Links
- **Day 1-2**: QR code generation and PDF integration
- **Day 3-4**: Magic link backend service
- **Day 5**: Testing and integration

### Week 2: Environmental Data
- **Day 1-2**: API integrations and data fetching
- **Day 3-4**: Enhanced risk scoring with environmental factors
- **Day 5**: UI integration and testing

### Week 3: Recommendations Engine
- **Day 1-2**: Recommendation database and prioritization logic
- **Day 3-4**: Action plan generation and UI
- **Day 5**: Enhanced PDF export with action plans

### Week 4: Polish & Testing
- Integration testing
- Performance optimization
- User experience refinement
- Documentation updates

---

## 💡 Future Expansion Ideas

1. **Community Data Integration** - Census data, local health statistics
2. **Seasonal Recommendations** - Weather-based action timing
3. **Cost Estimation** - Integration with local contractor/supply data
4. **Progress Tracking** - Before/after photo uploads, completion tracking
5. **Multi-language Recommendations** - Translate action plans
6. **Integration with Health Records** - FHIR compatibility with EHR systems
7. **Mobile App** - Progressive Web App for field assessments

---

## 🛠️ Required Resources

### APIs & Services
- Environmental data APIs (mostly free tiers available)
- Simple backend hosting (Vercel, Netlify Functions, or AWS Lambda)
- Optional: Database for magic links (could be simple JSON files initially)

### Libraries & Dependencies
- QR code generation library
- HTTP client for API calls
- Enhanced PDF generation capabilities
- Geolocation services

### Data Sources
- EPA environmental justice data
- Air quality monitoring networks
- Climate and weather services
- Health impact research for recommendation weights

---

## 🎯 Vision Statement

This roadmap transforms the Healthy Homes Practitioner App from a simple assessment tool into a comprehensive **Healthy Homes Intelligence Platform** that provides actionable, prioritized guidance based on real-world environmental conditions and social vulnerabilities. The end result will be a powerful tool for public health practitioners, housing inspectors, and community health workers that bridges the gap between assessment and action.