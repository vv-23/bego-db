import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { SpeciesNamesContext, SpeciesNamesProvider } from '../components/context/BegoniaContext';
import BGDataTable from '../components/datatable/BGDatatable';
import HybridizationsPageForm from '../components/hybridizationsPageForm/HybridizationsPageForm';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { set, useForm } from "react-hook-form";


const HybridizationsPage = () => {
    const navigate = useNavigate()
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    const [hybridizationRows, setHybridizationsRows] = useState([]);
    const [speciesNames, setSpeciesNames] = useState([]);
    useEffect(() => {
        fetchHybridizations();
        fetchSpeciesNames();
    }, []);

    const { register, getValues } = useForm();
    const [editFormInitialValues, setEditFormInitialValues] = useState({
        'ID': null,
        'Date': null,
        'Mother sp.': null,
        'Father sp.': null,
        'Success': null,
    })

    const handleEditClose = () => setEditModalShow(false);
    const handleEditShow = (rowObject) => {
        console.log(`Row object\n${JSON.stringify(rowObject)}`);
        setEditFormInitialValues(rowObject)
        setEditModalShow(true);
    }

    const handleDeleteClose = () => setDeleteModalShow(false);
    const handleDeleteShow = (row) => {
        const hybridizationID = parseInt(row[0]);
        setDeleteModalShow(true);
        setDeleteID(hybridizationID);
    }

    const handleAddSubmit = async (formData) => {
        //console.log(`${formData.name} | ${formData.subsection} | ${formData.chromosomes} | ${formData.originCountry}`);
        console.log(`Add Form:\n${JSON.stringify(formData)}`);
        await addHybridizations(formData);
        await fetchHybridizations();
    }

    const handleEditSubmit = async (formData) => {
        console.log(`Edit Form:\n${JSON.stringify(formData)}`);
        await editHybridizations(formData);
        await fetchHybridizations();
    }

    const handleDelete = async (hybridizationID) => {
        console.log(`Delete Form:\n${hybridizationID}`);
        await deleteHybridizations(hybridizationID);
        await fetchHybridizations();
    }

    const fetchHybridizations = async () => {
        const URL = `${import.meta.env.VITE_API_URL}/hybridizations`;
        let response = await fetch(URL);
        let responseJSON = await response.json();
        let rows = responseJSON.map(obj => Object.values(obj));
        console.log(`/hybridizations\n${JSON.stringify(rows)}`);
        setHybridizationsRows(rows);
        return rows;
    }

    const fetchSpeciesNames = async () => {
        const URL = `${import.meta.env.VITE_API_URL}/species?field=speciesID,speciesName`;
        let response = await fetch(URL);
        let speciesNames = await response.json();
        console.log(`Species names\n${JSON.stringify(speciesNames)}`);
        setSpeciesNames(speciesNames);
        return speciesNames;
    }

    const addHybridizations = async (newHybridization) => {
        const URL = `${import.meta.env.VITE_API_URL}/hybridizations`;
        console.log(URL);
        console.log(JSON.stringify(newHybridization))
        try {
            let response = await fetch(URL, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newHybridization)
            });
            if (response.status === 201) {
                navigate("/hybridizations");
            } else {
                alert("Error creating hybridization");
            }
        } catch (error) {
            alert("Error creating hybridization");
            console.error("Error creating hybridization:", error);
        }
    }

    const editHybridizations = async (newHybridizations) => {
        const URL = `${import.meta.env.VITE_API_URL}/hybridizations/${newHybridizations.id}`;
        console.log(URL);
        try {
            let response = await fetch(URL, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newHybridizations)
            });
            if (response.status === 200) {
                navigate("/hybridizations");
            } else {
                alert("Error editing hybridization");
            }
        } catch (error) {
            alert("Error editing hybridization");
            console.error("Error editing hybridization:", error);
        }
    }

    const deleteHybridizations = async (hybridizationID) => {
        const URL = `${import.meta.env.VITE_API_URL}/hybridizations/${hybridizationID}`;
        console.log(URL);
        try {
            let response = await fetch(URL, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 204) {
                navigate("/hybridizations");
            } else {
                alert("Error deleting hybridization");
            }
        } catch (error) {
            alert("Error deleting hybridization");
            console.error("Error deleting hybridization:", error);
        }
    }

    const processTable = (hybridizationRows, speciesNames) => {
        const speciesMap = speciesNames.reduce((map, {speciesID, speciesName}) => {
            map[speciesID] = speciesName;
            return map;
        }, {});
        let processedTable = hybridizationRows.map((row, index) => {
            const ovarySpecies = speciesMap[Number(row[2])] ? speciesMap[Number(row[2])] : 'N/A';
            const pollenSpecies = speciesMap[Number(row[3])] ? speciesMap[Number(row[3])] : 'N/A';
            return [
                row[0],       // hybridizationID
                row[1],       // hybridizationDate
                ovarySpecies,   // ovary species name
                pollenSpecies,  // pollen species name
                row[4]        // success
              ];
        })
        return processedTable;
    }

    // Sample data for the table
    const hybridizationHeaders = [
        'ID',
        'Date',
        'Mother sp.',
        'Father sp.',
        'Success',
        'Actions'
    ];

    return (
        <SpeciesNamesContext.Provider value={speciesNames}>
            <div className="container my-4">
                <h1>Hybridization Events</h1>
                <BGDataTable headers={hybridizationHeaders} rows={processTable(hybridizationRows, speciesNames)} editCallback={handleEditShow} deleteCallback={handleDeleteShow}></BGDataTable>

                <h2 className="mt-4">Add Hybridizations</h2>
                <HybridizationsPageForm mode={"add"} preloadData={{}} submitCallback={handleAddSubmit} />
            </div>
            <Modal show={editModalShow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Hybridizations</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <HybridizationsPageForm mode={"edit"} preloadData={editFormInitialValues} submitCallback={handleEditSubmit} modalCallback={handleEditClose} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={deleteModalShow} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Hybridizations</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Confirm delete item?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => {
                        handleDelete(deleteID);
                        setDeleteID(null);
                        handleDeleteClose();
                    }}>
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={handleDeleteClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </SpeciesNamesContext.Provider>
    );
};

export default HybridizationsPage;
