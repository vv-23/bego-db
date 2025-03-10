// Load db config
const db = require("../database/config");
// Load .env variables
require("dotenv").config();
// Util to deep-compare two objects
const lodash = require("lodash");

// Returns all rows of people in bsg_people
const getTrait = async (req, res) => {
  try {
    // Select all rows from the "bsg_people" table
    const query = "SELECT * FROM Traits";
    // Execute the query using the "db" object from the configuration file
    const [rows] = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching trait from the database:", error);
    res.status(500).json({ error: "Error fetching trait" });
  }
};

// Returns a single person by their unique ID from bsg_people
const getTraitByID = async (req, res) => {
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
const createTrait = async (req, res) => {
  try {
    const { traitName, traitValue } = req.body;
    const query =
      "INSERT INTO Traits (traitName, traitValue) VALUES (?, ?)";

    const response = await db.query(query, [
        traitName,
        traitValue,
    ]);
    res.status(201).json(response);
  } catch (error) {
    // Print the error for the dev
    console.error("Error creating trait:", error);
    // Inform the client of the error
    res.status(500).json({ error: "Error creating trait" });
  }
};


const updateTrait = async (req, res) => {
  // Get the person ID
  const traitID = req.params.id;
  // Get the person object
  const newTraits = req.body;

  try {
    const [data] = await db.query(`SELECT * FROM Traits WHERE traitID = ${traitID}`);

    const oldTraits = data[0];

    // If any attributes are not equal, perform update
    if (!lodash.isEqual(newTraits, oldTraits)) {
      const query =
        "UPDATE Traits SET traitName=?, traitValue=? WHERE traitID=?";

      const values = [
        newTraits.traitName,
        newTraits.traitValue,
        traitID
      ];

      // Perform the update
      await db.query(query, values);
      // Inform client of success and return 
      return res.status(200).json({ message: "Traits updated successfully." });
    }

    res.json({ message: "Traits details are the same, no update" });
  } catch (error) {
    console.log("Error updating trait", error);
    res
      .status(500)
      .json({ error: `Error updating the trait with id ${traitID}` });
  }
};

// Endpoint to delete a customer from the database
const deleteTrait = async (req, res) => {
  console.log("Deleting trait with id:", req.params.id);
  const traitID = req.params.id;

  try {
    // Ensure the trait exitst
    const [isExisting] = await db.query(
      "SELECT 1 FROM Traits WHERE traitID = ?",
      [traitID]
    );

    // If the trait doesn't exist, return an error
    if (isExisting.length === 0) {
      return res.status(404).send("Traits not found");
    }

    // Delete related records from the intersection table (see FK contraints bsg_cert_people)
    /*const [response] = await db.query(
      "DELETE FROM bsg_cert_people WHERE pid = ?",
      [traitID]
    );

    console.log(
      "Deleted",
      response.affectedRows,
      "rows from bsg_cert_people intersection table"
    );*/

    // Delete the trait from bsg_people
    await db.query("DELETE FROM Traits WHERE traitID = ?", [traitID]);

    // Return the appropriate status code
    res.status(204).json({ message: "trait deleted successfully" })
  } catch (error) {
    console.error("Error deleting trait from the database:", error);
    res.status(500).json({ error: error.message });
  }
};

// Export the functions as methods of an object
module.exports = {
  getTrait,
  createTrait,
  updateTrait,
  deleteTrait
};
