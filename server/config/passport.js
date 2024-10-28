const passport = require("passport")
const user = require("../auth/user")
const bcrypt = require("bcrypt")
const localStrategy = require("passport-local")
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
// client id 227094651511-20q7u158k2ii71uvso8vaigbfobugt0q.apps.googleusercontent.com
// client secret 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

passport.use(new localStrategy(
    {
        usernameField: "email",
    },
    function(email, password, done){
        user.findOne({email}).then(user => {
            if(user){
                bcrypt.compare(password, user.password, function(err, result) {
                    if(err){return done(err)}
                    if(result){return done(null, user)}
                });
            }else{
                return done("Пользователь не найден")
            }
        }).catch(e => {
            return done(e)
        })
    }
));

passport.use(new GoogleStrategy({
    clientID:     "227094651511-20q7u158k2ii71uvso8vaigbfobugt0q.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL:  "http://localhost:8000/api/auth/google",
    scope: ["profile", "email", "openid"],
  },
  async function(request, accessToken, refreshToken, profile, done) {
    try {
        let existingUser = await user.findOne({ googleId: profile.id });
  
        if (existingUser) {
            return done(null, existingUser);
        } else {
            const newUser = new user({
            googleId: profile.id,
            full_name: profile.displayName,
            email: profile.emails[0].value,
          });
          await newUser.save();
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, null);
      }
  }
));

passport.serializeUser(function(user, done){
    done(null, user._id)
})

passport.deserializeUser(function(id, done){
    user.findById(id).then((user, err) => {
        done(err, user)
    })
})