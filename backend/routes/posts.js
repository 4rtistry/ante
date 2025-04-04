const express = require("express");
const multer = require("multer");  

const router = express.Router();

const Post = require('../models/post');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid Mime Type");
      if (isValid) {
          error = null;
      }
      cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
      const name = file.originalname.toLowerCase().split(' ').join('_');
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name+ '-' + Date.now() + '.' + ext);
  }
});  

router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");

  const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename
  })
  post.save().then(result => {
      res.status(201).json({
          message: 'Post added successfully',
          post: {
              ...result,
              id: result._id
          }
      })
  })
})

router.put("/:id", 
  multer({ storage: storage }).single("image"),
  (req, res, next) => {  
      let imagePath = req.body.imagePath;
      if (req.file) {
          const url = req.protocol + '://' + req.get("host");
          imagePath = url + "/images/" + req.file.filename
      }

      const post = new Post({ 
          _id: req.body.id,  
          title: req.body.title,  
          content: req.body.content,
          imagePath: imagePath
      });  
      Post.updateOne({_id: req.params.id}, post).then(result => { 
          console.log(result);  
          res.status(200).json({ message: "Update Successful!" });  
      }).catch(error => {
          res.status(500).json({ message: "Update failed!", error });
      });
});

router.get("", (req, res, next) => {
   Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Post successfully fetched',
        posts: documents
      })
    });
  });

  router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(484).json({message: 'Post not found!'});
      }
    })
  });

  router.delete("/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
      console.log(result);
      console.log(req.params.id);
      res.status(200).json({ message: "Post deleted" });
    })
   });

   module.exports = router;