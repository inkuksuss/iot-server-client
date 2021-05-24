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
user_id = sys.argv[1]
bson_id = ObjectId(user_id)
# ObjectId("60a0f9a37c65f50eedcec527")

# 데이터 처리
user_datas = user.find_one({"_id": bson_id})
user_keyList = user_datas['keyList']  # 유저 제품 리스트


key_container = []
tmp_week_container = []
hum_week_container = []
dust_week_container = []

for user_key in user_keyList:  # 유저 제품별 데이터 배열화
    bson_key_id = ObjectId(user_key)

    # DB 데이터 추출
    df_dht_week = pd.DataFrame(
        list(dht.find({
            "product": bson_key_id, "measuredAt": {"$gte": current_date - timedelta(weeks=1)}}, {
            "_id": 0, "tmp": 1, "hum": 1, "measuredAt": 1, "key": 1
        }
        ).sort("measuredAt", pymongo.DESCENDING))
    )
    if not df_dht_week.empty:
        key_container.append(df_dht_week['key'].values[0])
        tmp_week_container.append(df_dht_week['tmp'].mean().round(1))
        hum_week_container.append(df_dht_week['hum'].mean().round(1))

    df_pms_week = pd.DataFrame(
        list(pms.find({
            "product": bson_key_id, "measuredAt": {"$gte": current_date - timedelta(weeks=1)}}, {
                "_id": 0, "dust": 1, "measuredAt": 1, "key": 1
        }
        ).sort("measuredAt", pymongo.DESCENDING))
    )
    if not df_pms_week.empty:
        dust_week_container.append(df_pms_week['dust'].mean().round(1))

key_length = len(key_container)

data_container = []

string_form = ["tmp", "hum"]

for tmp, hum in zip(tmp_week_container, hum_week_container):
    i = 0
    data = []
    data.append(tmp)
    data.append(hum)
    data.append(dust_week_container[i])
    data_container.append(data)
    i = i + 1

json_data = dumps(data_container)
print(json_data)
