import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import BGDataTable from '../components/datatable/BGDatatable';
import HybridsTraitsPageForm from '../components/forms/HybridsTraitsPageForm';
import Modal from 'react-bootstrap/Modal';
import { Button, Container, Stack, Row, Col } from 'react-bootstrap';
import { HybridsNamesContext, TraitsContext } from '../components/context/BegoniaContext';
import { fetchData } from '../utils/sharedutils';


const HybridsTraitsPage = () => {
    const navigate = useNavigate()
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [deleteIDs, setDeleteIDs] = useState({});

    const hybridsTraitsURL = `${import.meta.env.VITE_API_URL}/hybridsTraits`;
    const [hybridsTraitsRows, setHybridsTraitsRows] = useState([]);

    const traitsURL = `${import.meta.env.VITE_API_URL}/traits`;
    const [traits, setTraits] = useState([]);

    const hybridsNamesURL = `${import.meta.env.VITE_API_URL}/hybrids/names`;
    const [hybridsNames, setHybridsNames] = useState([]);

    useEffect(() => {
        fetchData(hybridsTraitsURL, true, setHybridsTraitsRows);
        fetchData(traitsURL, false, setTraits);
        fetchData(hybridsNamesURL, false, setHybridsNames);
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
        await addHybridTrait(formData);
        await fetchData(hybridsTraitsURL, true, setHybridsTraitsRows);
    }

    const handleEditSubmit = async (formData) => {
        console.log(`Edit Form:\n${JSON.stringify(formData)}`);
        await editHybridTrait(formData);
        await fetchData(hybridsTraitsURL, true, setHybridsTraitsRows);
    }

    const handleDelete = async (deleteIDs) => {
        const { speciesID, traitID } = deleteIDs;
        console.log(`Delete Form:\n${speciesID}-${traitID}`);
        await deleteHybridTrait(speciesID, traitID);
        await fetchData(hybridsTraitsURL, true, setHybridsTraitsRows);
    }

    const addHybridTrait = async (newHybridTrait) => {
        console.log(newHybridTrait);
        console.log(hybridsTraitsURL);
        try {
            let response = await fetch(hybridsTraitsURL, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newHybridTrait)
            });
            if (response.status === 201) {
                navigate("/hybridsTraits");
            } else {
                alert("Error creating Species-Trait");
            }
        } catch (error) {
            alert("Error creating Species-Trait");
            console.error("Error creating Species-Trait:", error);
        }
    }

    const editHybridTrait = async (data) => {
        const editHybridTraitURL = `${hybridsTraitsURL}/${data.oldHybridID}&${data.oldTraitID}`
        console.log(editHybridTraitURL);
        try {
            let response = await fetch(editHybridTraitURL, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hybridID: data.hybridID,
                    traitID: data.traitID
                })
            });
            if (response.status === 200) {
                navigate("/hybridsTraits");
            } else {
                alert("Error editing Species-Trait");
            }
        } catch (error) {
            alert("Error editing Species-Trait");
            console.error("Error editing Species-Trait:", error);
        }
    }

    const deleteHybridTrait = async (speciesID, traitID) => {
        const deleteHybridTraitURL = `${hybridsTraitsURL}/${speciesID}&${traitID}`
        console.log(deleteHybridTraitURL);
        try {
            let response = await fetch(deleteHybridTraitURL, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 204) {
                navigate("/hybridsTraits");
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
        'Hybrid ID',
        'Hybrid Name',
        'Trait ID',
        'Trait Name',
        'Trait Value',
        'Actions'
    ];

    return (
        <HybridsNamesContext.Provider value={hybridsNames}>
            <TraitsContext.Provider value={traits}>
                <Container className='my-4'>
                    <Stack gap={2}>
                        <Container>
                            <h1 className='text-center'>Hybrids Traits</h1>
                        </Container>
                        <Container>
                            <BGDataTable
                                headers={speciesTraitHeaders}
                                rows={hybridsTraitsRows}
                                editCallback={handleEditShow}
                                deleteCallback={handleDeleteShow}
                                columnSettings={[
                                    { className: "dt-center", targets: "_all" },
                                    { width: "40%", targets: 1 }
                                ]}
                            ></BGDataTable>
                        </Container>
                        <Container>
                            <h2 className="text-center">Add Hybrid-Trait</h2>
                        </Container>
                        <Container className="justify-content-md-center">
                            <Row>
                                <Col></Col>
                                <Col className='col-6'>
                                    <HybridsTraitsPageForm mode={"add"} preloadData={{}} submitCallback={handleAddSubmit} />
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
                        <HybridsTraitsPageForm mode={"edit"} preloadData={editFormInitialValues} submitCallback={handleEditSubmit} modalCallback={handleEditClose} />
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
        </HybridsNamesContext.Provider>
    );
};

export default HybridsTraitsPage;
