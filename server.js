const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
// instantiate an express app
const app = express();
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// cors
app.use(cors({ origin: "*" }));
const PORT = process.env.PORT || 5005;

app.get("/", function (req, res) {
  res.send("<html><body><h1>Hello World</h1></body></html>");
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "alamgirkabir45789@gmail.com",
    pass: "ycwcvasuzrebhims",
  },
});
app.post("/send", (req, res) => {
  // console.log(req.body);
  // res.send("response");
  const mail = {
    sender: `${req.body.firstName + req.body.lastName} <${req.body.email}>`,
    to: "alamgirkabir45789@gmail.com", // receiver email,

    // phone: req.body.phone,
    subject: req.body.subject,
    text: `${req.body.firstName + req.body.lastName} <${req.body.email}> \n${
      req.body.message
    }`,
  };
  transporter.sendMail(mail, (err, info) => {
    if (err) {
      res.status(500).send("Something went wrong.");
    } else {
      res.status(200).send("Email successfully sent to recipient!");
    }
  });
});

/*************************************************/
// Express server listening...
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
