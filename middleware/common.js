let jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  let tokenObj = req.cookies;
  try {
    if (tokenObj && tokenObj.jwt) {
      let token = tokenObj.jwt;
      let decodeToken = jwt.verify(
        token,
        process.env.JWT_SECRET,
        (error, decode) => {
          if(error){
            return res.status(400).json({ message: "Invalid token" });
          }
          req.user = decode;
          next();
        }
      );
    } else {
      return res.json({ message: "unauthorized" });
    }
  } catch (error) {
    return console.log({ message: "verify token failed" });
  }
}

module.exports = verifyToken;
