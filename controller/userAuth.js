let jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../model/userDB");
const crypto = require("crypto");
const { sendMail } = require("../services/common");
// here i used sanitizeUser fnc to protect user's other credentials password etc...

async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(401).json({ existingUser: "Email Already Exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({ message: "success", data: user, token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ emailError: "Invalid email/password" });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(401).json({ emailError: "Invalid email/password" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res
      .status(201)
      .cookie("jwt", token, {
        // path: "/",
        expires: new Date(Date.now() + 60000 * 60),
        httpOnly: true,
      })
      .json({ id: user.id, role: user.role });
  } catch (err) {
    return res.status(500).json({ message: "error", err });
  }
}

async function accessUser(req, res) {
  const { id } = req.user;
  let user = await User.findById(id, "-password");
  res.status(200).json(user);
}

function logout(req, res) {
  res.clearCookie("jwt").status(200).json("user logout");
}

async function refreshToken(req, res, next) {
  let tokenObj = req.cookies;
  if (tokenObj && tokenObj.jwt) {
    let token = tokenObj.jwt;
    jwt.verify(token, process.env.JWT_SECRET, (error, decodeUser) => {
      if (error) {
        return res.status(400).json({ message: "Invalid token" });
      }
      // res.clearCookie("jwt"); // HERE I CLEARED THE PREVIOUS TOKEN COOKIE but whenever i clear the cookie my frontend go back to the login page so instead of clearing cookie so i generated a new cookie here from backend server side
      const token = jwt.sign(
        { id: decodeUser.id, role: decodeUser.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        expiresIn: new Date(Date.now() + 60000 * 60),
      });

      req.user = decodeUser;
      next();
    });
  }
  // res.json({ message: "unauthorized" });
}

async function resetPasswordRequest(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ notAnUser: "User Not Found" });
  }

  if (user) {
    const token = crypto.randomBytes(48).toString("hex");
    user.resetPasswordToken = token;
    await user.save();

    // Also set token in email
    const resetPageLink =
      "https://buynow-ecommerce.onrender.com/reset-password?token=" + token + "&email=" + email;
    const subject = "reset password for e-commerce";
    const html = `<p>Click <a href='${resetPageLink}'>here</a> to Reset Password</p>`;

    // lets send email and a token in the mail body so we can verify that user has clicked right link

    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(400);
  }
}

const resetPassword = async (req, res) => {
  const { email, password, token } = req.body;
  try {
    const user = await User.findOne({
      email: email,
      resetPasswordToken: token,
    });
    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
    }
    const subject = "password successfully reset for BuyNow";
    const html = `<p>Successfully able to Reset Password</p>`;
    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    res.sendStatus(400);
  }
};

module.exports = {
  signup,
  login,
  accessUser,
  logout,
  refreshToken,
  resetPasswordRequest,
  resetPassword,
};
