import routes from "../routes";
import Dht from "../models/Dht";
import User from "../models/User"
import { PythonShell } from "python-shell";

const scriptPath = '/Users/gim-ingug/Documents/iotserver/pythonCgi'

export const dataUser = async(req, res) => {
    const {
        params: { id }
    } = req;
    try {
        PythonShell.run('mean.py', {
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
            res.json({
                success: true,
                data
            })
        })
    } catch(err) {
        throw Error();
    }
};
