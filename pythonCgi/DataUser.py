# import pymongo
import pymongo
import pandas
import json
import sys
from bson.objectid import ObjectId
from bson.json_util import dumps

connection = pymongo.MongoClient("127.0.0.1", 27017)
db = connection.iotserver
dht = db.dhts

# 데이터 수신
user_id = sys.argv[1]
bson_id = ObjectId(user_id)

# 데이터 전송
dht_datas = list(dht.find({"controller": bson_id}))
json_data = dumps(dht_datas)
print(json_data)

sys.stdout.flush()
