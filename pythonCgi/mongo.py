# import pymongo
import sys
import pymongo
import pandas

connection = pymongo.MongoClient("127.0.0.1", 27017)

db = connection.iotserver

dht = db.dhts

docs = dht.find()

for doc in docs:
    print(doc)

# print(sys.argv[1],sys.argv[2])
# sys.stdout.flush()
