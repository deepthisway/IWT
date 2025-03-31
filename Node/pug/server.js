const express = require("express");
const app = express();

app.set("view engine", "pug");

app.get("/", (req, res) => {
  res.render("index", { title: "Pug Example", message: "Hello, Pug!" });
});

// Start server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
