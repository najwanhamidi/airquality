#!/usr/bin/env python3
"""
AeroPulse — Automated AQI Ground Station Cron Updater
Fetches live ground station observations from AQICN & Malaysia DOE,
decodes the 24-hour historical past measurements, and synchronizes
all preset JSON files and bundled HTML files.
"""

import os
import sys
import json
import re
import datetime
import aqi_service
import build_standalone

def run_update():
    print("=" * 60)
    print(f" AeroPulse AQI Cron Updater - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    try:
        data = aqi_service.get_all_preset_cities()
    except Exception as e:
        print(f"Error fetching preset cities from aqi_service: {e}")
        sys.exit(1)

    if not data or not isinstance(data, dict):
        print("Error: Received empty or invalid data from aqi_service.")
        sys.exit(1)

    # Validate essential cities
    for k in ['perai', 'kuala-lumpur', 'alor-setar']:
        if k not in data or not data[k].get('pm25'):
            print(f"Warning: City '{k}' is missing or incomplete in fetched data.")

    # 1. Update preset_cities.json
    with open('preset_cities.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("[OK] Updated preset_cities.json")

    with open('fresh_presets.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("[OK] Updated fresh_presets.json")

    # 2. Update github_pages_mobile/preset_cities.json
    os.makedirs('github_pages_mobile', exist_ok=True)
    with open('github_pages_mobile/preset_cities.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("[OK] Updated github_pages_mobile/preset_cities.json")

    # 3. Update M_FALLBACK_PRESETS in mobile.js
    if os.path.exists('mobile.js'):
        with open('mobile.js', 'r', encoding='utf-8') as f:
            js_content = f.read()

        presets_js = 'const M_FALLBACK_PRESETS = ' + json.dumps(data, indent=2, ensure_ascii=False) + ';\n'
        pattern = re.compile(r'const M_FALLBACK_PRESETS = \{[\s\S]*?\n\};', re.MULTILINE)
        if pattern.search(js_content):
            js_content = pattern.sub(presets_js, js_content, count=1)
            with open('mobile.js', 'w', encoding='utf-8') as f:
                f.write(js_content)
            print("[OK] Updated M_FALLBACK_PRESETS in mobile.js")
        else:
            print("Notice: Could not find M_FALLBACK_PRESETS regex pattern in mobile.js")

    # 4. Re-bundle standalone_mobile.html and github_pages_mobile/index.html
    try:
        build_standalone.build()
        print("[OK] Re-bundled standalone_mobile.html & github_pages_mobile/index.html")
    except Exception as e:
        print(f"Error during build_standalone: {e}")

    # Summary
    print("-" * 60)
    for k in ['perai', 'kuala-lumpur', 'alor-setar']:
        c = data.get(k, {})
        aqi = c.get('overall_aqi', '--')
        pm25 = c.get('pm25', {})
        pm_aqi = pm25.get('aqi_reading', '--')
        conc = pm25.get('concentration_ugm3', '--')
        past_cnt = len(pm25.get('past_24h', {}).get('pm25_aqi', []))
        last_t = pm25.get('past_24h', {}).get('time', ['--'])[-1]
        print(f" Station {k.upper():14}: AQI={aqi:<3} | PM2.5 AQI={pm_aqi:<3} | Conc={conc} ug/m3 | 24h count={past_cnt} (Latest: {last_t})")
    print("=" * 60)
    print("[OK] 24/7 Ground sync completed successfully.")

if __name__ == '__main__':
    run_update()
