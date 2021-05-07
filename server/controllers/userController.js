import routes from "../routes";
import User from "../models/User";

// Users
export const getMe =  async (req, res) => {
    const { 
        user: { id }
    } = req;
    try {
        const user = await User.findById(id)
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch(err) {
        res.redirect(routes.home);
    }
};

// Users
export const userDetail = async (req, res) => {
    const {
      params: { id }
    } = req;
    try {
      const user = await User.findById(id);
      res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
      res.redirect(routes.home);
    }
};

export const getEditProfile = (req, res) => {
     res.render("editProfile", { pageTitle: "Edit Profile" })};

export const postEditProfile = async (req, res) => {
    const {
         body: {    
            name,
            email
         },
         file
    } = req;    /////////////////////////////// req.user로 하면 에러뜸 why?
    try {
        await User.findByIdAndUpdate({_id: req.user._id}, {$set: {  
            name,
            email,
            avatar: (file ? file.path : req.user.avatar)
        }}, {new: true});
        res.redirect(routes.me);
    } catch (err) {
        res.redirect(routes.editProfile);
    }
};

export const getChangePassword = (req,res) => {
     res.render("changePassword", { pageTitle: "Change Paasword" })};

export const postChangePassword =  async (req,res) => {
    const { body:
            {
                oldPassword,
                newPassword,
                newPassword1
            }
        } = req;
    try {
        if(newPassword !== newPassword1) {
            res.status(400);
            res.redirect(`/users${routes.changePassword}`);
            return;
        }
        await req.user.changePassword(oldPassword, newPassword1);
        res.redirect(routes.me);
    } catch(err) {
        res.status(400);
        res.redirect(`/users${routes.changePassword}`);
    }
};
   
