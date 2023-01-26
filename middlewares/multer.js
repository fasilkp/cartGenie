import multer from "multer";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/product-images");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
      }
}); 
  
var upload = multer({ storage: storage });

export default upload