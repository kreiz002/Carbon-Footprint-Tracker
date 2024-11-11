from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import User

#from pymongo import MongoClient
import pymongo

class MongoDBBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None):
        client = pymongo.MongoClient('mongodb+srv://pesco014:dUckyt1me@carboncluster.uf3bc.mongodb.net/?retryWrites=true&w=majority&appName=CarbonCluster')
        db = client['carbon']
        collection = db['users']

        user = collection.find_one({"email":email})
        user = User(email=email, password=password)
        #user['backend'] = 'carbon.mongodb_backend.MongoDBBackend'
        if user and user.password == password:
            return user
        return None
    
    def get_user(self, user_id):
        client = pymongo.MongoClient('mongodb+srv://pesco014:dUckyt1me@carboncluster.uf3bc.mongodb.net/?retryWrites=true&w=majority&appName=CarbonCluster')
        db = client['carbon']
        collection = db['users']

        user = collection.find_one({'_id': user_id})
        if user:
            return user
        return None