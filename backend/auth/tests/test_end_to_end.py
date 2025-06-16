
import pytest
import os
import requests
from decouple import config
from auth_integration import verify_token
from auth_integration.exceptions import InvalidTokenError, AuthServiceUnavailable

AUTH_API_LOGIN_URL = config("TEST_LOGIN_URL", default="https://ant-django-auth-62cf01255868.herokuapp.com/api/login/")
TEST_USERNAME = config("TEST_USERNAME")
TEST_PASSWORD = config("TEST_PASSWORD")
AUTH_API_URL = config("AUTH_API_URL")

@pytest.mark.integration
def test_valid_token_returns_user_claims():
    """
    End-to-end test: Login via Auth API and verify token using auth_integration.
    """
    # Step 1: Log in and get access token
    response = requests.post(AUTH_API_LOGIN_URL, json={
        "email": TEST_USERNAME,
        "password": TEST_PASSWORD
    })

    assert response.status_code == 200, f"Login failed: {response.status_code} → {response.text}"
    token = response.json().get("access_token")
    assert token is not None, f"Access token was not returned: {response.json()}"
    
    # Set auth URL for verify_token()
    os.environ["AUTH_API_URL"] = AUTH_API_URL

    # Step 2: Send token to auth_integration
    user = verify_token(token)

    # Step 3: Assert user claims returned
    assert user["email"] == TEST_USERNAME
    assert user["role"] in ["admin", "technologist", "physician"]


@pytest.mark.integration
def test_invalid_token_raises_error():
    """
    Should raise InvalidTokenError if the token is invalid.
    """
    with pytest.raises(InvalidTokenError):
        verify_token("this.is.not.a.valid.token")


@pytest.mark.integration
def test_unreachable_auth_api(monkeypatch):
    """
    Should raise AuthServiceUnavailable if the Auth API is unreachable.
    """
    monkeypatch.setenv("AUTH_API_URL", "https://nonexistent-api.example.com")
    with pytest.raises(AuthServiceUnavailable):
        verify_token("some-token")
