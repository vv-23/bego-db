import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import BGDataTable from '../components/datatable/BGDatatable';
import HybridsPageForm from '../components/hybridsPageForm/HybridsPageForm';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { set, useForm } from "react-hook-form";


const HybridsPage = () => {
    const navigate = useNavigate()
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    useEffect(() => {
        fetchHybrids();
    }, []);

    const { register, getValues } = useForm();
    const [editFormInitialValues, setEditFormInitialValues] = useState({
        'hybridID': null,
        'hybridizationID': null,
        'sowDate': null,
        'germinationDate': null,
        'flowerDate': null
    })

    const handleEditClose = () => setEditModalShow(false);
    const handleEditShow = (rowObject) => {
        console.log(`Row object\n${JSON.stringify(rowObject)}`);
        setEditFormInitialValues(rowObject)
        setEditModalShow(true);
    }

    const handleDeleteClose = () => setDeleteModalShow(false);
    const handleDeleteShow = (hybridID) => {
        setDeleteModalShow(true);
        setDeleteID(hybridID);
    }

    const handleAddSubmit = async (formData) => {
        //console.log(`${formData.name} | ${formData.subsection} | ${formData.chromosomes} | ${formData.originCountry}`);
        console.log(`Add Form:\n${JSON.stringify(formData)}`);
        await addHybrid(formData);
        await fetchHybrids();
    }

    const handleEditSubmit = async (formData) => {
        console.log(`Edit Form:\n${JSON.stringify(formData)}`);
        await editHybrid(formData);
        await fetchHybrids();
    }

    const handleDelete = async (hybridID) => {
        console.log(`Delete Form:\n${hybridID}`);
        await deleteHybrid(hybridID);
        await fetchHybrids();
    }

    const fetchHybrids = async () => {
        const URL = `${import.meta.env.VITE_API_URL}/hybrids`;
        let response = await fetch(URL);
        let responseJSON = await response.json();
        let rows = responseJSON.map(obj => Object.values(obj));


        const formattedRows = rows.map(row => {
            return [
                row[0],  // ID
                row[1],  // mom
                row[2],  // dad
                row[3] ? row[3].split("T")[0] : null,  // Format sow date
                row[4] ? row[4].split("T")[0] : null,  // Format germination date
                row[5] ? row[4].split("T")[0] : null   // Format flowering date
            ];
        });
        //T08:00:00.000Z

        console.log(`/hybrids\n${JSON.stringify(rows)}`);
        setHybridsRows(formattedRows);
        return formattedRows;
    }

    const addHybrid = async (newHybrid) => {
        const URL = `${import.meta.env.VITE_API_URL}/hybrids`;
        console.log(URL);
        try {
            let response = await fetch(URL, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newHybrid)
            });
            if (response.status === 201) {
                navigate("/hybrids");
            } else {
                alert("Error creating hybrid");
            }
        } catch (error) {
            alert("Error creating hybrid");
            console.error("Error creating hybrid:", error);
        }
    }

    const editHybrid = async (newHybrid) => {
        const URL = `${import.meta.env.VITE_API_URL}/hybrids/${newHybrid.id}`;
        console.log(URL);
        try {
            let response = await fetch(URL, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newHybrid)
            });
            if (response.status === 200) {
                navigate("/hybrids");
            } else {
                alert("Error editing hybrid");
            }
        } catch (error) {
            alert("Error editing hybrid");
            console.error("Error editing hybrid:", error);
        }
    }

    const deleteHybrid = async (hybridID) => {
        const URL = `${import.meta.env.VITE_API_URL}/hybrids/${hybridID}`;
        console.log(URL);
        try {
            let response = await fetch(URL, {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status === 204) {
                navigate("/hybrids");
            } else {
                alert("Error deleting hybrid");
            }
        } catch (error) {
            alert("Error deleting hybrid");
            console.error("Error deleting hybrid:", error);
        }
    }

    // Sample data for the table
    const HybridHeaders = [
        'ID',
        'Mother Plant',
        'Father Plant',
        'Sow Date',
        'Germination Date',
        'Flowering Date',
        'Actions'
    ];
    const [hybridRows, setHybridsRows] = useState([]);

    return (
        <>
            <div className="container my-4">
                <h1>Hybrids</h1>
                <BGDataTable headers={HybridHeaders} rows={hybridRows} editCallback={handleEditShow} deleteCallback={handleDeleteShow}></BGDataTable>

                <h2 className="mt-4">Add Hybrid</h2>
                <HybridsPageForm mode={"add"} preloadData={{}} submitCallback={handleAddSubmit} />
            </div>
            <Modal show={editModalShow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Hybrid</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <HybridsPageForm mode={"edit"} preloadData={editFormInitialValues} submitCallback={handleEditSubmit} modalCallback={handleEditClose}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={deleteModalShow} onHide={handleDeleteClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Hybrid</Modal.Title>
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

export default HybridsPage;
