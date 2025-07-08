from flask import request, jsonify, g
from clerk_backend_api import Clerk
from clerk_backend_api.security import authenticate_request
from clerk_backend_api.security.types import AuthenticateRequestOptions
from werkzeug.wrappers import Request as WerkzeugRequest

from . import config

clerk = Clerk(bearer_auth=config.clerk_secret_key)

def clerk_auth_required(f):
    def wrapper(*args, **kwargs):
        # Convert Flask request to something compatible with httpx.Request interface
        # Minimal required for Clerk: method, url, headers
        headers = {k: v for k, v in request.headers.items()}
        url = request.url

        # Build a minimal httpx.Request-like object
        class MinimalRequest:
            def __init__(self, method, url, headers):
                self.method = method
                self.url = url
                self.headers = headers

        minimal_req = MinimalRequest(request.method, url, headers)

        try:
            # authenticate_request expects httpx.Request compatible object
            request_state = clerk.authenticate_request(
                minimal_req,
                AuthenticateRequestOptions(
                    authorized_parties=None  # or set your authorized parties list
                )
            )

            if not request_state.is_signed_in:
                return jsonify({"error": "Unauthorized"}), 401

            # Attach user id to flask.g
            g.user_id = request_state.payload.get("sub")

            return f(*args, **kwargs)

        except Exception as e:
            print("Clerk authentication failed:", e)
            return jsonify({"error": "Unauthorized"}), 401

    wrapper.__name__ = f.__name__
    return wrapper
