// server.js
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/api/res', (req, res) => {
  const resKeys = Object.keys(res); 
  res.json({ resKeys });

  res.json({"resData is:": resData}); // ✅ Use `res.json()` for JSON response
});


app.get('/api/req', (req, res) => {
  const reqKeys = Object.keys(req); 
  res.json({ reqKeys });
});

// to send a file
app.get('/api/file', (req, res) => {
  res.sendFile(__dirname + '/public/file.txt');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});