import Dht from "../models/Dht";
import Pms from "../models/Pms";
import User from "../models/User"
import Mongoose from "mongoose";
import { PythonShell } from "python-shell";

const scriptPath = '/Users/gim-ingug/Documents/iotserver/pythonCgi'
const ObjectId = Mongoose.Types.ObjectId;


export const dataUser = (req, res) => {
    const {
        params: { id }
    } = req;
    PythonShell.run('DevicePage.py', { // 파이썬 파일에게 매개변수 전달
        mode: 'json',
        pythonOptions: ['-u'],
        scriptPath,
        args: id
    }, (err, data) => {
        if(err) {
            console.log(err)
            return res.json({ 
                success: false,
                error: err
            })
        }
        console.log(data);
        return res.json({ // 파이썬 파일로부터 처리된 데이터를 클라이언트로 전송
            success: true,
            data
        })
    })
};

export const deviceDetail = async (req, res) => {
    const {
        params: { id }
    } = req;
    let avgTmpForm = [0,0,0,0,0,0,0,0,0,0,0,0];
    let avgHumForm = [0,0,0,0,0,0,0,0,0,0,0,0];
    let avgDustForm = [0,0,0,0,0,0,0,0,0,0,0,0];
    const korea = new Date(); 
    const year = korea.getFullYear();
    const month = korea.getMonth();
    const date = korea.getDate();
    const endDate = korea.getDate() + 1;
    const today = new Date(Date.UTC(year, month, date));
    const tomorrow = new Date(Date.UTC(year, month, endDate));
    try {
        const dhtCalculator = await Dht.aggregate([
            { $match: { product: new ObjectId(id) }},
            {
                $group: {
                    "_id": {"$month": {"$toDate":"$measuredAt"}},
                    AverageTmpValue: { $avg: "$tmp" },
                    AverageHumValue: { $avg: "$hum" },
                }
            }
        ])
        const pmsCalculator = await Pms.aggregate([
            { $match: { product: new ObjectId(id) }},
            {
                $group: {
                    "_id": {"$month": {"$toDate":"$measuredAt"}},
                    AverageDustValue: { $avg: "$dust" }
                }
            }
        ])
        const dhtToday = await Dht.find({ product: id, measuredAt: { $gte: today, $lt: tomorrow }});
        const pmsToday = await Pms.find({ product: id, measuredAt: { $gte: today, $lt: tomorrow }});
        const dhtHourCalculator = await Dht.aggregate([
            { $match: { $and: [{ product: new ObjectId(id) }, { measuredAt: { $gte: today, $lt: tomorrow }}] }},
            {
                $group: {
                    "_id": {"$hour": {"$toDate":"$measuredAt"}},
                    AverageTmpValue: { $avg: "$tmp" },
                    AverageHumValue: { $avg: "$hum" },
                    MaxTmpValue: { $max: "$tmp"},
                    MaxHumValue: { $max: "$hum"},
                    MinTmpValue: { $min: "$tmp"},
                    MinHumValue: { $min: "$hum"},
                }
            },
            { $sort: { _id: 1 }}
        ])    
        const pmsHourCalculator = await Pms.aggregate([
            { $match: { $and: [{ product: new ObjectId(id) }, { measuredAt: { $gte: today, $lt: tomorrow }}] }},
            {
                $group: {
                    "_id": {"$hour": {"$toDate":"$measuredAt"}},
                    AverageDustValue: { $avg: "$dust" },
                    MaxDustValue: { $max: "$dust"},
                    MinDustValue: { $min: "$dust"},
                }
            },
            { $sort: { _id: 1 }}
        ])
        if(dhtHourCalculator.length === pmsHourCalculator.length) {
            for(let i = 0; i < dhtHourCalculator.length; i++) {
                dhtHourCalculator[i] = {...dhtHourCalculator[i], ...pmsHourCalculator[i]}
            }
        }
        let todayContainer = [];
        if(dhtToday && pmsToday) {
            for (const dht of dhtToday) {
                for(const pms of pmsToday) {
                    const { _id, tmp, hum, measuredAt } = dht;
                    const { dust } = pms;
                    if(String(measuredAt) === String(pms.measuredAt)) {
                        const data = {
                            _id,
                            tmp,
                            hum,
                            dust,
                            measuredAt
                        }
                            todayContainer.push(data);
                    }
                }
            }
        }

        for (const dht of dhtCalculator) {
            avgTmpForm.splice((dht._id - 1), 1, dht.AverageTmpValue);
            avgHumForm.splice((dht._id - 1), 1, dht.AverageHumValue);
        }
        for (const pms of pmsCalculator) {
            avgDustForm.splice((pms._id - 1), 1, pms.AverageDustValue);
        }
        // for (const dht of dhtArray) {
        //     // const pms = await Pms.findOne({ product: id, measuredAt: dht.measuredAt }).select('-_id dust') // 실재
        //     const pms = await Pms.findOne({ product: id }).select('-_id dust')
        //     if(pms){
        //         const data = {
        //             _id: dht._id,
        //             tmp: dht.tmp,
        //             hum: dht.hum,
        //             dust: pms.dust,
        //             measuredAt: dht.measuredAt
        //         }
        //         dataArray.push(data)
        //     }
        // }
        return res.status(200).
            json({
                success: true,
                avgTmpForm,
                avgHumForm,
                avgDustForm,
                todayContainer: todayContainer.reverse(),
                dhtHourCalculator
            })
    } catch(err) {
        console.log(err)
        return res.status(204)
            .json({
                success: false,
                data: []
            })
    }
};

export const postDateData = (req, res) => {
    const { 
        body: { date, endDate, btnResult, avgCheck, minCheck, maxCheck },
        params: { id }
    } = req;
    let convertDate = new Date();
    let convertEndDate = new Date();
    const intResult = parseInt(btnResult)
    if( btnResult === 0 && (endDate && date) !== null ) {
        // 기간선택
        convertDate = date.split('T')[0];
        convertEndDate = endDate.split('T')[0];
    } else {
        //버튼
        const buttonDate = new Date()
        const year = buttonDate.getFullYear();
        const month = buttonDate.getMonth() + 1;  // ????
        const today = buttonDate.getDate();
        const koreaDate = new Date(Date.UTC(year, month, today));
        const koreaEndDate = new Date(Date.UTC(year, month, today));
        switch (intResult) {
            case 3:
                koreaDate.setDate(koreaDate.getDate() - 2)
                break;
            case 7:
                koreaDate.setDate(koreaDate.getDate() - 6)
                break;
            case 30:
                koreaDate.setMonth(koreaDate.getMonth() - 1)
                break;
            case 100:
                koreaDate.setFullYear(koreaDate.getFullYear() - 1)
                break;
            default:
                break;
        };
        const convertYear = koreaDate.getFullYear()
        const convertMonth = koreaDate.getMonth()
        const convertDay = koreaDate.getDate()-1
        const convertEndYear = koreaEndDate.getFullYear()
        const convertEndMonth = koreaEndDate.getMonth()
        const convertEndDay = koreaEndDate.getDate()-1
        convertDate = `${convertYear}-${convertMonth < 10 ? `0${convertMonth}` : `${convertMonth}`}-${convertDay < 10 ? `0${convertDay}` : `${convertDay}`}`
        convertEndDate = `${convertEndYear}-${convertEndMonth < 10 ? `0${convertEndMonth}` : `${convertEndMonth}`}-${convertEndDay < 10 ? `0${convertEndDay}` : `${convertEndDay}`}`
    }
    console.log(convertDate, convertEndDate)
    PythonShell.run('ProductInputPage.py', {
    mode: 'json',
    pythonOptions: ['-u'],
        scriptPath,
        args: [id, convertDate, convertEndDate, avgCheck, minCheck, maxCheck, intResult]
    }, (err, data) => {
        if(err) {
            console.log(err)
            // return res.json({ 
            //     success: false,
            //     error: err
            // })
        }
        const dateBox = data.length !== 0 ? data[0] : [];
        const dataDate = data.length !== 0 ? data[1] : {};
        const dataList = data.length !== 0 ? data[2] : []; 
        if(dataList !== [] && dataDate !== {} && dateBox !== []) {
            for(const data of dataList) {
                data.measuredAt = new Date(data.measuredAt['$date']);
                data._id = data._id['$oid'];
            }
            return res.json({
                success: true,
                dataList,
                dataDate,
                dateBox
            })
        } else {
            return res.json({
                success: false
            })
        }
    })
};