const express = require("express");
const authRoute = express.Router();
const { signup, login, accessUser, logout ,refreshToken,resetPasswordRequest,resetPassword} = require("../controller/userAuth");
const verifyToken = require("../middleware/common");

authRoute.post("/signup", signup);
authRoute.post("/login", login);
authRoute.get("/check", verifyToken, accessUser);
authRoute.get("/refresh", refreshToken, verifyToken, accessUser);
authRoute.get("/logout", logout);
authRoute.post("/reset-password-request", resetPasswordRequest);
authRoute.post("/reset-password", resetPassword);

module.exports = authRoute;
