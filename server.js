const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const Gallery = require("./db/gallerySchema.js");

const port = 5000;
const app = express();
app.use(cors());
const MONGO_URI = process.env.MONGO_URI;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 100000,
  })
);
app.use(express.json());

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.get("/", (req, res) => {
  res.send("Welcome to the Gallery App!");
});

app.post("/upload", async (req, res) => {
  try {
    const galleryItem = new Gallery({
      filename: req.body.filename,
      base64: req.body.base64,
      uploadDate: req.body.uploadDate,
      likes: req.body.likes,
      isLiked: req.body.isLiked,
      tags: req.body.tags,
      comments: [],
    });
    // console.log(galleryItem);

    // Save the gallery item to the database
    await galleryItem.save();

    res
      .status(201)
      .json({ message: "Image uploaded successfully!", galleryItem });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Errorsss uploading image.", error: err.message });
  }
});

app.get("/upload", async (req, res) => {
  const allData = await Gallery.find();
  res.json(allData);
});

app.put("/upload/:id", async (req, res) => {
  try {
    // console.log(req.params.id);
    const imageId = req.params.id;
    const updatedImage = await Gallery.findByIdAndUpdate(
      imageId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.status(200).json(updatedImage);
  } catch (error) {
    res.status(500).json({ error: "Failed to update like count" });
  }
});
app.post("/updatelike", async (req, res) => {
  // console.log(req.params.id);
  // const imageId = req.params.id;
  // console.log(req.body);
  const item = req.body;
  const imageId = item._id;
  const isLiked = item.isLiked;
  const likes=item.likes;
  // console.log(isLiked);
  try {
    if (isLiked) {
      const updatedImage = await Gallery.findByIdAndUpdate(
        imageId,
        { $inc: { likes: 1 } },
        { new: true }
      );
      console.log("image like increase");
      // console.log(updatedImage);
      updatedImage.save();
      res.status(200).json({ message: "liked increase successfully!", updatedImage });
    } else if(likes>0) {
      const updatedImage = await Gallery.findByIdAndUpdate(
        imageId,
        { $inc: { likes: -1 } },
        { new: true }
      );
      updatedImage.save();
      res.status(200).json({ message: "liked decrease successfully!", updatedImage });
    }

    
  } catch (error) {
    res.json(error.message);
  }
});

app.post("/addcomment/:id", async(req,res)=>{

  const imageId=req.params.id;
  const comment=req.body.comment;
  // console.log(comment);
     try{
     const updatedImage=await Gallery.findOneAndUpdate(
      { _id: imageId }, 
      { $push: { 
                comments: comment
              } 
      },{new:true})
      // console.log(updatedImage);
      res.status(200).json({ message: "comment added successfully", updatedImage });
    }catch(error){
      res.json(error);
    }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
