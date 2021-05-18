import routes from "../routes";
import Dht from "../models/Dht";
import User from "../models/User"
import { PythonShell } from "python-shell";
import cookieParser from 'cookie-parser';
import { json } from 'body-parser';

const scriptPath = '/Users/gim-ingug/Documents/iotserver/pythonCgi'

export const dataUser = async(req, res) => {
    const {
        params: { id }
    } = req;
    try {
        PythonShell.run('DataUser.py', {
            scriptPath,
            args: id
        }, (err, data) => {
            if(err) {
                return res.json({ 
                    success: false,
                    error: err
                })
            }
            const parseData = JSON.parse(data)
            res.json({
                success: true,
                data: parseData
            })
        })
    } catch(err) {
        throw Error();
    }
};
