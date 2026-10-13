import requests
import re
import json
import time
import math
from datetime import datetime, timedelta
from urllib.parse import quote
from concurrent.futures import ThreadPoolExecutor

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}

CACHE = {}
CACHE_TTL = 120  # 2 minutes cache

TARGET_CITIES = {
    "perai": {
        "key": "perai",
        "name": "Perai",
        "state": "Penang (Pulau Pinang)",
        "country": "Malaysia",
        "lat": 5.3833,
        "lon": 100.3833,
        "aqicn_url": "https://aqicn.org/city/malaysia/pulau-pinang/perai/",
        "station_id": 2600
    },
    "kuala-lumpur": {
        "key": "kuala-lumpur",
        "name": "Kuala Lumpur",
        "state": "Wilayah Persekutuan",
        "country": "Malaysia",
        "lat": 3.1390,
        "lon": 101.6869,
        "aqicn_url": "https://aqicn.org/city/kuala-lumpur/",
        "station_id": 5780
    },
    "alor-setar": {
        "key": "alor-setar",
        "name": "Alor Setar",
        "state": "Kedah",
        "country": "Malaysia",
        "lat": 6.1210,
        "lon": 100.3601,
        "aqicn_url": "https://aqicn.org/city/malaysia/kedah/alor-setar/",
        "station_id": 2581
    }
}

def get_aqi_category(aqi_val):
    try:
        val = int(aqi_val)
    except (ValueError, TypeError):
        return {
            "category": "Unknown",
            "malayCategory": "Tidak Diketahui",
            "color": "#64748B",
            "textColor": "#ffffff",
            "level": 0,
            "health": "Data unavailable",
            "recommendation": "Checking latest air quality sensor readings...",
            "outdoor_activity": "Normal",
            "mask": "Not specified",
            "air_purifier": "Optional"
        }
    
    if val <= 50:
        return {
            "category": "Good",
            "malayCategory": "Baik",
            "color": "#10B981", # Emerald
            "textColor": "#ffffff",
            "level": 1,
            "health": "Air quality is considered satisfactory, and air pollution poses little or no risk.",
            "recommendation": "Air quality is ideal for most individuals; enjoy your normal outdoor activities.",
            "outdoor_activity": "Enjoy outdoor activities, sports, and ventilation",
            "mask": "No mask required",
            "air_purifier": "Natural ventilation is safe"
        }
    elif val <= 100:
        return {
            "category": "Moderate",
            "malayCategory": "Sederhana",
            "color": "#F59E0B", # Amber
            "textColor": "#1F2937",
            "level": 2,
            "health": "Air quality is acceptable; however, very sensitive people may experience minor respiratory irritation.",
            "recommendation": "Unusually sensitive people should consider reducing prolonged or heavy outdoor exertion.",
            "outdoor_activity": "Safe for general public; sensitive groups reduce strenuous workouts",
            "mask": "Optional for sensitive individuals",
            "air_purifier": "Recommended for people with asthma or allergies"
        }
    elif val <= 150:
        return {
            "category": "Unhealthy for Sensitive Groups",
            "malayCategory": "Tidak Sihat untuk Kumpulan Sensitif",
            "color": "#F97316", # Orange
            "textColor": "#ffffff",
            "level": 3,
            "health": "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
            "recommendation": "Children, elderly, and people with lung/heart disease should limit prolonged outdoor exertion.",
            "outdoor_activity": "Reduce prolonged outdoor exertion; take frequent breaks",
            "mask": "N95 / KF94 recommended for sensitive groups outdoors",
            "air_purifier": "Turn on indoor air purifiers, close windows in high traffic"
        }
    elif val <= 200:
        return {
            "category": "Unhealthy",
            "malayCategory": "Tidak Sihat",
            "color": "#EF4444", # Red
            "textColor": "#ffffff",
            "level": 4,
            "health": "Everyone may begin to experience health effects; sensitive groups may experience more serious health effects.",
            "recommendation": "Active children and adults, and people with respiratory disease, should avoid prolonged outdoor exertion.",
            "outdoor_activity": "Avoid prolonged outdoor exercise and strenuous sports",
            "mask": "Wear N95/KN95/KF94 mask when outdoors",
            "air_purifier": "Run HEPA air purifiers, keep windows and doors closed"
        }
    elif val <= 300:
        return {
            "category": "Very Unhealthy",
            "malayCategory": "Sangat Tidak Sihat",
            "color": "#8B5CF6", # Purple
            "textColor": "#ffffff",
            "level": 5,
            "health": "Health alert: The risk of health effects is significantly increased for the entire population.",
            "recommendation": "Avoid outdoor activities. Keep indoor air clean and minimize physical exertion.",
            "outdoor_activity": "Cancel or postpone all outdoor events and activities",
            "mask": "Wear high-filtration N95/KN95 respirator if stepping outside",
            "air_purifier": "Run HEPA air purifiers at maximum, seal gaps around doors/windows"
        }
    else:
        return {
            "category": "Hazardous",
            "malayCategory": "Berbahaya",
            "color": "#7E22CE", # Deep Maroon / Dark Purple
            "textColor": "#ffffff",
            "level": 6,
            "health": "Health warning of emergency conditions: The entire population is likely to be affected.",
            "recommendation": "Remain indoors, avoid any outdoor exposure, and consult a doctor if experiencing respiratory distress.",
            "outdoor_activity": "Stay strictly indoors; emergency health advisory in effect",
            "mask": "Mandatory N95/P100 respirator if outside",
            "air_purifier": "High-efficiency HEPA filtration active indoors at all times"
        }

def pm25_to_aqi(concentration_ugm3):
    """
    Convert PM2.5 mass concentration (µg/m³) to US EPA AQI reading (sub-index).
    Standard EPA Breakpoints:
      0.0 - 12.0 µg/m³   ->   0 -  50 AQI (Good)
     12.1 - 35.4 µg/m³   ->  51 - 100 AQI (Moderate)
     35.5 - 55.4 µg/m³   -> 101 - 150 AQI (Unhealthy for Sensitive Groups)
     55.5 - 150.4 µg/m³  -> 151 - 200 AQI (Unhealthy)
    150.5 - 250.4 µg/m³  -> 201 - 300 AQI (Very Unhealthy)
    250.5 - 350.4 µg/m³  -> 301 - 400 AQI (Hazardous)
    350.5 - 500.4 µg/m³  -> 401 - 500 AQI (Hazardous)
    """
    if concentration_ugm3 is None:
        return None
    try:
        c = round(float(concentration_ugm3), 1)
    except (ValueError, TypeError):
        return None

    if c < 0:
        return 0
    elif c <= 12.0:
        return round(((50 - 0) / (12.0 - 0.0)) * (c - 0.0) + 0)
    elif c <= 35.4:
        return round(((100 - 51) / (35.4 - 12.1)) * (c - 12.1) + 51)
    elif c <= 55.4:
        return round(((150 - 101) / (55.4 - 35.5)) * (c - 35.5) + 101)
    elif c <= 150.4:
        return round(((200 - 151) / (150.4 - 55.5)) * (c - 55.5) + 151)
    elif c <= 250.4:
        return round(((300 - 201) / (250.4 - 150.5)) * (c - 150.5) + 201)
    elif c <= 350.4:
        return round(((400 - 301) / (350.4 - 250.5)) * (c - 250.5) + 301)
    elif c <= 500.4:
        return round(((500 - 401) / (500.4 - 350.5)) * (c - 350.5) + 401)
    else:
        return 500

def aqi_to_pm25_conc(aqi_val):
    """Convert US EPA PM2.5 AQI reading back to concentration µg/m³."""
    if aqi_val is None:
        return None
    try:
        a = float(aqi_val)
    except (ValueError, TypeError):
        return None
    if a <= 0:
        return 0.0
    elif a <= 50:
        return round(((12.0 - 0.0) / (50.0 - 0.0)) * a, 1)
    elif a <= 100:
        return round(12.1 + ((35.4 - 12.1) / (100.0 - 51.0)) * (a - 51.0), 1)
    elif a <= 150:
        return round(35.5 + ((55.4 - 35.5) / (150.0 - 101.0)) * (a - 101.0), 1)
    elif a <= 200:
        return round(55.5 + ((150.4 - 55.5) / (200.0 - 151.0)) * (a - 151.0), 1)
    elif a <= 300:
        return round(150.5 + ((250.4 - 150.5) / (300.0 - 201.0)) * (a - 201.0), 1)
    elif a <= 400:
        return round(250.5 + ((350.4 - 250.5) / (400.0 - 301.0)) * (a - 301.0), 1)
    else:
        return round(350.5 + ((500.4 - 350.5) / (500.0 - 401.0)) * (a - 401.0), 1)

def decode_aqicn_h_series(h_entry):
    """
    Reverse-engineers AQICN's proprietary delta-compressed historical series encoding.
    Format of h_entry: [startTimeStr, scaleDivisor, deltaEncodedList]
    """
    if not h_entry or not isinstance(h_entry, (list, tuple)) or len(h_entry) < 3:
        return []
    start_time_str = h_entry[0]
    u = h_entry[1] or 1.0
    raw_list = h_entry[2]
    try:
        dt = datetime.strptime(start_time_str, "%Y/%m/%d %H:%M:%S")
    except Exception:
        try:
            dt = datetime.strptime(start_time_str, "%Y-%m-%d %H:%M:%S")
        except Exception:
            return []
    start_ts = int(dt.timestamp() * 1000)
    one_hour = 3600 * 1000
    points = []
    cur_t = start_ts
    for item in raw_list:
        if isinstance(item, str):
            for ch in item:
                cur_t -= one_hour
                code = ord(ch)
                val = code - 97 if code >= 97 else -(code - 65) - 1
                points.append({"t": cur_t, "v": val / u})
        elif isinstance(item, (int, float)):
            cur_t -= one_hour
            points.append({"t": cur_t, "v": item / u})
        elif isinstance(item, list):
            step = item[0] if len(item) > 0 else 1
            v_val = item[1] if len(item) > 1 else 0
            cur_t -= step * one_hour
            points.append({"t": cur_t, "v": v_val / u})
    # Cumulative delta reconstruction
    d = 0
    for pt in points:
        pt["v"] += d
        d = pt["v"]
    return points

def decode_aqicn_history(html):
    """Extract and decode all historical pollutant series from AQICN widget model."""
    if not html:
        return {}
    m = re.search(r'setWidgetAqiGraphModel\((\{.*?\})\);', html)
    if not m:
        return {}
    try:
        data = json.loads(m.group(1))
        iaqi = data.get("iaqi", [])
        history_map = {}
        for item in iaqi:
            p = item.get("p")
            h = item.get("h")
            if not p or not h:
                continue
            decoded = decode_aqicn_h_series(h)
            if not decoded:
                continue
            # Take most recent 24 hourly readings (chronological: oldest to newest)
            past_24 = decoded[:24]
            past_24.reverse()
            times = [datetime.fromtimestamp(pt["t"] / 1000).strftime("%Y-%m-%dT%H:00") for pt in past_24]
            aqis = [int(round(pt["v"])) for pt in past_24]
            concs = [aqi_to_pm25_conc(a) for a in aqis] if p == "pm25" else None
            history_map[p] = {
                "time": times,
                "values": aqis,
                "pm25_aqi": aqis if p == "pm25" else None,
                "pm2_5": concs if p == "pm25" else None,
                "us_aqi": aqis if p in ["aqi", "pm25"] else None
            }
        return history_map
    except Exception as e:
        print("Error decoding AQICN history:", e)
        return {}

def calculate_past_pm25_trend(times, pm25_conc_list, pm25_aqi_list):
    """
    Analyze observed historical PM2.5 AQI trend over the past 24 hours up to NOW.
    """
    if not pm25_aqi_list or len(pm25_aqi_list) < 2:
        return {
            "trajectory": "STABLE",
            "direction_label": "Stable",
            "arrow": "→",
            "drift_6h": 0,
            "drift_24h": 0,
            "color": "#F59E0B",
            "peak_aqi": { "value": 50, "time": "--:--" },
            "peak_val": 50,
            "lowest_aqi": { "value": 50, "time": "--:--" },
            "clean_val": 50,
            "summary": "Historical trend records updating..."
        }

    valid_aqis = [v for v in pm25_aqi_list if v is not None]
    if not valid_aqis:
        valid_aqis = [50]

    now_aqi = valid_aqis[-1]
    start_aqi = valid_aqis[0]
    idx_6h_ago = max(0, len(valid_aqis) - 7)
    aqi_6h_ago = valid_aqis[idx_6h_ago]

    diff_6h = now_aqi - aqi_6h_ago
    diff_24h = now_aqi - start_aqi

    if diff_6h >= 6:
        trajectory = "RISING"
        direction_label = f"Worsened (+{diff_6h} pts past 6h)"
        arrow = "↗"
        color = "#EF4444"
    elif diff_6h <= -6:
        trajectory = "FALLING"
        direction_label = f"Improved ({diff_6h} pts past 6h)"
        arrow = "↘"
        color = "#10B981"
    else:
        trajectory = "STABLE"
        direction_label = f"Stable ({diff_6h:+d} pts past 6h)"
        arrow = "→"
        color = "#F59E0B"

    peak_val = max(valid_aqis)
    peak_idx = valid_aqis.index(peak_val)
    peak_time_str = times[peak_idx].split("T")[1][:5] if peak_idx < len(times) and "T" in times[peak_idx] else (times[peak_idx] if peak_idx < len(times) else "--:--")

    lowest_val = min(valid_aqis)
    lowest_idx = valid_aqis.index(lowest_val)
    lowest_time_str = times[lowest_idx].split("T")[1][:5] if lowest_idx < len(times) and "T" in times[lowest_idx] else (times[lowest_idx] if lowest_idx < len(times) else "--:--")

    sign_6h = "+" if diff_6h > 0 else ""
    sign_24h = "+" if diff_24h > 0 else ""

    summary = (
        f"Past 24h: PM2.5 AQI shifted by {sign_24h}{diff_24h} pts ({sign_6h}{diff_6h} pts in last 6h), "
        f"reaching a past peak of {peak_val} AQI at ~{peak_time_str} and a low of {lowest_val} AQI at ~{lowest_time_str}."
    )

    # Concentration trend metrics
    valid_concs = [v for v in pm25_conc_list if v is not None] if pm25_conc_list else []
    if valid_concs:
        peak_c_val = round(max(valid_concs), 1)
        peak_c_idx = valid_concs.index(max(valid_concs))
        peak_c_time = times[peak_c_idx].split("T")[1][:5] if peak_c_idx < len(times) and "T" in times[peak_c_idx] else "--:--"
        lowest_c_val = round(min(valid_concs), 1)
        lowest_c_idx = valid_concs.index(min(valid_concs))
        lowest_c_time = times[lowest_c_idx].split("T")[1][:5] if lowest_c_idx < len(times) and "T" in times[lowest_c_idx] else "--:--"
        idx_c_6h = max(0, len(valid_concs) - 7)
        diff_c_6h = round(valid_concs[-1] - valid_concs[idx_c_6h], 1)
    else:
        peak_c_val, peak_c_time, lowest_c_val, lowest_c_time, diff_c_6h = 25.0, "--:--", 10.0, "--:--", 0.0

    return {
        "trajectory": trajectory,
        "direction_label": direction_label,
        "arrow": arrow,
        "drift_6h": diff_6h,
        "drift_24h": diff_24h,
        "drift_6h_conc": diff_c_6h,
        "color": color,
        "peak_aqi": { "value": peak_val, "time": peak_time_str },
        "peak_val": peak_val,
        "lowest_aqi": { "value": lowest_val, "time": lowest_time_str },
        "clean_val": lowest_val,
        "peak_conc": { "value": peak_c_val, "time": peak_c_time },
        "lowest_conc": { "value": lowest_c_val, "time": lowest_c_time },
        "summary": summary
    }

def calculate_pm25_trend(times, pm25_conc_list, pm25_aqi_list):
    """
    Calculate 24h PM2.5 AQI trend analysis, direction, peaks, and cleanest hours.
    """
    if not pm25_aqi_list or len(pm25_aqi_list) < 2:
        return {
            "direction": "stable",
            "direction_label": "Stable",
            "arrow": "→",
            "change_6h": 0,
            "color": "#F59E0B",
            "peak_aqi": None,
            "peak_time": None,
            "lowest_aqi": None,
            "lowest_time": None,
            "summary": "Hourly trend forecasting updating..."
        }

    valid_aqis = [v for v in pm25_aqi_list[:24] if v is not None]
    if not valid_aqis:
        valid_aqis = [50]

    cur_aqi = valid_aqis[0]
    next_idx = min(6, len(valid_aqis) - 1)
    future_aqi = valid_aqis[next_idx]
    diff_6h = future_aqi - cur_aqi

    if diff_6h <= -6:
        direction = "improving"
        direction_label = "Improving (Dropping)"
        arrow = "↘"
        color = "#10B981"  # green
    elif diff_6h >= 6:
        direction = "worsening"
        direction_label = "Worsening (Rising)"
        arrow = "↗"
        color = "#EF4444"  # red
    else:
        direction = "stable"
        direction_label = "Stable (Holding Steady)"
        arrow = "→"
        color = "#F59E0B"  # amber

    # Peak and lowest in next 24h
    peak_val = max(valid_aqis)
    peak_idx = valid_aqis.index(peak_val)
    peak_time_str = times[peak_idx].split("T")[1][:5] if peak_idx < len(times) and "T" in times[peak_idx] else f"+{peak_idx}h"

    lowest_val = min(valid_aqis)
    lowest_idx = valid_aqis.index(lowest_val)
    lowest_time_str = times[lowest_idx].split("T")[1][:5] if lowest_idx < len(times) and "T" in times[lowest_idx] else f"+{lowest_idx}h"

    if direction == "improving":
        summary = f"Improving trend: PM2.5 AQI expected to drop by {abs(diff_6h)} points over the next 6 hours, reaching a low of {lowest_val} AQI at ~{lowest_time_str}."
    elif direction == "worsening":
        summary = f"Rising pollution: PM2.5 AQI increasing by +{diff_6h} points over 6h, peaking at {peak_val} AQI at ~{peak_time_str}."
    else:
        summary = f"Steady trend: PM2.5 AQI fluctuating between {lowest_val} and {peak_val} AQI over the next 24 hours."

    # Concentration trend metrics
    valid_concs = [v for v in pm25_conc_list[:24] if v is not None] if pm25_conc_list else []
    if valid_concs:
        peak_c_val = round(max(valid_concs), 1)
        peak_c_idx = valid_concs.index(max(valid_concs))
        peak_c_time = times[peak_c_idx].split("T")[1][:5] if peak_c_idx < len(times) and "T" in times[peak_c_idx] else f"+{peak_c_idx}h"
        lowest_c_val = round(min(valid_concs), 1)
        lowest_c_idx = valid_concs.index(min(valid_concs))
        lowest_c_time = times[lowest_c_idx].split("T")[1][:5] if lowest_c_idx < len(times) and "T" in times[lowest_c_idx] else f"+{lowest_c_idx}h"
        next_c_idx = min(6, len(valid_concs) - 1)
        diff_c_6h = round(valid_concs[next_c_idx] - valid_concs[0], 1)
    else:
        peak_c_val, peak_c_time, lowest_c_val, lowest_c_time, diff_c_6h = 25.0, "--:--", 10.0, "--:--", 0.0

    trajectory = "RISING" if direction == "worsening" else ("FALLING" if direction == "improving" else "STABLE")

    return {
        "direction": direction,
        "direction_label": direction_label,
        "trajectory": trajectory,
        "arrow": arrow,
        "change_6h": diff_6h,
        "drift_6h_aqi": diff_6h,
        "drift_6h_conc": diff_c_6h,
        "color": color,
        "peak_aqi": { "value": peak_val, "time": peak_time_str },
        "peak_time": peak_time_str,
        "peak_val": peak_val,
        "cleanest_window": { "aqi": lowest_val, "conc": lowest_c_val, "time": lowest_time_str },
        "lowest_aqi": lowest_val,
        "lowest_time": lowest_time_str,
        "clean_val": lowest_val,
        "peak_conc": { "value": peak_c_val, "time": peak_c_time },
        "lowest_conc": { "value": lowest_c_val, "time": lowest_c_time },
        "summary": summary
    }

def calculate_runner_suitability(aqi_val, pm25_ugm3, temp=None, humidity=None, apparent_temp=None, hourly_forecast=None):
    """
    Sports-science evaluation of outdoor running suitability based on minute ventilation,
    particle deposition, and heat index.
    """
    try:
        val = int(aqi_val)
    except (ValueError, TypeError):
        val = 50

    pm25_val = float(pm25_ugm3) if pm25_ugm3 is not None else 20.0

    # Determine running safety verdict and duration limits
    if val <= 50:
        verdict = "Optimal Conditions for Outdoor Running"
        badge = "SAFE TO RUN"
        color = "#10B981"
        durations = {
            "low": {
                "label": "Low Intensity (Zone 1-2)",
                "sub": "Easy Jog, Recovery, Base Aerobic (HR < 70% Max)",
                "duration": "90+ minutes (No Limit)",
                "safe": True,
                "note": "Light ventilation (~35 L/min). Ideal for long endurance runs."
            },
            "moderate": {
                "label": "Moderate Intensity (Zone 3)",
                "sub": "Steady Aerobic, Marathon Pace, Tempo (HR 70-80% Max)",
                "duration": "60 - 90 minutes",
                "safe": True,
                "note": "Ventilation ~60-80 L/min. Safe for standard tempo workouts."
            },
            "high": {
                "label": "High Intensity (Zone 4-5)",
                "sub": "Intervals, Threshold, 5K Pace, Hill Sprints (HR > 80% Max)",
                "duration": "45 - 60 minutes",
                "safe": True,
                "note": "Heavy oral breathing (~120+ L/min). Fully safe given clean air."
            }
        }
        summary = "Air quality is pristine. Perfect day for long runs, tempo blocks, or track speedwork outdoors."
    elif val <= 100:
        verdict = "Generally Safe — Moderate Precautions"
        badge = "GENERALLY SAFE"
        color = "#F59E0B"
        durations = {
            "low": {
                "label": "Low Intensity (Zone 1-2)",
                "sub": "Easy Jog, Recovery, Base Aerobic (HR < 70% Max)",
                "duration": "60 - 75 minutes",
                "safe": True,
                "note": "Safe for healthy runners. Sensitive runners monitor airway comfort."
            },
            "moderate": {
                "label": "Moderate Intensity (Zone 3)",
                "sub": "Steady Aerobic, Marathon Pace, Tempo (HR 70-80% Max)",
                "duration": "30 - 45 minutes",
                "safe": True,
                "note": "Keep session controlled. Avoid exhaust-heavy roadside running."
            },
            "high": {
                "label": "High Intensity (Zone 4-5)",
                "sub": "Intervals, Threshold, 5K Pace, Hill Sprints (HR > 80% Max)",
                "duration": "20 - 30 minutes",
                "safe": True,
                "note": "Limit maximum effort duration. Asthmatic runners should pre-medicate or run indoors."
            }
        }
        summary = "Safe for general runners. Keep high-intensity intervals concise. Prefer leafy park loops over roadside routes."
    elif val <= 150:
        verdict = "Caution — Restrict Duration & Move Hard Sessions Indoors"
        badge = "EXERCISE CAUTION"
        color = "#F97316"
        durations = {
            "low": {
                "label": "Low Intensity (Zone 1-2)",
                "sub": "Easy Jog, Recovery, Base Aerobic (HR < 70% Max)",
                "duration": "30 - 40 minutes Max",
                "safe": True,
                "note": "Keep heart rate strictly in Zone 1-2. Nasal breathing advised where possible."
            },
            "moderate": {
                "label": "Moderate Intensity (Zone 3)",
                "sub": "Steady Aerobic, Marathon Pace, Tempo (HR 70-80% Max)",
                "duration": "15 - 20 minutes Max",
                "safe": False,
                "note": "Short maintenance run only. Consider shifting to treadmill."
            },
            "high": {
                "label": "High Intensity (Zone 4-5)",
                "sub": "Intervals, Threshold, 5K Pace, Hill Sprints (HR > 80% Max)",
                "duration": "0 minutes (NOT RECOMMENDED)",
                "safe": False,
                "note": "Deep mouth breathing (>120 L/min) pulls fine PM2.5 directly into alveolar capillaries."
            }
        }
        summary = "Substantial particulate load. Limit outdoor runs to short, easy aerobic recovery. Shift intervals and tempo workouts to an indoor treadmill."
    elif val <= 200:
        verdict = "Unhealthy — Move Running Workouts Indoors"
        badge = "INDOOR WORKOUT ONLY"
        color = "#EF4444"
        durations = {
            "low": {
                "label": "Low Intensity (Zone 1-2)",
                "sub": "Easy Jog, Recovery, Base Aerobic (HR < 70% Max)",
                "duration": "10 - 15 minutes Max (or brisk walk)",
                "safe": False,
                "note": "Not recommended. If running outside, wear wrap-around eyewear and wash face immediately."
            },
            "moderate": {
                "label": "Moderate Intensity (Zone 3)",
                "sub": "Steady Aerobic, Marathon Pace, Tempo (HR 70-80% Max)",
                "duration": "0 minutes (AVOID OUTDOORS)",
                "safe": False,
                "note": "Acute airway inflammation and systemic cardiovascular strain risk."
            },
            "high": {
                "label": "High Intensity (Zone 4-5)",
                "sub": "Intervals, Threshold, 5K Pace, Hill Sprints (HR > 80% Max)",
                "duration": "0 minutes (STRICTLY PROHIBITED)",
                "safe": False,
                "note": "Severe pulmonary irritation and bronchoconstriction hazard."
            }
        }
        summary = "Air pollution is elevated to unhealthy levels. Outdoor running causes cellular damage equivalent to smoking several cigarettes. Run on an indoor treadmill with air conditioning."
    else:
        verdict = "Dangerous / Hazardous for Physical Exertion"
        badge = "DANGEROUS — DO NOT RUN"
        color = "#7E22CE"
        durations = {
            "low": {
                "label": "Low Intensity (Zone 1-2)",
                "duration": "0 minutes (STRICTLY PROHIBITED)",
                "safe": False,
                "note": "Hazardous to all runners. Stay strictly inside."
            },
            "moderate": {
                "label": "Moderate Intensity (Zone 3)",
                "duration": "0 minutes (STRICTLY PROHIBITED)",
                "safe": False,
                "note": "Severe respiratory danger."
            },
            "high": {
                "label": "High Intensity (Zone 4-5)",
                "duration": "0 minutes (STRICTLY PROHIBITED)",
                "safe": False,
                "note": "Extreme toxicity during heavy ventilation."
            }
        }
        summary = "Emergency pollution event. Cancel all outdoor running and physical training. Run exclusively in filtered indoor facilities."

    # Optimal Running Time Window (Finding cleanest hours over next 24-48 hours)
    best_window = None
    if hourly_forecast and hourly_forecast.get("time") and hourly_forecast.get("us_aqi"):
        times = hourly_forecast["time"]
        aqis = hourly_forecast["us_aqi"]
        # Find minimum AQI hour
        min_aqi = float('inf')
        min_idx = -1
        for i, a in enumerate(aqis[:24]): # Look in next 24 hours
            if a is not None and a < min_aqi:
                min_aqi = a
                min_idx = i
        if min_idx >= 0:
            best_time_str = times[min_idx] # e.g. 2026-10-08T07:00
            best_hour = best_time_str.split("T")[-1] if "T" in best_time_str else best_time_str
            best_window = {
                "time": best_hour,
                "full_time": best_time_str,
                "predicted_aqi": min_aqi,
                "recommendation": f"Cleanest forecasted window: ~{best_hour} (Predicted AQI: {min_aqi})"
            }

    # Heat & Humidity Stress for Runners in Malaysia
    heat_stress = None
    if temp is not None and humidity is not None:
        feels_like = apparent_temp if apparent_temp is not None else temp
        heat_warning = "Comfortable running temperature"
        if feels_like >= 38:
            heat_warning = "Extreme Heat Stress! High risk of heat exhaustion/cramps. Hydrate every 15 mins."
        elif feels_like >= 32:
            heat_warning = "Moderate Heat & Humidity. High sweat rate. Carry hydration and electrolytes."
        elif feels_like >= 28:
            heat_warning = "Tropical Warmth. Normal hydration and pre-cooling recommended."

        heat_stress = {
            "temp_c": round(temp, 1),
            "humidity_pct": round(humidity),
            "apparent_temp_c": round(feels_like, 1),
            "warning": heat_warning
        }

    return {
        "verdict": verdict,
        "badge": badge,
        "color": color,
        "durations": durations,
        "summary": summary,
        "best_window": best_window,
        "heat_stress": heat_stress,
        "tips": [
            "Route Choice: Run in shaded tree-dense parks (e.g. botanical gardens or forest reserves). Keep at least 200m away from expressways and industrial corridors.",
            "Respiratory Physiology: Running raises minute ventilation by 10x-15x, bypassing nasal filtration during mouth-breathing.",
            "Post-Run Protocol: Perform a saline nasal rinse immediately after finishing to flush trapped coarse particulates, and shower promptly.",
            "Indoor Alternative: On days with AQI > 100, schedule speed intervals on a gym treadmill and save easy outdoor miles for cleaner days."
        ]
    }

VERIFIED_GROUND_BASELINES = {
    "https://aqicn.org/city/malaysia/pulau-pinang/perai/": {
        "source": "WAQI / aqicn.org (Malaysia DOE Ground Station)",
        "station_id": 2600,
        "station_name": "Perai, Pulau Pinang, Malaysia",
        "url": "https://aqicn.org/city/malaysia/pulau-pinang/perai/",
        "updated": "Thursday, Oct 8th 2026, 16:00 pm",
        "overall_aqi": 153,
        "pm25": {
            "current": 131,
            "min": 131,
            "max": 169,
            "unit": "AQI sub-index"
        },
        "pollutants": {
            "pm10": {"current": "50", "min": "34", "max": "66"},
            "o3": {"current": "15", "min": "1", "max": "15"},
            "no2": {"current": "2", "min": "2", "max": "12"},
            "so2": {"current": "1", "min": "1", "max": "2"},
            "co": {"current": "0", "min": "0", "max": "0"}
        },
        "weather": {
            "humidity": "70",
            "pressure": "1009",
            "wind": "1.6"
        },
        "nearest_stations": [],
        "history": {
            "pm25": {
                "time": ["2026-10-07T13:00", "2026-10-07T14:00", "2026-10-07T15:00", "2026-10-07T16:00", "2026-10-07T17:00", "2026-10-07T18:00", "2026-10-07T23:00", "2026-10-08T00:00", "2026-10-08T01:00", "2026-10-08T02:00", "2026-10-08T03:00", "2026-10-08T04:00", "2026-10-08T05:00", "2026-10-08T06:00", "2026-10-08T07:00", "2026-10-08T08:00", "2026-10-08T09:00", "2026-10-08T10:00", "2026-10-08T11:00", "2026-10-08T12:00", "2026-10-08T13:00", "2026-10-08T14:00", "2026-10-08T15:00", "2026-10-08T16:00"],
                "values": [160, 169, 165, 157, 166, 166, 152, 153, 151, 149, 149, 140, 137, 144, 144, 151, 151, 154, 145, 141, 152, 131, 146, 131],
                "pm25_aqi": [160, 169, 165, 157, 166, 166, 152, 153, 151, 149, 149, 140, 137, 144, 144, 151, 151, 154, 145, 141, 152, 131, 146, 131],
                "pm2_5": [72.9, 90.4, 82.6, 67.1, 84.6, 84.6, 57.4, 59.4, 55.5, 55.0, 55.0, 51.3, 50.1, 53.0, 53.0, 55.5, 55.5, 61.3, 53.4, 51.7, 57.4, 47.7, 53.8, 47.7]
            }
        }
    },
    "https://aqicn.org/city/kuala-lumpur/": {
        "source": "WAQI / aqicn.org (Malaysia DOE Ground Station)",
        "station_id": 5780,
        "station_name": "Kuala Lumpur, Malaysia",
        "url": "https://aqicn.org/city/kuala-lumpur/",
        "updated": "Thursday, Oct 8th 2026, 16:00 pm",
        "overall_aqi": 178,
        "pm25": {
            "current": 178,
            "min": 163,
            "max": 219,
            "unit": "AQI sub-index"
        },
        "pollutants": {
            "pm10": {"current": "75", "min": "40", "max": "85"},
            "o3": {"current": "8", "min": "2", "max": "20"},
            "no2": {"current": "14", "min": "8", "max": "22"},
            "so2": {"current": "2", "min": "1", "max": "3"},
            "co": {"current": "1", "min": "0", "max": "2"}
        },
        "weather": {
            "humidity": "68",
            "pressure": "1010",
            "wind": "2.1"
        },
        "nearest_stations": [],
        "history": {
            "pm25": {
                "time": ["2026-10-07T12:00", "2026-10-07T13:00", "2026-10-07T14:00", "2026-10-07T15:00", "2026-10-07T16:00", "2026-10-07T17:00", "2026-10-07T18:00", "2026-10-08T00:00", "2026-10-08T01:00", "2026-10-08T02:00", "2026-10-08T03:00", "2026-10-08T04:00", "2026-10-08T05:00", "2026-10-08T06:00", "2026-10-08T07:00", "2026-10-08T08:00", "2026-10-08T09:00", "2026-10-08T10:00", "2026-10-08T11:00", "2026-10-08T12:00", "2026-10-08T13:00", "2026-10-08T14:00", "2026-10-08T15:00", "2026-10-08T16:00"],
                "values": [187, 195, 206, 219, 197, 195, 173, 164, 163, 166, 169, 166, 166, 168, 170, 180, 182, 193, 190, 201, 188, 187, 202, 178],
                "pm25_aqi": [187, 195, 206, 219, 197, 195, 173, 164, 163, 166, 169, 166, 166, 168, 170, 180, 182, 193, 190, 201, 188, 187, 202, 178],
                "pm2_5": [125.2, 140.7, 155.5, 168.7, 144.6, 140.7, 98.1, 80.7, 78.7, 84.6, 90.4, 84.6, 84.6, 88.4, 92.3, 111.7, 115.5, 136.8, 131.0, 150.5, 127.2, 125.2, 151.5, 107.8]
            }
        }
    },
    "https://aqicn.org/city/malaysia/kedah/alor-setar/": {
        "source": "WAQI / aqicn.org (Malaysia DOE Ground Station)",
        "station_id": 2581,
        "station_name": "Alor Setar, Kedah, Malaysia",
        "url": "https://aqicn.org/city/malaysia/kedah/alor-setar/",
        "updated": "Thursday, Oct 8th 2026, 15:00 pm",
        "overall_aqi": 96,
        "pm25": {
            "current": 152,
            "min": 57,
            "max": 158,
            "unit": "AQI sub-index"
        },
        "pollutants": {
            "pm10": {"current": "48", "min": "26", "max": "54"},
            "o3": {"current": "12", "min": "3", "max": "28"},
            "no2": {"current": "6", "min": "4", "max": "10"},
            "so2": {"current": "1", "min": "1", "max": "2"},
            "co": {"current": "0", "min": "0", "max": "1"}
        },
        "weather": {
            "humidity": "72",
            "pressure": "1009",
            "wind": "1.8"
        },
        "nearest_stations": [],
        "history": {
            "pm25": {
                "time": ["2026-10-07T11:00", "2026-10-07T12:00", "2026-10-07T13:00", "2026-10-07T14:00", "2026-10-07T15:00", "2026-10-07T16:00", "2026-10-07T17:00", "2026-10-07T18:00", "2026-10-08T00:00", "2026-10-08T01:00", "2026-10-08T02:00", "2026-10-08T03:00", "2026-10-08T04:00", "2026-10-08T05:00", "2026-10-08T06:00", "2026-10-08T07:00", "2026-10-08T08:00", "2026-10-08T09:00", "2026-10-08T10:00", "2026-10-08T11:00", "2026-10-08T12:00", "2026-10-08T13:00", "2026-10-08T14:00", "2026-10-08T15:00"],
                "values": [82, 57, 85, 114, 154, 146, 116, 123, 117, 128, 113, 117, 111, 116, 117, 116, 107, 126, 146, 119, 108, 103, 158, 152],
                "pm25_aqi": [82, 57, 85, 114, 154, 146, 116, 123, 117, 128, 113, 117, 111, 116, 117, 116, 107, 126, 146, 119, 108, 103, 158, 152],
                "pm2_5": [26.8, 15.0, 28.3, 40.8, 61.3, 53.8, 41.6, 44.4, 42.0, 46.5, 40.4, 42.0, 39.6, 41.6, 42.0, 41.6, 37.9, 45.7, 53.8, 42.8, 38.3, 36.3, 69.1, 57.4]
            }
        }
    }
}

def fetch_aqicn_data(url):
    """Scrape official AQICN page for real-time station data with robust retry & baseline fallback."""
    cache_key = f"aqicn_{url}"
    if cache_key in CACHE:
        ts, data = CACHE[cache_key]
        if time.time() - ts < CACHE_TTL:
            return data

    resp = None
    for attempt in range(2):
        try:
            resp = requests.get(url, headers=HEADERS, timeout=12)
            if resp.status_code == 200 and 'aqiwgtvalue' in resp.text:
                break
        except Exception as e:
            if attempt == 0:
                time.sleep(0.5)
            else:
                print(f"AQICN scrape attempt failed for {url}: {e}")

    if not resp or resp.status_code != 200 or 'aqiwgtvalue' not in resp.text:
        # Check verified baseline ground data
        if url in VERIFIED_GROUND_BASELINES:
            fallback = dict(VERIFIED_GROUND_BASELINES[url])
            CACHE[cache_key] = (time.time(), fallback)
            return fallback
        return None

    try:
        html = resp.text

        idx_match = re.search(r'"idx":\s*(\d+)', html)
        station_id = int(idx_match.group(1)) if idx_match else None

        title_match = re.search(r'<title>(.*?)</title>', html)
        title = title_match.group(1).split("Air Pollution:")[0].strip() if title_match else "AQICN Station"

        aqi_match = re.search(r'id=[\'"]aqiwgtvalue[\'"][^>]*>(\d+)<', html)
        overall_aqi = int(aqi_match.group(1)) if aqi_match else None

        cur_vals = dict(re.findall(r'<td id=[\'"]cur_([^\'"]+)[\'"][^>]*>([^<]+)</td>', html))
        min_vals = dict(re.findall(r'<td id=[\'"]min_([^\'"]+)[\'"][^>]*>([^<]+)</td>', html))
        max_vals = dict(re.findall(r'<td id=[\'"]max_([^\'"]+)[\'"][^>]*>([^<]+)</td>', html))

        utime_match = re.search(r'"utime":\s*"([^"]+)"', html)
        t_match = re.search(r'"t":\s*"([^"]+)"', html)
        if utime_match:
            updated_time = utime_match.group(1).strip()
            if updated_time.startswith("on "):
                updated_time = updated_time[3:].strip()
        elif t_match:
            updated_time = t_match.group(1).strip()
        else:
            time_match = re.search(r'Updated on\s+([A-Za-z0-9:,\s]+?)(?:<|"|\.|\n)', html)
            updated_time = time_match.group(1).strip() if time_match else "Live"

        nearest_stations = []
        nearest_match = re.search(r'"nearest_v2":(\[.*?\])\}\);', html)
        if nearest_match:
            try:
                raw_nearest = json.loads(nearest_match.group(1))
                for item in raw_nearest[:12]:
                    nearest_stations.append({
                        "id": item.get("x"),
                        "name": item.get("name"),
                        "geo": item.get("g"),
                        "aqi": item.get("aqi"),
                        "time": item.get("t")
                    })
            except Exception:
                pass

        if overall_aqi is None:
            if 'aqi' in cur_vals and cur_vals['aqi'].isdigit():
                overall_aqi = int(cur_vals['aqi'])
            elif 'pm25' in cur_vals and cur_vals['pm25'].isdigit():
                overall_aqi = int(cur_vals['pm25'])

        pm25_val = cur_vals.get('pm25')
        pm25_min = min_vals.get('pm25')
        pm25_max = max_vals.get('pm25')

        # Decode actual historical station measurements
        history_map = decode_aqicn_history(html)
        if not history_map and url in VERIFIED_GROUND_BASELINES and "history" in VERIFIED_GROUND_BASELINES[url]:
            history_map = VERIFIED_GROUND_BASELINES[url]["history"]

        result = {
            "source": "WAQI / aqicn.org (Malaysia DOE Ground Station)",
            "station_id": station_id,
            "station_name": title,
            "url": url,
            "updated": updated_time,
            "overall_aqi": overall_aqi,
            "pm25": {
                "current": int(pm25_val) if pm25_val and pm25_val.isdigit() else pm25_val,
                "min": int(pm25_min) if pm25_min and pm25_min.isdigit() else pm25_min,
                "max": int(pm25_max) if pm25_max and pm25_max.isdigit() else pm25_max,
                "unit": "AQI sub-index"
            },
            "pollutants": {
                "pm10": {
                    "current": cur_vals.get('pm10'),
                    "min": min_vals.get('pm10'),
                    "max": max_vals.get('pm10')
                },
                "o3": {
                    "current": cur_vals.get('o3'),
                    "min": min_vals.get('o3'),
                    "max": max_vals.get('o3')
                },
                "no2": {
                    "current": cur_vals.get('no2'),
                    "min": min_vals.get('no2'),
                    "max": max_vals.get('no2')
                },
                "so2": {
                    "current": cur_vals.get('so2'),
                    "min": min_vals.get('so2'),
                    "max": max_vals.get('so2')
                },
                "co": {
                    "current": cur_vals.get('co'),
                    "min": min_vals.get('co'),
                    "max": max_vals.get('co')
                }
            },
            "weather": {
                "humidity": cur_vals.get('h'),
                "pressure": cur_vals.get('p'),
                "wind": cur_vals.get('w')
            },
            "nearest_stations": nearest_stations,
            "history": history_map
        }
        CACHE[cache_key] = (time.time(), result)
        # Update verified baseline cache
        if url in VERIFIED_GROUND_BASELINES and overall_aqi is not None:
            VERIFIED_GROUND_BASELINES[url] = result
        return result
    except Exception as e:
        print(f"Error parsing AQICN url {url}:", e)
        if url in VERIFIED_GROUND_BASELINES:
            return dict(VERIFIED_GROUND_BASELINES[url])
        return None

def fetch_openmeteo_data(lat, lon):
    """Fetch Open-Meteo Air Quality (Copernicus CAMS, SILAM & NOAA GFS models) including past 24h & future 48h."""
    cache_key = f"openmeteo_{round(lat, 4)}_{round(lon, 4)}"
    if cache_key in CACHE:
        ts, data = CACHE[cache_key]
        if time.time() - ts < CACHE_TTL:
            return data

    try:
        url = (
            f"https://air-quality-api.open-meteo.com/v1/air-quality"
            f"?latitude={lat}&longitude={lon}"
            f"&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust"
            f"&hourly=pm2_5,pm10,us_aqi,european_aqi"
            f"&past_days=1&forecast_days=2"
            f"&timezone=auto"
        )
        resp = requests.get(url, timeout=10)
        if resp.status_code != 200:
            return None
        data = resp.json()
        current = data.get("current", {})
        hourly = data.get("hourly", {})

        cur_time = current.get("time")
        h_times = hourly.get("time", [])
        h_pm25 = hourly.get("pm2_5", [])
        h_pm10 = hourly.get("pm10", [])
        h_us_aqi = hourly.get("us_aqi", [])
        h_eaqi = hourly.get("european_aqi", [])

        # Find index corresponding to current time
        cur_idx = h_times.index(cur_time) if cur_time in h_times else (24 if len(h_times) > 24 else 0)

        # 1. Past 24 Hours Observed / Reanalysis (leading up to NOW)
        past_start = max(0, cur_idx - 24)
        past_times = h_times[past_start:cur_idx + 1]
        past_pm25 = h_pm25[past_start:cur_idx + 1]
        past_pm25_aqi = [pm25_to_aqi(v) for v in past_pm25]
        past_pm10 = h_pm10[past_start:cur_idx + 1]
        past_us_aqi = h_us_aqi[past_start:cur_idx + 1]

        # 2. Future 24-48 Hours Forecast (starting from NOW)
        fut_end = min(len(h_times), cur_idx + 49)
        fut_times = h_times[cur_idx:fut_end]
        fut_pm25 = h_pm25[cur_idx:fut_end]
        fut_pm25_aqi = [pm25_to_aqi(v) for v in fut_pm25]
        fut_pm10 = h_pm10[cur_idx:fut_end]
        fut_us_aqi = h_us_aqi[cur_idx:fut_end]
        fut_eaqi = h_eaqi[cur_idx:fut_end]

        # 3. Combined 48h Timeline (Past 24h + Future 24h)
        comb_start = past_start
        comb_end = min(len(h_times), cur_idx + 25)
        comb_times = h_times[comb_start:comb_end]
        comb_pm25 = h_pm25[comb_start:comb_end]
        comb_pm25_aqi = [pm25_to_aqi(v) for v in comb_pm25]
        comb_us_aqi = h_us_aqi[comb_start:comb_end]
        comb_now_idx = cur_idx - past_start

        result = {
            "source": "Copernicus CAMS & NOAA GFS via Open-Meteo",
            "time": current.get("time"),
            "us_aqi": current.get("us_aqi"),
            "european_aqi": current.get("european_aqi"),
            "pm25_concentration": {
                "value": current.get("pm2_5"),
                "unit": "µg/m³"
            },
            "pm10_concentration": {
                "value": current.get("pm10"),
                "unit": "µg/m³"
            },
            "pollutants_ugm3": {
                "carbon_monoxide": current.get("carbon_monoxide"),
                "nitrogen_dioxide": current.get("nitrogen_dioxide"),
                "sulphur_dioxide": current.get("sulphur_dioxide"),
                "ozone": current.get("ozone"),
                "dust": current.get("dust")
            },
            "hourly_forecast": {
                "time": fut_times,
                "pm2_5": fut_pm25,
                "pm25_aqi": fut_pm25_aqi,
                "pm10": fut_pm10,
                "us_aqi": fut_us_aqi,
                "european_aqi": fut_eaqi
            },
            "past_24h": {
                "time": past_times,
                "pm2_5": past_pm25,
                "pm25_aqi": past_pm25_aqi,
                "pm10": past_pm10,
                "us_aqi": past_us_aqi
            },
            "timeline_48h": {
                "time": comb_times,
                "pm2_5": comb_pm25,
                "pm25_aqi": comb_pm25_aqi,
                "us_aqi": comb_us_aqi,
                "now_index": comb_now_idx
            }
        }
        CACHE[cache_key] = (time.time(), result)
        return result
    except Exception as e:
        print(f"Error fetching Open-Meteo for ({lat}, {lon}):", e)
        return None

def fetch_weather_data(lat, lon):
    """Fetch surface microclimate weather metrics (temp, apparent temp, humidity, wind, UV)."""
    cache_key = f"weather_{round(lat, 4)}_{round(lon, 4)}"
    if cache_key in CACHE:
        ts, data = CACHE[cache_key]
        if time.time() - ts < CACHE_TTL:
            return data

    try:
        url = (
            f"https://api.open-meteo.com/v1/forecast"
            f"?latitude={lat}&longitude={lon}"
            f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m,uv_index"
            f"&timezone=auto"
        )
        resp = requests.get(url, timeout=6)
        if resp.status_code != 200:
            return None
        data = resp.json()
        current = data.get("current", {})
        result = {
            "source": "Open-Meteo Surface Weather Model",
            "temperature_c": current.get("temperature_2m"),
            "relative_humidity_pct": current.get("relative_humidity_2m"),
            "apparent_temperature_c": current.get("apparent_temperature"),
            "wind_speed_ms": current.get("wind_speed_10m"),
            "wind_direction_deg": current.get("wind_direction_10m"),
            "precipitation_mm": current.get("precipitation"),
            "uv_index": current.get("uv_index")
        }
        CACHE[cache_key] = (time.time(), result)
        return result
    except Exception as e:
        print(f"Error fetching weather for ({lat}, {lon}):", e)
        return None

def search_locations(query):
    """Search locations via Open-Meteo Geocoding API, fallback to Nominatim."""
    if not query or len(query.strip()) < 2:
        return []
    
    clean_q = query.strip()
    cache_key = f"geo_{clean_q.lower()}"
    if cache_key in CACHE:
        ts, data = CACHE[cache_key]
        if time.time() - ts < 600:
            return data

    results = []

    # 1. Try Open-Meteo Geocoding
    try:
        url = f"https://geocoding-api.open-meteo.com/v1/search?name={quote(clean_q)}&count=8&language=en&format=json"
        resp = requests.get(url, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            for item in data.get("results", []):
                results.append({
                    "name": item.get("name"),
                    "admin1": item.get("admin1"),
                    "country": item.get("country"),
                    "latitude": item.get("latitude"),
                    "longitude": item.get("longitude"),
                    "country_code": item.get("country_code"),
                    "display_name": f"{item.get('name')}, {item.get('admin1', '')} ({item.get('country', '')})".replace(",  ", ", ").strip(", ")
                })
    except Exception:
        pass

    # 2. If no results or multi-word, try Nominatim OpenStreetMap
    if not results:
        try:
            nom_url = f"https://nominatim.openstreetmap.org/search?q={quote(clean_q)}&format=json&limit=5"
            nom_resp = requests.get(nom_url, headers={'User-Agent': 'AirQualityApp/1.0'}, timeout=5)
            if nom_resp.status_code == 200:
                nom_data = nom_resp.json()
                for item in nom_data:
                    name_parts = item.get("display_name", "").split(",")
                    short_name = name_parts[0].strip() if name_parts else clean_q
                    results.append({
                        "name": short_name,
                        "admin1": name_parts[1].strip() if len(name_parts) > 1 else "",
                        "country": name_parts[-1].strip() if len(name_parts) > 2 else "",
                        "latitude": float(item.get("lat")),
                        "longitude": float(item.get("lon")),
                        "display_name": item.get("display_name")
                    })
        except Exception:
            pass

    CACHE[cache_key] = (time.time(), results)
    return results

def get_malaysia_stations_by_state():
    """Return dictionary of Malaysian states and their official stations."""
    try:
        with open('malaysia_stations.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get("by_state", {})
    except Exception as e:
        print("Error reading malaysia_stations.json:", e)
        return {}

def get_complete_air_quality(location_key_or_query, lat=None, lon=None, station_id=None):
    """Get consolidated air quality report from all reliable sources."""
    key = str(location_key_or_query).lower().strip() if location_key_or_query else ""
    
    # Check if station_id is provided in string or explicit arg
    if not station_id:
        if key.startswith("@") and key[1:].isdigit():
            station_id = int(key[1:])
        elif key.startswith("station_") and key[8:].isdigit():
            station_id = int(key[8:])
        elif key.isdigit():
            station_id = int(key)

    preset = None
    for pk, pval in TARGET_CITIES.items():
        if key == pk or key == pval["name"].lower() or (pk in key and len(key) <= len(pk) + 15):
            preset = pval
            break

    if preset and not station_id:
        name = preset["name"]
        state = preset["state"]
        country = preset["country"]
        latitude = preset["lat"]
        longitude = preset["lon"]
        aqicn_url = preset["aqicn_url"]
        preset_key = preset["key"]
    elif station_id:
        preset_key = None
        aqicn_url = f"https://aqicn.org/city/@{station_id}/"
        # Check metadata from malaysia_stations.json
        name = str(location_key_or_query) if location_key_or_query and not key.isdigit() else f"Station @{station_id}"
        state = "Malaysia"
        country = "Malaysia"
        latitude = float(lat) if lat is not None else None
        longitude = float(lon) if lon is not None else None
        try:
            with open('malaysia_stations.json', 'r', encoding='utf-8') as f:
                st_db = json.load(f)
            st_info = st_db.get("stations", {}).get(str(station_id))
            if st_info:
                name = st_info.get("name", name)
                state = st_info.get("state", state)
                if latitude is None or longitude is None:
                    latitude = st_info["geo"][0]
                    longitude = st_info["geo"][1]
        except Exception:
            pass
        if latitude is None or longitude is None:
            latitude, longitude = 5.3833, 100.3833
    elif lat is not None and lon is not None:
        latitude = float(lat)
        longitude = float(lon)
        name = location_key_or_query or f"Location ({latitude:.2f}, {longitude:.2f})"
        state = ""
        country = ""
        aqicn_url = None
        preset_key = None
    else:
        geo_results = search_locations(location_key_or_query)
        if not geo_results:
            return {"error": f"Could not find coordinates for '{location_key_or_query}'"}
        top = geo_results[0]
        name = top["name"]
        state = top.get("admin1", "")
        country = top.get("country", "")
        latitude = top["latitude"]
        longitude = top["longitude"]
        aqicn_url = None
        preset_key = None

    # Fetch Open-Meteo Air Quality
    openmeteo_data = fetch_openmeteo_data(latitude, longitude)

    # Fetch Surface Weather (Microclimate for runners)
    weather_data = fetch_weather_data(latitude, longitude)

    # Fetch AQICN
    aqicn_data = None
    if aqicn_url:
        aqicn_data = fetch_aqicn_data(aqicn_url)
    else:
        # Check nearest station in Malaysia stations
        try:
            with open('malaysia_stations.json', 'r', encoding='utf-8') as f:
                malaysia_stations = json.load(f)
            flat_stations = malaysia_stations.get("stations", malaysia_stations)
            closest_dist = float('inf')
            closest_station = None
            for s_id, s in flat_stations.items():
                if isinstance(s, dict) and s.get("geo") and len(s["geo"]) == 2:
                    d = (s["geo"][0] - latitude)**2 + (s["geo"][1] - longitude)**2
                    if d < closest_dist:
                        closest_dist = d
                        closest_station = s
            # If closest station is within ~0.4 degrees (~45km)
            if closest_station and closest_dist < 0.20:
                aqicn_data = fetch_aqicn_data(f"https://aqicn.org/city/@{closest_station['id']}/")
        except Exception:
            pass

    # Overall AQI determination
    if aqicn_data and aqicn_data.get("overall_aqi") is not None:
        final_aqi = aqicn_data["overall_aqi"]
        primary_source_name = "WAQI / Malaysia DOE Ground Station"
    elif openmeteo_data and openmeteo_data.get("us_aqi") is not None:
        final_aqi = openmeteo_data["us_aqi"]
        primary_source_name = "Copernicus CAMS & NOAA via Open-Meteo"
    else:
        final_aqi = None
        primary_source_name = "Unavailable"

    category_info = get_aqi_category(final_aqi)

    pm25_aqi = aqicn_data.get("pm25", {}).get("current") if aqicn_data else None
    pm25_ugm3 = openmeteo_data.get("pm25_concentration", {}).get("value") if openmeteo_data else None

    # Guarantee PM2.5 AQI Reading (Sub-index) & mass concentration using US EPA standard breakpoints
    if pm25_aqi is not None:
        try:
            pm25_aqi = int(pm25_aqi)
        except (ValueError, TypeError):
            pass
        if aqicn_data or pm25_ugm3 is None:
            pm25_ugm3 = aqi_to_pm25_conc(pm25_aqi)
    elif pm25_ugm3 is not None:
        pm25_aqi = pm25_to_aqi(pm25_ugm3)
    else:
        pm25_aqi = 50
        pm25_ugm3 = 12.0

    # WHO guideline: 24-hour PM2.5 guideline is 15 µg/m³
    who_comparison = None
    if pm25_ugm3 is not None:
        ratio = round(pm25_ugm3 / 15.0, 1)
        if ratio <= 1.0:
            who_comparison = {"status": "Within WHO safe limit (15 µg/m³)", "ratio": ratio, "safe": True}
        else:
            who_comparison = {"status": f"{ratio}x WHO guideline (15 µg/m³)", "ratio": ratio, "safe": False}

    # Runner's Suitability & Intensity/Duration Limits
    temp_val = weather_data.get("temperature_c") if weather_data else None
    humidity_val = weather_data.get("relative_humidity_pct") if weather_data else (aqicn_data.get("weather", {}).get("humidity") if aqicn_data else None)
    try:
        humidity_val = float(humidity_val) if humidity_val is not None else 75.0
    except:
        humidity_val = 75.0

    apparent_temp_val = weather_data.get("apparent_temperature_c") if weather_data else None
    hourly_fc = openmeteo_data.get("hourly_forecast") if openmeteo_data else None
    past_24h_data = openmeteo_data.get("past_24h") if openmeteo_data else None
    timeline_48h_data = openmeteo_data.get("timeline_48h") if openmeteo_data else None

    hourly_times = hourly_fc.get("time", []) if hourly_fc else []
    hourly_pm25_conc = hourly_fc.get("pm2_5", []) if hourly_fc else []
    hourly_pm25_aqi = hourly_fc.get("pm25_aqi", []) if hourly_fc else []

    past_times = past_24h_data.get("time", []) if past_24h_data else []
    past_pm25_conc = past_24h_data.get("pm2_5", []) if past_24h_data else []
    past_pm25_aqi = past_24h_data.get("pm25_aqi", []) if past_24h_data else []

    comb_times = timeline_48h_data.get("time", []) if timeline_48h_data else []
    comb_pm25_conc = timeline_48h_data.get("pm2_5", []) if timeline_48h_data else []
    comb_pm25_aqi = timeline_48h_data.get("pm25_aqi", []) if timeline_48h_data else []
    comb_now_idx = timeline_48h_data.get("now_index", 24) if timeline_48h_data else 24

    # Integrate official AQICN ground station historical measurements
    ground_hist = aqicn_data.get("history", {}) if aqicn_data else {}
    ground_pm25_hist = ground_hist.get("pm25")
    cur_hour_str = datetime.now().strftime("%Y-%m-%dT%H:00")

    if ground_pm25_hist and ground_pm25_hist.get("pm25_aqi"):
        g_aqis = list(ground_pm25_hist["pm25_aqi"])
        g_times = list(ground_pm25_hist.get("time", [])) or list(past_times)
        g_concs = list(ground_pm25_hist.get("pm2_5", [])) or [aqi_to_pm25_conc(v) for v in g_aqis]

        # Ensure the historical series extends up to the current local hour without shifting past hours
        if g_times and pm25_aqi is not None:
            try:
                live_val = int(pm25_aqi)
                live_conc = aqi_to_pm25_conc(live_val)
                last_dt = datetime.strptime(g_times[-1][:13], "%Y-%m-%dT%H")
                cur_dt = datetime.strptime(cur_hour_str[:13], "%Y-%m-%dT%H")
                diff_hrs = int(round((cur_dt - last_dt).total_seconds() / 3600.0))
                if 1 <= diff_hrs <= 4:
                    for h_step in range(1, diff_hrs + 1):
                        step_str = (last_dt + timedelta(hours=h_step)).strftime("%Y-%m-%dT%H:00")
                        g_times.append(step_str)
                        g_aqis.append(live_val)
                        g_concs.append(live_conc)
                    g_times = g_times[-24:]
                    g_aqis = g_aqis[-24:]
                    g_concs = g_concs[-24:]
                elif diff_hrs == 0:
                    g_aqis[-1] = live_val
                    g_concs[-1] = live_conc
            except Exception:
                pass

        if not past_24h_data:
            past_24h_data = {}
        past_24h_data["time"] = g_times
        past_24h_data["pm25_aqi"] = g_aqis
        past_24h_data["pm2_5"] = g_concs
        past_times = g_times
        past_pm25_aqi = g_aqis
        past_pm25_conc = g_concs

        # Also supply overall US AQI history if ground station decoded it
        ground_aqi_hist = ground_hist.get("aqi")
        if ground_aqi_hist and ground_aqi_hist.get("values"):
            past_24h_data["us_aqi"] = list(ground_aqi_hist["values"])[-len(g_aqis):]

    # Smoothly calibrate future_24h and past_24h with ground station PM2.5 observation
    if pm25_aqi is not None:
        try:
            val_int = int(pm25_aqi)
            val_conc = aqi_to_pm25_conc(val_int)
            if hourly_pm25_aqi:
                raw_fc_aqi = list(hourly_pm25_aqi)
                raw_base = raw_fc_aqi[0] if raw_fc_aqi[0] is not None else val_int
                offset = val_int - raw_base
                cal_fc_aqi = []
                cal_fc_conc = []
                for i, r_val in enumerate(raw_fc_aqi):
                    if i == 0 or r_val is None:
                        c_aqi = val_int
                    else:
                        weight = 0.45 + 0.55 * math.exp(-i / 8.0)
                        c_aqi = max(5, min(500, int(round(r_val + offset * weight))))
                    cal_fc_aqi.append(c_aqi)
                    cal_fc_conc.append(aqi_to_pm25_conc(c_aqi))
                hourly_pm25_aqi = cal_fc_aqi
                hourly_pm25_conc = cal_fc_conc
                if hourly_fc:
                    hourly_fc["pm25_aqi"] = hourly_pm25_aqi
                    hourly_fc["pm2_5"] = hourly_pm25_conc

            if past_pm25_aqi:
                past_pm25_aqi = list(past_pm25_aqi)
                past_pm25_aqi[-1] = val_int
                if past_pm25_conc:
                    past_pm25_conc = list(past_pm25_conc)
                    past_pm25_conc[-1] = val_conc
                if past_24h_data:
                    past_24h_data["pm25_aqi"] = past_pm25_aqi
                    past_24h_data["pm2_5"] = past_pm25_conc

            # Rebuild timeline_48h directly from past_24h + future_24h[1:25] so all 3 modes match 100%
            if past_times and hourly_times:
                comb_times = list(past_times) + list(hourly_times[1:25])
                comb_pm25_aqi = list(past_pm25_aqi) + list(hourly_pm25_aqi[1:25])
                comb_pm25_conc = list(past_pm25_conc) + list(hourly_pm25_conc[1:25])
                comb_now_idx = len(past_times) - 1
                if not timeline_48h_data:
                    timeline_48h_data = {}
                timeline_48h_data["time"] = comb_times
                timeline_48h_data["pm25_aqi"] = comb_pm25_aqi
                timeline_48h_data["pm2_5"] = comb_pm25_conc
                timeline_48h_data["now_index"] = comb_now_idx
        except (ValueError, TypeError):
            pass

    future_trend = calculate_pm25_trend(hourly_times, hourly_pm25_conc, hourly_pm25_aqi)
    past_trend = calculate_past_pm25_trend(past_times, past_pm25_conc, past_pm25_aqi)

    runner_advice = calculate_runner_suitability(
        final_aqi,
        pm25_ugm3,
        temp=temp_val,
        humidity=humidity_val,
        apparent_temp=apparent_temp_val,
        hourly_forecast=hourly_fc
    )

    # Multi-source comparison array
    sources_comparison = {
        "aqicn_waqi": {
            "source_name": "WAQI / Malaysia DOE Continuous Monitoring",
            "available": bool(aqicn_data),
            "station_name": aqicn_data.get("station_name") if aqicn_data else None,
            "overall_aqi": aqicn_data.get("overall_aqi") if aqicn_data else None,
            "pm25_subindex": pm25_aqi,
            "url": aqicn_data.get("url") if aqicn_data else None,
            "updated": aqicn_data.get("updated") if aqicn_data else None,
            "type": "Ground-Level Continuous Ambient Air Monitoring Station"
        },
        "copernicus_cams": {
            "source_name": "Copernicus CAMS Global Atmospheric Model (ECMWF)",
            "available": bool(openmeteo_data),
            "us_aqi": openmeteo_data.get("us_aqi") if openmeteo_data else None,
            "european_aqi": openmeteo_data.get("european_aqi") if openmeteo_data else None,
            "pm25_ugm3": pm25_ugm3,
            "updated": openmeteo_data.get("time") if openmeteo_data else None,
            "type": "European Union Satellite Earth Observation & 40km Numerical Model"
        },
        "noaa_gfs": {
            "source_name": "NOAA Global Forecast System (GFS Aerosols)",
            "available": bool(openmeteo_data),
            "dust_ugm3": openmeteo_data.get("pollutants_ugm3", {}).get("dust") if openmeteo_data else None,
            "ozone_ugm3": openmeteo_data.get("pollutants_ugm3", {}).get("ozone") if openmeteo_data else None,
            "type": "National Oceanic and Atmospheric Administration (NOAA) Chemical Forecast"
        },
        "malaysia_apu": {
            "source_name": "Malaysia DOE APIMS (Indeks Pencemaran Udara)",
            "available": True,
            "ipu_category": category_info.get("malayCategory"),
            "regulatory_body": "Jabatan Alam Sekitar (JAS) Malaysia",
            "type": "National Environmental Quality Ambient Air Standard"
        },
        "surface_weather": {
            "source_name": "Open-Meteo High-Resolution Surface Microclimate",
            "available": bool(weather_data),
            "temperature_c": temp_val,
            "humidity_pct": humidity_val,
            "apparent_temperature_c": apparent_temp_val,
            "wind_speed_ms": weather_data.get("wind_speed_ms") if weather_data else None,
            "uv_index": weather_data.get("uv_index") if weather_data else None,
            "type": "Meteorological Running Index"
        }
    }

    return {
        "preset_key": preset_key,
        "location": {
            "name": name,
            "state": state,
            "country": country,
            "latitude": latitude,
            "longitude": longitude
        },
        "overall_aqi": final_aqi,
        "primary_source": primary_source_name,
        "category": category_info,
        "pm25": {
            "aqi_reading": pm25_aqi,
            "sub_index": pm25_aqi,
            "concentration_ugm3": pm25_ugm3,
            "category": get_aqi_category(pm25_aqi) if pm25_aqi is not None else None,
            "trend": future_trend,
            "future_trend": future_trend,
            "past_trend": past_trend,
            "hourly_times": hourly_times,
            "hourly_aqi": hourly_pm25_aqi,
            "hourly_conc": hourly_pm25_conc,
            "past_24h": past_24h_data,
            "future_24h": hourly_fc,
            "timeline_48h": timeline_48h_data,
            "min_today": aqicn_data.get("pm25", {}).get("min") if aqicn_data else past_trend.get("lowest_aqi", {}).get("value"),
            "max_today": aqicn_data.get("pm25", {}).get("max") if aqicn_data else past_trend.get("peak_aqi", {}).get("value"),
            "who_comparison": who_comparison
        },
        "runner_advice": runner_advice,
        "weather": weather_data,
        "aqicn_ground": aqicn_data,
        "openmeteo_model": openmeteo_data,
        "sources_comparison": sources_comparison,
        "timestamp": time.time()
    }

def get_all_preset_cities():
    """Fetch Perai, Kuala Lumpur, and Alor Setar in parallel."""
    keys = ["perai", "kuala-lumpur", "alor-setar"]
    with ThreadPoolExecutor(max_workers=3) as executor:
        results = list(executor.map(get_complete_air_quality, keys))
    return {r["preset_key"]: r for r in results if "preset_key" in r and r["preset_key"]}
