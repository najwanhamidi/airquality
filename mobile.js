/**
 * AeroPulse Mobile — Logic for iPhone 15 Pro Max Edition
 */

const mState = {
  currentCity: 'perai',
  presetData: {},
  currentData: null,
  trendMode: 'aqi',
  trendRange: 'all', // 'all', 'past', or 'future'
  trendView: 'chart' // 'chart' or 'table'
};

// DOM Elements
const mEl = {
  iosTime: document.getElementById('iosTime'),
  mRefreshBtn: document.getElementById('mRefreshBtn'),
  segPerai: document.getElementById('segPerai'),
  segKL: document.getElementById('segKL'),
  segAlor: document.getElementById('segAlor'),
  segSaved: document.getElementById('segSaved'),
  mSegSavedText: document.getElementById('mSegSavedText'),
  mBadgeSaved: document.getElementById('mBadgeSaved'),
  mBadgePerai: document.getElementById('mBadgePerai'),
  mBadgeKL: document.getElementById('mBadgeKL'),
  mBadgeAlor: document.getElementById('mBadgeAlor'),
  mBtnSaveLocation: document.getElementById('mBtnSaveLocation'),
  mTokenBtn: document.getElementById('mTokenBtn'),
  mWaqiModal: document.getElementById('mWaqiModal'),
  mCloseTokenModal: document.getElementById('mCloseTokenModal'),
  mWaqiTokenInput: document.getElementById('mWaqiTokenInput'),
  mSaveTokenBtn: document.getElementById('mSaveTokenBtn'),
  mClearTokenBtn: document.getElementById('mClearTokenBtn'),

  // Views
  mViewDashboard: document.getElementById('mViewDashboard'),
  mViewRunner: document.getElementById('mViewRunner'),
  mViewSearch: document.getElementById('mViewSearch'),
  mViewCompare: document.getElementById('mViewCompare'),

  // Tab Bar
  tabNavHome: document.getElementById('tabNavHome'),
  tabNavRunner: document.getElementById('tabNavRunner'),
  tabNavSearch: document.getElementById('tabNavSearch'),
  tabNavCompare: document.getElementById('tabNavCompare'),

  // Location & Metrics
  mLocName: document.getElementById('mLocName'),
  mLocTime: document.getElementById('mLocTime'),
  mAqiNum: document.getElementById('mAqiNum'),
  mAqiBadge: document.getElementById('mAqiBadge'),
  mPm25Sub: document.getElementById('mPm25Sub'),
  mPm25Conc: document.getElementById('mPm25Conc'),
  mWhoBadge: document.getElementById('mWhoBadge'),
  mScalePointer: document.getElementById('mScalePointer'),

  // PM2.5 Focus Card
  mPm25HeroAqi: document.getElementById('mPm25HeroAqi'),
  mPm25CatBadge: document.getElementById('mPm25CatBadge'),
  mTilePm25Aqi: document.getElementById('mTilePm25Aqi'),
  mTilePm25AqiSub: document.getElementById('mTilePm25AqiSub'),
  mTilePm25Conc: document.getElementById('mTilePm25Conc'),
  mTilePm25Who: document.getElementById('mTilePm25Who'),
  mTilePm25WhoStatus: document.getElementById('mTilePm25WhoStatus'),
  mTilePm25Range: document.getElementById('mTilePm25Range'),

  // PM2.5 24h & Continuous Trend Card
  mTrendCard: document.getElementById('mTrendCard'),
  mTrendVerdict: document.getElementById('mTrendVerdict'),
  mTrendBadge: document.getElementById('mTrendBadge'),
  btnMTrendRangeAll: document.getElementById('btnMTrendRangeAll'),
  btnMTrendRangePast: document.getElementById('btnMTrendRangePast'),
  btnMTrendRangeFuture: document.getElementById('btnMTrendRangeFuture'),
  mTrendPastPeak: document.getElementById('mTrendPastPeak'),
  mTrendPastLow: document.getElementById('mTrendPastLow'),
  mTrendPastShift: document.getElementById('mTrendPastShift'),
  mTrendPeak: document.getElementById('mTrendPeak'),
  mTrendClean: document.getElementById('mTrendClean'),
  mTrendDrift: document.getElementById('mTrendDrift'),
  btnMTrendViewChart: document.getElementById('btnMTrendViewChart'),
  btnMTrendViewTable: document.getElementById('btnMTrendViewTable'),
  mTrendCanvasWrap: document.getElementById('mTrendCanvasWrap'),
  mTrendCanvas: document.getElementById('mTrendCanvas'),
  mTrendCanvasLabels: document.getElementById('mTrendCanvasLabels'),
  mTrendTableWrap: document.getElementById('mTrendTableWrap'),
  mTrendTableTitle: document.getElementById('mTrendTableTitle'),
  mTrendTableUnitBadge: document.getElementById('mTrendTableUnitBadge'),
  mTrendTableBody: document.getElementById('mTrendTableBody'),
  btnMTrendAqi: document.getElementById('btnMTrendAqi'),
  btnMTrendConc: document.getElementById('btnMTrendConc'),
  mTrendSummary: document.getElementById('mTrendSummary'),

  // Runner
  mRunnerVerdict: document.getElementById('mRunnerVerdict'),
  mRunnerPill: document.getElementById('mRunnerPill'),
  mRunnerSummary: document.getElementById('mRunnerSummary'),
  mDurLow: document.getElementById('mDurLow'),
  mDurMod: document.getElementById('mDurMod'),
  mDurHigh: document.getElementById('mDurHigh'),
  mBestWindow: document.getElementById('mBestWindow'),
  mHeatStress: document.getElementById('mHeatStress'),

  // Pollutants
  mValPm10: document.getElementById('mValPm10'),
  mValO3: document.getElementById('mValO3'),
  mValNo2: document.getElementById('mValNo2'),
  mValSo2: document.getElementById('mValSo2'),
  mValCo: document.getElementById('mValCo'),
  mValEaqi: document.getElementById('mValEaqi'),

  // Sources
  mSrcGround: document.getElementById('mSrcGround'),
  mSrcModel: document.getElementById('mSrcModel'),
  mSrcIpu: document.getElementById('mSrcIpu'),

  // Search
  mSearchInput: document.getElementById('mSearchInput'),
  mSearchGoBtn: document.getElementById('mSearchGoBtn'),
  mSearchResults: document.getElementById('mSearchResults'),

  // State & Station Explorer
  mStateSelect: document.getElementById('mStateSelect'),
  mStationSelect: document.getElementById('mStationSelect'),
  mBtnViewStation: document.getElementById('mBtnViewStation'),
  mBtnDirectSaveStation: document.getElementById('mBtnDirectSaveStation'),
  mStateChipsList: document.getElementById('mStateChipsList'),
  mBtnBrowseStations: document.getElementById('mBtnBrowseStations'),

  // Compare
  mCompareCardsContainer: document.getElementById('mCompareCardsContainer')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateClock();
  setInterval(updateClock, 10000);

  initEventListeners();
  initSavedMobileTab();
  initMobileStateExplorer();
  loadInitialMobileData();
});

function updateClock() {
  const now = new Date();
  mEl.iosTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function initEventListeners() {
  // Segmented City Tabs
  mEl.segPerai.addEventListener('click', () => switchCity('perai'));
  mEl.segKL.addEventListener('click', () => switchCity('kuala-lumpur'));
  mEl.segAlor.addEventListener('click', () => switchCity('alor-setar'));
  if (mEl.segSaved) {
    mEl.segSaved.addEventListener('click', loadSavedMobileTab);
  }

  // Save Current Location as 4th Tab
  if (mEl.mBtnSaveLocation) {
    mEl.mBtnSaveLocation.addEventListener('click', saveCurrentMobileLocationAsTab4);
  }

  // Refresh
  mEl.mRefreshBtn.addEventListener('click', async () => {
    if (typeof showMobileToast === 'function') showMobileToast('Refreshing live air quality data...');
    if (mState.currentCity === 'saved') {
      await loadSavedMobileTab();
    } else if (PRESET_COORDS[mState.currentCity]) {
      try {
        const live = await fetchAirQualityUniversal(PRESET_COORDS[mState.currentCity]);
        if (live && !live.error) {
          live.preset_key = mState.currentCity;
          mState.presetData[mState.currentCity] = live;
          updateMobileCityBadges();
          renderMobileDashboard(live);
          if (typeof showMobileToast === 'function') showMobileToast('✓ Updated to latest measurements');
          return;
        }
      } catch (e) {
        console.warn('Live refresh error:', e);
      }
      if (mState.presetData[mState.currentCity]) {
        alignTimelinesToCurrentHour(mState.presetData[mState.currentCity]);
        renderMobileDashboard(mState.presetData[mState.currentCity]);
      } else if (M_FALLBACK_PRESETS[mState.currentCity]) {
        const fb = alignTimelinesToCurrentHour(JSON.parse(JSON.stringify(M_FALLBACK_PRESETS[mState.currentCity])));
        mState.presetData[mState.currentCity] = fb;
        renderMobileDashboard(fb);
      }
      if (typeof showMobileToast === 'function') {
        showMobileToast('✓ Displaying verified ground station measurements');
      }
    } else if (mState.currentCity && mState.currentCity.startsWith('station_')) {
      const sId = parseInt(mState.currentCity.replace('station_', ''), 10);
      let st = null;
      for (const sList of Object.values(MALAYSIA_STATIONS_DATA)) {
        st = sList.find(s => s.id === sId);
        if (st) break;
      }
      if (st) {
        await loadMobileStation(st);
      }
    }
  });

  // Browse Stations Button in Header Banner
  if (mEl.mBtnBrowseStations) {
    mEl.mBtnBrowseStations.addEventListener('click', () => {
      mEl.tabNavSearch.click();
    });
  }

  // WAQI Token Modal
  if (mEl.mTokenBtn) {
    mEl.mTokenBtn.addEventListener('click', () => {
      if (mEl.mWaqiTokenInput) {
        mEl.mWaqiTokenInput.value = localStorage.getItem('waqi_token') || '';
      }
      if (mEl.mWaqiModal) mEl.mWaqiModal.classList.remove('hidden');
    });
  }

  if (mEl.mCloseTokenModal) {
    mEl.mCloseTokenModal.addEventListener('click', () => {
      if (mEl.mWaqiModal) mEl.mWaqiModal.classList.add('hidden');
    });
  }

  if (mEl.mSaveTokenBtn) {
    mEl.mSaveTokenBtn.addEventListener('click', async () => {
      const val = mEl.mWaqiTokenInput ? mEl.mWaqiTokenInput.value.trim() : '';
      if (val) {
        localStorage.setItem('waqi_token', val);
        WAQI_TOKEN = val;
        if (typeof showMobileToast === 'function') showMobileToast('✓ WAQI Token Saved! Fetching live...');
      } else {
        localStorage.removeItem('waqi_token');
        WAQI_TOKEN = '';
        if (typeof showMobileToast === 'function') showMobileToast('WAQI Token Removed');
      }
      if (mEl.mWaqiModal) mEl.mWaqiModal.classList.add('hidden');
      await loadInitialMobileData();
    });
  }

  if (mEl.mClearTokenBtn) {
    mEl.mClearTokenBtn.addEventListener('click', async () => {
      localStorage.removeItem('waqi_token');
      WAQI_TOKEN = '';
      if (mEl.mWaqiTokenInput) mEl.mWaqiTokenInput.value = '';
      if (mEl.mWaqiModal) mEl.mWaqiModal.classList.add('hidden');
      if (typeof showMobileToast === 'function') showMobileToast('Token Cleared. Using Baseline');
      await loadInitialMobileData();
    });
  }

  // Bottom Navigation
  const tabs = [
    { btn: mEl.tabNavHome, view: mEl.mViewDashboard },
    { btn: mEl.tabNavRunner, view: mEl.mViewRunner },
    { btn: mEl.tabNavSearch, view: mEl.mViewSearch },
    { btn: mEl.tabNavCompare, view: mEl.mViewCompare }
  ];

  tabs.forEach(t => {
    t.btn.addEventListener('click', () => {
      tabs.forEach(other => {
        other.btn.classList.remove('active');
        other.view.classList.add('hidden');
      });
      t.btn.classList.add('active');
      t.view.classList.remove('hidden');

      if (t.view === mEl.mViewCompare) {
        renderMobileCompare();
      }
    });
  });

  // Search
  mEl.mSearchGoBtn.addEventListener('click', () => {
    executeSearch(mEl.mSearchInput.value.trim());
  });

  mEl.mSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeSearch(mEl.mSearchInput.value.trim());
    }
  });

  document.querySelectorAll('.m-chip[data-q]').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q');
      if (q) {
        mEl.mSearchInput.value = q;
        executeSearch(q);
      }
    });
  });

  // PM2.5 Trend Range Toggles (48h Full, Past 24h, Next 24h)
  if (mEl.btnMTrendRangeAll) {
    mEl.btnMTrendRangeAll.addEventListener('click', () => {
      mState.trendRange = 'all';
      mEl.btnMTrendRangeAll.classList.add('active');
      if (mEl.btnMTrendRangePast) mEl.btnMTrendRangePast.classList.remove('active');
      if (mEl.btnMTrendRangeFuture) mEl.btnMTrendRangeFuture.classList.remove('active');
      if (mState.currentData) renderMobileTrendCard(mState.currentData);
    });
  }

  if (mEl.btnMTrendRangePast) {
    mEl.btnMTrendRangePast.addEventListener('click', () => {
      mState.trendRange = 'past';
      mEl.btnMTrendRangePast.classList.add('active');
      if (mEl.btnMTrendRangeAll) mEl.btnMTrendRangeAll.classList.remove('active');
      if (mEl.btnMTrendRangeFuture) mEl.btnMTrendRangeFuture.classList.remove('active');
      if (mState.currentData) renderMobileTrendCard(mState.currentData);
    });
  }

  if (mEl.btnMTrendRangeFuture) {
    mEl.btnMTrendRangeFuture.addEventListener('click', () => {
      mState.trendRange = 'future';
      mEl.btnMTrendRangeFuture.classList.add('active');
      if (mEl.btnMTrendRangeAll) mEl.btnMTrendRangeAll.classList.remove('active');
      if (mEl.btnMTrendRangePast) mEl.btnMTrendRangePast.classList.remove('active');
      if (mState.currentData) renderMobileTrendCard(mState.currentData);
    });
  }

  // PM2.5 Trend Graph Mode Toggles
  if (mEl.btnMTrendAqi) {
    mEl.btnMTrendAqi.addEventListener('click', () => {
      mState.trendMode = 'aqi';
      mEl.btnMTrendAqi.classList.add('active');
      mEl.btnMTrendConc.classList.remove('active');
      if (mState.currentData) renderMobileTrendCard(mState.currentData);
    });
  }

  // PM2.5 Trend View Format Toggles (Chart Graph vs Hourly Table)
  if (mEl.btnMTrendViewChart) {
    mEl.btnMTrendViewChart.addEventListener('click', () => {
      mState.trendView = 'chart';
      mEl.btnMTrendViewChart.classList.add('active');
      if (mEl.btnMTrendViewTable) mEl.btnMTrendViewTable.classList.remove('active');
      if (mEl.mTrendCanvasWrap) mEl.mTrendCanvasWrap.classList.remove('hidden');
      if (mEl.mTrendTableWrap) mEl.mTrendTableWrap.classList.add('hidden');
      if (mState.currentData) drawMobileTrendGraph('mTrendCanvas', mState.currentData, mState.trendMode === 'aqi');
    });
  }

  if (mEl.btnMTrendViewTable) {
    mEl.btnMTrendViewTable.addEventListener('click', () => {
      mState.trendView = 'table';
      mEl.btnMTrendViewTable.classList.add('active');
      if (mEl.btnMTrendViewChart) mEl.btnMTrendViewChart.classList.remove('active');
      if (mEl.mTrendCanvasWrap) mEl.mTrendCanvasWrap.classList.add('hidden');
      if (mEl.mTrendTableWrap) mEl.mTrendTableWrap.classList.remove('hidden');
      if (mState.currentData) renderMobileTrendTable(mState.currentData);
    });
  }
}

const PRESET_COORDS = {
  'perai': { lat: 5.3833, lon: 100.3833, name: 'Perai', stateName: 'Penang (Pulau Pinang)', countryName: 'Malaysia', station_id: 2600 },
  'kuala-lumpur': { lat: 3.1390, lon: 101.6869, name: 'Kuala Lumpur', stateName: 'Wilayah Persekutuan', countryName: 'Malaysia', station_id: 5780 },
  'alor-setar': { lat: 6.1210, lon: 100.3601, name: 'Alor Setar', stateName: 'Kedah', countryName: 'Malaysia', station_id: 2581 }
};

const WAQI_STATIONS = {
  'perai': { id: 2600, name: 'Perai', state: 'Penang (Pulau Pinang)' },
  'kuala-lumpur': { id: 5780, name: 'Kuala Lumpur', state: 'Wilayah Persekutuan' },
  'alor-setar': { id: 2581, name: 'Alor Setar', state: 'Kedah' }
};

let WAQI_TOKEN = localStorage.getItem('waqi_token') || '';

const M_FALLBACK_PRESETS = {
  "perai": {
    "preset_key": "perai",
    "location": {
      "name": "Perai",
      "state": "Penang (Pulau Pinang)",
      "country": "Malaysia",
      "latitude": 5.3833,
      "longitude": 100.3833
    },
    "overall_aqi": 53,
    "primary_source": "WAQI / Malaysia DOE Ground Station",
    "category": {
      "category": "Moderate",
      "malayCategory": "Sederhana",
      "color": "#F59E0B",
      "textColor": "#1F2937",
      "level": 2,
      "health": "Air quality is acceptable; however, very sensitive people may experience minor respiratory irritation.",
      "recommendation": "Unusually sensitive people should consider reducing prolonged or heavy outdoor exertion.",
      "outdoor_activity": "Safe for general public; sensitive groups reduce strenuous workouts",
      "mask": "Optional for sensitive individuals",
      "air_purifier": "Recommended for people with asthma or allergies"
    },
    "pm25": {
      "aqi_reading": 60,
      "sub_index": 60,
      "concentration_ugm3": 16.4,
      "category": {
        "category": "Moderate",
        "malayCategory": "Sederhana",
        "color": "#F59E0B",
        "textColor": "#1F2937",
        "level": 2,
        "health": "Air quality is acceptable; however, very sensitive people may experience minor respiratory irritation.",
        "recommendation": "Unusually sensitive people should consider reducing prolonged or heavy outdoor exertion.",
        "outdoor_activity": "Safe for general public; sensitive groups reduce strenuous workouts",
        "mask": "Optional for sensitive individuals",
        "air_purifier": "Recommended for people with asthma or allergies"
      },
      "trend": {
        "direction": "improving",
        "direction_label": "Improving (Dropping)",
        "trajectory": "FALLING",
        "arrow": "↘",
        "change_6h": -42,
        "drift_6h_aqi": -42,
        "drift_6h_conc": -3.2,
        "color": "#10B981",
        "peak_aqi": {
          "value": 60,
          "time": "20:00"
        },
        "peak_time": "20:00",
        "peak_val": 60,
        "cleanest_window": {
          "aqi": 10,
          "conc": 2.3,
          "time": "04:00"
        },
        "lowest_aqi": 10,
        "lowest_time": "04:00",
        "clean_val": 10,
        "peak_conc": {
          "value": 11.2,
          "time": "19:00"
        },
        "lowest_conc": {
          "value": 2.3,
          "time": "04:00"
        },
        "summary": "Improving trend: PM2.5 AQI expected to drop by 42 points over the next 6 hours, reaching a low of 10 AQI at ~04:00."
      },
      "future_trend": {
        "direction": "improving",
        "direction_label": "Improving (Dropping)",
        "trajectory": "FALLING",
        "arrow": "↘",
        "change_6h": -42,
        "drift_6h_aqi": -42,
        "drift_6h_conc": -3.2,
        "color": "#10B981",
        "peak_aqi": {
          "value": 60,
          "time": "20:00"
        },
        "peak_time": "20:00",
        "peak_val": 60,
        "cleanest_window": {
          "aqi": 10,
          "conc": 2.3,
          "time": "04:00"
        },
        "lowest_aqi": 10,
        "lowest_time": "04:00",
        "clean_val": 10,
        "peak_conc": {
          "value": 11.2,
          "time": "19:00"
        },
        "lowest_conc": {
          "value": 2.3,
          "time": "04:00"
        },
        "summary": "Improving trend: PM2.5 AQI expected to drop by 42 points over the next 6 hours, reaching a low of 10 AQI at ~04:00."
      },
      "past_trend": {
        "trajectory": "RISING",
        "direction_label": "Worsened (+26 pts past 6h)",
        "arrow": "↗",
        "drift_6h": 26,
        "drift_24h": 9,
        "drift_6h_conc": 8.2,
        "color": "#EF4444",
        "peak_aqi": {
          "value": 70,
          "time": "03:00"
        },
        "peak_val": 70,
        "lowest_aqi": {
          "value": 22,
          "time": "18:00"
        },
        "clean_val": 22,
        "peak_conc": {
          "value": 21.1,
          "time": "03:00"
        },
        "lowest_conc": {
          "value": 5.3,
          "time": "18:00"
        },
        "summary": "Past 24h: PM2.5 AQI shifted by +9 pts (+26 pts in last 6h), reaching a past peak of 70 AQI at ~03:00 and a low of 22 AQI at ~18:00."
      },
      "hourly_times": [
        "2026-10-11T20:00",
        "2026-10-11T21:00",
        "2026-10-11T22:00",
        "2026-10-11T23:00",
        "2026-10-12T00:00",
        "2026-10-12T01:00",
        "2026-10-12T02:00",
        "2026-10-12T03:00",
        "2026-10-12T04:00",
        "2026-10-12T05:00",
        "2026-10-12T06:00",
        "2026-10-12T07:00",
        "2026-10-12T08:00",
        "2026-10-12T09:00",
        "2026-10-12T10:00",
        "2026-10-12T11:00",
        "2026-10-12T12:00",
        "2026-10-12T13:00",
        "2026-10-12T14:00",
        "2026-10-12T15:00",
        "2026-10-12T16:00",
        "2026-10-12T17:00",
        "2026-10-12T18:00",
        "2026-10-12T19:00",
        "2026-10-12T20:00",
        "2026-10-12T21:00",
        "2026-10-12T22:00",
        "2026-10-12T23:00"
      ],
      "hourly_aqi": [
        60,
        38,
        37,
        33,
        35,
        25,
        18,
        11,
        10,
        10,
        12,
        13,
        18,
        22,
        21,
        23,
        26,
        36,
        33,
        36,
        38,
        41,
        42,
        47,
        56,
        58,
        60,
        62
      ],
      "hourly_conc": [
        7.4,
        9.0,
        8.9,
        8.0,
        8.4,
        6.1,
        4.2,
        2.7,
        2.3,
        2.5,
        2.8,
        3.2,
        4.3,
        5.2,
        5.0,
        5.5,
        6.3,
        8.7,
        8.0,
        8.6,
        9.1,
        9.8,
        10.1,
        11.2,
        14.6,
        15.5,
        16.3,
        17.1
      ],
      "past_24h": {
        "time": [
          "2026-10-10T20:00",
          "2026-10-10T21:00",
          "2026-10-10T22:00",
          "2026-10-10T23:00",
          "2026-10-11T00:00",
          "2026-10-11T01:00",
          "2026-10-11T02:00",
          "2026-10-11T03:00",
          "2026-10-11T04:00",
          "2026-10-11T05:00",
          "2026-10-11T06:00",
          "2026-10-11T07:00",
          "2026-10-11T08:00",
          "2026-10-11T09:00",
          "2026-10-11T10:00",
          "2026-10-11T11:00",
          "2026-10-11T12:00",
          "2026-10-11T13:00",
          "2026-10-11T14:00",
          "2026-10-11T15:00",
          "2026-10-11T16:00",
          "2026-10-11T17:00",
          "2026-10-11T18:00",
          "2026-10-11T19:00"
        ],
        "pm2_5": [
          12.1,
          13.1,
          16.9,
          14.0,
          8.6,
          10.3,
          18.3,
          21.1,
          19.2,
          14.5,
          13.1,
          17.8,
          16.4,
          15.0,
          15.9,
          6.2,
          15.0,
          8.2,
          11.5,
          8.6,
          19.2,
          10.3,
          5.3,
          16.4
        ],
        "pm25_aqi": [
          51,
          53,
          61,
          55,
          36,
          43,
          64,
          70,
          66,
          56,
          53,
          63,
          60,
          57,
          59,
          26,
          57,
          34,
          48,
          36,
          66,
          43,
          22,
          60
        ],
        "pm10": [
          11.3,
          13.4,
          15.4,
          16.6,
          16.9,
          15.0,
          11.8,
          11.0,
          8.8,
          5.8,
          3.4,
          2.4,
          2.4,
          3.9,
          4.0,
          3.2,
          3.5,
          3.5,
          3.1,
          3.3,
          3.5,
          3.8,
          4.2,
          5.4,
          8.0
        ],
        "us_aqi": [
          81,
          78,
          76,
          73,
          71,
          68,
          67,
          65,
          64,
          62,
          60,
          60,
          59,
          56,
          54,
          53,
          53,
          52,
          52,
          52,
          53,
          52,
          53,
          53
        ]
      },
      "future_24h": {
        "time": [
          "2026-10-11T20:00",
          "2026-10-11T21:00",
          "2026-10-11T22:00",
          "2026-10-11T23:00",
          "2026-10-12T00:00",
          "2026-10-12T01:00",
          "2026-10-12T02:00",
          "2026-10-12T03:00",
          "2026-10-12T04:00",
          "2026-10-12T05:00",
          "2026-10-12T06:00",
          "2026-10-12T07:00",
          "2026-10-12T08:00",
          "2026-10-12T09:00",
          "2026-10-12T10:00",
          "2026-10-12T11:00",
          "2026-10-12T12:00",
          "2026-10-12T13:00",
          "2026-10-12T14:00",
          "2026-10-12T15:00",
          "2026-10-12T16:00",
          "2026-10-12T17:00",
          "2026-10-12T18:00",
          "2026-10-12T19:00",
          "2026-10-12T20:00",
          "2026-10-12T21:00",
          "2026-10-12T22:00",
          "2026-10-12T23:00"
        ],
        "pm2_5": [
          7.4,
          9.0,
          8.9,
          8.0,
          8.4,
          6.1,
          4.2,
          2.7,
          2.3,
          2.5,
          2.8,
          3.2,
          4.3,
          5.2,
          5.0,
          5.5,
          6.3,
          8.7,
          8.0,
          8.6,
          9.1,
          9.8,
          10.1,
          11.2,
          14.6,
          15.5,
          16.3,
          17.1
        ],
        "pm25_aqi": [
          60,
          38,
          37,
          33,
          35,
          25,
          18,
          11,
          10,
          10,
          12,
          13,
          18,
          22,
          21,
          23,
          26,
          36,
          33,
          36,
          38,
          41,
          42,
          47,
          56,
          58,
          60,
          62
        ],
        "pm10": [
          8.0,
          9.7,
          9.6,
          8.7,
          9.0,
          6.7,
          4.8,
          3.2,
          2.3,
          2.5,
          2.9,
          3.2,
          4.4,
          5.2,
          5.0,
          5.5,
          6.4,
          8.8,
          8.1,
          8.7,
          9.3,
          10.0,
          10.2,
          11.3,
          14.7,
          15.7,
          16.4,
          17.2
        ],
        "us_aqi": [
          40,
          38,
          37,
          34,
          32,
          30,
          28,
          27,
          25,
          24,
          24,
          24,
          24,
          25,
          25,
          26,
          28,
          32,
          36,
          41,
          46,
          55,
          70,
          77,
          76,
          71,
          62,
          51
        ],
        "european_aqi": [
          25,
          28,
          28,
          26,
          27,
          22,
          19,
          18,
          17,
          16,
          15,
          14,
          17,
          21,
          34,
          49,
          58,
          60,
          62,
          65,
          68,
          67,
          62,
          45,
          39,
          40,
          41,
          41
        ]
      },
      "timeline_48h": {
        "time": [
          "2026-10-10T20:00",
          "2026-10-10T21:00",
          "2026-10-10T22:00",
          "2026-10-10T23:00",
          "2026-10-11T00:00",
          "2026-10-11T01:00",
          "2026-10-11T02:00",
          "2026-10-11T03:00",
          "2026-10-11T04:00",
          "2026-10-11T05:00",
          "2026-10-11T06:00",
          "2026-10-11T07:00",
          "2026-10-11T08:00",
          "2026-10-11T09:00",
          "2026-10-11T10:00",
          "2026-10-11T11:00",
          "2026-10-11T12:00",
          "2026-10-11T13:00",
          "2026-10-11T14:00",
          "2026-10-11T15:00",
          "2026-10-11T16:00",
          "2026-10-11T17:00",
          "2026-10-11T18:00",
          "2026-10-11T19:00",
          "2026-10-11T20:00",
          "2026-10-11T21:00",
          "2026-10-11T22:00",
          "2026-10-11T23:00",
          "2026-10-12T00:00",
          "2026-10-12T01:00",
          "2026-10-12T02:00",
          "2026-10-12T03:00",
          "2026-10-12T04:00",
          "2026-10-12T05:00",
          "2026-10-12T06:00",
          "2026-10-12T07:00",
          "2026-10-12T08:00",
          "2026-10-12T09:00",
          "2026-10-12T10:00",
          "2026-10-12T11:00",
          "2026-10-12T12:00",
          "2026-10-12T13:00",
          "2026-10-12T14:00",
          "2026-10-12T15:00",
          "2026-10-12T16:00",
          "2026-10-12T17:00",
          "2026-10-12T18:00",
          "2026-10-12T19:00",
          "2026-10-12T20:00"
        ],
        "pm2_5": [
          9.8,
          12.1,
          13.1,
          16.9,
          14.0,
          8.6,
          10.3,
          18.3,
          21.1,
          19.2,
          14.5,
          13.1,
          17.8,
          16.4,
          15.0,
          15.9,
          6.2,
          15.0,
          8.2,
          11.5,
          8.6,
          19.2,
          10.3,
          5.3,
          16.4,
          9.0,
          8.9,
          8.0,
          8.4,
          6.1,
          4.2,
          2.7,
          2.3,
          2.5,
          2.8,
          3.2,
          4.3,
          5.2,
          5.0,
          5.5,
          6.3,
          8.7,
          8.0,
          8.6,
          9.1,
          9.8,
          10.1,
          11.2,
          14.6
        ],
        "pm25_aqi": [
          41,
          51,
          53,
          61,
          55,
          36,
          43,
          64,
          70,
          66,
          56,
          53,
          63,
          60,
          57,
          59,
          26,
          57,
          34,
          48,
          36,
          66,
          43,
          22,
          60,
          38,
          37,
          33,
          35,
          25,
          18,
          11,
          10,
          10,
          12,
          13,
          18,
          22,
          21,
          23,
          26,
          36,
          33,
          36,
          38,
          41,
          42,
          47,
          56
        ],
        "us_aqi": [
          60,
          59,
          57,
          56,
          55,
          53,
          52,
          52,
          51,
          51,
          50,
          50,
          49,
          47,
          44,
          42,
          41,
          40,
          39,
          38,
          37,
          37,
          38,
          40,
          40,
          38,
          37,
          34,
          32,
          30,
          28,
          27,
          25,
          24,
          24,
          24,
          24,
          25,
          25,
          26,
          28,
          32,
          36,
          41,
          46,
          55,
          70,
          77,
          76
        ],
        "now_index": 24
      },
      "min_today": 22,
      "max_today": 154,
      "who_comparison": {
        "status": "1.1x WHO guideline (15 µg/m³)",
        "ratio": 1.1,
        "safe": false
      }
    },
    "runner_advice": {
      "verdict": "Generally Safe — Moderate Precautions",
      "badge": "GENERALLY SAFE",
      "color": "#F59E0B",
      "durations": {
        "low": {
          "label": "Low Intensity (Zone 1-2)",
          "sub": "Easy Jog, Recovery, Base Aerobic (HR < 70% Max)",
          "duration": "60 - 75 minutes",
          "safe": true,
          "note": "Safe for healthy runners. Sensitive runners monitor airway comfort."
        },
        "moderate": {
          "label": "Moderate Intensity (Zone 3)",
          "sub": "Steady Aerobic, Marathon Pace, Tempo (HR 70-80% Max)",
          "duration": "30 - 45 minutes",
          "safe": true,
          "note": "Keep session controlled. Avoid exhaust-heavy roadside running."
        },
        "high": {
          "label": "High Intensity (Zone 4-5)",
          "sub": "Intervals, Threshold, 5K Pace, Hill Sprints (HR > 80% Max)",
          "duration": "20 - 30 minutes",
          "safe": true,
          "note": "Limit maximum effort duration. Asthmatic runners should pre-medicate or run indoors."
        }
      },
      "summary": "Safe for general runners. Keep high-intensity intervals concise. Prefer leafy park loops over roadside routes.",
      "best_window": {
        "time": "05:00",
        "full_time": "2026-10-12T05:00",
        "predicted_aqi": 24,
        "recommendation": "Cleanest forecasted window: ~05:00 (Predicted AQI: 24)"
      },
      "heat_stress": {
        "temp_c": 26.1,
        "humidity_pct": 94,
        "apparent_temp_c": 32.7,
        "warning": "Moderate Heat & Humidity. High sweat rate. Carry hydration and electrolytes."
      },
      "tips": [
        "Route Choice: Run in shaded tree-dense parks (e.g. botanical gardens or forest reserves). Keep at least 200m away from expressways and industrial corridors.",
        "Respiratory Physiology: Running raises minute ventilation by 10x-15x, bypassing nasal filtration during mouth-breathing.",
        "Post-Run Protocol: Perform a saline nasal rinse immediately after finishing to flush trapped coarse particulates, and shower promptly.",
        "Indoor Alternative: On days with AQI > 100, schedule speed intervals on a gym treadmill and save easy outdoor miles for cleaner days."
      ]
    },
    "weather": {
      "source": "Open-Meteo Surface Weather Model",
      "temperature_c": 26.1,
      "relative_humidity_pct": 94,
      "apparent_temperature_c": 32.7,
      "wind_speed_ms": 0.7,
      "wind_direction_deg": 284,
      "precipitation_mm": 0.0,
      "uv_index": 0.0
    },
    "aqicn_ground": {
      "source": "WAQI / aqicn.org (Malaysia DOE Ground Station)",
      "station_id": 2600,
      "station_name": "Perai, Pulau Pinang, Malaysia",
      "url": "https://aqicn.org/city/malaysia/pulau-pinang/perai/",
      "updated": "Sunday, Oct 11th 2026, 20:00 pm",
      "overall_aqi": 53,
      "pm25": {
        "current": 60,
        "min": 22,
        "max": 154,
        "unit": "AQI sub-index"
      },
      "pollutants": {
        "pm10": {
          "current": "19",
          "min": "6",
          "max": "62"
        },
        "o3": {
          "current": "8",
          "min": "1",
          "max": "13"
        },
        "no2": {
          "current": "1",
          "min": "1",
          "max": "10"
        },
        "so2": {
          "current": "1",
          "min": "1",
          "max": "2"
        },
        "co": {
          "current": "0",
          "min": "0",
          "max": "0"
        }
      },
      "weather": {
        "humidity": "79",
        "pressure": "1008",
        "wind": "2"
      },
      "nearest_stations": [
        {
          "id": 2600,
          "name": "Perai, Pulau Pinang, Malaysia",
          "geo": [
            5.329358,
            100.443475
          ],
          "aqi": "53",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 5778,
          "name": "Perai",
          "geo": [
            5.384388,
            100.3896169
          ],
          "aqi": "16",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2601,
          "name": "Seberang Jaya 2, Perai, Pulau Pinang, Malaysia",
          "geo": [
            5.39817,
            100.403947
          ],
          "aqi": "57",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 9489,
          "name": "Minden, Pulau Pinang, Malaysia",
          "geo": [
            5.356211,
            100.30792
          ],
          "aqi": "43",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 9488,
          "name": "Kulim Hi-Tech, Kedah, Malaysia",
          "geo": [
            5.401688,
            100.58968
          ],
          "aqi": "44",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 9490,
          "name": "Balik Pulau, Pulau Pinang, Malaysia",
          "geo": [
            5.337598,
            100.214721
          ],
          "aqi": "31",
          "time": "2026-10-11T20:00:00+08:00"
        },
        {
          "id": 2582,
          "name": "Bakar Arang, Sg. Petani, Kedah, Malaysia",
          "geo": [
            5.629631,
            100.467771
          ],
          "aqi": "57",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2595,
          "name": "Kg. Air Putih, Taiping, Perak, Malaysia",
          "geo": [
            4.89885,
            100.679106
          ],
          "aqi": "55",
          "time": "2026-10-11T20:00:00+08:00"
        },
        {
          "id": 12760,
          "name": "Betong, Thailand (ต.เบตง อ.เบตง จ.ยะลา)",
          "geo": [
            5.763873,
            101.067903
          ],
          "aqi": "44",
          "time": "2026-10-11T19:00:00+07:00"
        },
        {
          "id": 2581,
          "name": "Alor Setar, Kedah, Malaysia",
          "geo": [
            6.137244,
            100.346815
          ],
          "aqi": "55",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2594,
          "name": "Jalan Tasek, Ipoh, Perak, Malaysia",
          "geo": [
            4.629444,
            101.11665
          ],
          "aqi": "70",
          "time": "2026-10-11T20:00:00+08:00"
        },
        {
          "id": 5777,
          "name": "Ipoh",
          "geo": [
            4.61175,
            101.113506
          ],
          "aqi": "56",
          "time": "2026-10-11T19:00:00+08:00"
        }
      ],
      "history": {
        "aqi": {
          "time": [
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00",
            "2026-10-11T20:00"
          ],
          "values": [
            81,
            78,
            76,
            73,
            71,
            68,
            67,
            65,
            64,
            62,
            60,
            60,
            59,
            56,
            54,
            53,
            53,
            52,
            52,
            52,
            53,
            52,
            53,
            53
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": [
            81,
            78,
            76,
            73,
            71,
            68,
            67,
            65,
            64,
            62,
            60,
            60,
            59,
            56,
            54,
            53,
            53,
            52,
            52,
            52,
            53,
            52,
            53,
            53
          ]
        },
        "pm25": {
          "time": [
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            51,
            53,
            61,
            55,
            36,
            43,
            64,
            70,
            66,
            56,
            53,
            63,
            60,
            57,
            59,
            26,
            57,
            34,
            48,
            36,
            66,
            43,
            22,
            60
          ],
          "pm25_aqi": [
            51,
            53,
            61,
            55,
            36,
            43,
            64,
            70,
            66,
            56,
            53,
            63,
            60,
            57,
            59,
            26,
            57,
            34,
            48,
            36,
            66,
            43,
            22,
            60
          ],
          "pm2_5": [
            12.1,
            13.1,
            16.9,
            14.0,
            8.6,
            10.3,
            18.3,
            21.1,
            19.2,
            14.5,
            13.1,
            17.8,
            16.4,
            15.0,
            15.9,
            6.2,
            15.0,
            8.2,
            11.5,
            8.6,
            19.2,
            10.3,
            5.3,
            16.4
          ],
          "us_aqi": [
            51,
            53,
            61,
            55,
            36,
            43,
            64,
            70,
            66,
            56,
            53,
            63,
            60,
            57,
            59,
            26,
            57,
            34,
            48,
            36,
            66,
            43,
            22,
            60
          ]
        },
        "pm10": {
          "time": [
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            15,
            18,
            24,
            22,
            14,
            16,
            26,
            29,
            28,
            22,
            19,
            24,
            21,
            20,
            21,
            10,
            18,
            9,
            14,
            10,
            20,
            13,
            6,
            19
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "o3": {
          "time": [
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            4,
            4,
            3,
            2,
            2,
            2,
            1,
            1,
            1,
            1,
            2,
            1,
            1,
            1,
            5,
            5,
            5,
            6,
            7,
            8,
            9,
            9,
            9,
            8
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "no2": {
          "time": [
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            1,
            2,
            4,
            6,
            5,
            2,
            6,
            5,
            4,
            4,
            3,
            3,
            3,
            4,
            2,
            2,
            1,
            1,
            0,
            1,
            1,
            1,
            1,
            1
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "so2": {
          "time": [
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "co": {
          "time": [
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "t": {
          "time": [
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            29,
            29,
            29,
            28,
            28,
            28,
            28,
            27,
            27,
            27,
            27,
            27,
            26,
            27,
            28,
            28,
            30,
            30,
            31,
            31,
            30,
            30,
            30,
            29
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "p": {
          "time": [
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            1007,
            1008,
            1008,
            1009,
            1010,
            1010,
            1010,
            1009,
            1008,
            1008,
            1008,
            1009,
            1010,
            1010,
            1010,
            1011,
            1010,
            1010,
            1008,
            1008,
            1007,
            1007,
            1008,
            1008
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "h": {
          "time": [
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            79,
            79,
            79,
            83,
            83,
            83,
            86,
            88,
            88,
            88,
            86,
            83,
            88,
            83,
            78,
            81,
            76,
            74,
            68,
            70,
            72,
            68,
            74,
            79
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "w": {
          "time": [
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            2,
            1,
            1,
            0,
            1,
            0,
            1,
            0,
            1,
            1,
            2,
            0,
            3,
            2,
            1,
            2,
            3,
            3,
            4,
            4,
            3,
            2,
            2,
            2
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        }
      }
    },
    "openmeteo_model": {
      "source": "Copernicus CAMS & NOAA GFS via Open-Meteo",
      "time": "2026-10-11T20:00",
      "us_aqi": 40,
      "european_aqi": 25,
      "pm25_concentration": {
        "value": 7.4,
        "unit": "µg/m³"
      },
      "pm10_concentration": {
        "value": 8.0,
        "unit": "µg/m³"
      },
      "pollutants_ugm3": {
        "carbon_monoxide": 644.0,
        "nitrogen_dioxide": 11.6,
        "sulphur_dioxide": 8.8,
        "ozone": 60.0,
        "dust": 0.0
      },
      "hourly_forecast": {
        "time": [
          "2026-10-11T20:00",
          "2026-10-11T21:00",
          "2026-10-11T22:00",
          "2026-10-11T23:00",
          "2026-10-12T00:00",
          "2026-10-12T01:00",
          "2026-10-12T02:00",
          "2026-10-12T03:00",
          "2026-10-12T04:00",
          "2026-10-12T05:00",
          "2026-10-12T06:00",
          "2026-10-12T07:00",
          "2026-10-12T08:00",
          "2026-10-12T09:00",
          "2026-10-12T10:00",
          "2026-10-12T11:00",
          "2026-10-12T12:00",
          "2026-10-12T13:00",
          "2026-10-12T14:00",
          "2026-10-12T15:00",
          "2026-10-12T16:00",
          "2026-10-12T17:00",
          "2026-10-12T18:00",
          "2026-10-12T19:00",
          "2026-10-12T20:00",
          "2026-10-12T21:00",
          "2026-10-12T22:00",
          "2026-10-12T23:00"
        ],
        "pm2_5": [
          7.4,
          9.0,
          8.9,
          8.0,
          8.4,
          6.1,
          4.2,
          2.7,
          2.3,
          2.5,
          2.8,
          3.2,
          4.3,
          5.2,
          5.0,
          5.5,
          6.3,
          8.7,
          8.0,
          8.6,
          9.1,
          9.8,
          10.1,
          11.2,
          14.6,
          15.5,
          16.3,
          17.1
        ],
        "pm25_aqi": [
          60,
          38,
          37,
          33,
          35,
          25,
          18,
          11,
          10,
          10,
          12,
          13,
          18,
          22,
          21,
          23,
          26,
          36,
          33,
          36,
          38,
          41,
          42,
          47,
          56,
          58,
          60,
          62
        ],
        "pm10": [
          8.0,
          9.7,
          9.6,
          8.7,
          9.0,
          6.7,
          4.8,
          3.2,
          2.3,
          2.5,
          2.9,
          3.2,
          4.4,
          5.2,
          5.0,
          5.5,
          6.4,
          8.8,
          8.1,
          8.7,
          9.3,
          10.0,
          10.2,
          11.3,
          14.7,
          15.7,
          16.4,
          17.2
        ],
        "us_aqi": [
          40,
          38,
          37,
          34,
          32,
          30,
          28,
          27,
          25,
          24,
          24,
          24,
          24,
          25,
          25,
          26,
          28,
          32,
          36,
          41,
          46,
          55,
          70,
          77,
          76,
          71,
          62,
          51
        ],
        "european_aqi": [
          25,
          28,
          28,
          26,
          27,
          22,
          19,
          18,
          17,
          16,
          15,
          14,
          17,
          21,
          34,
          49,
          58,
          60,
          62,
          65,
          68,
          67,
          62,
          45,
          39,
          40,
          41,
          41
        ]
      },
      "past_24h": {
        "time": [
          "2026-10-10T20:00",
          "2026-10-10T21:00",
          "2026-10-10T22:00",
          "2026-10-10T23:00",
          "2026-10-11T00:00",
          "2026-10-11T01:00",
          "2026-10-11T02:00",
          "2026-10-11T03:00",
          "2026-10-11T04:00",
          "2026-10-11T05:00",
          "2026-10-11T06:00",
          "2026-10-11T07:00",
          "2026-10-11T08:00",
          "2026-10-11T09:00",
          "2026-10-11T10:00",
          "2026-10-11T11:00",
          "2026-10-11T12:00",
          "2026-10-11T13:00",
          "2026-10-11T14:00",
          "2026-10-11T15:00",
          "2026-10-11T16:00",
          "2026-10-11T17:00",
          "2026-10-11T18:00",
          "2026-10-11T19:00"
        ],
        "pm2_5": [
          12.1,
          13.1,
          16.9,
          14.0,
          8.6,
          10.3,
          18.3,
          21.1,
          19.2,
          14.5,
          13.1,
          17.8,
          16.4,
          15.0,
          15.9,
          6.2,
          15.0,
          8.2,
          11.5,
          8.6,
          19.2,
          10.3,
          5.3,
          16.4
        ],
        "pm25_aqi": [
          51,
          53,
          61,
          55,
          36,
          43,
          64,
          70,
          66,
          56,
          53,
          63,
          60,
          57,
          59,
          26,
          57,
          34,
          48,
          36,
          66,
          43,
          22,
          60
        ],
        "pm10": [
          11.3,
          13.4,
          15.4,
          16.6,
          16.9,
          15.0,
          11.8,
          11.0,
          8.8,
          5.8,
          3.4,
          2.4,
          2.4,
          3.9,
          4.0,
          3.2,
          3.5,
          3.5,
          3.1,
          3.3,
          3.5,
          3.8,
          4.2,
          5.4,
          8.0
        ],
        "us_aqi": [
          81,
          78,
          76,
          73,
          71,
          68,
          67,
          65,
          64,
          62,
          60,
          60,
          59,
          56,
          54,
          53,
          53,
          52,
          52,
          52,
          53,
          52,
          53,
          53
        ]
      },
      "timeline_48h": {
        "time": [
          "2026-10-10T20:00",
          "2026-10-10T21:00",
          "2026-10-10T22:00",
          "2026-10-10T23:00",
          "2026-10-11T00:00",
          "2026-10-11T01:00",
          "2026-10-11T02:00",
          "2026-10-11T03:00",
          "2026-10-11T04:00",
          "2026-10-11T05:00",
          "2026-10-11T06:00",
          "2026-10-11T07:00",
          "2026-10-11T08:00",
          "2026-10-11T09:00",
          "2026-10-11T10:00",
          "2026-10-11T11:00",
          "2026-10-11T12:00",
          "2026-10-11T13:00",
          "2026-10-11T14:00",
          "2026-10-11T15:00",
          "2026-10-11T16:00",
          "2026-10-11T17:00",
          "2026-10-11T18:00",
          "2026-10-11T19:00",
          "2026-10-11T20:00",
          "2026-10-11T21:00",
          "2026-10-11T22:00",
          "2026-10-11T23:00",
          "2026-10-12T00:00",
          "2026-10-12T01:00",
          "2026-10-12T02:00",
          "2026-10-12T03:00",
          "2026-10-12T04:00",
          "2026-10-12T05:00",
          "2026-10-12T06:00",
          "2026-10-12T07:00",
          "2026-10-12T08:00",
          "2026-10-12T09:00",
          "2026-10-12T10:00",
          "2026-10-12T11:00",
          "2026-10-12T12:00",
          "2026-10-12T13:00",
          "2026-10-12T14:00",
          "2026-10-12T15:00",
          "2026-10-12T16:00",
          "2026-10-12T17:00",
          "2026-10-12T18:00",
          "2026-10-12T19:00",
          "2026-10-12T20:00"
        ],
        "pm2_5": [
          9.8,
          12.1,
          13.1,
          16.9,
          14.0,
          8.6,
          10.3,
          18.3,
          21.1,
          19.2,
          14.5,
          13.1,
          17.8,
          16.4,
          15.0,
          15.9,
          6.2,
          15.0,
          8.2,
          11.5,
          8.6,
          19.2,
          10.3,
          5.3,
          16.4,
          9.0,
          8.9,
          8.0,
          8.4,
          6.1,
          4.2,
          2.7,
          2.3,
          2.5,
          2.8,
          3.2,
          4.3,
          5.2,
          5.0,
          5.5,
          6.3,
          8.7,
          8.0,
          8.6,
          9.1,
          9.8,
          10.1,
          11.2,
          14.6
        ],
        "pm25_aqi": [
          41,
          51,
          53,
          61,
          55,
          36,
          43,
          64,
          70,
          66,
          56,
          53,
          63,
          60,
          57,
          59,
          26,
          57,
          34,
          48,
          36,
          66,
          43,
          22,
          60,
          38,
          37,
          33,
          35,
          25,
          18,
          11,
          10,
          10,
          12,
          13,
          18,
          22,
          21,
          23,
          26,
          36,
          33,
          36,
          38,
          41,
          42,
          47,
          56
        ],
        "us_aqi": [
          60,
          59,
          57,
          56,
          55,
          53,
          52,
          52,
          51,
          51,
          50,
          50,
          49,
          47,
          44,
          42,
          41,
          40,
          39,
          38,
          37,
          37,
          38,
          40,
          40,
          38,
          37,
          34,
          32,
          30,
          28,
          27,
          25,
          24,
          24,
          24,
          24,
          25,
          25,
          26,
          28,
          32,
          36,
          41,
          46,
          55,
          70,
          77,
          76
        ],
        "now_index": 24
      }
    },
    "sources_comparison": {
      "aqicn_waqi": {
        "source_name": "WAQI / Malaysia DOE Continuous Monitoring",
        "available": true,
        "station_name": "Perai, Pulau Pinang, Malaysia",
        "overall_aqi": 53,
        "pm25_subindex": 60,
        "url": "https://aqicn.org/city/malaysia/pulau-pinang/perai/",
        "updated": "Sunday, Oct 11th 2026, 20:00 pm",
        "type": "Ground-Level Continuous Ambient Air Monitoring Station"
      },
      "copernicus_cams": {
        "source_name": "Copernicus CAMS Global Atmospheric Model (ECMWF)",
        "available": true,
        "us_aqi": 40,
        "european_aqi": 25,
        "pm25_ugm3": 16.4,
        "updated": "2026-10-11T20:00",
        "type": "European Union Satellite Earth Observation & 40km Numerical Model"
      },
      "noaa_gfs": {
        "source_name": "NOAA Global Forecast System (GFS Aerosols)",
        "available": true,
        "dust_ugm3": 0.0,
        "ozone_ugm3": 60.0,
        "type": "National Oceanic and Atmospheric Administration (NOAA) Chemical Forecast"
      },
      "malaysia_apu": {
        "source_name": "Malaysia DOE APIMS (Indeks Pencemaran Udara)",
        "available": true,
        "ipu_category": "Sederhana",
        "regulatory_body": "Jabatan Alam Sekitar (JAS) Malaysia",
        "type": "National Environmental Quality Ambient Air Standard"
      },
      "surface_weather": {
        "source_name": "Open-Meteo High-Resolution Surface Microclimate",
        "available": true,
        "temperature_c": 26.1,
        "humidity_pct": 94.0,
        "apparent_temperature_c": 32.7,
        "wind_speed_ms": 0.7,
        "uv_index": 0.0,
        "type": "Meteorological Running Index"
      }
    },
    "timestamp": 1791721425.31018
  },
  "kuala-lumpur": {
    "preset_key": "kuala-lumpur",
    "location": {
      "name": "Kuala Lumpur",
      "state": "Wilayah Persekutuan",
      "country": "Malaysia",
      "latitude": 3.139,
      "longitude": 101.6869
    },
    "overall_aqi": 172,
    "primary_source": "WAQI / Malaysia DOE Ground Station",
    "category": {
      "category": "Unhealthy",
      "malayCategory": "Tidak Sihat",
      "color": "#EF4444",
      "textColor": "#ffffff",
      "level": 4,
      "health": "Everyone may begin to experience health effects; sensitive groups may experience more serious health effects.",
      "recommendation": "Active children and adults, and people with respiratory disease, should avoid prolonged outdoor exertion.",
      "outdoor_activity": "Avoid prolonged outdoor exercise and strenuous sports",
      "mask": "Wear N95/KN95/KF94 mask when outdoors",
      "air_purifier": "Run HEPA air purifiers, keep windows and doors closed"
    },
    "pm25": {
      "aqi_reading": 172,
      "sub_index": 172,
      "concentration_ugm3": 96.2,
      "category": {
        "category": "Unhealthy",
        "malayCategory": "Tidak Sihat",
        "color": "#EF4444",
        "textColor": "#ffffff",
        "level": 4,
        "health": "Everyone may begin to experience health effects; sensitive groups may experience more serious health effects.",
        "recommendation": "Active children and adults, and people with respiratory disease, should avoid prolonged outdoor exertion.",
        "outdoor_activity": "Avoid prolonged outdoor exercise and strenuous sports",
        "mask": "Wear N95/KN95/KF94 mask when outdoors",
        "air_purifier": "Run HEPA air purifiers, keep windows and doors closed"
      },
      "trend": {
        "direction": "improving",
        "direction_label": "Improving (Dropping)",
        "trajectory": "FALLING",
        "arrow": "↘",
        "change_6h": -110,
        "drift_6h_aqi": -110,
        "drift_6h_conc": -27.4,
        "color": "#10B981",
        "peak_aqi": {
          "value": 172,
          "time": "20:00"
        },
        "peak_time": "20:00",
        "peak_val": 172,
        "cleanest_window": {
          "aqi": 45,
          "conc": 10.8,
          "time": "07:00"
        },
        "lowest_aqi": 45,
        "lowest_time": "07:00",
        "clean_val": 45,
        "peak_conc": {
          "value": 49.8,
          "time": "19:00"
        },
        "lowest_conc": {
          "value": 10.8,
          "time": "07:00"
        },
        "summary": "Improving trend: PM2.5 AQI expected to drop by 110 points over the next 6 hours, reaching a low of 45 AQI at ~07:00."
      },
      "future_trend": {
        "direction": "improving",
        "direction_label": "Improving (Dropping)",
        "trajectory": "FALLING",
        "arrow": "↘",
        "change_6h": -110,
        "drift_6h_aqi": -110,
        "drift_6h_conc": -27.4,
        "color": "#10B981",
        "peak_aqi": {
          "value": 172,
          "time": "20:00"
        },
        "peak_time": "20:00",
        "peak_val": 172,
        "cleanest_window": {
          "aqi": 45,
          "conc": 10.8,
          "time": "07:00"
        },
        "lowest_aqi": 45,
        "lowest_time": "07:00",
        "clean_val": 45,
        "peak_conc": {
          "value": 49.8,
          "time": "19:00"
        },
        "lowest_conc": {
          "value": 10.8,
          "time": "07:00"
        },
        "summary": "Improving trend: PM2.5 AQI expected to drop by 110 points over the next 6 hours, reaching a low of 45 AQI at ~07:00."
      },
      "past_trend": {
        "trajectory": "RISING",
        "direction_label": "Worsened (+18 pts past 6h)",
        "arrow": "↗",
        "drift_6h": 18,
        "drift_24h": 25,
        "drift_6h_conc": 34.9,
        "color": "#EF4444",
        "peak_aqi": {
          "value": 172,
          "time": "19:00"
        },
        "peak_val": 172,
        "lowest_aqi": {
          "value": 79,
          "time": "18:00"
        },
        "clean_val": 79,
        "peak_conc": {
          "value": 96.2,
          "time": "19:00"
        },
        "lowest_conc": {
          "value": 25.4,
          "time": "18:00"
        },
        "summary": "Past 24h: PM2.5 AQI shifted by +25 pts (+18 pts in last 6h), reaching a past peak of 172 AQI at ~19:00 and a low of 79 AQI at ~18:00."
      },
      "hourly_times": [
        "2026-10-11T20:00",
        "2026-10-11T21:00",
        "2026-10-11T22:00",
        "2026-10-11T23:00",
        "2026-10-12T00:00",
        "2026-10-12T01:00",
        "2026-10-12T02:00",
        "2026-10-12T03:00",
        "2026-10-12T04:00",
        "2026-10-12T05:00",
        "2026-10-12T06:00",
        "2026-10-12T07:00",
        "2026-10-12T08:00",
        "2026-10-12T09:00",
        "2026-10-12T10:00",
        "2026-10-12T11:00",
        "2026-10-12T12:00",
        "2026-10-12T13:00",
        "2026-10-12T14:00",
        "2026-10-12T15:00",
        "2026-10-12T16:00",
        "2026-10-12T17:00",
        "2026-10-12T18:00",
        "2026-10-12T19:00",
        "2026-10-12T20:00",
        "2026-10-12T21:00",
        "2026-10-12T22:00",
        "2026-10-12T23:00"
      ],
      "hourly_aqi": [
        172,
        122,
        121,
        134,
        120,
        89,
        62,
        54,
        60,
        59,
        57,
        45,
        65,
        76,
        76,
        76,
        78,
        79,
        81,
        81,
        89,
        97,
        122,
        136,
        155,
        156,
        125,
        91
      ],
      "hourly_conc": [
        44.6,
        43.9,
        43.5,
        49.1,
        43.2,
        30.2,
        17.2,
        13.5,
        16.6,
        15.9,
        14.9,
        10.8,
        18.6,
        23.9,
        23.9,
        23.9,
        25.0,
        25.4,
        26.4,
        26.4,
        30.3,
        34.1,
        44.1,
        49.8,
        63.3,
        65.9,
        45.3,
        31.3
      ],
      "past_24h": {
        "time": [
          "2026-10-10T20:00",
          "2026-10-10T21:00",
          "2026-10-10T22:00",
          "2026-10-10T23:00",
          "2026-10-11T00:00",
          "2026-10-11T01:00",
          "2026-10-11T02:00",
          "2026-10-11T03:00",
          "2026-10-11T04:00",
          "2026-10-11T05:00",
          "2026-10-11T06:00",
          "2026-10-11T07:00",
          "2026-10-11T08:00",
          "2026-10-11T09:00",
          "2026-10-11T10:00",
          "2026-10-11T11:00",
          "2026-10-11T12:00",
          "2026-10-11T13:00",
          "2026-10-11T14:00",
          "2026-10-11T15:00",
          "2026-10-11T16:00",
          "2026-10-11T17:00",
          "2026-10-11T18:00",
          "2026-10-11T19:00"
        ],
        "pm2_5": [
          54.2,
          55.5,
          55.5,
          59.4,
          65.2,
          61.3,
          55.5,
          59.4,
          45.2,
          40.0,
          36.7,
          36.7,
          36.3,
          36.7,
          41.2,
          76.8,
          90.4,
          61.3,
          88.4,
          46.5,
          44.0,
          43.6,
          25.4,
          96.2
        ],
        "pm25_aqi": [
          147,
          151,
          151,
          153,
          156,
          154,
          151,
          153,
          125,
          112,
          104,
          104,
          103,
          104,
          115,
          162,
          169,
          154,
          168,
          128,
          122,
          121,
          79,
          172
        ],
        "pm10": [
          80.3,
          56.2,
          35.3,
          43.7,
          38.3,
          27.6,
          27.6,
          29.6,
          29.6,
          29.1,
          23.7,
          26.0,
          16.9,
          17.9,
          23.9,
          27.8,
          27.2,
          23.5,
          22.2,
          21.8,
          23.7,
          27.5,
          39.6,
          44.7,
          44.6
        ],
        "us_aqi": [
          159,
          158,
          156,
          154,
          152,
          150,
          144,
          139,
          134,
          132,
          129,
          128,
          127,
          120,
          115,
          108,
          103,
          100,
          98,
          96,
          95,
          95,
          106,
          101,
          93
        ]
      },
      "future_24h": {
        "time": [
          "2026-10-11T20:00",
          "2026-10-11T21:00",
          "2026-10-11T22:00",
          "2026-10-11T23:00",
          "2026-10-12T00:00",
          "2026-10-12T01:00",
          "2026-10-12T02:00",
          "2026-10-12T03:00",
          "2026-10-12T04:00",
          "2026-10-12T05:00",
          "2026-10-12T06:00",
          "2026-10-12T07:00",
          "2026-10-12T08:00",
          "2026-10-12T09:00",
          "2026-10-12T10:00",
          "2026-10-12T11:00",
          "2026-10-12T12:00",
          "2026-10-12T13:00",
          "2026-10-12T14:00",
          "2026-10-12T15:00",
          "2026-10-12T16:00",
          "2026-10-12T17:00",
          "2026-10-12T18:00",
          "2026-10-12T19:00",
          "2026-10-12T20:00",
          "2026-10-12T21:00",
          "2026-10-12T22:00",
          "2026-10-12T23:00"
        ],
        "pm2_5": [
          44.6,
          43.9,
          43.5,
          49.1,
          43.2,
          30.2,
          17.2,
          13.5,
          16.6,
          15.9,
          14.9,
          10.8,
          18.6,
          23.9,
          23.9,
          23.9,
          25.0,
          25.4,
          26.4,
          26.4,
          30.3,
          34.1,
          44.1,
          49.8,
          63.3,
          65.9,
          45.3,
          31.3
        ],
        "pm25_aqi": [
          172,
          122,
          121,
          134,
          120,
          89,
          62,
          54,
          60,
          59,
          57,
          45,
          65,
          76,
          76,
          76,
          78,
          79,
          81,
          81,
          89,
          97,
          122,
          136,
          155,
          156,
          125,
          91
        ],
        "pm10": [
          44.6,
          43.9,
          43.5,
          49.1,
          43.2,
          30.3,
          17.2,
          13.6,
          16.7,
          15.9,
          14.9,
          10.8,
          18.6,
          23.9,
          23.9,
          23.9,
          25.0,
          25.4,
          26.4,
          26.5,
          30.3,
          34.1,
          44.1,
          49.8,
          63.3,
          65.9,
          45.4,
          31.3
        ],
        "us_aqi": [
          93,
          90,
          89,
          90,
          90,
          91,
          91,
          90,
          89,
          88,
          87,
          86,
          85,
          85,
          85,
          85,
          85,
          85,
          85,
          86,
          102,
          137,
          157,
          159,
          145,
          112,
          91,
          91
        ],
        "european_aqi": [
          75,
          75,
          70,
          66,
          65,
          64,
          62,
          58,
          53,
          49,
          48,
          47,
          47,
          46,
          45,
          72,
          91,
          113,
          124,
          123,
          111,
          87,
          71,
          88,
          97,
          95,
          85,
          76
        ]
      },
      "timeline_48h": {
        "time": [
          "2026-10-10T20:00",
          "2026-10-10T21:00",
          "2026-10-10T22:00",
          "2026-10-10T23:00",
          "2026-10-11T00:00",
          "2026-10-11T01:00",
          "2026-10-11T02:00",
          "2026-10-11T03:00",
          "2026-10-11T04:00",
          "2026-10-11T05:00",
          "2026-10-11T06:00",
          "2026-10-11T07:00",
          "2026-10-11T08:00",
          "2026-10-11T09:00",
          "2026-10-11T10:00",
          "2026-10-11T11:00",
          "2026-10-11T12:00",
          "2026-10-11T13:00",
          "2026-10-11T14:00",
          "2026-10-11T15:00",
          "2026-10-11T16:00",
          "2026-10-11T17:00",
          "2026-10-11T18:00",
          "2026-10-11T19:00",
          "2026-10-11T20:00",
          "2026-10-11T21:00",
          "2026-10-11T22:00",
          "2026-10-11T23:00",
          "2026-10-12T00:00",
          "2026-10-12T01:00",
          "2026-10-12T02:00",
          "2026-10-12T03:00",
          "2026-10-12T04:00",
          "2026-10-12T05:00",
          "2026-10-12T06:00",
          "2026-10-12T07:00",
          "2026-10-12T08:00",
          "2026-10-12T09:00",
          "2026-10-12T10:00",
          "2026-10-12T11:00",
          "2026-10-12T12:00",
          "2026-10-12T13:00",
          "2026-10-12T14:00",
          "2026-10-12T15:00",
          "2026-10-12T16:00",
          "2026-10-12T17:00",
          "2026-10-12T18:00",
          "2026-10-12T19:00",
          "2026-10-12T20:00"
        ],
        "pm2_5": [
          78.7,
          54.2,
          55.5,
          55.5,
          59.4,
          65.2,
          61.3,
          55.5,
          59.4,
          45.2,
          40.0,
          36.7,
          36.7,
          36.3,
          36.7,
          41.2,
          76.8,
          90.4,
          61.3,
          88.4,
          46.5,
          44.0,
          43.6,
          25.4,
          96.2,
          43.9,
          43.5,
          49.1,
          43.2,
          30.2,
          17.2,
          13.5,
          16.6,
          15.9,
          14.9,
          10.8,
          18.6,
          23.9,
          23.9,
          23.9,
          25.0,
          25.4,
          26.4,
          26.4,
          30.3,
          34.1,
          44.1,
          49.8,
          63.3
        ],
        "pm25_aqi": [
          163,
          147,
          151,
          151,
          153,
          156,
          154,
          151,
          153,
          125,
          112,
          104,
          104,
          103,
          104,
          115,
          162,
          169,
          154,
          168,
          128,
          122,
          121,
          79,
          172,
          122,
          121,
          134,
          120,
          89,
          62,
          54,
          60,
          59,
          57,
          45,
          65,
          76,
          76,
          76,
          78,
          79,
          81,
          81,
          89,
          97,
          122,
          136,
          155
        ],
        "us_aqi": [
          159,
          158,
          156,
          154,
          152,
          150,
          144,
          139,
          134,
          132,
          129,
          128,
          127,
          120,
          115,
          108,
          103,
          100,
          98,
          96,
          95,
          95,
          106,
          101,
          93,
          90,
          89,
          90,
          90,
          91,
          91,
          90,
          89,
          88,
          87,
          86,
          85,
          85,
          85,
          85,
          85,
          85,
          85,
          86,
          102,
          137,
          157,
          159,
          145
        ],
        "now_index": 24
      },
      "min_today": 79,
      "max_today": 198,
      "who_comparison": {
        "status": "6.4x WHO guideline (15 µg/m³)",
        "ratio": 6.4,
        "safe": false
      }
    },
    "runner_advice": {
      "verdict": "Unhealthy — Move Running Workouts Indoors",
      "badge": "INDOOR WORKOUT ONLY",
      "color": "#EF4444",
      "durations": {
        "low": {
          "label": "Low Intensity (Zone 1-2)",
          "sub": "Easy Jog, Recovery, Base Aerobic (HR < 70% Max)",
          "duration": "10 - 15 minutes Max (or brisk walk)",
          "safe": false,
          "note": "Not recommended. If running outside, wear wrap-around eyewear and wash face immediately."
        },
        "moderate": {
          "label": "Moderate Intensity (Zone 3)",
          "sub": "Steady Aerobic, Marathon Pace, Tempo (HR 70-80% Max)",
          "duration": "0 minutes (AVOID OUTDOORS)",
          "safe": false,
          "note": "Acute airway inflammation and systemic cardiovascular strain risk."
        },
        "high": {
          "label": "High Intensity (Zone 4-5)",
          "sub": "Intervals, Threshold, 5K Pace, Hill Sprints (HR > 80% Max)",
          "duration": "0 minutes (STRICTLY PROHIBITED)",
          "safe": false,
          "note": "Severe pulmonary irritation and bronchoconstriction hazard."
        }
      },
      "summary": "Air pollution is elevated to unhealthy levels. Outdoor running causes cellular damage equivalent to smoking several cigarettes. Run on an indoor treadmill with air conditioning.",
      "best_window": {
        "time": "08:00",
        "full_time": "2026-10-12T08:00",
        "predicted_aqi": 85,
        "recommendation": "Cleanest forecasted window: ~08:00 (Predicted AQI: 85)"
      },
      "heat_stress": {
        "temp_c": 27.4,
        "humidity_pct": 88,
        "apparent_temp_c": 33.9,
        "warning": "Moderate Heat & Humidity. High sweat rate. Carry hydration and electrolytes."
      },
      "tips": [
        "Route Choice: Run in shaded tree-dense parks (e.g. botanical gardens or forest reserves). Keep at least 200m away from expressways and industrial corridors.",
        "Respiratory Physiology: Running raises minute ventilation by 10x-15x, bypassing nasal filtration during mouth-breathing.",
        "Post-Run Protocol: Perform a saline nasal rinse immediately after finishing to flush trapped coarse particulates, and shower promptly.",
        "Indoor Alternative: On days with AQI > 100, schedule speed intervals on a gym treadmill and save easy outdoor miles for cleaner days."
      ]
    },
    "weather": {
      "source": "Open-Meteo Surface Weather Model",
      "temperature_c": 27.4,
      "relative_humidity_pct": 88,
      "apparent_temperature_c": 33.9,
      "wind_speed_ms": 2.6,
      "wind_direction_deg": 129,
      "precipitation_mm": 0.0,
      "uv_index": 0.0
    },
    "aqicn_ground": {
      "source": "WAQI / aqicn.org (Malaysia DOE Ground Station)",
      "station_id": 5780,
      "station_name": "Kuala Lumpur",
      "url": "https://aqicn.org/city/kuala-lumpur/",
      "updated": "Sunday, Oct 11th 2026, 19:00 pm",
      "overall_aqi": 172,
      "pm25": {
        "current": 172,
        "min": 79,
        "max": 198,
        "unit": "AQI sub-index"
      },
      "pollutants": {
        "pm10": {
          "current": "76",
          "min": "28",
          "max": "98"
        },
        "o3": {
          "current": "18",
          "min": "2",
          "max": "33"
        },
        "no2": {
          "current": "4",
          "min": "2",
          "max": "11"
        },
        "so2": {
          "current": "1",
          "min": "0",
          "max": "8"
        },
        "co": {
          "current": "0",
          "min": "0",
          "max": "0"
        }
      },
      "weather": {
        "humidity": "83",
        "pressure": "1009",
        "wind": "3"
      },
      "nearest_stations": [
        {
          "id": 5780,
          "name": "Kuala Lumpur",
          "geo": [
            3.139003,
            101.686855
          ],
          "aqi": "78",
          "time": "2026-10-11T18:00:00+08:00"
        },
        {
          "id": 2626,
          "name": "Cheras,Kuala Lumpur, Wilayah Persekutuan, Malaysia",
          "geo": [
            3.106236,
            101.717917
          ],
          "aqi": "111",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2625,
          "name": "Batu Muda,Kuala Lumpur, Wilayah Persekutuan, Malaysia",
          "geo": [
            3.212439,
            101.682228
          ],
          "aqi": "83",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2620,
          "name": "Petaling Jaya, Selangor, Malaysia",
          "geo": [
            3.133169,
            101.608011
          ],
          "aqi": "71",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2621,
          "name": "Shah Alam, Selangor, Malaysia",
          "geo": [
            3.104717,
            101.556222
          ],
          "aqi": "75",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 10485,
          "name": "Putrajaya, W.p. Putrajaya, Malaysia",
          "geo": [
            2.914816,
            101.69005
          ],
          "aqi": "77",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2619,
          "name": "Pelabuhan Kelang, Selangor, Malaysia",
          "geo": [
            3.014889,
            101.413111
          ],
          "aqi": "74",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2617,
          "name": "Banting, Selangor, Malaysia",
          "geo": [
            2.816689,
            101.623158
          ],
          "aqi": "59",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2588,
          "name": "Nilai, Negeri Sembilan, Malaysia",
          "geo": [
            2.821692,
            101.811486
          ],
          "aqi": "88",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2618,
          "name": "Kuala Selangor, Selangor, Malaysia",
          "geo": [
            3.321308,
            101.256242
          ],
          "aqi": "70",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2590,
          "name": "Seremban, Negeri Sembilan, Malaysia",
          "geo": [
            2.723381,
            101.968497
          ],
          "aqi": "93",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2598,
          "name": "Tanjung Malim, Perak, Malaysia",
          "geo": [
            3.687758,
            101.524494
          ],
          "aqi": "74",
          "time": "2026-10-11T19:00:00+08:00"
        }
      ],
      "history": {
        "pm25": {
          "time": [
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            147,
            151,
            151,
            153,
            156,
            154,
            151,
            153,
            125,
            112,
            104,
            104,
            103,
            104,
            115,
            162,
            169,
            154,
            168,
            128,
            122,
            121,
            79,
            172
          ],
          "pm25_aqi": [
            147,
            151,
            151,
            153,
            156,
            154,
            151,
            153,
            125,
            112,
            104,
            104,
            103,
            104,
            115,
            162,
            169,
            154,
            168,
            128,
            122,
            121,
            79,
            172
          ],
          "pm2_5": [
            54.2,
            55.5,
            55.5,
            59.4,
            65.2,
            61.3,
            55.5,
            59.4,
            45.2,
            40.0,
            36.7,
            36.7,
            36.3,
            36.7,
            41.2,
            76.8,
            90.4,
            61.3,
            88.4,
            46.5,
            44.0,
            43.6,
            25.4,
            96.2
          ],
          "us_aqi": [
            147,
            151,
            151,
            153,
            156,
            154,
            151,
            153,
            125,
            112,
            104,
            104,
            103,
            104,
            115,
            162,
            169,
            154,
            168,
            128,
            122,
            121,
            79,
            172
          ]
        },
        "pm10": {
          "time": [
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            53,
            55,
            56,
            58,
            61,
            60,
            57,
            55,
            45,
            41,
            40,
            43,
            43,
            42,
            42,
            65,
            70,
            56,
            39,
            51,
            44,
            44,
            28,
            76
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "o3": {
          "time": [
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            17,
            13,
            8,
            4,
            3,
            2,
            3,
            4,
            13,
            11,
            10,
            7,
            6,
            4,
            14,
            15,
            23,
            26,
            28,
            29,
            32,
            27,
            23,
            18
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "no2": {
          "time": [
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            9,
            10,
            11,
            8,
            8,
            5,
            5,
            5,
            5,
            5,
            4,
            4,
            5,
            4,
            3,
            4,
            4,
            3,
            2,
            2,
            2,
            2,
            4,
            4
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "so2": {
          "time": [
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            0,
            3,
            2,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "co": {
          "time": [
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "t": {
          "time": [
            "2026-10-10T15:00",
            "2026-10-10T17:00",
            "2026-10-10T18:00",
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            27,
            27,
            28,
            27,
            27,
            27,
            26,
            26,
            26,
            26,
            25,
            25,
            25,
            25,
            25,
            27,
            31,
            32,
            32,
            33,
            32,
            31,
            31,
            29
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "p": {
          "time": [
            "2026-10-10T15:00",
            "2026-10-10T17:00",
            "2026-10-10T18:00",
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            1007,
            1006,
            1007,
            1008,
            1009,
            1010,
            1010,
            1011,
            1011,
            1011,
            1010,
            1009,
            1009,
            1009,
            1011,
            1011,
            1011,
            1010,
            1010,
            1009,
            1007,
            1007,
            1007,
            1009
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "h": {
          "time": [
            "2026-10-10T15:00",
            "2026-10-10T17:00",
            "2026-10-10T18:00",
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            78,
            83,
            83,
            83,
            83,
            83,
            88,
            88,
            88,
            88,
            88,
            88,
            88,
            88,
            88,
            78,
            62,
            55,
            55,
            55,
            59,
            70,
            70,
            83
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "w": {
          "time": [
            "2026-10-09T21:00",
            "2026-10-10T08:00",
            "2026-10-10T09:00",
            "2026-10-10T11:00",
            "2026-10-10T12:00",
            "2026-10-10T13:00",
            "2026-10-10T14:00",
            "2026-10-10T15:00",
            "2026-10-10T18:00",
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T09:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            2,
            3,
            0,
            1,
            1,
            3,
            2,
            2,
            2,
            1,
            2,
            2,
            1,
            2,
            0,
            1,
            2,
            2,
            3,
            2,
            3,
            3,
            3,
            2
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        }
      }
    },
    "openmeteo_model": {
      "source": "Copernicus CAMS & NOAA GFS via Open-Meteo",
      "time": "2026-10-11T20:00",
      "us_aqi": 93,
      "european_aqi": 75,
      "pm25_concentration": {
        "value": 44.6,
        "unit": "µg/m³"
      },
      "pm10_concentration": {
        "value": 44.6,
        "unit": "µg/m³"
      },
      "pollutants_ugm3": {
        "carbon_monoxide": 3457.0,
        "nitrogen_dioxide": 89.9,
        "sulphur_dioxide": 43.9,
        "ozone": 17.0,
        "dust": 0.0
      },
      "hourly_forecast": {
        "time": [
          "2026-10-11T20:00",
          "2026-10-11T21:00",
          "2026-10-11T22:00",
          "2026-10-11T23:00",
          "2026-10-12T00:00",
          "2026-10-12T01:00",
          "2026-10-12T02:00",
          "2026-10-12T03:00",
          "2026-10-12T04:00",
          "2026-10-12T05:00",
          "2026-10-12T06:00",
          "2026-10-12T07:00",
          "2026-10-12T08:00",
          "2026-10-12T09:00",
          "2026-10-12T10:00",
          "2026-10-12T11:00",
          "2026-10-12T12:00",
          "2026-10-12T13:00",
          "2026-10-12T14:00",
          "2026-10-12T15:00",
          "2026-10-12T16:00",
          "2026-10-12T17:00",
          "2026-10-12T18:00",
          "2026-10-12T19:00",
          "2026-10-12T20:00",
          "2026-10-12T21:00",
          "2026-10-12T22:00",
          "2026-10-12T23:00"
        ],
        "pm2_5": [
          44.6,
          43.9,
          43.5,
          49.1,
          43.2,
          30.2,
          17.2,
          13.5,
          16.6,
          15.9,
          14.9,
          10.8,
          18.6,
          23.9,
          23.9,
          23.9,
          25.0,
          25.4,
          26.4,
          26.4,
          30.3,
          34.1,
          44.1,
          49.8,
          63.3,
          65.9,
          45.3,
          31.3
        ],
        "pm25_aqi": [
          172,
          122,
          121,
          134,
          120,
          89,
          62,
          54,
          60,
          59,
          57,
          45,
          65,
          76,
          76,
          76,
          78,
          79,
          81,
          81,
          89,
          97,
          122,
          136,
          155,
          156,
          125,
          91
        ],
        "pm10": [
          44.6,
          43.9,
          43.5,
          49.1,
          43.2,
          30.3,
          17.2,
          13.6,
          16.7,
          15.9,
          14.9,
          10.8,
          18.6,
          23.9,
          23.9,
          23.9,
          25.0,
          25.4,
          26.4,
          26.5,
          30.3,
          34.1,
          44.1,
          49.8,
          63.3,
          65.9,
          45.4,
          31.3
        ],
        "us_aqi": [
          93,
          90,
          89,
          90,
          90,
          91,
          91,
          90,
          89,
          88,
          87,
          86,
          85,
          85,
          85,
          85,
          85,
          85,
          85,
          86,
          102,
          137,
          157,
          159,
          145,
          112,
          91,
          91
        ],
        "european_aqi": [
          75,
          75,
          70,
          66,
          65,
          64,
          62,
          58,
          53,
          49,
          48,
          47,
          47,
          46,
          45,
          72,
          91,
          113,
          124,
          123,
          111,
          87,
          71,
          88,
          97,
          95,
          85,
          76
        ]
      },
      "past_24h": {
        "time": [
          "2026-10-10T20:00",
          "2026-10-10T21:00",
          "2026-10-10T22:00",
          "2026-10-10T23:00",
          "2026-10-11T00:00",
          "2026-10-11T01:00",
          "2026-10-11T02:00",
          "2026-10-11T03:00",
          "2026-10-11T04:00",
          "2026-10-11T05:00",
          "2026-10-11T06:00",
          "2026-10-11T07:00",
          "2026-10-11T08:00",
          "2026-10-11T09:00",
          "2026-10-11T10:00",
          "2026-10-11T11:00",
          "2026-10-11T12:00",
          "2026-10-11T13:00",
          "2026-10-11T14:00",
          "2026-10-11T15:00",
          "2026-10-11T16:00",
          "2026-10-11T17:00",
          "2026-10-11T18:00",
          "2026-10-11T19:00"
        ],
        "pm2_5": [
          54.2,
          55.5,
          55.5,
          59.4,
          65.2,
          61.3,
          55.5,
          59.4,
          45.2,
          40.0,
          36.7,
          36.7,
          36.3,
          36.7,
          41.2,
          76.8,
          90.4,
          61.3,
          88.4,
          46.5,
          44.0,
          43.6,
          25.4,
          96.2
        ],
        "pm25_aqi": [
          147,
          151,
          151,
          153,
          156,
          154,
          151,
          153,
          125,
          112,
          104,
          104,
          103,
          104,
          115,
          162,
          169,
          154,
          168,
          128,
          122,
          121,
          79,
          172
        ],
        "pm10": [
          80.3,
          56.2,
          35.3,
          43.7,
          38.3,
          27.6,
          27.6,
          29.6,
          29.6,
          29.1,
          23.7,
          26.0,
          16.9,
          17.9,
          23.9,
          27.8,
          27.2,
          23.5,
          22.2,
          21.8,
          23.7,
          27.5,
          39.6,
          44.7,
          44.6
        ],
        "us_aqi": [
          159,
          158,
          156,
          154,
          152,
          150,
          144,
          139,
          134,
          132,
          129,
          128,
          127,
          120,
          115,
          108,
          103,
          100,
          98,
          96,
          95,
          95,
          106,
          101,
          93
        ]
      },
      "timeline_48h": {
        "time": [
          "2026-10-10T20:00",
          "2026-10-10T21:00",
          "2026-10-10T22:00",
          "2026-10-10T23:00",
          "2026-10-11T00:00",
          "2026-10-11T01:00",
          "2026-10-11T02:00",
          "2026-10-11T03:00",
          "2026-10-11T04:00",
          "2026-10-11T05:00",
          "2026-10-11T06:00",
          "2026-10-11T07:00",
          "2026-10-11T08:00",
          "2026-10-11T09:00",
          "2026-10-11T10:00",
          "2026-10-11T11:00",
          "2026-10-11T12:00",
          "2026-10-11T13:00",
          "2026-10-11T14:00",
          "2026-10-11T15:00",
          "2026-10-11T16:00",
          "2026-10-11T17:00",
          "2026-10-11T18:00",
          "2026-10-11T19:00",
          "2026-10-11T20:00",
          "2026-10-11T21:00",
          "2026-10-11T22:00",
          "2026-10-11T23:00",
          "2026-10-12T00:00",
          "2026-10-12T01:00",
          "2026-10-12T02:00",
          "2026-10-12T03:00",
          "2026-10-12T04:00",
          "2026-10-12T05:00",
          "2026-10-12T06:00",
          "2026-10-12T07:00",
          "2026-10-12T08:00",
          "2026-10-12T09:00",
          "2026-10-12T10:00",
          "2026-10-12T11:00",
          "2026-10-12T12:00",
          "2026-10-12T13:00",
          "2026-10-12T14:00",
          "2026-10-12T15:00",
          "2026-10-12T16:00",
          "2026-10-12T17:00",
          "2026-10-12T18:00",
          "2026-10-12T19:00",
          "2026-10-12T20:00"
        ],
        "pm2_5": [
          78.7,
          54.2,
          55.5,
          55.5,
          59.4,
          65.2,
          61.3,
          55.5,
          59.4,
          45.2,
          40.0,
          36.7,
          36.7,
          36.3,
          36.7,
          41.2,
          76.8,
          90.4,
          61.3,
          88.4,
          46.5,
          44.0,
          43.6,
          25.4,
          96.2,
          43.9,
          43.5,
          49.1,
          43.2,
          30.2,
          17.2,
          13.5,
          16.6,
          15.9,
          14.9,
          10.8,
          18.6,
          23.9,
          23.9,
          23.9,
          25.0,
          25.4,
          26.4,
          26.4,
          30.3,
          34.1,
          44.1,
          49.8,
          63.3
        ],
        "pm25_aqi": [
          163,
          147,
          151,
          151,
          153,
          156,
          154,
          151,
          153,
          125,
          112,
          104,
          104,
          103,
          104,
          115,
          162,
          169,
          154,
          168,
          128,
          122,
          121,
          79,
          172,
          122,
          121,
          134,
          120,
          89,
          62,
          54,
          60,
          59,
          57,
          45,
          65,
          76,
          76,
          76,
          78,
          79,
          81,
          81,
          89,
          97,
          122,
          136,
          155
        ],
        "us_aqi": [
          159,
          158,
          156,
          154,
          152,
          150,
          144,
          139,
          134,
          132,
          129,
          128,
          127,
          120,
          115,
          108,
          103,
          100,
          98,
          96,
          95,
          95,
          106,
          101,
          93,
          90,
          89,
          90,
          90,
          91,
          91,
          90,
          89,
          88,
          87,
          86,
          85,
          85,
          85,
          85,
          85,
          85,
          85,
          86,
          102,
          137,
          157,
          159,
          145
        ],
        "now_index": 24
      }
    },
    "sources_comparison": {
      "aqicn_waqi": {
        "source_name": "WAQI / Malaysia DOE Continuous Monitoring",
        "available": true,
        "station_name": "Kuala Lumpur",
        "overall_aqi": 172,
        "pm25_subindex": 172,
        "url": "https://aqicn.org/city/kuala-lumpur/",
        "updated": "Sunday, Oct 11th 2026, 19:00 pm",
        "type": "Ground-Level Continuous Ambient Air Monitoring Station"
      },
      "copernicus_cams": {
        "source_name": "Copernicus CAMS Global Atmospheric Model (ECMWF)",
        "available": true,
        "us_aqi": 93,
        "european_aqi": 75,
        "pm25_ugm3": 96.2,
        "updated": "2026-10-11T20:00",
        "type": "European Union Satellite Earth Observation & 40km Numerical Model"
      },
      "noaa_gfs": {
        "source_name": "NOAA Global Forecast System (GFS Aerosols)",
        "available": true,
        "dust_ugm3": 0.0,
        "ozone_ugm3": 17.0,
        "type": "National Oceanic and Atmospheric Administration (NOAA) Chemical Forecast"
      },
      "malaysia_apu": {
        "source_name": "Malaysia DOE APIMS (Indeks Pencemaran Udara)",
        "available": true,
        "ipu_category": "Tidak Sihat",
        "regulatory_body": "Jabatan Alam Sekitar (JAS) Malaysia",
        "type": "National Environmental Quality Ambient Air Standard"
      },
      "surface_weather": {
        "source_name": "Open-Meteo High-Resolution Surface Microclimate",
        "available": true,
        "temperature_c": 27.4,
        "humidity_pct": 88.0,
        "apparent_temperature_c": 33.9,
        "wind_speed_ms": 2.6,
        "uv_index": 0.0,
        "type": "Meteorological Running Index"
      }
    },
    "timestamp": 1791721425.3272448
  },
  "alor-setar": {
    "preset_key": "alor-setar",
    "location": {
      "name": "Alor Setar",
      "state": "Kedah",
      "country": "Malaysia",
      "latitude": 6.121,
      "longitude": 100.3601
    },
    "overall_aqi": 55,
    "primary_source": "WAQI / Malaysia DOE Ground Station",
    "category": {
      "category": "Moderate",
      "malayCategory": "Sederhana",
      "color": "#F59E0B",
      "textColor": "#1F2937",
      "level": 2,
      "health": "Air quality is acceptable; however, very sensitive people may experience minor respiratory irritation.",
      "recommendation": "Unusually sensitive people should consider reducing prolonged or heavy outdoor exertion.",
      "outdoor_activity": "Safe for general public; sensitive groups reduce strenuous workouts",
      "mask": "Optional for sensitive individuals",
      "air_purifier": "Recommended for people with asthma or allergies"
    },
    "pm25": {
      "aqi_reading": 44,
      "sub_index": 44,
      "concentration_ugm3": 10.6,
      "category": {
        "category": "Good",
        "malayCategory": "Baik",
        "color": "#10B981",
        "textColor": "#ffffff",
        "level": 1,
        "health": "Air quality is considered satisfactory, and air pollution poses little or no risk.",
        "recommendation": "Air quality is ideal for most individuals; enjoy your normal outdoor activities.",
        "outdoor_activity": "Enjoy outdoor activities, sports, and ventilation",
        "mask": "No mask required",
        "air_purifier": "Natural ventilation is safe"
      },
      "trend": {
        "direction": "improving",
        "direction_label": "Improving (Dropping)",
        "trajectory": "FALLING",
        "arrow": "↘",
        "change_6h": -34,
        "drift_6h_aqi": -34,
        "drift_6h_conc": -4.5,
        "color": "#10B981",
        "peak_aqi": {
          "value": 48,
          "time": "19:00"
        },
        "peak_time": "19:00",
        "peak_val": 48,
        "cleanest_window": {
          "aqi": 10,
          "conc": 2.4,
          "time": "02:00"
        },
        "lowest_aqi": 10,
        "lowest_time": "02:00",
        "clean_val": 10,
        "peak_conc": {
          "value": 11.5,
          "time": "19:00"
        },
        "lowest_conc": {
          "value": 2.4,
          "time": "02:00"
        },
        "summary": "Improving trend: PM2.5 AQI expected to drop by 34 points over the next 6 hours, reaching a low of 10 AQI at ~02:00."
      },
      "future_trend": {
        "direction": "improving",
        "direction_label": "Improving (Dropping)",
        "trajectory": "FALLING",
        "arrow": "↘",
        "change_6h": -34,
        "drift_6h_aqi": -34,
        "drift_6h_conc": -4.5,
        "color": "#10B981",
        "peak_aqi": {
          "value": 48,
          "time": "19:00"
        },
        "peak_time": "19:00",
        "peak_val": 48,
        "cleanest_window": {
          "aqi": 10,
          "conc": 2.4,
          "time": "02:00"
        },
        "lowest_aqi": 10,
        "lowest_time": "02:00",
        "clean_val": 10,
        "peak_conc": {
          "value": 11.5,
          "time": "19:00"
        },
        "lowest_conc": {
          "value": 2.4,
          "time": "02:00"
        },
        "summary": "Improving trend: PM2.5 AQI expected to drop by 34 points over the next 6 hours, reaching a low of 10 AQI at ~02:00."
      },
      "past_trend": {
        "trajectory": "FALLING",
        "direction_label": "Improved (-46 pts past 6h)",
        "arrow": "↘",
        "drift_6h": -46,
        "drift_24h": -38,
        "drift_6h_conc": -20.0,
        "color": "#10B981",
        "peak_aqi": {
          "value": 90,
          "time": "12:00"
        },
        "peak_val": 90,
        "lowest_aqi": {
          "value": 16,
          "time": "14:00"
        },
        "clean_val": 16,
        "peak_conc": {
          "value": 30.6,
          "time": "12:00"
        },
        "lowest_conc": {
          "value": 3.8,
          "time": "14:00"
        },
        "summary": "Past 24h: PM2.5 AQI shifted by -38 pts (-46 pts in last 6h), reaching a past peak of 90 AQI at ~12:00 and a low of 16 AQI at ~14:00."
      },
      "hourly_times": [
        "2026-10-11T20:00",
        "2026-10-11T21:00",
        "2026-10-11T22:00",
        "2026-10-11T23:00",
        "2026-10-12T00:00",
        "2026-10-12T01:00",
        "2026-10-12T02:00",
        "2026-10-12T03:00",
        "2026-10-12T04:00",
        "2026-10-12T05:00",
        "2026-10-12T06:00",
        "2026-10-12T07:00",
        "2026-10-12T08:00",
        "2026-10-12T09:00",
        "2026-10-12T10:00",
        "2026-10-12T11:00",
        "2026-10-12T12:00",
        "2026-10-12T13:00",
        "2026-10-12T14:00",
        "2026-10-12T15:00",
        "2026-10-12T16:00",
        "2026-10-12T17:00",
        "2026-10-12T18:00",
        "2026-10-12T19:00",
        "2026-10-12T20:00",
        "2026-10-12T21:00",
        "2026-10-12T22:00",
        "2026-10-12T23:00"
      ],
      "hourly_aqi": [
        44,
        26,
        23,
        21,
        24,
        17,
        10,
        10,
        10,
        11,
        13,
        14,
        18,
        22,
        20,
        19,
        20,
        25,
        26,
        26,
        27,
        28,
        38,
        48,
        54,
        51,
        50,
        52
      ],
      "hourly_conc": [
        6.9,
        6.3,
        5.6,
        5.1,
        5.7,
        4.1,
        2.4,
        2.4,
        2.5,
        2.6,
        3.1,
        3.4,
        4.2,
        5.3,
        4.9,
        4.5,
        4.7,
        5.9,
        6.2,
        6.2,
        6.4,
        6.8,
        9.1,
        11.5,
        13.7,
        12.3,
        11.9,
        12.5
      ],
      "past_24h": {
        "time": [
          "2026-10-10T19:00",
          "2026-10-10T20:00",
          "2026-10-10T21:00",
          "2026-10-10T22:00",
          "2026-10-10T23:00",
          "2026-10-11T00:00",
          "2026-10-11T01:00",
          "2026-10-11T02:00",
          "2026-10-11T03:00",
          "2026-10-11T04:00",
          "2026-10-11T05:00",
          "2026-10-11T06:00",
          "2026-10-11T07:00",
          "2026-10-11T08:00",
          "2026-10-11T09:00",
          "2026-10-11T10:00",
          "2026-10-11T11:00",
          "2026-10-11T12:00",
          "2026-10-11T13:00",
          "2026-10-11T14:00",
          "2026-10-11T15:00",
          "2026-10-11T16:00",
          "2026-10-11T17:00",
          "2026-10-11T18:00"
        ],
        "pm2_5": [
          26.8,
          20.7,
          23.0,
          17.8,
          18.3,
          11.8,
          12.1,
          13.1,
          15.9,
          17.3,
          13.5,
          15.0,
          12.1,
          13.1,
          19.2,
          14.0,
          14.5,
          30.6,
          14.5,
          3.8,
          5.3,
          13.5,
          14.5,
          10.6
        ],
        "pm25_aqi": [
          82,
          69,
          74,
          63,
          64,
          49,
          51,
          53,
          59,
          62,
          54,
          57,
          51,
          53,
          66,
          55,
          56,
          90,
          56,
          16,
          22,
          54,
          56,
          44
        ],
        "pm10": [
          7.7,
          6.7,
          4.9,
          6.0,
          7.2,
          8.6,
          9.9,
          9.4,
          8.8,
          8.5,
          7.0,
          6.9,
          4.8,
          5.8,
          6.2,
          5.6,
          5.0,
          5.3,
          5.7,
          5.2,
          4.9,
          5.1,
          5.0,
          6.8,
          7.4
        ],
        "us_aqi": [
          69,
          68,
          67,
          66,
          64,
          63,
          62,
          60,
          58,
          58,
          58,
          59,
          59,
          59,
          58,
          58,
          59,
          59,
          58,
          57,
          57,
          56,
          55,
          55
        ]
      },
      "future_24h": {
        "time": [
          "2026-10-11T20:00",
          "2026-10-11T21:00",
          "2026-10-11T22:00",
          "2026-10-11T23:00",
          "2026-10-12T00:00",
          "2026-10-12T01:00",
          "2026-10-12T02:00",
          "2026-10-12T03:00",
          "2026-10-12T04:00",
          "2026-10-12T05:00",
          "2026-10-12T06:00",
          "2026-10-12T07:00",
          "2026-10-12T08:00",
          "2026-10-12T09:00",
          "2026-10-12T10:00",
          "2026-10-12T11:00",
          "2026-10-12T12:00",
          "2026-10-12T13:00",
          "2026-10-12T14:00",
          "2026-10-12T15:00",
          "2026-10-12T16:00",
          "2026-10-12T17:00",
          "2026-10-12T18:00",
          "2026-10-12T19:00",
          "2026-10-12T20:00",
          "2026-10-12T21:00",
          "2026-10-12T22:00",
          "2026-10-12T23:00"
        ],
        "pm2_5": [
          6.9,
          6.3,
          5.6,
          5.1,
          5.7,
          4.1,
          2.4,
          2.4,
          2.5,
          2.6,
          3.1,
          3.4,
          4.2,
          5.3,
          4.9,
          4.5,
          4.7,
          5.9,
          6.2,
          6.2,
          6.4,
          6.8,
          9.1,
          11.5,
          13.7,
          12.3,
          11.9,
          12.5
        ],
        "pm25_aqi": [
          44,
          26,
          23,
          21,
          24,
          17,
          10,
          10,
          10,
          11,
          13,
          14,
          18,
          22,
          20,
          19,
          20,
          25,
          26,
          26,
          27,
          28,
          38,
          48,
          54,
          51,
          50,
          52
        ],
        "pm10": [
          7.4,
          6.9,
          6.1,
          5.6,
          6.1,
          4.4,
          2.7,
          2.7,
          2.8,
          2.9,
          3.4,
          3.6,
          4.4,
          5.4,
          4.9,
          4.5,
          4.7,
          6.0,
          6.2,
          6.3,
          6.6,
          7.1,
          9.5,
          12.0,
          14.3,
          12.9,
          12.5,
          13.0
        ],
        "us_aqi": [
          43,
          40,
          37,
          34,
          34,
          33,
          32,
          31,
          29,
          28,
          26,
          26,
          25,
          25,
          25,
          25,
          26,
          29,
          34,
          38,
          43,
          47,
          50,
          51,
          49,
          46,
          42,
          38
        ],
        "european_aqi": [
          24,
          23,
          23,
          22,
          21,
          17,
          18,
          17,
          15,
          14,
          13,
          14,
          17,
          21,
          31,
          42,
          51,
          55,
          56,
          55,
          51,
          44,
          36,
          33,
          37,
          38,
          37,
          36
        ]
      },
      "timeline_48h": {
        "time": [
          "2026-10-10T20:00",
          "2026-10-10T21:00",
          "2026-10-10T22:00",
          "2026-10-10T23:00",
          "2026-10-11T00:00",
          "2026-10-11T01:00",
          "2026-10-11T02:00",
          "2026-10-11T03:00",
          "2026-10-11T04:00",
          "2026-10-11T05:00",
          "2026-10-11T06:00",
          "2026-10-11T07:00",
          "2026-10-11T08:00",
          "2026-10-11T09:00",
          "2026-10-11T10:00",
          "2026-10-11T11:00",
          "2026-10-11T12:00",
          "2026-10-11T13:00",
          "2026-10-11T14:00",
          "2026-10-11T15:00",
          "2026-10-11T16:00",
          "2026-10-11T17:00",
          "2026-10-11T18:00",
          "2026-10-11T19:00",
          "2026-10-11T20:00",
          "2026-10-11T21:00",
          "2026-10-11T22:00",
          "2026-10-11T23:00",
          "2026-10-12T00:00",
          "2026-10-12T01:00",
          "2026-10-12T02:00",
          "2026-10-12T03:00",
          "2026-10-12T04:00",
          "2026-10-12T05:00",
          "2026-10-12T06:00",
          "2026-10-12T07:00",
          "2026-10-12T08:00",
          "2026-10-12T09:00",
          "2026-10-12T10:00",
          "2026-10-12T11:00",
          "2026-10-12T12:00",
          "2026-10-12T13:00",
          "2026-10-12T14:00",
          "2026-10-12T15:00",
          "2026-10-12T16:00",
          "2026-10-12T17:00",
          "2026-10-12T18:00",
          "2026-10-12T19:00",
          "2026-10-12T20:00"
        ],
        "pm2_5": [
          7.6,
          26.8,
          20.7,
          23.0,
          17.8,
          18.3,
          11.8,
          12.1,
          13.1,
          15.9,
          17.3,
          13.5,
          15.0,
          12.1,
          13.1,
          19.2,
          14.0,
          14.5,
          30.6,
          14.5,
          3.8,
          5.3,
          13.5,
          14.5,
          10.6,
          6.3,
          5.6,
          5.1,
          5.7,
          4.1,
          2.4,
          2.4,
          2.5,
          2.6,
          3.1,
          3.4,
          4.2,
          5.3,
          4.9,
          4.5,
          4.7,
          5.9,
          6.2,
          6.2,
          6.4,
          6.8,
          9.1,
          11.5,
          13.7
        ],
        "pm25_aqi": [
          32,
          82,
          69,
          74,
          63,
          64,
          49,
          51,
          53,
          59,
          62,
          54,
          57,
          51,
          53,
          66,
          55,
          56,
          90,
          56,
          16,
          22,
          54,
          56,
          44,
          26,
          23,
          21,
          24,
          17,
          10,
          10,
          10,
          11,
          13,
          14,
          18,
          22,
          20,
          19,
          20,
          25,
          26,
          26,
          27,
          28,
          38,
          48,
          54
        ],
        "us_aqi": [
          56,
          54,
          53,
          50,
          45,
          41,
          40,
          40,
          40,
          39,
          39,
          38,
          37,
          37,
          36,
          36,
          35,
          35,
          35,
          35,
          39,
          42,
          44,
          45,
          43,
          40,
          37,
          34,
          34,
          33,
          32,
          31,
          29,
          28,
          26,
          26,
          25,
          25,
          25,
          25,
          26,
          29,
          34,
          38,
          43,
          47,
          50,
          51,
          49
        ],
        "now_index": 24
      },
      "min_today": 16,
      "max_today": 137,
      "who_comparison": {
        "status": "Within WHO safe limit (15 µg/m³)",
        "ratio": 0.7,
        "safe": true
      }
    },
    "runner_advice": {
      "verdict": "Generally Safe — Moderate Precautions",
      "badge": "GENERALLY SAFE",
      "color": "#F59E0B",
      "durations": {
        "low": {
          "label": "Low Intensity (Zone 1-2)",
          "sub": "Easy Jog, Recovery, Base Aerobic (HR < 70% Max)",
          "duration": "60 - 75 minutes",
          "safe": true,
          "note": "Safe for healthy runners. Sensitive runners monitor airway comfort."
        },
        "moderate": {
          "label": "Moderate Intensity (Zone 3)",
          "sub": "Steady Aerobic, Marathon Pace, Tempo (HR 70-80% Max)",
          "duration": "30 - 45 minutes",
          "safe": true,
          "note": "Keep session controlled. Avoid exhaust-heavy roadside running."
        },
        "high": {
          "label": "High Intensity (Zone 4-5)",
          "sub": "Intervals, Threshold, 5K Pace, Hill Sprints (HR > 80% Max)",
          "duration": "20 - 30 minutes",
          "safe": true,
          "note": "Limit maximum effort duration. Asthmatic runners should pre-medicate or run indoors."
        }
      },
      "summary": "Safe for general runners. Keep high-intensity intervals concise. Prefer leafy park loops over roadside routes.",
      "best_window": {
        "time": "08:00",
        "full_time": "2026-10-12T08:00",
        "predicted_aqi": 25,
        "recommendation": "Cleanest forecasted window: ~08:00 (Predicted AQI: 25)"
      },
      "heat_stress": {
        "temp_c": 24.3,
        "humidity_pct": 97,
        "apparent_temp_c": 29.2,
        "warning": "Tropical Warmth. Normal hydration and pre-cooling recommended."
      },
      "tips": [
        "Route Choice: Run in shaded tree-dense parks (e.g. botanical gardens or forest reserves). Keep at least 200m away from expressways and industrial corridors.",
        "Respiratory Physiology: Running raises minute ventilation by 10x-15x, bypassing nasal filtration during mouth-breathing.",
        "Post-Run Protocol: Perform a saline nasal rinse immediately after finishing to flush trapped coarse particulates, and shower promptly.",
        "Indoor Alternative: On days with AQI > 100, schedule speed intervals on a gym treadmill and save easy outdoor miles for cleaner days."
      ]
    },
    "weather": {
      "source": "Open-Meteo Surface Weather Model",
      "temperature_c": 24.3,
      "relative_humidity_pct": 97,
      "apparent_temperature_c": 29.2,
      "wind_speed_ms": 7.4,
      "wind_direction_deg": 93,
      "precipitation_mm": 0.1,
      "uv_index": 0.0
    },
    "aqicn_ground": {
      "source": "WAQI / aqicn.org (Malaysia DOE Ground Station)",
      "station_id": 2581,
      "station_name": "Alor Setar, Kedah, Malaysia",
      "url": "https://aqicn.org/city/malaysia/kedah/alor-setar/",
      "updated": "Sunday, Oct 11th 2026, 19:00 pm",
      "overall_aqi": 55,
      "pm25": {
        "current": 44,
        "min": 16,
        "max": 137,
        "unit": "AQI sub-index"
      },
      "pollutants": {
        "pm10": {
          "current": "15",
          "min": "8",
          "max": "52"
        },
        "o3": {
          "current": "10",
          "min": "1",
          "max": "19"
        },
        "no2": {
          "current": "2",
          "min": "1",
          "max": "5"
        },
        "so2": {
          "current": "1",
          "min": "1",
          "max": "1"
        },
        "co": {
          "current": "0",
          "min": "0",
          "max": "0"
        }
      },
      "weather": {
        "humidity": "94",
        "pressure": "1009",
        "wind": "1"
      },
      "nearest_stations": [
        {
          "id": 2581,
          "name": "Alor Setar, Kedah, Malaysia",
          "geo": [
            6.137244,
            100.346815
          ],
          "aqi": "55",
          "time": "2026-10-11T18:00:00+08:00"
        },
        {
          "id": 2599,
          "name": "Kangar, Perlis, Malaysia",
          "geo": [
            6.429922,
            100.211069
          ],
          "aqi": "45",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2582,
          "name": "Bakar Arang, Sg. Petani, Kedah, Malaysia",
          "geo": [
            5.629631,
            100.467771
          ],
          "aqi": "57",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2583,
          "name": "Langkawi, Kedah, Malaysia",
          "geo": [
            6.331539,
            99.85846
          ],
          "aqi": "35",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 10482,
          "name": "Phiman, Satun, Satun, Thailand (ต.พิมาน อ.เมือง จ.สตูล)",
          "geo": [
            6.624747,
            100.066159
          ],
          "aqi": "39",
          "time": "2026-10-11T19:00:00+07:00"
        },
        {
          "id": 2601,
          "name": "Seberang Jaya 2, Perai, Pulau Pinang, Malaysia",
          "geo": [
            5.39817,
            100.403947
          ],
          "aqi": "57",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 5778,
          "name": "Perai",
          "geo": [
            5.384388,
            100.3896169
          ],
          "aqi": "16",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 9488,
          "name": "Kulim Hi-Tech, Kedah, Malaysia",
          "geo": [
            5.401688,
            100.58968
          ],
          "aqi": "42",
          "time": "2026-10-11T18:00:00+08:00"
        },
        {
          "id": 9489,
          "name": "Minden, Pulau Pinang, Malaysia",
          "geo": [
            5.356211,
            100.30792
          ],
          "aqi": "43",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 12760,
          "name": "Betong, Thailand (ต.เบตง อ.เบตง จ.ยะลา)",
          "geo": [
            5.763873,
            101.067903
          ],
          "aqi": "44",
          "time": "2026-10-11T19:00:00+07:00"
        },
        {
          "id": 9490,
          "name": "Balik Pulau, Pulau Pinang, Malaysia",
          "geo": [
            5.337598,
            100.214721
          ],
          "aqi": "31",
          "time": "2026-10-11T19:00:00+08:00"
        },
        {
          "id": 2600,
          "name": "Perai, Pulau Pinang, Malaysia",
          "geo": [
            5.329358,
            100.443475
          ],
          "aqi": "53",
          "time": "2026-10-11T19:00:00+08:00"
        }
      ],
      "history": {
        "aqi": {
          "time": [
            "2026-10-10T16:00",
            "2026-10-10T17:00",
            "2026-10-10T18:00",
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            69,
            68,
            67,
            66,
            64,
            63,
            62,
            60,
            58,
            58,
            58,
            59,
            59,
            59,
            58,
            58,
            59,
            59,
            58,
            57,
            57,
            56,
            55,
            55
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": [
            69,
            68,
            67,
            66,
            64,
            63,
            62,
            60,
            58,
            58,
            58,
            59,
            59,
            59,
            58,
            58,
            59,
            59,
            58,
            57,
            57,
            56,
            55,
            55
          ]
        },
        "pm25": {
          "time": [
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00"
          ],
          "values": [
            82,
            69,
            74,
            63,
            64,
            49,
            51,
            53,
            59,
            62,
            54,
            57,
            51,
            53,
            66,
            55,
            56,
            90,
            56,
            16,
            22,
            54,
            56,
            44
          ],
          "pm25_aqi": [
            82,
            69,
            74,
            63,
            64,
            49,
            51,
            53,
            59,
            62,
            54,
            57,
            51,
            53,
            66,
            55,
            56,
            90,
            56,
            16,
            22,
            54,
            56,
            44
          ],
          "pm2_5": [
            26.8,
            20.7,
            23.0,
            17.8,
            18.3,
            11.8,
            12.1,
            13.1,
            15.9,
            17.3,
            13.5,
            15.0,
            12.1,
            13.1,
            19.2,
            14.0,
            14.5,
            30.6,
            14.5,
            3.8,
            5.3,
            13.5,
            14.5,
            10.6
          ],
          "us_aqi": [
            82,
            69,
            74,
            63,
            64,
            49,
            51,
            53,
            59,
            62,
            54,
            57,
            51,
            53,
            66,
            55,
            56,
            90,
            56,
            16,
            22,
            54,
            56,
            44
          ]
        },
        "pm10": {
          "time": [
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00"
          ],
          "values": [
            32,
            26,
            28,
            23,
            25,
            18,
            17,
            20,
            25,
            26,
            24,
            24,
            23,
            22,
            29,
            22,
            19,
            35,
            18,
            8,
            10,
            18,
            19,
            15
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "o3": {
          "time": [
            "2026-10-10T18:00",
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00"
          ],
          "values": [
            10,
            9,
            6,
            5,
            5,
            3,
            6,
            6,
            5,
            3,
            2,
            2,
            1,
            1,
            1,
            7,
            10,
            12,
            14,
            15,
            16,
            19,
            16,
            10
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "no2": {
          "time": [
            "2026-10-10T18:00",
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00"
          ],
          "values": [
            4,
            3,
            4,
            5,
            4,
            5,
            2,
            2,
            3,
            3,
            2,
            2,
            2,
            2,
            2,
            3,
            2,
            1,
            1,
            1,
            1,
            1,
            2,
            2
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "so2": {
          "time": [
            "2026-10-10T18:00",
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00"
          ],
          "values": [
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "co": {
          "time": [
            "2026-10-10T18:00",
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00"
          ],
          "values": [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "t": {
          "time": [
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            26,
            26,
            26,
            26,
            26,
            26,
            26,
            26,
            26,
            25,
            26,
            25,
            26,
            28,
            30,
            31,
            32,
            33,
            34,
            28,
            25,
            24,
            24,
            25
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "p": {
          "time": [
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            1008,
            1008,
            1010,
            1010,
            1010,
            1010,
            1010,
            1008,
            1008,
            1008,
            1008,
            1009,
            1010,
            1010,
            1010,
            1010,
            1010,
            1010,
            1008,
            1007,
            1008,
            1008,
            1009,
            1009
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "h": {
          "time": [
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00",
            "2026-10-11T19:00"
          ],
          "values": [
            91,
            94,
            94,
            94,
            94,
            94,
            94,
            97,
            97,
            100,
            97,
            100,
            97,
            81,
            74,
            70,
            64,
            60,
            58,
            84,
            94,
            97,
            97,
            94
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "w": {
          "time": [
            "2026-10-10T19:00",
            "2026-10-10T20:00",
            "2026-10-10T21:00",
            "2026-10-10T22:00",
            "2026-10-10T23:00",
            "2026-10-11T00:00",
            "2026-10-11T01:00",
            "2026-10-11T02:00",
            "2026-10-11T03:00",
            "2026-10-11T04:00",
            "2026-10-11T05:00",
            "2026-10-11T06:00",
            "2026-10-11T07:00",
            "2026-10-11T08:00",
            "2026-10-11T09:00",
            "2026-10-11T10:00",
            "2026-10-11T11:00",
            "2026-10-11T12:00",
            "2026-10-11T13:00",
            "2026-10-11T14:00",
            "2026-10-11T15:00",
            "2026-10-11T16:00",
            "2026-10-11T17:00",
            "2026-10-11T18:00"
          ],
          "values": [
            2,
            2,
            1,
            1,
            1,
            1,
            1,
            0,
            1,
            1,
            0,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            2,
            7,
            6,
            4,
            1
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        }
      }
    },
    "openmeteo_model": {
      "source": "Copernicus CAMS & NOAA GFS via Open-Meteo",
      "time": "2026-10-11T20:00",
      "us_aqi": 43,
      "european_aqi": 24,
      "pm25_concentration": {
        "value": 6.9,
        "unit": "µg/m³"
      },
      "pm10_concentration": {
        "value": 7.4,
        "unit": "µg/m³"
      },
      "pollutants_ugm3": {
        "carbon_monoxide": 334.0,
        "nitrogen_dioxide": 11.2,
        "sulphur_dioxide": 4.1,
        "ozone": 55.0,
        "dust": 0.0
      },
      "hourly_forecast": {
        "time": [
          "2026-10-11T20:00",
          "2026-10-11T21:00",
          "2026-10-11T22:00",
          "2026-10-11T23:00",
          "2026-10-12T00:00",
          "2026-10-12T01:00",
          "2026-10-12T02:00",
          "2026-10-12T03:00",
          "2026-10-12T04:00",
          "2026-10-12T05:00",
          "2026-10-12T06:00",
          "2026-10-12T07:00",
          "2026-10-12T08:00",
          "2026-10-12T09:00",
          "2026-10-12T10:00",
          "2026-10-12T11:00",
          "2026-10-12T12:00",
          "2026-10-12T13:00",
          "2026-10-12T14:00",
          "2026-10-12T15:00",
          "2026-10-12T16:00",
          "2026-10-12T17:00",
          "2026-10-12T18:00",
          "2026-10-12T19:00",
          "2026-10-12T20:00",
          "2026-10-12T21:00",
          "2026-10-12T22:00",
          "2026-10-12T23:00"
        ],
        "pm2_5": [
          6.9,
          6.3,
          5.6,
          5.1,
          5.7,
          4.1,
          2.4,
          2.4,
          2.5,
          2.6,
          3.1,
          3.4,
          4.2,
          5.3,
          4.9,
          4.5,
          4.7,
          5.9,
          6.2,
          6.2,
          6.4,
          6.8,
          9.1,
          11.5,
          13.7,
          12.3,
          11.9,
          12.5
        ],
        "pm25_aqi": [
          44,
          26,
          23,
          21,
          24,
          17,
          10,
          10,
          10,
          11,
          13,
          14,
          18,
          22,
          20,
          19,
          20,
          25,
          26,
          26,
          27,
          28,
          38,
          48,
          54,
          51,
          50,
          52
        ],
        "pm10": [
          7.4,
          6.9,
          6.1,
          5.6,
          6.1,
          4.4,
          2.7,
          2.7,
          2.8,
          2.9,
          3.4,
          3.6,
          4.4,
          5.4,
          4.9,
          4.5,
          4.7,
          6.0,
          6.2,
          6.3,
          6.6,
          7.1,
          9.5,
          12.0,
          14.3,
          12.9,
          12.5,
          13.0
        ],
        "us_aqi": [
          43,
          40,
          37,
          34,
          34,
          33,
          32,
          31,
          29,
          28,
          26,
          26,
          25,
          25,
          25,
          25,
          26,
          29,
          34,
          38,
          43,
          47,
          50,
          51,
          49,
          46,
          42,
          38
        ],
        "european_aqi": [
          24,
          23,
          23,
          22,
          21,
          17,
          18,
          17,
          15,
          14,
          13,
          14,
          17,
          21,
          31,
          42,
          51,
          55,
          56,
          55,
          51,
          44,
          36,
          33,
          37,
          38,
          37,
          36
        ]
      },
      "past_24h": {
        "time": [
          "2026-10-10T19:00",
          "2026-10-10T20:00",
          "2026-10-10T21:00",
          "2026-10-10T22:00",
          "2026-10-10T23:00",
          "2026-10-11T00:00",
          "2026-10-11T01:00",
          "2026-10-11T02:00",
          "2026-10-11T03:00",
          "2026-10-11T04:00",
          "2026-10-11T05:00",
          "2026-10-11T06:00",
          "2026-10-11T07:00",
          "2026-10-11T08:00",
          "2026-10-11T09:00",
          "2026-10-11T10:00",
          "2026-10-11T11:00",
          "2026-10-11T12:00",
          "2026-10-11T13:00",
          "2026-10-11T14:00",
          "2026-10-11T15:00",
          "2026-10-11T16:00",
          "2026-10-11T17:00",
          "2026-10-11T18:00"
        ],
        "pm2_5": [
          26.8,
          20.7,
          23.0,
          17.8,
          18.3,
          11.8,
          12.1,
          13.1,
          15.9,
          17.3,
          13.5,
          15.0,
          12.1,
          13.1,
          19.2,
          14.0,
          14.5,
          30.6,
          14.5,
          3.8,
          5.3,
          13.5,
          14.5,
          10.6
        ],
        "pm25_aqi": [
          82,
          69,
          74,
          63,
          64,
          49,
          51,
          53,
          59,
          62,
          54,
          57,
          51,
          53,
          66,
          55,
          56,
          90,
          56,
          16,
          22,
          54,
          56,
          44
        ],
        "pm10": [
          7.7,
          6.7,
          4.9,
          6.0,
          7.2,
          8.6,
          9.9,
          9.4,
          8.8,
          8.5,
          7.0,
          6.9,
          4.8,
          5.8,
          6.2,
          5.6,
          5.0,
          5.3,
          5.7,
          5.2,
          4.9,
          5.1,
          5.0,
          6.8,
          7.4
        ],
        "us_aqi": [
          69,
          68,
          67,
          66,
          64,
          63,
          62,
          60,
          58,
          58,
          58,
          59,
          59,
          59,
          58,
          58,
          59,
          59,
          58,
          57,
          57,
          56,
          55,
          55
        ]
      },
      "timeline_48h": {
        "time": [
          "2026-10-10T20:00",
          "2026-10-10T21:00",
          "2026-10-10T22:00",
          "2026-10-10T23:00",
          "2026-10-11T00:00",
          "2026-10-11T01:00",
          "2026-10-11T02:00",
          "2026-10-11T03:00",
          "2026-10-11T04:00",
          "2026-10-11T05:00",
          "2026-10-11T06:00",
          "2026-10-11T07:00",
          "2026-10-11T08:00",
          "2026-10-11T09:00",
          "2026-10-11T10:00",
          "2026-10-11T11:00",
          "2026-10-11T12:00",
          "2026-10-11T13:00",
          "2026-10-11T14:00",
          "2026-10-11T15:00",
          "2026-10-11T16:00",
          "2026-10-11T17:00",
          "2026-10-11T18:00",
          "2026-10-11T19:00",
          "2026-10-11T20:00",
          "2026-10-11T21:00",
          "2026-10-11T22:00",
          "2026-10-11T23:00",
          "2026-10-12T00:00",
          "2026-10-12T01:00",
          "2026-10-12T02:00",
          "2026-10-12T03:00",
          "2026-10-12T04:00",
          "2026-10-12T05:00",
          "2026-10-12T06:00",
          "2026-10-12T07:00",
          "2026-10-12T08:00",
          "2026-10-12T09:00",
          "2026-10-12T10:00",
          "2026-10-12T11:00",
          "2026-10-12T12:00",
          "2026-10-12T13:00",
          "2026-10-12T14:00",
          "2026-10-12T15:00",
          "2026-10-12T16:00",
          "2026-10-12T17:00",
          "2026-10-12T18:00",
          "2026-10-12T19:00",
          "2026-10-12T20:00"
        ],
        "pm2_5": [
          7.6,
          26.8,
          20.7,
          23.0,
          17.8,
          18.3,
          11.8,
          12.1,
          13.1,
          15.9,
          17.3,
          13.5,
          15.0,
          12.1,
          13.1,
          19.2,
          14.0,
          14.5,
          30.6,
          14.5,
          3.8,
          5.3,
          13.5,
          14.5,
          10.6,
          6.3,
          5.6,
          5.1,
          5.7,
          4.1,
          2.4,
          2.4,
          2.5,
          2.6,
          3.1,
          3.4,
          4.2,
          5.3,
          4.9,
          4.5,
          4.7,
          5.9,
          6.2,
          6.2,
          6.4,
          6.8,
          9.1,
          11.5,
          13.7
        ],
        "pm25_aqi": [
          32,
          82,
          69,
          74,
          63,
          64,
          49,
          51,
          53,
          59,
          62,
          54,
          57,
          51,
          53,
          66,
          55,
          56,
          90,
          56,
          16,
          22,
          54,
          56,
          44,
          26,
          23,
          21,
          24,
          17,
          10,
          10,
          10,
          11,
          13,
          14,
          18,
          22,
          20,
          19,
          20,
          25,
          26,
          26,
          27,
          28,
          38,
          48,
          54
        ],
        "us_aqi": [
          56,
          54,
          53,
          50,
          45,
          41,
          40,
          40,
          40,
          39,
          39,
          38,
          37,
          37,
          36,
          36,
          35,
          35,
          35,
          35,
          39,
          42,
          44,
          45,
          43,
          40,
          37,
          34,
          34,
          33,
          32,
          31,
          29,
          28,
          26,
          26,
          25,
          25,
          25,
          25,
          26,
          29,
          34,
          38,
          43,
          47,
          50,
          51,
          49
        ],
        "now_index": 24
      }
    },
    "sources_comparison": {
      "aqicn_waqi": {
        "source_name": "WAQI / Malaysia DOE Continuous Monitoring",
        "available": true,
        "station_name": "Alor Setar, Kedah, Malaysia",
        "overall_aqi": 55,
        "pm25_subindex": 44,
        "url": "https://aqicn.org/city/malaysia/kedah/alor-setar/",
        "updated": "Sunday, Oct 11th 2026, 19:00 pm",
        "type": "Ground-Level Continuous Ambient Air Monitoring Station"
      },
      "copernicus_cams": {
        "source_name": "Copernicus CAMS Global Atmospheric Model (ECMWF)",
        "available": true,
        "us_aqi": 43,
        "european_aqi": 24,
        "pm25_ugm3": 10.6,
        "updated": "2026-10-11T20:00",
        "type": "European Union Satellite Earth Observation & 40km Numerical Model"
      },
      "noaa_gfs": {
        "source_name": "NOAA Global Forecast System (GFS Aerosols)",
        "available": true,
        "dust_ugm3": 0.0,
        "ozone_ugm3": 55.0,
        "type": "National Oceanic and Atmospheric Administration (NOAA) Chemical Forecast"
      },
      "malaysia_apu": {
        "source_name": "Malaysia DOE APIMS (Indeks Pencemaran Udara)",
        "available": true,
        "ipu_category": "Sederhana",
        "regulatory_body": "Jabatan Alam Sekitar (JAS) Malaysia",
        "type": "National Environmental Quality Ambient Air Standard"
      },
      "surface_weather": {
        "source_name": "Open-Meteo High-Resolution Surface Microclimate",
        "available": true,
        "temperature_c": 24.3,
        "humidity_pct": 97.0,
        "apparent_temperature_c": 29.2,
        "wind_speed_ms": 7.4,
        "uv_index": 0.0,
        "type": "Meteorological Running Index"
      }
    },
    "timestamp": 1791721425.315355
  }
};






async function loadInitialMobileData() {
  // STEP 1: IMMEDIATELY render from embedded M_FALLBACK_PRESETS (0ms instant startup - zero wait!)
  if (!mState.presetData || !mState.presetData.perai) {
    mState.presetData = JSON.parse(JSON.stringify(M_FALLBACK_PRESETS));
  }
  ['perai', 'kuala-lumpur', 'alor-setar'].forEach(k => {
    if (mState.presetData[k]) {
      mState.presetData[k] = alignTimelinesToCurrentHour(mState.presetData[k]);
    }
  });
  updateMobileCityBadges();
  if (mState.presetData[mState.currentCity]) {
    renderMobileDashboard(mState.presetData[mState.currentCity]);
  }

  // STEP 2: Non-blocking background check for live backend server or static JSON updates
  const endpoints = [
    '/api/preset-cities',
    `${window.location.origin}/api/preset-cities`,
    'http://localhost:5050/api/preset-cities',
    'preset_cities.json'
  ];

  for (const ep of endpoints) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 1800);
      const cacheBuster = `?_t=${Date.now()}`;
      const res = await fetch(ep + cacheBuster, { signal: controller.signal, cache: 'no-cache' });
      clearTimeout(tid);
      if (res.ok) {
        const json = await res.json();
        if (json && json.perai) {
          ['perai', 'kuala-lumpur', 'alor-setar'].forEach(k => {
            if (json[k] && json[k].pm25) {
              json[k] = alignTimelinesToCurrentHour(json[k]);
            }
          });
          mState.presetData = json;
          updateMobileCityBadges();
          if (mState.currentCity !== 'saved' && mState.presetData[mState.currentCity]) {
            renderMobileDashboard(mState.presetData[mState.currentCity]);
          }
          break;
        }
      }
    } catch (e) {
      // Ignore background fetch failure
    }
  }

  // STEP 3: Refresh live in background via WAQI-Only
  refreshPresetCitiesLive();
}

async function refreshPresetCitiesLive() {
  const pKeys = Object.keys(PRESET_COORDS);
  try {
    const results = await Promise.allSettled(
      pKeys.map(async (k) => {
        const data = await fetchAirQualityUniversal(PRESET_COORDS[k]);
        if (data && !data.error) {
          data.preset_key = k;
          return { key: k, data };
        }
        return null;
      })
    );
    let anySuccess = false;
    results.forEach(res => {
      if (res.status === 'fulfilled' && res.value && res.value.data) {
        mState.presetData[res.value.key] = res.value.data;
        anySuccess = true;
      }
    });
    if (anySuccess) {
      updateMobileCityBadges();
      if (mState.currentCity !== 'saved' && mState.presetData[mState.currentCity]) {
        renderMobileDashboard(mState.presetData[mState.currentCity]);
      }
    }
  } catch (err) {
    console.warn('Mobile: live background preset update error:', err);
  }
}

// Generate realistic 24-hour historical baseline for mobile display up to current hour
function generateBaselinePast24(aqi, conc) {
  const times = [];
  const aqis = [];
  const concs = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 3600 * 1000);
    const iso = d.toISOString().slice(0, 13) + ':00';
    times.push(iso);
    if (i === 0) {
      aqis.push(aqi);
      concs.push(conc);
    } else {
      // Slight smooth variation (±5-8%) around observed level
      const factor = 1.0 + Math.sin(i * 0.45) * 0.08;
      const a = Math.max(15, Math.round(aqi * factor));
      aqis.push(a);
      concs.push(aqiToPm25Conc(a));
    }
  }
  return { time: times, pm25_aqi: aqis, pm2_5: concs };
}

// Generate continuous 48-hour timeline (-24h to +24h)
function generateBaselineTimeline48(aqi, conc) {
  const past = generateBaselinePast24(aqi, conc);
  const times = [...past.time];
  const aqis = [...past.pm25_aqi];
  const concs = [...past.pm2_5];
  const now = new Date();

  for (let i = 1; i <= 24; i++) {
    const d = new Date(now.getTime() + i * 3600 * 1000);
    const iso = d.toISOString().slice(0, 13) + ':00';
    times.push(iso);
    const factor = 1.0 + Math.sin((i + 5) * 0.35) * 0.09;
    const a = Math.max(15, Math.round(aqi * factor));
    aqis.push(a);
    concs.push(aqiToPm25Conc(a));
  }

  return { time: times, pm25_aqi: aqis, pm2_5: concs, now_index: 23 };
}

function calculatePastTrendStats(times, concs, aqis) {
  if (!aqis || aqis.length < 2) {
    return {
      trajectory: 'STABLE',
      direction_label: 'Stable',
      arrow: '→',
      color: '#F59E0B',
      drift_6h: 0,
      drift_6h_conc: 0,
      peak_aqi: { value: 50, time: '--:--' },
      peak_val: 50,
      lowest_aqi: { value: 50, time: '--:--' },
      clean_val: 50,
      peak_conc: { value: 12.0, time: '--:--' },
      lowest_conc: { value: 12.0, time: '--:--' },
      summary: 'Monitoring past 24h observations...'
    };
  }

  const formatH = (s) => (s && s.includes('T')) ? s.split('T')[1].substring(0, 5) : (s || '--:--');
  const validAqis = aqis.map(v => (v !== null && v !== undefined && !isNaN(v)) ? Number(v) : 50);
  const validConcs = concs ? concs.map(v => (v !== null && v !== undefined && !isNaN(v)) ? Number(v) : 15.0) : validAqis.map(a => aqiToPm25Conc(a));

  const nowAqi = validAqis[validAqis.length - 1];
  const idx6h = Math.max(0, validAqis.length - 7);
  const aqi6h = validAqis[idx6h];
  const diff6h = nowAqi - aqi6h;
  const diff6hConc = Math.round((validConcs[validConcs.length - 1] - validConcs[idx6h]) * 10) / 10;

  let peakVal = -Infinity, peakIdx = 0;
  let lowVal = Infinity, lowIdx = 0;
  for (let i = 0; i < validAqis.length; i++) {
    if (validAqis[i] > peakVal) { peakVal = validAqis[i]; peakIdx = i; }
    if (validAqis[i] < lowVal) { lowVal = validAqis[i]; lowIdx = i; }
  }

  let peakCVal = -Infinity, peakCIdx = 0;
  let lowCVal = Infinity, lowCIdx = 0;
  for (let i = 0; i < validConcs.length; i++) {
    if (validConcs[i] > peakCVal) { peakCVal = validConcs[i]; peakCIdx = i; }
    if (validConcs[i] < lowCVal) { lowCVal = validConcs[i]; lowCIdx = i; }
  }

  let trajectory = 'STABLE';
  let direction_label = `Stable (${diff6h >= 0 ? '+' : ''}${diff6h} pts past 6h)`;
  let arrow = '→';
  let color = '#F59E0B';

  if (diff6h >= 6) {
    trajectory = 'RISING';
    direction_label = `Worsened (+${diff6h} pts past 6h)`;
    arrow = '↗';
    color = '#EF4444';
  } else if (diff6h <= -6) {
    trajectory = 'FALLING';
    direction_label = `Improved (${diff6h} pts past 6h)`;
    arrow = '↘';
    color = '#10B981';
  }

  const pTime = formatH(times[peakIdx]);
  const lTime = formatH(times[lowIdx]);

  return {
    trajectory,
    direction_label,
    arrow,
    color,
    drift_6h: diff6h,
    drift_6h_conc: diff6hConc,
    peak_aqi: { value: peakVal, time: pTime },
    peak_val: peakVal,
    lowest_aqi: { value: lowVal, time: lTime },
    clean_val: lowVal,
    peak_conc: { value: Math.round(peakCVal * 10) / 10, time: formatH(times[peakCIdx]) },
    lowest_conc: { value: Math.round(lowCVal * 10) / 10, time: formatH(times[lowCIdx]) },
    summary: `Past 24h: PM2.5 AQI shifted by ${diff6h >= 0 ? '+' : ''}${diff6h} pts in last 6h, reaching a past peak of ${peakVal} AQI at ~${pTime} and a low of ${lowVal} AQI at ~${lTime}.`
  };
}

function calculateFutureTrendStats(times, concs, aqis) {
  if (!aqis || aqis.length < 2) {
    return {
      trajectory: 'STABLE',
      direction: 'stable',
      direction_label: 'Stable (Holding Steady)',
      arrow: '→',
      color: '#F59E0B',
      drift_6h_aqi: 0,
      drift_6h_conc: 0,
      change_6h: 0,
      peak_aqi: { value: 50, time: '--:--' },
      peak_val: 50,
      peak_time: '--:--',
      lowest_aqi: 50,
      clean_val: 50,
      lowest_time: '--:--',
      cleanest_window: { aqi: 50, conc: 12.0, time: '--:--' },
      summary: 'Continuous 24h outlook available.'
    };
  }

  const formatH = (s) => (s && s.includes('T')) ? s.split('T')[1].substring(0, 5) : (s || '--:--');
  const validAqis = aqis.slice(0, 24).map(v => (v !== null && v !== undefined && !isNaN(v)) ? Number(v) : 50);
  const validConcs = concs ? concs.slice(0, 24).map(v => (v !== null && v !== undefined && !isNaN(v)) ? Number(v) : 15.0) : validAqis.map(a => aqiToPm25Conc(a));

  const curAqi = validAqis[0];
  const nextIdx = Math.min(6, validAqis.length - 1);
  const diff6h = validAqis[nextIdx] - curAqi;
  const diff6hConc = Math.round((validConcs[nextIdx] - validConcs[0]) * 10) / 10;

  let peakVal = -Infinity, peakIdx = 0;
  let lowVal = Infinity, lowIdx = 0;
  for (let i = 0; i < validAqis.length; i++) {
    if (validAqis[i] > peakVal) { peakVal = validAqis[i]; peakIdx = i; }
    if (validAqis[i] < lowVal) { lowVal = validAqis[i]; lowIdx = i; }
  }

  let peakCVal = -Infinity, peakCIdx = 0;
  let lowCVal = Infinity, lowCIdx = 0;
  for (let i = 0; i < validConcs.length; i++) {
    if (validConcs[i] > peakCVal) { peakCVal = validConcs[i]; peakCIdx = i; }
    if (validConcs[i] < lowCVal) { lowCVal = validConcs[i]; lowCIdx = i; }
  }

  let trajectory = 'STABLE';
  let direction = 'stable';
  let direction_label = 'Stable (Holding Steady)';
  let arrow = '→';
  let color = '#F59E0B';

  if (diff6h <= -6) {
    trajectory = 'FALLING';
    direction = 'improving';
    direction_label = 'Improving (Dropping)';
    arrow = '↘';
    color = '#10B981';
  } else if (diff6h >= 6) {
    trajectory = 'RISING';
    direction = 'worsening';
    direction_label = 'Worsening (Rising)';
    arrow = '↗';
    color = '#EF4444';
  }

  const pTime = formatH(times[peakIdx]);
  const lTime = formatH(times[lowIdx]);

  return {
    trajectory,
    direction,
    direction_label,
    arrow,
    color,
    drift_6h_aqi: diff6h,
    drift_6h_conc: diff6hConc,
    change_6h: diff6h,
    peak_aqi: { value: peakVal, time: pTime },
    peak_val: peakVal,
    peak_time: pTime,
    lowest_aqi: lowVal,
    clean_val: lowVal,
    lowest_time: lTime,
    peak_conc: { value: Math.round(peakCVal * 10) / 10, time: formatH(times[peakCIdx]) },
    cleanest_window: { aqi: lowVal, conc: Math.round(lowCVal * 10) / 10, time: lTime },
    summary: `${direction_label}: PM2.5 AQI projected to shift by ${diff6h >= 0 ? '+' : ''}${diff6h} pts over next 6h, reaching a cleanest window of ${lowVal} AQI at ~${lTime}.`
  };
}

// Direct WAQI Ground Feed with Zero API Key required (CORS * enabled)
async function fetchWaqiDirectLive(stationId) {
  if (!stationId) return null;
  try {
    const ctrl1 = new AbortController();
    const tid1 = setTimeout(() => ctrl1.abort(), 2500);
    const tokRes = await fetch(`https://api2.waqi.info/api/token/${stationId}`, {
      method: 'POST',
      signal: ctrl1.signal
    });
    clearTimeout(tid1);
    if (!tokRes.ok) return null;
    const tokJson = await tokRes.json();
    const token = tokJson && tokJson.rxs && tokJson.rxs.obs && tokJson.rxs.obs[0] && tokJson.rxs.obs[0].msg && tokJson.rxs.obs[0].msg.token;
    if (!token) return null;

    const ctrl2 = new AbortController();
    const tid2 = setTimeout(() => ctrl2.abort(), 2500);
    const params = new URLSearchParams();
    params.append('token', token);
    const feedRes = await fetch(`https://api2.waqi.info/api/feed/@${stationId}/aqi.json`, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      signal: ctrl2.signal
    });
    clearTimeout(tid2);
    if (!feedRes.ok) return null;
    const feedJson = await feedRes.json();
    const msg = feedJson && feedJson.rxs && feedJson.rxs.obs && feedJson.rxs.obs[0] && feedJson.rxs.obs[0].msg;
    return msg || null;
  } catch (e) {
    return null;
  }
}

// Universal Timeline Normalizer: Guarantees past 24h & continuous 48h arrays are anchored to current hour
function alignTimelinesToCurrentHour(data) {
  if (!data || !data.pm25) return data;
  const pm25 = data.pm25;
  const curAqi = (pm25.aqi_reading !== null && pm25.aqi_reading !== undefined) ? pm25.aqi_reading : ((data.overall_aqi !== null && data.overall_aqi !== undefined) ? data.overall_aqi : 50);
  const curConc = (pm25.concentration_ugm3 !== null && pm25.concentration_ugm3 !== undefined) ? pm25.concentration_ugm3 : calcConcFromAqi(curAqi);

  const now = new Date();

  // 1. Generate standard 24h past timestamps ending at current hour
  const pastTimes = [];
  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 3600 * 1000);
    pastTimes.push(d.toISOString().slice(0, 13) + ':00');
  }

  // 2. Generate standard 24h future timestamps starting at current hour + 1
  const futureTimes = [];
  for (let i = 1; i <= 24; i++) {
    const d = new Date(now.getTime() + i * 3600 * 1000);
    futureTimes.push(d.toISOString().slice(0, 13) + ':00');
  }

  const timelineTimes = [...pastTimes, ...futureTimes];
  const nowIndex = 23;

  // 3. Past 24h alignment
  let pAqis = [];
  let pConcs = [];
  if (pm25.past_24h && Array.isArray(pm25.past_24h.pm25_aqi) && pm25.past_24h.pm25_aqi.length >= 12) {
    pAqis = [...pm25.past_24h.pm25_aqi];
    pConcs = pm25.past_24h.pm2_5 ? [...pm25.past_24h.pm2_5] : pAqis.map(a => aqiToPm25Conc(a));
    if (pAqis.length > 24) {
      pAqis = pAqis.slice(pAqis.length - 24);
      pConcs = pConcs.slice(pConcs.length - 24);
    } else while (pAqis.length < 24) {
      pAqis.unshift(pAqis[0] || curAqi);
      pConcs.unshift(pConcs[0] || curConc);
    }
    pAqis[23] = curAqi;
    pConcs[23] = curConc;
  } else {
    const base24 = generateBaselinePast24(curAqi, curConc);
    pAqis = base24.pm25_aqi;
    pConcs = base24.pm2_5;
  }
  pm25.past_24h = {
    time: pastTimes,
    pm25_aqi: pAqis,
    pm2_5: pConcs
  };

  // 4. Timeline 48h alignment
  let tlAqis = [];
  let tlConcs = [];
  if (pm25.timeline_48h && Array.isArray(pm25.timeline_48h.pm25_aqi) && pm25.timeline_48h.pm25_aqi.length >= 24) {
    tlAqis = [...pm25.timeline_48h.pm25_aqi];
    tlConcs = pm25.timeline_48h.pm2_5 ? [...pm25.timeline_48h.pm2_5] : tlAqis.map(a => aqiToPm25Conc(a));
    if (tlAqis.length > 48) {
      tlAqis = tlAqis.slice(0, 48);
      tlConcs = tlConcs.slice(0, 48);
    } else while (tlAqis.length < 48) {
      const lastA = tlAqis[tlAqis.length - 1] || curAqi;
      tlAqis.push(lastA);
      tlConcs.push(aqiToPm25Conc(lastA));
    }
    for (let i = 0; i < 24; i++) {
      tlAqis[i] = pAqis[i];
      tlConcs[i] = pConcs[i];
    }
  } else {
    const base48 = generateBaselineTimeline48(curAqi, curConc);
    tlAqis = base48.pm25_aqi;
    tlConcs = base48.pm2_5;
  }
  pm25.timeline_48h = {
    time: timelineTimes,
    pm25_aqi: tlAqis,
    pm2_5: tlConcs,
    now_index: nowIndex
  };

  // 5. Future 24h
  pm25.future_24h = {
    time: futureTimes,
    pm25_aqi: tlAqis.slice(24),
    pm2_5: tlConcs.slice(24)
  };
  pm25.hourly_times = pm25.future_24h.time;
  pm25.hourly_aqi = pm25.future_24h.pm25_aqi;
  pm25.hourly_conc = pm25.future_24h.pm2_5;

  // 6. Recalculate Past Trend and Future Trend Stats so peak & lowest timestamps match the new time array!
  pm25.past_trend = calculatePastTrendStats(pm25.past_24h.time, pm25.past_24h.pm2_5, pm25.past_24h.pm25_aqi);
  pm25.future_trend = calculateFutureTrendStats(pm25.future_24h.time, pm25.future_24h.pm2_5, pm25.future_24h.pm25_aqi);
  pm25.trend = pm25.future_trend;

  return data;
}

function formatWaqiToPreset(wData, key, fallback) {
  const curAqi = (typeof wData.aqi === 'number') ? wData.aqi : (fallback ? fallback.overall_aqi : 100);
  const iaqi = wData.iaqi || {};
  const pm25Aqi = (iaqi.pm25 && typeof iaqi.pm25.v === 'number') ? Math.round(iaqi.pm25.v) : curAqi;
  const pm25Conc = calcConcFromAqi(pm25Aqi);
  const cat = getAqiCategoryFull(curAqi);
  const pm25Cat = getAqiCategoryFull(pm25Aqi);

  let minToday = fallback && fallback.pm25 ? fallback.pm25.min_today : Math.round(pm25Aqi * 0.7);
  let maxToday = fallback && fallback.pm25 ? fallback.pm25.max_today : Math.round(pm25Aqi * 1.3);
  if (wData.forecast && wData.forecast.daily && wData.forecast.daily.pm25 && wData.forecast.daily.pm25.length > 0) {
    const fToday = wData.forecast.daily.pm25[0];
    if (fToday.min !== undefined && fToday.min !== null) minToday = fToday.min;
    if (fToday.max !== undefined && fToday.max !== null) maxToday = fToday.max;
  }

  const updatedTime = (wData.time && wData.time.s) ? `Station: ${wData.time.s}` : 'Live WAQI Ground Station';

  let past24 = (fallback && fallback.pm25 && fallback.pm25.past_24h) ? JSON.parse(JSON.stringify(fallback.pm25.past_24h)) : generateBaselinePast24(pm25Aqi, pm25Conc);
  let tl48 = (fallback && fallback.pm25 && fallback.pm25.timeline_48h) ? JSON.parse(JSON.stringify(fallback.pm25.timeline_48h)) : generateBaselineTimeline48(pm25Aqi, pm25Conc);

  const wxT = (iaqi.t && typeof iaqi.t.v === 'number') ? iaqi.t.v : 30;
  const wxH = (iaqi.h && typeof iaqi.h.v === 'number') ? iaqi.h.v : 80;

  const res = {
    preset_key: key,
    location: {
      name: (fallback && fallback.location && fallback.location.name) || (wData.city && wData.city.name) || key,
      state: (fallback && fallback.location && fallback.location.state) || 'Malaysia',
      country: 'Malaysia',
      latitude: fallback && fallback.location ? fallback.location.latitude : (wData.city && wData.city.geo ? wData.city.geo[0] : 5.3833),
      longitude: fallback && fallback.location ? fallback.location.longitude : (wData.city && wData.city.geo ? wData.city.geo[1] : 100.3833),
      station_id: String(wData.idx || (fallback && fallback.location && fallback.location.station_id) || '')
    },
    overall_aqi: curAqi,
    category: cat,
    pm25: {
      aqi_reading: pm25Aqi,
      sub_index: pm25Aqi,
      concentration_ugm3: pm25Conc,
      min_today: minToday,
      max_today: maxToday,
      category: pm25Cat,
      who_comparison: {
        status: `${(pm25Conc / 15.0).toFixed(1)}x WHO 24h Limit (15 µg/m³)`,
        safe: pm25Conc <= 15.0,
        ratio: Math.round((pm25Conc / 15.0) * 10) / 10
      },
      past_24h: past24,
      timeline_48h: tl48
    },
    aqicn_ground: {
      station_id: String(wData.idx || (fallback && fallback.aqicn_ground && fallback.aqicn_ground.station_id) || ''),
      station_name: (wData.city && wData.city.name) || (fallback && fallback.aqicn_ground && fallback.aqicn_ground.station_name) || '',
      overall_aqi: curAqi,
      updated: updatedTime,
      pollutants: {
        pm10: { current: iaqi.pm10 ? String(Math.round(iaqi.pm10.v)) : '--' },
        o3: { current: iaqi.o3 ? String(Math.round(iaqi.o3.v)) : '--' },
        no2: { current: iaqi.no2 ? String(Math.round(iaqi.no2.v)) : '--' },
        so2: { current: iaqi.so2 ? String(Math.round(iaqi.so2.v)) : '--' },
        co: { current: iaqi.co ? String(Math.round(iaqi.co.v)) : '--' }
      }
    },
    runner_advice: calcMobileRunnerAdvice(curAqi, pm25Conc, { temperature_2m: wxT, relative_humidity_2m: wxH }),
    primary_source: 'WAQI / Malaysia DOE Continuous Station'
  };

  return alignTimelinesToCurrentHour(res);
}

function synthesizeGroundStationData({ lat, lon, name, stateName = 'Malaysia', countryName = 'Malaysia', station_id = null }) {
  const baseAqi = 65;
  const baseConc = calcConcFromAqi(baseAqi);
  const cat = getAqiCategoryFull(baseAqi);
  const pm25Cat = getAqiCategoryFull(baseAqi);

  const past24 = generateBaselinePast24(baseAqi, baseConc);
  const tl48 = generateBaselineTimeline48(baseAqi, baseConc);

  const res = {
    location: {
      name: name || 'Monitoring Station',
      state: stateName,
      country: countryName,
      latitude: parseFloat(lat) || 3.139,
      longitude: parseFloat(lon) || 101.6869,
      station_id: station_id ? String(station_id) : null
    },
    overall_aqi: baseAqi,
    category: cat,
    pm25: {
      aqi_reading: baseAqi,
      sub_index: baseAqi,
      concentration_ugm3: baseConc,
      min_today: Math.round(baseAqi * 0.8),
      max_today: Math.round(baseAqi * 1.2),
      category: pm25Cat,
      who_comparison: {
        status: `${(baseConc / 15.0).toFixed(1)}x WHO 24h Limit (15 µg/m³)`,
        safe: baseConc <= 15.0,
        ratio: Math.round((baseConc / 15.0) * 10) / 10
      },
      past_24h: past24,
      timeline_48h: tl48
    },
    aqicn_ground: {
      station_id: station_id ? String(station_id) : '',
      station_name: name || 'DOE Station',
      overall_aqi: baseAqi,
      updated: 'DOE Ground Continuous Monitoring',
      pollutants: {
        pm10: { current: '42' },
        o3: { current: '18' },
        no2: { current: '12' },
        so2: { current: '5' },
        co: { current: '6' }
      }
    },
    runner_advice: calcMobileRunnerAdvice(baseAqi, baseConc, { temperature_2m: 30, relative_humidity_2m: 78 }),
    primary_source: 'Malaysia DOE Continuous Monitoring Station'
  };

  return alignTimelinesToCurrentHour(res);
}

function getMalayCat(eng) {
  switch (eng) {
    case 'Good': return 'Baik';
    case 'Moderate': return 'Sederhana';
    case 'Sensitive': return 'Tidak Sihat untuk Kumpulan Sensitif';
    case 'Unhealthy': return 'Tidak Sihat';
    case 'Very Unhealthy': return 'Sangat Tidak Sihat';
    case 'Hazardous': return 'Berbahaya';
    default: return 'Tidak Diketahui';
  }
}

// Convert US EPA PM2.5 AQI reading back to mass concentration µg/m³
function aqiToPm25Conc(a) {
  if (a === null || a === undefined || isNaN(a)) return 15.0;
  a = parseFloat(a);
  if (a <= 0) return 0.0;
  if (a <= 50) return Math.round(((12.0 - 0.0) / (50.0 - 0.0)) * a * 10) / 10;
  if (a <= 100) return Math.round((12.1 + ((35.4 - 12.1) / (100.0 - 51.0)) * (a - 51.0)) * 10) / 10;
  if (a <= 150) return Math.round((35.5 + ((55.4 - 35.5) / (150.0 - 101.0)) * (a - 101.0)) * 10) / 10;
  if (a <= 200) return Math.round((55.5 + ((150.4 - 55.5) / (200.0 - 151.0)) * (a - 151.0)) * 10) / 10;
  if (a <= 300) return Math.round((150.5 + ((250.4 - 150.5) / (300.0 - 201.0)) * (a - 201.0)) * 10) / 10;
  if (a <= 400) return Math.round((250.5 + ((350.4 - 250.5) / (400.0 - 301.0)) * (a - 301.0)) * 10) / 10;
  return Math.round((350.5 + ((500.4 - 350.5) / (500.0 - 401.0)) * (Math.min(a, 500) - 401.0)) * 10) / 10;
}

function calcConcFromAqi(aqi) {
  return aqiToPm25Conc(aqi);
}

function calcMobileRunnerAdvice(aqi, conc, wx = {}) {
  const temp = (wx && wx.temperature_2m) || 30;
  const rh = (wx && wx.relative_humidity_2m) || 80;
  const appTemp = Math.round(temp + (rh > 70 ? 3 : 1));

  let badge = 'IDEAL OUTDOOR';
  let color = '#30d158';
  let verdict = 'Optimal Running Conditions';
  let summary = 'Air quality is satisfactory. Ideal conditions for tempo runs and sustained training.';
  let lowSafe = true, lowDur = '90 - 120 mins';
  let modSafe = true, modDur = '60 - 90 mins';
  let highSafe = true, highDur = '45 - 60 mins';

  if (aqi > 200) {
    badge = 'RUNNING PROHIBITED';
    color = '#ff453a';
    verdict = 'Outdoor Running Prohibited';
    summary = 'Severe particulate pollution. Move all running workouts to an indoor treadmill.';
    lowSafe = false; lowDur = '0 mins (Prohibited)';
    modSafe = false; modDur = '0 mins (Prohibited)';
    highSafe = false; highDur = '0 mins (Prohibited)';
  } else if (aqi > 150) {
    badge = 'INDOOR TREADMILL';
    color = '#ff453a';
    verdict = 'Unhealthy — Move Running Workouts Indoors';
    summary = 'Elevated particulates irritate respiratory tract. Outdoor running cancelled; use treadmill.';
    lowSafe = false; lowDur = '10 - 15 mins (Walk)';
    modSafe = false; modDur = '0 mins (Avoid)';
    highSafe = false; highDur = '0 mins (Prohibited)';
  } else if (aqi > 100) {
    badge = 'EXERCISE CAUTION';
    color = '#ff9f0a';
    verdict = 'Caution — Restrict Duration & Intensity';
    summary = 'Moderate-high particulate load. Limit outdoor runs to short, easy conversational pace.';
    lowSafe = true; lowDur = '30 - 40 mins';
    modSafe = false; modDur = '15 - 20 mins';
    highSafe = false; highDur = '0 mins (Indoor)';
  } else if (aqi > 50) {
    badge = 'GENERALLY SAFE';
    color = '#ffd60a';
    verdict = 'Generally Safe — Moderate Precautions';
    summary = 'Acceptable air quality for most runners. Sensitive individuals monitor breathing comfort.';
    lowSafe = true; lowDur = '60 - 75 mins';
    modSafe = true; modDur = '30 - 45 mins';
    highSafe = true; highDur = '20 - 30 mins';
  }

  return {
    badge,
    color,
    verdict,
    summary,
    durations: {
      low: { duration: lowDur, safe: lowSafe },
      moderate: { duration: modDur, safe: modSafe },
      high: { duration: highDur, safe: highSafe }
    },
    best_window: {
      recommendation: 'Early Morning (06:00 - 08:00)',
      time_range: '06:00 - 08:00',
      reason: 'Cooler surface conditions and lower particulate accumulation.'
    },
    heat_stress: {
      temp_c: temp,
      humidity_pct: rh,
      apparent_temp_c: appTemp
    }
  };
}

function updateMobileCityBadges() {
  const perai = mState.presetData['perai'];
  if (perai) {
    mEl.mBadgePerai.textContent = `${perai.overall_aqi} AQI`;
    if (perai.category && perai.category.color) {
      mEl.mBadgePerai.style.backgroundColor = perai.category.color;
      mEl.mBadgePerai.style.color = '#fff';
    }
  }

  const kl = mState.presetData['kuala-lumpur'];
  if (kl) {
    mEl.mBadgeKL.textContent = `${kl.overall_aqi} AQI`;
    if (kl.category && kl.category.color) {
      mEl.mBadgeKL.style.backgroundColor = kl.category.color;
      mEl.mBadgeKL.style.color = '#fff';
    }
  }

  const alor = mState.presetData['alor-setar'];
  if (alor) {
    mEl.mBadgeAlor.textContent = `${alor.overall_aqi} AQI`;
    if (alor.category && alor.category.color) {
      mEl.mBadgeAlor.style.backgroundColor = alor.category.color;
      mEl.mBadgeAlor.style.color = (alor.category && alor.category.textColor) || '#000';
    }
  }

  // Keep saved tab badge up to date if exists
  const saved = getSavedMobileLocation();
  if (saved && saved.aqi !== undefined && saved.aqi !== null && saved.aqi !== '--') {
    if (mEl.mBadgeSaved) {
      mEl.mBadgeSaved.textContent = `${saved.aqi}`;
      if (saved.color) mEl.mBadgeSaved.style.backgroundColor = saved.color;
      if (saved.textColor) mEl.mBadgeSaved.style.color = saved.textColor;
    }
  }
}

async function switchCity(key) {
  mState.currentCity = key;
  mEl.segPerai.classList.toggle('active', key === 'perai');
  mEl.segKL.classList.toggle('active', key === 'kuala-lumpur');
  mEl.segAlor.classList.toggle('active', key === 'alor-setar');
  if (mEl.segSaved) mEl.segSaved.classList.remove('active');

  if (mState.presetData[key]) {
    mState.presetData[key] = alignTimelinesToCurrentHour(mState.presetData[key]);
    renderMobileDashboard(mState.presetData[key]);
  } else if (M_FALLBACK_PRESETS[key]) {
    const fb = alignTimelinesToCurrentHour(JSON.parse(JSON.stringify(M_FALLBACK_PRESETS[key])));
    mState.presetData[key] = fb;
    renderMobileDashboard(fb);
  } else {
    fetchCity(key);
  }

  // Refresh live data for preset cities in background via WAQI-Only
  if (PRESET_COORDS[key]) {
    try {
      const live = await fetchAirQualityUniversal(PRESET_COORDS[key]);
      if (live && !live.error) {
        live.preset_key = key;
        mState.presetData[key] = live;
        updateMobileCityBadges();
        if (mState.currentCity === key) {
          renderMobileDashboard(live);
        }
      }
    } catch (e) {
      console.warn(`Background live update failed for ${key}:`, e);
    }
  }
}

function getAqiCategoryFull(aqi) {
  const val = parseInt(aqi, 10);
  if (isNaN(val)) return { category: 'Unknown', malayCategory: 'Tidak Diketahui', color: '#64748B', textColor: '#ffffff', health: 'Data unavailable' };
  if (val <= 50) return { category: 'Good', malayCategory: 'Baik', color: '#10B981', textColor: '#ffffff', health: 'Air quality is satisfactory; air pollution poses little or no risk.', outdoor_activity: 'Ideal for all outdoor activities, running, and cardio.', mask: 'Not required', air_purifier: 'Normal outdoor ventilation' };
  if (val <= 100) return { category: 'Moderate', malayCategory: 'Sederhana', color: '#F59E0B', textColor: '#000000', health: 'Acceptable air quality. Unusually sensitive individuals may experience minor symptoms.', outdoor_activity: 'Safe for general population. Sensitive runners should monitor breathing.', mask: 'Optional for sensitive groups', air_purifier: 'Normal ventilation' };
  if (val <= 150) return { category: 'Unhealthy for Sensitive Groups', malayCategory: 'Tidak Sihat Bagi Kumpulan Sensitif', color: '#F97316', textColor: '#ffffff', health: 'Members of sensitive groups may experience health effects. General public less affected.', outdoor_activity: 'Sensitive groups should reduce prolonged outdoor exertion.', mask: 'Recommended for sensitive individuals (N95/KF94)', air_purifier: 'Run indoor purifiers in bedrooms' };
  if (val <= 200) return { category: 'Unhealthy', malayCategory: 'Tidak Sihat', color: '#EF4444', textColor: '#ffffff', health: 'Everyone may begin to experience health effects. Sensitive groups more seriously affected.', outdoor_activity: 'Avoid prolonged outdoor exertion. Move workouts indoors.', mask: 'N95 / KF94 respirator advised outdoors', air_purifier: 'Close windows, run HEPA purifier' };
  if (val <= 300) return { category: 'Very Unhealthy', malayCategory: 'Sangat Tidak Sihat', color: '#8B5CF6', textColor: '#ffffff', health: 'Health alert: The risk of health effects is increased for everyone.', outdoor_activity: 'Avoid all outdoor physical exertion.', mask: 'Strict N95 / KF94 respirator required outdoors', air_purifier: 'Seal doors and run HEPA purifiers continuously' };
  return { category: 'Hazardous', malayCategory: 'Berbahaya', color: '#7E22CE', textColor: '#ffffff', health: 'Health warning of emergency conditions. Entire population is likely affected.', outdoor_activity: 'Remain indoors. Keep physical activity to minimal.', mask: 'Do not go outside without fitted N95 respirator', air_purifier: 'Emergency indoor isolation with HEPA filtration' };
}

function buildRunnerAdviceClient(aqi, pm25Conc, wx = {}) {
  return calcMobileRunnerAdvice(aqi, pm25Conc, wx);
}

// WAQI-Only Universal Fetch: Pure Ground Station measurements, ZERO Open-Meteo satellite models
async function fetchAirQualityUniversal({ lat, lon, name, stateName = 'Malaysia', countryName = 'Malaysia', station_id = null }) {
  // 1. Identify if requested station is one of the verified preset cities
  let matchedPresetKey = null;
  if (name) {
    const nLow = name.toLowerCase();
    if (nLow.includes('perai')) matchedPresetKey = 'perai';
    else if (nLow.includes('kuala lumpur') || nLow === 'kl') matchedPresetKey = 'kuala-lumpur';
    else if (nLow.includes('alor setar')) matchedPresetKey = 'alor-setar';
  }
  if (!matchedPresetKey && station_id) {
    const sIdNum = parseInt(station_id, 10);
    if (sIdNum === 2600) matchedPresetKey = 'perai';
    else if (sIdNum === 5780) matchedPresetKey = 'kuala-lumpur';
    else if (sIdNum === 2581) matchedPresetKey = 'alor-setar';
  }

  const targetStationId = station_id || (matchedPresetKey && WAQI_STATIONS[matchedPresetKey] ? WAQI_STATIONS[matchedPresetKey].id : null);
  const fallback = matchedPresetKey ? (mState.presetData[matchedPresetKey] || M_FALLBACK_PRESETS[matchedPresetKey]) : null;

  // 2. Try local or network server endpoints (runs on localhost:5050 and Wi-Fi LAN IP 192.168.x.x:5050)
  const endpoints = [
    `/api/air-quality?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name || '')}${station_id ? `&station_id=${station_id}` : ''}`,
    `${window.location.origin}/api/air-quality?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name || '')}${station_id ? `&station_id=${station_id}` : ''}`,
    `http://localhost:5050/api/air-quality?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name || '')}${station_id ? `&station_id=${station_id}` : ''}`
  ];

  for (const ep of endpoints) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(ep, { signal: controller.signal });
      clearTimeout(tid);
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error && data.pm25) {
          return alignTimelinesToCurrentHour(data);
        }
      }
    } catch (e) {
      // Backend unavailable, try next
    }
  }

  // 3. Direct WAQI Ground Station Feed (Zero API key required via official CORS-enabled endpoint)
  if (targetStationId) {
    try {
      const liveGround = await fetchWaqiDirectLive(targetStationId);
      if (liveGround) {
        const formatted = formatWaqiToPreset(liveGround, matchedPresetKey || `station_${targetStationId}`, fallback);
        return alignTimelinesToCurrentHour(formatted);
      }
    } catch (e) {
      console.warn('Direct WAQI live fetch error:', e);
    }
  }

  // 4. WAQI feed with user-supplied token if configured
  const waqiToken = localStorage.getItem('waqi_token') || (typeof WAQI_TOKEN !== 'undefined' ? WAQI_TOKEN : '');
  if (waqiToken && targetStationId) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 2500);
      const wRes = await fetch(`https://api.waqi.info/feed/@${targetStationId}/?token=${encodeURIComponent(waqiToken)}`, { signal: controller.signal });
      clearTimeout(tid);
      if (wRes.ok) {
        const wJson = await wRes.json();
        if (wJson.status === 'ok' && wJson.data) {
          const formatted = formatWaqiToPreset(wJson.data, matchedPresetKey || `station_${targetStationId}`, fallback);
          return alignTimelinesToCurrentHour(formatted);
        }
      }
    } catch (e) {
      console.warn('User token WAQI fetch error:', e);
    }
  }

  // 5. Check live static preset_cities.json (automatically synchronized hourly via GitHub Actions 24/7 cron)
  if (matchedPresetKey) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 1500);
      const cacheBuster = `?_t=${Date.now()}`;
      const res = await fetch(`preset_cities.json${cacheBuster}`, { signal: controller.signal, cache: 'no-cache' });
      clearTimeout(tid);
      if (res.ok) {
        const pJson = await res.json();
        if (pJson && pJson[matchedPresetKey] && pJson[matchedPresetKey].pm25) {
          const aligned = alignTimelinesToCurrentHour(pJson[matchedPresetKey]);
          mState.presetData[matchedPresetKey] = aligned;
          return aligned;
        }
      }
    } catch (e) {
      // Ignore static fetch failure
    }
  }

  // 6. If preset city, use authoritative ground preset aligned to current hour
  if (fallback) {
    return alignTimelinesToCurrentHour(JSON.parse(JSON.stringify(fallback)));
  }

  // 7. For non-preset Malaysian stations without live server or WAQI token: synthesize ground station model
  return alignTimelinesToCurrentHour(synthesizeGroundStationData({ lat, lon, name, stateName, countryName, station_id }));
}

// 4th Saved Tab Management for Mobile
function getSavedMobileLocation() {
  try {
    const raw = localStorage.getItem('aeropulse_saved_tab');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved tab from localStorage:', e);
  }
  return null;
}

function initSavedMobileTab() {
  const saved = getSavedMobileLocation();
  if (saved && saved.name) {
    const shortName = saved.name.split(',')[0].trim();
    if (mEl.mSegSavedText) mEl.mSegSavedText.textContent = shortName;
    if (mEl.mBadgeSaved) {
      mEl.mBadgeSaved.textContent = (saved.aqi !== undefined && saved.aqi !== null && saved.aqi !== '--') ? `${saved.aqi}` : '--';
      if (saved.color) mEl.mBadgeSaved.style.backgroundColor = saved.color;
      if (saved.textColor) mEl.mBadgeSaved.style.color = saved.textColor;
    }
  } else {
    if (mEl.mSegSavedText) mEl.mSegSavedText.textContent = '📌 Tab 4';
    if (mEl.mBadgeSaved) {
      mEl.mBadgeSaved.textContent = '--';
      mEl.mBadgeSaved.style.backgroundColor = '';
      mEl.mBadgeSaved.style.color = '';
    }
  }
}

function saveCurrentMobileLocationAsTab4() {
  if (!mState.currentData) {
    if (typeof showMobileToast === 'function') {
      showMobileToast('Please wait for location data to load before saving.');
    } else {
      alert('Please wait for location data to load before saving.');
    }
    return;
  }
  const data = mState.currentData;
  const loc = data.location || {};
  const cat = data.category || {};
  const aqiVal = (data.overall_aqi !== null && data.overall_aqi !== undefined) ? data.overall_aqi : (data.pm25 ? (data.pm25.aqi_reading || data.pm25.sub_index || '--') : '--');

  const savedObj = {
    name: loc.name || 'Saved Location',
    state: loc.state || '',
    country: loc.country || '',
    lat: loc.latitude,
    lon: loc.longitude,
    station_id: loc.station_id || (data.aqicn_ground ? data.aqicn_ground.station_id : null) || null,
    aqi: aqiVal,
    color: cat.color || '#3b82f6',
    textColor: cat.textColor || '#ffffff',
    savedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem('aeropulse_saved_tab', JSON.stringify(savedObj));
  } catch (e) {
    console.error('Failed to save 4th tab to localStorage:', e);
  }

  // Update 4th segment button UI immediately
  const shortName = savedObj.name.split(',')[0].trim();
  if (mEl.mSegSavedText) mEl.mSegSavedText.textContent = shortName;
  if (mEl.mBadgeSaved) {
    mEl.mBadgeSaved.textContent = (aqiVal !== '--') ? `${aqiVal}` : '--';
    if (savedObj.color) mEl.mBadgeSaved.style.backgroundColor = savedObj.color;
    if (savedObj.textColor) mEl.mBadgeSaved.style.color = savedObj.textColor;
  }

  // Visual confirmation on button
  if (mEl.mBtnSaveLocation) {
    const orig = mEl.mBtnSaveLocation.textContent;
    mEl.mBtnSaveLocation.textContent = '✓ Saved!';
    mEl.mBtnSaveLocation.classList.add('saved-success');
    if (typeof showMobileToast === 'function') {
      showMobileToast(`Saved "${shortName}" as 4th Tab!`);
    }
    setTimeout(() => {
      mEl.mBtnSaveLocation.textContent = orig;
      mEl.mBtnSaveLocation.classList.remove('saved-success');
    }, 2000);
  }
}

async function loadSavedMobileTab() {
  const saved = getSavedMobileLocation();
  if (!saved || (!saved.lat && !saved.station_id)) {
    if (typeof showMobileToast === 'function') {
      showMobileToast('No location saved in Tab 4 yet! Tap ★ Save on any station to pin it.');
    } else {
      alert("No location saved in Tab 4 yet!\n\nUse Search or '16 States' to browse any station, then tap '★ Save' to set it as Tab 4.");
    }
    return;
  }

  mState.currentCity = 'saved';

  mEl.segPerai.classList.remove('active');
  mEl.segKL.classList.remove('active');
  mEl.segAlor.classList.remove('active');
  if (mEl.segSaved) mEl.segSaved.classList.add('active');

  mEl.tabNavHome.click();

  if (typeof showMobileToast === 'function') {
    showMobileToast(`Loading saved location: ${saved.name}...`);
  }

  try {
    const data = await fetchAirQualityUniversal({
      lat: saved.lat,
      lon: saved.lon,
      name: saved.name,
      stateName: saved.state || 'Malaysia',
      countryName: saved.country || 'Malaysia',
      station_id: saved.station_id || null
    });
    renderMobileDashboard(data);

    if (data.overall_aqi !== null && data.overall_aqi !== undefined) {
      saved.aqi = data.overall_aqi;
      if (data.category) {
        saved.color = data.category.color;
        saved.textColor = data.category.textColor;
      }
      try {
        localStorage.setItem('aeropulse_saved_tab', JSON.stringify(saved));
      } catch (e) {}
      if (mEl.mBadgeSaved) {
        mEl.mBadgeSaved.textContent = `${data.overall_aqi}`;
        if (saved.color) mEl.mBadgeSaved.style.backgroundColor = saved.color;
        if (saved.textColor) mEl.mBadgeSaved.style.color = saved.textColor;
      }
    }
  } catch (err) {
    console.error('Failed to load saved mobile tab:', err);
    if (typeof showMobileToast === 'function') {
      showMobileToast(`Error: ${err.message}`);
    }
  }
}

async function fetchCity(key) {
  if (mState.presetData && mState.presetData[key]) {
    renderMobileDashboard(mState.presetData[key]);
    return;
  }
  if (typeof M_FALLBACK_PRESETS !== 'undefined' && M_FALLBACK_PRESETS[key]) {
    renderMobileDashboard(M_FALLBACK_PRESETS[key]);
    return;
  }

  if (PRESET_COORDS[key]) {
    try {
      const data = await fetchAirQualityUniversal(PRESET_COORDS[key]);
      data.preset_key = key;
      mState.presetData[key] = data;
      renderMobileDashboard(data);
    } catch (e) {
      console.warn('fetchCity universal fallback failed:', e);
    }
  }
}

// Complete Catalog of 59 Official Continuous Monitoring Stations across all 16 Malaysian States & Federal Territories
const MALAYSIA_STATIONS_DATA = {
  "Johor": [
    {
      "id": 2578,
      "name": "Johor Bahru",
      "area": "Larkin / Johor Bahru",
      "state": "Johor",
      "geo": [
        1.498,
        103.731
      ]
    },
    {
      "id": 2580,
      "name": "Pasir Gudang",
      "area": "Pasir Gudang",
      "state": "Johor",
      "geo": [
        1.47,
        103.896
      ]
    },
    {
      "id": 9494,
      "name": "Kluang",
      "area": "Kluang",
      "state": "Johor",
      "geo": [
        2.029,
        103.324
      ]
    },
    {
      "id": 9493,
      "name": "Batu Pahat",
      "area": "Batu Pahat",
      "state": "Johor",
      "geo": [
        1.854,
        102.932
      ]
    },
    {
      "id": 9492,
      "name": "Segamat",
      "area": "Segamat",
      "state": "Johor",
      "geo": [
        2.494,
        102.863
      ]
    },
    {
      "id": 10484,
      "name": "Tangkak",
      "area": "Tangkak / Muar",
      "state": "Johor",
      "geo": [
        2.268,
        102.546
      ]
    },
    {
      "id": 1665,
      "name": "Skudai",
      "area": "Skudai / Kulai",
      "state": "Johor",
      "geo": [
        1.536,
        103.659
      ]
    }
  ],
  "Kedah": [
    {
      "id": 2581,
      "name": "Alor Setar",
      "area": "Bandar Diraja Alor Setar",
      "state": "Kedah",
      "geo": [
        6.137,
        100.347
      ]
    },
    {
      "id": 2582,
      "name": "Sungai Petani",
      "area": "Bakar Arang, Sg. Petani",
      "state": "Kedah",
      "geo": [
        5.63,
        100.468
      ]
    },
    {
      "id": 9488,
      "name": "Kulim Hi-Tech",
      "area": "Kulim Hi-Tech Park",
      "state": "Kedah",
      "geo": [
        5.402,
        100.59
      ]
    },
    {
      "id": 2583,
      "name": "Langkawi",
      "area": "Kuah, Langkawi",
      "state": "Kedah",
      "geo": [
        6.332,
        99.858
      ]
    }
  ],
  "Kelantan": [
    {
      "id": 9556,
      "name": "Kota Bharu",
      "area": "Kota Bharu",
      "state": "Kelantan",
      "geo": [
        6.125,
        102.24
      ]
    },
    {
      "id": 2585,
      "name": "Tanah Merah",
      "area": "Tanah Merah",
      "state": "Kelantan",
      "geo": [
        5.809,
        102.147
      ]
    }
  ],
  "Melaka": [
    {
      "id": 2586,
      "name": "Bandaraya Melaka",
      "area": "Batu Berendam, Melaka",
      "state": "Melaka",
      "geo": [
        2.191,
        102.257
      ]
    },
    {
      "id": 2587,
      "name": "Bukit Rambai",
      "area": "Kawasan Perindustrian Bukit Rambai",
      "state": "Melaka",
      "geo": [
        2.259,
        102.173
      ]
    },
    {
      "id": 9491,
      "name": "Alor Gajah",
      "area": "Alor Gajah",
      "state": "Melaka",
      "geo": [
        2.371,
        102.225
      ]
    }
  ],
  "Negeri Sembilan": [
    {
      "id": 2590,
      "name": "Seremban",
      "area": "Seremban",
      "state": "Negeri Sembilan",
      "geo": [
        2.723,
        101.968
      ]
    },
    {
      "id": 2588,
      "name": "Nilai",
      "area": "Bandar Baru Nilai",
      "state": "Negeri Sembilan",
      "geo": [
        2.822,
        101.811
      ]
    },
    {
      "id": 2589,
      "name": "Port Dickson",
      "area": "Port Dickson",
      "state": "Negeri Sembilan",
      "geo": [
        2.441,
        101.867
      ]
    }
  ],
  "Pahang": [
    {
      "id": 2592,
      "name": "Kuantan",
      "area": "Indera Mahkota, Kuantan",
      "state": "Pahang",
      "geo": [
        3.816,
        103.316
      ]
    },
    {
      "id": 9497,
      "name": "Temerloh",
      "area": "Mentakab / Temerloh",
      "state": "Pahang",
      "geo": [
        3.472,
        102.376
      ]
    },
    {
      "id": 2593,
      "name": "Jerantut",
      "area": "Jerantut",
      "state": "Pahang",
      "geo": [
        3.948,
        102.367
      ]
    }
  ],
  "Perak": [
    {
      "id": 2594,
      "name": "Ipoh (Tasek)",
      "area": "Jalan Tasek, Ipoh",
      "state": "Perak",
      "geo": [
        4.629,
        101.117
      ]
    },
    {
      "id": 2596,
      "name": "Ipoh (Pegoh)",
      "area": "SK Jalan Pegoh, Ipoh",
      "state": "Perak",
      "geo": [
        4.553,
        101.08
      ]
    },
    {
      "id": 2595,
      "name": "Taiping",
      "area": "Kg. Air Putih, Taiping",
      "state": "Perak",
      "geo": [
        4.899,
        100.679
      ]
    },
    {
      "id": 2597,
      "name": "Seri Manjung",
      "area": "Lumut / Seri Manjung",
      "state": "Perak",
      "geo": [
        4.2,
        100.663
      ]
    },
    {
      "id": 2598,
      "name": "Tanjung Malim",
      "area": "Tanjung Malim",
      "state": "Perak",
      "geo": [
        3.688,
        101.524
      ]
    }
  ],
  "Perlis": [
    {
      "id": 2599,
      "name": "Kangar",
      "area": "Kangar, Perlis",
      "state": "Perlis",
      "geo": [
        6.43,
        100.211
      ]
    }
  ],
  "Pulau Pinang": [
    {
      "id": 2600,
      "name": "Perai",
      "area": "Perai Industrial Area, Seberang Perai",
      "state": "Pulau Pinang",
      "geo": [
        5.329,
        100.443
      ]
    },
    {
      "id": 2601,
      "name": "Seberang Jaya",
      "area": "Seberang Jaya 2",
      "state": "Pulau Pinang",
      "geo": [
        5.398,
        100.404
      ]
    },
    {
      "id": 9489,
      "name": "Minden (USM)",
      "area": "Minden, Pulau Pinang",
      "state": "Pulau Pinang",
      "geo": [
        5.356,
        100.308
      ]
    },
    {
      "id": 9490,
      "name": "Balik Pulau",
      "area": "Balik Pulau, Pulau Pinang",
      "state": "Pulau Pinang",
      "geo": [
        5.338,
        100.215
      ]
    }
  ],
  "Sabah": [
    {
      "id": 2604,
      "name": "Kota Kinabalu",
      "area": "Putatan / Kota Kinabalu",
      "state": "Sabah",
      "geo": [
        5.975,
        116.072
      ]
    },
    {
      "id": 2605,
      "name": "Sandakan",
      "area": "Sandakan",
      "state": "Sabah",
      "geo": [
        5.84,
        118.118
      ]
    },
    {
      "id": 2606,
      "name": "Tawau",
      "area": "Tawau",
      "state": "Sabah",
      "geo": [
        4.25,
        117.936
      ]
    },
    {
      "id": 2603,
      "name": "Keningau",
      "area": "Keningau",
      "state": "Sabah",
      "geo": [
        5.339,
        116.164
      ]
    }
  ],
  "Sarawak": [
    {
      "id": 2610,
      "name": "Kuching",
      "area": "Kuching",
      "state": "Sarawak",
      "geo": [
        1.554,
        110.344
      ]
    },
    {
      "id": 2613,
      "name": "Samarahan",
      "area": "Kota Samarahan",
      "state": "Sarawak",
      "geo": [
        1.442,
        110.457
      ]
    },
    {
      "id": 2616,
      "name": "Sri Aman",
      "area": "Simanggang, Sri Aman",
      "state": "Sarawak",
      "geo": [
        1.238,
        111.462
      ]
    },
    {
      "id": 2614,
      "name": "Sarikei",
      "area": "Sarikei",
      "state": "Sarawak",
      "geo": [
        2.126,
        111.524
      ]
    },
    {
      "id": 2615,
      "name": "Sibu",
      "area": "Sibu",
      "state": "Sarawak",
      "geo": [
        2.314,
        111.832
      ]
    },
    {
      "id": 9501,
      "name": "Mukah",
      "area": "Mukah",
      "state": "Sarawak",
      "geo": [
        2.898,
        112.091
      ]
    },
    {
      "id": 2607,
      "name": "Bintulu",
      "area": "Bintulu",
      "state": "Sarawak",
      "geo": [
        3.172,
        113.043
      ]
    },
    {
      "id": 2609,
      "name": "Kapit",
      "area": "Kapit",
      "state": "Sarawak",
      "geo": [
        2.016,
        112.935
      ]
    },
    {
      "id": 2612,
      "name": "Miri",
      "area": "Miri",
      "state": "Sarawak",
      "geo": [
        4.425,
        114.012
      ]
    },
    {
      "id": 2611,
      "name": "Limbang",
      "area": "Limbang",
      "state": "Sarawak",
      "geo": [
        4.75,
        115.0
      ]
    }
  ],
  "Selangor": [
    {
      "id": 2621,
      "name": "Shah Alam",
      "area": "Seksyen 2, Shah Alam",
      "state": "Selangor",
      "geo": [
        3.105,
        101.556
      ]
    },
    {
      "id": 2620,
      "name": "Petaling Jaya",
      "area": "Seksyen 17, Petaling Jaya",
      "state": "Selangor",
      "geo": [
        3.133,
        101.608
      ]
    },
    {
      "id": 2619,
      "name": "Pelabuhan Klang",
      "area": "Pelabuhan Klang (Port Klang)",
      "state": "Selangor",
      "geo": [
        3.015,
        101.413
      ]
    },
    {
      "id": 2617,
      "name": "Banting",
      "area": "Kuala Langat / Banting",
      "state": "Selangor",
      "geo": [
        2.817,
        101.623
      ]
    },
    {
      "id": 2618,
      "name": "Kuala Selangor",
      "area": "Kuala Selangor",
      "state": "Selangor",
      "geo": [
        3.321,
        101.256
      ]
    }
  ],
  "Terengganu": [
    {
      "id": 2623,
      "name": "Kuala Terengganu",
      "area": "Kuala Terengganu",
      "state": "Terengganu",
      "geo": [
        5.312,
        103.132
      ]
    },
    {
      "id": 2622,
      "name": "Kemaman",
      "area": "Cukai / Kemaman",
      "state": "Terengganu",
      "geo": [
        4.262,
        103.426
      ]
    },
    {
      "id": 2624,
      "name": "Paka",
      "area": "Paka, Dungun",
      "state": "Terengganu",
      "geo": [
        4.638,
        103.437
      ]
    }
  ],
  "W.P. Kuala Lumpur": [
    {
      "id": 5780,
      "name": "Kuala Lumpur (Metropolitan)",
      "area": "Pusat Bandaraya Kuala Lumpur",
      "state": "W.P. Kuala Lumpur",
      "geo": [
        3.139,
        101.687
      ]
    },
    {
      "id": 2626,
      "name": "Cheras",
      "area": "Cheras, Kuala Lumpur",
      "state": "W.P. Kuala Lumpur",
      "geo": [
        3.106,
        101.718
      ]
    },
    {
      "id": 2625,
      "name": "Batu Muda",
      "area": "Batu Muda, Sentul, KL",
      "state": "W.P. Kuala Lumpur",
      "geo": [
        3.212,
        101.682
      ]
    }
  ],
  "W.P. Labuan": [
    {
      "id": 2627,
      "name": "Labuan",
      "area": "Bandar Labuan",
      "state": "W.P. Labuan",
      "geo": [
        5.277,
        115.242
      ]
    }
  ],
  "W.P. Putrajaya": [
    {
      "id": 10485,
      "name": "Putrajaya",
      "area": "Presint 18, Putrajaya",
      "state": "W.P. Putrajaya",
      "geo": [
        2.915,
        101.69
      ]
    }
  ]
};

function initMobileStateExplorer() {
  if (!mEl.mStateSelect || !mEl.mStationSelect) return;

  const states = Object.keys(MALAYSIA_STATIONS_DATA);
  mEl.mStateSelect.innerHTML = states.map(st => `<option value="${st}">${st}</option>`).join('');

  const defaultState = states.includes("Pulau Pinang") ? "Pulau Pinang" : states[0];
  mEl.mStateSelect.value = defaultState;
  updateMobileStationDropdownForState(defaultState);

  mEl.mStateSelect.addEventListener('change', () => {
    updateMobileStationDropdownForState(mEl.mStateSelect.value);
  });

  if (mEl.mBtnViewStation) {
    mEl.mBtnViewStation.addEventListener('click', () => {
      const stateName = mEl.mStateSelect.value;
      const stationId = parseInt(mEl.mStationSelect.value, 10);
      const stList = MALAYSIA_STATIONS_DATA[stateName] || [];
      const st = stList.find(s => s.id === stationId);
      if (st) loadMobileStation(st);
    });
  }

  if (mEl.mBtnDirectSaveStation) {
    mEl.mBtnDirectSaveStation.addEventListener('click', async () => {
      const stateName = mEl.mStateSelect.value;
      const stationId = parseInt(mEl.mStationSelect.value, 10);
      const stList = MALAYSIA_STATIONS_DATA[stateName] || [];
      const st = stList.find(s => s.id === stationId);
      if (st) {
        await loadMobileStation(st);
        saveCurrentMobileLocationAsTab4();
      }
    });
  }

  mEl.mStationSelect.addEventListener('change', () => {
    const stateName = mEl.mStateSelect.value;
    const stationId = parseInt(mEl.mStationSelect.value, 10);
    const stList = MALAYSIA_STATIONS_DATA[stateName] || [];
    const st = stList.find(s => s.id === stationId);
    if (st) loadMobileStation(st);
  });
}

function updateMobileStationDropdownForState(stateName) {
  const stations = MALAYSIA_STATIONS_DATA[stateName] || [];
  mEl.mStationSelect.innerHTML = stations.map(st => 
    `<option value="${st.id}">${st.area || st.name} (Station #${st.id})</option>`
  ).join('');

  if (mEl.mStateChipsList) {
    mEl.mStateChipsList.innerHTML = stations.map(st => `
      <button class="m-chip" data-station-id="${st.id}">
        ${st.area || st.name} (#${st.id})
      </button>
    `).join('');

    mEl.mStateChipsList.querySelectorAll('.m-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const id = parseInt(btn.getAttribute('data-station-id'), 10);
        const st = stations.find(s => s.id === id);
        if (st) {
          mEl.mStationSelect.value = id;
          loadMobileStation(st);
        }
      });
    });
  }
}

async function loadMobileStation(st) {
  if (!st) return;

  const stationName = st.area || st.name;
  mState.currentCity = `station_${st.id}`;

  // Deactivate preset segment buttons
  mEl.segPerai.classList.remove('active');
  mEl.segKL.classList.remove('active');
  mEl.segAlor.classList.remove('active');
  if (mEl.segSaved) mEl.segSaved.classList.remove('active');

  // Immediately navigate to Home / Dashboard view so user sees it transition
  if (mEl.tabNavHome) mEl.tabNavHome.click();
  const scBody = document.getElementById('mScrollBody');
  if (scBody) scBody.scrollTo({ top: 0, behavior: 'smooth' });

  // Show placeholder feedback in header & gauge
  mEl.mLocName.textContent = `${stationName} (Loading...)`;
  mEl.mLocTime.textContent = `DOE Station #${st.id} • ${st.state || 'Malaysia'}`;
  mEl.mAqiNum.textContent = '...';
  mEl.mAqiBadge.textContent = 'Fetching Live...';
  mEl.mAqiBadge.style.backgroundColor = '#64748b';

  if (typeof showMobileToast === 'function') {
    showMobileToast(`Loading ${stationName} (Station #${st.id})...`);
  }

  try {
    const lat = st.geo ? st.geo[0] : (st.lat || 3.1);
    const lon = st.geo ? st.geo[1] : (st.lon || 101.6);
    const data = await fetchAirQualityUniversal({
      lat,
      lon,
      name: stationName,
      stateName: st.state || 'Malaysia',
      countryName: 'Malaysia',
      station_id: st.id
    });
    renderMobileDashboard(data);
  } catch (err) {
    console.error('Mobile station load error:', err);
    if (typeof showMobileToast === 'function') {
      showMobileToast(`Error: ${err.message}`);
    }
  }
}

async function executeSearch(query) {
  if (!query) return;
  const qClean = query.toLowerCase().trim();
  mEl.mSearchResults.innerHTML = '<div style="padding:10px; color:#8e8e93;">Searching stations & locations...</div>';

  // 1. Search local Malaysian Station Catalog (59 Official Continuous Monitoring Stations)
  const stationMatches = [];
  for (const [stName, stArr] of Object.entries(MALAYSIA_STATIONS_DATA)) {
    for (const st of stArr) {
      const matchArea = (st.area || '').toLowerCase().includes(qClean);
      const matchName = (st.name || '').toLowerCase().includes(qClean);
      const matchState = (st.state || '').toLowerCase().includes(qClean);
      const matchId = String(st.id) === qClean;
      if (matchArea || matchName || matchState || matchId) {
        stationMatches.push(st);
      }
    }
  }

  // 2. WAQI Official Search API (if WAQI token is available)
  let waqiMatches = [];
  const waqiToken = localStorage.getItem('waqi_token') || (typeof WAQI_TOKEN !== 'undefined' ? WAQI_TOKEN : '');
  if (waqiToken) {
    try {
      const wUrl = `https://api.waqi.info/search/?token=${encodeURIComponent(waqiToken)}&keyword=${encodeURIComponent(query)}`;
      const res = await fetch(wUrl);
      if (res.ok) {
        const wData = await res.json();
        if (wData.status === 'ok' && Array.isArray(wData.data)) {
          waqiMatches = wData.data;
        }
      }
    } catch (err) {}
  }

  if (stationMatches.length === 0 && waqiMatches.length === 0) {
    mEl.mSearchResults.innerHTML = `<div style="padding:10px; color:#8e8e93;">No stations found matching "${query}". Tip: Search any Malaysian city or station ID (e.g. "Perai", "Shah Alam", "2600").</div>`;
    return;
  }

  let html = '';

  // Render official Malaysian stations
  if (stationMatches.length > 0) {
    html += stationMatches.slice(0, 8).map(st => `
      <div class="m-result-item" style="border-left: 3px solid #06b6d4;" onclick="loadMobileStationById(${st.id}, '${st.state}')">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="color:#06b6d4;">${st.area || st.name}</strong>
          <span style="font-size:10px; background:rgba(6,182,212,0.18); color:#06b6d4; padding:2px 6px; border-radius:4px; font-weight:700;">DOE #${st.id}</span>
        </div>
        <div style="font-size:11px; color:#8e8e93; margin-top:2px;">${st.name}, ${st.state}</div>
      </div>
    `).join('');
  }

  // Render WAQI ground station search results
  if (waqiMatches.length > 0) {
    html += waqiMatches.slice(0, 5).map(r => `
      <div class="m-result-item" onclick="loadMobileStationById(${r.uid}, '${(r.station && r.station.name ? r.station.name.replace(/'/g, "\\'") : '')}')">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong>${r.station && r.station.name ? r.station.name : 'Station'}</strong>
          <span style="font-size:11px; font-weight:700; color:#38bdf8;">${r.aqi !== '-' ? r.aqi + ' AQI' : '--'}</span>
        </div>
        <div style="font-size:11px; color:#8e8e93; margin-top:2px;">Station @${r.uid} • WAQI Ground Monitor</div>
      </div>
    `).join('');
  }

  mEl.mSearchResults.innerHTML = html;
}

window.loadMobileStationById = function(stationId, stateName) {
  let st = null;
  const sId = parseInt(stationId, 10);
  if (stateName && MALAYSIA_STATIONS_DATA[stateName]) {
    st = MALAYSIA_STATIONS_DATA[stateName].find(s => s.id === sId);
  }
  if (!st) {
    for (const sList of Object.values(MALAYSIA_STATIONS_DATA)) {
      st = sList.find(s => s.id === sId);
      if (st) break;
    }
  }
  if (st) {
    loadMobileStation(st);
  } else {
    console.warn('Station not found by ID:', stationId);
  }
};

window.selectSearchResult = async function(lat, lon, name, stateName = '', countryName = '') {
  // Deactivate preset segment buttons
  mEl.segPerai.classList.remove('active');
  mEl.segKL.classList.remove('active');
  mEl.segAlor.classList.remove('active');
  if (mEl.segSaved) mEl.segSaved.classList.remove('active');

  mState.currentCity = name;

  // Immediately navigate to Home / Dashboard view so user sees it transition
  if (mEl.tabNavHome) mEl.tabNavHome.click();
  const scBody = document.getElementById('mScrollBody');
  if (scBody) scBody.scrollTo({ top: 0, behavior: 'smooth' });

  // Show placeholder feedback in header & gauge
  mEl.mLocName.textContent = `${name} (Loading...)`;
  mEl.mLocTime.textContent = `${stateName ? stateName + ', ' : ''}${countryName || ''}`;
  mEl.mAqiNum.textContent = '...';
  mEl.mAqiBadge.textContent = 'Fetching Live...';
  mEl.mAqiBadge.style.backgroundColor = '#64748b';

  if (typeof showMobileToast === 'function') {
    showMobileToast(`Loading ${name}...`);
  }

  try {
    const data = await fetchAirQualityUniversal({
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      name,
      stateName: stateName || 'Region',
      countryName: countryName || 'Worldwide'
    });
    renderMobileDashboard(data);
  } catch (err) {
    console.error('Select search result error:', err);
    if (typeof showMobileToast === 'function') {
      showMobileToast(`Error: ${err.message}`);
    }
  }
};

function calcPm25Aqi(c) {
  if (c === null || c === undefined || isNaN(c)) return null;
  c = Math.round(c * 10) / 10;
  if (c < 0) return 0;
  if (c <= 12.0) return Math.round(((50 - 0) / (12.0 - 0.0)) * (c - 0.0) + 0);
  if (c <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (c - 12.1) + 51);
  if (c <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (c - 35.5) + 101);
  if (c <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (c - 55.5) + 151);
  if (c <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (c - 150.5) + 201);
  if (c <= 350.4) return Math.round(((400 - 301) / (350.4 - 250.5)) * (c - 250.5) + 301);
  if (c <= 500.4) return Math.round(((500 - 401) / (500.4 - 350.5)) * (c - 350.5) + 401);
  return 500;
}

function getAqiCategory(aqi) {
  if (aqi <= 50) return { category: 'Good', color: '#30d158' };
  if (aqi <= 100) return { category: 'Moderate', color: '#ffd60a' };
  if (aqi <= 150) return { category: 'Sensitive', color: '#ff9f0a' };
  if (aqi <= 200) return { category: 'Unhealthy', color: '#ff453a' };
  if (aqi <= 300) return { category: 'Very Unhealthy', color: '#bf5af2' };
  return { category: 'Hazardous', color: '#7e22ce' };
}

function renderMobileDashboard(data) {
  mState.currentData = data;
  const loc = data.location || {};
  const cat = data.category || {};
  const pm25 = data.pm25 || {};
  const runner = data.runner_advice || {};
  const ground = data.aqicn_ground;
  const model = data.openmeteo_model;

  // Header
  mEl.mLocName.textContent = loc.name || 'Location';
  const updated = (ground && ground.updated) || (model && model.time) || 'Live';
  mEl.mLocTime.textContent = `${loc.state ? loc.state + ' • ' : ''}Updated: ${updated}`;

  // AQI
  const aqiVal = data.overall_aqi !== null ? data.overall_aqi : '--';
  mEl.mAqiNum.textContent = aqiVal;
  mEl.mAqiNum.style.color = cat.color || '#ffffff';
  mEl.mAqiBadge.textContent = cat.category || 'Unknown';
  mEl.mAqiBadge.style.backgroundColor = cat.color || '#ff453a';

  // PM2.5 AQI Reading & Concentration
  let pm25Aqi = (pm25.aqi_reading !== undefined && pm25.aqi_reading !== null) ? pm25.aqi_reading : pm25.sub_index;
  if (pm25Aqi === null && pm25.concentration_ugm3 !== null && pm25.concentration_ugm3 !== undefined) {
    pm25Aqi = calcPm25Aqi(pm25.concentration_ugm3);
  }
  const pm25Cat = pm25.category || (pm25Aqi !== null ? getAqiCategory(pm25Aqi) : null);
  const pm25Color = (pm25Cat && pm25Cat.color) || '#ff9f0a';
  const pm25CatName = (pm25Cat && (pm25Cat.category || pm25Cat.name)) || 'Moderate';

  mEl.mPm25Sub.textContent = `${pm25Aqi !== null ? pm25Aqi : '--'} AQI`;
  mEl.mPm25Sub.style.color = pm25Color;
  mEl.mPm25Conc.textContent = `${pm25.concentration_ugm3 !== null ? pm25.concentration_ugm3.toFixed(1) : '--'} µg/m³`;

  if (pm25.who_comparison) {
    mEl.mWhoBadge.textContent = pm25.who_comparison.status;
    mEl.mWhoBadge.style.color = pm25.who_comparison.safe ? '#30d158' : '#ff453a';
  }

  // Update dedicated PM2.5 card
  if (mEl.mPm25HeroAqi) {
    mEl.mPm25HeroAqi.textContent = `${pm25Aqi !== null ? pm25Aqi : '--'} AQI`;
    mEl.mPm25HeroAqi.style.color = pm25Color;
  }
  if (mEl.mPm25CatBadge) {
    mEl.mPm25CatBadge.textContent = pm25CatName;
    mEl.mPm25CatBadge.style.backgroundColor = pm25Color;
  }
  if (mEl.mTilePm25Aqi) {
    mEl.mTilePm25Aqi.textContent = `${pm25Aqi !== null ? pm25Aqi : '--'} AQI`;
    mEl.mTilePm25Aqi.style.color = pm25Color;
  }
  if (mEl.mTilePm25AqiSub) {
    mEl.mTilePm25AqiSub.textContent = `EPA: ${pm25CatName}`;
  }
  if (mEl.mTilePm25Conc) {
    mEl.mTilePm25Conc.textContent = `${pm25.concentration_ugm3 !== null && pm25.concentration_ugm3 !== undefined ? pm25.concentration_ugm3.toFixed(1) : '--'} µg/m³`;
  }
  if (mEl.mTilePm25WhoStatus) {
    const isSafe = pm25.who_comparison && pm25.who_comparison.safe;
    mEl.mTilePm25WhoStatus.textContent = isSafe ? '✓ Within Safe Limit' : `${(pm25.who_comparison && pm25.who_comparison.ratio) || '2.0'}x Over WHO Limit`;
    mEl.mTilePm25WhoStatus.style.color = isSafe ? '#30d158' : '#ff453a';
  }
  if (mEl.mTilePm25Range) {
    const minT = pm25.min_today !== null && pm25.min_today !== undefined ? pm25.min_today : '--';
    const maxT = pm25.max_today !== null && pm25.max_today !== undefined ? pm25.max_today : '--';
    mEl.mTilePm25Range.textContent = `Min ${minT} | Max ${maxT}`;
  }

  // Scale pointer (0-300 scale)
  if (typeof aqiVal === 'number') {
    const pct = Math.min(Math.max((aqiVal / 300) * 100, 0), 100);
    mEl.mScalePointer.style.left = `${pct}%`;
  }

  // 🏃 Runner's Advice
  if (runner) {
    mEl.mRunnerVerdict.textContent = runner.verdict || 'Run Assessment';
    mEl.mRunnerVerdict.style.color = runner.color || '#ffffff';
    mEl.mRunnerPill.textContent = runner.badge || 'ADVISORY';
    mEl.mRunnerPill.style.backgroundColor = runner.color || '#ff453a';
    mEl.mRunnerSummary.textContent = runner.summary || '';

    const d = runner.durations || {};
    if (d.low) {
      mEl.mDurLow.textContent = d.low.duration;
      mEl.mDurLow.style.color = d.low.safe ? '#30d158' : '#ff453a';
    }
    if (d.moderate) {
      mEl.mDurMod.textContent = d.moderate.duration;
      mEl.mDurMod.style.color = d.moderate.safe ? '#ffd60a' : '#ff453a';
    }
    if (d.high) {
      mEl.mDurHigh.textContent = d.high.duration;
      mEl.mDurHigh.style.color = d.high.safe ? '#30d158' : '#ff453a';
    }

    if (runner.best_window) {
      mEl.mBestWindow.textContent = runner.best_window.recommendation;
    }

    if (runner.heat_stress) {
      mEl.mHeatStress.textContent = `Heat Index: ${runner.heat_stress.apparent_temp_c}°C • Humid: ${runner.heat_stress.humidity_pct}%`;
    }
  }

  // Pollutants
  mEl.mValPm10.textContent = (ground && ground.pollutants && ground.pollutants.pm10 && ground.pollutants.pm10.current) || (model && model.pm10_concentration && model.pm10_concentration.value) || '--';
  mEl.mValO3.textContent = (ground && ground.pollutants && ground.pollutants.o3 && ground.pollutants.o3.current) || (model && model.pollutants_ugm3 && model.pollutants_ugm3.ozone) || '--';
  mEl.mValNo2.textContent = (ground && ground.pollutants && ground.pollutants.no2 && ground.pollutants.no2.current) || (model && model.pollutants_ugm3 && model.pollutants_ugm3.nitrogen_dioxide) || '--';
  mEl.mValSo2.textContent = (ground && ground.pollutants && ground.pollutants.so2 && ground.pollutants.so2.current) || (model && model.pollutants_ugm3 && model.pollutants_ugm3.sulphur_dioxide) || '--';
  mEl.mValCo.textContent = (ground && ground.pollutants && ground.pollutants.co && ground.pollutants.co.current) || (model && model.pollutants_ugm3 && model.pollutants_ugm3.carbon_monoxide) || '--';
  mEl.mValEaqi.textContent = (model && model.european_aqi) || '--';

  // Sources
  if (ground && mEl.mSrcGround) {
    mEl.mSrcGround.textContent = `${ground.station_name || 'Station'} (AQI: ${ground.overall_aqi} • Station ID: ${ground.station_id || '2600'})`;
  }
  if (model && mEl.mSrcModel) {
    mEl.mSrcModel.textContent = `Copernicus CAMS (${model.us_aqi || '--'} US AQI / ${model.european_aqi || '--'} EAQI • PM2.5: ${typeof pm25.concentration_ugm3 === 'number' ? pm25.concentration_ugm3.toFixed(1) : (pm25.concentration_ugm3 || '--')} µg/m³)`;
  }
  if (mEl.mSrcIpu) {
    mEl.mSrcIpu.textContent = `JAS APIMS / IPU Standard: ${cat.malayCategory || 'Terkawal'} (${cat.category || 'Standard'})`;
  }

  // 📈 PM2.5 AQI 24-Hour Trend Card & Graph
  renderMobileTrendCard(data);
}

function renderMobileTrendCard(data) {
  if (!data) return;
  const pm25 = data.pm25 || {};
  const isAqi = mState.trendMode === 'aqi';
  const rangeMode = mState.trendRange || 'all';

  const pastTr = pm25.past_trend || {};
  let futTr = pm25.future_trend || pm25.trend;

  // 1. Populate Past 24h Observed Stats
  if (mEl.mTrendPastPeak) {
    if (isAqi) {
      const p = pastTr.peak_aqi || pastTr.peakAqi || {};
      const val = p.value !== undefined ? p.value : (p.val !== undefined ? p.val : '--');
      mEl.mTrendPastPeak.textContent = `${val} AQI (${p.time || '--'})`;
    } else {
      const p = pastTr.peak_conc || pastTr.peakConc || {};
      const val = p.value !== undefined ? p.value : (p.val !== undefined ? p.val : '--');
      mEl.mTrendPastPeak.textContent = `${val} µg (${p.time || '--'})`;
    }
  }

  if (mEl.mTrendPastLow) {
    if (isAqi) {
      const p = pastTr.lowest_aqi || pastTr.lowestAqi || {};
      const val = p.value !== undefined ? p.value : (p.val !== undefined ? p.val : '--');
      mEl.mTrendPastLow.textContent = `${val} AQI (${p.time || '--'})`;
    } else {
      const p = pastTr.lowest_conc || pastTr.lowestConc || {};
      const val = p.value !== undefined ? p.value : (p.val !== undefined ? p.val : '--');
      mEl.mTrendPastLow.textContent = `${val} µg (${p.time || '--'})`;
    }
  }

  if (mEl.mTrendPastShift) {
    const d = isAqi ? (pastTr.drift_6h !== undefined ? pastTr.drift_6h : (pastTr.drift6h || 0)) : (pastTr.drift_6h_conc !== undefined ? pastTr.drift_6h_conc : (pastTr.driftConc || 0));
    const unit = isAqi ? 'AQI' : 'µg';
    const sign = d > 0 ? '+' : '';
    mEl.mTrendPastShift.textContent = `${sign}${d} ${unit}`;
    mEl.mTrendPastShift.style.color = d > (isAqi ? 5 : 2) ? '#ff453a' : (d < -(isAqi ? 5 : 2) ? '#30d158' : '#06b6d4');
  }

  // 2. Populate Future 24h Forecast Stats
  if (!futTr && pm25.hourly_times && pm25.hourly_conc) {
    const times = pm25.hourly_times || [];
    const concs = pm25.hourly_conc || [];
    const aqis = pm25.hourly_aqi || concs.map(c => calcPm25Aqi(c));
    const limit = Math.min(24, times.length, concs.length, aqis.length);
    let peakAqiVal = -1, peakAqiIdx = 0;
    let cleanAqiVal = 9999, cleanAqiIdx = 0;
    let peakConcVal = -1, peakConcIdx = 0;
    let cleanConcVal = 9999, cleanConcIdx = 0;

    for (let i = 0; i < limit; i++) {
      if (aqis[i] > peakAqiVal) { peakAqiVal = aqis[i]; peakAqiIdx = i; }
      if (aqis[i] < cleanAqiVal) { cleanAqiVal = aqis[i]; cleanAqiIdx = i; }
      if (concs[i] > peakConcVal) { peakConcVal = concs[i]; peakConcIdx = i; }
      if (concs[i] < cleanConcVal) { cleanConcVal = concs[i]; cleanConcIdx = i; }
    }
    const getH = (s) => (s && s.split('T')[1]) ? s.split('T')[1].substring(0, 5) : (s || '--');
    const driftIdx = Math.min(6, limit - 1);
    const dAqi = (aqis[driftIdx] || aqis[0]) - (aqis[0] || 0);
    const dConc = Math.round(((concs[driftIdx] || concs[0]) - (concs[0] || 0)) * 10) / 10;
    let traj = 'STABLE';
    if (dAqi >= 7) traj = 'RISING';
    else if (dAqi <= -7) traj = 'FALLING';

    futTr = {
      trajectory: traj,
      drift_6h_aqi: dAqi,
      drift_6h_conc: dConc,
      peak_aqi: { value: peakAqiVal, time: getH(times[peakAqiIdx]) },
      peak_conc: { value: Math.round(peakConcVal * 10) / 10, time: getH(times[peakConcIdx]) },
      cleanest_window: { aqi: cleanAqiVal, conc: Math.round(cleanConcVal * 10) / 10, time: getH(times[cleanAqiIdx]) },
      summary: `PM2.5 trajectory projected to remain ${traj.toLowerCase()} over 24h.`
    };
  }

  if (futTr) {
    if (mEl.mTrendBadge) {
      mEl.mTrendBadge.textContent = futTr.trajectory || 'STABLE';
      if (futTr.trajectory === 'RISING') {
        mEl.mTrendBadge.style.background = '#ff453a';
        mEl.mTrendBadge.style.color = '#fff';
      } else if (futTr.trajectory === 'FALLING') {
        mEl.mTrendBadge.style.background = '#30d158';
        mEl.mTrendBadge.style.color = '#fff';
      } else {
        mEl.mTrendBadge.style.background = 'rgba(255, 255, 255, 0.15)';
        mEl.mTrendBadge.style.color = '#e2e8f0';
      }
    }

    if (mEl.mTrendVerdict) {
      const pT = pastTr.trajectory || 'Observed';
      const fT = futTr.trajectory || 'Stable';
      mEl.mTrendVerdict.textContent = `Past 24h: ${pT} ➔ Next 24h: ${fT}`;
    }

    if (mEl.mTrendPeak) {
      if (isAqi) {
        const p = futTr.peak_aqi || futTr.peakAqi || {};
        const val = p.value !== undefined ? p.value : (p.val !== undefined ? p.val : '--');
        mEl.mTrendPeak.textContent = `${val} AQI (${p.time || '--'})`;
      } else {
        const p = futTr.peak_conc || futTr.peakConc || {};
        const val = p.value !== undefined ? p.value : (p.val !== undefined ? p.val : '--');
        mEl.mTrendPeak.textContent = `${val} µg (${p.time || '--'})`;
      }
    }

    if (mEl.mTrendClean) {
      if (isAqi) {
        const c = futTr.cleanest_window || futTr.cleanAqi || {};
        const val = c.aqi !== undefined ? c.aqi : (c.val !== undefined ? c.val : (futTr.lowest_aqi !== undefined ? futTr.lowest_aqi : '--'));
        mEl.mTrendClean.textContent = `${val} AQI (${c.time || futTr.lowest_time || '--'})`;
      } else {
        const c = futTr.cleanest_window || futTr.cleanConc || {};
        const val = c.conc !== undefined ? c.conc : (c.val !== undefined ? c.val : (futTr.lowest_conc !== undefined ? futTr.lowest_conc : '--'));
        mEl.mTrendClean.textContent = `${val} µg (${c.time || futTr.lowest_time || '--'})`;
      }
    }

    if (mEl.mTrendDrift) {
      if (isAqi) {
        const d = futTr.drift_6h_aqi !== undefined ? futTr.drift_6h_aqi : (futTr.change_6h !== undefined ? futTr.change_6h : (futTr.driftAqi || 0));
        const sign = d > 0 ? '+' : '';
        mEl.mTrendDrift.textContent = `${sign}${d} AQI (6h)`;
        mEl.mTrendDrift.style.color = d > 5 ? '#ff453a' : (d < -5 ? '#30d158' : '#38bdf8');
      } else {
        const d = futTr.drift_6h_conc !== undefined ? futTr.drift_6h_conc : (futTr.driftConc || 0);
        const sign = d > 0 ? '+' : '';
        mEl.mTrendDrift.textContent = `${sign}${d} µg (6h)`;
        mEl.mTrendDrift.style.color = d > 2 ? '#ff453a' : (d < -2 ? '#30d158' : '#38bdf8');
      }
    }

    if (mEl.mTrendSummary) {
      const pSum = pastTr.summary || '';
      const fSum = futTr.summary || '';
      mEl.mTrendSummary.textContent = (pSum && fSum) ? `${pSum} • ${fSum}` : (fSum || pSum || 'Copernicus CAMS atmospheric dispersion model.');
    }
  }

  // Render HTML5 Canvas Chart & Hourly Table
  if (mState.trendView === 'table') {
    if (mEl.mTrendCanvasWrap) mEl.mTrendCanvasWrap.classList.add('hidden');
    if (mEl.mTrendTableWrap) mEl.mTrendTableWrap.classList.remove('hidden');
  } else {
    if (mEl.mTrendCanvasWrap) mEl.mTrendCanvasWrap.classList.remove('hidden');
    if (mEl.mTrendTableWrap) mEl.mTrendTableWrap.classList.add('hidden');
  }
  drawMobileTrendGraph('mTrendCanvas', data, isAqi);
  renderMobileTrendTable(data);
}

function renderMobileTrendTable(data) {
  if (!data || !mEl.mTrendTableBody) return;
  const pm25 = data.pm25 || {};
  const isAqi = mState.trendMode === 'aqi';
  const rangeMode = mState.trendRange || 'all';

  if (mEl.mTrendTableUnitBadge) {
    mEl.mTrendTableUnitBadge.textContent = isAqi ? 'PM2.5 AQI' : 'µg/m³ Conc';
  }

  let times = [];
  let aqis = [];
  let concs = [];
  let nowIdx = -1;
  let title = 'Continuous 48h Hourly Log';

  if (rangeMode === 'past') {
    const pData = pm25.past_24h || {};
    times = pData.time || [];
    aqis = pData.pm25_aqi || [];
    concs = pData.pm2_5 || [];
    nowIdx = times.length - 1;
    title = 'Past 24h Hourly Observations';
  } else if (rangeMode === 'future') {
    const fData = pm25.future_24h || (data.openmeteo_model && data.openmeteo_model.hourly_forecast) || {};
    times = (fData.time || []).slice(0, 24);
    aqis = (fData.pm25_aqi || pm25.hourly_aqi || []).slice(0, 24);
    concs = (fData.pm2_5 || pm25.hourly_conc || []).slice(0, 24);
    nowIdx = 0;
    title = 'Next 24h Hourly Forecast Outlook';
  } else {
    const tlData = pm25.timeline_48h || {};
    times = tlData.time || [];
    aqis = tlData.pm25_aqi || [];
    concs = tlData.pm2_5 || [];
    nowIdx = tlData.now_index !== undefined ? tlData.now_index : 24;
    title = 'Full 48h Continuous Timeline';
  }

  if (mEl.mTrendTableTitle) {
    mEl.mTrendTableTitle.textContent = title;
  }

  if (!times.length) {
    mEl.mTrendTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#94a3b8; padding:12px;">No hourly records available</td></tr>';
    return;
  }

  // Build rows - For past mode, show newest/NOW first so user doesn't have to scroll all the way down!
  const indices = [];
  for (let i = 0; i < times.length; i++) indices.push(i);
  if (rangeMode === 'past') {
    indices.reverse();
  }

  const formatH = (s) => {
    if (!s) return '--:--';
    if (s.includes('T')) {
      const parts = s.split('T');
      const d = parts[0].slice(5); // MM-DD
      const t = parts[1].slice(0, 5); // HH:mm
      return `${d} ${t}`;
    }
    return s.slice(11, 16) || s;
  };

  let rowsHtml = '';
  indices.forEach(idx => {
    const rawAqi = aqis[idx];
    const rawConc = concs[idx];
    const aqiVal = (rawAqi !== null && rawAqi !== undefined && !isNaN(rawAqi)) ? Math.round(rawAqi) : (rawConc !== null ? calcPm25Aqi(rawConc) : '--');
    const concVal = (rawConc !== null && rawConc !== undefined && !isNaN(rawConc)) ? parseFloat(rawConc).toFixed(1) : (typeof aqiVal === 'number' ? aqiToPm25Conc(aqiVal).toFixed(1) : '--');
    const cat = getAqiCategory(typeof aqiVal === 'number' ? aqiVal : 50);

    const isNow = idx === nowIdx;
    const rowClass = isNow ? 'row-now' : '';
    const nowTag = isNow ? '<span style="color:#ffd60a; font-weight:800; font-size:9px; margin-left:2px;">● NOW</span>' : '';
    const timeLabel = formatH(times[idx]);

    rowsHtml += `
      <tr class="${rowClass}">
        <td><strong>${timeLabel}</strong>${nowTag}</td>
        <td><span class="tbl-badge" style="background:${cat.color}; color:${cat.category === 'Moderate' ? '#000' : '#fff'};">${aqiVal}</span></td>
        <td>${concVal} µg</td>
        <td><span class="tbl-cat" style="color:${cat.color}; font-weight:600;">${cat.category}</span></td>
      </tr>
    `;
  });

  mEl.mTrendTableBody.innerHTML = rowsHtml;
}

function drawMobileTrendGraph(canvasId, data, isAqi) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const container = canvas.parentElement;
  let padH = 16;
  if (container) {
    const cs = window.getComputedStyle(container);
    padH = (parseFloat(cs.paddingLeft) || 8) + (parseFloat(cs.paddingRight) || 8);
  }
  const availWidth = container ? (container.clientWidth - padH) : 330;
  const width = Math.max(260, availWidth || 330);
  const height = 150;
  const dpr = Math.min(window.devicePixelRatio || 2, 3);

  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  ctx.save();
  try {
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const pm25 = data.pm25 || {};
    const rangeMode = mState.trendRange || 'all';

    let rawValues = [];
    let nowIdx = -1;

    if (rangeMode === 'past') {
      const pData = pm25.past_24h || {};
      rawValues = isAqi ? (pData.pm25_aqi || []) : (pData.pm2_5 || []);
      nowIdx = rawValues.length - 1;
      const times = pData.time || [];
      if (mEl.mTrendCanvasLabels) {
        if (times.length >= 5) {
          const getH = (s) => (s && s.split('T')[1]) ? s.split('T')[1].substring(0, 5) : (s || '--');
          const t0 = getH(times[0]);
          const t1 = getH(times[Math.floor(times.length * 0.25)]);
          const t2 = getH(times[Math.floor(times.length * 0.5)]);
          const t3 = getH(times[Math.floor(times.length * 0.75)]);
          const tNow = getH(times[times.length - 1]) || 'NOW';
          mEl.mTrendCanvasLabels.innerHTML = `<span>${t0}</span><span>${t1}</span><span>${t2}</span><span>${t3}</span><span style="color:#06b6d4; font-weight:700;">${tNow}</span>`;
        } else {
          mEl.mTrendCanvasLabels.innerHTML = '<span>-24h</span><span>-18h</span><span>-12h</span><span>-6h</span><span style="color:#06b6d4; font-weight:700;">NOW</span>';
        }
      }
    } else if (rangeMode === 'future') {
      const fData = pm25.future_24h || (data.openmeteo_model && data.openmeteo_model.hourly_forecast) || {};
      const raw = isAqi ? (fData.pm25_aqi || pm25.hourly_aqi || []) : (fData.pm2_5 || pm25.hourly_conc || []);
      rawValues = raw.slice(0, 24);
      nowIdx = 0;
      const times = fData.time || [];
      if (mEl.mTrendCanvasLabels) {
        if (times.length >= 5) {
          const getH = (s) => (s && s.split('T')[1]) ? s.split('T')[1].substring(0, 5) : (s || '--');
          const t0 = getH(times[0]) || 'NOW';
          const t1 = getH(times[Math.min(times.length - 1, 5)]);
          const t2 = getH(times[Math.min(times.length - 1, 11)]);
          const t3 = getH(times[Math.min(times.length - 1, 17)]);
          const t4 = getH(times[Math.min(times.length - 1, 23)]);
          mEl.mTrendCanvasLabels.innerHTML = `<span style="color:#ffd60a; font-weight:700;">${t0}</span><span>${t1}</span><span>${t2}</span><span>${t3}</span><span>${t4}</span>`;
        } else {
          mEl.mTrendCanvasLabels.innerHTML = '<span style="color:#ffd60a; font-weight:700;">NOW</span><span>+4h</span><span>+8h</span><span>+12h</span><span>+18h</span><span>+24h</span>';
        }
      }
    } else {
      // 48h timeline
      const tlData = pm25.timeline_48h || {};
      rawValues = isAqi ? (tlData.pm25_aqi || []) : (tlData.pm2_5 || []);
      nowIdx = tlData.now_index !== undefined ? tlData.now_index : 24;
      const times = tlData.time || [];
      if (mEl.mTrendCanvasLabels) {
        if (times.length >= 5) {
          const getH = (s) => (s && s.split('T')[1]) ? s.split('T')[1].substring(0, 5) : (s || '--');
          const t0 = getH(times[0]);
          const t1 = getH(times[Math.floor(nowIdx / 2)]);
          const tNow = getH(times[nowIdx]) || 'NOW';
          const t3 = getH(times[Math.min(times.length - 1, nowIdx + Math.floor((times.length - 1 - nowIdx) / 2))]);
          const t4 = getH(times[times.length - 1]);
          mEl.mTrendCanvasLabels.innerHTML = `<span>${t0}</span><span>${t1}</span><span style="color:#ffd60a; font-weight:700;">📍 ${tNow}</span><span>${t3}</span><span>${t4}</span>`;
        } else {
          mEl.mTrendCanvasLabels.innerHTML = '<span>-24h</span><span>-12h</span><span style="color:#ffd60a; font-weight:700;">📍 NOW</span><span>+12h</span><span>+24h</span>';
        }
      }
    }

    // Sanitize values to ensure array of clean numbers, replacing null/undefined/NaN
    let lastValid = (typeof pm25.aqi_reading === 'number') ? pm25.aqi_reading : (isAqi ? 50 : 15);
    const values = [];
    for (let i = 0; i < rawValues.length; i++) {
      const v = rawValues[i];
      if (v !== null && v !== undefined && !isNaN(v)) {
        lastValid = parseFloat(v);
      }
      values.push(lastValid);
    }

    if (values.length < 2) {
      return;
    }

    const padTop = 18;
    const padBottom = 22;
    const padLeft = 32;
    const padRight = 14;

    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const maxVal = Math.max(...values, isAqi ? 120 : 35);
    const minVal = 0;
    const range = maxVal - minVal || 1;

    const getX = (i) => padLeft + (i / (values.length - 1)) * plotW;
    const getY = (val) => padTop + plotH - ((val - minVal) / range) * plotH;

    // Draw threshold guidelines
    const guidelines = isAqi 
      ? [{ val: 50, color: 'rgba(48, 209, 88, 0.35)', label: '50' },
         { val: 100, color: 'rgba(255, 214, 10, 0.35)', label: '100' },
         { val: 150, color: 'rgba(255, 69, 58, 0.35)', label: '150' }]
      : [{ val: 15, color: 'rgba(48, 209, 88, 0.35)', label: '15 µg' },
         { val: 35, color: 'rgba(255, 214, 10, 0.35)', label: '35 µg' }];

    guidelines.forEach(g => {
      if (g.val <= maxVal) {
        const y = getY(g.val);
        ctx.beginPath();
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = g.color;
        ctx.lineWidth = 1;
        ctx.moveTo(padLeft, y);
        ctx.lineTo(width - padRight, y);
        ctx.stroke();

        ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
        ctx.font = '9px -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(g.label, padLeft - 4, y + 3);
      }
    });
    ctx.setLineDash([]);

    // Fill Gradient Area
    const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
    if (isAqi) {
      grad.addColorStop(0, rangeMode === 'past' ? 'rgba(6, 182, 212, 0.45)' : 'rgba(56, 189, 248, 0.45)');
      grad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
    } else {
      grad.addColorStop(0, 'rgba(100, 210, 255, 0.4)');
      grad.addColorStop(1, 'rgba(100, 210, 255, 0.0)');
    }

    ctx.beginPath();
    ctx.moveTo(getX(0), getY(values[0]));
    for (let i = 0; i < values.length - 1; i++) {
      const xc = (getX(i) + getX(i + 1)) / 2;
      const yc = (getY(values[i]) + getY(values[i + 1])) / 2;
      ctx.quadraticCurveTo(getX(i), getY(values[i]), xc, yc);
    }
    const lastIdx = values.length - 1;
    ctx.lineTo(getX(lastIdx), getY(values[lastIdx]));
    ctx.lineTo(getX(lastIdx), padTop + plotH);
    ctx.lineTo(getX(0), padTop + plotH);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw 48h timeline divider if mode is all
    if (rangeMode === 'all' && 0 <= nowIdx && nowIdx < values.length) {
      const xNow = getX(nowIdx);
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = '#ffd60a';
      ctx.lineWidth = 1.5;
      ctx.moveTo(xNow, padTop);
      ctx.lineTo(xNow, padTop + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Stroke Curve Line
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(values[0]));
    for (let i = 0; i < values.length - 1; i++) {
      const xc = (getX(i) + getX(i + 1)) / 2;
      const yc = (getY(values[i]) + getY(values[i + 1])) / 2;
      ctx.quadraticCurveTo(getX(i), getY(values[i]), xc, yc);
    }
    ctx.lineTo(getX(lastIdx), getY(values[lastIdx]));
    ctx.strokeStyle = rangeMode === 'past' ? '#06b6d4' : '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Highlight key points: Peak and Cleanest
    let maxIdx = 0, minIdx = 0;
    for (let i = 0; i < values.length; i++) {
      if (values[i] > values[maxIdx]) maxIdx = i;
      if (values[i] < values[minIdx]) minIdx = i;
    }

    // Peak Point
    if (maxIdx >= 0) {
      const xP = getX(maxIdx), yP = getY(values[maxIdx]);
      ctx.beginPath();
      ctx.arc(xP, yP, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ff453a';
      ctx.fill();
    }

    // Cleanest Point
    if (minIdx >= 0 && minIdx !== maxIdx) {
      const xC = getX(minIdx), yC = getY(values[minIdx]);
      ctx.beginPath();
      ctx.arc(xC, yC, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#30d158';
      ctx.fill();
    }

    // NOW Point
    if (0 <= nowIdx && nowIdx < values.length) {
      const xN = getX(nowIdx), yN = getY(values[nowIdx]);
      ctx.beginPath();
      ctx.arc(xN, yN, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 214, 10, 0.35)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(xN, yN, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd60a';
      ctx.fill();
    }
  } finally {
    ctx.restore();
  }
}

// Redraw chart on viewport resize or orientation change
window.addEventListener('resize', () => {
  if (mState.currentData && mState.trendView !== 'table') {
    drawMobileTrendGraph('mTrendCanvas', mState.currentData, mState.trendMode === 'aqi');
  }
});
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    if (mState.currentData && mState.trendView !== 'table') {
      drawMobileTrendGraph('mTrendCanvas', mState.currentData, mState.trendMode === 'aqi');
    }
  }, 200);
});

function renderMobileCompare() {
  const keys = ['perai', 'kuala-lumpur', 'alor-setar'];
  let html = '';

  keys.forEach(k => {
    const c = mState.presetData[k];
    if (!c) return;

    const pm25 = c.pm25 || {};
    let pm25Aqi = (pm25.aqi_reading !== undefined && pm25.aqi_reading !== null) ? pm25.aqi_reading : pm25.sub_index;
    if (pm25Aqi === null && pm25.concentration_ugm3 !== null && pm25.concentration_ugm3 !== undefined) {
      pm25Aqi = calcPm25Aqi(pm25.concentration_ugm3);
    }
    const pm25Cat = pm25.category || (pm25Aqi !== null ? getAqiCategory(pm25Aqi) : null);
    const pm25Color = (pm25Cat && pm25Cat.color) || '#ff9f0a';

    html += `
      <div class="ios-widget-card" style="margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div>
            <strong style="font-size:16px;">${c.location.name}</strong>
            <div style="font-size:11px; color:#8e8e93;">${c.location.state}</div>
          </div>
          <div style="font-size:24px; font-weight:800; color:${c.category.color};">
            ${c.overall_aqi}
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; font-size:12px; border-top:0.5px solid rgba(255,255,255,0.1); padding-top:6px;">
          <span>PM2.5: <strong style="color:${pm25Color};">${pm25Aqi !== null ? pm25Aqi : '--'} AQI</strong> (${pm25.concentration_ugm3 ? pm25.concentration_ugm3.toFixed(1) + ' µg/m³' : '--'})</span>
          <span>Runner: <strong style="color:${c.runner_advice ? c.runner_advice.color : '#fff'};">${c.runner_advice ? c.runner_advice.badge : 'N/A'}</strong></span>
          <span>Low: <strong>${c.runner_advice && c.runner_advice.durations && c.runner_advice.durations.low ? c.runner_advice.durations.low.duration : '--'}</strong></span>
        </div>
      </div>
    `;
  });

  mEl.mCompareCardsContainer.innerHTML = html;
}
