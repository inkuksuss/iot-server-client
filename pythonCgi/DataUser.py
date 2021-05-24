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
# user_id = sys.argv[1]
bson_id = ObjectId("60a0f9a37c65f50eedcec527")

# ObjectId(user_id)

# 데이터 처리
user_datas = user.find_one({"_id": bson_id})
user_keyList = user_datas['keyList']  # 유저 제품 리스트)

tmp_all_mean_array = []
hum_all_mean_array = []
tmp_all_min_array = []
hum_all_min_array = []
tmp_all_max_array = []
hum_all_max_array = []
dht_all_key_array = []

tmp_week_mean_array = []
hum_week_mean_array = []
tmp_week_min_array = []
hum_week_min_array = []
tmp_week_max_array = []
hum_week_max_array = []
dht_week_key_array = []

tmp_month_mean_array = []
hum_month_mean_array = []
tmp_month_min_array = []
hum_month_min_array = []
tmp_month_max_array = []
hum_month_max_array = []
dht_month_key_array = []

dust_all_mean_array = []
dust_all_min_array = []
dust_all_max_array = []
pms_all_key_array = []

dust_week_mean_array = []
dust_week_min_array = []
dust_week_max_array = []
pms_week_key_array = []

dust_month_mean_array = []
dust_month_min_array = []
dust_month_max_array = []
pms_month_key_array = []

for user_key in user_keyList:  # 유저 제품별 데이터 배열화
    bson_key_id = ObjectId(user_key)

    # DB 데이터 추출
    df_dht_all = pd.DataFrame(
        list(dht.find({
            "product": bson_key_id}, {
                "_id": 0, "tmp": 1, "hum": 1, "measuredAt": 1, "key": 1
        }
        ).sort("measuredAt", pymongo.DESCENDING))
    )
    if not df_dht_all.empty:
        mean_df_tmp_all = df_dht_all['tmp'].mean().round(1)
        mean_df_hum_all = df_dht_all['hum'].mean().round(1)
        min_df_tmp_all = df_dht_all['tmp'].min().round(1)
        min_df_hum_all = df_dht_all['hum'].min().round(1)
        max_df_tmp_all = df_dht_all['tmp'].max().round(1)
        max_df_hum_all = df_dht_all['hum'].max().round(1)
        tmp_all_mean_array.append(mean_df_tmp_all)
        hum_all_mean_array.append(mean_df_hum_all)
        tmp_all_min_array.append(min_df_tmp_all)
        hum_all_min_array.append(min_df_hum_all)
        tmp_all_max_array.append(max_df_tmp_all)
        hum_all_max_array.append(max_df_hum_all)
        dht_all_key_array.append(df_dht_all['key'].values[0])

    df_dht_week = pd.DataFrame(
        list(dht.find({
            "product": bson_key_id, "measuredAt": {"$gte": current_date - timedelta(weeks=1)}}, {
                "_id": 0, "tmp": 1, "hum": 1, "measuredAt": 1, "key": 1
        }
        ).sort("measuredAt", pymongo.DESCENDING))
    )
    if not df_dht_week.empty:
        mean_df_tmp_week = df_dht_week['tmp'].mean().round(1)
        mean_df_hum_week = df_dht_week['hum'].mean().round(1)
        min_df_tmp_week = df_dht_week['tmp'].min().round(1)
        min_df_hum_week = df_dht_week['hum'].min().round(1)
        max_df_tmp_week = df_dht_week['tmp'].max().round(1)
        max_df_hum_week = df_dht_week['hum'].max().round(1)
        tmp_week_mean_array.append(mean_df_tmp_week)
        hum_week_mean_array.append(mean_df_hum_week)
        tmp_week_min_array.append(min_df_tmp_week)
        hum_week_min_array.append(min_df_hum_week)
        tmp_week_max_array.append(max_df_tmp_week)
        hum_week_max_array.append(max_df_hum_week)
        dht_week_key_array.append(df_dht_week['key'].values[0])

        print(tmp_week_max_array)

    df_dht_month = pd.DataFrame(
        list(dht.find({
            "product": bson_key_id, "measuredAt": {"$gte": current_date - relativedelta(months=1)}}, {
                "_id": 0, "tmp": 1, "hum": 1, "measuredAt": 1, "key": 1
        }
        ).sort("measuredAt", pymongo.DESCENDING))
    )
    if not df_dht_month.empty:
        mean_df_tmp_month = df_dht_month['tmp'].mean().round(1)
        mean_df_hum_month = df_dht_month['hum'].mean().round(1)
        min_df_tmp_month = df_dht_month['tmp'].min().round(1)
        min_df_hum_month = df_dht_month['hum'].min().round(1)
        max_df_tmp_month = df_dht_month['tmp'].max().round(1)
        max_df_hum_month = df_dht_month['hum'].max().round(1)
        tmp_month_mean_array.append(mean_df_tmp_month)
        hum_month_mean_array.append(mean_df_hum_month)
        tmp_month_min_array.append(min_df_tmp_month)
        hum_month_min_array.append(min_df_hum_month)
        tmp_month_max_array.append(max_df_tmp_month)
        hum_month_max_array.append(max_df_hum_month)
        dht_month_key_array.append(df_dht_month['key'].values[0])

    df_pms_all = pd.DataFrame(
        list(pms.find({
            "product": bson_key_id}, {
                "_id": 0, "dust": 1, "measuredAt": 1, "key": 1
        }
        ).sort("measuredAt", pymongo.DESCENDING))
    )
    if not df_pms_all.empty:
        mean_df_dust_all = df_pms_all['dust'].mean().round(1)
        min_df_dust_all = df_pms_all['dust'].min().round(1)
        max_df_dust_all = df_pms_all['dust'].max().round(1)
        dust_all_mean_array.append(mean_df_dust_all)
        dust_all_min_array.append(min_df_dust_all)
        dust_all_max_array.append(max_df_dust_all)
        pms_all_key_array.append(df_pms_all['key'].values[0])

    df_pms_week = pd.DataFrame(
        list(pms.find({
            "product": bson_key_id, "measuredAt": {"$gte": current_date - timedelta(weeks=1)}}, {
                "_id": 0, "dust": 1, "measuredAt": 1, "key": 1
        }
        ).sort("measuredAt", pymongo.DESCENDING))
    )
    if not df_pms_week.empty:
        mean_df_dust_week = df_pms_week['dust'].mean().round(1)
        min_df_dust_week = df_pms_week['dust'].min().round(1)
        max_df_dust_week = df_pms_week['dust'].max().round(1)
        dust_week_mean_array.append(mean_df_dust_week)
        dust_week_min_array.append(min_df_dust_week)
        dust_week_max_array.append(max_df_dust_week)
        pms_week_key_array.append(df_pms_week['key'].values[0])

    df_pms_month = pd.DataFrame(
        list(pms.find({
            "product": bson_key_id, "measuredAt": {"$gte": current_date - relativedelta(months=1)}}, {
                "_id": 0, "dust": 1, "measuredAt": 1, "key": 1
        }
        ).sort("measuredAt", pymongo.DESCENDING))
    )
    if not df_pms_month.empty:
        mean_df_dust_month = df_pms_month['dust'].mean().round(1)
        min_df_dust_month = df_pms_month['dust'].min().round(1)
        max_df_dust_month = df_pms_month['dust'].max().round(1)
        dust_month_mean_array.append(mean_df_dust_month)
        dust_month_min_array.append(min_df_dust_month)
        dust_month_max_array.append(max_df_dust_month)
        pms_month_key_array.append(df_pms_month['key'].values[0])

    print(df_dht_all)
    print(df_dht_week)


df_tmp_all = pd.DataFrame([
    tmp_all_mean_array,
    tmp_all_max_array,
    tmp_all_min_array
],
    columns=dht_all_key_array
)

df_tmp_week = pd.DataFrame([
    tmp_week_mean_array,
    tmp_week_max_array,
    tmp_week_min_array
],
    columns=dht_week_key_array
)

df_tmp_month = pd.DataFrame([
    tmp_month_mean_array,
    tmp_month_max_array,
    tmp_month_min_array
],
    columns=dht_month_key_array
)

df_hum_all = pd.DataFrame([
    hum_all_mean_array,
    hum_all_max_array,
    hum_all_min_array
],
    columns=dht_all_key_array
)

df_hum_week = pd.DataFrame([
    hum_week_mean_array,
    hum_week_max_array,
    hum_week_min_array
],
    columns=dht_week_key_array
)

df_hum_month = pd.DataFrame([
    hum_month_mean_array,
    hum_month_max_array,
    hum_month_min_array
],
    columns=dht_month_key_array
)

df_dust_all = pd.DataFrame([
    dust_all_mean_array,
    dust_all_max_array,
    dust_all_min_array
],
    columns=pms_all_key_array
)

df_dust_week = pd.DataFrame([
    dust_week_mean_array,
    dust_week_max_array,
    dust_week_min_array
],
    columns=pms_week_key_array
)

df_dust_month = pd.DataFrame([
    dust_month_mean_array,
    dust_month_max_array,
    dust_month_min_array
],
    columns=pms_month_key_array
)

df_tmp_all_object = df_tmp_all.to_dict()
df_tmp_week_object = df_tmp_week.to_dict()
df_tmp_month_object = df_tmp_month.to_dict()
df_hum_all_object = df_hum_all.to_dict()
df_hum_week_object = df_hum_week.to_dict()
df_hum_month_object = df_hum_month.to_dict()
df_dust_all_object = df_dust_all.to_dict()
df_dust_week_object = df_dust_week.to_dict()
df_dust_month_object = df_dust_month.to_dict()

df_data_all_array = [df_tmp_all_object, df_hum_all_object, df_dust_all_object]
df_data_week_array = [df_tmp_week_object,
                      df_hum_week_object, df_dust_week_object]
df_data_month_array = [df_tmp_month_object,
                       df_hum_month_object, df_dust_month_object]


# print(df_data_all_array)
# print(df_data_week_array)
# print(df_data_month_array)

json_df_data_all = dumps(df_data_all_array)
json_df_data_week = dumps(df_data_week_array)
json_df_data_month = dumps(df_data_month_array)


print(json_df_data_all)
print(json_df_data_week)
print(json_df_data_month)

sys.stdout.flush()
