const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require('./database/config.js');

const app = express();
const PORT = process.env.PORT || 8500;

// Middleware:

// If on FLIP, use cors() middleware to allow cross-origin requests from the frontend with your port number:
// EX (local): http://localhost:5173 
// EX (FLIP/classwork) http://flip3.engr.oregonstate.edu:5173
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());

// API Routes for backend CRUD:
app.use("/species", require("./routes/speciesRoutes"));


// Add your Connect DB Activitiy Code Below:
// ...
// define a new GET request with express:
app.get('/api/diagnostic', async (req, res) => {
  try {
    // Await your database queries here
    await db.pool.query('DROP TABLE IF EXISTS diagnostic;');
    await db.pool.query('CREATE TABLE diagnostic(id INT PRIMARY KEY AUTO_INCREMENT, text VARCHAR(255) NOT NULL);');
    await db.pool.query('INSERT INTO diagnostic (text) VALUES ("MySQL is working!")');
    const results = await db.pool.query('SELECT * FROM diagnostic;');

    // res.json() automatically stringifies the JavaScript object to JSON
    res.json(results);

  } catch (error) {
    // Handle Errors
    console.error('Database operation failed:', error);
    res.status(500).send('Server error');
  }
});


//ADD Data

app.post('/add-species', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let subSection = data.subSection;
    if (isNaN(subSection))
    {
      subSection = 'NULL'
    }

    let chromosomeCount = parseInt(data.chromosomeCount);
    if (isNaN(chromosomeCount))
    {
      chromosomeCount = 'NULL'
    }

    let originCountry = data.originCountry;
    if (isNaN(originCountry))
    {
      originCountry = 'NULL'
    }

    // Create the query and run it on the database
    insertSpecies = `INSERT INTO Species (speciesName,subSection,chromosomeCount,originCountry) VALUES (${data.speciesName}', '${subSection}', ${chromosomeCount}, ${originCountry})`;
    db.pool.query(insertSpecies, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            returnSpecies = "SELECT `speciesID`,`speciesName`,`subSection`,`chromosomeCount`,`originCountry` FROM `Species` ORDER BY speciesName ASC;" ;
            db.pool.query(returnSpecies, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.delete('/delete-species', function(req,res,next){
  let data = req.body;
  let speciesID = parseInt(data.id);
  let deleteSpecies= `DELETE FROM species WHERE id = ?`;


        db.pool.query(deleteSpecies, [speciesID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }
})});

app.put('/update-species', function(req,res,next){
  let data = req.body;

  let chromosomeCount = parseInt(data.chromosomeCount);

  let begonia = parseInt(data.fullname);

  let updateSpecies = `UPDATE species SET 
                          speciesName = ? 
                          subSection = ?
                          chromosomeCount = ?
                          originCountry = ?
                        WHERE speciesID = ?`;
  let selectBegonia = `SELECT * FROM species WHERE id = ?`

        // Run the 1st query
        db.pool.query(updateSpecies, [speciesName, subSection, chromosomeCount, originCountry], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectBegonia, [speciesName], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});
    
// ...
// End Connect DB Activity Code.


const os = require("os");
const hostname = os.hostname();

app.listen(PORT, () => {
  // flip server should automatically match whatever server you're on 
  console.log(`Server running:  http://${hostname}:${PORT}...`);
});
