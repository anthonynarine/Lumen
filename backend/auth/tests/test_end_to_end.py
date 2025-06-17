import pytest
import os
import requests
from decouple import config
from auth_integration import verify_token
from auth_integration.exceptions import InvalidTokenError, AuthServiceUnavailable

# to RUN TEST: pytest -m integration -v

# Load values from the .env file or environment variables.
AUTH_API_LOGIN_URL = config("TEST_LOGIN_URL", default="https://ant-django-auth-62cf01255868.herokuapp.com/api/login/")
TEST_USERNAME = config("TEST_USERNAME")
TEST_PASSWORD = config("TEST_PASSWORD")
AUTH_API_URL = config("AUTH_API_URL")

@pytest.mark.integration
def test_valid_token_returns_user_claims():
    """
    ✅ Full integration test:
    This test simulates a real authentication flow using the Auth API + auth_integration package.

    Steps:
    1. Send login credentials (from .env) to the Auth API's /login/ endpoint.
    2. Receive a real JWT access token.
    3. Pass the token to verify_token(), which calls /api/whoami/ via auth_integration.
    4. Confirm the returned user dictionary contains expected identity and role data.

    Purpose:
    - Ensures that the Auth API is reachable and functioning.
    - Confirms that auth_integration can validate live tokens correctly.
    - Detects any breaking changes in token structure or response shape.

    This test should pass in any Django or microservice project that installs auth_integration.
    """
    # Step 1: Log in and get access token
    response = requests.post(AUTH_API_LOGIN_URL, json={
        "email": TEST_USERNAME,
        "password": TEST_PASSWORD
    })

    assert response.status_code == 200, f"Login failed: {response.status_code} → {response.text}"
    token = response.json().get("access_token")
    assert token is not None, f"Access token was not returned: {response.json()}"

    # Step 2: Set AUTH_API_URL as environment variable so verify_token() can find it
    os.environ["AUTH_API_URL"] = AUTH_API_URL

    # Step 3: Use auth_integration to verify the token
    user = verify_token(token)

    # Step 4: Confirm user structure and identity
    assert user["email"] == TEST_USERNAME
    assert user["role"] in ["admin", "technologist", "physician"]
    assert "id" in user
    assert "first_name" in user
    assert "last_name" in user


@pytest.mark.integration
def test_invalid_token_raises_error():
    """
    🔒 Security validation:
    This test ensures that auth_integration correctly rejects a fake or malformed token.

    Steps:
    - Provide an obviously invalid token string.
    - Call verify_token(), which will call /api/whoami/ with the fake token.
    - Expect it to raise an InvalidTokenError exception.

    Purpose:
    - Confirms that invalid tokens are not silently accepted.
    - Protects against authorization bypass bugs or silent failures.
    """
    with pytest.raises(InvalidTokenError):
        verify_token("this.is.not.a.valid.token")


@pytest.mark.integration
def test_unreachable_auth_api(monkeypatch):
    """
    🚨 Network fault tolerance:
    This test simulates the Auth API being unreachable (e.g., offline, wrong DNS, network outage).

    Steps:
    - Use pytest's monkeypatch to override AUTH_API_URL with a fake domain.
    - Call verify_token() with a fake token (it won’t matter since the API call will fail).
    - Expect it to raise AuthServiceUnavailable.

    Purpose:
    - Confirms that auth_integration fails gracefully during connection issues.
    - Prevents downstream crashes due to unhandled request exceptions.
    - Ensures robust fallback behavior in production environments.
    """
    monkeypatch.setenv("AUTH_API_URL", "https://nonexistent-api.example.com")
    with pytest.raises(AuthServiceUnavailable):
        verify_token("some-token")
