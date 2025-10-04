# reports/tests/conftest.py
import pytest

@pytest.fixture(autouse=True)
def mock_external_auth(monkeypatch):
    """
    Automatically bypass ExternalJWTAuthentication for all tests.
    Simulates a logged-in technologist.
    """
    from auth_integration.authentication import ExternalJWTAuthentication  # adjust if path differs

    def fake_authenticate(self, request):
        class FakeUser:
            def __init__(self):
                self.username = "test_user"
                self.role = "technologist"
                self.is_authenticated = True
        return (FakeUser(), None)

    # Replace the real authenticate method
    monkeypatch.setattr(ExternalJWTAuthentication, "authenticate", fake_authenticate)
