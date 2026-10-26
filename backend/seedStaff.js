
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/user.js";

dotenv.config();

const createStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingStaff = await User.findOne({
      email: "labstaff@test.com"
    });

    if (existingStaff) {
      console.log("Staff account already exists");
      return;
    }

    await User.create({
      name: "Test Lab Coordinator",
      email: "labstaff@test.com",
      password: process.env.TEST_STAFF_PASSWORD,
      role: "lab_coordinator"
    });

    console.log("Test staff account created successfully");

  } catch (error) {
    console.error("Error creating staff:", error.message);

  } finally {
    await mongoose.disconnect();
  }
};

createStaff();
