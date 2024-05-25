const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}-${Math.random()}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
