


const multer =require('multer')
const path = require("path");
const storage = multer.diskStorage({
  destination: "public/banner",
//   function (req, file, cb) {
//     cb(null, '/public/banner');
//   },
  filename: function (req, file, cb) {
    cb(null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
       );
  },
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb({ message: 'unsupported file type' }, false);
  }
};

const upload = multer({
  storage: storage,
//   limits: { fileSize: 1024 * 1024 * 1024 },
//   fileFilter: fileFilter,
});

module.exports= upload;
