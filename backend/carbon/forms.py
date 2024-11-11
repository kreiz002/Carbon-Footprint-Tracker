from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User

class RegisterForm(UserCreationForm):
    class Meta:
        model = User
        fields = ["username", "password1", "password2"]

class LoginForm(AuthenticationForm):
    class Meta:
        model = User
        fields = ["username", "password"]