const express = require('express');
const multer = require('multer');
const moment = require('moment');
const router = express.Router();
const { cSVOperation } = require('./../controllers/helperController');

// Storage setting
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./uploads");
  },
  filename(req, file, cb) {
    cb(null, `${moment().format('DD_MM_YYYY_HH_mm_ss_SSS')}_${file.originalname}`)
  }
});

// File setting
const fileFilter = (req, file, cb) => {
  // Reject the file
  if (file.mimetype !== "text/csv") return cb(new Error("Please upload only .csv files"), false);
  // Accept the file
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/**
 * Upload CSV Files
 */
router.post('/helper', upload.single('fileCsv'), cSVOperation);

module.exports = router;
