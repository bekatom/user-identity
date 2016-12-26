

module.exports = (passport) => {
    
     passport.use('token-login', (req,done) =>{
        console.log("token-login :::: ");
        process.nextTick(()=>{

            console.log("Req body ", req.body);
            return done(null, false, req.flash('errors', 'No user found.'));

        });

    });
}