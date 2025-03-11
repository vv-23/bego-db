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


// Add your Connect DB Activitiy Code Below:
// ...
// define a new GET request with express:
// SAMPLE PROVIDED BY CLASS -- USE FOR YOURSELF TO TEST
app.get('/', async (req, res) => {

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
    

app.post('/add-hybrid', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    //let hybridizationID = data.hybridizationID

    // Capture NULL values
    let sowDate = data.sowDate;
    if (isNaN(sowDate)){ sowDate = 'NULL'}

    let germinationDate = parseInt(data.germinationDate);
    if (isNaN(germinationDate)) {germinationDate = 'NULL'}

    let flowerDate = data.flowerDate;
    if (isNaN(flowerDate)) {flowerDate = 'NULL'}

    // Create the query and run it on the database
    insertHybrid = `INSERT INTO Hybrids (hybridizationID,sowDate,germinationDate,flowerDate) VALUES (${data.hybridizationID}', '${sowDate}', ${germinationDate}, ${flowerDate})`;
    db.pool.query(insertHybrid, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            returnHybrids = "SELECT Hybrids.hybridID, mother.speciesName AS motherPlant, father.speciesName AS fatherPlant, Hybrids.sowDate, Hybrids.germinationDate, Hybrids.flowerDate FROM Hybrids JOIN HybridizationEvents ON Hybrids.hybridizationID = HybridizationEvents.hybridizationID JOIN Species mother ON HybridizationEvents.ovaryID  = mother.speciesID JOIN Species father ON HybridizationEvents.pollenID = father.speciesID;" ;
            db.pool.query(returnHybrids, function(error, rows, fields){

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

app.put('/update-hybrid', function(req,res,next){
  let data = req.body;

  let hybrid = parseInt(data.hybridID);
  // Capture NULL values
  let sowDate = data.sowDate;
  if (isNaN(sowDate)){ sowDate = 'NULL'}

  let germinationDate = parseInt(data.germinationDate);
  if (isNaN(germinationDate)) {germinationDate = 'NULL'}

  let flowerDate = data.flowerDate;
  if (isNaN(flowerDate)) {flowerDate = 'NULL'}

  let updateHybrid = `UPDATE  Hybrids SET hybridizationID = ?,
                        sowDate  = ?, 
                        germinationDate = ?, 
                        flowerDate = ? WHERE 
                      hybridID = :hybridID;`;
  let selectHybrid = `SELECT * FROM hybrids WHERE hybridizationID = ?`

        // Run the 1st query
        db.pool.query(updateHybrid, [hybridizationID, sowDate, germinationDate, flowerDate], function(error, rows, fields){
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
                db.pool.query(selectHybrid, [hybrid], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

//DEL Hybrid
app.delete('/delete-hybrid', function(req,res,next){
  let data = req.body;
  let hybridID = parseInt(data.id);
  let deleteHybrid= `DELETE FROM Hybrids WHERE id = ?`;


        db.pool.query(deleteHybrid, [hybridID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
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
