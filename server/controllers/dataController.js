import routes from "../routes";
import Dht from "../models/Dht";
import User from "../models/User"


export const home = (req, res) => {
    res.render("home", { pageTitle: "Home" })
};

export const postHome = async (req, res) => {
    const { 
        body: { user }
    } = req;
    const jsonUser = JSON.parse(user);
    try {
        const loggedUser = await User.findOne({ email: jsonUser.email });
        res.render('home', { loggedUser });
    } catch (err) {
        console.log(err);
        res.redirect(routes.login);
    }
};

export const search = async(req, res) => {
    const { 
        query: { term: searchingBy }
    } = req;
    try {
    } catch(err) {
        console.log(err);
    }
    res.render("Search", { pageTitle: "Searching", searchingBy })
};

// export const datas = (req, res) => {
//     res.render("datas", { pageTitle: "Data" })
// };

// export const dataDetail = async(req, res) => {
//     const { 
//         params: { id }
//     } = req;
//     try {
//         const data = await findById(id)
//         res.render("dataDetail", { pageTitle: "DataDetail" })
//     } catch(error) {
//         res.redirect(routes.home);
//     }
// };

export const weather = (req, res) => {
    res.render("weather", { pageTitle: "weather" });
}