const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require('./database/config.js');

const app = express();
const PORT = process.env.PORT || 3300;
// EX (local): http://localhost:3300 
// Middleware:

// If on FLIP, use cors() middleware to allow cross-origin requests from the frontend with your port number:

// EX (FLIP/classwork) http://flip3.engr.oregonstate.edu:5173
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());

// API Routes for backend CRUD:

// app.use((req, res, next) => {
//   res.setHeader("Cache-Control", "no-store");
//   next();
// });

app.use("/species", require("./routes/speciesRoutes"));
app.use("/hybrids", require("./routes/hybridsRoutes.js"));
app.use("/traits", require("./routes/traitsRoutes"));
app.use("/hybridizations", require("./routes/hybridizationsRoutes"));



// Add your Connect DB Activitiy Code Below:
// ...
// define a new GET request with express:
// SAMPLE PROVIDED BY CLASS -- USE FOR YOURSELF TO TEST
app.get('/', async (req, res) => {

});


const os = require("os");
const hostname = os.hostname();

app.listen(PORT, () => {
  // flip server should automatically match whatever server you're on 
  console.log(`Server running:  http://${hostname}:${PORT}...`);
});
