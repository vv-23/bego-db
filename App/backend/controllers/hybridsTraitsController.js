// Load db config
const db = require("../database/config");
// Load .env variables
require("dotenv").config();
// Util to deep-compare two objects

const getHybridsTraits = async (req, res) => {
  try {
    const query = `SELECT Hybrids.hybridID, 
      CONCAT(
        HybridizationEvents.hybridizationDate, ' | ', 
        IFNULL(mother.speciesName, 'null'), ' x ', IFNULL(father.speciesName, 'null'),  ' | ', 
        IF(HybridizationEvents.success=1 , 'Success', 'Failed')) as hybridName,
      Traits.traitID, 
      Traits.traitName, 
      Traits.traitValue 
      FROM HybridsTraits
      JOIN Hybrids ON HybridsTraits.hybridID = Hybrids.hybridID
      JOIN HybridizationEvents ON Hybrids.hybridizationID = HybridizationEvents.hybridizationID
      LEFT JOIN Species mother ON HybridizationEvents.ovaryID  = mother.speciesID
      LEFT JOIN Species father ON HybridizationEvents.pollenID = father.speciesID
      JOIN Traits ON HybridsTraits.traitID = Traits.traitID
      ORDER BY Hybrids.hybridID;
    `
    const [rows] = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching hybrid from the database:", error);
    res.status(500).json({ error: "Error fetching hybrid" });
  }
}

// Returns all rows of people in bsg_people
const getHybridsTraitsFormatted = async (req, res) => {
  try {
    // Select all rows from the "bsg_people" table
    const query = `SELECT
    Hybrids.hybridName,
    GROUP_CONCAT(CONCAT (Traits.traitName, ' - ', Traits.traitValue)
                  ORDER BY Traits.traitName, Traits.traitValue SEPARATOR '\n') AS traits FROM HybridsTraits
    
    JOIN Hybrids ON HybridsTraits.hybridID = Hybrids.hybridID
    JOIN Traits ON HybridsTraits.traitID = Traits.traitID

    GROUP BY Hybrids.hybridName;`;
    // Execute the query using the "db" object from the configuration file
    const [rows] = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching hybrid from the database:", error);
    res.status(500).json({ error: "Error fetching hybrid" });
  }
};

// Returns a single person by their unique ID from bsg_people
const getHybridsByID = async (req, res) => {
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
const createHybridTrait = async (req, res) => {
  console.log(`CREATE HybridTrait`);
  console.log(JSON.stringify(req.body));
  try {
    const { hybridID, traitID } = req.body;
    const query = `INSERT INTO HybridsTraits (hybridID, traitID) VALUES (?, ?);`;

    const response = await db.query(query, [
      hybridID,
      traitID,
    ]);
    res.status(201).json(response);
  } catch (error) {
    // Print the error for the dev
    console.error("Error creating hybrid:", error);
    // Inform the client of the error
    res.status(500).json({ error: "Error creating hybrid", errorCode: (error.code || null) });
  }
};


const updateHybridTrait = async (req, res) => {
  console.log(`UPDATE HybridTrait:`);
  console.log(JSON.stringify(req.params));
  console.log(JSON.stringify(req.body));
  // Get the person ID
  const hybridID = req.params.hybridID;
  const traitID = req.params.traitID;
  // Get the person object
  const newHybridsTrait = req.body;
  let response = null;
  try {

    const [isExisting] = await db.query(
      `SELECT * FROM HybridsTraits where hybridID = ${hybridID} AND traitID = ${traitID};`
    );

    // If the hybrid doesn't exist, return an error
    if (isExisting.length === 0) {
      return res.status(404).send("Hybrids not found");
    }

    // If any attributes are not equal, perform update
    const deleteQuery = `DELETE FROM HybridsTraits
              WHERE hybridID = ${hybridID} AND traitID = ${traitID};`
    await db.query(deleteQuery);

    const query = `INSERT INTO HybridsTraits (hybridID, traitID) VALUES (${newHybridsTrait.hybridID}, ${newHybridsTrait.traitID});`;
    response = await db.query(query);
  } catch (error) {
    console.log("Error updating hybrid", error);
    return res
      .status(500)
      .json({ error: `Error updating the hybrid with id ${hybridID}`, errorCode: (error.code || null) });
  }
  return res.status(200).json({ message: "Hybrids updated successfully." });
};

// Endpoint to delete a customer from the database
const deleteHybridTrait = async (req, res) => {
  console.log(`DELETE HybridTrait:`);
  console.log(JSON.stringify(req.params));
  console.log(JSON.stringify(req.body));
  // Get the person ID
  const hybridID = req.params.hybridID;
  const traitID = req.params.traitID;

  try {
    // Ensure the hybrid exitst
    const [isExisting] = await db.query(
      `SELECT * FROM HybridsTraits where hybridID = ${hybridID} AND traitID = ${traitID};`
    );

    // If the hybrid doesn't exist, return an error
    if (isExisting.length === 0) {
      return res.status(404).send("Hybrids not found");
    }

    // Delete related records from the intersection table (see FK contraints bsg_cert_people)
    /*const [response] = await db.query(
      "DELETE FROM bsg_cert_people WHERE pid = ?",
      [hybridID]
    );

    console.log(
      "Deleted",
      response.affectedRows,
      "rows from bsg_cert_people intersection table"
    );*/

    // Delete the hybrid from bsg_people
    
    await db.query(
      `DELETE FROM HybridsTraits WHERE hybridID = ${hybridID} AND traitID = ${traitID};`      
    );

    // Return the appropriate status code
    res.status(204).json({ message: "Hybrids-Trait deleted successfully" })
  } catch (error) {
    console.error("Error deleting Hybrids-Trait from the database:", error);
    res.status(500).json({ error: error.message });
  }
};

// Export the functions as methods of an object
module.exports = {
  getHybridsTraits,
  createHybridTrait,
  updateHybridTrait,
  deleteHybridTrait
};
