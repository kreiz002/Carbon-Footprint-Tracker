from django.shortcuts import render, redirect

# Create your views here.
import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.views.decorators.http import require_POST
from .forms import RegisterForm, LoginForm
#from django.contrib.auth import Session
import pymongo

#mongo_username = urllib.parse.quote_plus('pesco014')
#mongo_password = urllib.parse.quote_plus('dUckyt1me')

#client = pymongo.MongoClient('mongodb+srv://%s:%s@carboncluster.uf3bc.mongodb.net/?retryWrites=true&w=majority&appName=CarbonCluster' % (mongo_username, mongo_password))
#client = pymongo.MongoClient('mongodb+srv://pesco014:dUckyt1me@carboncluster.uf3bc.mongodb.net/?retryWrites=true&w=majority&appName=CarbonCluster')


#db = client['carbon']

#collection = db['users']

@csrf_exempt
def register_view(request):
    client = pymongo.MongoClient('mongodb+srv://pesco014:dUckyt1me@carboncluster.uf3bc.mongodb.net/?retryWrites=true&w=majority&appName=CarbonCluster')
    db = client['carbon']
    collection = db['users']
    if request.method == "POST":
        data = json.loads(request.body)
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        user = authenticate(request, email=email, password=password)
        if (user != None):
            return JsonResponse({"details":"User already exists"})

        collection.insert_one({
        "name":name,
        "email":email,
        "password":password,
        })

        return JsonResponse({"details":"Successfully registered"})
    
    return render(request, "index.html")

#@require_POST
@csrf_exempt
def login_view(request):
    if ('user' in request.session):
            return JsonResponse({"details":"User already logged in"})
    if request.method == "POST":
        data = json.loads(request.body)

        email = data.get('email')
        password = data.get('password')

        user = authenticate(request, email=email, password=password)

        if user == None:
            return JsonResponse({"detail":"Invalid credentials"},
                                status=400)
        request.session['user'] = email
        return JsonResponse({"details":"Successfully logged in"})

    return render(request, "index.html")

def logout_view(request):
    #if not request.user.is_authenticated:
    if 'user' in request.session:
        #Session.objects.filter(session_key=request.session.session_key).delete()
        del request.session['user']
        return JsonResponse({"details":"Successfully logged out"})
    else:
        return JsonResponse({"details":"No user logged in"})
    #return redirect('/home/')

def home_view(request):
    if 'user' in request.session:
        current_user = request.session['user']
        print(current_user)
        param = {'current_user': current_user}
        return render(request, 'home.html', param)
    else:
        return redirect('/login/')
    return render(request, 'login/login.html')

def front(request):
    context = { }
    return render(request, "index.html", context)

@ensure_csrf_cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isauthenticated":False})
    return JsonResponse({"isauthenticated":True})

def whoami_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"isauthenticated":False})
    return JsonResponse({"username":request.user.username})