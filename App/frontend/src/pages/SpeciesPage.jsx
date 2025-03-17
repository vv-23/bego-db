import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import BGDataTable from '../components/datatable/BGDatatable';
import SpeciesPageForm from '../components/speciesPageForm/SpeciesPageForm';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { set, useForm } from "react-hook-form";


const SpeciesPage = () => {
    const navigate = useNavigate()
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    useEffect(() => {
        fetchSpecies();
    }, []);

    const { register, getValues } = useForm();
    const [editFormInitialValues, setEditFormInitialValues] = useState({
        'ID': null,
        'Name': null,
        'Subsection': null,
        'Chromosome Count': null,
        'Origin Country': null,
    })

    const handleEditClose = () => setEditModalShow(false);
    const handleEditShow = (rowObject) => {
        console.log(`Row object\n${JSON.stringify(rowObject)}`);
        setEditFormInitialValues(rowObject)
        setEditModalShow(true);
    }

    const handleDeleteClose = () => setDeleteModalShow(false);
    const handleDeleteShow = (row) => {
        const speciesID = parseInt(row[0]);
        setDeleteModalShow(true);
        setDeleteID(speciesID);
    }

    const handleAddSubmit = async (formData) => {
        //console.log(`${formData.name} | ${formData.subsection} | ${formData.chromosomes} | ${formData.originCountry}`);
        console.log(`Add Form:\n${JSON.stringify(formData)}`);
        await addSpecies(formData);
        await fetchSpecies();
    }

    const handleEditSubmit = async (formData) => {
        console.log(`Edit Form:\n${JSON.stringify(formData)}`);
        await editSpecies(formData);
        await fetchSpecies();
    }

    const handleDelete = async (speciesID) => {
        console.log(`Delete Form:\n${speciesID}`);
        await deleteSpecies(speciesID);
        await fetchSpecies();
    }

    const fetchSpecies = async () => {
        const URL = `${import.meta.env.VITE_API_URL}/species`;
        let response = await fetch(URL);
        let responseJSON = await response.json();
        let rows = responseJSON.map(obj => Object.values(obj));
        console.log(`/species\n${JSON.stringify(rows)}`);
        setSpeciesRows(rows);
        return rows;
    }


    const addSpecies = async (newSpecies) => {
        const URL = `${import.meta.env.VITE_API_URL}/species`;
        console.log(URL);
        try {
            let response = await fetch(URL, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSpecies)
            });
            if (response.status === 201) {
                navigate("/species");
            } else {
                alert("Error creating species");
            }
        } catch (error) {
            alert("Error creating species");
            console.error("Error creating species:", error);
        }
    }    //ADD

    const editSpecies = async (newSpecies) => {
        const URL = `${import.meta.env.VITE_API_URL}/species/${newSpecies.id}`;
        console.log(URL);
        try {
            let response = await fetch(URL, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSpecies)
            });
            if (response.status === 200) {
                navigate("/species");
            } else {
                alert("Error editing species");
            }
        } catch (error) {
            alert("Error editing species");
            console.error("Error editing species:", error);
        }
    }

    const deleteSpecies = async (speciesID) => {
        const URL = `${import.meta.env.VITE_API_URL}/species/${speciesID}`;
        console.log(URL);
        try {
            let response = await fetch(URL, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 204) {
                navigate("/species");
            } else {
                alert("Error deleting species");
            }
        } catch (error) {
            alert("Error deleting species");
            console.error("Error deleting species:", error);
        }
    }


    // Sample data for the table
    const speciesHeaders = [
        'ID',
        'Name',
        'Subsection',
        'Chromosome Count',
        'Origin Country',
        'Actions'
    ];
    const [speciesRows, setSpeciesRows] = useState([]);
    `[
        ['1', 'Begonia hitchcockii', 'Gobenia', '22', 'Ecuador'],
        ['2', 'Begonia pearcei', 'Petermannia', '24', 'Ecuador'],
        ['3', 'Begonia tenuissima', 'Petermannia', '20', 'Borneo'],
        ['4', 'Begonia decora', 'Platycentrum', '26', 'Malaysia'],
        ['5', 'Begonia dodsonii', 'Gobenia', '22', 'Ecuador'],
        ['6', 'Begonia lichenora', 'Platycentrum', '14', 'Borneo'],
        ['7', 'Begonia luzhaiensis', 'Coleocentrum', '20', 'China'],
    ];`

    return (
        <>
            <div className="container my-4">
                <h1>Species</h1>
                <BGDataTable headers={speciesHeaders} rows={speciesRows} editCallback={handleEditShow} deleteCallback={handleDeleteShow}></BGDataTable>

                <h2 className="mt-4">Add Species</h2>
                <SpeciesPageForm mode={"add"} preloadData={{}} submitCallback={handleAddSubmit} />
            </div>
            <Modal show={editModalShow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Species</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SpeciesPageForm mode={"edit"} preloadData={editFormInitialValues} submitCallback={handleEditSubmit} modalCallback={handleEditClose}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={deleteModalShow} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Species</Modal.Title>
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

export default SpeciesPage;
