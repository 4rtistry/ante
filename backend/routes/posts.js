const express = require("express");
const multer = require("multer");  

const router = express.Router();

const Post = require('../models/post');
const checkAuth = require("../middleware/check-auth");  

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

router.post("", checkAuth, multer({ storage: storage }).single("image"), async (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });

  try {
    const result = await post.save();
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...result._doc,
        id: result._id
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Creating a post failed!"
    });
  }
});

router.put("/:id", checkAuth,  
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
          imagePath: imagePath,
          creator: req.userData.userId  
      });  
      
     Post.updateOne(
  { _id: req.params.id, creator: req.userData.userId }, 
  post                                                   
)
  .then(result => {
  
    const modified = result.nModified ?? result.modifiedCount ?? 0;

    if (modified > 0) {
      return res
        .status(200)
        .json({ message: 'Update successful!' });
    }

    res.status(401).json({ message: 'Not authorized!' });
  })
  .catch(error =>{  
      res.status(500).json({  
        message: "Couldn't Update Post"  
      });  
    });  
});

router.get("", async (req, res, next) => {
  const pageSize = +req.query.pagesize;  
  const currentPage = +req.query.currentpage;
  let fetchedPosts;

  try {
    const postQuery = Post.find();
    
    if (pageSize && currentPage) {  
      postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    fetchedPosts = await postQuery.exec();
    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      message: 'Posts successfully fetched',
      posts: fetchedPosts,
      totalPosts: totalPosts  
    });
  } catch (error) {
    res.status(500).json({ message: "Fetching posts failed!" });
  }
});

  router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(484).json({message: 'Post not found!'});
      }
    }).catch(error =>{  
      res.status(500).json({  
        message: "Fetching Posts Failed!"  
      });  
    });  
  });

  router.delete("/:id",   checkAuth,   (req, res, next) => {
    Post.deleteOne(
  { _id: req.params.id, creator: req.userData.userId }   
)
  .then(result => {
 
    const deleted = result.deletedCount ?? result.n ?? 0;

    console.log(result);
    console.log(req.params.id);

    if (deleted > 0) {
      return res.status(200).json({ message: 'Delete successful!' });
    }

    res.status(401).json({ message: 'Not authorized!' });
  })
 .catch(error =>{  
    res.status(500).json({  
      message: "Deletion Not Done!"  
    });  
  });  
   });

   module.exports = router;