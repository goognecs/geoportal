module.exports.isAuth = (req,res,next)=>{
    if(!req.session.user){
        return res.redirect('/signUp');
    }
    return next();
}