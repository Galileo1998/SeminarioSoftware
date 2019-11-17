var express = require('express');
var router = express.Router();

var passport = require('passport');
var passportJWT = require('passport-jwt');
var ExtractJWT = passportJWT.ExtractJwt;
var JWTStrategy = passportJWT.Strategy;

function initApi(db){

passport.use(
    new JWTStrategy(
        {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'unproyectobienCHINGON'
        },
        (payload, next)=>{
        var user = payload;
        return next(null, user);
        }
    )
    ); 
    
    var securityApiRoutes = require('./security/index')(db);
    var productsApiRoutes = require('./products/index')(db);
    var donationsApiRoutes = require('./donations/index')(db);
        
    router.use('/sec', securityApiRoutes);

    router.use(
        '/prd',
        passport.authenticate('jwt', {session:false}), 
        productsApiRoutes
    );

    router.use(
        '/don', 
        passport.authenticate('jwt', {session:false}), 
        donationsApiRoutes,        
    );
    
    return router;
}
module.exports = initApi;