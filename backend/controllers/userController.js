import User from "../models/user.js";

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export { createUser };