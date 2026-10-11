# AeroPulse — Air Quality Monitor & Runner's Safety Hub
### (Malaysia & Global)

A comprehensive real-time air quality monitoring application and sports physiology runner advisor built specifically for **Perai (Penang)**, **Kuala Lumpur**, and **Alor Setar (Kedah)**, alongside custom location search across Malaysia and worldwide.

---

## 🏃 Runner's Outdoor Air Quality & Safe Workout Advisor

Running multiplies pulmonary minute ventilation by **10x to 15x** (rising from $\sim 6\text{ L/min}$ to $80-140\text{ L/min}$). Deep mouth-breathing bypasses natural nasal filtration, drawing ultra-fine PM2.5 directly into alveolar capillaries.

The app features a sports-science-backed workout advisor detailing:
* **Outdoor Running Safety Verdict**: (*Optimal*, *Generally Safe*, *Caution*, *Indoor Recommended*, *Hazardous*).
* **Intensity-Based Duration Limits**:
  * **Low Intensity (Zone 1 - 2 / Easy Jog / Base Aerobic, HR < 70% Max)**: Recommended max duration (e.g. `90+ mins` if Good, `60-75 mins` if Moderate, `30-40 mins` if Sensitive, `10-15 mins` or brisk walk if Unhealthy).
  * **Moderate Intensity (Zone 3 / Steady Tempo / Marathon Pace, HR 70-80% Max)**: Recommended max duration (e.g. `60-90 mins` if Good, `30-45 mins` if Moderate, `15-20 mins` if Sensitive, `0 min / Move Indoors` if Unhealthy).
  * **High Intensity (Zone 4 - 5 / Track Intervals / VO2 Max / 5K Pace, HR > 80% Max)**: Recommended max duration (e.g. `45-60 mins` if Good, `20-30 mins` if Moderate, `0 min / Strictly Prohibited` if Unhealthy).
* **Optimal Clean Air Running Window**: Analyzes the 48-hour hourly diurnal forecast to identify the cleanest morning or evening hour to run.
* **Tropical Microclimate & Heat Index**: Tracks ambient temperature, relative humidity, and heat index for hydration and pre-cooling alerts.
* **Runner's Practical Protocol**: Route choice (>200m away from expressways), post-run saline nasal rinse, and indoor treadmill transition guidelines.

---

## 📦 App Editions & How to Run

### 1. 📱 Native Python Mobile Version (iPhone 15 Pro Max — 100% Zero HTML / Zero WebViews!)
A standalone native GUI application simulating the **iPhone 15 Pro Max** (`440 × 920` pt) with **zero HTML, zero WebViews, and zero browser dependencies**:
* **Launcher**: Double-click [`run_mobile_python.bat`](file:///d:/Google%20Drive/My%20Drive/Misc/Air%20Quality/run_mobile_python.bat) or run:
  ```powershell
  python standalone_mobile.py
  ```
* **Features**:
  * **Realistic iPhone 15 Pro Max Shell**: Dynamic Island camera capsule, live clock, 5G & battery indicators, and iOS Home Indicator bar.
  * **Segmented City Selector**: Switch between **Perai** (`156 AQI` Unhealthy), **Kuala Lumpur** (`201 AQI` Very Unhealthy), and **Alor Setar** (`94 AQI` Moderate) with live color badges.
  * **Dedicated PM2.5 Card**: Displays both the **US EPA AQI Reading** and raw **Atmospheric Mass Concentration ($\mu\text{g/m}^3$)**, WHO guideline ratio, and today's ground station range.
  * **Continuous 48-Hour Trend Graph**: Native Tkinter canvas with smooth spline curve, past 24h observed history vs. next 24h forecast, "NOW" vertical divider, and toggles between AQI and concentration ($\mu\text{g/m}^3$).
  * **Runner Safety Hub**: Specific outdoor workout duration limits for Zone 1-2 (Base), Zone 3 (Tempo), and Zone 4-5 (Intervals), cleanest morning window, and heat index.
  * **Search & Multi-City Compare**: Search any city in Malaysia or worldwide, plus side-by-side comparison cards.

---

### 2. 🍏 Pure Native iOS App (Swift & SwiftUI — Zero HTML)
For deploying directly onto a physical **iPhone 15 Pro Max** using Xcode or Swift Playgrounds:
* **Source File**: [`AeroPulseMobileApp.swift`](file:///d:/Google%20Drive/My%20Drive/Misc/Air%20Quality/AeroPulseMobileApp.swift)
* **Technology**: 100% native Apple SwiftUI (`WindowGroup`, `TabView`, `Path` vector graphics, `@State` reactivity) with zero WebViews or HTML.
* **How to Run on iPhone**:
  1. Open Xcode on macOS or Swift Playgrounds on iPad/Mac.
  2. Drag and drop [`AeroPulseMobileApp.swift`](file:///d:/Google%20Drive/My%20Drive/Misc/Air%20Quality/AeroPulseMobileApp.swift) into the project.
  3. Run on your iPhone 15 Pro Max simulator or connected physical device.

---

### 3. 📱 Standalone Mobile Web / PWA Version (iPhone 15 Pro Max)
A self-contained mobile web application designed specifically for iPhone Safari:
* **Direct File**: Double-click [`run_mobile_standalone.bat`](file:///d:/Google%20Drive/My%20Drive/Misc/Air%20Quality/run_mobile_standalone.bat) or open [`standalone_mobile.html`](file:///d:/Google%20Drive/My%20Drive/Misc/Air%20Quality/standalone_mobile.html) directly.
* **Open on your iPhone over Wi-Fi**:
  1. Make sure your iPhone is on the same Wi-Fi network as this PC.
  2. Open Safari on your iPhone and type:
     ```
     http://192.168.0.8:5050/standalone_mobile.html
     ```
  3. **Install as App Icon**: Tap Safari **Share** icon -> **"Add to Home Screen"**.

---

### 4. 🖥️ Purely Desktop Version (Native Windows GUI)
A standalone Windows desktop application with zero browser dependency:
* **Launcher**: Double-click [`run_desktop.bat`](file:///d:/Google%20Drive/My%20Drive/Misc/Air%20Quality/run_desktop.bat) or run:
  ```powershell
  python desktop_app.py
  ```
* **Features**:
  * Native Tkinter dark theme GUI.
  * Instant city tabs for **Perai**, **Kuala Lumpur**, and **Alor Setar**.
  * Dedicated **Runner's Outdoor Suitability** block with intensity duration limits.
  * Real-time AQI and PM2.5 gauges with WHO compliance indicators.
  * Custom location search bar with keyboard shortcuts.
  * Non-blocking background threading for smooth performance.

---

### 5. 🌐 Full Web Dashboard (Desktop & Responsive)
Access the comprehensive web dashboard with interactive charts, multi-source verification tables, and Leaflet Malaysia map:
* **Launcher**: Double-click [`run_app.bat`](file:///d:/Google%20Drive/My%20Drive/Misc/Air%20Quality/run_app.bat) or run:
  ```powershell
  python server.py --open
  ```
* **URL**: [http://localhost:5050](http://localhost:5050)

---

## 🛡️ Multi-Source Cross-Verification

The application cross-references multiple independent data sources:
1. **WAQI / AQICN & Malaysia Department of Environment (DOE / APIMS)**:
   * Continuous emission ground monitoring stations.
   * Specific feeds:
     * [Perai](https://aqicn.org/city/malaysia/pulau-pinang/perai/)
     * [Kuala Lumpur](https://aqicn.org/city/kuala-lumpur/)
     * [Alor Setar](https://aqicn.org/city/malaysia/kedah/alor-setar/)
2. **Copernicus Atmosphere Monitoring Service (CAMS Global 40km)**:
   * European Centre for Medium-Range Weather Forecasts (ECMWF) satellite and numerical atmospheric chemistry modeling.
3. **NOAA Global Forecast System (GFS Aerosols & Ozone)**:
   * US National Oceanic and Atmospheric Administration chemical forecast models.
4. **Open-Meteo Surface Microclimate**:
   * High-resolution temperature, relative humidity, apparent temperature (heat index), wind speed, and UV index.
5. **WHO Global Air Quality Guidelines (2021)**:
   * Quantitative benchmark against the WHO 24-hour PM2.5 safety limit ($15\,\mu\text{g}/\text{m}^3$).
6. **Malaysian APIMS / IPU Standards**:
   * National Environmental Quality Ambient Air Standards (*Baik*, *Sederhana*, *Tidak Sihat*, *Sangat Tidak Sihat*, *Berbahaya*).

---

## 🚀 Automated 24/7 GitHub Actions Sync (Mobile & GitHub Pages)

The repository includes an automated GitHub Actions workflow ([`.github/workflows/update_aqi.yml`](.github/workflows/update_aqi.yml)) that queries the official Malaysian DOE continuous ground monitoring stations every hour:

### How to Enable on GitHub:
1. Push your repository to GitHub:
   ```powershell
   git init
   git add .
   git commit -m "feat: AeroPulse with 24/7 GitHub Actions Ground Sync"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
   git push -u origin main
   ```
2. In your GitHub repository:
   * Go to **Settings** -> **Actions** -> **General** -> **Workflow permissions**.
   * Select **"Read and write permissions"** and click **Save** (this allows the bot to push fresh hourly readings).
   * Go to **Settings** -> **Pages** -> set Source to **"Deploy from a branch"** (branch: `main`, folder: `/ (root)` or `/github_pages_mobile`).
3. **Result**:
   * GitHub Actions automatically runs at `:15` past every hour, pulling fresh ground station observations and the 24-hour historical log.
   * Your live mobile web app hosted on GitHub Pages will always stay 100% synchronized with official Department of Environment monitors, with **zero PC dependency**!
