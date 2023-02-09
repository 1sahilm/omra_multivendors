const { verifyJwt } = require("./jwtMiddleware");

const IsAdmin =()=>{
    user= verifyJwt
    console.log(user)
    
}

module.exports = {IsAdmin}