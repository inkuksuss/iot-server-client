import pymongo
import pandas as pd
import json
import copy
import sys
import numpy as np
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from bson.json_util import dumps
from bson import json_util
from dateutil.relativedelta import relativedelta

# 몽고 config
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

# 변수 지정
date = sys.argv[2]
endDate = sys.argv[3]
avgCheck = sys.argv[4]
minCheck = sys.argv[5]
maxCheck = sys.argv[6]
btnResult = sys.argv[7]


# 시간 변환
dateFormatter = "%Y-%m-%d"
convert_date = datetime.strptime(date, dateFormatter)
convert_endDate = datetime.strptime(endDate, dateFormatter)
period = convert_endDate - convert_date
int_period = int(period.days)

# 데이터 처리
df_dht = list(
    dht.find({'product': bson_id, 'measuredAt': {'$gte': convert_date, '$lte': convert_endDate}}).sort("measuredAt", pymongo.DESCENDING))
df_pms = list(
    pms.find({'product': bson_id, 'measuredAt': {'$gte': convert_date, '$lte': convert_endDate}}).sort("measuredAt", pymongo.DESCENDING))

df_dht_date = list(
    dht.find({'product': bson_id, 'measuredAt': {'$gte': convert_date, '$lte': convert_endDate}},
             {'_id': 0, 'sensor': 0, 'controller': 0, 'key': 0, 'product': 0, '__v': 0, 'tmp': 0, 'hum': 0}))

dic_by_date = {}

if len(df_dht) != 0 and len(df_pms) != 0:

    # DataFrame 초기화
    pd_df_dht = pd.DataFrame(df_dht)
    pd_df_pms = pd.DataFrame(df_pms)
    pd_df_dht.drop('_id', axis=1, inplace=True)
    pd_df_dht.drop('sensor', axis=1, inplace=True)
    pd_df_dht.drop('controller', axis=1, inplace=True)
    pd_df_dht.drop('product', axis=1, inplace=True)
    pd_df_dht.drop('__v', axis=1, inplace=True)
    pd_df_dht.drop('key', axis=1, inplace=True)
    pd_df_pms.drop('_id', axis=1, inplace=True)
    pd_df_pms.drop('sensor', axis=1, inplace=True)
    pd_df_pms.drop('controller', axis=1, inplace=True)
    pd_df_pms.drop('product', axis=1, inplace=True)
    pd_df_pms.drop('__v', axis=1, inplace=True)
    pd_df_pms.drop('key', axis=1, inplace=True)

    # DataFrame 그루핑 및 연산
    if int_period <= 7:
        dht_mean_days = pd_df_dht.groupby(
            pd_df_dht.set_index('measuredAt').index.date).mean()
        dht_min_days = pd_df_dht.groupby(
            pd_df_dht.set_index('measuredAt').index.date).min()
        dht_max_days = pd_df_dht.groupby(
            pd_df_dht.set_index('measuredAt').index.date).max()
        pms_mean_days = pd_df_pms.groupby(
            pd_df_pms.set_index('measuredAt').index.date).mean()
        pms_min_days = pd_df_pms.groupby(
            pd_df_pms.set_index('measuredAt').index.date).min()
        pms_max_days = pd_df_pms.groupby(
            pd_df_pms.set_index('measuredAt').index.date).max()

        date_array = pd.date_range(start=convert_date,
                                   end=convert_endDate).tolist()
        dates_array = []
        for dates in date_array:
            if dates.date() not in dht_mean_days.index:
                date_arrays.append(dates)

        for dates in dates_array:
            dht_mean_days.loc[date.date()] = 0
            dht_min_days.loc[date.date()] = 0
            dht_max_days.loc[date.date()] = 0
            pms_mean_days.loc[date.date()] = 0
            pms_min_days.loc[date.date()] = 0
            pms_max_days.loc[date.date()] = 0

        sort_dht_mean_days = dht_mean_days.sort_index()
        sort_dht_min_days = dht_min_days.sort_index()
        sort_dht_max_days = dht_max_days.sort_index()
        sort_pms_mean_days = pms_mean_days.sort_index()
        sort_pms_min_days = pms_min_days.sort_index()
        sort_pms_max_days = pms_max_days.sort_index()

        dic_by_date = {
            'mean': {
                'tmp': sort_dht_mean_days['tmp'].tolist(),
                'hum': sort_dht_mean_days['hum'].tolist(),
                'dust': sort_pms_mean_days['dust'].tolist()
            },
            'min': {
                'tmp': sort_dht_min_days['tmp'].tolist(),
                'hum': sort_dht_min_days['hum'].tolist(),
                'dust': sort_pms_min_days['dust'].tolist()
            },
            'max': {
                'tmp': sort_dht_max_days['tmp'].tolist(),
                'hum': sort_dht_max_days['hum'].tolist(),
                'dust': sort_pms_max_days['dust'].tolist()
            }
        }

        date_container = []
        for sort_date in sort_dht_mean_days.index.tolist():
            string_date = sort_date.strftime('%Y-%m-%d')
            date_container.append(string_date)

        print(dumps(date_container))  # 날짜 목록

    elif 7 < int_period <= 29:

        dht_mean_days = pd_df_dht.resample('3D', on='measuredAt')[
            'tmp', 'hum'].mean()
        dht_min_days = pd_df_dht.resample('3D', on='measuredAt')[
            'tmp', 'hum'].min()
        dht_max_days = pd_df_dht.resample('3D', on='measuredAt')[
            'tmp', 'hum'].max()
        pms_mean_days = pd_df_pms.resample(
            '3D', on='measuredAt')['dust'].mean()
        pms_min_days = pd_df_pms.resample(
            '3D', on='measuredAt')['dust'].min()
        pms_max_days = pd_df_pms.resample(
            '3D', on='measuredAt')['dust'].max()

        date_array = pd.date_range(start=convert_date + timedelta(days=1),
                                   end=convert_endDate, freq="3d").tolist()

        dates_array = []
        for dates in date_array:
            if dates.date() not in dht_mean_days.index:
                date_arrays.append(dates)

        for dates in dates_array:
            dht_mean_days.loc[date.date()] = 0
            dht_min_days.loc[date.date()] = 0
            dht_max_days.loc[date.date()] = 0
            pms_mean_days.loc[date.date()] = 0
            pms_min_days.loc[date.date()] = 0
            pms_max_days.loc[date.date()] = 0

        sort_dht_mean_days = dht_mean_days.sort_index()
        sort_dht_min_days = dht_min_days.sort_index()
        sort_dht_max_days = dht_max_days.sort_index()
        sort_pms_mean_days = pms_mean_days.sort_index()
        sort_pms_min_days = pms_min_days.sort_index()
        sort_pms_max_days = pms_max_days.sort_index()

        dic_by_date = {
            'mean': {
                'tmp': sort_dht_mean_days['tmp'].tolist(),
                'hum': sort_dht_mean_days['hum'].tolist(),
                'dust': sort_pms_mean_days.tolist()
            },
            'min': {
                'tmp': sort_dht_min_days['tmp'].tolist(),
                'hum': sort_dht_min_days['hum'].tolist(),
                'dust': sort_pms_min_days.tolist()
            },
            'max': {
                'tmp': sort_dht_max_days['tmp'].tolist(),
                'hum': sort_dht_max_days['hum'].tolist(),
                'dust': sort_pms_max_days.tolist()
            }
        }

        date_container = []
        for sort_date in sort_dht_mean_days.index.tolist():
            string_date = sort_date.strftime('%Y-%m-%d')
            date_container.append(string_date)

        print(dumps(date_container))  # 날짜 목록

    elif 29 < int_period <= 93:
        dht_mean_days = pd_df_dht.resample('W-Mon', on='measuredAt')[
            'tmp', 'hum'].mean()
        dht_min_days = pd_df_dht.resample('W-Mon', on='measuredAt')[
            'tmp', 'hum'].min()
        dht_max_days = pd_df_dht.resample('W-Mon', on='measuredAt')[
            'tmp', 'hum'].max()
        pms_mean_days = pd_df_pms.resample(
            'W-Mon', on='measuredAt')['dust'].mean()
        pms_min_days = pd_df_pms.resample(
            'W-Mon', on='measuredAt')['dust'].min()
        pms_max_days = pd_df_pms.resample(
            'W-Mon', on='measuredAt')['dust'].max()

        date_array = pd.date_range(start=convert_date,
                                   end=convert_endDate, freq="W-Mon").tolist()

        dates_array = []
        for dates in date_array:
            if dates.date() not in dht_mean_days.index:
                date_arrays.append(dates)

        for dates in dates_array:
            dht_mean_days.loc[date.date()] = 0
            dht_min_days.loc[date.date()] = 0
            dht_max_days.loc[date.date()] = 0
            pms_mean_days.loc[date.date()] = 0
            pms_min_days.loc[date.date()] = 0
            pms_max_days.loc[date.date()] = 0

        sort_dht_mean_days = dht_mean_days.sort_index()
        sort_dht_min_days = dht_min_days.sort_index()
        sort_dht_max_days = dht_max_days.sort_index()
        sort_pms_mean_days = pms_mean_days.sort_index()
        sort_pms_min_days = pms_min_days.sort_index()
        sort_pms_max_days = pms_max_days.sort_index()

        dic_by_date = {
            'mean': {
                'tmp': sort_dht_mean_days['tmp'].tolist(),
                'hum': sort_dht_mean_days['hum'].tolist(),
                'dust': sort_pms_mean_days.tolist()
            },
            'min': {
                'tmp': sort_dht_min_days['tmp'].tolist(),
                'hum': sort_dht_min_days['hum'].tolist(),
                'dust': sort_pms_min_days.tolist()
            },
            'max': {
                'tmp': sort_dht_max_days['tmp'].tolist(),
                'hum': sort_dht_max_days['hum'].tolist(),
                'dust': sort_pms_max_days.tolist()
            }
        }

        date_container = []
        for sort_date in sort_dht_mean_days.index.tolist():
            string_date = sort_date.strftime('%Y-%m-%d')
            date_container.append(string_date)

        print(dumps(date_container))  # 날짜 목록

    else:
        dht_mean_days = pd_df_dht.groupby(
            pd_df_dht.set_index('measuredAt').index.month).mean()
        dht_min_days = pd_df_dht.groupby(
            pd_df_dht.set_index('measuredAt').index.month).min()
        dht_max_days = pd_df_dht.groupby(
            pd_df_dht.set_index('measuredAt').index.month).max()
        pms_mean_days = pd_df_pms.groupby(
            pd_df_pms.set_index('measuredAt').index.month).mean()
        pms_min_days = pd_df_pms.groupby(
            pd_df_pms.set_index('measuredAt').index.month).min()
        pms_max_days = pd_df_pms.groupby(
            pd_df_pms.set_index('measuredAt').index.month).max()

        dht_mean_days = pd_df_dht.resample('MS', on='measuredAt')[
            'tmp', 'hum'].mean()
        dht_min_days = pd_df_dht.resample('MS', on='measuredAt')[
            'tmp', 'hum'].min()
        dht_max_days = pd_df_dht.resample('MS', on='measuredAt')[
            'tmp', 'hum'].max()
        pms_mean_days = pd_df_pms.resample(
            'MS', on='measuredAt')['dust'].mean()
        pms_min_days = pd_df_pms.resample(
            'MS', on='measuredAt')['dust'].min()
        pms_max_days = pd_df_pms.resample(
            'MS', on='measuredAt')['dust'].max()

        date_array = pd.date_range(start=convert_date,
                                   end=convert_endDate, freq="MS").tolist()

        dates_array = []
        for dates in date_array:
            if dates.date() not in dht_mean_days.index:
                date_arrays.append(dates)

        for dates in dates_array:
            dht_mean_days.loc[date.date()] = 0
            dht_min_days.loc[date.date()] = 0
            dht_max_days.loc[date.date()] = 0
            pms_mean_days.loc[date.date()] = 0
            pms_min_days.loc[date.date()] = 0
            pms_max_days.loc[date.date()] = 0

        sort_dht_mean_days = dht_mean_days.sort_index()
        sort_dht_min_days = dht_min_days.sort_index()
        sort_dht_max_days = dht_max_days.sort_index()
        sort_pms_mean_days = pms_mean_days.sort_index()
        sort_pms_min_days = pms_min_days.sort_index()
        sort_pms_max_days = pms_max_days.sort_index()

        dic_by_date = {
            'mean': {
                'tmp': sort_dht_mean_days['tmp'].tolist(),
                'hum': sort_dht_mean_days['hum'].tolist(),
                'dust': sort_pms_mean_days.tolist()
            },
            'min': {
                'tmp': sort_dht_min_days['tmp'].tolist(),
                'hum': sort_dht_min_days['hum'].tolist(),
                'dust': sort_pms_min_days.tolist()
            },
            'max': {
                'tmp': sort_dht_max_days['tmp'].tolist(),
                'hum': sort_dht_max_days['hum'].tolist(),
                'dust': sort_pms_max_days.tolist()
            }
        }

        date_container = []
        for sort_date in sort_dht_mean_days.index.tolist():
            string_date = sort_date.strftime('%Y-%m-%d')
            date_container.append(string_date)

        print(dumps(date_container))  # 날짜 목록

    json_by_date = dumps(dic_by_date)
    print(json_by_date)  # 종류별 평균, 최대, 최소 정렬

    new_array = []

    for dht in df_dht:
        dht['dust'] = 15

    json_new_Array = dumps(df_dht)
    print(json_new_Array)  # 기간 전체 데이터


#     # 실제
#     # for dht in df_dht:
#     #     for pms in df_pms:
#     #         if dht['measuredAt'] == pms['measuredAt']:
#     #             dht['dust'] = pms['dust']
#     #             new_array.append(dht)

#     # json_new_Array = dumps(new_array)
#     # print(json_new_Array)

#     # //////////////////////


else:
    print(dumps([]))  # 데이터 없을 시
    print(dumps({}))
    print(dumps([]))
