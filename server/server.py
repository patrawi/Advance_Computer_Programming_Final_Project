from flask import Flask
from flask import request, redirect, url_for, render_template
from pymongo import MongoClient
from flask import jsonify
from flask_ngrok import run_with_ngrok
from flask_cors import CORS, cross_origin
import random
import urllib.request
import json
import textwrap
import urllib.request
from urllib.error import HTTPError
import string
import pandas as pd
import math

app = Flask(__name__)
all_score = []
CORS(app, support_credentials = True)
run_with_ngrok(app)


@app.route('/getdata') #for reupload data from csv to MongoDB
def data():
  
  client = MongoClient("mongodb+srv://testuser:015911346@cluster0.tbsfv.mongodb.net/<dbname>?retryWrites=true&w=majority")
  db = client.all_book
  all_book = []
  db.booklist.drop()
  file = open('bestsellers with categories.csv')
  file.readline()
  for line in file.readlines():
    data = line.strip().split(',')
    printable = set(string.printable)
    data[0] = ''.join(filter(lambda x: x in printable, data[0]))
    ret = dict()
    ret = {'name':data[0],'author':data[1],'rating':data[2],'review':data[3],'price':random.randint(8, 20),'year':data[5],'genre':data[6]}
    all_book.append(ret)
  for data in all_book:
    db.booklist.insert_one(data)
  return 'Finishing Insert Data'

@app.route('/showdata') #For showing the infinite scroll data
def show():
  num = int(request.args.get('num'))
  client = MongoClient("mongodb+srv://testuser:015911346@cluster0.tbsfv.mongodb.net/<dbname>?retryWrites=true&w=majority")
  db = client.all_book
  data = list(db.booklist.find())
  for e in data:
    e.pop('_id', None)
  ret = dict()
  ret['data'] = [data[i] for i in range(num,num+20)]
  return jsonify(ret)

@app.route('/image') #addimage for og data
def img():
    
    client = MongoClient("mongodb+srv://testuser:015911346@cluster0.tbsfv.mongodb.net/<dbname>?retryWrites=true&w=majority")
    db = client.all_book
    data = list(db.booklist.find())
    for e in data[594:]:
      
      path = e['name'].strip().split()
      path = "%".join(path)
      col = ggbook(path)
      if "imageLinks" in col['items'][0]['volumeInfo']:
        thumbnail = col['items'][0]['volumeInfo']['imageLinks']['thumbnail']
        print(thumbnail)
        db.booklist.update_one({'_id': e['_id']},{'$set': {'thumbnail': thumbnail }}) 
      else :
        thumbnail = "https://thaigifts.or.th/wp-content/uploads/2017/03/no-image.jpg"
        db.booklist.update_one({'_id': e['_id']},{'$set': {'thumbnail': thumbnail }})   
      
    return 'Finished insert imglink'

@app.route('/shownewbook')
def newshow():
  client = MongoClient("mongodb+srv://testuser:015911346@cluster0.tbsfv.mongodb.net/<dbname>?retryWrites=true&w=majority")
  db = client.all_book
  book = request.args.get('name')
  data = db.booklist.find()
  ret = dict()
  print(book)
  for e in data:
    if e['name'] == book:
      e.pop('_id')

      ret['data'] = [e]
      return jsonify(ret)
  return 'not found' 
  
@app.route('/findbook') # find list of books 
def find():
  ret = dict()
  name = request.args.get('name')
  path = name.strip().split()
  path = "%".join(path)
  ret['data'] = []
  col = ggbook(path)
  x = len(col['items'])
  info = analyze(col)
  return jsonify(info)    

@app.route('/addnewbook',methods=['GET', 'POST']) #addnewbookfrom googlebook api 
def add():
  client = MongoClient("mongodb+srv://testuser:015911346@cluster0.tbsfv.mongodb.net/<dbname>?retryWrites=true&w=majority")
  db = client.all_book
  ret = dict()
  name = (request.args.get('name'))
  
  path = name.strip().split()
  path = "%".join(path)
  col = ggbook(path)
  data = col['items'][0]['volumeInfo']
  listItem = condition(data)
  item = {'name': listItem[4], 'author': listItem[5], 'rating': listItem[2], 'price': random.randint(8,20), 'year': listItem[3], 'genre': listItem[1], 'thumbnail': listItem[0]}
  db.booklist.insert_one(item)
  data = db.booklist.find()
  for e in data:
    if e['name'] == name:
      e.pop('_id')
      ret['data'] = [e]
  return jsonify(ret)
@app.route('/graph') # sending 10 data for graph
def graph():
  client = MongoClient("mongodb+srv://testuser:015911346@cluster0.tbsfv.mongodb.net/<dbname>?retryWrites=true&w=majority")
  db = client.all_book
  data = db.booklist
  datas = db.booklist.find()
  data = pd.DataFrame((data.find()))
  data = data.filter(items = ['name', 'review'])

  data.review = pd.to_numeric(data.review)

  data = data.sort_values(by = ['review'], ascending=False)
  data = data.head(18)
  name = list()

  review = list()
  names = dict()
  reviews = dict()
  for e in data.name:
    if e not in name:
      name.append(e)
  print(name)
  names = {'name1': name[0], 'name2': name[1], 'name3': name[2], 'name4': name[3], 'name5': name[4], 'name6': name[5], 'name7': name[6], 'name8': name[7], 'name9': name[8], 'name10': name[9]}
  for e in data.review:
    if e not in review: 
      review.append(e)
  print(review)
  reviews = {'review1': review[0],'review2': review[1],'review3': review[2],'review4': review[3],'review5': review[4],'review6': review[5],'review7': review[6],'review8': review[7],'review9': review[8],'review10': review[9],}
  print(name)
  print(review)
  
  ret = dict()
  ret['data'] = [names,reviews]
  return jsonify(ret)

@app.route('/addbookbyuser') #add by user because there is not a book that user want
def adduser():
  name = request.args.get('name')
  author = request.args.get('author')
  rating = request.args.get('rating')
  genre = request.args.get('genre')
  review = request.args.get('review')
  price = request.args.get('price')
  year = request.args.get('year')
  thumbnail = request.args.get('thumbnail')

  client = MongoClient("mongodb+srv://testuser:015911346@cluster0.tbsfv.mongodb.net/<dbname>?retryWrites=true&w=majority")
  db = client.all_book
  ret = dict()
  item = {'name': name, 'author': author, 'rating': rating,'price': price,'year': year,'genre': genre,'thumbnail': thumbnail,'review': review}
  db.booklist.insert_one(item)
  data = db.booklist.find()
  for e in data:
    if e['name'] == name:
      e.pop('_id')
      ret['data'] = [e]
  return jsonify(ret)
@app.route('/')  #Homepage
def home():
  return 'Welcome to The Server'

#Function

def ggbook(path):
  base_api_link = 'https://www.googleapis.com/books/v1/volumes?q='
  with urllib.request.urlopen(base_api_link + path) as f: 
    text = f.read().decode("utf-8")
  col = json.loads(text)
  return col

def analyze(col):
  x = len(col['items'])
  item = dict()
  ret = dict()
  ret['data'] = []
  for i in range(0,x):
    data = col['items'][i]['volumeInfo']
    listItem = condition(data)
    item = {'name' : listItem[4], 'author': listItem[5], 'rating': listItem[2], 'price': random.randint(8,20), 'year': listItem[3], 'genre': listItem[1], 'thumbnail': listItem[0]}
    ret['data'].append(item)
  return ret

def condition(data):
  if "imageLinks" in data:
    thumbnail = data['imageLinks']['thumbnail'] 
  else:
    thumbnails = "https://thaigifts.or.th/wp-content/uploads/2017/03/no-image.jpg"
    thumbnail = thumbnails
  if "categories" in data:
    genre = data['categories'][0]
  else :
    genre = "-"
  if "averageRating" in data:
    rating = data['averageRating']
  else:
    rating = "-"
  if "publishedDate" in data:
    year = data['publishedDate']
  else:
    year = "-"
  if "authors" in data:
    author = data['authors'][0]
  else:
    author = "-"
  if "review" in data:
    review = data['ratingsCount']
  else :
    review = "-"
  name = data['title']
    
  listData = [thumbnail, genre, rating, year,name,author,review]
  return listData

app.run()
