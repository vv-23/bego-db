import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import BGDataTable from '../components/datatable/BGDatatable';
import TraitsPageForm from '../components/traitsPageForm/TraitsPageForm';
import Modal from 'react-bootstrap/Modal';
import { Button, Container, Stack, Row, Col } from 'react-bootstrap';
import { set, useForm } from "react-hook-form";


const TraitsPage = () => {
    const navigate = useNavigate()
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    useEffect(() => {
        fetchTraits();
    }, []);

    const { register, getValues } = useForm();
    const [editFormInitialValues, setEditFormInitialValues] = useState({
        'ID': null,
        'Name': null,
        'Value': null,
    })

    const handleEditClose = () => setEditModalShow(false);
    const handleEditShow = (rowObject) => {
        console.log(`Row object\n${JSON.stringify(rowObject)}`);
        setEditFormInitialValues(rowObject)
        setEditModalShow(true);
    }

    const handleDeleteClose = () => setDeleteModalShow(false);
    const handleDeleteShow = (row) => {
        const traitID = parseInt(row[0]);
        setDeleteModalShow(true);
        setDeleteID(traitID);
    }

    const handleAddSubmit = async (formData) => {
        //console.log(`${formData.name} | ${formData.subsection} | ${formData.chromosomes} | ${formData.originCountry}`);
        console.log(`Add Form:\n${JSON.stringify(formData)}`);
        await addTraits(formData);
        await fetchTraits();
    }

    const handleEditSubmit = async (formData) => {
        console.log(`Edit Form:\n${JSON.stringify(formData)}`);
        await editTraits(formData);
        await fetchTraits();
    }

    const handleDelete = async (traitID) => {
        console.log(`Delete Form:\n${traitID}`);
        await deleteTraits(traitID);
        await fetchTraits();
    }

    const fetchTraits = async () => {
        const URL = `${import.meta.env.VITE_API_URL}/traits`;
        let response = await fetch(URL);
        let responseJSON = await response.json();
        let rows = responseJSON.map(obj => Object.values(obj));
        console.log(`/traits\n${JSON.stringify(rows)}`);
        setTraitsRows(rows);
        return rows;
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
    const traitHeaders = [
        'ID',
        'Name',
        'Value',
        'Actions'
    ];
    const [traitRows, setTraitsRows] = useState([]);
    `[
        ["1", "Leaf Color", "yellow"],
        ["2", "Leaf Color", "red"],
        ["3", "Leaf Size", "large"],
        ["4", "Leaf Size", "medium"],
        ["5", "Leaf Size", "small"],
        ["6", "Growth Habit", "vining"],
        ["7", "Growth Habit", "tuberous"],
        ["8", "Disease Resistance", "high"],
        ["9", "Disease Resistance", "medium"],
        ["10", "Disease Resistance", "low"]
    ];`

    return (
        <>
            <Container className='my-4'>
                <Stack gap={2}>
                    <Container>
                        <h1 className='text-center'>Traits</h1>
                    </Container>
                    <Container>
                        <BGDataTable
                            headers={traitHeaders}
                            rows={traitRows}
                            editCallback={handleEditShow}
                            deleteCallback={handleDeleteShow}
                        ></BGDataTable>
                    </Container>
                    <Container>
                        <h2 className="text-center">Add Traits</h2>
                    </Container>
                    <Container className="justify-content-md-center">
                        <Row>
                            <Col></Col>
                            <Col className='col-6'>
                                <TraitsPageForm mode={"add"} preloadData={{}} submitCallback={handleAddSubmit} />
                            </Col>
                            <Col></Col>
                        </Row>
                    </Container>
                </Stack>
            </Container>

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

export default TraitsPage;
