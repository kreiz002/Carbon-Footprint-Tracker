from django.shortcuts import render, redirect

# Create your views here.
import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from .forms import RegisterForm

import pymongo
import urllib.parse

#mongo_username = urllib.parse.quote_plus('pesco014')
#mongo_password = urllib.parse.quote_plus('dUckyt1me')

#client = pymongo.MongoClient('mongodb+srv://%s:%s@carboncluster.uf3bc.mongodb.net/?retryWrites=true&w=majority&appName=CarbonCluster' % (mongo_username, mongo_password))
client = pymongo.MongoClient('mongodb+srv://pesco014:dUckyt1me@carboncluster.uf3bc.mongodb.net/?retryWrites=true&w=majority&appName=CarbonCluster')


db = client['carbon']

collection = db['users']

def register_view(request):
    #data = json.loads(request.body)
    #username = data.get("username")
    #password = data.get("password")
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password2"]

            collection.insert_one({
                "username":username,
                "password":password,
            })

            return redirect('login/')
    else: 
        form = RegisterForm()
    
    return render(request, "register/register.html", {"form":form})


    #if username is None  or password is None:
    #    return JsonResponse({"detail":"Please provide username and password"})
    
    #return JsonResponse({"detail":"User created"})

@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")

    if username is None or password is None:
        return JsonResponse({"detail":"Please provide username and password"})
    #user = authenticate(username=username,password=password)
    if not collection.auth(username, password):
        return JsonResponse({"detail":"Invalid credentials"},
                            status=400)
    #if user is None:
    #    return JsonResponse({"detail":"Invalid credentials"},
    #                        status=400)
    user = collection.getUser(username)
    login(request, user)
    return JsonResponse({"details":"Successfully logged in"})

def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"detail":"You are not logged in!"},
                            status=400)
    logout(request)
    return JsonResponse({"detail":"Successfully logged out"})

@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isauthenticated":False})
    return JsonResponse({"isauthenticated":True})

def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isauthenticated":False})
    return JsonResponse({"username":request.user.username})