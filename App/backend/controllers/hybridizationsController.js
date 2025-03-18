// Load db config
const db = require("../database/config");
// Load .env variables
require("dotenv").config();
// Util to deep-compare two objects
const lodash = require("lodash");


const getHybridization = async (req, res) => {
  try {

    const query = `SELECT *, DATE_FORMAT(hybridizationDate, '%Y-%m-%d') as hybridizationDate FROM HybridizationEvents`;
    // Execute the query using the "db" object from the configuration file
    const [rows] = await db.query(query);
    // Send back the rows to the client
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching Hybridization from the database:", error);
    res.status(500).json({ error: "Error fetching Hybridization" });
  }
};

const getHybridizationPretty = async (req, res) => {
    try {

        const query = 
        `SELECT hybridizationID, DATE_FORMAT(hybridizationDate, '%Y-%m-%d') as hybridizationDate, 
            ovary.speciesName as ovaryName, 
            pollen.speciesName AS pollenName, 
            success FROM HybridizationEvents
            LEFT JOIN Species AS ovary ON HybridizationEvents.ovaryID = ovary.speciesID
            LEFT JOIN Species AS pollen ON HybridizationEvents.pollenID = pollen.speciesID;`
        
        // Execute the query using the "db" object from the configuration file
        const [rows] = await db.query(query);
        // Send back the rows to the client
        res.status(200).json(rows);
      } catch (error) {
        console.error("Error fetching Hybridizations from the database:", error);
        res.status(500).json({ error: "Error fetching Hybridizations" });
      }
}

const createHybridization = async (req, res) => {
  try {
    const { date, ovary, pollen, success } = req.body;
    const query =
      "INSERT INTO HybridizationEvents (hybridizationDate, ovaryID, pollenID, success) VALUES (?, ?, ?, ?)";

    const response = await db.query(query, [
        date,
        (ovary == 'N/A' ? null : ovary),
        (pollen == 'N/A' ? null : pollen),
        success
    ]);
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating Hybridization:", error);
    res.status(500).json({ error: "Error creating Hybridization" });
  }
};


const updateHybridization = async (req, res) => {
  const hybridizationID = req.params.id;
  const newHybridization = req.body;

  try {
    const [data] = await db.query(`SELECT * FROM HybridizationEvents WHERE hybridizationID = ${hybridizationID}`);

    const oldHybridization = data[0];

    if (!lodash.isEqual(newHybridization, oldHybridization)) {
      const query =
        "UPDATE HybridizationEvents SET hybridizationDate=?, ovaryID=?, pollenID=?, success=? WHERE hybridizationID=?";

      const values = [
        newHybridization.date,
        newHybridization.ovary,
        newHybridization.pollen,
        newHybridization.success,
        hybridizationID
      ];

      // Perform the update
      await db.query(query, values);
      // Inform client of success and return 
      return res.status(200).json({ message: "Hybridizations updated successfully." });
    }

    res.json({ message: "Hybridizations details are the same, no update" });
  } catch (error) {
    console.log("Error updating Hybridization", error);
    res
      .status(500)
      .json({ error: `Error updating the Hybridization with id ${HybridizationID}` });
  }
};


const deleteHybridization = async (req, res) => {
  console.log("Deleting Hybridization with id:", req.params.id);
  const hybridizationID = req.params.id;

  try {
    // Ensure the Hybridization exitst
    const [isExisting] = await db.query(
      "SELECT 1 FROM HybridizationEvents WHERE hybridizationID = ?",
      [hybridizationID]
    );

    // If the Hybridization doesn't exist, return an error
    if (isExisting.length === 0) {
      return res.status(404).send("Hybridizations not found");
    }
    await db.query("DELETE FROM HybridizationEvents WHERE HybridizationID = ?", [hybridizationID]);

    // Return the appropriate status code
    res.status(204).json({ message: "Hybridization deleted successfully" })
  } catch (error) {
    console.error("Error deleting Hybridization from the database:", error);
    res.status(500).json({ error: error.message });
  }
};

// Export the functions as methods of an object
module.exports = {
  getHybridization,
  getHybridizationPretty,
  createHybridization,
  updateHybridization,
  deleteHybridization
};
