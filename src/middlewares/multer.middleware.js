import multer from "multer"


const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd()}/public/reports`)
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname)
  }
})

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd()}/public/coverImages`)
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname)
  }
})


export const pdfUpload = multer({
   storage: pdfStorage ,

   limits: {
      fileSize: 1024 * 1024 * 50 //5 mb
   },

   fileFilter : (req,file,cb)=>{

    if(file.mimetype.includes('pdf')){
      cb(null ,true);
    }
    else{
      cb(new Error('Only Pdf allowed') , false)
    }
   }
  })
export const imageUpload = multer({
   storage: imageStorage ,

   limits: {
      fileSize: 1024 * 1024 * 50 //5 mb
   },

   fileFilter : (req,file,cb)=>{

    if(file.mimetype.startsWith('image/')){
      cb(null ,true);
    }
    else{
      cb(new Error('Only Images allowed!') , false)
    }
   }
  })