# import pymongo
import sys
import pymongo

connection = pymongo.MongoClient("127.0.0.1", 27017)

db = connection.iotserver

collection = db.users

docs = collection.find()

for doc in docs:
    print(doc)

# print(sys.argv[1],sys.argv[2])
print('heelo')
sys.stdout.flush()
