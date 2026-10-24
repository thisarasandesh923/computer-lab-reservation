
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


const getLabs = async (req, res) => {
  try {
    const labs = await Lab.find().sort({ labName: 1 });

    res.status(200).json(labs);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch laboratories"
    });
  }
};


const getLabById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Lab.db.base.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid laboratory ID"
      });
    }

    const lab = await Lab.findById(id);

    if (!lab) {
      return res.status(404).json({
        message: "Laboratory not found"
      });
    }

    res.status(200).json(lab);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch laboratory"
    });
  }
};

export { createLab, getLabs, getLabById };
