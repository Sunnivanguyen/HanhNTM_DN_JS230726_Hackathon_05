require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

const productRoute = require("./routes/productRoute");
const receiptRoute = require("./routes/receiptRoute");

const port = process.env.PORT || 7001;

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

app.use("/api/v1/products", productRoute);
app.use("/api/v1/receipts", receiptRoute);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
