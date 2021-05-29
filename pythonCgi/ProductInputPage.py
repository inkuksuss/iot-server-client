import pymongo
import pandas as pd
import json
import copy
import sys
import numpy as np
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from bson.json_util import dumps
from dateutil.relativedelta import relativedelta

connection = pymongo.MongoClient("127.0.0.1", 27017)
db = connection.iotserver
dht = db.dhts
pms = db.pms
user = db.users

# 현재 시간
current_date = datetime.now()

# 데이터 수신
product_id = sys.argv[1]
bson_id = ObjectId(product_id)

date = sys.argv[2]
endDate = sys.argv[3]

dateFormatter = "%Y-%m-%d"
convert_date = datetime.strptime(date, dateFormatter) + timedelta(days=1)
convert_endDate = datetime.strptime(endDate, dateFormatter) + timedelta(days=1)


# 데이터 처리
df_dht = list(
    dht.find({'product': bson_id, 'measuredAt': {'$gte': convert_date, '$lt': convert_endDate}}))
df_pms = list(
    pms.find({'product': bson_id, 'measuredAt': {'$gte': convert_date, '$lt': convert_endDate}}))

new_array = []

# 실제
# for dht in df_dht:
#     for pms in df_pms:
#         if dht['measuredAt'] == pms['measuredAt']:
#             dht['dust'] = pms['dust']
#             new_array.append(dht)

# json_new_Array = dumps(new_array)
# print(json_new_Array)

for dht in df_dht:
    dht['dust'] = 15

json_new_Array = dumps(df_dht)
print(json_new_Array)
