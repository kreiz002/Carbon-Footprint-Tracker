from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.login_view, name="carbon_login"),
    path("logout/", views.logout_view, name="carbon_logout"),
    path("session/", views.session_view, name="carbon_session"),
    path("whoami/", views.whoami_view, name="carbon_whoami"),
    path("register/", views.register_view, name="carbin_register"),
    path("home/", views.home_view, name='carbon_home'),
    path("", views.front, name="carbon_front"),
    path("api/submit-data/", views.dashboard_view, name="carbon_footprint"),
]