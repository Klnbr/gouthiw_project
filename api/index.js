const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const multer = require('multer');

// const crypto = require('crypto');
// const nodemailer = require('nodemailer');

const app = express();
const port = 5500;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // กำหนดโฟลเดอร์ที่จะเก็บไฟล์
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // กำหนดชื่อไฟล์
  }
});

const upload = multer({ storage: storage });
// mongoose.connect('mongodb+srv://kanlayanee:Kanlayanee10062545@cluster0.jvfa7zn.mongodb.net/', {

mongoose.connect('mongodb://localhost:27017/gouthiw', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB")
}).catch((error) => {
  console.log("Error connecting to MongoDB", error)
});

app.listen(port, () => {
  console.log("Server is running on port 5500")
})

const myIngr = require("./models/ingredient");
const myTrivia = require("./models/trivia");
const myMenu = require("./models/menu");
const myUser = require("./models/user");

//ดึงเมนูมาแสดง
app.get("/menus", async (req, res) => {
  try {
    const menus = await myMenu.find({ isDeleted: false });
    res.status(200).json(menus);
  } catch (error) {
    console.error("Error fetching menus data", error);
    res.status(500).json({ message: "Failed to retrieve the menus" });
  }
});

//เพิ่มเมนู
app.post("/addMenu", async (req, res) => {
  try {
    const { menuName, category, ingredients, method, purine, uric, image, isDeleted } = req.body;

    const newMenu = new myMenu({
      menuName,
      category,
      ingredients,
      method,
      purine,
      uric,
      image,
      isDeleted
    });

    await newMenu.save();

    res
      .status(201)
      .json({ message: "Ingredient saved successfully", menu: newMenu });
  } catch (error) {
    console.log("Error creating menu", error);
    res.status(500).json({ message: "Failed to add an menu" });
  }
});

//ไปหน้าแก้ไขเมนู
app.get("/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const menus = await myMenu.findById(id);
    console.log(menus)
    res.status(200).json(menus);
  } catch (error) {
    console.log("error fetching all the menus", error);
    res.status(500).json({ message: "Error fetching all the menus" });
  }
});

//แก้ไขเมนู
app.put('/menu/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      menuName,
      category,
      ingredients,
      method,
      purine,
      uric,
      image, } = req.body;

    await myMenu.findByIdAndUpdate(id, {
      menuName,
      category,
      ingredients,
      method,
      purine,
      uric,
      image,
    })

    res.status(200).json({ message: "Update Menu successfully" })
  } catch (error) {
    console.log("Error update Menu", error);
    res.status(500).json({ message: "Error update Menu" })
  }
})

//ลบเมนู
app.delete('/menu/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const softDeletedMenu = await myMenu.findByIdAndUpdate(id, { isDeleted: true });
    if (!softDeletedMenu) {
      // If the ingredient with the specified id is not found
      return res.status(404).json({ message: "Menu not found" });
    } res.status(200).json({ message: "Menu soft deleted successfully" });
  } catch (error) {
    console.log("Error delete menu", error);
    res.status(500).json({ message: "Error delete menu" })
  }
})

//ดึงวัตถุดิบมาแสดง
app.get("/ingrs", async (req, res) => {
  try {
    const ingrs = await myIngr.find({ isDeleted: false });
    res.status(200).json(ingrs);
  } catch (error) {
    console.error("Error fetching ingrs data", error);
    res.status(500).json({ message: "Failed to retrieve the ingrs" });
  }
});

//เพิ่มวัตถุดิบ
app.post("/addIngr", async (req, res) => {
  try {
    const { name, purine, uric, isDeleted } = req.body;

    //create a new Employee
    const newIngre = new myIngr({
      name,
      purine,
      uric,
      isDeleted
    });

    await newIngre.save();

    res
      .status(201)
      .json({ message: "Ingredient saved successfully", ingr: newIngre });
  } catch (error) {
    console.log("Error creating ingre", error);
    res.status(500).json({ message: "Failed to add an ingre" });
  }
});

//ไปหน้าแก้ไขวัตถุดิบ
app.get("/ingr/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ingrs = await myIngr.findById(id);
    console.log(ingrs)
    res.status(200).json(ingrs);
  } catch (error) {
    console.log("error fetching all the ingrs", error);
    res.status(500).json({ message: "Error fetching all the ingrs" });
  }
});

//แก้ไขวัตถุดิบ
app.put('/ingr/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, purine, uric } = req.body;

    await myIngr.findByIdAndUpdate(id, { name, purine, uric })

    res.status(200).json({ message: "Update ingr successfully" })
  } catch (error) {
    console.log("Error update ingr", error);
    res.status(500).json({ message: "Error update ingr" })
  }
})

//ลบวัตถุดิบ
app.delete('/ingr/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const softDeletedIngredient = await myIngr.findByIdAndUpdate(id, { isDeleted: true });
    if (!softDeletedIngredient) {
      // If the ingredient with the specified id is not found
      return res.status(404).json({ message: "Ingredient not found" });
    } res.status(200).json({ message: "Ingredient soft deleted successfully" });
  } catch (error) {
    console.log("Error delete ingr", error);
    res.status(500).json({ message: "Error delete ingr" })
  }
})

//ดึงเกร็ดความรู้มาแสดง
app.get("/trivias", async (req, res) => {
  try {
    const trivias = await myTrivia.find({ isDeleted: false });
    console.log(trivias)
    res.status(200).json(trivias);
  } catch (error) {
    console.log("error fetching all the trivias", error);
    res.status(500).json({ message: "Error fetching all the trivias" });
  }
});

//เพิ่มเกร็ดความรู้
app.post('/addTrivia', async (req, res) => {
  try {
    const { head, image, content, isDeleted } = req.body;

    const addTrivia = new myTrivia({
      head,
      image,
      content,
      isDeleted
    });
    await addTrivia.save()

    res.status(201).json({ message: "Trivia created successfully", trivia: addTrivia });
  } catch (error) {
    console.log("error creating the trivia", error);
    res.status(500).json({ message: "Error creating the trivia" });
  }
});

//ไปหน้าแก้ไขเกร็ดความรู้
app.get("/trivia/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const trivias = await myTrivia.findById(id);
    console.log(trivias)
    res.status(200).json(trivias);
  } catch (error) {
    console.log("error fetching all the trivias", error);
    res.status(500).json({ message: "Error fetching all the trivias" });
  }
});

//แก้ไขเกร็ดความรู้
app.put('/trivia/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { head, image, content } = req.body;

    await myTrivia.findByIdAndUpdate(id, { head, image, content })

    res.status(200).json({ message: "Update Trivia successfully" })
  } catch (error) {
    console.log("Error update Trivia", error);
    res.status(500).json({ message: "Error update Trivia" })
  }
})

//ลบเกร็ดความรู้
app.delete('/trivia/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const softDeletedIngredient = await myTrivia.findByIdAndUpdate(id, { isDeleted: true });
    if (!softDeletedIngredient) {
      return res.status(404).json({ message: "Trivia not found" });
    } res.status(200).json({ message: "Trivia soft deleted successfully" });
  } catch (error) {
    console.log("Error delete ingr", error);
    res.status(500).json({ message: "Error delete ingr" })
  }
})

app.get("/users", async (req, res) => {
  try {
    const users = await myUser.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users data", error);
    res.status(500).json({ message: "Failed to retrieve the users" });
  }
});

//เพิ่มผู้ใช้
app.post("/addUser", async (req, res) => {
  try {

    const newUserDetails = {
      firstName: "Kanlayanee",
      lastName: "Boonrin",
      menuBreakfast: [],
      menuLunch: [],
      menuDinner: [],
      purine: 400,
      uric: 800,
      isDeleted: false
      // Add other properties as needed
    };

    const newUser = new myUser(newUserDetails);

    // Save the user to the database
    await newUser.save();

    res
      .status(201)
      .json({ message: "User saved successfully", menu: newUser });
  } catch (error) {
    console.log("Error creating user", error);
    res.status(500).json({ message: "Failed to add an user" });
  }
});

// โชว์มื้อเช้า
app.get("/breakfast", async (req, res) => {
  try {
    const usersWithBreakfast = await myUser.find({}, 'menuBreakfast');
    const breakfast = usersWithBreakfast.map(user => user.menuBreakfast).flat();
    res.status(200).json(breakfast);
  } catch (error) {
    console.error("Error fetching breakfast data", error);
    res.status(500).json({ message: "Failed to retrieve the breakfast" });
  }
});

// โชว์มื้อกลางวัน
app.get("/lunch", async (req, res) => {
  try {
    const usersWithLunch = await myUser.find({}, 'menuLunch');
    const lunch = usersWithLunch.map(user => user.menuLunch).flat();
    res.status(200).json(lunch);
  } catch (error) {
    console.error("Error fetching lunch data", error);
    res.status(500).json({ message: "Failed to retrieve the lunch" });
  }
});

// โชว์มื้อเย็น
app.get("/dinner", async (req, res) => {
  try {
    const usersWithDinner = await myUser.find({}, 'menuDinner');
    const dinner = usersWithDinner.map(user => user.menuDinner).flat();
    res.status(200).json(dinner);
  } catch (error) {
    console.error("Error fetching dinner data", error);
    res.status(500).json({ message: "Failed to retrieve the dinner" });
  }
});

// เพิ่มมื้อเช้า
app.post("/user/addBreakfast", async (req, res) => {
  try {
    const { menuName, purine, uric, qty } = req.body;

    const userId = "65ecbc08af72684248663587";
    const user = await myUser.findById(userId);

    user.purine += purine.toFixed(2) * qty;
    user.uric += uric.toFixed(2) * qty;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.menuBreakfast.push({
      menuName,
      purine,
      uric,
      qty,
    });

    await user.save();

    res
      .status(201)
      .json({ message: "Breakfast saved successfully", breakfast: user.menuBreakfast });
  } catch (error) {
    console.log("Error creating menu", error);
    res.status(500).json({ message: "Failed to add an menu" });
  }
});

// เพิ่มมื้อกลางวัน
app.post("/user/addLunch", async (req, res) => {
  try {
    const { menuName, purine, uric, qty } = req.body;

    const userId = "65ecbc08af72684248663587";
    const user = await myUser.findById(userId);

    user.purine += purine.toFixed(2) * qty;
    user.uric += uric.toFixed(2) * qty;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.menuLunch.push({
      menuName,
      purine,
      uric,
      qty,
    });

    await user.save();

    res
      .status(201)
      .json({ message: "Lunch saved successfully", lunch: user.menuLunch });
  } catch (error) {
    console.log("Error creating menu", error);
    res.status(500).json({ message: "Failed to add an menu" });
  }
});

// เพิ่มมื้อเย็น
app.post("/user/addDinner", async (req, res) => {
  try {
    const { menuName, purine, uric, qty } = req.body;

    const userId = "65ecbc08af72684248663587";
    const user = await myUser.findById(userId);

    user.purine += purine.toFixed(2) * qty;
    user.uric += uric.toFixed(2) * qty;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.menuDinner.push({
      menuName,
      purine,
      uric,
      qty,
    });

    await user.save();

    res
      .status(201)
      .json({ message: "Dinner saved successfully", lunch: user.menuDinner });
  } catch (error) {
    console.log("Error creating menu", error);
    res.status(500).json({ message: "Failed to add an menu" });
  }
});

//ลบมื้อเช้า
app.delete('/breakfast/delete/:id', async (req, res) => {
  const { id } = req.params;
  const userId = "65ecbc08af72684248663587";

  try {    
    const user = await myUser.findById(userId);

    const breakfastIndex = user.menuBreakfast.findIndex(breakfast => breakfast._id.toString() === id);

    const deletedBreakfast = user.menuBreakfast.splice(breakfastIndex, 1)[0];
    const purine = deletedBreakfast.purine * deletedBreakfast.qty;
    const uric = deletedBreakfast.uric * deletedBreakfast.qty;

    user.purine -= purine;
    user.uric -= uric;

    await user.save();

    res.status(200).json({ message: "Breakfast soft deleted successfully" });
  } catch (error) {
    console.log("Error delete Breakfast", error);
    res.status(500).json({ message: "Error delete Breakfast" })
  }
})

//ลบมื้อกลางวัน
app.delete('/lunch/delete/:id', async (req, res) => {
  const { id } = req.params;
  const userId = "65ecbc08af72684248663587";

  try {    
    const user = await myUser.findById(userId);

    const lunchIndex = user.menuLunch.findIndex(lunch => lunch._id.toString() === id);

    const deletedLunch = user.menuLunch.splice(lunchIndex, 1)[0];
    const purine = deletedLunch.purine * deletedLunch.qty;
    const uric = deletedLunch.uric * deletedLunch.qty;


    user.purine -= purine;
    user.uric -= uric;

    await user.save();

    res.status(200).json({ message: "Lunch soft deleted successfully" });
  } catch (error) {
    console.log("Error delete Lunch", error);
    res.status(500).json({ message: "Error delete Lunch" })
  }
})

//ลบมื้อเย็น
app.delete('/dinner/delete/:id', async (req, res) => {
  const { id } = req.params;
  const userId = "65ecbc08af72684248663587";

  try {    
    const user = await myUser.findById(userId);

    const dinnerIndex = user.menuDinner.findIndex(dinner => dinner._id.toString() === id);

    const deletedDinner = user.menuDinner.splice(dinnerIndex, 1)[0];
    const purine = deletedDinner.purine * deletedDinner.qty;
    const uric = deletedDinner.uric * deletedDinner.qty;

    user.purine -= purine;
    user.uric -= uric;

    await user.save();

    res.status(200).json({ message: "Dinner soft deleted successfully" });
  } catch (error) {
    console.log("Error delete Dinner", error);
    res.status(500).json({ message: "Error delete Dinner" })
  }
})