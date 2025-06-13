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
            sys.exit(0)
        else:
            sys.exit(1)
    except requests.RequestException as e:
        print(f"Health check failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
