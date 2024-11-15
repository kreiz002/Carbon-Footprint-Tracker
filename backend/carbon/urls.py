from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.login_view, name="carbon_login"),
    path("api/auth/logout/", views.logout_view, name="carbon_logout"),
    path("session/", views.session_view, name="carbon_session"),
    path("whoami/", views.whoami_view, name="carbon_whoami"),
    path("api/auth/register/", views.register_view, name="carbin_register"),
    path("home/", views.home_view, name='carbon_home'),
    path("", views.front, name="carbon_front"),
]