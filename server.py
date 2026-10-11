import http.server
import socketserver
import json
import urllib.parse
import os
import sys
import webbrowser
import aqi_service

PORT = 5050

class AirQualityHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS for local development / testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def _safe_send_json(self, status_code, data):
        try:
            payload = json.dumps(data, ensure_ascii=False).encode('utf-8')
            self.send_response(status_code)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Content-Length', str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError, TimeoutError):
            pass
        except Exception:
            pass

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        query_params = urllib.parse.parse_qs(parsed_url.query)

        # API Routes
        if path == '/api/preset-cities':
            try:
                data = aqi_service.get_all_preset_cities()
                self._safe_send_json(200, data)
            except Exception as e:
                import traceback
                traceback.print_exc()
                self._safe_send_json(500, {"error": str(e)})
            return

        elif path == '/api/air-quality':
            city = query_params.get('city', [None])[0] or query_params.get('preset', [None])[0]
            lat = query_params.get('lat', [None])[0]
            lon = query_params.get('lon', [None])[0]
            name = query_params.get('name', [None])[0]
            station_id = query_params.get('station_id', [None])[0]

            try:
                if station_id:
                    data = aqi_service.get_complete_air_quality(name or f"Station @{station_id}", lat=float(lat) if lat else None, lon=float(lon) if lon else None, station_id=int(station_id))
                elif lat and lon:
                    data = aqi_service.get_complete_air_quality(name or f"({lat}, {lon})", lat=float(lat), lon=float(lon))
                elif city:
                    data = aqi_service.get_complete_air_quality(city)
                else:
                    data = {"error": "Missing 'city', 'station_id', or 'lat' and 'lon' parameter"}

                self._safe_send_json(200, data)
            except Exception as e:
                import traceback
                traceback.print_exc()
                self._safe_send_json(500, {"error": str(e)})
            return

        elif path == '/api/search':
            q = query_params.get('q', [''])[0]
            try:
                results = aqi_service.search_locations(q)
                self._safe_send_json(200, results)
            except Exception as e:
                self._safe_send_json(500, {"error": str(e)})
            return

        elif path == '/api/stations':
            try:
                with open('malaysia_stations.json', 'r', encoding='utf-8') as f:
                    data = json.load(f)
            except Exception:
                data = {}
            self._safe_send_json(200, data)
            return

        elif path == '/api/stations-by-state':
            try:
                data = aqi_service.get_malaysia_stations_by_state()
            except Exception:
                data = {}
            self._safe_send_json(200, data)
            return

        # Fallback to static files
        if path == '/' or path == '':
            self.path = '/index.html'

        try:
            return super().do_GET()
        except (ConnectionResetError, ConnectionAbortedError, BrokenPipeError):
            pass

class ThreadedHTTPServer(http.server.ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True

def run_server(port=PORT, open_browser=False):
    current_port = port
    max_tries = 10
    httpd = None

    for i in range(max_tries):
        try:
            httpd = ThreadedHTTPServer(("", current_port), AirQualityHandler)
            break
        except OSError:
            current_port += 1

    if not httpd:
        print(f"Error: Could not bind to any port between {port} and {port + max_tries}")
        sys.exit(1)

    url = f"http://localhost:{current_port}"
    print("=" * 60)
    print(f" AeroPulse Air Quality App is running (Multi-threaded)!")
    print(f" URL: {url}")
    print(f" Monitoring: Perai (Penang), Kuala Lumpur, Alor Setar (Kedah)")
    print(f" Sources: WAQI (aqicn.org), Malaysia DOE, Copernicus CAMS")
    print(f" Press Ctrl+C to stop the server.")
    print("=" * 60)

    if open_browser:
        webbrowser.open(url)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == '__main__':
    open_in_browser = '--open' in sys.argv
    run_server(PORT, open_browser=open_in_browser)
