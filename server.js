require("dotenv").config();
const fs = require("fs");

const express = require("express");
const app = express();

const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");

const port = process.env.PORT || 9000;
app.use(express.json());

app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
