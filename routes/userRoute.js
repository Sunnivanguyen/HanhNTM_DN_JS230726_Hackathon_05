const express = require("express");
const fs = require("fs");
const userRoute = express.Router();
const userValidation = require("../middleware/userValidation");

const readUsersFile = async (req, res, next) => {
  try {
    const data = await fs.promises.readFile(
      "./dev-data/data/users.json",
      "utf-8"
    );
    const users = JSON.parse(data);
    req.users = users;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: "error",
      message: "An error occured while reading the file",
    });
  }
};

//Get All Users
userRoute.get("/", readUsersFile, (req, res) => {
  const users = req.users;
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users: users,
    },
  });
});

//Get A User
userRoute.get("/:user_id", readUsersFile, (req, res) => {
  const id = req.params.user_id;
  const users = req.users;
  const user = users.find((user) => String(user.id) === id);
  if (user) {
    res.status(200).json({
      status: "success",
      data: {
        user: user,
      },
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "No user found with the ID",
    });
  }
});

//Create A User
userRoute.post("/", readUsersFile, userValidation, async (req, res) => {
  const users = req.users;

  const newUser = {
    id: users[users.length - 1].id + 1,
    ...req.body,
  };
  users.push(newUser);

  try {
    await fs.promises.writeFile(
      "./dev-data/data/users.json",
      JSON.stringify(users)
    );
    return res.status(200).json({
      status: "success",
      result: users.length,
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    return res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
});

//Update A User
userRoute.put("/:user_id", readUsersFile, (req, res) => {
  const id = req.params.user_id;
  const users = req.users;
  const user = users.find((user) => String(user.id) === id);
  if (user) {
    const updatedUser = {
      ...user,
      ...req.body,
    };

    const updatedUsers = users.map((user) =>
      String(user.id) === id ? updatedUser : user
    );
    res.status(200).json({
      status: "success",
      results: updatedUsers.length,
      data: {
        users: updatedUser,
      },
    });
  } else {
    res.status(404).json({
      status: "fail",
      message: "No user found with the ID",
    });
  }
});

//Delete A User
userRoute.delete("/:user_id", readUsersFile, async (req, res) => {
  const id = req.params.user_id;
  const users = req.users;
  const updatedUsers = users.filter((user) => String(user.id) !== id);

  try {
    await fs.promises.writeFile(
      "./dev-data/data/users.json",
      JSON.stringify(updatedUsers)
    );
    res.status(200).json({
      status: "success",
      results: updatedUsers.length,
      data: {
        users: updatedUsers,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = userRoute;
