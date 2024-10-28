const User = require("../auth/user");
const bcrypt = require("bcrypt")
async function createAdmin(){
    const findAdmin = await User.findOne({isAdmin: true});
    if(!findAdmin){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash("1", salt, function(err, hash) {
                new User({
                    full_name: "Master",
                    email: "master@mail.ru",
                    isAdmin: true,
                    password: hash,
                }).save()
            })
        })
    }
}

module.exports = createAdmin;