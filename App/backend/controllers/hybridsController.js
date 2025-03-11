// Load db config
const db = require("../database/config");
// Load .env variables
require("dotenv").config();
// Util to deep-compare two objects
const lodash = require("lodash");

// Returns all rows of hybrids
const getHybrids = async (req, res) => {
  try {
    // Select all rows from the "Hybrids" table
    const query = "SELECT * FROM Hybrids";
    // Execute the query using the "db" object from the configuration file
    const [rows] = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching Hybrids from the database:", error);
    res.status(500).json({ error: "Error fetching Hybrids" });
  }
};

// Returns a single person by their unique ID from bsg_people
const getSpeciesByID = async (req, res) => {
  try {
    const personID = req.params.id;
    const query = "SELECT * FROM bsg_people WHERE id = ?";
    const [result] = await db.query(query, [personID]);
    // Check if person was found
    if (result.length === 0) {
      return res.status(404).json({ error: "Person not found" });
    }
    const person = result[0];
    res.json(person);
  } catch (error) {
    console.error("Error fetching person from the database:", error);
    res.status(500).json({ error: "Error fetching person" });
  }
};

// Returns status of creation of new hyb in hybrids
const createHybrid = async (req, res) => {
  try {
    const { hybridizationID, sowDate, germinationDate, flowerDate } = req.body;
    const query =
      "INSERT INTO `Hybrids` (`hybridizationID`,`sowDate`, `germinationDate`,`flowerDate`) VALUES (?, ?, ?, ?)";

    const response = await db.query(query, [
      hybridizationID,
      sowDate,
      germinationDate,
      flowerDate,
    ]);
    res.status(201).json(response);
  } catch (error) {
    // Print the error for the dev
    console.error("Error creating hybrid:", error);
    // Inform the client of the error
    res.status(500).json({ error: "Error creating hybrid" });
  }
};


const updateHybrid = async (req, res) => {
  // Get the hybrid ID
  const hybridID = req.params.id;
  // Get the person object
  const newHybrid = req.body;

  try {
    const [data] = await db.query(`SELECT * FROM Hybrids WHERE hybridID = ${hybridID}`);
    const oldHybrid = data[0];

    // If any attributes are not equal, perform update
    if (!lodash.isEqual(newHybrid, oldHybrid)) {
      const query =
        "UPDATE Hybrids SET hybridizationID=?, sowDate=?, germinationDate=?, flowerDate=? WHERE hybridID=?";

      const values = [
        newHybrid.hybridizationID,
        newHybrid.sowDate,
        newHybrid.germinationDate,
        newHybrid.flowerDate,
        hybridID
      ];

      // Perform the update
      await db.query(query, values);
      // Inform client of success and return 
      return res.status(200).json({ message: "Hybrid updated successfully." });
    }

    res.json({ message: "Hybrid details are the same, no update" });
  } catch (error) {
    console.log("Error updating Hybrid", error);
    res
      .status(500)
      .json({ error: `Error updating the Hybrid with id ${hybridID}` });
  }
};

// Endpoint to delete a customer from the database
const deleteHybrid = async (req, res) => {
  console.log("Deleting hybrid with id:", req.params.id);
  const hybridID = req.params.id;

  try {
    // Ensure the hybrid exists
    const [isExisting] = await db.query(
      "SELECT 1 FROM Hybrids WHERE hybridID = ?", [hybridID]
    );

    // If the Hybrid doesn't exist, return an error
    if (isExisting.length === 0) {
      return res.status(404).send("Hybrid not found");
    }

    // Delete the hybrid
    await db.query("DELETE FROM Hybrids WHERE hybridID = ?", [hybridID]);

      // Return the appropriate status code
      res.status(204).json({ message: "hybrid deleted successfully" })} 
      catch (error) {
        console.error("Error deleting hybrid from the database:", error);
      res.status(500).json({ error: error.message });
  }
};

// Export the functions as methods of an object
module.exports = {
  getHybrids,
  createHybrid,
  updateHybrid,
  deleteHybrid
};
