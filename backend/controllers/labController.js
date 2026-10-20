import Lab from "../models/laboratory.js";

const createLab = async (req, res) => {
  try {
    const { labName, labVenue, seatCount } = req.body;

    if (!labName || !labVenue || !seatCount) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    const lab = await Lab.create({
      labName,
      labVenue,
      seatCount
    });

    res.status(201).json(lab);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export { createLab };