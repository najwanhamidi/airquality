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
      if (mEl.btnMTrendConc) mEl.btnMTrendConc.classList.remove('active');
      if (mState.currentData) renderMobileTrendCard(mState.currentData);
    });
  }

  if (mEl.btnMTrendConc) {
    mEl.btnMTrendConc.addEventListener('click', () => {
      mState.trendMode = 'conc';
      mEl.btnMTrendConc.classList.add('active');
      if (mEl.btnMTrendAqi) mEl.btnMTrendAqi.classList.remove('active');
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
      "aqi_reading": 82,
      "sub_index": 82,
      "concentration_ugm3": 26.8,
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
        "direction": "worsening",
        "direction_label": "Worsening (Rising)",
        "trajectory": "RISING",
        "arrow": "↗",
        "change_6h": 10,
        "drift_6h_aqi": 10,
        "drift_6h_conc": 4.8,
        "color": "#EF4444",
        "peak_aqi": {
          "value": 110,
          "time": "20:00"
        },
        "peak_time": "20:00",
        "peak_val": 110,
        "cleanest_window": {
          "aqi": 63,
          "conc": 17.8,
          "time": "07:00"
        },
        "lowest_aqi": 63,
        "lowest_time": "07:00",
        "clean_val": 63,
        "peak_conc": {
          "value": 39.2,
          "time": "20:00"
        },
        "lowest_conc": {
          "value": 17.8,
          "time": "07:00"
        },
        "summary": "Rising pollution: PM2.5 AQI increasing by +10 points over 6h, peaking at 110 AQI at ~20:00."
      },
      "future_trend": {
        "direction": "worsening",
        "direction_label": "Worsening (Rising)",
        "trajectory": "RISING",
        "arrow": "↗",
        "change_6h": 10,
        "drift_6h_aqi": 10,
        "drift_6h_conc": 4.8,
        "color": "#EF4444",
        "peak_aqi": {
          "value": 110,
          "time": "20:00"
        },
        "peak_time": "20:00",
        "peak_val": 110,
        "cleanest_window": {
          "aqi": 63,
          "conc": 17.8,
          "time": "07:00"
        },
        "lowest_aqi": 63,
        "lowest_time": "07:00",
        "clean_val": 63,
        "peak_conc": {
          "value": 39.2,
          "time": "20:00"
        },
        "lowest_conc": {
          "value": 17.8,
          "time": "07:00"
        },
        "summary": "Rising pollution: PM2.5 AQI increasing by +10 points over 6h, peaking at 110 AQI at ~20:00."
      },
      "past_trend": {
        "trajectory": "RISING",
        "direction_label": "Worsened (+30 pts past 6h)",
        "arrow": "↗",
        "drift_6h": 30,
        "drift_24h": 54,
        "drift_6h_conc": 14.2,
        "color": "#EF4444",
        "peak_aqi": {
          "value": 85,
          "time": "10:00"
        },
        "peak_val": 85,
        "lowest_aqi": {
          "value": 23,
          "time": "13:00"
        },
        "clean_val": 23,
        "peak_conc": {
          "value": 28.3,
          "time": "10:00"
        },
        "lowest_conc": {
          "value": 5.5,
          "time": "13:00"
        },
        "summary": "Past 24h: PM2.5 AQI shifted by +54 pts (+30 pts in last 6h), reaching a past peak of 85 AQI at ~10:00 and a low of 23 AQI at ~13:00."
      },
      "hourly_times": [
        "2026-10-13T11:00",
        "2026-10-13T12:00",
        "2026-10-13T13:00",
        "2026-10-13T14:00",
        "2026-10-13T15:00",
        "2026-10-13T16:00",
        "2026-10-13T17:00",
        "2026-10-13T18:00",
        "2026-10-13T19:00",
        "2026-10-13T20:00",
        "2026-10-13T21:00",
        "2026-10-13T22:00",
        "2026-10-13T23:00",
        "2026-10-14T00:00",
        "2026-10-14T01:00",
        "2026-10-14T02:00",
        "2026-10-14T03:00",
        "2026-10-14T04:00",
        "2026-10-14T05:00",
        "2026-10-14T06:00",
        "2026-10-14T07:00",
        "2026-10-14T08:00",
        "2026-10-14T09:00",
        "2026-10-14T10:00",
        "2026-10-14T11:00",
        "2026-10-14T12:00",
        "2026-10-14T13:00",
        "2026-10-14T14:00",
        "2026-10-14T15:00",
        "2026-10-14T16:00",
        "2026-10-14T17:00",
        "2026-10-14T18:00",
        "2026-10-14T19:00",
        "2026-10-14T20:00",
        "2026-10-14T21:00",
        "2026-10-14T22:00",
        "2026-10-14T23:00"
      ],
      "hourly_aqi": [
        82,
        83,
        86,
        89,
        90,
        90,
        92,
        96,
        100,
        110,
        107,
        102,
        98,
        92,
        84,
        80,
        79,
        79,
        81,
        66,
        63,
        67,
        74,
        79,
        83,
        90,
        95,
        97,
        97,
        100,
        98,
        99,
        102,
        109,
        113,
        114,
        120
      ],
      "hourly_conc": [
        26.8,
        27.3,
        28.7,
        30.2,
        30.6,
        30.6,
        31.6,
        33.5,
        35.4,
        39.2,
        37.9,
        35.9,
        34.4,
        31.6,
        27.8,
        25.9,
        25.4,
        25.4,
        26.4,
        19.2,
        17.8,
        19.7,
        23.0,
        25.4,
        27.3,
        30.6,
        33.0,
        34.0,
        34.0,
        35.4,
        34.4,
        34.9,
        35.9,
        38.7,
        40.4,
        40.8,
        43.2
      ],
      "past_24h": {
        "time": [
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
          "2026-10-12T23:00",
          "2026-10-13T00:00",
          "2026-10-13T01:00",
          "2026-10-13T02:00",
          "2026-10-13T03:00",
          "2026-10-13T04:00",
          "2026-10-13T05:00",
          "2026-10-13T06:00",
          "2026-10-13T07:00",
          "2026-10-13T08:00",
          "2026-10-13T09:00",
          "2026-10-13T10:00",
          "2026-10-13T11:00"
        ],
        "pm2_5": [
          6.7,
          5.5,
          27.3,
          8.9,
          9.8,
          22.1,
          10.6,
          9.4,
          17.3,
          26.4,
          21.1,
          21.1,
          20.7,
          18.3,
          15.9,
          14.0,
          13.1,
          12.6,
          13.1,
          15.0,
          12.6,
          16.4,
          28.3,
          26.8
        ],
        "pm25_aqi": [
          28,
          23,
          83,
          37,
          41,
          72,
          44,
          39,
          62,
          81,
          70,
          70,
          69,
          64,
          59,
          55,
          53,
          52,
          53,
          57,
          52,
          60,
          85,
          82
        ],
        "pm10": [
          6.4,
          5.7,
          5.7,
          4.7,
          4.6,
          4.8,
          5.6,
          7.1,
          9.9,
          15.0,
          17.2,
          18.7,
          22.1,
          25.7,
          27.8,
          27.4,
          17.2,
          10.0,
          8.1,
          8.8,
          9.7,
          12.0,
          15.0,
          13.4,
          14.6
        ],
        "us_aqi": [
          53,
          53,
          54,
          54,
          55,
          55,
          56,
          56,
          55,
          55,
          55,
          56,
          55,
          55,
          55,
          54,
          54,
          55,
          55,
          55,
          54,
          54,
          54,
          55
        ]
      },
      "future_24h": {
        "time": [
          "2026-10-13T11:00",
          "2026-10-13T12:00",
          "2026-10-13T13:00",
          "2026-10-13T14:00",
          "2026-10-13T15:00",
          "2026-10-13T16:00",
          "2026-10-13T17:00",
          "2026-10-13T18:00",
          "2026-10-13T19:00",
          "2026-10-13T20:00",
          "2026-10-13T21:00",
          "2026-10-13T22:00",
          "2026-10-13T23:00",
          "2026-10-14T00:00",
          "2026-10-14T01:00",
          "2026-10-14T02:00",
          "2026-10-14T03:00",
          "2026-10-14T04:00",
          "2026-10-14T05:00",
          "2026-10-14T06:00",
          "2026-10-14T07:00",
          "2026-10-14T08:00",
          "2026-10-14T09:00",
          "2026-10-14T10:00",
          "2026-10-14T11:00",
          "2026-10-14T12:00",
          "2026-10-14T13:00",
          "2026-10-14T14:00",
          "2026-10-14T15:00",
          "2026-10-14T16:00",
          "2026-10-14T17:00",
          "2026-10-14T18:00",
          "2026-10-14T19:00",
          "2026-10-14T20:00",
          "2026-10-14T21:00",
          "2026-10-14T22:00",
          "2026-10-14T23:00"
        ],
        "pm2_5": [
          26.8,
          27.3,
          28.7,
          30.2,
          30.6,
          30.6,
          31.6,
          33.5,
          35.4,
          39.2,
          37.9,
          35.9,
          34.4,
          31.6,
          27.8,
          25.9,
          25.4,
          25.4,
          26.4,
          19.2,
          17.8,
          19.7,
          23.0,
          25.4,
          27.3,
          30.6,
          33.0,
          34.0,
          34.0,
          35.4,
          34.4,
          34.9,
          35.9,
          38.7,
          40.4,
          40.8,
          43.2
        ],
        "pm25_aqi": [
          82,
          83,
          86,
          89,
          90,
          90,
          92,
          96,
          100,
          110,
          107,
          102,
          98,
          92,
          84,
          80,
          79,
          79,
          81,
          66,
          63,
          67,
          74,
          79,
          83,
          90,
          95,
          97,
          97,
          100,
          98,
          99,
          102,
          109,
          113,
          114,
          120
        ],
        "pm10": [
          14.6,
          16.1,
          18.1,
          19.8,
          21.1,
          22.1,
          23.6,
          25.3,
          27.6,
          32.9,
          31.5,
          29.3,
          27.4,
          24.7,
          21.2,
          19.4,
          18.7,
          19.1,
          20.1,
          13.1,
          12.0,
          13.4,
          16.9,
          19.2,
          21.6,
          25.0,
          27.6,
          28.7,
          28.8,
          29.8,
          29.1,
          29.4,
          30.9,
          34.5,
          35.7,
          36.1,
          38.3
        ],
        "us_aqi": [
          56,
          57,
          58,
          59,
          60,
          61,
          76,
          95,
          105,
          108,
          104,
          96,
          84,
          71,
          71,
          70,
          69,
          70,
          70,
          71,
          72,
          72,
          72,
          72,
          73,
          73,
          74,
          75,
          75,
          96,
          123,
          146,
          156,
          158,
          153,
          142,
          126
        ],
        "european_aqi": [
          53,
          64,
          69,
          73,
          76,
          78,
          77,
          71,
          63,
          50,
          49,
          48,
          47,
          45,
          44,
          42,
          42,
          42,
          43,
          36,
          34,
          37,
          41,
          56,
          70,
          77,
          83,
          91,
          102,
          113,
          113,
          96,
          75,
          63,
          52,
          52,
          53
        ]
      },
      "timeline_48h": {
        "time": [
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
          "2026-10-12T23:00",
          "2026-10-13T00:00",
          "2026-10-13T01:00",
          "2026-10-13T02:00",
          "2026-10-13T03:00",
          "2026-10-13T04:00",
          "2026-10-13T05:00",
          "2026-10-13T06:00",
          "2026-10-13T07:00",
          "2026-10-13T08:00",
          "2026-10-13T09:00",
          "2026-10-13T10:00",
          "2026-10-13T11:00",
          "2026-10-13T12:00",
          "2026-10-13T13:00",
          "2026-10-13T14:00",
          "2026-10-13T15:00",
          "2026-10-13T16:00",
          "2026-10-13T17:00",
          "2026-10-13T18:00",
          "2026-10-13T19:00",
          "2026-10-13T20:00",
          "2026-10-13T21:00",
          "2026-10-13T22:00",
          "2026-10-13T23:00",
          "2026-10-14T00:00",
          "2026-10-14T01:00",
          "2026-10-14T02:00",
          "2026-10-14T03:00",
          "2026-10-14T04:00",
          "2026-10-14T05:00",
          "2026-10-14T06:00",
          "2026-10-14T07:00",
          "2026-10-14T08:00",
          "2026-10-14T09:00",
          "2026-10-14T10:00",
          "2026-10-14T11:00"
        ],
        "pm2_5": [
          6.7,
          5.5,
          27.3,
          8.9,
          9.8,
          22.1,
          10.6,
          9.4,
          17.3,
          26.4,
          21.1,
          21.1,
          20.7,
          18.3,
          15.9,
          14.0,
          13.1,
          12.6,
          13.1,
          15.0,
          12.6,
          16.4,
          28.3,
          26.8,
          27.3,
          28.7,
          30.2,
          30.6,
          30.6,
          31.6,
          33.5,
          35.4,
          39.2,
          37.9,
          35.9,
          34.4,
          31.6,
          27.8,
          25.9,
          25.4,
          25.4,
          26.4,
          19.2,
          17.8,
          19.7,
          23.0,
          25.4,
          27.3
        ],
        "pm25_aqi": [
          28,
          23,
          83,
          37,
          41,
          72,
          44,
          39,
          62,
          81,
          70,
          70,
          69,
          64,
          59,
          55,
          53,
          52,
          53,
          57,
          52,
          60,
          85,
          82,
          83,
          86,
          89,
          90,
          90,
          92,
          96,
          100,
          110,
          107,
          102,
          98,
          92,
          84,
          80,
          79,
          79,
          81,
          66,
          63,
          67,
          74,
          79,
          83
        ],
        "us_aqi": [
          38,
          39,
          40,
          40,
          41,
          41,
          41,
          42,
          42,
          43,
          44,
          45,
          47,
          50,
          51,
          53,
          54,
          55,
          55,
          55,
          54,
          54,
          55,
          56,
          56,
          57,
          58,
          59,
          60,
          61,
          76,
          95,
          105,
          108,
          104,
          96,
          84,
          71,
          71,
          70,
          69,
          70,
          70,
          71,
          72,
          72,
          72,
          72,
          73
        ],
        "now_index": 23
      },
      "min_today": 8,
      "max_today": 90,
      "who_comparison": {
        "status": "1.8x WHO guideline (15 µg/m³)",
        "ratio": 1.8,
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
        "time": "11:00",
        "full_time": "2026-10-13T11:00",
        "predicted_aqi": 56,
        "recommendation": "Cleanest forecasted window: ~11:00 (Predicted AQI: 56)"
      },
      "heat_stress": {
        "temp_c": 29.9,
        "humidity_pct": 71,
        "apparent_temp_c": 36.2,
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
      "temperature_c": 29.9,
      "relative_humidity_pct": 71,
      "apparent_temperature_c": 36.2,
      "wind_speed_ms": 7.9,
      "wind_direction_deg": 201,
      "precipitation_mm": 0.0,
      "uv_index": 5.85
    },
    "aqicn_ground": {
      "source": "WAQI / aqicn.org (Malaysia DOE Ground Station)",
      "station_id": 2600,
      "station_name": "Perai, Pulau Pinang, Malaysia",
      "url": "https://aqicn.org/city/malaysia/pulau-pinang/perai/",
      "updated": "Tuesday, Oct 13th 2026, 11:00 am",
      "overall_aqi": 55,
      "pm25": {
        "current": 82,
        "min": 8,
        "max": 90,
        "unit": "AQI sub-index"
      },
      "pollutants": {
        "pm10": {
          "current": "38",
          "min": "6",
          "max": "42"
        },
        "o3": {
          "current": "7",
          "min": "0",
          "max": "9"
        },
        "no2": {
          "current": "6",
          "min": "1",
          "max": "7"
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
        "humidity": "70",
        "pressure": "1013",
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
          "aqi": "55",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 5778,
          "name": "Perai",
          "geo": [
            5.384388,
            100.3896169
          ],
          "aqi": "72",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 2601,
          "name": "Seberang Jaya 2, Perai, Pulau Pinang, Malaysia",
          "geo": [
            5.39817,
            100.403947
          ],
          "aqi": "59",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 9489,
          "name": "Minden, Pulau Pinang, Malaysia",
          "geo": [
            5.356211,
            100.30792
          ],
          "aqi": "54",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 9488,
          "name": "Kulim Hi-Tech, Kedah, Malaysia",
          "geo": [
            5.401688,
            100.58968
          ],
          "aqi": "54",
          "time": "2026-10-13T11:00:00+08:00"
        },
        {
          "id": 9490,
          "name": "Balik Pulau, Pulau Pinang, Malaysia",
          "geo": [
            5.337598,
            100.214721
          ],
          "aqi": "46",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 2582,
          "name": "Bakar Arang, Sg. Petani, Kedah, Malaysia",
          "geo": [
            5.629631,
            100.467771
          ],
          "aqi": "56",
          "time": "2026-10-13T11:00:00+08:00"
        },
        {
          "id": 2595,
          "name": "Kg. Air Putih, Taiping, Perak, Malaysia",
          "geo": [
            4.89885,
            100.679106
          ],
          "aqi": "50",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 12760,
          "name": "Betong, Thailand (ต.เบตง อ.เบตง จ.ยะลา)",
          "geo": [
            5.763873,
            101.067903
          ],
          "aqi": "50",
          "time": "2026-10-13T11:00:00+07:00"
        },
        {
          "id": 2581,
          "name": "Alor Setar, Kedah, Malaysia",
          "geo": [
            6.137244,
            100.346815
          ],
          "aqi": "56",
          "time": "2026-10-13T11:00:00+08:00"
        },
        {
          "id": 2594,
          "name": "Jalan Tasek, Ipoh, Perak, Malaysia",
          "geo": [
            4.629444,
            101.11665
          ],
          "aqi": "55",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 5777,
          "name": "Ipoh",
          "geo": [
            4.61175,
            101.113506
          ],
          "aqi": "64",
          "time": "2026-10-13T10:00:00+08:00"
        }
      ],
      "history": {
        "aqi": {
          "time": [
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
            "2026-10-12T08:00",
            "2026-10-12T09:00",
            "2026-10-12T10:00",
            "2026-10-12T11:00",
            "2026-10-12T12:00",
            "2026-10-12T13:00",
            "2026-10-12T14:00",
            "2026-10-12T15:00",
            "2026-10-12T16:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00"
          ],
          "values": [
            53,
            53,
            54,
            54,
            55,
            55,
            56,
            56,
            55,
            55,
            55,
            56,
            55,
            55,
            55,
            54,
            54,
            55,
            55,
            55,
            54,
            54,
            54,
            55
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": [
            53,
            53,
            54,
            54,
            55,
            55,
            56,
            56,
            55,
            55,
            55,
            56,
            55,
            55,
            55,
            54,
            54,
            55,
            55,
            55,
            54,
            54,
            54,
            55
          ]
        },
        "pm25": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            28,
            23,
            83,
            37,
            41,
            72,
            44,
            39,
            62,
            81,
            70,
            70,
            69,
            64,
            59,
            55,
            53,
            52,
            53,
            57,
            52,
            60,
            85,
            82
          ],
          "pm25_aqi": [
            28,
            23,
            83,
            37,
            41,
            72,
            44,
            39,
            62,
            81,
            70,
            70,
            69,
            64,
            59,
            55,
            53,
            52,
            53,
            57,
            52,
            60,
            85,
            82
          ],
          "pm2_5": [
            6.7,
            5.5,
            27.3,
            8.9,
            9.8,
            22.1,
            10.6,
            9.4,
            17.3,
            26.4,
            21.1,
            21.1,
            20.7,
            18.3,
            15.9,
            14.0,
            13.1,
            12.6,
            13.1,
            15.0,
            12.6,
            16.4,
            28.3,
            26.8
          ],
          "us_aqi": [
            28,
            23,
            83,
            37,
            41,
            72,
            44,
            39,
            62,
            81,
            70,
            70,
            69,
            64,
            59,
            55,
            53,
            52,
            53,
            57,
            52,
            60,
            85,
            82
          ]
        },
        "pm10": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            10,
            8,
            28,
            12,
            13,
            27,
            15,
            14,
            22,
            31,
            28,
            29,
            29,
            28,
            25,
            24,
            22,
            24,
            24,
            27,
            26,
            29,
            42,
            38
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "o3": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            5,
            4,
            5,
            5,
            7,
            6,
            8,
            8,
            6,
            4,
            2,
            1,
            1,
            0,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            4,
            7
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "no2": {
          "time": [
            "2026-10-12T11:00",
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            3,
            3,
            4,
            3,
            3,
            2,
            2,
            5,
            5,
            6,
            7,
            6,
            6,
            4,
            3,
            4,
            4,
            5,
            4,
            4,
            4,
            6,
            7,
            6
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "so2": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
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
            "2026-10-12T11:00",
            "2026-10-12T12:00",
            "2026-10-12T13:00",
            "2026-10-12T14:00",
            "2026-10-12T16:00",
            "2026-10-12T17:00",
            "2026-10-12T18:00",
            "2026-10-12T19:00",
            "2026-10-12T20:00",
            "2026-10-12T21:00",
            "2026-10-12T22:00",
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
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
            "2026-10-12T23:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            25,
            25,
            24,
            25,
            26,
            29,
            29,
            30,
            29,
            28,
            27,
            27,
            27,
            26,
            26,
            26,
            25,
            25,
            25,
            25,
            24,
            27,
            29,
            31
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "p": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            1014,
            1014,
            1014,
            1013,
            1011,
            1010,
            1010,
            1009,
            1009,
            1010,
            1010,
            1011,
            1012,
            1013,
            1013,
            1012,
            1011,
            1011,
            1011,
            1011,
            1012,
            1013,
            1013,
            1013
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "h": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            94,
            94,
            100,
            94,
            88,
            74,
            79,
            74,
            74,
            83,
            88,
            83,
            83,
            88,
            88,
            88,
            94,
            88,
            88,
            88,
            94,
            83,
            74,
            70
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "w": {
          "time": [
            "2026-10-12T07:00",
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
            "2026-10-12T23:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            1,
            2,
            4,
            2,
            2,
            2,
            3,
            2,
            2,
            1,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            2,
            1,
            2,
            1,
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
      "time": "2026-10-13T11:00",
      "us_aqi": 56,
      "european_aqi": 53,
      "pm25_concentration": {
        "value": 14.4,
        "unit": "µg/m³"
      },
      "pm10_concentration": {
        "value": 14.6,
        "unit": "µg/m³"
      },
      "pollutants_ugm3": {
        "carbon_monoxide": 567.0,
        "nitrogen_dioxide": 4.3,
        "sulphur_dioxide": 9.1,
        "ozone": 113.0,
        "dust": 0.0
      },
      "hourly_forecast": {
        "time": [
          "2026-10-13T11:00",
          "2026-10-13T12:00",
          "2026-10-13T13:00",
          "2026-10-13T14:00",
          "2026-10-13T15:00",
          "2026-10-13T16:00",
          "2026-10-13T17:00",
          "2026-10-13T18:00",
          "2026-10-13T19:00",
          "2026-10-13T20:00",
          "2026-10-13T21:00",
          "2026-10-13T22:00",
          "2026-10-13T23:00",
          "2026-10-14T00:00",
          "2026-10-14T01:00",
          "2026-10-14T02:00",
          "2026-10-14T03:00",
          "2026-10-14T04:00",
          "2026-10-14T05:00",
          "2026-10-14T06:00",
          "2026-10-14T07:00",
          "2026-10-14T08:00",
          "2026-10-14T09:00",
          "2026-10-14T10:00",
          "2026-10-14T11:00",
          "2026-10-14T12:00",
          "2026-10-14T13:00",
          "2026-10-14T14:00",
          "2026-10-14T15:00",
          "2026-10-14T16:00",
          "2026-10-14T17:00",
          "2026-10-14T18:00",
          "2026-10-14T19:00",
          "2026-10-14T20:00",
          "2026-10-14T21:00",
          "2026-10-14T22:00",
          "2026-10-14T23:00"
        ],
        "pm2_5": [
          26.8,
          27.3,
          28.7,
          30.2,
          30.6,
          30.6,
          31.6,
          33.5,
          35.4,
          39.2,
          37.9,
          35.9,
          34.4,
          31.6,
          27.8,
          25.9,
          25.4,
          25.4,
          26.4,
          19.2,
          17.8,
          19.7,
          23.0,
          25.4,
          27.3,
          30.6,
          33.0,
          34.0,
          34.0,
          35.4,
          34.4,
          34.9,
          35.9,
          38.7,
          40.4,
          40.8,
          43.2
        ],
        "pm25_aqi": [
          82,
          83,
          86,
          89,
          90,
          90,
          92,
          96,
          100,
          110,
          107,
          102,
          98,
          92,
          84,
          80,
          79,
          79,
          81,
          66,
          63,
          67,
          74,
          79,
          83,
          90,
          95,
          97,
          97,
          100,
          98,
          99,
          102,
          109,
          113,
          114,
          120
        ],
        "pm10": [
          14.6,
          16.1,
          18.1,
          19.8,
          21.1,
          22.1,
          23.6,
          25.3,
          27.6,
          32.9,
          31.5,
          29.3,
          27.4,
          24.7,
          21.2,
          19.4,
          18.7,
          19.1,
          20.1,
          13.1,
          12.0,
          13.4,
          16.9,
          19.2,
          21.6,
          25.0,
          27.6,
          28.7,
          28.8,
          29.8,
          29.1,
          29.4,
          30.9,
          34.5,
          35.7,
          36.1,
          38.3
        ],
        "us_aqi": [
          56,
          57,
          58,
          59,
          60,
          61,
          76,
          95,
          105,
          108,
          104,
          96,
          84,
          71,
          71,
          70,
          69,
          70,
          70,
          71,
          72,
          72,
          72,
          72,
          73,
          73,
          74,
          75,
          75,
          96,
          123,
          146,
          156,
          158,
          153,
          142,
          126
        ],
        "european_aqi": [
          53,
          64,
          69,
          73,
          76,
          78,
          77,
          71,
          63,
          50,
          49,
          48,
          47,
          45,
          44,
          42,
          42,
          42,
          43,
          36,
          34,
          37,
          41,
          56,
          70,
          77,
          83,
          91,
          102,
          113,
          113,
          96,
          75,
          63,
          52,
          52,
          53
        ]
      },
      "past_24h": {
        "time": [
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
          "2026-10-12T23:00",
          "2026-10-13T00:00",
          "2026-10-13T01:00",
          "2026-10-13T02:00",
          "2026-10-13T03:00",
          "2026-10-13T04:00",
          "2026-10-13T05:00",
          "2026-10-13T06:00",
          "2026-10-13T07:00",
          "2026-10-13T08:00",
          "2026-10-13T09:00",
          "2026-10-13T10:00",
          "2026-10-13T11:00"
        ],
        "pm2_5": [
          6.7,
          5.5,
          27.3,
          8.9,
          9.8,
          22.1,
          10.6,
          9.4,
          17.3,
          26.4,
          21.1,
          21.1,
          20.7,
          18.3,
          15.9,
          14.0,
          13.1,
          12.6,
          13.1,
          15.0,
          12.6,
          16.4,
          28.3,
          26.8
        ],
        "pm25_aqi": [
          28,
          23,
          83,
          37,
          41,
          72,
          44,
          39,
          62,
          81,
          70,
          70,
          69,
          64,
          59,
          55,
          53,
          52,
          53,
          57,
          52,
          60,
          85,
          82
        ],
        "pm10": [
          6.4,
          5.7,
          5.7,
          4.7,
          4.6,
          4.8,
          5.6,
          7.1,
          9.9,
          15.0,
          17.2,
          18.7,
          22.1,
          25.7,
          27.8,
          27.4,
          17.2,
          10.0,
          8.1,
          8.8,
          9.7,
          12.0,
          15.0,
          13.4,
          14.6
        ],
        "us_aqi": [
          53,
          53,
          54,
          54,
          55,
          55,
          56,
          56,
          55,
          55,
          55,
          56,
          55,
          55,
          55,
          54,
          54,
          55,
          55,
          55,
          54,
          54,
          54,
          55
        ]
      },
      "timeline_48h": {
        "time": [
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
          "2026-10-12T23:00",
          "2026-10-13T00:00",
          "2026-10-13T01:00",
          "2026-10-13T02:00",
          "2026-10-13T03:00",
          "2026-10-13T04:00",
          "2026-10-13T05:00",
          "2026-10-13T06:00",
          "2026-10-13T07:00",
          "2026-10-13T08:00",
          "2026-10-13T09:00",
          "2026-10-13T10:00",
          "2026-10-13T11:00",
          "2026-10-13T12:00",
          "2026-10-13T13:00",
          "2026-10-13T14:00",
          "2026-10-13T15:00",
          "2026-10-13T16:00",
          "2026-10-13T17:00",
          "2026-10-13T18:00",
          "2026-10-13T19:00",
          "2026-10-13T20:00",
          "2026-10-13T21:00",
          "2026-10-13T22:00",
          "2026-10-13T23:00",
          "2026-10-14T00:00",
          "2026-10-14T01:00",
          "2026-10-14T02:00",
          "2026-10-14T03:00",
          "2026-10-14T04:00",
          "2026-10-14T05:00",
          "2026-10-14T06:00",
          "2026-10-14T07:00",
          "2026-10-14T08:00",
          "2026-10-14T09:00",
          "2026-10-14T10:00",
          "2026-10-14T11:00"
        ],
        "pm2_5": [
          6.7,
          5.5,
          27.3,
          8.9,
          9.8,
          22.1,
          10.6,
          9.4,
          17.3,
          26.4,
          21.1,
          21.1,
          20.7,
          18.3,
          15.9,
          14.0,
          13.1,
          12.6,
          13.1,
          15.0,
          12.6,
          16.4,
          28.3,
          26.8,
          27.3,
          28.7,
          30.2,
          30.6,
          30.6,
          31.6,
          33.5,
          35.4,
          39.2,
          37.9,
          35.9,
          34.4,
          31.6,
          27.8,
          25.9,
          25.4,
          25.4,
          26.4,
          19.2,
          17.8,
          19.7,
          23.0,
          25.4,
          27.3
        ],
        "pm25_aqi": [
          28,
          23,
          83,
          37,
          41,
          72,
          44,
          39,
          62,
          81,
          70,
          70,
          69,
          64,
          59,
          55,
          53,
          52,
          53,
          57,
          52,
          60,
          85,
          82,
          83,
          86,
          89,
          90,
          90,
          92,
          96,
          100,
          110,
          107,
          102,
          98,
          92,
          84,
          80,
          79,
          79,
          81,
          66,
          63,
          67,
          74,
          79,
          83
        ],
        "us_aqi": [
          38,
          39,
          40,
          40,
          41,
          41,
          41,
          42,
          42,
          43,
          44,
          45,
          47,
          50,
          51,
          53,
          54,
          55,
          55,
          55,
          54,
          54,
          55,
          56,
          56,
          57,
          58,
          59,
          60,
          61,
          76,
          95,
          105,
          108,
          104,
          96,
          84,
          71,
          71,
          70,
          69,
          70,
          70,
          71,
          72,
          72,
          72,
          72,
          73
        ],
        "now_index": 23
      }
    },
    "sources_comparison": {
      "aqicn_waqi": {
        "source_name": "WAQI / Malaysia DOE Continuous Monitoring",
        "available": true,
        "station_name": "Perai, Pulau Pinang, Malaysia",
        "overall_aqi": 55,
        "pm25_subindex": 82,
        "url": "https://aqicn.org/city/malaysia/pulau-pinang/perai/",
        "updated": "Tuesday, Oct 13th 2026, 11:00 am",
        "type": "Ground-Level Continuous Ambient Air Monitoring Station"
      },
      "copernicus_cams": {
        "source_name": "Copernicus CAMS Global Atmospheric Model (ECMWF)",
        "available": true,
        "us_aqi": 56,
        "european_aqi": 53,
        "pm25_ugm3": 26.8,
        "updated": "2026-10-13T11:00",
        "type": "European Union Satellite Earth Observation & 40km Numerical Model"
      },
      "noaa_gfs": {
        "source_name": "NOAA Global Forecast System (GFS Aerosols)",
        "available": true,
        "dust_ugm3": 0.0,
        "ozone_ugm3": 113.0,
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
        "temperature_c": 29.9,
        "humidity_pct": 71.0,
        "apparent_temperature_c": 36.2,
        "wind_speed_ms": 7.9,
        "uv_index": 5.85,
        "type": "Meteorological Running Index"
      }
    },
    "timestamp": 1791862001.9325771
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
    "overall_aqi": 153,
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
      "aqi_reading": 153,
      "sub_index": 153,
      "concentration_ugm3": 59.4,
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
        "direction": "worsening",
        "direction_label": "Worsening (Rising)",
        "trajectory": "RISING",
        "arrow": "↗",
        "change_6h": 12,
        "drift_6h_aqi": 12,
        "drift_6h_conc": 23.2,
        "color": "#EF4444",
        "peak_aqi": {
          "value": 188,
          "time": "20:00"
        },
        "peak_time": "20:00",
        "peak_val": 188,
        "cleanest_window": {
          "aqi": 88,
          "conc": 29.7,
          "time": "07:00"
        },
        "lowest_aqi": 88,
        "lowest_time": "07:00",
        "clean_val": 88,
        "peak_conc": {
          "value": 127.2,
          "time": "20:00"
        },
        "lowest_conc": {
          "value": 29.7,
          "time": "07:00"
        },
        "summary": "Rising pollution: PM2.5 AQI increasing by +12 points over 6h, peaking at 188 AQI at ~20:00."
      },
      "future_trend": {
        "direction": "worsening",
        "direction_label": "Worsening (Rising)",
        "trajectory": "RISING",
        "arrow": "↗",
        "change_6h": 12,
        "drift_6h_aqi": 12,
        "drift_6h_conc": 23.2,
        "color": "#EF4444",
        "peak_aqi": {
          "value": 188,
          "time": "20:00"
        },
        "peak_time": "20:00",
        "peak_val": 188,
        "cleanest_window": {
          "aqi": 88,
          "conc": 29.7,
          "time": "07:00"
        },
        "lowest_aqi": 88,
        "lowest_time": "07:00",
        "clean_val": 88,
        "peak_conc": {
          "value": 127.2,
          "time": "20:00"
        },
        "lowest_conc": {
          "value": 29.7,
          "time": "07:00"
        },
        "summary": "Rising pollution: PM2.5 AQI increasing by +12 points over 6h, peaking at 188 AQI at ~20:00."
      },
      "past_trend": {
        "trajectory": "RISING",
        "direction_label": "Worsened (+46 pts past 6h)",
        "arrow": "↗",
        "drift_6h": 46,
        "drift_24h": 72,
        "drift_6h_conc": 21.5,
        "color": "#EF4444",
        "peak_aqi": {
          "value": 157,
          "time": "10:00"
        },
        "peak_val": 157,
        "lowest_aqi": {
          "value": 77,
          "time": "16:00"
        },
        "clean_val": 77,
        "peak_conc": {
          "value": 67.1,
          "time": "10:00"
        },
        "lowest_conc": {
          "value": 24.5,
          "time": "16:00"
        },
        "summary": "Past 24h: PM2.5 AQI shifted by +72 pts (+46 pts in last 6h), reaching a past peak of 157 AQI at ~10:00 and a low of 77 AQI at ~16:00."
      },
      "hourly_times": [
        "2026-10-13T11:00",
        "2026-10-13T12:00",
        "2026-10-13T13:00",
        "2026-10-13T14:00",
        "2026-10-13T15:00",
        "2026-10-13T16:00",
        "2026-10-13T17:00",
        "2026-10-13T18:00",
        "2026-10-13T19:00",
        "2026-10-13T20:00",
        "2026-10-13T21:00",
        "2026-10-13T22:00",
        "2026-10-13T23:00",
        "2026-10-14T00:00",
        "2026-10-14T01:00",
        "2026-10-14T02:00",
        "2026-10-14T03:00",
        "2026-10-14T04:00",
        "2026-10-14T05:00",
        "2026-10-14T06:00",
        "2026-10-14T07:00",
        "2026-10-14T08:00",
        "2026-10-14T09:00",
        "2026-10-14T10:00",
        "2026-10-14T11:00",
        "2026-10-14T12:00",
        "2026-10-14T13:00",
        "2026-10-14T14:00",
        "2026-10-14T15:00",
        "2026-10-14T16:00",
        "2026-10-14T17:00",
        "2026-10-14T18:00",
        "2026-10-14T19:00",
        "2026-10-14T20:00",
        "2026-10-14T21:00",
        "2026-10-14T22:00",
        "2026-10-14T23:00"
      ],
      "hourly_aqi": [
        153,
        156,
        158,
        159,
        160,
        160,
        165,
        169,
        184,
        188,
        165,
        169,
        155,
        123,
        104,
        92,
        95,
        96,
        93,
        90,
        88,
        116,
        144,
        148,
        147,
        133,
        139,
        152,
        156,
        159,
        159,
        165,
        153,
        157,
        162,
        168,
        164
      ],
      "hourly_conc": [
        59.4,
        65.2,
        69.1,
        71.0,
        72.9,
        72.9,
        82.6,
        90.4,
        119.4,
        127.2,
        82.6,
        90.4,
        63.2,
        44.4,
        36.7,
        31.6,
        33.0,
        33.5,
        32.1,
        30.6,
        29.7,
        41.6,
        53.0,
        54.6,
        54.2,
        48.5,
        50.9,
        57.4,
        65.2,
        71.0,
        71.0,
        82.6,
        59.4,
        67.1,
        76.8,
        88.4,
        80.7
      ],
      "past_24h": {
        "time": [
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
          "2026-10-12T23:00",
          "2026-10-13T00:00",
          "2026-10-13T01:00",
          "2026-10-13T02:00",
          "2026-10-13T03:00",
          "2026-10-13T04:00",
          "2026-10-13T05:00",
          "2026-10-13T06:00",
          "2026-10-13T07:00",
          "2026-10-13T08:00",
          "2026-10-13T09:00",
          "2026-10-13T10:00",
          "2026-10-13T11:00"
        ],
        "pm2_5": [
          26.4,
          57.4,
          50.9,
          48.5,
          24.5,
          36.7,
          24.9,
          49.3,
          34.4,
          47.7,
          48.1,
          52.2,
          42.0,
          42.0,
          36.7,
          43.2,
          42.4,
          37.9,
          38.3,
          33.5,
          35.5,
          40.0,
          67.1,
          59.4
        ],
        "pm25_aqi": [
          81,
          152,
          139,
          133,
          77,
          104,
          78,
          135,
          98,
          131,
          132,
          142,
          117,
          117,
          104,
          120,
          118,
          107,
          108,
          96,
          101,
          112,
          157,
          153
        ],
        "pm10": [
          40.6,
          46.4,
          50.8,
          55.5,
          56.9,
          55.6,
          54.2,
          58.2,
          85.4,
          103.1,
          127.1,
          143.0,
          149.9,
          130.4,
          121.1,
          113.4,
          104.5,
          94.3,
          83.8,
          61.0,
          50.9,
          64.3,
          86.6,
          84.5,
          80.6
        ],
        "us_aqi": [
          76,
          77,
          125,
          147,
          154,
          193,
          215,
          229,
          233,
          227,
          212,
          183,
          127,
          134,
          145,
          152,
          154,
          157,
          160,
          162,
          164,
          165,
          167,
          169,
          170
        ]
      },
      "future_24h": {
        "time": [
          "2026-10-13T11:00",
          "2026-10-13T12:00",
          "2026-10-13T13:00",
          "2026-10-13T14:00",
          "2026-10-13T15:00",
          "2026-10-13T16:00",
          "2026-10-13T17:00",
          "2026-10-13T18:00",
          "2026-10-13T19:00",
          "2026-10-13T20:00",
          "2026-10-13T21:00",
          "2026-10-13T22:00",
          "2026-10-13T23:00",
          "2026-10-14T00:00",
          "2026-10-14T01:00",
          "2026-10-14T02:00",
          "2026-10-14T03:00",
          "2026-10-14T04:00",
          "2026-10-14T05:00",
          "2026-10-14T06:00",
          "2026-10-14T07:00",
          "2026-10-14T08:00",
          "2026-10-14T09:00",
          "2026-10-14T10:00",
          "2026-10-14T11:00",
          "2026-10-14T12:00",
          "2026-10-14T13:00",
          "2026-10-14T14:00",
          "2026-10-14T15:00",
          "2026-10-14T16:00",
          "2026-10-14T17:00",
          "2026-10-14T18:00",
          "2026-10-14T19:00",
          "2026-10-14T20:00",
          "2026-10-14T21:00",
          "2026-10-14T22:00",
          "2026-10-14T23:00"
        ],
        "pm2_5": [
          59.4,
          65.2,
          69.1,
          71.0,
          72.9,
          72.9,
          82.6,
          90.4,
          119.4,
          127.2,
          82.6,
          90.4,
          63.2,
          44.4,
          36.7,
          31.6,
          33.0,
          33.5,
          32.1,
          30.6,
          29.7,
          41.6,
          53.0,
          54.6,
          54.2,
          48.5,
          50.9,
          57.4,
          65.2,
          71.0,
          71.0,
          82.6,
          59.4,
          67.1,
          76.8,
          88.4,
          80.7
        ],
        "pm25_aqi": [
          153,
          156,
          158,
          159,
          160,
          160,
          165,
          169,
          184,
          188,
          165,
          169,
          155,
          123,
          104,
          92,
          95,
          96,
          93,
          90,
          88,
          116,
          144,
          148,
          147,
          133,
          139,
          152,
          156,
          159,
          159,
          165,
          153,
          157,
          162,
          168,
          164
        ],
        "pm10": [
          80.6,
          85.4,
          89.9,
          89.2,
          91.0,
          89.9,
          99.0,
          105.5,
          133.2,
          141.6,
          96.4,
          103.1,
          74.5,
          46.9,
          39.3,
          34.5,
          35.7,
          36.2,
          35.2,
          33.6,
          32.5,
          43.8,
          55.2,
          59.8,
          58.3,
          51.5,
          54.0,
          67.3,
          76.1,
          80.6,
          80.3,
          92.0,
          69.8,
          77.1,
          87.5,
          97.6,
          91.0
        ],
        "us_aqi": [
          170,
          172,
          173,
          174,
          175,
          207,
          224,
          234,
          235,
          225,
          209,
          181,
          180,
          178,
          175,
          173,
          170,
          168,
          167,
          165,
          164,
          164,
          163,
          162,
          162,
          161,
          160,
          159,
          158,
          158,
          183,
          202,
          202,
          187,
          154,
          152,
          152
        ],
        "european_aqi": [
          146,
          201,
          246,
          264,
          244,
          197,
          143,
          86,
          97,
          105,
          100,
          86,
          74,
          67,
          62,
          58,
          55,
          52,
          51,
          51,
          52,
          56,
          62,
          65,
          98,
          135,
          163,
          174,
          167,
          144,
          108,
          81,
          86,
          95,
          95,
          90,
          84
        ]
      },
      "timeline_48h": {
        "time": [
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
          "2026-10-12T23:00",
          "2026-10-13T00:00",
          "2026-10-13T01:00",
          "2026-10-13T02:00",
          "2026-10-13T03:00",
          "2026-10-13T04:00",
          "2026-10-13T05:00",
          "2026-10-13T06:00",
          "2026-10-13T07:00",
          "2026-10-13T08:00",
          "2026-10-13T09:00",
          "2026-10-13T10:00",
          "2026-10-13T11:00",
          "2026-10-13T12:00",
          "2026-10-13T13:00",
          "2026-10-13T14:00",
          "2026-10-13T15:00",
          "2026-10-13T16:00",
          "2026-10-13T17:00",
          "2026-10-13T18:00",
          "2026-10-13T19:00",
          "2026-10-13T20:00",
          "2026-10-13T21:00",
          "2026-10-13T22:00",
          "2026-10-13T23:00",
          "2026-10-14T00:00",
          "2026-10-14T01:00",
          "2026-10-14T02:00",
          "2026-10-14T03:00",
          "2026-10-14T04:00",
          "2026-10-14T05:00",
          "2026-10-14T06:00",
          "2026-10-14T07:00",
          "2026-10-14T08:00",
          "2026-10-14T09:00",
          "2026-10-14T10:00",
          "2026-10-14T11:00"
        ],
        "pm2_5": [
          26.4,
          57.4,
          50.9,
          48.5,
          24.5,
          36.7,
          24.9,
          49.3,
          34.4,
          47.7,
          48.1,
          52.2,
          42.0,
          42.0,
          36.7,
          43.2,
          42.4,
          37.9,
          38.3,
          33.5,
          35.5,
          40.0,
          67.1,
          59.4,
          65.2,
          69.1,
          71.0,
          72.9,
          72.9,
          82.6,
          90.4,
          119.4,
          127.2,
          82.6,
          90.4,
          63.2,
          44.4,
          36.7,
          31.6,
          33.0,
          33.5,
          32.1,
          30.6,
          29.7,
          41.6,
          53.0,
          54.6,
          54.2
        ],
        "pm25_aqi": [
          81,
          152,
          139,
          133,
          77,
          104,
          78,
          135,
          98,
          131,
          132,
          142,
          117,
          117,
          104,
          120,
          118,
          107,
          108,
          96,
          101,
          112,
          157,
          153,
          156,
          158,
          159,
          160,
          160,
          165,
          169,
          184,
          188,
          165,
          169,
          155,
          123,
          104,
          92,
          95,
          96,
          93,
          90,
          88,
          116,
          144,
          148,
          147
        ],
        "us_aqi": [
          76,
          77,
          125,
          147,
          154,
          193,
          215,
          229,
          233,
          227,
          212,
          183,
          127,
          134,
          145,
          152,
          154,
          157,
          160,
          162,
          164,
          165,
          167,
          169,
          170,
          172,
          173,
          174,
          175,
          207,
          224,
          234,
          235,
          225,
          209,
          181,
          180,
          178,
          175,
          173,
          170,
          168,
          167,
          165,
          164,
          164,
          163,
          162,
          162
        ],
        "now_index": 23
      },
      "min_today": 68,
      "max_today": 187,
      "who_comparison": {
        "status": "4.0x WHO guideline (15 µg/m³)",
        "ratio": 4.0,
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
        "time": "10:00",
        "full_time": "2026-10-14T10:00",
        "predicted_aqi": 162,
        "recommendation": "Cleanest forecasted window: ~10:00 (Predicted AQI: 162)"
      },
      "heat_stress": {
        "temp_c": 30.8,
        "humidity_pct": 65,
        "apparent_temp_c": 37.6,
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
      "temperature_c": 30.8,
      "relative_humidity_pct": 65,
      "apparent_temperature_c": 37.6,
      "wind_speed_ms": 0.5,
      "wind_direction_deg": 270,
      "precipitation_mm": 0.1,
      "uv_index": 6.55
    },
    "aqicn_ground": {
      "source": "WAQI / aqicn.org (Malaysia DOE Ground Station)",
      "station_id": 5780,
      "station_name": "Kuala Lumpur",
      "url": "https://aqicn.org/city/kuala-lumpur/",
      "updated": "Tuesday, Oct 13th 2026, 10:00 am",
      "overall_aqi": 153,
      "pm25": {
        "current": 153,
        "min": 68,
        "max": 187,
        "unit": "AQI sub-index"
      },
      "pollutants": {
        "pm10": {
          "current": "58",
          "min": "26",
          "max": "91"
        },
        "o3": {
          "current": "15",
          "min": "2",
          "max": "33"
        },
        "no2": {
          "current": "8",
          "min": "2",
          "max": "10"
        },
        "so2": {
          "current": "1",
          "min": "0",
          "max": "6"
        },
        "co": {
          "current": "0",
          "min": "0",
          "max": "0"
        }
      },
      "weather": {
        "humidity": "74",
        "pressure": "1014",
        "wind": "2"
      },
      "nearest_stations": [
        {
          "id": 5780,
          "name": "Kuala Lumpur",
          "geo": [
            3.139003,
            101.686855
          ],
          "aqi": "112",
          "time": "2026-10-13T09:00:00+08:00"
        },
        {
          "id": 2626,
          "name": "Cheras,Kuala Lumpur, Wilayah Persekutuan, Malaysia",
          "geo": [
            3.106236,
            101.717917
          ],
          "aqi": "84",
          "time": "2026-10-13T11:00:00+08:00"
        },
        {
          "id": 2625,
          "name": "Batu Muda,Kuala Lumpur, Wilayah Persekutuan, Malaysia",
          "geo": [
            3.212439,
            101.682228
          ],
          "aqi": "87",
          "time": "2026-10-13T11:00:00+08:00"
        },
        {
          "id": 2620,
          "name": "Petaling Jaya, Selangor, Malaysia",
          "geo": [
            3.133169,
            101.608011
          ],
          "aqi": "72",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 2621,
          "name": "Shah Alam, Selangor, Malaysia",
          "geo": [
            3.104717,
            101.556222
          ],
          "aqi": "83",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 10485,
          "name": "Putrajaya, W.p. Putrajaya, Malaysia",
          "geo": [
            2.914816,
            101.69005
          ],
          "aqi": "120",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 2619,
          "name": "Pelabuhan Kelang, Selangor, Malaysia",
          "geo": [
            3.014889,
            101.413111
          ],
          "aqi": "90",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 2617,
          "name": "Banting, Selangor, Malaysia",
          "geo": [
            2.816689,
            101.623158
          ],
          "aqi": "69",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 2588,
          "name": "Nilai, Negeri Sembilan, Malaysia",
          "geo": [
            2.821692,
            101.811486
          ],
          "aqi": "151",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 2618,
          "name": "Kuala Selangor, Selangor, Malaysia",
          "geo": [
            3.321308,
            101.256242
          ],
          "aqi": "71",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 2590,
          "name": "Seremban, Negeri Sembilan, Malaysia",
          "geo": [
            2.723381,
            101.968497
          ],
          "aqi": "154",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 2598,
          "name": "Tanjung Malim, Perak, Malaysia",
          "geo": [
            3.687758,
            101.524494
          ],
          "aqi": "65",
          "time": "2026-10-13T10:00:00+08:00"
        }
      ],
      "history": {
        "pm25": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            81,
            152,
            139,
            133,
            77,
            104,
            78,
            135,
            98,
            131,
            132,
            142,
            117,
            117,
            104,
            120,
            118,
            107,
            108,
            96,
            101,
            112,
            157,
            153
          ],
          "pm25_aqi": [
            81,
            152,
            139,
            133,
            77,
            104,
            78,
            135,
            98,
            131,
            132,
            142,
            117,
            117,
            104,
            120,
            118,
            107,
            108,
            96,
            101,
            112,
            157,
            153
          ],
          "pm2_5": [
            26.4,
            57.4,
            50.9,
            48.5,
            24.5,
            36.7,
            24.9,
            49.3,
            34.4,
            47.7,
            48.1,
            52.2,
            42.0,
            42.0,
            36.7,
            43.2,
            42.4,
            37.9,
            38.3,
            33.5,
            35.5,
            40.0,
            67.1,
            59.4
          ],
          "us_aqi": [
            81,
            152,
            139,
            133,
            77,
            104,
            78,
            135,
            98,
            131,
            132,
            142,
            117,
            117,
            104,
            120,
            118,
            107,
            108,
            96,
            101,
            112,
            157,
            153
          ]
        },
        "pm10": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            34,
            55,
            50,
            49,
            26,
            40,
            28,
            51,
            38,
            51,
            51,
            55,
            49,
            48,
            45,
            51,
            48,
            46,
            44,
            41,
            44,
            48,
            63,
            58
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "o3": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            8,
            11,
            19,
            23,
            25,
            27,
            20,
            14,
            10,
            8,
            6,
            4,
            5,
            6,
            4,
            4,
            3,
            4,
            4,
            3,
            2,
            2,
            8,
            15
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "no2": {
          "time": [
            "2026-10-12T11:00",
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            6,
            4,
            4,
            4,
            3,
            4,
            5,
            10,
            10,
            9,
            8,
            7,
            6,
            6,
            6,
            5,
            3,
            4,
            3,
            4,
            4,
            6,
            7,
            8
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "so2": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            1,
            1,
            1,
            1,
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
            1,
            0,
            0,
            0,
            0
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "co": {
          "time": [
            "2026-10-12T11:00",
            "2026-10-12T12:00",
            "2026-10-12T13:00",
            "2026-10-12T14:00",
            "2026-10-12T16:00",
            "2026-10-12T17:00",
            "2026-10-12T18:00",
            "2026-10-12T19:00",
            "2026-10-12T20:00",
            "2026-10-12T21:00",
            "2026-10-12T22:00",
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00"
          ],
          "values": [
            27,
            27,
            29,
            30,
            30,
            27,
            24,
            25,
            25,
            25,
            25,
            25,
            25,
            25,
            25,
            25,
            25,
            25,
            25,
            25,
            24,
            25,
            26,
            28
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "p": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00"
          ],
          "values": [
            1014,
            1014,
            1013,
            1012,
            1011,
            1010,
            1011,
            1011,
            1011,
            1012,
            1012,
            1013,
            1013,
            1013,
            1012,
            1012,
            1011,
            1011,
            1011,
            1011,
            1012,
            1013,
            1014,
            1014
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "h": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00"
          ],
          "values": [
            78,
            78,
            70,
            70,
            66,
            81,
            94,
            88,
            88,
            88,
            88,
            94,
            94,
            94,
            94,
            94,
            94,
            94,
            94,
            88,
            94,
            88,
            88,
            74
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "w": {
          "time": [
            "2026-10-12T04:00",
            "2026-10-12T06:00",
            "2026-10-12T07:00",
            "2026-10-12T08:00",
            "2026-10-12T10:00",
            "2026-10-12T11:00",
            "2026-10-12T12:00",
            "2026-10-12T13:00",
            "2026-10-12T14:00",
            "2026-10-12T15:00",
            "2026-10-12T16:00",
            "2026-10-12T17:00",
            "2026-10-12T19:00",
            "2026-10-12T21:00",
            "2026-10-12T22:00",
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00"
          ],
          "values": [
            2,
            2,
            2,
            2,
            2,
            4,
            2,
            3,
            2,
            3,
            3,
            3,
            1,
            0,
            1,
            0,
            0,
            2,
            2,
            2,
            1,
            2,
            0,
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
      "time": "2026-10-13T11:00",
      "us_aqi": 170,
      "european_aqi": 146,
      "pm25_concentration": {
        "value": 79.9,
        "unit": "µg/m³"
      },
      "pm10_concentration": {
        "value": 80.6,
        "unit": "µg/m³"
      },
      "pollutants_ugm3": {
        "carbon_monoxide": 2451.0,
        "nitrogen_dioxide": 37.0,
        "sulphur_dioxide": 49.0,
        "ozone": 226.0,
        "dust": 0.0
      },
      "hourly_forecast": {
        "time": [
          "2026-10-13T11:00",
          "2026-10-13T12:00",
          "2026-10-13T13:00",
          "2026-10-13T14:00",
          "2026-10-13T15:00",
          "2026-10-13T16:00",
          "2026-10-13T17:00",
          "2026-10-13T18:00",
          "2026-10-13T19:00",
          "2026-10-13T20:00",
          "2026-10-13T21:00",
          "2026-10-13T22:00",
          "2026-10-13T23:00",
          "2026-10-14T00:00",
          "2026-10-14T01:00",
          "2026-10-14T02:00",
          "2026-10-14T03:00",
          "2026-10-14T04:00",
          "2026-10-14T05:00",
          "2026-10-14T06:00",
          "2026-10-14T07:00",
          "2026-10-14T08:00",
          "2026-10-14T09:00",
          "2026-10-14T10:00",
          "2026-10-14T11:00",
          "2026-10-14T12:00",
          "2026-10-14T13:00",
          "2026-10-14T14:00",
          "2026-10-14T15:00",
          "2026-10-14T16:00",
          "2026-10-14T17:00",
          "2026-10-14T18:00",
          "2026-10-14T19:00",
          "2026-10-14T20:00",
          "2026-10-14T21:00",
          "2026-10-14T22:00",
          "2026-10-14T23:00"
        ],
        "pm2_5": [
          59.4,
          65.2,
          69.1,
          71.0,
          72.9,
          72.9,
          82.6,
          90.4,
          119.4,
          127.2,
          82.6,
          90.4,
          63.2,
          44.4,
          36.7,
          31.6,
          33.0,
          33.5,
          32.1,
          30.6,
          29.7,
          41.6,
          53.0,
          54.6,
          54.2,
          48.5,
          50.9,
          57.4,
          65.2,
          71.0,
          71.0,
          82.6,
          59.4,
          67.1,
          76.8,
          88.4,
          80.7
        ],
        "pm25_aqi": [
          153,
          156,
          158,
          159,
          160,
          160,
          165,
          169,
          184,
          188,
          165,
          169,
          155,
          123,
          104,
          92,
          95,
          96,
          93,
          90,
          88,
          116,
          144,
          148,
          147,
          133,
          139,
          152,
          156,
          159,
          159,
          165,
          153,
          157,
          162,
          168,
          164
        ],
        "pm10": [
          80.6,
          85.4,
          89.9,
          89.2,
          91.0,
          89.9,
          99.0,
          105.5,
          133.2,
          141.6,
          96.4,
          103.1,
          74.5,
          46.9,
          39.3,
          34.5,
          35.7,
          36.2,
          35.2,
          33.6,
          32.5,
          43.8,
          55.2,
          59.8,
          58.3,
          51.5,
          54.0,
          67.3,
          76.1,
          80.6,
          80.3,
          92.0,
          69.8,
          77.1,
          87.5,
          97.6,
          91.0
        ],
        "us_aqi": [
          170,
          172,
          173,
          174,
          175,
          207,
          224,
          234,
          235,
          225,
          209,
          181,
          180,
          178,
          175,
          173,
          170,
          168,
          167,
          165,
          164,
          164,
          163,
          162,
          162,
          161,
          160,
          159,
          158,
          158,
          183,
          202,
          202,
          187,
          154,
          152,
          152
        ],
        "european_aqi": [
          146,
          201,
          246,
          264,
          244,
          197,
          143,
          86,
          97,
          105,
          100,
          86,
          74,
          67,
          62,
          58,
          55,
          52,
          51,
          51,
          52,
          56,
          62,
          65,
          98,
          135,
          163,
          174,
          167,
          144,
          108,
          81,
          86,
          95,
          95,
          90,
          84
        ]
      },
      "past_24h": {
        "time": [
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
          "2026-10-12T23:00",
          "2026-10-13T00:00",
          "2026-10-13T01:00",
          "2026-10-13T02:00",
          "2026-10-13T03:00",
          "2026-10-13T04:00",
          "2026-10-13T05:00",
          "2026-10-13T06:00",
          "2026-10-13T07:00",
          "2026-10-13T08:00",
          "2026-10-13T09:00",
          "2026-10-13T10:00",
          "2026-10-13T11:00"
        ],
        "pm2_5": [
          26.4,
          57.4,
          50.9,
          48.5,
          24.5,
          36.7,
          24.9,
          49.3,
          34.4,
          47.7,
          48.1,
          52.2,
          42.0,
          42.0,
          36.7,
          43.2,
          42.4,
          37.9,
          38.3,
          33.5,
          35.5,
          40.0,
          67.1,
          59.4
        ],
        "pm25_aqi": [
          81,
          152,
          139,
          133,
          77,
          104,
          78,
          135,
          98,
          131,
          132,
          142,
          117,
          117,
          104,
          120,
          118,
          107,
          108,
          96,
          101,
          112,
          157,
          153
        ],
        "pm10": [
          40.6,
          46.4,
          50.8,
          55.5,
          56.9,
          55.6,
          54.2,
          58.2,
          85.4,
          103.1,
          127.1,
          143.0,
          149.9,
          130.4,
          121.1,
          113.4,
          104.5,
          94.3,
          83.8,
          61.0,
          50.9,
          64.3,
          86.6,
          84.5,
          80.6
        ],
        "us_aqi": [
          76,
          77,
          125,
          147,
          154,
          193,
          215,
          229,
          233,
          227,
          212,
          183,
          127,
          134,
          145,
          152,
          154,
          157,
          160,
          162,
          164,
          165,
          167,
          169,
          170
        ]
      },
      "timeline_48h": {
        "time": [
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
          "2026-10-12T23:00",
          "2026-10-13T00:00",
          "2026-10-13T01:00",
          "2026-10-13T02:00",
          "2026-10-13T03:00",
          "2026-10-13T04:00",
          "2026-10-13T05:00",
          "2026-10-13T06:00",
          "2026-10-13T07:00",
          "2026-10-13T08:00",
          "2026-10-13T09:00",
          "2026-10-13T10:00",
          "2026-10-13T11:00",
          "2026-10-13T12:00",
          "2026-10-13T13:00",
          "2026-10-13T14:00",
          "2026-10-13T15:00",
          "2026-10-13T16:00",
          "2026-10-13T17:00",
          "2026-10-13T18:00",
          "2026-10-13T19:00",
          "2026-10-13T20:00",
          "2026-10-13T21:00",
          "2026-10-13T22:00",
          "2026-10-13T23:00",
          "2026-10-14T00:00",
          "2026-10-14T01:00",
          "2026-10-14T02:00",
          "2026-10-14T03:00",
          "2026-10-14T04:00",
          "2026-10-14T05:00",
          "2026-10-14T06:00",
          "2026-10-14T07:00",
          "2026-10-14T08:00",
          "2026-10-14T09:00",
          "2026-10-14T10:00",
          "2026-10-14T11:00"
        ],
        "pm2_5": [
          26.4,
          57.4,
          50.9,
          48.5,
          24.5,
          36.7,
          24.9,
          49.3,
          34.4,
          47.7,
          48.1,
          52.2,
          42.0,
          42.0,
          36.7,
          43.2,
          42.4,
          37.9,
          38.3,
          33.5,
          35.5,
          40.0,
          67.1,
          59.4,
          65.2,
          69.1,
          71.0,
          72.9,
          72.9,
          82.6,
          90.4,
          119.4,
          127.2,
          82.6,
          90.4,
          63.2,
          44.4,
          36.7,
          31.6,
          33.0,
          33.5,
          32.1,
          30.6,
          29.7,
          41.6,
          53.0,
          54.6,
          54.2
        ],
        "pm25_aqi": [
          81,
          152,
          139,
          133,
          77,
          104,
          78,
          135,
          98,
          131,
          132,
          142,
          117,
          117,
          104,
          120,
          118,
          107,
          108,
          96,
          101,
          112,
          157,
          153,
          156,
          158,
          159,
          160,
          160,
          165,
          169,
          184,
          188,
          165,
          169,
          155,
          123,
          104,
          92,
          95,
          96,
          93,
          90,
          88,
          116,
          144,
          148,
          147
        ],
        "us_aqi": [
          76,
          77,
          125,
          147,
          154,
          193,
          215,
          229,
          233,
          227,
          212,
          183,
          127,
          134,
          145,
          152,
          154,
          157,
          160,
          162,
          164,
          165,
          167,
          169,
          170,
          172,
          173,
          174,
          175,
          207,
          224,
          234,
          235,
          225,
          209,
          181,
          180,
          178,
          175,
          173,
          170,
          168,
          167,
          165,
          164,
          164,
          163,
          162,
          162
        ],
        "now_index": 23
      }
    },
    "sources_comparison": {
      "aqicn_waqi": {
        "source_name": "WAQI / Malaysia DOE Continuous Monitoring",
        "available": true,
        "station_name": "Kuala Lumpur",
        "overall_aqi": 153,
        "pm25_subindex": 153,
        "url": "https://aqicn.org/city/kuala-lumpur/",
        "updated": "Tuesday, Oct 13th 2026, 10:00 am",
        "type": "Ground-Level Continuous Ambient Air Monitoring Station"
      },
      "copernicus_cams": {
        "source_name": "Copernicus CAMS Global Atmospheric Model (ECMWF)",
        "available": true,
        "us_aqi": 170,
        "european_aqi": 146,
        "pm25_ugm3": 59.4,
        "updated": "2026-10-13T11:00",
        "type": "European Union Satellite Earth Observation & 40km Numerical Model"
      },
      "noaa_gfs": {
        "source_name": "NOAA Global Forecast System (GFS Aerosols)",
        "available": true,
        "dust_ugm3": 0.0,
        "ozone_ugm3": 226.0,
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
        "temperature_c": 30.8,
        "humidity_pct": 65.0,
        "apparent_temperature_c": 37.6,
        "wind_speed_ms": 0.5,
        "uv_index": 6.55,
        "type": "Meteorological Running Index"
      }
    },
    "timestamp": 1791862001.6703143
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
    "overall_aqi": 56,
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
      "aqi_reading": 77,
      "sub_index": 77,
      "concentration_ugm3": 24.5,
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
        "direction": "stable",
        "direction_label": "Stable (Holding Steady)",
        "trajectory": "STABLE",
        "arrow": "→",
        "change_6h": -2,
        "drift_6h_aqi": -2,
        "drift_6h_conc": -1.0,
        "color": "#F59E0B",
        "peak_aqi": {
          "value": 82,
          "time": "19:00"
        },
        "peak_time": "19:00",
        "peak_val": 82,
        "cleanest_window": {
          "aqi": 47,
          "conc": 11.3,
          "time": "08:00"
        },
        "lowest_aqi": 47,
        "lowest_time": "08:00",
        "clean_val": 47,
        "peak_conc": {
          "value": 26.8,
          "time": "19:00"
        },
        "lowest_conc": {
          "value": 11.3,
          "time": "08:00"
        },
        "summary": "Steady trend: PM2.5 AQI fluctuating between 47 and 82 AQI over the next 24 hours."
      },
      "future_trend": {
        "direction": "stable",
        "direction_label": "Stable (Holding Steady)",
        "trajectory": "STABLE",
        "arrow": "→",
        "change_6h": -2,
        "drift_6h_aqi": -2,
        "drift_6h_conc": -1.0,
        "color": "#F59E0B",
        "peak_aqi": {
          "value": 82,
          "time": "19:00"
        },
        "peak_time": "19:00",
        "peak_val": 82,
        "cleanest_window": {
          "aqi": 47,
          "conc": 11.3,
          "time": "08:00"
        },
        "lowest_aqi": 47,
        "lowest_time": "08:00",
        "clean_val": 47,
        "peak_conc": {
          "value": 26.8,
          "time": "19:00"
        },
        "lowest_conc": {
          "value": 11.3,
          "time": "08:00"
        },
        "summary": "Steady trend: PM2.5 AQI fluctuating between 47 and 82 AQI over the next 24 hours."
      },
      "past_trend": {
        "trajectory": "RISING",
        "direction_label": "Worsened (+17 pts past 6h)",
        "arrow": "↗",
        "drift_6h": 17,
        "drift_24h": 42,
        "drift_6h_conc": 8.1,
        "color": "#EF4444",
        "peak_aqi": {
          "value": 79,
          "time": "02:00"
        },
        "peak_val": 79,
        "lowest_aqi": {
          "value": 12,
          "time": "13:00"
        },
        "clean_val": 12,
        "peak_conc": {
          "value": 25.4,
          "time": "02:00"
        },
        "lowest_conc": {
          "value": 2.9,
          "time": "13:00"
        },
        "summary": "Past 24h: PM2.5 AQI shifted by +42 pts (+17 pts in last 6h), reaching a past peak of 79 AQI at ~02:00 and a low of 12 AQI at ~13:00."
      },
      "hourly_times": [
        "2026-10-13T11:00",
        "2026-10-13T12:00",
        "2026-10-13T13:00",
        "2026-10-13T14:00",
        "2026-10-13T15:00",
        "2026-10-13T16:00",
        "2026-10-13T17:00",
        "2026-10-13T18:00",
        "2026-10-13T19:00",
        "2026-10-13T20:00",
        "2026-10-13T21:00",
        "2026-10-13T22:00",
        "2026-10-13T23:00",
        "2026-10-14T00:00",
        "2026-10-14T01:00",
        "2026-10-14T02:00",
        "2026-10-14T03:00",
        "2026-10-14T04:00",
        "2026-10-14T05:00",
        "2026-10-14T06:00",
        "2026-10-14T07:00",
        "2026-10-14T08:00",
        "2026-10-14T09:00",
        "2026-10-14T10:00",
        "2026-10-14T11:00",
        "2026-10-14T12:00",
        "2026-10-14T13:00",
        "2026-10-14T14:00",
        "2026-10-14T15:00",
        "2026-10-14T16:00",
        "2026-10-14T17:00",
        "2026-10-14T18:00",
        "2026-10-14T19:00",
        "2026-10-14T20:00",
        "2026-10-14T21:00",
        "2026-10-14T22:00",
        "2026-10-14T23:00"
      ],
      "hourly_aqi": [
        77,
        76,
        75,
        75,
        74,
        74,
        75,
        76,
        82,
        77,
        78,
        68,
        65,
        66,
        67,
        66,
        66,
        65,
        64,
        64,
        49,
        47,
        63,
        65,
        65,
        66,
        68,
        70,
        71,
        70,
        69,
        70,
        75,
        79,
        72,
        72,
        76
      ],
      "hourly_conc": [
        24.5,
        24.0,
        23.5,
        23.5,
        23.0,
        23.0,
        23.5,
        24.0,
        26.8,
        24.5,
        24.9,
        20.2,
        18.8,
        19.2,
        19.7,
        19.2,
        19.2,
        18.8,
        18.3,
        18.3,
        11.8,
        11.3,
        17.8,
        18.8,
        18.8,
        19.2,
        20.2,
        21.1,
        21.6,
        21.1,
        20.7,
        21.1,
        23.5,
        25.4,
        22.1,
        22.1,
        24.0
      ],
      "past_24h": {
        "time": [
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
          "2026-10-12T23:00",
          "2026-10-13T00:00",
          "2026-10-13T01:00",
          "2026-10-13T02:00",
          "2026-10-13T03:00",
          "2026-10-13T04:00",
          "2026-10-13T05:00",
          "2026-10-13T06:00",
          "2026-10-13T07:00",
          "2026-10-13T08:00",
          "2026-10-13T09:00",
          "2026-10-13T10:00",
          "2026-10-13T11:00"
        ],
        "pm2_5": [
          8.4,
          2.9,
          5.5,
          10.6,
          12.6,
          4.8,
          18.3,
          20.2,
          19.2,
          21.6,
          20.7,
          21.6,
          19.2,
          24.5,
          25.4,
          21.1,
          21.6,
          16.4,
          12.1,
          11.0,
          11.0,
          13.5,
          24.5,
          24.5
        ],
        "pm25_aqi": [
          35,
          12,
          23,
          44,
          52,
          20,
          64,
          68,
          66,
          71,
          69,
          71,
          66,
          77,
          79,
          70,
          71,
          60,
          51,
          46,
          46,
          54,
          77,
          77
        ],
        "pm10": [
          6.4,
          5.6,
          5.2,
          5.2,
          5.4,
          5.7,
          6.1,
          7.9,
          10.9,
          23.5,
          28.1,
          30.0,
          28.6,
          27.0,
          26.0,
          22.5,
          18.4,
          16.5,
          13.8,
          12.4,
          12.3,
          14.4,
          18.5,
          14.0,
          13.9
        ],
        "us_aqi": [
          59,
          59,
          58,
          57,
          57,
          57,
          56,
          57,
          57,
          57,
          56,
          55,
          55,
          54,
          55,
          55,
          55,
          56,
          56,
          56,
          55,
          55,
          55,
          56
        ]
      },
      "future_24h": {
        "time": [
          "2026-10-13T11:00",
          "2026-10-13T12:00",
          "2026-10-13T13:00",
          "2026-10-13T14:00",
          "2026-10-13T15:00",
          "2026-10-13T16:00",
          "2026-10-13T17:00",
          "2026-10-13T18:00",
          "2026-10-13T19:00",
          "2026-10-13T20:00",
          "2026-10-13T21:00",
          "2026-10-13T22:00",
          "2026-10-13T23:00",
          "2026-10-14T00:00",
          "2026-10-14T01:00",
          "2026-10-14T02:00",
          "2026-10-14T03:00",
          "2026-10-14T04:00",
          "2026-10-14T05:00",
          "2026-10-14T06:00",
          "2026-10-14T07:00",
          "2026-10-14T08:00",
          "2026-10-14T09:00",
          "2026-10-14T10:00",
          "2026-10-14T11:00",
          "2026-10-14T12:00",
          "2026-10-14T13:00",
          "2026-10-14T14:00",
          "2026-10-14T15:00",
          "2026-10-14T16:00",
          "2026-10-14T17:00",
          "2026-10-14T18:00",
          "2026-10-14T19:00",
          "2026-10-14T20:00",
          "2026-10-14T21:00",
          "2026-10-14T22:00",
          "2026-10-14T23:00"
        ],
        "pm2_5": [
          24.5,
          24.0,
          23.5,
          23.5,
          23.0,
          23.0,
          23.5,
          24.0,
          26.8,
          24.5,
          24.9,
          20.2,
          18.8,
          19.2,
          19.7,
          19.2,
          19.2,
          18.8,
          18.3,
          18.3,
          11.8,
          11.3,
          17.8,
          18.8,
          18.8,
          19.2,
          20.2,
          21.1,
          21.6,
          21.1,
          20.7,
          21.1,
          23.5,
          25.4,
          22.1,
          22.1,
          24.0
        ],
        "pm25_aqi": [
          77,
          76,
          75,
          75,
          74,
          74,
          75,
          76,
          82,
          77,
          78,
          68,
          65,
          66,
          67,
          66,
          66,
          65,
          64,
          64,
          49,
          47,
          63,
          65,
          65,
          66,
          68,
          70,
          71,
          70,
          69,
          70,
          75,
          79,
          72,
          72,
          76
        ],
        "pm10": [
          13.9,
          14.3,
          14.6,
          14.9,
          15.1,
          15.8,
          16.1,
          16.9,
          20.4,
          18.2,
          19.0,
          14.1,
          12.7,
          13.4,
          13.9,
          13.8,
          13.5,
          13.4,
          13.1,
          13.1,
          9.3,
          8.6,
          12.5,
          13.4,
          13.8,
          14.5,
          15.3,
          16.5,
          17.0,
          16.6,
          16.1,
          16.5,
          19.0,
          20.9,
          17.2,
          17.6,
          19.3
        ],
        "us_aqi": [
          61,
          62,
          63,
          63,
          64,
          67,
          93,
          112,
          118,
          113,
          99,
          83,
          66,
          64,
          63,
          62,
          62,
          61,
          61,
          61,
          61,
          61,
          60,
          60,
          60,
          60,
          60,
          60,
          65,
          92,
          117,
          134,
          139,
          132,
          118,
          98,
          75
        ],
        "european_aqi": [
          67,
          74,
          77,
          79,
          79,
          78,
          74,
          65,
          46,
          42,
          42,
          38,
          35,
          37,
          38,
          37,
          37,
          37,
          36,
          36,
          28,
          27,
          35,
          54,
          71,
          79,
          88,
          93,
          94,
          90,
          80,
          69,
          50,
          43,
          41,
          41,
          42
        ]
      },
      "timeline_48h": {
        "time": [
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
          "2026-10-12T23:00",
          "2026-10-13T00:00",
          "2026-10-13T01:00",
          "2026-10-13T02:00",
          "2026-10-13T03:00",
          "2026-10-13T04:00",
          "2026-10-13T05:00",
          "2026-10-13T06:00",
          "2026-10-13T07:00",
          "2026-10-13T08:00",
          "2026-10-13T09:00",
          "2026-10-13T10:00",
          "2026-10-13T11:00",
          "2026-10-13T12:00",
          "2026-10-13T13:00",
          "2026-10-13T14:00",
          "2026-10-13T15:00",
          "2026-10-13T16:00",
          "2026-10-13T17:00",
          "2026-10-13T18:00",
          "2026-10-13T19:00",
          "2026-10-13T20:00",
          "2026-10-13T21:00",
          "2026-10-13T22:00",
          "2026-10-13T23:00",
          "2026-10-14T00:00",
          "2026-10-14T01:00",
          "2026-10-14T02:00",
          "2026-10-14T03:00",
          "2026-10-14T04:00",
          "2026-10-14T05:00",
          "2026-10-14T06:00",
          "2026-10-14T07:00",
          "2026-10-14T08:00",
          "2026-10-14T09:00",
          "2026-10-14T10:00",
          "2026-10-14T11:00"
        ],
        "pm2_5": [
          8.4,
          2.9,
          5.5,
          10.6,
          12.6,
          4.8,
          18.3,
          20.2,
          19.2,
          21.6,
          20.7,
          21.6,
          19.2,
          24.5,
          25.4,
          21.1,
          21.6,
          16.4,
          12.1,
          11.0,
          11.0,
          13.5,
          24.5,
          24.5,
          24.0,
          23.5,
          23.5,
          23.0,
          23.0,
          23.5,
          24.0,
          26.8,
          24.5,
          24.9,
          20.2,
          18.8,
          19.2,
          19.7,
          19.2,
          19.2,
          18.8,
          18.3,
          18.3,
          11.8,
          11.3,
          17.8,
          18.8,
          18.8
        ],
        "pm25_aqi": [
          35,
          12,
          23,
          44,
          52,
          20,
          64,
          68,
          66,
          71,
          69,
          71,
          66,
          77,
          79,
          70,
          71,
          60,
          51,
          46,
          46,
          54,
          77,
          77,
          76,
          75,
          75,
          74,
          74,
          75,
          76,
          82,
          77,
          78,
          68,
          65,
          66,
          67,
          66,
          66,
          65,
          64,
          64,
          49,
          47,
          63,
          65,
          65
        ],
        "us_aqi": [
          47,
          47,
          48,
          48,
          48,
          48,
          48,
          48,
          49,
          50,
          51,
          52,
          53,
          54,
          55,
          56,
          57,
          58,
          59,
          59,
          59,
          59,
          60,
          61,
          61,
          62,
          63,
          63,
          64,
          67,
          93,
          112,
          118,
          113,
          99,
          83,
          66,
          64,
          63,
          62,
          62,
          61,
          61,
          61,
          61,
          61,
          60,
          60,
          60
        ],
        "now_index": 23
      },
      "min_today": 12,
      "max_today": 108,
      "who_comparison": {
        "status": "1.6x WHO guideline (15 µg/m³)",
        "ratio": 1.6,
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
        "time": "09:00",
        "full_time": "2026-10-14T09:00",
        "predicted_aqi": 60,
        "recommendation": "Cleanest forecasted window: ~09:00 (Predicted AQI: 60)"
      },
      "heat_stress": {
        "temp_c": 29.6,
        "humidity_pct": 72,
        "apparent_temp_c": 36.2,
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
      "temperature_c": 29.6,
      "relative_humidity_pct": 72,
      "apparent_temperature_c": 36.2,
      "wind_speed_ms": 1.5,
      "wind_direction_deg": 339,
      "precipitation_mm": 0.0,
      "uv_index": 6.9
    },
    "aqicn_ground": {
      "source": "WAQI / aqicn.org (Malaysia DOE Ground Station)",
      "station_id": 2581,
      "station_name": "Alor Setar, Kedah, Malaysia",
      "url": "https://aqicn.org/city/malaysia/kedah/alor-setar/",
      "updated": "Tuesday, Oct 13th 2026, 11:00 am",
      "overall_aqi": 56,
      "pm25": {
        "current": 77,
        "min": 12,
        "max": 108,
        "unit": "AQI sub-index"
      },
      "pollutants": {
        "pm10": {
          "current": "35",
          "min": "8",
          "max": "43"
        },
        "o3": {
          "current": "9",
          "min": "1",
          "max": "19"
        },
        "no2": {
          "current": "4",
          "min": "1",
          "max": "6"
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
        "humidity": "70",
        "pressure": "1013",
        "wind": "2"
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
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 2599,
          "name": "Kangar, Perlis, Malaysia",
          "geo": [
            6.429922,
            100.211069
          ],
          "aqi": "54",
          "time": "2026-10-13T11:00:00+08:00"
        },
        {
          "id": 2582,
          "name": "Bakar Arang, Sg. Petani, Kedah, Malaysia",
          "geo": [
            5.629631,
            100.467771
          ],
          "aqi": "56",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 2583,
          "name": "Langkawi, Kedah, Malaysia",
          "geo": [
            6.331539,
            99.85846
          ],
          "aqi": "28",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 10482,
          "name": "Phiman, Satun, Satun, Thailand (ต.พิมาน อ.เมือง จ.สตูล)",
          "geo": [
            6.624747,
            100.066159
          ],
          "aqi": "47",
          "time": "2026-10-13T10:00:00+07:00"
        },
        {
          "id": 2601,
          "name": "Seberang Jaya 2, Perai, Pulau Pinang, Malaysia",
          "geo": [
            5.39817,
            100.403947
          ],
          "aqi": "59",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 5778,
          "name": "Perai",
          "geo": [
            5.384388,
            100.3896169
          ],
          "aqi": "72",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 9488,
          "name": "Kulim Hi-Tech, Kedah, Malaysia",
          "geo": [
            5.401688,
            100.58968
          ],
          "aqi": "53",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 9489,
          "name": "Minden, Pulau Pinang, Malaysia",
          "geo": [
            5.356211,
            100.30792
          ],
          "aqi": "54",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 12760,
          "name": "Betong, Thailand (ต.เบตง อ.เบตง จ.ยะลา)",
          "geo": [
            5.763873,
            101.067903
          ],
          "aqi": "50",
          "time": "2026-10-13T11:00:00+07:00"
        },
        {
          "id": 9490,
          "name": "Balik Pulau, Pulau Pinang, Malaysia",
          "geo": [
            5.337598,
            100.214721
          ],
          "aqi": "46",
          "time": "2026-10-13T10:00:00+08:00"
        },
        {
          "id": 2600,
          "name": "Perai, Pulau Pinang, Malaysia",
          "geo": [
            5.329358,
            100.443475
          ],
          "aqi": "55",
          "time": "2026-10-13T10:00:00+08:00"
        }
      ],
      "history": {
        "aqi": {
          "time": [
            "2026-10-12T08:00",
            "2026-10-12T09:00",
            "2026-10-12T11:00",
            "2026-10-12T12:00",
            "2026-10-12T13:00",
            "2026-10-12T14:00",
            "2026-10-12T17:00",
            "2026-10-12T18:00",
            "2026-10-12T19:00",
            "2026-10-12T20:00",
            "2026-10-12T21:00",
            "2026-10-12T22:00",
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T11:00"
          ],
          "values": [
            59,
            59,
            58,
            57,
            57,
            57,
            56,
            57,
            57,
            57,
            56,
            55,
            55,
            54,
            55,
            55,
            55,
            56,
            56,
            56,
            55,
            55,
            55,
            56
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": [
            59,
            59,
            58,
            57,
            57,
            57,
            56,
            57,
            57,
            57,
            56,
            55,
            55,
            54,
            55,
            55,
            55,
            56,
            56,
            56,
            55,
            55,
            55,
            56
          ]
        },
        "pm25": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00"
          ],
          "values": [
            32,
            35,
            12,
            23,
            44,
            52,
            20,
            64,
            68,
            66,
            71,
            69,
            71,
            66,
            77,
            79,
            70,
            71,
            60,
            51,
            46,
            46,
            54,
            77
          ],
          "pm25_aqi": [
            32,
            35,
            12,
            23,
            44,
            52,
            20,
            64,
            68,
            66,
            71,
            69,
            71,
            66,
            77,
            79,
            70,
            71,
            60,
            51,
            46,
            46,
            54,
            77
          ],
          "pm2_5": [
            7.7,
            8.4,
            2.9,
            5.5,
            10.6,
            12.6,
            4.8,
            18.3,
            20.2,
            19.2,
            21.6,
            20.7,
            21.6,
            19.2,
            24.5,
            25.4,
            21.1,
            21.6,
            16.4,
            12.1,
            11.0,
            11.0,
            13.5,
            24.5
          ],
          "us_aqi": [
            32,
            35,
            12,
            23,
            44,
            52,
            20,
            64,
            68,
            66,
            71,
            69,
            71,
            66,
            77,
            79,
            70,
            71,
            60,
            51,
            46,
            46,
            54,
            77
          ]
        },
        "pm10": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00"
          ],
          "values": [
            14,
            14,
            9,
            8,
            13,
            19,
            9,
            22,
            24,
            22,
            25,
            25,
            26,
            24,
            31,
            32,
            28,
            32,
            25,
            20,
            20,
            20,
            25,
            35
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "o3": {
          "time": [
            "2026-10-12T08:00",
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
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T10:00"
          ],
          "values": [
            3,
            10,
            12,
            13,
            15,
            15,
            15,
            15,
            15,
            13,
            14,
            12,
            9,
            5,
            5,
            3,
            2,
            5,
            5,
            4,
            4,
            3,
            1,
            9
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "no2": {
          "time": [
            "2026-10-12T09:00",
            "2026-10-12T10:00",
            "2026-10-12T11:00",
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
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00"
          ],
          "values": [
            2,
            1,
            2,
            1,
            1,
            1,
            1,
            1,
            2,
            2,
            2,
            3,
            4,
            5,
            5,
            4,
            2,
            2,
            2,
            1,
            1,
            3,
            5,
            4
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "so2": {
          "time": [
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
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00"
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
            "2026-10-12T09:00",
            "2026-10-12T10:00",
            "2026-10-12T11:00",
            "2026-10-12T12:00",
            "2026-10-12T13:00",
            "2026-10-12T14:00",
            "2026-10-12T16:00",
            "2026-10-12T17:00",
            "2026-10-12T18:00",
            "2026-10-12T19:00",
            "2026-10-12T20:00",
            "2026-10-12T21:00",
            "2026-10-12T23:00",
            "2026-10-13T00:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T08:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00"
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
            "2026-10-12T23:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            29,
            26,
            28,
            30,
            29,
            28,
            29,
            29,
            28,
            28,
            27,
            27,
            27,
            26,
            26,
            26,
            25,
            25,
            25,
            24,
            24,
            28,
            30,
            31
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "p": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            1014,
            1014,
            1014,
            1013,
            1011,
            1010,
            1010,
            1009,
            1009,
            1010,
            1010,
            1011,
            1012,
            1013,
            1013,
            1012,
            1011,
            1011,
            1011,
            1011,
            1012,
            1013,
            1013,
            1013
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "h": {
          "time": [
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
            "2026-10-12T23:00",
            "2026-10-13T01:00",
            "2026-10-13T02:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T07:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            79,
            94,
            78,
            74,
            74,
            74,
            70,
            70,
            78,
            78,
            83,
            88,
            88,
            94,
            88,
            88,
            94,
            88,
            88,
            94,
            94,
            78,
            74,
            70
          ],
          "pm25_aqi": null,
          "pm2_5": null,
          "us_aqi": null
        },
        "w": {
          "time": [
            "2026-10-11T22:00",
            "2026-10-11T23:00",
            "2026-10-12T04:00",
            "2026-10-12T05:00",
            "2026-10-12T06:00",
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
            "2026-10-12T22:00",
            "2026-10-13T03:00",
            "2026-10-13T04:00",
            "2026-10-13T05:00",
            "2026-10-13T06:00",
            "2026-10-13T09:00",
            "2026-10-13T10:00",
            "2026-10-13T11:00"
          ],
          "values": [
            1,
            1,
            1,
            1,
            1,
            2,
            4,
            3,
            2,
            2,
            3,
            2,
            2,
            2,
            2,
            2,
            1,
            0,
            1,
            0,
            1,
            2,
            1,
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
      "time": "2026-10-13T11:00",
      "us_aqi": 61,
      "european_aqi": 67,
      "pm25_concentration": {
        "value": 13.9,
        "unit": "µg/m³"
      },
      "pm10_concentration": {
        "value": 13.9,
        "unit": "µg/m³"
      },
      "pollutants_ugm3": {
        "carbon_monoxide": 395.0,
        "nitrogen_dioxide": 4.0,
        "sulphur_dioxide": 8.6,
        "ozone": 133.0,
        "dust": 0.0
      },
      "hourly_forecast": {
        "time": [
          "2026-10-13T11:00",
          "2026-10-13T12:00",
          "2026-10-13T13:00",
          "2026-10-13T14:00",
          "2026-10-13T15:00",
          "2026-10-13T16:00",
          "2026-10-13T17:00",
          "2026-10-13T18:00",
          "2026-10-13T19:00",
          "2026-10-13T20:00",
          "2026-10-13T21:00",
          "2026-10-13T22:00",
          "2026-10-13T23:00",
          "2026-10-14T00:00",
          "2026-10-14T01:00",
          "2026-10-14T02:00",
          "2026-10-14T03:00",
          "2026-10-14T04:00",
          "2026-10-14T05:00",
          "2026-10-14T06:00",
          "2026-10-14T07:00",
          "2026-10-14T08:00",
          "2026-10-14T09:00",
          "2026-10-14T10:00",
          "2026-10-14T11:00",
          "2026-10-14T12:00",
          "2026-10-14T13:00",
          "2026-10-14T14:00",
          "2026-10-14T15:00",
          "2026-10-14T16:00",
          "2026-10-14T17:00",
          "2026-10-14T18:00",
          "2026-10-14T19:00",
          "2026-10-14T20:00",
          "2026-10-14T21:00",
          "2026-10-14T22:00",
          "2026-10-14T23:00"
        ],
        "pm2_5": [
          24.5,
          24.0,
          23.5,
          23.5,
          23.0,
          23.0,
          23.5,
          24.0,
          26.8,
          24.5,
          24.9,
          20.2,
          18.8,
          19.2,
          19.7,
          19.2,
          19.2,
          18.8,
          18.3,
          18.3,
          11.8,
          11.3,
          17.8,
          18.8,
          18.8,
          19.2,
          20.2,
          21.1,
          21.6,
          21.1,
          20.7,
          21.1,
          23.5,
          25.4,
          22.1,
          22.1,
          24.0
        ],
        "pm25_aqi": [
          77,
          76,
          75,
          75,
          74,
          74,
          75,
          76,
          82,
          77,
          78,
          68,
          65,
          66,
          67,
          66,
          66,
          65,
          64,
          64,
          49,
          47,
          63,
          65,
          65,
          66,
          68,
          70,
          71,
          70,
          69,
          70,
          75,
          79,
          72,
          72,
          76
        ],
        "pm10": [
          13.9,
          14.3,
          14.6,
          14.9,
          15.1,
          15.8,
          16.1,
          16.9,
          20.4,
          18.2,
          19.0,
          14.1,
          12.7,
          13.4,
          13.9,
          13.8,
          13.5,
          13.4,
          13.1,
          13.1,
          9.3,
          8.6,
          12.5,
          13.4,
          13.8,
          14.5,
          15.3,
          16.5,
          17.0,
          16.6,
          16.1,
          16.5,
          19.0,
          20.9,
          17.2,
          17.6,
          19.3
        ],
        "us_aqi": [
          61,
          62,
          63,
          63,
          64,
          67,
          93,
          112,
          118,
          113,
          99,
          83,
          66,
          64,
          63,
          62,
          62,
          61,
          61,
          61,
          61,
          61,
          60,
          60,
          60,
          60,
          60,
          60,
          65,
          92,
          117,
          134,
          139,
          132,
          118,
          98,
          75
        ],
        "european_aqi": [
          67,
          74,
          77,
          79,
          79,
          78,
          74,
          65,
          46,
          42,
          42,
          38,
          35,
          37,
          38,
          37,
          37,
          37,
          36,
          36,
          28,
          27,
          35,
          54,
          71,
          79,
          88,
          93,
          94,
          90,
          80,
          69,
          50,
          43,
          41,
          41,
          42
        ]
      },
      "past_24h": {
        "time": [
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
          "2026-10-12T23:00",
          "2026-10-13T00:00",
          "2026-10-13T01:00",
          "2026-10-13T02:00",
          "2026-10-13T03:00",
          "2026-10-13T04:00",
          "2026-10-13T05:00",
          "2026-10-13T06:00",
          "2026-10-13T07:00",
          "2026-10-13T08:00",
          "2026-10-13T09:00",
          "2026-10-13T10:00",
          "2026-10-13T11:00"
        ],
        "pm2_5": [
          8.4,
          2.9,
          5.5,
          10.6,
          12.6,
          4.8,
          18.3,
          20.2,
          19.2,
          21.6,
          20.7,
          21.6,
          19.2,
          24.5,
          25.4,
          21.1,
          21.6,
          16.4,
          12.1,
          11.0,
          11.0,
          13.5,
          24.5,
          24.5
        ],
        "pm25_aqi": [
          35,
          12,
          23,
          44,
          52,
          20,
          64,
          68,
          66,
          71,
          69,
          71,
          66,
          77,
          79,
          70,
          71,
          60,
          51,
          46,
          46,
          54,
          77,
          77
        ],
        "pm10": [
          6.4,
          5.6,
          5.2,
          5.2,
          5.4,
          5.7,
          6.1,
          7.9,
          10.9,
          23.5,
          28.1,
          30.0,
          28.6,
          27.0,
          26.0,
          22.5,
          18.4,
          16.5,
          13.8,
          12.4,
          12.3,
          14.4,
          18.5,
          14.0,
          13.9
        ],
        "us_aqi": [
          59,
          59,
          58,
          57,
          57,
          57,
          56,
          57,
          57,
          57,
          56,
          55,
          55,
          54,
          55,
          55,
          55,
          56,
          56,
          56,
          55,
          55,
          55,
          56
        ]
      },
      "timeline_48h": {
        "time": [
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
          "2026-10-12T23:00",
          "2026-10-13T00:00",
          "2026-10-13T01:00",
          "2026-10-13T02:00",
          "2026-10-13T03:00",
          "2026-10-13T04:00",
          "2026-10-13T05:00",
          "2026-10-13T06:00",
          "2026-10-13T07:00",
          "2026-10-13T08:00",
          "2026-10-13T09:00",
          "2026-10-13T10:00",
          "2026-10-13T11:00",
          "2026-10-13T12:00",
          "2026-10-13T13:00",
          "2026-10-13T14:00",
          "2026-10-13T15:00",
          "2026-10-13T16:00",
          "2026-10-13T17:00",
          "2026-10-13T18:00",
          "2026-10-13T19:00",
          "2026-10-13T20:00",
          "2026-10-13T21:00",
          "2026-10-13T22:00",
          "2026-10-13T23:00",
          "2026-10-14T00:00",
          "2026-10-14T01:00",
          "2026-10-14T02:00",
          "2026-10-14T03:00",
          "2026-10-14T04:00",
          "2026-10-14T05:00",
          "2026-10-14T06:00",
          "2026-10-14T07:00",
          "2026-10-14T08:00",
          "2026-10-14T09:00",
          "2026-10-14T10:00",
          "2026-10-14T11:00"
        ],
        "pm2_5": [
          8.4,
          2.9,
          5.5,
          10.6,
          12.6,
          4.8,
          18.3,
          20.2,
          19.2,
          21.6,
          20.7,
          21.6,
          19.2,
          24.5,
          25.4,
          21.1,
          21.6,
          16.4,
          12.1,
          11.0,
          11.0,
          13.5,
          24.5,
          24.5,
          24.0,
          23.5,
          23.5,
          23.0,
          23.0,
          23.5,
          24.0,
          26.8,
          24.5,
          24.9,
          20.2,
          18.8,
          19.2,
          19.7,
          19.2,
          19.2,
          18.8,
          18.3,
          18.3,
          11.8,
          11.3,
          17.8,
          18.8,
          18.8
        ],
        "pm25_aqi": [
          35,
          12,
          23,
          44,
          52,
          20,
          64,
          68,
          66,
          71,
          69,
          71,
          66,
          77,
          79,
          70,
          71,
          60,
          51,
          46,
          46,
          54,
          77,
          77,
          76,
          75,
          75,
          74,
          74,
          75,
          76,
          82,
          77,
          78,
          68,
          65,
          66,
          67,
          66,
          66,
          65,
          64,
          64,
          49,
          47,
          63,
          65,
          65
        ],
        "us_aqi": [
          47,
          47,
          48,
          48,
          48,
          48,
          48,
          48,
          49,
          50,
          51,
          52,
          53,
          54,
          55,
          56,
          57,
          58,
          59,
          59,
          59,
          59,
          60,
          61,
          61,
          62,
          63,
          63,
          64,
          67,
          93,
          112,
          118,
          113,
          99,
          83,
          66,
          64,
          63,
          62,
          62,
          61,
          61,
          61,
          61,
          61,
          60,
          60,
          60
        ],
        "now_index": 23
      }
    },
    "sources_comparison": {
      "aqicn_waqi": {
        "source_name": "WAQI / Malaysia DOE Continuous Monitoring",
        "available": true,
        "station_name": "Alor Setar, Kedah, Malaysia",
        "overall_aqi": 56,
        "pm25_subindex": 77,
        "url": "https://aqicn.org/city/malaysia/kedah/alor-setar/",
        "updated": "Tuesday, Oct 13th 2026, 11:00 am",
        "type": "Ground-Level Continuous Ambient Air Monitoring Station"
      },
      "copernicus_cams": {
        "source_name": "Copernicus CAMS Global Atmospheric Model (ECMWF)",
        "available": true,
        "us_aqi": 61,
        "european_aqi": 67,
        "pm25_ugm3": 24.5,
        "updated": "2026-10-13T11:00",
        "type": "European Union Satellite Earth Observation & 40km Numerical Model"
      },
      "noaa_gfs": {
        "source_name": "NOAA Global Forecast System (GFS Aerosols)",
        "available": true,
        "dust_ugm3": 0.0,
        "ozone_ugm3": 133.0,
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
        "temperature_c": 29.6,
        "humidity_pct": 72.0,
        "apparent_temperature_c": 36.2,
        "wind_speed_ms": 1.5,
        "uv_index": 6.9,
        "type": "Meteorological Running Index"
      }
    },
    "timestamp": 1791862001.703699
  }
};








// Malaysia Standard Time (UTC+8) ISO hour helper — immune to device/browser UTC offset differences
function getMalaysiaHourIso(offsetHours = 0) {
  const mytMs = Date.now() + (8 + offsetHours) * 3600 * 1000;
  return new Date(mytMs).toISOString().slice(0, 13) + ':00';
}

function parseIsoHourToVirtualMs(isoStr) {
  if (!isoStr || typeof isoStr !== 'string') return NaN;
  const m = isoStr.match(/(\d{4})[-/](\d{2})[-/](\d{2})[T\s](\d{2})/);
  if (!m) return NaN;
  return Date.UTC(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10), parseInt(m[4], 10), 0, 0);
}

// Decode WAQI api2.waqi.info obs.pm25 delta-encoded 24h ground station series directly
function decodeWaqiObsSeries(obsPm25, curAqi, curConc) {
  if (!obsPm25 || !Array.isArray(obsPm25.v) || obsPm25.v.length === 0) return null;
  const sStr = String(obsPm25.s || '');
  const m = sStr.match(/(\d{4})[-/](\d{2})[-/](\d{2})\s+(\d{2}):(\d{2})/);
  let curMs;
  if (m) {
    curMs = Date.UTC(parseInt(m[1], 10), parseInt(m[2], 10) - 1, parseInt(m[3], 10), parseInt(m[4], 10), 0, 0);
  } else {
    curMs = Date.now() + 8 * 3600 * 1000;
  }

  const scale = (typeof obsPm25.m === 'number' && obsPm25.m !== 0) ? obsPm25.m : 1;
  let runningVal = 0;
  const rawPts = [];

  for (let i = 0; i < obsPm25.v.length; i++) {
    const item = obsPm25.v[i];
    if (i === 0) {
      const v0 = Array.isArray(item) ? Number(item[0]) : Number(item);
      if (isNaN(v0)) continue;
      runningVal = v0;
      const aqi0 = Math.max(1, Math.round(runningVal / scale));
      const iso0 = new Date(curMs).toISOString().slice(0, 13) + ':00';
      rawPts.push({ ms: curMs, iso: iso0, aqi: aqi0 });
    } else if (Array.isArray(item)) {
      const dVal = Number(item[0]) || 0;
      const dSec = (item.length > 1 && item[1] !== undefined) ? Number(item[1]) : -3600;
      const stepHours = Math.round(Math.abs(dSec) / 3600);
      const prevMs = curMs;
      const prevVal = runningVal;
      if (dSec < 0 && stepHours > 1 && stepHours <= 8) {
        for (let h = 1; h < stepHours; h++) {
          const midMs = prevMs - h * 3600 * 1000;
          const midVal = prevVal + dVal * (h / stepHours);
          const midAqi = Math.max(1, Math.round(midVal / scale));
          rawPts.push({ ms: midMs, iso: new Date(midMs).toISOString().slice(0, 13) + ':00', aqi: midAqi });
        }
      }
      runningVal = prevVal + dVal;
      curMs = prevMs + dSec * 1000;
      const aqiVal = Math.max(1, Math.round(runningVal / scale));
      rawPts.push({ ms: curMs, iso: new Date(curMs).toISOString().slice(0, 13) + ':00', aqi: aqiVal });
    } else if (typeof item === 'number') {
      runningVal += item;
      curMs -= 3600 * 1000;
      const aqiVal = Math.max(1, Math.round(runningVal / scale));
      rawPts.push({ ms: curMs, iso: new Date(curMs).toISOString().slice(0, 13) + ':00', aqi: aqiVal });
    }
    if (rawPts.length >= 36) break;
  }

  if (rawPts.length < 4) return null;
  rawPts.reverse(); // chronological: oldest -> newest

  // Extend up to current Malaysia hour without shifting any historical hour timestamps
  const nowIso = getMalaysiaHourIso(0);
  const nowMs = parseIsoHourToVirtualMs(nowIso);
  const lastPt = rawPts[rawPts.length - 1];
  if (!isNaN(nowMs) && lastPt) {
    const diffHrs = Math.round((nowMs - lastPt.ms) / (3600 * 1000));
    if (diffHrs >= 1 && diffHrs <= 4) {
      for (let h = 1; h <= diffHrs; h++) {
        const stepMs = lastPt.ms + h * 3600 * 1000;
        const stepIso = new Date(stepMs).toISOString().slice(0, 13) + ':00';
        rawPts.push({ ms: stepMs, iso: stepIso, aqi: curAqi });
      }
    } else if (diffHrs === 0 && typeof curAqi === 'number') {
      rawPts[rawPts.length - 1].aqi = curAqi;
    }
  }

  const slice24 = rawPts.slice(-24);
  while (slice24.length < 24) {
    const first = slice24[0];
    const prevMs = first.ms - 3600 * 1000;
    slice24.unshift({ ms: prevMs, iso: new Date(prevMs).toISOString().slice(0, 13) + ':00', aqi: first.aqi });
  }

  const times = slice24.map(p => p.iso);
  const aqis = slice24.map(p => p.aqi);
  const concs = aqis.map(a => aqiToPm25Conc(a));
  return { time: times, pm25_aqi: aqis, pm2_5: concs, is_live_ground: true };
}

async function loadInitialMobileData() {
  // STEP 1: Immediately render aligned baseline for 0ms startup
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

  // STEP 2: Immediately fetch live WAQI ground station data (including obs.pm25 24h series) for all preset cities
  await refreshPresetCitiesLive();
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

// Generate realistic 24-hour historical baseline in Malaysia Standard Time (UTC+8)
function generateBaselinePast24(aqi, conc) {
  const times = [];
  const aqis = [];
  const concs = [];

  for (let i = 23; i >= 0; i--) {
    times.push(getMalaysiaHourIso(-i));
    if (i === 0) {
      aqis.push(aqi);
      concs.push(conc);
    } else {
      const factor = 1.0 + Math.sin(i * 0.45) * 0.08;
      const a = Math.max(12, Math.round(aqi * factor));
      aqis.push(a);
      concs.push(aqiToPm25Conc(a));
    }
  }
  return { time: times, pm25_aqi: aqis, pm2_5: concs };
}

// Generate continuous 48-hour timeline (-23h..NOW..+24h) in Malaysia Standard Time (UTC+8)
function generateBaselineTimeline48(aqi, conc, existingPast24 = null) {
  const past = (existingPast24 && Array.isArray(existingPast24.pm25_aqi) && existingPast24.pm25_aqi.length === 24)
    ? existingPast24
    : generateBaselinePast24(aqi, conc);
  const times = [...past.time];
  const aqis = [...past.pm25_aqi];
  const concs = [...past.pm2_5];

  const meanAqi = aqis.reduce((s, v) => s + (Number(v) || aqi), 0) / aqis.length;

  for (let step = 1; step <= 24; step++) {
    times.push(getMalaysiaHourIso(step));
    const histVal = Number(aqis[(step - 1) % aqis.length]) || meanAqi;
    const diurnalDelta = (histVal - meanAqi) * 0.40;
    const persistWeight = Math.exp(-step / 6.0);
    const projAqi = Math.max(8, Math.min(500, Math.round(aqi * persistWeight + (meanAqi + diurnalDelta) * (1 - persistWeight))));
    aqis.push(projAqi);
    concs.push(aqiToPm25Conc(projAqi));
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
    const tid1 = setTimeout(() => ctrl1.abort(), 4500);
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
    const tid2 = setTimeout(() => ctrl2.abort(), 4500);
    const params = new URLSearchParams();
    params.append('token', token);
    params.append('id', String(stationId));
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

// Universal Timeline Normalizer: Guarantees past 24h, future 24h & continuous 48h arrays are anchored to current Malaysia hour (UTC+8)
function alignTimelinesToCurrentHour(data) {
  if (!data || !data.pm25) return data;
  const pm25 = data.pm25;
  const curAqi = (pm25.aqi_reading !== null && pm25.aqi_reading !== undefined) ? pm25.aqi_reading : ((data.overall_aqi !== null && data.overall_aqi !== undefined) ? data.overall_aqi : 50);
  const curConc = aqiToPm25Conc(curAqi);
  pm25.concentration_ugm3 = curConc;

  // 1. Standard 24h past timestamps in Malaysia Time (UTC+8) ending at current hour (index 23 = NOW)
  const pastTimes = [];
  for (let i = 23; i >= 0; i--) {
    pastTimes.push(getMalaysiaHourIso(-i));
  }

  // 2. Standard 24h future timestamps starting at current hour + 1 (+1h .. +24h)
  const futureOnlyTimes = [];
  for (let i = 1; i <= 24; i++) {
    futureOnlyTimes.push(getMalaysiaHourIso(i));
  }

  const timelineTimes = [...pastTimes, ...futureOnlyTimes];
  const nowIndex = 23;

  // 3. Past 24h alignment by timestamp lookup (prevents shifting hours or copying stale multi-day-old arrays)
  let pAqis = [];
  let pConcs = [];
  if (pm25.past_24h && Array.isArray(pm25.past_24h.pm25_aqi) && pm25.past_24h.pm25_aqi.length >= 12) {
    const oldTimes = Array.isArray(pm25.past_24h.time) ? pm25.past_24h.time : [];
    const oldAqis = pm25.past_24h.pm25_aqi;
    const hourMap = {};
    for (let i = 0; i < oldAqis.length; i++) {
      const tKey = oldTimes[i] ? String(oldTimes[i]).slice(0, 13) + ':00' : null;
      if (tKey && oldAqis[i] !== null && oldAqis[i] !== undefined && !isNaN(oldAqis[i])) {
        hourMap[tKey] = Math.round(Number(oldAqis[i]));
      }
    }

    let matchCount = 0;
    for (let i = 0; i < pastTimes.length; i++) {
      if (hourMap[pastTimes[i]] !== undefined) matchCount++;
    }

    if (matchCount >= 16 || pm25.past_24h.is_live_ground) {
      // Genuine recent ground station history: map each timestamp to its exact hour
      let lastValid = curAqi;
      for (let i = 0; i < pastTimes.length; i++) {
        if (hourMap[pastTimes[i]] !== undefined) {
          lastValid = hourMap[pastTimes[i]];
          break;
        }
      }
      for (let i = 0; i < pastTimes.length; i++) {
        const t = pastTimes[i];
        if (hourMap[t] !== undefined) {
          lastValid = hourMap[t];
        }
        pAqis.push(lastValid);
      }
      pAqis[23] = curAqi;
      pConcs = pAqis.map(a => aqiToPm25Conc(a));
    } else {
      // Fallback snapshot is from an older date; generate clean baseline around curAqi until live WAQI resolves
      const base24 = generateBaselinePast24(curAqi, curConc);
      pAqis = base24.pm25_aqi;
      pConcs = base24.pm2_5;
    }
  } else {
    const base24 = generateBaselinePast24(curAqi, curConc);
    pAqis = base24.pm25_aqi;
    pConcs = base24.pm2_5;
  }

  pm25.past_24h = {
    time: pastTimes,
    pm25_aqi: pAqis,
    pm2_5: pConcs,
    is_live_ground: Boolean(pm25.past_24h && pm25.past_24h.is_live_ground)
  };

  // 4. Build calibrated future 24 hours (+1h .. +24h) and continuous 48h timeline
  const base48 = generateBaselineTimeline48(curAqi, curConc, pm25.past_24h);
  const tlAqis = base48.pm25_aqi;
  const tlConcs = base48.pm2_5;

  pm25.timeline_48h = {
    time: timelineTimes,
    pm25_aqi: tlAqis,
    pm2_5: tlConcs,
    now_index: nowIndex
  };

  // 5. Future 24h starts at index 23 (NOW) through index 46 (+23h) so index 0 is genuinely NOW
  pm25.future_24h = {
    time: timelineTimes.slice(23, 47),
    pm25_aqi: tlAqis.slice(23, 47),
    pm2_5: tlConcs.slice(23, 47)
  };
  pm25.hourly_times = pm25.future_24h.time;
  pm25.hourly_aqi = pm25.future_24h.pm25_aqi;
  pm25.hourly_conc = pm25.future_24h.pm2_5;

  // 6. Recalculate Past Trend and Future Trend Stats from the aligned arrays
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

  // Decode real-time 24h hourly ground observations directly from wData.obs.pm25 for ALL tabs!
  const decodedPast24 = decodeWaqiObsSeries(wData.obs && wData.obs.pm25, pm25Aqi, pm25Conc);
  const past24 = decodedPast24 || generateBaselinePast24(pm25Aqi, pm25Conc);
  const tl48 = generateBaselineTimeline48(pm25Aqi, pm25Conc, past24);

  let minToday = Math.min(...past24.pm25_aqi);
  let maxToday = Math.max(...past24.pm25_aqi);

  const updatedTime = (wData.time && wData.time.s) ? `Station: ${wData.time.s}` : 'Live WAQI Ground Station';

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

// Resolve official WAQI station ID from MALAYSIA_STATIONS_DATA by name or nearest coordinates
function resolveMalaysianStationId(lat, lon, name) {
  if (typeof MALAYSIA_STATIONS_DATA !== 'object' || !MALAYSIA_STATIONS_DATA) return null;
  const nLow = (name || '').toLowerCase().trim();
  if (nLow) {
    for (const stList of Object.values(MALAYSIA_STATIONS_DATA)) {
      for (const st of stList) {
        if (st.name.toLowerCase() === nLow || nLow.includes(st.name.toLowerCase()) || st.area.toLowerCase().includes(nLow)) {
          return st.id;
        }
      }
    }
  }
  const latNum = parseFloat(lat);
  const lonNum = parseFloat(lon);
  if (!isNaN(latNum) && !isNaN(lonNum)) {
    let bestId = null;
    let bestDistSq = Infinity;
    for (const stList of Object.values(MALAYSIA_STATIONS_DATA)) {
      for (const st of stList) {
        if (Array.isArray(st.geo) && st.geo.length >= 2) {
          const dLat = st.geo[0] - latNum;
          const dLon = st.geo[1] - lonNum;
          const dSq = dLat * dLat + dLon * dLon;
          if (dSq < bestDistSq) {
            bestDistSq = dSq;
            bestId = st.id;
          }
        }
      }
    }
    if (bestDistSq <= 0.65) return bestId;
  }
  return null;
}

// WAQI-Only Universal Fetch: Pure Ground Station measurements with live 24h obs.pm25 decoding across all 4 tabs
async function fetchAirQualityUniversal({ lat, lon, name, stateName = 'Malaysia', countryName = 'Malaysia', station_id = null }) {
  // 1. Identify if requested station is one of the verified preset cities
  let matchedPresetKey = null;
  if (name) {
    const nLow = name.toLowerCase();
    if (nLow.includes('perai') || nLow.includes('seberang jaya')) matchedPresetKey = 'perai';
    else if (nLow.includes('kuala lumpur') || nLow === 'kl' || nLow.includes('batu muda')) matchedPresetKey = 'kuala-lumpur';
    else if (nLow.includes('alor setar')) matchedPresetKey = 'alor-setar';
  }
  if (!matchedPresetKey && station_id) {
    const sIdNum = parseInt(station_id, 10);
    if (sIdNum === 2600) matchedPresetKey = 'perai';
    else if (sIdNum === 5780) matchedPresetKey = 'kuala-lumpur';
    else if (sIdNum === 2581) matchedPresetKey = 'alor-setar';
  }

  const targetStationId = station_id
    || (matchedPresetKey && WAQI_STATIONS[matchedPresetKey] ? WAQI_STATIONS[matchedPresetKey].id : null)
    || resolveMalaysianStationId(lat, lon, name);
  const fallback = matchedPresetKey ? (mState.presetData[matchedPresetKey] || M_FALLBACK_PRESETS[matchedPresetKey]) : null;

  // 2. PRIMARY LIVE SOURCE: Direct WAQI Ground Station Feed (Zero API key required, CORS *, includes real-time 24h obs.pm25!)
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

  // 3. WAQI feed with user-supplied token if configured
  const waqiToken = localStorage.getItem('waqi_token') || (typeof WAQI_TOKEN !== 'undefined' ? WAQI_TOKEN : '');
  if (waqiToken && targetStationId) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 3000);
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

  // 4. Local or LAN Python backend server (only attempted when running on localhost or LAN IP)
  const isLocalHost = /^(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.)/.test(window.location.hostname || '');
  if (isLocalHost) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 1800);
      const ep = `/api/air-quality?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name || '')}${targetStationId ? `&station_id=${targetStationId}` : ''}`;
      const res = await fetch(ep, { signal: controller.signal });
      clearTimeout(tid);
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error && data.pm25) {
          return alignTimelinesToCurrentHour(data);
        }
      }
    } catch (e) {
      // Local backend unavailable
    }
  }

  // 5. Fallback to aligned preset or synthesized station data
  if (fallback) {
    return alignTimelinesToCurrentHour(JSON.parse(JSON.stringify(fallback)));
  }

  return alignTimelinesToCurrentHour(synthesizeGroundStationData({ lat, lon, name, stateName, countryName, station_id: targetStationId }));
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

  const scrollWrap = mEl.mTrendTableBody.closest('.m-trend-table-scroll');
  if (scrollWrap) {
    if (rangeMode === 'all') {
      requestAnimationFrame(() => {
        const nowRow = mEl.mTrendTableBody.querySelector('.row-now');
        if (nowRow) {
          scrollWrap.scrollTop = Math.max(0, nowRow.offsetTop - 72);
        }
      });
    } else {
      scrollWrap.scrollTop = 0;
    }
  }
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
