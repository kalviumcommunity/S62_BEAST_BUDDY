const { getDB } = require('../DB/db');
const { ObjectId } = require("mongodb");


const getUsersController = async (req, res) => {
  const db = getDB();
  try {
    const users = await db.collection("users").find().toArray();
    res.status(200).json(users);
  } catch (error) {
    console.log("Error fetching users", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


const addUserController = async (req, res) => {
  const db = getDB();
  try {
    const newUser = req.body;
    const result = await db.collection("users").insertOne(newUser);
    res.status(201).json({ message: "User added successfully", data: result });
  } catch (er) {
    res
      .status(500)
      .json({ message: "Internal server error", error: er.message });
  }
};


const getSingleUserController = async (req, res) => {
  const db = getDB();
  try {
    const id = req.params.id;
    const result = await db
      .collection("Users")
      .findOne({ _id: new ObjectId(id) });
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(result);
  } catch (er) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: er.message });
  }
};


const updateUserController = async (req, res) => {
  const db = getDB();
  try {
    const id = req.params.id;
    const newData = req.body;
    const result = await db
      .collection("Users")
      .updateOne({ _id: new ObjectId(id) }, { $set: newData });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found", data: result });
    }
    return res
      .status(200)
      .json({ message: "User Updated Successfully", data: result });
  } catch (er) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


const deleteUserController = async (req, res) => {
  const db = getDB();
  try {
    const id = req.params.id;
    const result = await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User Not Found" });
    }
    res.status(200).json({ message: "User Sucesfully Deleted", data: result });
  } catch (er) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  getUsersController,
  addUserController,
  getSingleUserController,
  updateUserController,
  deleteUserController,
};