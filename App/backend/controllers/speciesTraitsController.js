// Load db config
const db = require("../database/config");
// Load .env variables
require("dotenv").config();
// Util to deep-compare two objects

const getSpeciesTraits = async (req, res) => {
  try {
    const query = `SELECT Species.speciesID, Species.speciesName, Traits.traitID, Traits.traitName, Traits.traitValue FROM SpeciesTraits
      JOIN Species ON SpeciesTraits.speciesID = Species.speciesID
      JOIN Traits ON SpeciesTraits.traitID = Traits.traitID
      ORDER BY Species.speciesID;;  
    `
    const [rows] = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching species from the database:", error);
    res.status(500).json({ error: "Error fetching species" });
  }
}

// Returns all rows of people in bsg_people
const getSpeciesTraitsFormatted = async (req, res) => {
  try {
    // Select all rows from the "bsg_people" table
    const query = `SELECT
    Species.speciesName,
    GROUP_CONCAT(CONCAT (Traits.traitName, ' - ', Traits.traitValue)
                  ORDER BY Traits.traitName, Traits.traitValue SEPARATOR '\n') AS traits FROM SpeciesTraits
    
    JOIN Species ON SpeciesTraits.speciesID = Species.speciesID
    JOIN Traits ON SpeciesTraits.traitID = Traits.traitID

    GROUP BY Species.speciesName;`;
    // Execute the query using the "db" object from the configuration file
    const [rows] = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching species from the database:", error);
    res.status(500).json({ error: "Error fetching species" });
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

// Returns status of creation of new person in bsg_people
const createSpeciesTrait = async (req, res) => {
  console.log(`CREATE SpeciesTrait`);
  console.log(JSON.stringify(req.body));
  try {
    const { speciesID, traitID } = req.body;
    const query = `INSERT INTO SpeciesTraits (speciesID, traitID) VALUES (?, ?);`;

    const response = await db.query(query, [
      speciesID,
      traitID,
    ]);
    res.status(201).json(response);
  } catch (error) {
    // Print the error for the dev
    console.error("Error creating species:", error);
    // Inform the client of the error
    res.status(500).json({ error: "Error creating species", errorCode: (error.code || null) });
  }
};


const updateSpeciesTrait = async (req, res) => {
  console.log(`UPDATE SpeciesTrait:`);
  console.log(JSON.stringify(req.params));
  console.log(JSON.stringify(req.body));
  // Get the person ID
  const speciesID = req.params.speciesID;
  const traitID = req.params.traitID;
  // Get the person object
  const newSpeciesTrait = req.body;
  let response = null;
  try {

    const [isExisting] = await db.query(
      `SELECT * FROM SpeciesTraits where speciesID = ${speciesID} AND traitID = ${traitID};`
    );

    // If the species doesn't exist, return an error
    if (isExisting.length === 0) {
      return res.status(404).send("Species not found");
    }

    // If any attributes are not equal, perform update
    const deleteQuery = `DELETE FROM SpeciesTraits
              WHERE speciesID = ${speciesID} AND traitID = ${traitID};`
    await db.query(deleteQuery);

    const query = `INSERT INTO SpeciesTraits (speciesID, traitID) VALUES (${newSpeciesTrait.speciesID}, ${newSpeciesTrait.traitID});`;
    response = await db.query(query);
  } catch (error) {
    console.log("Error updating species", error);
    return res
      .status(500)
      .json({ error: `Error updating the species with id ${speciesID}`, errorCode: (error.code || null) });
  }
  return res.status(200).json({ message: "Species updated successfully." });
};

// Endpoint to delete a customer from the database
const deleteSpeciesTrait = async (req, res) => {
  console.log(`DELETE SpeciesTrait:`);
  console.log(JSON.stringify(req.params));
  console.log(JSON.stringify(req.body));
  // Get the person ID
  const speciesID = req.params.speciesID;
  const traitID = req.params.traitID;

  try {
    // Ensure the species exitst
    const [isExisting] = await db.query(
      `SELECT * FROM SpeciesTraits where speciesID = ${speciesID} AND traitID = ${traitID};`
    );

    // If the species doesn't exist, return an error
    if (isExisting.length === 0) {
      return res.status(404).send("Species not found");
    }

    // Delete related records from the intersection table (see FK contraints bsg_cert_people)
    /*const [response] = await db.query(
      "DELETE FROM bsg_cert_people WHERE pid = ?",
      [speciesID]
    );

    console.log(
      "Deleted",
      response.affectedRows,
      "rows from bsg_cert_people intersection table"
    );*/

    // Delete the species from bsg_people
    
    await db.query(
      `DELETE FROM SpeciesTraits WHERE speciesID = ${speciesID} AND traitID = ${traitID};`      
    );

    // Return the appropriate status code
    res.status(204).json({ message: "Species-Trait deleted successfully" })
  } catch (error) {
    console.error("Error deleting Species-Trait from the database:", error);
    res.status(500).json({ error: error.message });
  }
};

// Export the functions as methods of an object
module.exports = {
  getSpeciesTraits,
  createSpeciesTrait,
  updateSpeciesTrait,
  deleteSpeciesTrait
};
