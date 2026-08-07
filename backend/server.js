import express from "express";
import cors from "cors";
import db from "./database.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express()
const PORT = process.env.PORT || 3000;
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const extension = file.originalname.split(".").pop();
    cb(null, `${Date.now()}-${Math.random().toString(16).slice(2)}.${extension}`);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json())
app.use("/uploads", express.static("uploads"));

function deleteImageFile(imageUrl) {
  const filename = path.basename(new URL(imageUrl).pathname);
  const filePath = path.join(process.cwd(), "uploads", filename);

  console.log("Trying to delete:", filePath);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("Deleted:", filePath);
  } else {
    console.log("File not found:", filePath);
  }
}

app.get("/", (req,res)=>{
    res.send("Server works!")
})

//get all drafts and parse images from JSON string to array
app.get("/drafts", (req,res)=>{
    const drafts = db.prepare(
        "SELECT * FROM drafts"
    ).all();

    res.json(
        drafts.map((draft) => ({
            ...draft,
            images: JSON.parse(draft.images)
        }))
    )
})

//save a new draft
app.post("/drafts",(req,res)=>{
    const draft = req.body;

    const statement = db.prepare(
        `INSERT INTO drafts (
            id, 
            caption, 
            images, 
            createdAt, 
            updatedAt
        ) 
        VALUES (?, ?, ?, ?, ?)`
    );

    statement.run(draft.id, draft.caption, JSON.stringify(draft.images), draft.createdAt, draft.updatedAt);

    res.json(draft);
})

//upload images
app.post("/images", upload.array("images", 9), (req, res) => {
  const files = req.files;

  const imageUrls = files.map(
    (file) => `/uploads/${file.filename}`
  );

  res.json({ imageUrls });
});

//edit a draft
app.put("/drafts/:id", (req, res) => {
  const id = req.params.id;
  const draft = req.body;

  //get the existing draft before replacing it
  const existingDraft = db.prepare(
    "SELECT * FROM drafts WHERE id = ?"
  ).get(id);

  if (!existingDraft) {
    return res.status(404).json({
      message: "Draft not found"
    });
  }

  const oldImages = JSON.parse(existingDraft.images);
  const newImages = draft.images;

  //find images that existed before but aren't in the new draft
  const removedImages = oldImages.filter(
    (image) => !newImages.includes(image)
  );

  console.log("OLD:", oldImages);
  console.log("NEW:", newImages);
  console.log("REMOVED:", removedImages);

  //delete those files
  for (const image of removedImages) {
    deleteImageFile(image);
  }

  //update the database
  const statement = db.prepare(
    `UPDATE drafts
     SET
       caption = ?,
       images = ?,
       updatedAt = ?
     WHERE id = ?`
  );

  statement.run(
    draft.caption,
    JSON.stringify(newImages),
    draft.updatedAt,
    id
  );

  res.json(draft);
});

//delete a draft
app.delete("/drafts/:id", (req, res) => {
  const id = req.params.id;

  //get the draft before deleting it
  const draft = db.prepare(
    "SELECT * FROM drafts WHERE id = ?"
  ).get(id);

  if (!draft) {
    return res.status(404).json({
      message: "Draft not found"
    });
  }

  const images = JSON.parse(draft.images);

  //delete all images belonging to this draft
  for (const image of images) {
    deleteImageFile(image);
  }

  //delete the draft from the database
  db.prepare(
    "DELETE FROM drafts WHERE id = ?"
  ).run(id);

  res.json({
    message: "Draft deleted"
  });
});

//delete an image from uploads folder
app.delete("/images", (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({
      message: "Image URL is required"
    });
  }

  deleteImageFile(imageUrl);

  res.json({
    message: "Image deleted"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});