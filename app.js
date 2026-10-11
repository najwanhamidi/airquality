/**
 * AeroPulse — Air Quality Monitor Application
 * Handles data fetching, multi-source aggregation, map rendering, charts, and search.
 */

// Global State
const state = {
  currentCityKey: 'perai',
  currentData: null,
  presetData: {},
  allStations: {},
  chartMode: 'pm25_aqi', // 'pm25_aqi', 'pm25', or 'aqi'
  timelineRange: 'all', // 'all' (48h), 'past' (24h), or 'future' (24h)
  chartInstance: null,
  mapInstance: null,
  mapMarkers: [],
  autoRefreshTimer: null,
  theme: localStorage.getItem('aeropulse_theme') || 'dark',
};

// EPA PM2.5 AQI breakpoint conversion helper
function calcPm25Aqi(c) {
  if (c === null || c === undefined || isNaN(c)) return 50;
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
  const temp = wx.temperature_2m || 30;
  const rh = wx.relative_humidity_2m || 80;
  const appTemp = wx.apparent_temperature || (temp + 3);

  let badge = 'SAFE FOR ALL RUNS';
  let color = '#10B981';
  let verdict = 'Optimal Running Conditions';
  let summary = 'Air pollution is minimal. Runners of all fitness levels can perform easy jogs, tempo intervals, and extended long runs with zero pulmonary limitation.';
  let lowSafe = true, lowDur = '90 - 120 mins', lowNote = 'Normal ventilation (~35 L/min). Ideal for base mileage and recovery runs.';
  let modSafe = true, modDur = '60 - 75 mins', modNote = 'Aerobic threshold (~60-80 L/min). Safe for tempo runs and sustained threshold.';
  let highSafe = true, highDur = '45 - 60 mins', highNote = 'High ventilatory demand (>120 L/min). Nasal-to-mouth transition is completely safe.';

  if (aqi > 200) {
    badge = 'RUNNING PROHIBITED';
    color = '#EF4444';
    verdict = 'Outdoor Running Prohibited';
    summary = 'Severe particulate pollution. Minute ventilation during running escalates up to 140 L/min, forcing micro-particles deep into alveolar blood barriers. Move all sessions to an indoor treadmill.';
    lowSafe = false; lowDur = '0 mins (Prohibited)'; lowNote = 'Deep alveolar deposition even at resting ventilatory pace.';
    modSafe = false; modDur = '0 mins (Prohibited)'; modNote = 'High risk of acute airway bronchoconstriction.';
    highSafe = false; highDur = '0 mins (Prohibited)'; highNote = 'Dangerous systemic vascular strain.';
  } else if (aqi > 150) {
    badge = 'HIGH RISK / UNHEALTHY';
    color = '#EF4444';
    verdict = 'Indoor Treadmill Strongly Recommended';
    summary = 'Particulate concentrations exceed safe exercise thresholds. Deep mouth-breathing bypasses upper airway filtration. Outdoor runs should be cancelled or rescheduled.';
    lowSafe = false; lowDur = '0 - 20 mins Max'; lowNote = 'Only very light walk/jog in shaded green park if essential.';
    modSafe = false; modDur = '0 mins (Avoid)'; modNote = 'Avoid outdoor tempo blocks. Shift to indoor air-conditioned treadmill.';
    highSafe = false; highDur = '0 mins (Prohibited)'; highNote = 'High ventilatory volume (>100 L/min) directly exposes lung tissues to hazardous particulates.';
  } else if (aqi > 100) {
    badge = 'ELEVATED POLLUTION CAUTION';
    color = '#F97316';
    verdict = 'Short Low-Intensity Only';
    summary = 'Elevated PM2.5 levels trigger airway hyper-reactivity during sustained intense running. Restrict speedwork and cap volume.';
    lowSafe = true; lowDur = '30 - 45 mins'; lowNote = 'Keep heart rate strictly in Zone 1-2 to preserve nasal breathing filter.';
    modSafe = false; modDur = '15 - 20 mins Max'; modNote = 'Limit intense tempo intervals. Move speed sessions to treadmill.';
    highSafe = false; highDur = '0 mins (Avoid)'; highNote = 'Deep mouth breathing (>100 L/min) draws unfiltered pollutants past the pharynx.';
  } else if (aqi > 50) {
    badge = 'MODERATE / ACCEPTABLE';
    color = '#F59E0B';
    verdict = 'Safe for General Population';
    summary = 'Air quality is within acceptable bounds for most healthy runners. Highly sensitive or asthmatic runners should stay hydrated and avoid busy roadsides.';
    lowSafe = true; lowDur = '60 - 75 mins'; lowNote = 'Safe for general long slow distance (LSD) and recovery sessions.';
    modSafe = true; modDur = '35 - 45 mins'; modNote = 'Suitable for tempo runs. Prefer green parks away from highway vehicle exhausts.';
    highSafe = true; highDur = '20 - 30 mins'; highNote = 'Keep interval reps controlled with full recovery between sets.';
  }

  return {
    badge,
    color,
    verdict,
    summary,
    durations: {
      low: { duration: lowDur, safe: lowSafe, note: lowNote },
      moderate: { duration: modDur, safe: modSafe, note: modNote },
      high: { duration: highDur, safe: highSafe, note: highNote }
    },
    best_window: {
      recommendation: 'Early Morning (06:00 - 08:00)',
      time_range: '06:00 - 08:00',
      reason: 'Atmospheric boundary layer dynamics typically produce lower ground PM2.5 and lower heat stress in early morning hours.'
    },
    heat_stress: {
      temp_c: temp,
      humidity_pct: rh,
      apparent_temp_c: appTemp
    }
  };
}

async function fetchAirQualityUniversal({ lat, lon, name, stateName = 'Malaysia', countryName = 'Malaysia', station_id = null }) {
  // 1. Try backend server if reachable
  const endpoints = [
    `/api/air-quality?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}${station_id ? `&station_id=${station_id}` : ''}`,
    `http://localhost:5050/api/air-quality?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}${station_id ? `&station_id=${station_id}` : ''}`
  ];

  for (const ep of endpoints) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(ep, { signal: controller.signal });
      clearTimeout(tid);
      if (res.ok) {
        const data = await res.json();
        if (!data.error) return data;
      }
    } catch (e) {
      // Backend unavailable, fallback to direct browser fetch
    }
  }

  // 2. Direct browser fetch from Open-Meteo & WAQI (no backend required!)
  const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm2_5,pm10,ozone,european_aqi,us_aqi&past_days=1&forecast_days=2&timezone=auto`;
  const wxUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m&timezone=auto`;

  const [aqRes, wxRes] = await Promise.allSettled([
    fetch(aqUrl).then(r => r.json()),
    fetch(wxUrl).then(r => r.json())
  ]);

  const omAq = aqRes.status === 'fulfilled' ? aqRes.value : null;
  const omWx = wxRes.status === 'fulfilled' ? wxRes.value : null;

  if (!omAq || !omAq.current) {
    throw new Error('Unable to retrieve air quality data. Please check internet connection.');
  }

  const cur = omAq.current;
  const hourly = omAq.hourly || {};
  const wxCur = (omWx && omWx.current) || {};

  let waqiData = null;
  const waqiToken = localStorage.getItem('waqi_token') || '';
  if (station_id && waqiToken) {
    try {
      const wRes = await fetch(`https://api.waqi.info/feed/@${station_id}/?token=${encodeURIComponent(waqiToken)}`);
      if (wRes.ok) {
        const wJson = await wRes.json();
        if (wJson.status === 'ok' && wJson.data) waqiData = wJson.data;
      }
    } catch (e) {}
  }

  const nowIso = cur.time || new Date().toISOString().slice(0, 16);
  const nowHour = nowIso.slice(0, 13);
  const timeArr = hourly.time || [];
  let curIdx = timeArr.findIndex(t => t.startsWith(nowHour));
  if (curIdx < 0) curIdx = Math.min(24, Math.max(0, timeArr.length - 24));

  const pastTimes = timeArr.slice(Math.max(0, curIdx - 23), curIdx + 1);
  const pastPm25 = (hourly.pm2_5 || []).slice(Math.max(0, curIdx - 23), curIdx + 1);

  const futTimes = timeArr.slice(curIdx, Math.min(timeArr.length, curIdx + 25));
  const futPm25 = (hourly.pm2_5 || []).slice(curIdx, Math.min(timeArr.length, curIdx + 25));

  let pm25AqiVal = null;
  let pm25ConcVal = null;

  if (waqiData && waqiData.iaqi && waqiData.iaqi.pm25 && waqiData.iaqi.pm25.v !== undefined && waqiData.iaqi.pm25.v !== null) {
    pm25AqiVal = Math.round(parseFloat(waqiData.iaqi.pm25.v));
  }
  if (cur.pm2_5 !== undefined && cur.pm2_5 !== null) {
    pm25ConcVal = Math.round(parseFloat(cur.pm2_5) * 10) / 10;
  }

  // Authoritative separation: WAQI is AQI sub-index; Open-Meteo cur.pm2_5 is µg/m³
  if (pm25AqiVal !== null && pm25ConcVal !== null) {
    if (waqiData && waqiData.iaqi && waqiData.iaqi.pm25) {
      pm25ConcVal = aqiToPm25Conc(pm25AqiVal);
    }
  } else if (pm25AqiVal !== null && pm25ConcVal === null) {
    pm25ConcVal = aqiToPm25Conc(pm25AqiVal);
  } else if (pm25ConcVal !== null && pm25AqiVal === null) {
    pm25AqiVal = calcPm25Aqi(pm25ConcVal);
  } else {
    pm25AqiVal = 50;
    pm25ConcVal = 12.0;
  }

  // Identify if this station has verified ground station historical measurements
  let existingPast = null;
  const targetKey = (typeof name === 'string' && name.toLowerCase().includes('perai')) ? 'perai' :
                    (typeof name === 'string' && (name.toLowerCase().includes('kuala lumpur') || name.toLowerCase() === 'kl')) ? 'kuala-lumpur' :
                    (typeof name === 'string' && name.toLowerCase().includes('alor setar')) ? 'alor-setar' : null;

  if (targetKey && state.presetData && state.presetData[targetKey] && state.presetData[targetKey].pm25) {
    if (state.presetData[targetKey].pm25.past_24h && state.presetData[targetKey].pm25.past_24h.pm25_aqi && state.presetData[targetKey].pm25.past_24h.pm25_aqi.length >= 12) {
      existingPast = state.presetData[targetKey].pm25.past_24h;
    }
  }

  let finalPastTimes = [];
  let finalPastPm25Conc = [];
  let finalPastPm25Aqi = [];

  if (existingPast && existingPast.pm25_aqi && existingPast.pm25_aqi.length > 0) {
    finalPastTimes = [...existingPast.time];
    finalPastPm25Aqi = [...existingPast.pm25_aqi];
    finalPastPm25Conc = existingPast.pm2_5 ? [...existingPast.pm2_5] : finalPastPm25Aqi.map(a => aqiToPm25Conc(a));

    if (pm25AqiVal !== null) {
      finalPastPm25Aqi[finalPastPm25Aqi.length - 1] = pm25AqiVal;
    }
    if (pm25ConcVal !== null) {
      finalPastPm25Conc[finalPastPm25Conc.length - 1] = pm25ConcVal;
    }
  } else {
    const curModelConc = (hourly.pm2_5 && curIdx >= 0 && hourly.pm2_5[curIdx] !== undefined) ? hourly.pm2_5[curIdx] : (cur.pm2_5 || 15.0);
    const scaleRatio = (curModelConc > 0 && pm25ConcVal > 0) ? (pm25ConcVal / curModelConc) : 1.0;

    finalPastTimes = pastTimes;
    finalPastPm25Conc = pastPm25.map((c, idx) => {
      if (idx === pastPm25.length - 1 && pm25ConcVal !== null) return pm25ConcVal;
      return Math.round(c * scaleRatio * 10) / 10;
    });
    finalPastPm25Aqi = finalPastPm25Conc.map((c, idx) => {
      if (idx === finalPastPm25Conc.length - 1 && pm25AqiVal !== null) return pm25AqiVal;
      return calcPm25Aqi(c);
    });
  }

  // Smooth future 24h forecast series
  const curModelConcFut = (hourly.pm2_5 && curIdx >= 0 && hourly.pm2_5[curIdx] !== undefined) ? hourly.pm2_5[curIdx] : (cur.pm2_5 || 15.0);
  const futScaleRatio = (curModelConcFut > 0 && pm25ConcVal > 0) ? (pm25ConcVal / curModelConcFut) : 1.0;

  const finalFutTimes = futTimes;
  const finalFutPm25Conc = futPm25.map((c, idx) => {
    if (idx === 0 && pm25ConcVal !== null) return pm25ConcVal;
    const blend = Math.max(0, 1 - (idx / 24));
    const effectiveScale = 1.0 + (futScaleRatio - 1.0) * blend;
    return Math.round(c * effectiveScale * 10) / 10;
  });
  const finalFutPm25Aqi = finalFutPm25Conc.map((c, idx) => {
    if (idx === 0 && pm25AqiVal !== null) return pm25AqiVal;
    return calcPm25Aqi(c);
  });

  let overallAqiVal = (waqiData && typeof waqiData.aqi === 'number') ? waqiData.aqi : (cur.us_aqi || pm25AqiVal);

  const cat = getAqiCategoryFull(overallAqiVal);
  const pm25Cat = getAqiCategoryFull(pm25AqiVal);

  let minToday = finalPastPm25Aqi.length ? Math.min(...finalPastPm25Aqi) : Math.round(pm25AqiVal * 0.7);
  let maxToday = finalPastPm25Aqi.length ? Math.max(...finalPastPm25Aqi) : Math.round(pm25AqiVal * 1.3);
  if (waqiData && waqiData.forecast && waqiData.forecast.daily && waqiData.forecast.daily.pm25 && waqiData.forecast.daily.pm25.length > 0) {
    const fToday = waqiData.forecast.daily.pm25[0];
    if (fToday.min !== undefined && fToday.min !== null) minToday = fToday.min;
    if (fToday.max !== undefined && fToday.max !== null) maxToday = fToday.max;
  }

  // Format local clock time from ISO string
  const formatTimeStr = (iso) => {
    if (!iso) return '--:--';
    if (iso.includes('T')) return iso.split('T')[1].substring(0, 5);
    const m = iso.match(/(\d{1,2}:\d{2})/);
    if (m) return m[1];
    return iso.substring(11, 16) || iso;
  };

  // Past Trend Stats
  let pPeakAqiVal = -Infinity, pPeakAqiIdx = 0;
  let pLowAqiVal = Infinity, pLowAqiIdx = 0;
  for (let i = 0; i < finalPastPm25Aqi.length; i++) {
    if (finalPastPm25Aqi[i] > pPeakAqiVal) { pPeakAqiVal = finalPastPm25Aqi[i]; pPeakAqiIdx = i; }
    if (finalPastPm25Aqi[i] < pLowAqiVal) { pLowAqiVal = finalPastPm25Aqi[i]; pLowAqiIdx = i; }
  }
  if (pPeakAqiVal === -Infinity) { pPeakAqiVal = pm25AqiVal; pPeakAqiIdx = 0; }
  if (pLowAqiVal === Infinity) { pLowAqiVal = pm25AqiVal; pLowAqiIdx = 0; }

  let pPeakConcVal = -Infinity, pPeakConcIdx = 0;
  let pLowConcVal = Infinity, pLowConcIdx = 0;
  for (let i = 0; i < finalPastPm25Conc.length; i++) {
    if (finalPastPm25Conc[i] > pPeakConcVal) { pPeakConcVal = finalPastPm25Conc[i]; pPeakConcIdx = i; }
    if (finalPastPm25Conc[i] < pLowConcVal) { pLowConcVal = finalPastPm25Conc[i]; pLowConcIdx = i; }
  }
  if (pPeakConcVal === -Infinity) { pPeakConcVal = pm25ConcVal; pPeakConcIdx = 0; }
  if (pLowConcVal === Infinity) { pLowConcVal = pm25ConcVal; pLowConcIdx = 0; }

  const pLimit = finalPastPm25Aqi.length;
  const pDriftAqi = pLimit >= 7 ? (finalPastPm25Aqi[pLimit - 1] - finalPastPm25Aqi[pLimit - 7]) : 0;
  const pDriftConc = finalPastPm25Conc.length >= 7 ? Math.round((finalPastPm25Conc[pLimit - 1] - finalPastPm25Conc[pLimit - 7]) * 10) / 10 : 0;

  const pPeakTime = formatTimeStr(finalPastTimes[pPeakAqiIdx]);
  const pLowTime = formatTimeStr(finalPastTimes[pLowAqiIdx]);
  const pPeakConcTime = formatTimeStr(finalPastTimes[pPeakConcIdx]);
  const pLowConcTime = formatTimeStr(finalPastTimes[pLowConcIdx]);

  let pTraj = 'STABLE';
  let pDirLabel = `Stable (${pDriftAqi >= 0 ? '+' : ''}${pDriftAqi} pts past 6h)`;
  let pColor = '#F59E0B';
  let pArrow = '→';
  if (pDriftAqi >= 6) {
    pTraj = 'RISING';
    pDirLabel = `Worsened (+${pDriftAqi} pts past 6h)`;
    pColor = '#EF4444';
    pArrow = '↗';
  } else if (pDriftAqi <= -6) {
    pTraj = 'FALLING';
    pDirLabel = `Improved (${pDriftAqi} pts past 6h)`;
    pColor = '#10B981';
    pArrow = '↘';
  }

  const past_trend = {
    trajectory: pTraj,
    direction_label: pDirLabel,
    arrow: pArrow,
    color: pColor,
    drift_6h: pDriftAqi,
    drift_6h_conc: pDriftConc,
    peak_aqi: { value: pPeakAqiVal, time: pPeakTime },
    peak_val: pPeakAqiVal,
    lowest_aqi: { value: pLowAqiVal, time: pLowTime },
    clean_val: pLowAqiVal,
    peak_conc: { value: Math.round(pPeakConcVal * 10) / 10, time: pPeakConcTime },
    lowest_conc: { value: Math.round(pLowConcVal * 10) / 10, time: pLowConcTime },
    summary: `Past 24h: PM2.5 AQI shifted by ${pDriftAqi >= 0 ? '+' : ''}${pDriftAqi} pts in last 6h, reaching a past peak of ${pPeakAqiVal} AQI at ~${pPeakTime} and a low of ${pLowAqiVal} AQI at ~${pLowTime}.`
  };

  // Future Trend Stats
  const fLimit = Math.min(24, finalFutPm25Aqi.length);
  let fPeakAqiVal = -Infinity, fPeakAqiIdx = 0;
  let fLowAqiVal = Infinity, fLowAqiIdx = 0;
  for (let i = 0; i < fLimit; i++) {
    if (finalFutPm25Aqi[i] > fPeakAqiVal) { fPeakAqiVal = finalFutPm25Aqi[i]; fPeakAqiIdx = i; }
    if (finalFutPm25Aqi[i] < fLowAqiVal) { fLowAqiVal = finalFutPm25Aqi[i]; fLowAqiIdx = i; }
  }
  if (fPeakAqiVal === -Infinity) { fPeakAqiVal = pm25AqiVal; fPeakAqiIdx = 0; }
  if (fLowAqiVal === Infinity) { fLowAqiVal = pm25AqiVal; fLowAqiIdx = 0; }

  let fPeakConcVal = -Infinity, fPeakConcIdx = 0;
  let fLowConcVal = Infinity, fLowConcIdx = 0;
  for (let i = 0; i < fLimit; i++) {
    if (finalFutPm25Conc[i] > fPeakConcVal) { fPeakConcVal = finalFutPm25Conc[i]; fPeakConcIdx = i; }
    if (finalFutPm25Conc[i] < fLowConcVal) { fLowConcVal = finalFutPm25Conc[i]; fLowConcIdx = i; }
  }
  if (fPeakConcVal === -Infinity) { fPeakConcVal = pm25ConcVal; fPeakConcIdx = 0; }
  if (fLowConcVal === Infinity) { fLowConcVal = pm25ConcVal; fLowConcIdx = 0; }

  const nextIdx = Math.min(6, fLimit - 1);
  const fDriftAqi = fLimit >= 2 ? (finalFutPm25Aqi[nextIdx] - finalFutPm25Aqi[0]) : 0;
  const fDriftConc = fLimit >= 2 ? Math.round((finalFutPm25Conc[nextIdx] - finalFutPm25Conc[0]) * 10) / 10 : 0;

  const fPeakTime = formatTimeStr(finalFutTimes[fPeakAqiIdx]);
  const fLowTime = formatTimeStr(finalFutTimes[fLowAqiIdx]);
  const fPeakConcTime = formatTimeStr(finalFutTimes[fPeakConcIdx]);
  const fLowConcTime = formatTimeStr(finalFutTimes[fLowConcIdx]);

  let fTraj = 'STABLE';
  let fDir = 'stable';
  let fDirLabel = 'Stable (Holding Steady)';
  let fArrow = '→';
  let fColor = '#F59E0B';
  if (fDriftAqi <= -6) {
    fTraj = 'FALLING';
    fDir = 'improving';
    fDirLabel = 'Improving (Dropping)';
    fArrow = '↘';
    fColor = '#10B981';
  } else if (fDriftAqi >= 6) {
    fTraj = 'RISING';
    fDir = 'worsening';
    fDirLabel = 'Worsening (Rising)';
    fArrow = '↗';
    fColor = '#EF4444';
  }

  const future_trend = {
    trajectory: fTraj,
    direction: fDir,
    direction_label: fDirLabel,
    arrow: fArrow,
    color: fColor,
    drift_6h_aqi: fDriftAqi,
    drift_6h_conc: fDriftConc,
    change_6h: fDriftAqi,
    peak_aqi: { value: fPeakAqiVal, time: fPeakTime },
    peak_val: fPeakAqiVal,
    peak_time: fPeakTime,
    lowest_aqi: fLowAqiVal,
    clean_val: fLowAqiVal,
    lowest_time: fLowTime,
    peak_conc: { value: Math.round(fPeakConcVal * 10) / 10, time: fPeakConcTime },
    cleanest_window: { aqi: fLowAqiVal, conc: Math.round(fLowConcVal * 10) / 10, time: fLowTime },
    summary: `${fDirLabel}: PM2.5 AQI projected to shift by ${fDriftAqi >= 0 ? '+' : ''}${fDriftAqi} pts over next 6h, reaching a cleanest window of ${fLowAqiVal} AQI at ~${fLowTime}.`
  };

  return {
    location: {
      name: name,
      state: stateName,
      country: countryName,
      latitude: parseFloat(lat),
      longitude: parseFloat(lon)
    },
    overall_aqi: overallAqiVal,
    category: cat,
    pm25: {
      sub_index: pm25AqiVal,
      concentration_ugm3: pm25ConcVal,
      aqi_reading: pm25AqiVal,
      category: pm25Cat,
      who_comparison: {
        safe: pm25ConcVal <= 15.0,
        ratio: (pm25ConcVal / 15.0).toFixed(1),
        status: pm25ConcVal <= 15.0 ? 'Within Safe Limits' : `${(pm25ConcVal / 15.0).toFixed(1)}x Over Safe Limit`
      },
      min_today: minToday,
      max_today: maxToday,
      past_trend,
      future_trend,
      trend_24h: {
        time: finalFutTimes,
        pm2_5: finalFutPm25Conc,
        pm25_aqi: finalFutPm25Aqi
      },
      past_24h: {
        time: finalPastTimes,
        pm2_5: finalPastPm25Conc,
        pm25_aqi: finalPastPm25Aqi
      }
    },
    other_pollutants: {
      pm10: cur.pm10,
      o3: cur.ozone,
      no2: cur.nitrogen_dioxide,
      so2: cur.sulphur_dioxide,
      co: cur.carbon_monoxide,
      eaqi: cur.european_aqi
    },
    runner_advice: buildRunnerAdviceClient(overallAqiVal, pm25ConcVal, wxCur),
    aqicn_ground: waqiData ? {
      station: waqiData.city ? waqiData.city.name : name,
      updated: (waqiData.time && waqiData.time.s) || 'Live',
      aqi: waqiData.aqi
    } : null,
    openmeteo_model: {
      time: cur.time,
      european_aqi: cur.european_aqi,
      us_aqi: cur.us_aqi,
      pm25_concentration: { value: cur.pm2_5, unit: 'µg/m³' },
      pm10_concentration: { value: cur.pm10, unit: 'µg/m³' }
    },
    primary_source: waqiData ? 'DOE Malaysia Continuous Station' : 'Atmospheric Modeling & Reanalysis'
  };
}

function initMalaysiaStateExplorer() {
  if (!elements.stateSelect || !elements.stationSelect) return;

  const states = Object.keys(MALAYSIA_STATIONS_DATA);
  elements.stateSelect.innerHTML = states.map(st => `<option value="${st}">${st}</option>`).join('');

  const defaultState = states.includes("Pulau Pinang") ? "Pulau Pinang" : states[0];
  elements.stateSelect.value = defaultState;
  updateStationDropdownForState(defaultState);

  elements.stateSelect.addEventListener('change', () => {
    updateStationDropdownForState(elements.stateSelect.value);
  });

  if (elements.btnViewStation) {
    elements.btnViewStation.addEventListener('click', () => {
      const stateName = elements.stateSelect.value;
      const stationId = parseInt(elements.stationSelect.value, 10);
      const stList = MALAYSIA_STATIONS_DATA[stateName] || [];
      const st = stList.find(s => s.id === stationId);
      if (st) loadStation(st);
    });
  }

  elements.stationSelect.addEventListener('change', () => {
    const stateName = elements.stateSelect.value;
    const stationId = parseInt(elements.stationSelect.value, 10);
    const stList = MALAYSIA_STATIONS_DATA[stateName] || [];
    const st = stList.find(s => s.id === stationId);
    if (st) loadStation(st);
  });
}

function updateStationDropdownForState(stateName) {
  const stations = MALAYSIA_STATIONS_DATA[stateName] || [];
  elements.stationSelect.innerHTML = stations.map(st => 
    `<option value="${st.id}">${st.area || st.name} (Station #${st.id})</option>`
  ).join('');

  if (elements.stateChipsList) {
    elements.stateChipsList.innerHTML = stations.map(st => `
      <button class="station-chip" data-station-id="${st.id}" data-lat="${st.geo[0]}" data-lon="${st.geo[1]}" data-name="${st.area || st.name}">
        <span>${st.area || st.name}</span>
        <span class="chip-id">#${st.id}</span>
      </button>
    `).join('');

    elements.stateChipsList.querySelectorAll('.station-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.getAttribute('data-station-id'), 10);
        const st = stations.find(s => s.id === id);
        if (st) {
          elements.stationSelect.value = id;
          loadStation(st);
        }
      });
    });
  }
}

async function loadStation(st) {
  showLoading(`Retrieving live station data for ${st.area || st.name} (DOE Station #${st.id})...`);
  hideError();

  elements.tabPerai.classList.remove('active');
  elements.tabKL.classList.remove('active');
  elements.tabAlorSetar.classList.remove('active');
  if (elements.tabSaved) elements.tabSaved.classList.remove('active');
  elements.tabCompare.classList.remove('active');

  elements.singleLocationView.classList.remove('hidden');
  elements.compareView.classList.add('hidden');

  if (elements.stateChipsList) {
    elements.stateChipsList.querySelectorAll('.station-chip').forEach(chip => {
      chip.classList.toggle('active', parseInt(chip.getAttribute('data-station-id'), 10) === st.id);
    });
  }

  try {
    const data = await fetchAirQualityUniversal({
      lat: st.geo[0],
      lon: st.geo[1],
      name: st.area || st.name,
      stateName: st.state || 'Malaysia',
      countryName: 'Malaysia',
      station_id: st.id
    });
    renderDashboard(data);
    hideLoading();
  } catch (err) {
    console.error('Station load error:', err);
    showError(`Failed to fetch station data for ${st.name}: ${err.message}`);
    hideLoading();
  }
}

// DOM Elements
const elements = {
  // Navigation & Controls
  tabPerai: document.getElementById('tabPerai'),
  tabKL: document.getElementById('tabKL'),
  tabAlorSetar: document.getElementById('tabAlorSetar'),
  tabSaved: document.getElementById('tabSaved'),
  tabSavedName: document.getElementById('tabSavedName'),
  badgeSaved: document.getElementById('badgeSaved'),
  tabCompare: document.getElementById('tabCompare'),
  badgePerai: document.getElementById('badgePerai'),
  badgeKL: document.getElementById('badgeKL'),
  badgeAlor: document.getElementById('badgeAlor'),
  refreshBtn: document.getElementById('refreshBtn'),
  refreshIcon: document.getElementById('refreshIcon'),
  autoRefreshSelect: document.getElementById('autoRefreshSelect'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeIconSun: document.getElementById('themeIconSun'),
  themeIconMoon: document.getElementById('themeIconMoon'),
  
  // Search
  searchInput: document.getElementById('searchInput'),
  searchDropdown: document.getElementById('searchDropdown'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  geoBtn: document.getElementById('geoBtn'),

  // Malaysian State & Station Explorer
  stateSelect: document.getElementById('stateSelect'),
  stationSelect: document.getElementById('stationSelect'),
  btnViewStation: document.getElementById('btnViewStation'),
  stateChipsList: document.getElementById('stateChipsList'),

  // Views & Banners
  singleLocationView: document.getElementById('singleLocationView'),
  compareView: document.getElementById('compareView'),
  loadingOverlay: document.getElementById('loadingOverlay'),
  loadingText: document.getElementById('loadingText'),
  errorBanner: document.getElementById('errorBanner'),
  errorMessage: document.getElementById('errorMessage'),
  retryBtn: document.getElementById('retryBtn'),

  // Location Header
  locName: document.getElementById('locName'),
  locSub: document.getElementById('locSub'),
  locCoords: document.getElementById('locCoords'),
  locUpdated: document.getElementById('locUpdated'),
  locSource: document.getElementById('locSource'),
  btnSaveLocation: document.getElementById('btnSaveLocation'),
  btnSaveLocationText: document.getElementById('btnSaveLocationText'),

  // Hero AQI
  aqiGaugeCircle: document.getElementById('aqiGaugeCircle'),
  aqiValue: document.getElementById('aqiValue'),
  aqiBadge: document.getElementById('aqiBadge'),
  aqiMalayBadge: document.getElementById('aqiMalayBadge'),
  aqiHealthSummary: document.getElementById('aqiHealthSummary'),
  aqiScaleMarker: document.getElementById('aqiScaleMarker'),

  // Hero PM2.5
  pm25Aqi: document.getElementById('pm25Aqi'),
  pm25Ugm3: document.getElementById('pm25Ugm3'),
  pm25Range: document.getElementById('pm25Range'),
  whoComparison: document.getElementById('whoComparison'),
  pm25Explanation: document.getElementById('pm25Explanation'),

  // Other Pollutants
  valPm10: document.getElementById('valPm10'),
  rangePm10: document.getElementById('rangePm10'),
  valO3: document.getElementById('valO3'),
  valNo2: document.getElementById('valNo2'),
  valSo2: document.getElementById('valSo2'),
  valCo: document.getElementById('valCo'),
  valEaqi: document.getElementById('valEaqi'),

  // Weather
  valHumidity: document.getElementById('valHumidity'),
  valWind: document.getElementById('valWind'),
  valPressure: document.getElementById('valPressure'),

  // Health Advisory
  healthLevelBadge: document.getElementById('healthLevelBadge'),
  adviceOutdoor: document.getElementById('adviceOutdoor'),
  adviceMask: document.getElementById('adviceMask'),
  adviceIndoor: document.getElementById('adviceIndoor'),
  adviceSensitive: document.getElementById('adviceSensitive'),

  // Runner Hub
  runnerBadge: document.getElementById('runnerBadge'),
  runnerVerdictIcon: document.getElementById('runnerVerdictIcon'),
  runnerVerdictTitle: document.getElementById('runnerVerdictTitle'),
  runnerVerdictDesc: document.getElementById('runnerVerdictDesc'),
  durLow: document.getElementById('durLow'),
  statusLow: document.getElementById('statusLow'),
  noteLow: document.getElementById('noteLow'),
  durMod: document.getElementById('durMod'),
  statusMod: document.getElementById('statusMod'),
  noteMod: document.getElementById('noteMod'),
  durHigh: document.getElementById('durHigh'),
  statusHigh: document.getElementById('statusHigh'),
  noteHigh: document.getElementById('noteHigh'),
  runnerBestWindow: document.getElementById('runnerBestWindow'),
  runnerHeatIndex: document.getElementById('runnerHeatIndex'),
  runnerHeatWarning: document.getElementById('runnerHeatWarning'),

  // Chart & Trend Controls & Metrics
  btnRangeAll: document.getElementById('btnRangeAll'),
  btnRangePast: document.getElementById('btnRangePast'),
  btnRangeFuture: document.getElementById('btnRangeFuture'),
  btnChartPm25Aqi: document.getElementById('btnChartPm25Aqi'),
  btnChartPm25: document.getElementById('btnChartPm25'),
  btnChartAqi: document.getElementById('btnChartAqi'),
  forecastChartCanvas: document.getElementById('forecastChart'),
  chartPastTraj: document.getElementById('chartPastTraj'),
  chartPastPeak: document.getElementById('chartPastPeak'),
  chartPastLow: document.getElementById('chartPastLow'),
  chartPastShift: document.getElementById('chartPastShift'),
  chartTrendDir: document.getElementById('chartTrendDir'),
  chartTrendPeak: document.getElementById('chartTrendPeak'),
  chartTrendClean: document.getElementById('chartTrendClean'),
  chartFutShift: document.getElementById('chartFutShift'),
  pm25TrendText: document.getElementById('pm25TrendText'),

  // Transparency Table
  sourcesTableBody: document.getElementById('sourcesTableBody'),

  // Compare View
  compareGrid: document.getElementById('compareGrid'),
  compareTableBody: document.getElementById('compareTableBody')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initEventListeners();
  initSavedTab();
  initMalaysiaStateExplorer();
  initMap();
  initAutoRefresh();
  loadInitialData();
});

// Theme Management
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcons();
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('aeropulse_theme', state.theme);
  updateThemeIcons();
  if (state.chartInstance) {
    updateChart(state.currentData);
  }
}

function updateThemeIcons() {
  if (state.theme === 'dark') {
    elements.themeIconSun.classList.remove('hidden');
    elements.themeIconMoon.classList.add('hidden');
  } else {
    elements.themeIconSun.classList.add('hidden');
    elements.themeIconMoon.classList.remove('hidden');
  }
}

// Event Listeners
function initEventListeners() {
  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  // Tabs
  elements.tabPerai.addEventListener('click', () => switchCityTab('perai'));
  elements.tabKL.addEventListener('click', () => switchCityTab('kuala-lumpur'));
  elements.tabAlorSetar.addEventListener('click', () => switchCityTab('alor-setar'));
  if (elements.tabSaved) elements.tabSaved.addEventListener('click', loadSavedTabLocation);
  elements.tabCompare.addEventListener('click', switchCompareView);

  // Save current location as 4th Tab
  if (elements.btnSaveLocation) {
    elements.btnSaveLocation.addEventListener('click', saveCurrentLocationAsTab4);
  }

  // Refresh
  elements.refreshBtn.addEventListener('click', () => {
    refreshAllData(true);
  });
  elements.retryBtn.addEventListener('click', () => {
    refreshAllData(true);
  });

  // Auto-refresh select
  elements.autoRefreshSelect.addEventListener('change', (e) => {
    const seconds = parseInt(e.target.value, 10);
    resetAutoRefresh(seconds);
  });

  // Search input with debounce
  let searchTimeout = null;
  elements.searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val.length > 0) {
      elements.clearSearchBtn.classList.remove('hidden');
    } else {
      elements.clearSearchBtn.classList.add('hidden');
      elements.searchDropdown.classList.add('hidden');
    }

    clearTimeout(searchTimeout);
    if (val.length >= 2) {
      searchTimeout = setTimeout(() => handleSearchInput(val), 250);
    }
  });

  elements.searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = elements.searchInput.value.trim();
      if (query) {
        elements.searchDropdown.classList.add('hidden');
        loadAirQualityByQuery(query);
      }
    }
  });

  elements.clearSearchBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    elements.clearSearchBtn.classList.add('hidden');
    elements.searchDropdown.classList.add('hidden');
  });

  // Geolocation button
  elements.geoBtn.addEventListener('click', handleGeolocation);

  // Quick suggestion chips
  document.querySelectorAll('.quick-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-q');
      elements.searchInput.value = q;
      elements.clearSearchBtn.classList.remove('hidden');
      loadAirQualityByQuery(q);
    });
  });

  // Timeline range toggles (48h Full, Past 24h, Next 24h)
  if (elements.btnRangeAll) {
    elements.btnRangeAll.addEventListener('click', () => {
      state.timelineRange = 'all';
      elements.btnRangeAll.classList.add('active');
      if (elements.btnRangePast) elements.btnRangePast.classList.remove('active');
      if (elements.btnRangeFuture) elements.btnRangeFuture.classList.remove('active');
      updateChart(state.currentData);
    });
  }

  if (elements.btnRangePast) {
    elements.btnRangePast.addEventListener('click', () => {
      state.timelineRange = 'past';
      elements.btnRangePast.classList.add('active');
      if (elements.btnRangeAll) elements.btnRangeAll.classList.remove('active');
      if (elements.btnRangeFuture) elements.btnRangeFuture.classList.remove('active');
      updateChart(state.currentData);
    });
  }

  if (elements.btnRangeFuture) {
    elements.btnRangeFuture.addEventListener('click', () => {
      state.timelineRange = 'future';
      elements.btnRangeFuture.classList.add('active');
      if (elements.btnRangeAll) elements.btnRangeAll.classList.remove('active');
      if (elements.btnRangePast) elements.btnRangePast.classList.remove('active');
      updateChart(state.currentData);
    });
  }

  // Chart toggles (PM2.5 AQI, PM2.5 µg/m³, Overall AQI)
  if (elements.btnChartPm25Aqi) {
    elements.btnChartPm25Aqi.addEventListener('click', () => {
      state.chartMode = 'pm25_aqi';
      elements.btnChartPm25Aqi.classList.add('active');
      elements.btnChartPm25.classList.remove('active');
      elements.btnChartAqi.classList.remove('active');
      updateChart(state.currentData);
    });
  }

  elements.btnChartPm25.addEventListener('click', () => {
    state.chartMode = 'pm25';
    elements.btnChartPm25.classList.add('active');
    if (elements.btnChartPm25Aqi) elements.btnChartPm25Aqi.classList.remove('active');
    elements.btnChartAqi.classList.remove('active');
    updateChart(state.currentData);
  });

  elements.btnChartAqi.addEventListener('click', () => {
    state.chartMode = 'aqi';
    elements.btnChartAqi.classList.add('active');
    if (elements.btnChartPm25Aqi) elements.btnChartPm25Aqi.classList.remove('active');
    elements.btnChartPm25.classList.remove('active');
    updateChart(state.currentData);
  });

  // Close search dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!elements.searchInput.contains(e.target) && !elements.searchDropdown.contains(e.target)) {
      elements.searchDropdown.classList.add('hidden');
    }
  });
}

// Initial Data Load
async function loadInitialData() {
  showLoading('Connecting to official stations & satellite models...');
  hideError();

  try {
    // 1. Fetch presets (Perai, KL, Alor Setar) in parallel from backend
    const endpoints = ['/api/preset-cities', 'http://localhost:5050/api/preset-cities'];
    let presetsResponse = null;
    for (const ep of endpoints) {
      try {
        const r = await fetch(ep);
        if (r.ok) { presetsResponse = r; break; }
      } catch (e) {}
    }
    if (!presetsResponse) throw new Error('Failed to retrieve preset stations');
    state.presetData = await presetsResponse.json();

    // Update tab badges
    updateTabBadges();

    // 2. Set default active city to Perai (or whatever is in state)
    if (state.presetData[state.currentCityKey]) {
      renderDashboard(state.presetData[state.currentCityKey]);
    }

    // 3. Fetch all Malaysia stations for the map
    fetchMapStations();

    hideLoading();
  } catch (err) {
    console.error('Initial load error:', err);
    showError('Unable to connect to air quality server. Retrying...');
    hideLoading();
  }
}

// Update Top Tab Badges
function updateTabBadges() {
  const perai = state.presetData['perai'];
  if (perai && perai.overall_aqi !== null) {
    elements.badgePerai.textContent = `${perai.overall_aqi} AQI`;
    elements.badgePerai.style.backgroundColor = perai.category.color;
    elements.badgePerai.style.color = perai.category.textColor;
  }

  const kl = state.presetData['kuala-lumpur'];
  if (kl && kl.overall_aqi !== null) {
    elements.badgeKL.textContent = `${kl.overall_aqi} AQI`;
    elements.badgeKL.style.backgroundColor = kl.category.color;
    elements.badgeKL.style.color = kl.category.textColor;
  }

  const alor = state.presetData['alor-setar'];
  if (alor && alor.overall_aqi !== null) {
    elements.badgeAlor.textContent = `${alor.overall_aqi} AQI`;
    elements.badgeAlor.style.backgroundColor = alor.category.color;
    elements.badgeAlor.style.color = alor.category.textColor;
  }

  // Also update saved tab badge if present
  const saved = getSavedTabLocation();
  if (saved && saved.aqi !== undefined && saved.aqi !== null && saved.aqi !== '--') {
    if (elements.badgeSaved) {
      elements.badgeSaved.textContent = `${saved.aqi} AQI`;
      if (saved.color) elements.badgeSaved.style.backgroundColor = saved.color;
      if (saved.textColor) elements.badgeSaved.style.color = saved.textColor;
    }
  }
}

// Tab Switching
function switchCityTab(cityKey) {
  state.currentCityKey = cityKey;

  // Active styles
  elements.tabPerai.classList.toggle('active', cityKey === 'perai');
  elements.tabKL.classList.toggle('active', cityKey === 'kuala-lumpur');
  elements.tabAlorSetar.classList.toggle('active', cityKey === 'alor-setar');
  if (elements.tabSaved) elements.tabSaved.classList.remove('active');
  elements.tabCompare.classList.remove('active');

  // Views
  elements.singleLocationView.classList.remove('hidden');
  elements.compareView.classList.add('hidden');

  // If already loaded in presetData, render immediately
  if (state.presetData[cityKey]) {
    renderDashboard(state.presetData[cityKey]);
  } else {
    loadCityData(cityKey);
  }
}

function switchCompareView() {
  elements.tabPerai.classList.remove('active');
  elements.tabKL.classList.remove('active');
  elements.tabAlorSetar.classList.remove('active');
  if (elements.tabSaved) elements.tabSaved.classList.remove('active');
  elements.tabCompare.classList.add('active');

  elements.singleLocationView.classList.add('hidden');
  elements.compareView.classList.remove('hidden');

  renderCompareView();
}

// 4th Saved Tab Management
function getSavedTabLocation() {
  try {
    const raw = localStorage.getItem('aeropulse_saved_tab');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved tab from localStorage:', e);
  }
  return null;
}

function initSavedTab() {
  const saved = getSavedTabLocation();
  if (saved && saved.name) {
    if (elements.tabSavedName) elements.tabSavedName.textContent = saved.name;
    if (elements.badgeSaved) {
      elements.badgeSaved.textContent = (saved.aqi !== undefined && saved.aqi !== null && saved.aqi !== '--') ? `${saved.aqi} AQI` : '--';
      if (saved.color) elements.badgeSaved.style.backgroundColor = saved.color;
      if (saved.textColor) elements.badgeSaved.style.color = saved.textColor;
    }
  } else {
    if (elements.tabSavedName) elements.tabSavedName.textContent = '📌 Tab 4: [Empty]';
    if (elements.badgeSaved) {
      elements.badgeSaved.textContent = '--';
      elements.badgeSaved.style.backgroundColor = '';
      elements.badgeSaved.style.color = '';
    }
  }
}

function saveCurrentLocationAsTab4() {
  if (!state.currentData) {
    alert('Please wait for location data to finish loading before saving.');
    return;
  }
  const data = state.currentData;
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

  // Update Tab 4 element UI immediately
  if (elements.tabSavedName) elements.tabSavedName.textContent = savedObj.name;
  if (elements.badgeSaved) {
    elements.badgeSaved.textContent = (aqiVal !== '--') ? `${aqiVal} AQI` : '--';
    if (savedObj.color) elements.badgeSaved.style.backgroundColor = savedObj.color;
    if (savedObj.textColor) elements.badgeSaved.style.color = savedObj.textColor;
  }

  // Flash confirmation message on button
  if (elements.btnSaveLocationText) {
    elements.btnSaveLocationText.textContent = `✓ Saved as 4th Tab!`;
    if (elements.btnSaveLocation) elements.btnSaveLocation.classList.add('saved-success');
    setTimeout(() => {
      elements.btnSaveLocationText.textContent = '★ Save as 4th Tab';
      if (elements.btnSaveLocation) elements.btnSaveLocation.classList.remove('saved-success');
    }, 2200);
  }
}

async function loadSavedTabLocation() {
  const saved = getSavedTabLocation();
  if (!saved || (!saved.lat && !saved.station_id)) {
    alert("No location saved in Tab 4 yet!\n\nSearch any city or pick a station from 'Malaysia States & Stations', then click '★ Save as 4th Tab' to pin it here.");
    return;
  }

  state.currentCityKey = 'saved';

  // Active styles
  elements.tabPerai.classList.remove('active');
  elements.tabKL.classList.remove('active');
  elements.tabAlorSetar.classList.remove('active');
  if (elements.tabSaved) elements.tabSaved.classList.add('active');
  elements.tabCompare.classList.remove('active');

  elements.singleLocationView.classList.remove('hidden');
  elements.compareView.classList.add('hidden');

  showLoading(`Retrieving live air quality for saved location: ${saved.name}...`);
  hideError();

  try {
    const data = await fetchAirQualityUniversal({
      lat: saved.lat,
      lon: saved.lon,
      name: saved.name,
      stateName: saved.state || 'Malaysia',
      countryName: saved.country || 'Malaysia',
      station_id: saved.station_id || null
    });
    renderDashboard(data);

    // Keep badge up to date with newest reading
    if (data.overall_aqi !== null && data.overall_aqi !== undefined) {
      saved.aqi = data.overall_aqi;
      if (data.category) {
        saved.color = data.category.color;
        saved.textColor = data.category.textColor;
      }
      try {
        localStorage.setItem('aeropulse_saved_tab', JSON.stringify(saved));
      } catch (e) {}
      if (elements.badgeSaved) {
        elements.badgeSaved.textContent = `${data.overall_aqi} AQI`;
        if (saved.color) elements.badgeSaved.style.backgroundColor = saved.color;
        if (saved.textColor) elements.badgeSaved.style.color = saved.textColor;
      }
    }
    hideLoading();
  } catch (err) {
    console.error('Failed to load saved location:', err);
    showError(`Failed to load ${saved.name}: ${err.message}`);
    hideLoading();
  }
}

// Fetch single city data
async function loadCityData(cityKey) {
  showLoading(`Updating air quality data for ${cityKey}...`);
  hideError();

  try {
    const endpoints = [`/api/air-quality?city=${cityKey}`, `http://localhost:5050/api/air-quality?city=${cityKey}`];
    let res = null;
    for (const ep of endpoints) {
      try {
        const r = await fetch(ep);
        if (r.ok) { res = r; break; }
      } catch (e) {}
    }
    if (!res) throw new Error('Data fetch failed');
    const data = await res.json();
    state.presetData[cityKey] = data;
    updateTabBadges();
    renderDashboard(data);
    hideLoading();
  } catch (err) {
    console.error(err);
    showError(`Failed to fetch data for ${cityKey}`);
    hideLoading();
  }
}

// Fetch custom search location by query text
async function loadAirQualityByQuery(query) {
  showLoading(`Searching air quality for "${query}"...`);
  hideError();

  const qClean = query.toLowerCase().trim();

  // 1. Check presets
  if (qClean === 'perai') return switchCityTab('perai');
  if (qClean === 'kuala lumpur' || qClean === 'kl') return switchCityTab('kuala-lumpur');
  if (qClean === 'alor setar') return switchCityTab('alor-setar');

  // 2. Check local Malaysian stations catalog
  for (const [stName, stArr] of Object.entries(MALAYSIA_STATIONS_DATA)) {
    for (const st of stArr) {
      if ((st.area && st.area.toLowerCase() === qClean) || 
          (st.name && st.name.toLowerCase() === qClean) ||
          (st.area && st.area.toLowerCase().includes(qClean)) ||
          (st.name && st.name.toLowerCase().includes(qClean))) {
        return loadStation(st);
      }
    }
  }

  // 3. Fallback to Open-Meteo geocoding
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
    const res = await fetch(geoUrl);
    if (res.ok) {
      const gData = await res.json();
      if (gData.results && gData.results.length > 0) {
        const top = gData.results[0];
        return loadByCoordinates(top.latitude, top.longitude, top.name, top.admin1 || '', top.country || '');
      }
    }
    throw new Error(`Location "${query}" not found`);
  } catch (err) {
    console.error(err);
    showError(`Could not find coordinates for "${query}": ${err.message}`);
    hideLoading();
  }
}

// Search autocomplete handler with local station matching + Open-Meteo geocoding fallback
async function handleSearchInput(query) {
  const qClean = query.toLowerCase().trim();
  if (qClean.length < 2) {
    elements.searchDropdown.classList.add('hidden');
    return;
  }

  // 1. Search in local Malaysian Station Catalog first!
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

  // 2. Also search Open-Meteo Geocoding API directly
  let geoMatches = [];
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    const res = await fetch(geoUrl);
    if (res.ok) {
      const gData = await res.json();
      geoMatches = gData.results || [];
    }
  } catch (err) {
    // Keep station matches if geocoding fails
  }

  if (stationMatches.length === 0 && geoMatches.length === 0) {
    elements.searchDropdown.innerHTML = `<div class="search-dropdown-item" style="color:var(--text-muted);">No locations found matching "${query}"</div>`;
    elements.searchDropdown.classList.remove('hidden');
    return;
  }

  let html = '';

  // Render station matches first with prominent badge
  if (stationMatches.length > 0) {
    html += stationMatches.slice(0, 5).map(st => `
      <div class="search-dropdown-item station-result-item" data-station-id="${st.id}" data-lat="${st.geo[0]}" data-lon="${st.geo[1]}" data-name="${st.area || st.name}" data-state="${st.state}">
        <div>
          <div style="display:flex; align-items:center; gap:6px;">
            <strong style="color:var(--accent-cyan);">${st.area || st.name}</strong>
            <span style="background:rgba(6,182,212,0.18); color:var(--accent-cyan); font-size:0.68rem; padding:1px 5px; border-radius:3px; font-weight:700;">🇲🇾 DOE #${st.id}</span>
          </div>
          <div class="item-sub">${st.name}, ${st.state}</div>
        </div>
        <span style="font-size: 0.72rem; color: var(--text-muted); font-family: monospace;">
          ${st.geo[0].toFixed(2)}°, ${st.geo[1].toFixed(2)}°
        </span>
      </div>
    `).join('');
  }

  // Render general geocoding matches
  if (geoMatches.length > 0) {
    html += geoMatches.map(item => `
      <div class="search-dropdown-item geo-result-item" data-lat="${item.latitude}" data-lon="${item.longitude}" data-name="${item.name}" data-state="${item.admin1 || ''}" data-country="${item.country || ''}">
        <div>
          <strong>${item.name}</strong>
          <div class="item-sub">${item.admin1 ? item.admin1 + ', ' : ''}${item.country || ''}</div>
        </div>
        <span style="font-size: 0.72rem; color: var(--accent-cyan); font-family: monospace;">
          ${item.latitude.toFixed(2)}°, ${item.longitude.toFixed(2)}°
        </span>
      </div>
    `).join('');
  }

  elements.searchDropdown.innerHTML = html;
  elements.searchDropdown.classList.remove('hidden');

  // Attach click handlers
  elements.searchDropdown.querySelectorAll('.station-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const stationId = parseInt(item.getAttribute('data-station-id'), 10);
      const stateName = item.getAttribute('data-state');
      const stList = MALAYSIA_STATIONS_DATA[stateName] || [];
      const st = stList.find(s => s.id === stationId) || {
        id: stationId,
        name: item.getAttribute('data-name'),
        area: item.getAttribute('data-name'),
        state: stateName,
        geo: [parseFloat(item.getAttribute('data-lat')), parseFloat(item.getAttribute('data-lon'))]
      };
      elements.searchInput.value = st.area || st.name;
      elements.searchDropdown.classList.add('hidden');
      loadStation(st);
    });
  });

  elements.searchDropdown.querySelectorAll('.geo-result-item').forEach(item => {
    item.addEventListener('click', () => {
      const lat = item.getAttribute('data-lat');
      const lon = item.getAttribute('data-lon');
      const name = item.getAttribute('data-name');
      const stateName = item.getAttribute('data-state') || '';
      const countryName = item.getAttribute('data-country') || '';
      elements.searchInput.value = name;
      elements.searchDropdown.classList.add('hidden');
      loadByCoordinates(lat, lon, name, stateName, countryName);
    });
  });
}

async function loadByCoordinates(lat, lon, name, stateName = '', countryName = '', station_id = null) {
  showLoading(`Fetching air quality for ${name}...`);
  hideError();

  elements.tabPerai.classList.remove('active');
  elements.tabKL.classList.remove('active');
  elements.tabAlorSetar.classList.remove('active');
  if (elements.tabSaved) elements.tabSaved.classList.remove('active');
  elements.tabCompare.classList.remove('active');

  elements.singleLocationView.classList.remove('hidden');
  elements.compareView.classList.add('hidden');

  try {
    const data = await fetchAirQualityUniversal({
      lat,
      lon,
      name,
      stateName: stateName || 'Region',
      countryName: countryName || 'Worldwide',
      station_id
    });
    renderDashboard(data);
    hideLoading();
  } catch (err) {
    console.error(err);
    showError(`Failed to fetch coordinates (${lat}, ${lon}): ${err.message}`);
    hideLoading();
  }
}

// Geolocation
function handleGeolocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
    return;
  }

  showLoading('Detecting your GPS location...');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      loadByCoordinates(lat, lon, 'My Current Location');
    },
    (err) => {
      hideLoading();
      showError('Geolocation permission denied or timed out.');
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
}

// Render Single Location Dashboard
function renderDashboard(data) {
  state.currentData = data;

  const loc = data.location || {};
  const cat = data.category || {};
  const pm25 = data.pm25 || {};
  const ground = data.aqicn_ground;
  const model = data.openmeteo_model;

  // Location Header
  elements.locName.textContent = loc.name || 'Unknown Location';
  elements.locSub.innerHTML = `${loc.state ? loc.state + ', ' : ''}${loc.country || ''} • <span id="locCoords">${loc.latitude ? loc.latitude.toFixed(2) + '°N, ' + loc.longitude.toFixed(2) + '°E' : ''}</span>`;
  elements.locUpdated.textContent = (ground && ground.updated) ? ground.updated : ((model && model.time) ? model.time : 'Live');
  elements.locSource.textContent = data.primary_source || 'Multi-Source Synthesis';

  // Hero AQI Value
  const aqiVal = data.overall_aqi !== null ? data.overall_aqi : '--';
  elements.aqiValue.textContent = aqiVal;
  elements.aqiGaugeCircle.style.borderColor = cat.color || 'var(--border-color)';
  elements.aqiGaugeCircle.style.boxShadow = `0 0 30px ${cat.color}40`;

  // Status Badge
  elements.aqiBadge.textContent = cat.category || 'Unknown';
  elements.aqiBadge.style.backgroundColor = cat.color || 'var(--text-muted)';
  elements.aqiBadge.style.color = cat.textColor || '#ffffff';
  elements.aqiMalayBadge.textContent = `Indeks Pencemaran Udara (IPU): ${cat.malayCategory || ''}`;
  elements.aqiHealthSummary.textContent = cat.health || '';

  // Scale Marker Position (0 to 300 scale mapped to 0% - 100%)
  if (typeof aqiVal === 'number') {
    const clamped = Math.min(Math.max(aqiVal, 0), 300);
    const pct = (clamped / 300) * 100;
    elements.aqiScaleMarker.style.left = `${pct}%`;
  }

  // PM2.5 Hero Card
  const pm25AqiVal = (pm25.aqi_reading !== undefined && pm25.aqi_reading !== null) ? pm25.aqi_reading : (pm25.sub_index !== null ? pm25.sub_index : '--');
  elements.pm25Aqi.textContent = pm25AqiVal;
  if (pm25.category && pm25.category.color) {
    elements.pm25Aqi.style.color = pm25.category.color;
  }
  elements.pm25Ugm3.textContent = pm25.concentration_ugm3 !== null ? pm25.concentration_ugm3.toFixed(1) : '--';
  
  const minT = pm25.min_today !== undefined && pm25.min_today !== null ? pm25.min_today : '--';
  const maxT = pm25.max_today !== undefined && pm25.max_today !== null ? pm25.max_today : '--';
  elements.pm25Range.textContent = `Min: ${minT} | Max: ${maxT}`;

  if (pm25.who_comparison) {
    elements.whoComparison.textContent = pm25.who_comparison.status;
    elements.whoComparison.style.color = pm25.who_comparison.safe ? 'var(--aqi-good)' : 'var(--aqi-unhealthy)';
  } else {
    elements.whoComparison.textContent = 'Calculating...';
  }

  if (elements.pm25TrendText) {
    const pastTr = pm25.past_trend;
    const futTr = pm25.future_trend || pm25.trend;
    if (pastTr && futTr) {
      elements.pm25TrendText.textContent = `Past 24h: ${pastTr.trajectory || 'Observed'} ➔ Next 24h: ${futTr.trajectory || futTr.direction_label || 'Stable'}`;
      elements.pm25TrendText.style.color = (futTr.trajectory === 'RISING' || pastTr.trajectory === 'RISING') ? 'var(--aqi-unhealthy)' : 'var(--accent-cyan)';
    } else if (futTr) {
      elements.pm25TrendText.textContent = `${futTr.arrow || '→'} ${futTr.direction_label || 'Stable'} (${(futTr.change_6h >= 0 ? '+' : '') + (futTr.change_6h || 0)} AQI)`;
      elements.pm25TrendText.style.color = futTr.color || 'var(--text-primary)';
    }
  }

  // Secondary Pollutants
  // PM10
  const pm10Ground = ground && ground.pollutants && ground.pollutants.pm10 ? ground.pollutants.pm10.current : null;
  const pm10Model = model && model.pm10_concentration ? model.pm10_concentration.value : null;
  elements.valPm10.textContent = pm10Ground || (pm10Model ? `${pm10Model.toFixed(1)} µg/m³` : '--');
  elements.rangePm10.textContent = (ground && ground.pollutants && ground.pollutants.pm10 && ground.pollutants.pm10.min) 
    ? `Min: ${ground.pollutants.pm10.min} | Max: ${ground.pollutants.pm10.max}` 
    : 'Coarse particulate';

  // O3, NO2, SO2, CO
  elements.valO3.textContent = (ground && ground.pollutants && ground.pollutants.o3 && ground.pollutants.o3.current) 
    ? ground.pollutants.o3.current 
    : (model && model.pollutants_ugm3 && model.pollutants_ugm3.ozone ? `${model.pollutants_ugm3.ozone.toFixed(1)} µg/m³` : '--');

  elements.valNo2.textContent = (ground && ground.pollutants && ground.pollutants.no2 && ground.pollutants.no2.current) 
    ? ground.pollutants.no2.current 
    : (model && model.pollutants_ugm3 && model.pollutants_ugm3.nitrogen_dioxide ? `${model.pollutants_ugm3.nitrogen_dioxide.toFixed(1)} µg/m³` : '--');

  elements.valSo2.textContent = (ground && ground.pollutants && ground.pollutants.so2 && ground.pollutants.so2.current) 
    ? ground.pollutants.so2.current 
    : (model && model.pollutants_ugm3 && model.pollutants_ugm3.sulphur_dioxide ? `${model.pollutants_ugm3.sulphur_dioxide.toFixed(1)} µg/m³` : '--');

  elements.valCo.textContent = (ground && ground.pollutants && ground.pollutants.co && ground.pollutants.co.current) 
    ? ground.pollutants.co.current 
    : (model && model.pollutants_ugm3 && model.pollutants_ugm3.carbon_monoxide ? `${model.pollutants_ugm3.carbon_monoxide.toFixed(0)} µg/m³` : '--');

  elements.valEaqi.textContent = model && model.european_aqi !== undefined ? model.european_aqi : '--';

  // Weather
  elements.valHumidity.textContent = (ground && ground.weather && ground.weather.humidity) ? `${ground.weather.humidity}%` : '--';
  elements.valWind.textContent = (ground && ground.weather && ground.weather.wind) ? `${ground.weather.wind} m/s` : '--';
  elements.valPressure.textContent = (ground && ground.weather && ground.weather.pressure) ? `${ground.weather.pressure} hPa` : '--';

  // Health Advice
  elements.healthLevelBadge.textContent = cat.category || 'Advisory';
  elements.healthLevelBadge.style.backgroundColor = `${cat.color}25`;
  elements.healthLevelBadge.style.borderColor = cat.color;
  elements.healthLevelBadge.style.color = cat.color;

  elements.adviceOutdoor.textContent = cat.outdoor_activity || cat.recommendation;
  elements.adviceMask.textContent = cat.mask || 'Optional';
  elements.adviceIndoor.textContent = cat.air_purifier || 'Normal ventilation';
  elements.adviceSensitive.textContent = cat.health || 'Take standard precautions';

  // Runner's Air Quality & Safe Workout Hub
  const runner = data.runner_advice;
  if (runner) {
    if (elements.runnerBadge) {
      elements.runnerBadge.textContent = runner.badge || 'ADVISORY';
      elements.runnerBadge.style.backgroundColor = runner.color || cat.color;
      elements.runnerBadge.style.boxShadow = `0 0 16px ${runner.color}50`;
    }

    if (elements.runnerVerdictTitle) {
      elements.runnerVerdictTitle.textContent = runner.verdict || 'Running Assessment';
      elements.runnerVerdictTitle.style.color = runner.color || 'var(--text-primary)';
    }

    if (elements.runnerVerdictDesc) {
      elements.runnerVerdictDesc.textContent = runner.summary || '';
    }

    // Durations
    const d = runner.durations || {};
    if (d.low && elements.durLow) {
      elements.durLow.textContent = d.low.duration;
      elements.durLow.style.color = d.low.safe ? 'var(--aqi-good)' : 'var(--aqi-unhealthy)';
      if (elements.statusLow) elements.statusLow.textContent = d.low.safe ? '✓ Safe' : '⚠️ Caution';
      if (elements.noteLow) elements.noteLow.textContent = d.low.note;
    }

    if (d.moderate && elements.durMod) {
      elements.durMod.textContent = d.moderate.duration;
      elements.durMod.style.color = d.moderate.safe ? 'var(--aqi-moderate)' : 'var(--aqi-unhealthy)';
      if (elements.statusMod) elements.statusMod.textContent = d.moderate.safe ? '✓ Moderate' : '❌ Avoid';
      if (elements.noteMod) elements.noteMod.textContent = d.moderate.note;
    }

    if (d.high && elements.durHigh) {
      elements.durHigh.textContent = d.high.duration;
      elements.durHigh.style.color = d.high.safe ? 'var(--aqi-good)' : 'var(--aqi-unhealthy)';
      if (elements.statusHigh) elements.statusHigh.textContent = d.high.safe ? '✓ Safe' : '❌ Prohibited';
      if (elements.noteHigh) elements.noteHigh.textContent = d.high.note;
    }

    // Best Running Window
    if (elements.runnerBestWindow) {
      elements.runnerBestWindow.textContent = runner.best_window ? runner.best_window.recommendation : 'Morning (06:00 - 08:00)';
    }

    // Heat Index & Humidity
    if (runner.heat_stress && elements.runnerHeatIndex) {
      const hs = runner.heat_stress;
      elements.runnerHeatIndex.textContent = `Temp: ${hs.temp_c}°C • Humidity: ${hs.humidity_pct}% • Heat Index: ${hs.apparent_temp_c}°C`;
      if (elements.runnerHeatWarning) {
        elements.runnerHeatWarning.textContent = hs.warning;
      }
    }
  }

  // Update Forecast Chart
  updateChart(data);

  // Update Multi-Source Table
  updateSourcesTable(data);

  // Pan Map to Active Location
  if (state.mapInstance && loc.latitude && loc.longitude) {
    state.mapInstance.flyTo([loc.latitude, loc.longitude], 10, { duration: 1.2 });
  }
}

// Multi-Source Transparency Table Render
function updateSourcesTable(data) {
  const ground = data.aqicn_ground;
  const model = data.openmeteo_model;

  let rowsHtml = '';

  // Source 1: Ground Station (WAQI / DOE)
  if (ground) {
    rowsHtml += `
      <tr>
        <td>
          <strong>WAQI / Malaysia DOE Ground Station</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${ground.station_name || 'Ground Station'} (ID: ${ground.station_id || 'N/A'})</div>
        </td>
        <td>Official Ground Sensor (Continuous Monitoring)</td>
        <td><strong style="color:${data.category.color}">${ground.overall_aqi} AQI</strong></td>
        <td>${ground.pm25.current} (AQI Sub-index)</td>
        <td>
          <a class="source-link" href="${ground.url}" target="_blank" rel="noopener">
            View Live Official Feed ↗
          </a>
        </td>
      </tr>
    `;
  }

  // Source 2: Copernicus CAMS via Open-Meteo
  if (model) {
    rowsHtml += `
      <tr>
        <td>
          <strong>Copernicus CAMS & NOAA GFS (Open-Meteo)</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">Atmospheric Chemistry & Satellite Reanalysis</div>
        </td>
        <td>Copernicus Numerical Grid (0.25° Resolution)</td>
        <td><strong>${model.us_aqi} US AQI / ${model.european_aqi} EAQI</strong></td>
        <td>${model.pm25_concentration.value} µg/m³ (Mass Concentration)</td>
        <td>
          <span style="color:var(--aqi-good); font-weight:600;">✓ Verified Global Model</span>
        </td>
      </tr>
    `;
  }

  // Source 3: Malaysia DOE APIMS Standard Context
  rowsHtml += `
    <tr>
      <td>
        <strong>Malaysia APIMS / Indeks Pencemaran Udara (IPU)</strong>
        <div style="font-size:0.75rem; color:var(--text-muted);">National Environmental Quality Standard</div>
      </td>
      <td>Department of Environment (DOE) Standard</td>
      <td>Equivalent to IPU Category: <strong>${data.category.malayCategory}</strong></td>
      <td>Assessed against Malaysian Ambient Air Quality Standard</td>
      <td>
        <a class="source-link" href="https://apims.doe.gov.my" target="_blank" rel="noopener">
          APIMS Portal ↗
        </a>
      </td>
    </tr>
  `;

  elements.sourcesTableBody.innerHTML = rowsHtml;
}

// Side-by-Side Comparison View Render
function renderCompareView() {
  const cities = ['perai', 'kuala-lumpur', 'alor-setar'];
  let cardsHtml = '';
  let tableRowsHtml = '';

  cities.forEach(key => {
    const c = state.presetData[key];
    if (!c) return;

    const loc = c.location;
    const cat = c.category;
    const pm25 = c.pm25;
    const ground = c.aqicn_ground;
    const model = c.openmeteo_model;

    cardsHtml += `
      <div class="compare-card">
        <div class="compare-card-header">
          <div>
            <div class="compare-city-name">${loc.name}</div>
            <div class="compare-city-sub">${loc.state}, Malaysia</div>
          </div>
          <div class="compare-aqi-badge" style="background:${cat.color}; color:${cat.textColor};">
            ${c.overall_aqi}
          </div>
        </div>

        <div style="font-weight:700; color:${cat.color}; font-size:0.95rem;">
          ${cat.category} (${cat.malayCategory})
        </div>

        <div class="compare-metrics-list">
          <div class="compare-metric-row">
            <span style="color:var(--text-muted);">PM2.5 Sub-index:</span>
            <strong>${pm25.sub_index !== null ? pm25.sub_index : '--'} AQI</strong>
          </div>
          <div class="compare-metric-row">
            <span style="color:var(--text-muted);">PM2.5 Mass Conc:</span>
            <strong>${pm25.concentration_ugm3 !== null ? pm25.concentration_ugm3.toFixed(1) + ' µg/m³' : '--'}</strong>
          </div>
          <div class="compare-metric-row">
            <span style="color:var(--text-muted);">PM10:</span>
            <strong>${(ground && ground.pollutants.pm10 && ground.pollutants.pm10.current) || (model && model.pm10_concentration.value) || '--'}</strong>
          </div>
          <div class="compare-metric-row">
            <span style="color:var(--text-muted);">WHO Guideline:</span>
            <strong style="color:${pm25.who_comparison && pm25.who_comparison.safe ? 'var(--aqi-good)' : 'var(--aqi-unhealthy)'};">
              ${pm25.who_comparison ? pm25.who_comparison.status : '--'}
            </strong>
          </div>
          <div class="compare-metric-row">
            <span style="color:var(--text-muted);">Weather:</span>
            <span>${(ground && ground.weather.humidity) ? ground.weather.humidity + '% Humid' : 'N/A'}</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
          <button class="btn btn-secondary btn-sm" onclick="switchCityTab('${key}')">
            View Details & Forecast →
          </button>
          ${ground ? `<a href="${ground.url}" target="_blank" rel="noopener" class="source-link" style="font-size:0.75rem;">Official URL ↗</a>` : ''}
        </div>
      </div>
    `;

    tableRowsHtml += `
      <tr>
        <td><strong>${loc.name}</strong> (${loc.state})</td>
        <td><strong style="color:${cat.color}; font-family:monospace; font-size:1.1rem;">${c.overall_aqi}</strong></td>
        <td><span class="status-badge" style="background:${cat.color}; color:${cat.textColor}; font-size:0.75rem; padding:2px 8px;">${cat.category}</span></td>
        <td>${pm25.sub_index !== null ? pm25.sub_index : '--'}</td>
        <td>${pm25.concentration_ugm3 !== null ? pm25.concentration_ugm3.toFixed(1) + ' µg/m³' : '--'}</td>
        <td>${(ground && ground.pollutants.pm10 && ground.pollutants.pm10.current) || '--'}</td>
        <td>Fine Particles (PM2.5)</td>
        <td>
          ${ground ? `<a class="source-link" href="${ground.url}" target="_blank" rel="noopener">aqicn.org/${key} ↗</a>` : 'CAMS Model'}
        </td>
      </tr>
    `;
  });

  elements.compareGrid.innerHTML = cardsHtml;
  elements.compareTableBody.innerHTML = tableRowsHtml;
}

// Chart.js Timeline & Forecast Chart
function updateChart(data) {
  if (!data || !data.pm25) return;

  const isDark = state.theme === 'dark';
  const pm25 = data.pm25;
  const pastTr = pm25.past_trend || {};
  const futTr = pm25.future_trend || pm25.trend || {};

  // 1. Populate Past 24h History Stats
  if (elements.chartPastTraj) {
    const pTraj = pastTr.trajectory || 'Observed';
    elements.chartPastTraj.textContent = pTraj;
    elements.chartPastTraj.style.color = (pTraj === 'RISING') ? 'var(--aqi-unhealthy)' : (pTraj === 'FALLING' ? 'var(--aqi-good)' : 'var(--accent-cyan)');
  }
  if (elements.chartPastPeak) {
    const pk = pastTr.peak_aqi;
    elements.chartPastPeak.textContent = (pk && pk.value !== undefined) ? `${pk.value} AQI (~${pk.time})` : '--';
  }
  if (elements.chartPastLow) {
    const lw = pastTr.lowest_aqi;
    elements.chartPastLow.textContent = (lw && lw.value !== undefined) ? `${lw.value} AQI (~${lw.time})` : '--';
  }
  if (elements.chartPastShift) {
    const d6 = pastTr.drift_6h || 0;
    elements.chartPastShift.textContent = `${d6 > 0 ? '+' : ''}${d6} pts`;
    elements.chartPastShift.style.color = d6 > 5 ? 'var(--aqi-unhealthy)' : (d6 < -5 ? 'var(--aqi-good)' : 'var(--accent-cyan)');
  }

  // 2. Populate Next 24h Forecast Stats
  if (elements.chartTrendDir) {
    const fTraj = futTr.trajectory || futTr.direction_label || 'Stable';
    const fArrow = futTr.arrow || (fTraj === 'RISING' ? '↗' : (fTraj === 'FALLING' ? '↘' : '→'));
    elements.chartTrendDir.textContent = `${fArrow} ${fTraj}`;
    elements.chartTrendDir.style.color = futTr.color || (fTraj === 'RISING' ? 'var(--aqi-unhealthy)' : (fTraj === 'FALLING' ? 'var(--aqi-good)' : 'var(--text-primary)'));
  }
  if (elements.chartTrendPeak) {
    const fPk = futTr.peak_aqi;
    const peakVal = (fPk && typeof fPk === 'object') ? fPk.value : (futTr.peak_val || '--');
    const peakTime = (fPk && typeof fPk === 'object') ? fPk.time : (futTr.peak_time || '--:--');
    elements.chartTrendPeak.textContent = `${peakVal} AQI (~${peakTime})`;
  }
  if (elements.chartTrendClean) {
    const fCln = futTr.cleanest_window;
    const cleanVal = (fCln && typeof fCln === 'object') ? fCln.aqi : (futTr.clean_val || futTr.lowest_aqi || '--');
    const cleanTime = (fCln && typeof fCln === 'object') ? fCln.time : (futTr.lowest_time || '--:--');
    elements.chartTrendClean.textContent = `${cleanVal} AQI (~${cleanTime})`;
  }
  if (elements.chartFutShift) {
    const fD6 = futTr.drift_6h_aqi || futTr.change_6h || 0;
    elements.chartFutShift.textContent = `${fD6 > 0 ? '+' : ''}${fD6} pts`;
    elements.chartFutShift.style.color = fD6 > 5 ? 'var(--aqi-unhealthy)' : (fD6 < -5 ? 'var(--aqi-good)' : 'var(--accent-cyan)');
  }

  // 3. Resolve timeline range dataset
  let times = [];
  let values = [];
  let nowIdx = -1;
  let datasetLabel = '';
  let lineColor = '#38bdf8';
  let fillColor = 'rgba(56, 189, 248, 0.18)';

  const mode = state.timelineRange || 'all';

  if (mode === 'past') {
    const pData = pm25.past_24h || {};
    times = pData.time || [];
    nowIdx = times.length - 1;
    if (state.chartMode === 'pm25_aqi') {
      values = pData.pm25_aqi ? [...pData.pm25_aqi] : [];
      datasetLabel = 'PM2.5 AQI — Past 24h Observed History';
    } else if (state.chartMode === 'pm25') {
      values = pData.pm2_5 ? [...pData.pm2_5] : [];
      datasetLabel = 'PM2.5 (µg/m³) — Past 24h Observed Concentration';
    } else {
      values = pData.us_aqi ? [...pData.us_aqi] : [];
      datasetLabel = 'Overall US AQI — Past 24h History';
    }
    lineColor = '#06b6d4';
    fillColor = 'rgba(6, 182, 212, 0.18)';
  } else if (mode === 'future') {
    const fData = pm25.future_24h || (data.openmeteo_model && data.openmeteo_model.hourly_forecast) || {};
    times = (fData.time || []).slice(0, 24);
    nowIdx = 0;
    if (state.chartMode === 'pm25_aqi') {
      values = (fData.pm25_aqi || []).slice(0, 24);
      datasetLabel = 'PM2.5 AQI — Next 24h Forecast Prediction';
    } else if (state.chartMode === 'pm25') {
      values = (fData.pm2_5 || []).slice(0, 24);
      datasetLabel = 'PM2.5 (µg/m³) — Next 24h Forecast (µg/m³)';
    } else {
      values = (fData.us_aqi || []).slice(0, 24);
      datasetLabel = 'Overall US AQI — Next 24h Forecast';
    }
    lineColor = '#38bdf8';
    fillColor = 'rgba(56, 189, 248, 0.18)';
  } else {
    // mode === 'all': 48h continuous timeline
    const tlData = pm25.timeline_48h || {};
    times = tlData.time || [];
    nowIdx = tlData.now_index !== undefined ? tlData.now_index : 24;
    if (state.chartMode === 'pm25_aqi') {
      values = tlData.pm25_aqi ? [...tlData.pm25_aqi] : [];
      datasetLabel = 'PM2.5 AQI Timeline (Past 24h History ➔ NOW ➔ Next 24h Forecast)';
    } else if (state.chartMode === 'pm25') {
      values = tlData.pm2_5 ? [...tlData.pm2_5] : [];
      datasetLabel = 'PM2.5 (µg/m³) Timeline (Past 24h History ➔ NOW ➔ Next 24h Forecast)';
    } else {
      values = tlData.us_aqi ? [...tlData.us_aqi] : [];
      datasetLabel = 'Overall US AQI Timeline (Past 24h History ➔ NOW ➔ Next 24h Forecast)';
    }
    lineColor = '#38bdf8';
    fillColor = 'rgba(56, 189, 248, 0.14)';
  }

  // Format X-axis labels
  const labels = times.map((t, idx) => {
    const d = new Date(t);
    const day = isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { weekday: 'short' }) + ' ';
    const hm = isNaN(d.getTime()) ? (t.includes('T') ? t.split('T')[1].slice(0, 5) : t) : d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    if (idx === nowIdx) {
      return `📍 NOW (${hm})`;
    }
    return `${day}${hm}`;
  });

  if (state.chartInstance) {
    state.chartInstance.destroy();
  }

  const ctx = elements.forecastChartCanvas.getContext('2d');
  state.chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: datasetLabel,
        data: values,
        borderColor: lineColor,
        backgroundColor: fillColor,
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointRadius: (context) => (context.dataIndex === nowIdx ? 6 : 2),
        pointHoverRadius: 7,
        pointBackgroundColor: (context) => (context.dataIndex === nowIdx ? '#f59e0b' : lineColor),
        pointBorderColor: (context) => (context.dataIndex === nowIdx ? '#ffffff' : lineColor),
        pointBorderWidth: (context) => (context.dataIndex === nowIdx ? 2 : 1)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: isDark ? '#94a3b8' : '#475569',
            font: { family: 'Plus Jakarta Sans', size: 12, weight: 600 }
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#cbd5e1' : '#334155',
          borderColor: isDark ? '#334155' : '#e2e8f0',
          borderWidth: 1,
          padding: 10,
          boxPadding: 4,
          displayColors: true,
          callbacks: {
            label: (context) => {
              const val = context.parsed.y;
              const idx = context.dataIndex;
              if (idx === nowIdx) {
                return ` [📍 CURRENT OBSERVATION]: ${val} (Calibrated with Ground Station)`;
              }
              return ` ${context.dataset.label}: ${val}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
          ticks: {
            color: (c) => (c.index === nowIdx ? '#f59e0b' : (isDark ? '#64748b' : '#94a3b8')),
            font: (c) => ({
              family: 'JetBrains Mono',
              size: 10,
              weight: c.index === nowIdx ? 'bold' : 'normal'
            }),
            maxTicksLimit: mode === 'all' ? 14 : 10
          }
        },
        y: {
          grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
          ticks: {
            color: isDark ? '#64748b' : '#94a3b8',
            font: { family: 'JetBrains Mono', size: 10 }
          }
        }
      }
    }
  });
}

// Leaflet Map Initialization
function initMap() {
  // Center of Malaysia
  state.mapInstance = L.map('aqiMap', {
    center: [4.2105, 101.9758],
    zoom: 6.8,
    zoomControl: true,
    scrollWheelZoom: false
  });

  // Dark / Light map tiles
  const tileUrl = state.theme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  L.tileLayer(tileUrl, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(state.mapInstance);
}

// Fetch and add Malaysia stations to Map
async function fetchMapStations() {
  try {
    const res = await fetch('/api/stations');
    const stations = await res.json();
    state.allStations = stations;

    // Clear old markers
    state.mapMarkers.forEach(m => state.mapInstance.removeLayer(m));
    state.mapMarkers = [];

    // Add target 3 cities with prominent markers first
    const targetKeys = ['perai', 'kuala-lumpur', 'alor-setar'];
    targetKeys.forEach(k => {
      const city = state.presetData[k];
      if (city && city.location && city.overall_aqi !== null) {
        addMapMarker(
          city.location.latitude,
          city.location.longitude,
          city.location.name,
          city.overall_aqi,
          city.category.color,
          true,
          () => switchCityTab(k)
        );
      }
    });

    // Add other stations
    for (const [id, s] of Object.entries(stations)) {
      if (!s.geo || s.geo.length < 2) continue;
      // Skip if it's already one of the target 3 coordinates
      const aqiNum = parseInt(s.aqi, 10) || 50;
      const catColor = getAqiColor(aqiNum);

      addMapMarker(
        s.geo[0],
        s.geo[1],
        s.name,
        s.aqi,
        catColor,
        false,
        () => loadAirQualityByQuery(s.name)
      );
    }
  } catch (err) {
    console.error('Map stations fetch error:', err);
  }
}

function addMapMarker(lat, lon, name, aqi, color, isFeatured, onClick) {
  const size = isFeatured ? 36 : 26;
  const iconHtml = `
    <div class="custom-aqi-marker" style="
      width: ${size}px;
      height: ${size}px;
      background-color: ${color};
      font-size: ${isFeatured ? '13px' : '10px'};
      box-shadow: 0 0 ${isFeatured ? '14px' : '6px'} ${color};
      border: ${isFeatured ? '3px solid #ffffff' : '1.5px solid #ffffff'};
    ">
      ${aqi}
    </div>
  `;

  const customIcon = L.divIcon({
    html: iconHtml,
    className: 'custom-div-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });

  const marker = L.marker([lat, lon], { icon: customIcon }).addTo(state.mapInstance);
  marker.bindPopup(`
    <div style="font-family:'Plus Jakarta Sans',sans-serif; min-width:140px;">
      <strong style="font-size:0.95rem;">${name}</strong>
      <div style="margin:6px 0;">AQI: <strong style="color:${color}; font-size:1.1rem;">${aqi}</strong></div>
      <button style="
        background:#3b82f6; color:#fff; border:none; padding:4px 10px; border-radius:6px;
        font-size:0.75rem; cursor:pointer; font-weight:600; width:100%;
      ">View Full Breakdown</button>
    </div>
  `);

  marker.on('popupopen', () => {
    const btn = document.querySelector('.leaflet-popup-content button');
    if (btn) btn.onclick = onClick;
  });

  state.mapMarkers.push(marker);
}

function getAqiColor(val) {
  if (val <= 50) return '#10b981';
  if (val <= 100) return '#f59e0b';
  if (val <= 150) return '#f97316';
  if (val <= 200) return '#ef4444';
  if (val <= 300) return '#8b5cf6';
  return '#7e22ce';
}

// Auto-Refresh
function initAutoRefresh() {
  const seconds = parseInt(elements.autoRefreshSelect.value, 10);
  resetAutoRefresh(seconds);
}

function resetAutoRefresh(seconds) {
  if (state.autoRefreshTimer) {
    clearInterval(state.autoRefreshTimer);
    state.autoRefreshTimer = null;
  }
  if (seconds > 0) {
    state.autoRefreshTimer = setInterval(() => {
      refreshAllData(false);
    }, seconds * 1000);
  }
}

async function refreshAllData(showSpinner = false) {
  if (showSpinner) {
    elements.refreshIcon.classList.add('spin-anim');
  }

  try {
    const res = await fetch('/api/preset-cities');
    if (res.ok) {
      state.presetData = await res.json();
      updateTabBadges();
      if (elements.compareView.classList.contains('hidden')) {
        if (state.currentCityKey === 'saved') {
          loadSavedTabLocation();
        } else if (state.presetData[state.currentCityKey]) {
          renderDashboard(state.presetData[state.currentCityKey]);
        }
      } else {
        renderCompareView();
      }
    }
  } catch (err) {
    console.error('Refresh error:', err);
  } finally {
    if (showSpinner) {
      setTimeout(() => elements.refreshIcon.classList.remove('spin-anim'), 600);
    }
  }
}

// Helpers: Loading and Errors
function showLoading(msg = 'Retrieving real-time air quality data...') {
  elements.loadingText.textContent = msg;
  elements.loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
  elements.loadingOverlay.classList.add('hidden');
}

function showError(msg) {
  elements.errorMessage.textContent = msg;
  elements.errorBanner.classList.remove('hidden');
}

function hideError() {
  elements.errorBanner.classList.add('hidden');
}
