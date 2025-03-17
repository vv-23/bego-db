import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import BGDataTable from '../components/datatable/BGDatatable';
import TraitsPageForm from '../components/traitsPageForm/TraitsPageForm';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { SpeciesNamesContext, TraitsContext } from '../components/context/BegoniaContext';
import { fetchData } from '../utils/sharedutils';


const SpeciesTraitsPage = () => {
    const navigate = useNavigate()
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [deleteID, setDeleteID] = useState(null);

    const speciesTraitsURL = `${import.meta.env.VITE_API_URL}/speciesTraits`;
    const [speciesTraitsRows, setSpeciesTraitsRows] = useState([]);

    const traitsURL = `${import.meta.env.VITE_API_URL}/traits`;
    const [traits, setTraits] = useState([]);

    const speciesNamesURL = `${import.meta.env.VITE_API_URL}/speciesTraits`;
    const [speciesNames, setSpeciesNames] = useState([]);

    useEffect(() => {
        fetchData(speciesTraitsURL, true, setSpeciesTraitsRows);
        fetchData(traitsURL, false, setTraits);
        fetchData(speciesNamesURL, setSpeciesNames);
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
    const handleDeleteShow = (traitID) => {
        setDeleteModalShow(true);
        setDeleteID(traitID);
    }

    const handleAddSubmit = async (formData) => {
        //console.log(`${formData.name} | ${formData.subsection} | ${formData.chromosomes} | ${formData.originCountry}`);
        console.log(`Add Form:\n${JSON.stringify(formData)}`);
        await addTraits(formData);
        await fetchData(speciesTraitsURL, true, speciesTraitsURL);
    }

    const handleEditSubmit = async (formData) => {
        console.log(`Edit Form:\n${JSON.stringify(formData)}`);
        await editTraits(formData);
        await fetchData(speciesTraitsURL, true, speciesTraitsURL);
    }

    const handleDelete = async (traitID) => {
        console.log(`Delete Form:\n${traitID}`);
        await deleteTraits(traitID);
        await fetchData(speciesTraitsURL, true, speciesTraitsURL);
    }

    const addTraits = async (newTraits) => {
        const URL = `${import.meta.env.VITE_API_URL}/traits`;
        console.log(URL);
        try {
            let response = await fetch(URL, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTraits)
            });
            if (response.status === 201) {
                navigate("/traits");
            } else {
                alert("Error creating trait");
            }
        } catch (error) {
            alert("Error creating trait");
            console.error("Error creating trait:", error);
        }
    }

    const editTraits = async (newTraits) => {
        const URL = `${import.meta.env.VITE_API_URL}/traits/${newTraits.id}`;
        console.log(URL);
        try {
            let response = await fetch(URL, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTraits)
            });
            if (response.status === 200) {
                navigate("/traits");
            } else {
                alert("Error editing trait");
            }
        } catch (error) {
            alert("Error editing trait");
            console.error("Error editing trait:", error);
        }
    }

    const deleteTraits = async (traitID) => {
        const URL = `${import.meta.env.VITE_API_URL}/traits/${traitID}`;
        console.log(URL);
        try {
            let response = await fetch(URL, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 204) {
                navigate("/traits");
            } else {
                alert("Error deleting trait");
            }
        } catch (error) {
            alert("Error deleting trait");
            console.error("Error deleting trait:", error);
        }
    }



    // Sample data for the table
    const speciesTraitHeaders = [
        'Species Name',
        'Trait Name',
        'Trait Value',
        'Actions'
    ];

    return (
        <>
            <div className="container my-4">
                <h1>Species Traits</h1>
                <BGDataTable headers={speciesTraitHeaders} rows={speciesTraitsRows} editCallback={handleEditShow} deleteCallback={handleDeleteShow}></BGDataTable>

                <h2 className="mt-4">Add Traits</h2>
                <TraitsPageForm mode={"add"} preloadData={{}} submitCallback={handleAddSubmit} />
            </div>
            <Modal show={editModalShow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Traits</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TraitsPageForm mode={"edit"} preloadData={editFormInitialValues} submitCallback={handleEditSubmit} modalCallback={handleEditClose} />
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
        </>
    );
};

export default SpeciesTraitsPage;
