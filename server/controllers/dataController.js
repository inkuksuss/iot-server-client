import routes from "../routes";
import Dht from "../models/Dht";
import User from "../models/User"

export const dataUser = async(req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const user = await User.findById(id).populate('keyList');
        console.log(user);
    } catch(err) {

    }
};
