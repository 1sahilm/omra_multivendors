import fs from "fs";

const express = require("express");

const uploads = require("../config/cloudinary");

const upload = require("../config/multer");

const router = express();

router.use(upload.array("image"));

router.post(async (req, res) => {
  const uploader = async (path) => await uploads(path, "Images");
  const urls = [];
  const files = req.files;

  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(newPath.url);
    fs.unlinkSync(path);
  }

  res.status(200).json(urls);
});

module.exports = router;
