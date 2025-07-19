const User = require("../models/user");

module.exports.signupPage = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res)=>{
    try{
        let{username,email,password} = req.body;
        const newUser = new User({username,email});
        let registeredUser = await User.register(newUser,password);
        //console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome Back to your Velvet Bookings account!");
            return res.redirect("/listings");
        });
    }catch(err){
        req.flash("error",err.message);
        return res.redirect("/signup");
    }
}

module.exports.login = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginPost = async(req,res)=>{
    req.flash("success","Welcome Back to your Velvet Bookings account!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are successfully logged out!");
        return res.redirect("/listings");
    })
}