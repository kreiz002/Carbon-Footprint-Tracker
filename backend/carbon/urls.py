from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.login_view, name="carbon_login"),
    path("logout/", views.logout_view, name="carbon_logout"),
    path("session/", views.session_view, name="carbon_session"),
    path("whoami/", views.whoami_view, name="carbon_whoami"),
]