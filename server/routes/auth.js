import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import fetchuser from "../middleware/fetchuser.js";
import env from 'dotenv'

env.config();
const router = express.Router();

//ROUTE 1: Create a user using POST "/api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("name", "Enter a valid name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;
    // if there are error return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    // Check Wheather the user with this email exists already
    try {      
    let user = await User.findOne({email: req.body.email});
    if(user) {
        return res.status(400).json({success, "error": 'Sorry a user with this email already exist'});
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    //Create a new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });
    const data = {
      user: {
        id: user.id,
      }
    }
    const authtoken = jwt.sign(data, process.env.JWT_SECRET);
    
    //res.json(user);
    success = true;
    res.json({success, authtoken});
    
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
  }
);

//ROUTE 2: Authenticate a user using : POST "/api/auth/login". No login required
router.post("/login", [
  body("email", "Enter a valid email").isEmail(),
  body("password", "Password cannot be blank").exists(),
], async (req, res) => {

  let success = false;
  // if there are error return bad request and error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email, password} = req.body;
  try {
    let user = await User.findOne({email});
    if(!user) {
      success = false;
      return res.status(400).json({error: "Please login with correct credentials"});
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
      success = false;
      return res.status(400).json({success, error: "Please login with correct credentials"});
    }
    const data = {
      user: {
        id: user.id,
      }
    }
    
    const authtoken = jwt.sign(data, process.env.JWT_SECRET);
    success = true
    res.json({success, authtoken});
    
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//ROUTE 3: Get loggedin User Details using : POST "/api/auth/getuser". login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})

export default router;
