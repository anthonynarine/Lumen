from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("billing/", include("billing.urls")),

    # 🧾 Raw OpenAPI JSON schema
    path("schema/", SpectacularAPIView.as_view(), name="schema"),

    # 🖥️ Swagger UI (secured, interactive)
    path("docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
