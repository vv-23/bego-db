import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import BGDataTable from '../components/datatable/BGDatatable';
import SpeciesTraitsPageForm from '../components/speciesTraitsPageForm/speciesTraitsPageForm';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { SpeciesNamesContext, TraitsContext } from '../components/context/BegoniaContext';
import { fetchData } from '../utils/sharedutils';


const SpeciesTraitsPage = () => {
    const navigate = useNavigate()
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [deleteIDs, setDeleteIDs] = useState({});

    const speciesTraitsURL = `${import.meta.env.VITE_API_URL}/speciesTraits`;
    const [speciesTraitsRows, setSpeciesTraitsRows] = useState([]);

    const traitsURL = `${import.meta.env.VITE_API_URL}/traits`;
    const [traits, setTraits] = useState([]);

    const speciesNamesURL = `${import.meta.env.VITE_API_URL}/species/?fields=speciesID,speciesName`;
    const [speciesNames, setSpeciesNames] = useState([]);

    useEffect(() => {
        fetchData(speciesTraitsURL, true, setSpeciesTraitsRows);
        fetchData(traitsURL, false, setTraits);
        fetchData(speciesNamesURL, false, setSpeciesNames);
    }, []);


    const [editFormInitialValues, setEditFormInitialValues] = useState({
        'Species Name': null,
        'Trait Name': null,
        'Trait Value': null,
    })

    const handleEditClose = () => setEditModalShow(false);
    const handleEditShow = (rowObject) => {
        console.log(`Row object\n${JSON.stringify(rowObject)}`);
        setEditFormInitialValues(rowObject)
        setEditModalShow(true);
    }

    const handleDeleteClose = () => setDeleteModalShow(false);
    const handleDeleteShow = (row) => {
        const deleteIDs = {
            speciesID: parseInt(row[0]),
            traitID: parseInt(row[2]),
        }
        setDeleteModalShow(true);
        setDeleteIDs(deleteIDs);
    }

    const handleAddSubmit = async (formData) => {
        console.log(`Add Form:\n${JSON.stringify(formData)}`);
        await addSpeciesTrait(formData);
        await fetchData(speciesTraitsURL, true, setSpeciesTraitsRows);
    }

    const handleEditSubmit = async (formData) => {
        console.log(`Edit Form:\n${JSON.stringify(formData)}`);
        await editSpeciesTrait(formData);
        await fetchData(speciesTraitsURL, true, setSpeciesTraitsRows);
    }

    const handleDelete = async (deleteIDs) => {
        const { speciesID, traitID } = deleteIDs;
        console.log(`Delete Form:\n${speciesID}-${traitID}`);
        await deleteSpeciesTrait(speciesID, traitID);
        await fetchData(speciesTraitsURL, true, setSpeciesTraitsRows);
    }

    const addSpeciesTrait = async (newSpeciesTrait) => {
        console.log(speciesTraitsURL);
        try {
            let response = await fetch(speciesTraitsURL, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSpeciesTrait)
            });
            if (response.status === 201) {
                navigate("/speciesTraits");
            } else {
                alert("Error creating Species-Trait");
            }
        } catch (error) {
            alert("Error creating Species-Trait");
            console.error("Error creating Species-Trait:", error);
        }
    }

    const editSpeciesTrait = async (data) => {
        const editSpeciesTraitURL = `${speciesTraitsURL}/${data.oldSpeciesID}&${data.oldTraitID}`
        console.log(editSpeciesTraitURL);
        try {
            let response = await fetch(editSpeciesTraitURL, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    speciesID: data.speciesID,
                    traitID: data.traitID
                })
            });
            if (response.status === 200) {
                navigate("/speciesTraits");
            } else {
                alert("Error editing Species-Trait");
            }
        } catch (error) {
            alert("Error editing Species-Trait");
            console.error("Error editing Species-Trait:", error);
        }
    }

    const deleteSpeciesTrait = async (speciesID, traitID) => {
        const deleteSpeciesTraitURL = `${speciesTraitsURL}/${speciesID}&${traitID}`
        console.log(deleteSpeciesTraitURL);
        try {
            let response = await fetch(deleteSpeciesTraitURL, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 204) {
                navigate("/speciesTraits");
            } else {
                alert("Error deleting Species-Trait");
            }
        } catch (error) {
            alert("Error deleting Species-Trait");
            console.error("Error deleting Species-Trait:", error);
        }
    }



    // Sample data for the table
    const speciesTraitHeaders = [
        'Species ID',
        'Species Name',
        'Trait ID',
        'Trait Name',
        'Trait Value',
        'Actions'
    ];

    return (
        <SpeciesNamesContext.Provider value={speciesNames}>
            <TraitsContext.Provider value={traits}>
                <div className="container my-4">
                    <h1>Species Traits</h1>
                    <BGDataTable headers={speciesTraitHeaders} rows={speciesTraitsRows} editCallback={handleEditShow} deleteCallback={handleDeleteShow}></BGDataTable>

                    <h2 className="mt-4">Add Traits</h2>
                    <SpeciesTraitsPageForm mode={"add"} preloadData={{}} submitCallback={handleAddSubmit} />
                </div>
                <Modal show={editModalShow} onHide={handleEditClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Traits</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <SpeciesTraitsPageForm mode={"edit"} preloadData={editFormInitialValues} submitCallback={handleEditSubmit} modalCallback={handleEditClose} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleEditClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={deleteModalShow} onHide={handleDeleteClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Traits</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Confirm delete item?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => {
                            handleDelete(deleteIDs);
                            setDeleteIDs(null);
                            handleDeleteClose();
                        }}>
                            Delete
                        </Button>
                        <Button variant="secondary" onClick={handleDeleteClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </TraitsContext.Provider>
        </SpeciesNamesContext.Provider>
    );
};

export default SpeciesTraitsPage;
