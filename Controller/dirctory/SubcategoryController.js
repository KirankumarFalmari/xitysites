//Other Class Define
const express = require("express");
const route = express.Router();
const path = require("path");
const bodyparser = require("body-parser");
var dateTime = require("node-datetime");
require("../../Connection/connection");
const css_path = path.join(__dirname, "../../Public/");
const moment = require("moment");
const ObjectId = require("mongodb").ObjectId;
const multer = require("multer");
const category = require("../../Modules/Directory/category");
const subcategory = require("../../Modules/Directory/subcategory");
const childcategory = require("../../Modules/Directory/childcategory");

const temp = path.join(__dirname, "../../upload/subcategory/");
// console.log(css_path);

route.use("/upload/subcategory/", express.static(temp));
route.use(express.static(css_path));

const Storage = multer.diskStorage({
  destination: "./upload/subcategory/",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: Storage,
});

var dt = dateTime.create();
var formatted = dt.format("Y-m-d H:M:S");

//Fetch List
route.get("/", async (req, res) => {
  const data = await subcategory.find({});
  const cdata = await category.find({});

  // console.log(data);
  res.render("directory/subcategory/index", {
    data: data,
    cdata: cdata,
    moment: moment,
  });
});

//Create List
route.get("/create", async (req, res) => {
  const data = await category.find({});
  res.render("directory/subcategory/create", {
    data: data,
    moment: moment,
  });
});

// Add Category
route.post("/create", upload.single("image"), async (req, res) => {
  // console.log(req.body);
  const categorydata = await category.find({
    _id: new ObjectId(req.body.selectcategory.trim()),
  });
  if (categorydata) {
    const data = subcategory({
      categoryid: req.body.selectcategory,
      name: req.body.name,
      path: req.file.path,
      created: formatted,
    });

    await data.save();
    res.redirect("/directory/subcategory/");
  }
});

let id;
//Edit List
route.get("/edit/:id", async (req, res) => {
  id = req.params.id;
  const cdata = await category.find({});
  const data = await subcategory.find({
    _id: new ObjectId(req.params.id.trim()),
  });
  // console.log(data);
  // console.log(cdata);
  res.render("directory/subcategory/edit", {
    data: data,
    cdata: cdata,
    moment: moment,
  });
});

route.post("/edit", async (req, res) => {
  // console.log(req.body.selectcategory, id);
  try {
    await subcategory
      .findOneAndUpdate(
        { _id: id },
        {
          $set: {
            categoryid: req.body.selectcategory,
            name: req.body.name,
            updated: formatted,
          },
        }
      )
      .then(() => {
        // res.sendFile(static_path + "edit.html");
        res.redirect("/directory/subcategory");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
});

route.get("/delete/:id", async (req, res) => {
  await subcategory.findByIdAndDelete(req.params.id);
  await childcategory.deleteMany({ subcategoryid: req.params.id });

  res.redirect("/directory/subcategory");
});

module.exports = route;
