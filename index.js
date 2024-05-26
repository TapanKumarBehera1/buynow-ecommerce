const path = require("path");
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const server = express();
const orderRoute = require("./routes/orderRoute");
const productRoute = require("./routes/productRoute");
const authRoute = require("./routes/authRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const cartRoute = require("./routes/cartRoute");
const addressRoute = require("./routes/addressRoute");
const categoryRoute = require("./routes/categoryRoute");
const brandRoute = require("./routes/brandRoute");
const paymentRoute = require("./routes/paymentRoute");
const walletRoute = require("./routes/walletRoute");
const walletRecordRoute = require("./routes/walletRecordRoute");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const databaseConnect = require("./config/database");
const verifyToken = require("./middleware/common");
const webHookController = require("./webhook/webhookOperation");
databaseConnect().catch((error) => console.log(error));
// MongoDB database connection

//server middleware
server.use(express.static(process.env.PUBLIC_DIR));
server.use(cookieParser());
server.use(express.urlencoded({ extended: false }));
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, //don't save session if modified
    saveUninitialized: false, //don't create session until something stored
  })
);

// server.use(
//   cors({
//     exposedHeaders: ["X-Total-Count"],
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

server.use(express.json());

//server route middleware
server.use("/products", verifyToken, productRoute);
server.use("/category", verifyToken, categoryRoute);
server.use("/brand", verifyToken, brandRoute);
server.use("/cart", verifyToken, cartRoute);
server.use("/wishlist", verifyToken, wishlistRoute);
server.use("/address", verifyToken, addressRoute);
server.use("/orders", verifyToken, orderRoute);
server.use("/wallet", verifyToken, walletRoute);
server.use("/walletrecord", verifyToken, walletRecordRoute);
server.use("/payment", verifyToken, paymentRoute);
server.use("/auth", authRoute);
server.post("/webhook", webHookController);


server.use("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

// main().catch((err) => console.log(err));
// async function main() {
//   await mongoose.connect(process.env.MONGODB_URL);
//   console.log("database connected");
// }

//port listen

server.listen(process.env.PORT, () => {
  console.log("server is started");
});
