import os
import sys
import requests

def main():
    port = os.getenv("PORT", "8088")
    url = f"http://localhost:{port}/ping"

    try:
        response = requests.get(url, timeout=2)
        print(f"HTTP Status: {response.status_code} {response.reason}")
        if 200 <= response.status_code < 300:
            sys.exit(0)  # success
        else:
            sys.exit(1)  # failure - non 2xx
    except requests.RequestException as e:
        print(f"Health check failed: {e}")
        sys.exit(1)  # failure - exception

if __name__ == "__main__":
    main()
