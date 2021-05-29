import Dht from "../models/Dht";
import Pms from "../models/Pms";
import User from "../models/User"
import { PythonShell } from "python-shell";

const scriptPath = '/Users/gim-ingug/Documents/iotserver/pythonCgi'

export const dataUser = async(req, res) => {
    const {
        params: { id }
    } = req;
    try {
        PythonShell.run('DevicePage.py', { // 파이썬 파일에게 매개변수 전달
            mode: 'json',
            pythonOptions: ['-u'],
            scriptPath,
            args: id
        }, (err, data) => {
            if(err) {
                return res.json({ 
                    success: false,
                    error: err
                })
            }
            res.json({ // 파이썬 파일로부터 처리된 데이터를 클라이언트로 전송
                success: true,
                data
            })
        })
    } catch(err) {
        throw Error();
    }
};

export const deviceDetail = async (req, res) => {
    const {
        params: { id }
    } = req;
    let dataArray = [];
    try {
        const dhtArray = await Dht.find({ product: id }).select('_id tmp hum measuredAt')
        if(dhtArray) {
            for (const dht of dhtArray) {
                // const pms = await Pms.findOne({ product: id, measuredAt: dht.measuredAt }).select('-_id dust')
                const pms = await Pms.findOne({ product: id }).select('-_id dust')
                if(pms){
                    const data = {
                        _id: dht._id,
                        tmp: dht.tmp,
                        hum: dht.hum,
                        dust: pms.dust,
                        measuredAt: dht.measuredAt
                    }
                    dataArray.push(data)
                }
            }
            if(dataArray.length !== 0) {
                res.json({
                    success: true,
                    data: dataArray.reverse()
                })
            } else {
                res.json({
                    success: false,
                    data: []
                })        
            }
        }
    } catch(err) {
        console.log(err)
        res.json({
            success: false,
            data: []
        })
    }
};

export const postDateData = (req, res) => {
    const { 
        body: { date, endDate, btnResult },
        params: { id }
    } = req;
    let convertDate = new Date();
    let convertEndDate = new Date();
    if( btnResult === 0 && (endDate && date) !== null ) {
        // 기간선택
        convertDate = date.split('T')[0];
        convertEndDate = endDate.split('T')[0];
    } else {
        //버튼
        const intResult = parseInt(btnResult)
        const buttonDate = new Date()
        const year = buttonDate.getFullYear();
        const month = buttonDate.getMonth() + 1;  // ????
        console.log(month)
        const today = buttonDate.getDate() + 1;
        const koreaDate = new Date(Date.UTC(year, month, today));
        const koreaEndDate = new Date(Date.UTC(year, month, today));
        switch (intResult) {
            case 1:
                koreaDate.setDate(koreaDate.getDate() - 1)
                break;
            case 3:
                koreaDate.setDate(koreaDate.getDate() - 3)
                break;
            case 7:
                koreaDate.setDate(koreaDate.getDate() - 7)
                break;
            case 30:
                koreaDate.setMonth(koreaDate.getMonth() - 1)
                break;
            case 100:
                koreaDate.setFullYear(koreaDate.getFullYear() - 5)
                break;
            default:
                break;
        };
        const convertYear = koreaDate.getFullYear()
        const convertMonth = koreaDate.getMonth()
        const convertDay = koreaDate.getDate()
        const convertEndYear = koreaEndDate.getFullYear()
        const convertEndMonth = koreaEndDate.getMonth()
        const convertEndDay = koreaEndDate.getDate()
        convertDate = `${convertYear}-${convertMonth < 10 ? `0${convertMonth}` : `${convertMonth}`}-${convertDay < 10 ? `0${convertDay}` : `${convertDay}`}`
        convertEndDate = `${convertEndYear}-${convertEndMonth < 10 ? `0${convertEndMonth}` : `${convertEndMonth}`}-${convertEndDay < 10 ? `0${convertEndDay}` : `${convertEndDay}`}`
    }
    PythonShell.run('ProductInputPage.py', {
    mode: 'json',
    pythonOptions: ['-u'],
        scriptPath,
        args: [id, convertDate, convertEndDate]
    }, (err, data) => {
        if(err) {
            return res.json({ 
                success: false,
                error: err
            })
        }
        const dataList = data[0]
        console.log(dataList)
        for(const data of dataList) {
            data.measuredAt = new Date(data.measuredAt['$date']);
            data._id = data._id['$oid'];
        }
        return res.json({
            success: true,
            dataList
        })
    })
};