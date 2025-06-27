from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # 🛠️ Admin and billing
    path("admin/", admin.site.urls),
    path("billing/", include("billing.urls")),

    # 📊 Carotid API endpoints (modular)
    path("api/", include("reports.urls.carotid_urls")),

    # 🧾 OpenAPI schema + Swagger
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
