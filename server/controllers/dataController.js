import routes from "../routes";
import Dht from "../models/Dht";
import User from "../models/User"
import { PythonShell } from "python-shell";

const options = {
    scriptPath: '/Users/gim-ingug/Documents/iotserver/pythonCgi',
    pythonPath: 'python3',
    pythonOptins: ['-u'],
    args: ['']
}

export const python = (req, res) => {
    PythonShell.run('mongo.py', options, (err, results) => {
        if(err) console.log(err);
        res.send(results);
        console.log(results)
    })
};

export const dataUser = async(req, res) => {
    const {
        params: { id }
    } = req;
    try {
        PythonShell.run('mongo.py', options, (err, results) => {
            if(err) console.log(err);
            res.send(results);
            console.log(results)
        })
        // const user = await User.findById(id).populate('keyList');
    } catch(err) {

    }
};
