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

def register_view(request):
    client = pymongo.MongoClient('mongodb+srv://pesco014:dUckyt1me@carboncluster.uf3bc.mongodb.net/?retryWrites=true&w=majority&appName=CarbonCluster')
    db = client['carbon']
    collection = db['users']
    #data = json.loads(request.body)
    #username = data.get("username")
    #password = data.get("password")
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password2"]

            collection.insert_one({
            "email":email,
            "password":password,
            })

            return redirect('/login/')
    else: 
        form = RegisterForm()
    
    return render(request, "register/register.html", {"form":form})


    #if username is None  or password is None:
    #    return JsonResponse({"detail":"Please provide username and password"})
    
    #return JsonResponse({"detail":"User created"})

#@require_POST
@csrf_exempt
def login_view(request):
    #data = json.loads(request.body)
    #username = data.get("username")
    #password = data.get("password")

    if request.method == "POST":
        form = LoginForm(data=request.POST)

        #email = form.data["username"]
        #password = form.data["password"]
        data = json.loads(request.body)
        print(data.get('email'))

        email = data.get('email')
        password = data.get('password')

        user = authenticate(request, email=email, password=password)

        if user == None:
            return JsonResponse({"detail":"Invalid credentials"},
                                status=400)
        request.session['user'] = email
        #return redirect('/')
        return JsonResponse({"details":"Successfully logged in"})
        #return redirect("/")
    else:
        form = LoginForm()
        #return JsonResponse({"details":"not a POST"})
    #return JsonResponse({"details":"Successfully logged in"})

    #return render(request, "login/login.html", {"form":form})
    return render(request, "index.html", {"form":form})

def logout_view(request):
    #if not request.user.is_authenticated:
    if 'user' in request.session:
        #Session.objects.filter(session_key=request.session.session_key).delete()
        del request.session['user']
    return redirect('/home/')

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