// Load db config
const db = require("../database/config");
// Load .env variables
require("dotenv").config();
// Util to deep-compare two objects
const lodash = require("lodash");

// Returns all rows of people in bsg_people
const getSpecies = async (req, res) => {
  try {
    // Select all rows from the "bsg_people" table
    const query = "SELECT * FROM Species";
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
const createSpecies = async (req, res) => {
  try {
    const { name, subsection, chromosomes, originCountry } = req.body;
    const query =
      "INSERT INTO Species (speciesName, subSection, chromosomeCount, originCountry) VALUES (?, ?, ?, ?)";

    const response = await db.query(query, [
      name,
      subsection,
      parseInt(chromosomes),
      originCountry,
    ]);
    res.status(201).json(response);
  } catch (error) {
    // Print the error for the dev
    console.error("Error creating species:", error);
    // Inform the client of the error
    res.status(500).json({ error: "Error creating species" });
  }
};


const updateSpecies = async (req, res) => {
  // Get the person ID
  const speciesID = req.params.id;
  // Get the person object
  const newSpecies = req.body;

  try {
    const [data] = await db.query(`SELECT * FROM Species WHERE speciesID = ${speciesID}`);

    const oldSpecies = data[0];

    // If any attributes are not equal, perform update
    if (!lodash.isEqual(newSpecies, oldSpecies)) {
      const query =
        "UPDATE Species SET speciesName=?, subSection=?, chromosomeCount=?, originCountry=? WHERE speciesID=?";

      const values = [
        newSpecies.name,
        newSpecies.subsection,
        parseInt(newSpecies.chromosomes),
        newSpecies.originCountry,
        speciesID
      ];

      // Perform the update
      await db.query(query, values);
      // Inform client of success and return 
      return res.status(200).json({ message: "Species updated successfully." });
    }

    res.json({ message: "Species details are the same, no update" });
  } catch (error) {
    console.log("Error updating species", error);
    res
      .status(500)
      .json({ error: `Error updating the species with id ${speciesID}` });
  }
};

// Endpoint to delete a customer from the database
const deleteSpecies = async (req, res) => {
  console.log("Deleting species with id:", req.params.id);
  const speciesID = req.params.id;

  try {
    // Ensure the species exitst
    const [isExisting] = await db.query(
      "SELECT 1 FROM Species WHERE speciesID = ?",
      [speciesID]
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
    await db.query("DELETE FROM species WHERE speciesID = ?", [speciesID]);

    // Return the appropriate status code
    res.status(204).json({ message: "species deleted successfully" })
  } catch (error) {
    console.error("Error deleting species from the database:", error);
    res.status(500).json({ error: error.message });
  }
};

// Export the functions as methods of an object
module.exports = {
  getSpecies,
  createSpecies,
  updateSpecies,
  deleteSpecies
};
