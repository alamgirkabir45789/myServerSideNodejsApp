const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const person = require("./data.json");
const project = require("./fake-db/project.json");
// import myProject from "./fake-db/project.json";
// instantiate an express app
const app = express();
const books = [
  { id: 1, title: "Programming" },
  { id: 2, title: "Science" },
  { id: 3, title: "Literature" },
];
// support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
// cors
app.use(cors({ origin: "*" }));
const PORT = process.env.PORT || 5005;
const sql = require("mssql");
// config for your database
const config = {
  user: "NewSA ",
  password: "Password@1234",
  server: "DESKTOP-TIHHKTO",
  database: "NODEJSDB",
  options: {
    trustServerCertificate: true,
  },
};
sql.connect(config, function (err) {
  if (err) console.log(err);
  //Sql Connection
  app.get("/member", async function (req, res) {
    // connect to your database

    // create Request object
    const request = new sql.Request();
    // query to the database and get the records
    request.query("select * from Member", function (err, recordset) {
      if (err) console.log(err);

      // send records as a response
      res.send(recordset);
    });
  });
});

// Post Member
app.post("/api/member", async (req, res) => {
  const member = {
    MemberName: req.body.MemberName,
    ContactNo: req.body.ContactNo,
  };

  // create Request object
  const request = new sql.Request();
  var stringRequest =
    "INSERT INTO Member (MemberName, ContactNo) VALUES (" +
    req.body.MemberName +
    "," +
    req.body.ContactNo +
    ")";
  request.query(stringRequest, function (err, recordset) {
    if (err) console.log(err);

    // send records as a response
    res.send(recordset);
    console.log(recordset);
  });
});

app.get("/", function (req, res) {
  res.send("<html><body><h1>Hello World</h1></body></html>");
});
app.get("/person", (req, res) => {
  res.send(person);
});
app.get("/project", (req, res) => {
  res.send(project);
});

//Get Books
app.get("/api/books", (req, res) => {
  res.send(books);
});
//Get Books By Id
app.get("/api/books/:id", (req, res) => {
  console.log(req.params.id);
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>'
      );
  } else {
    res.send(book);
  }
});
//Post Book
app.post("/api/books", (req, res) => {
  const book = {
    id: books.length + 1,
    title: req.body.title,
  };
  books.push(book);
  res.send(book);
});
//Update Book
app.put("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>'
      );
  }
  book.title = req.body.title;
  res.send(book);
});
//Delete Book
app.delete("/api/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    res
      .status(404)
      .send(
        '<h2 style="font-family: Malgun Gothic; color: darkred;">Ooops... Cant find what you are looking for!</h2>'
      );
  }
  const index = books.indexOf(book);
  books.splice(index, 1);
  res.send(book);
});
// app.get("/project", (req, res) => {
//   res.send(myProject);
// });
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "1257363alamgir@gmail.com",
    pass: "hkkcmqigbomzcibz",
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
