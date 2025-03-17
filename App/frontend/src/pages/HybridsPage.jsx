import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import BGDataTable from '../components/datatable/BGDatatable';
import HybridsPageForm from '../components/hybridsPageForm/HybridsPageForm';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { HybridizationsContext } from '../components/context/BegoniaContext';
import { fetchData } from '../utils/sharedutils';


const HybridsPage = () => {
    const navigate = useNavigate();
    const [editModalShow, setEditModalShow] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [deleteID, setDeleteID] = useState(null);
    const [hybridRows, setHybridsRows] = useState([]);
    const [hybridizations, setHybridizations] = useState([]);
    const [speciesNames, setSpeciesNames] = useState([]);

    useEffect(() => {
        //fetchHybrids();
        fetchData(`${import.meta.env.VITE_API_URL}/hybrids`, true, setHybridsRows);
        //fetchHybridizations();
        fetchData(`${import.meta.env.VITE_API_URL}/hybridizations/pretty`, false, setHybridizations);
    }, []);

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

        console.log(`/hybrids\n${JSON.stringify(rows)}`);
        console.log(rows);
        setHybridsRows(rows);
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
        const URL = `${import.meta.env.VITE_API_URL}/hybrids/${newHybrid.hybridID}`;
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

    const processTable = (hybridRows, hybridizations) => {
        console.log(hybridRows);
        console.log(hybridizations);
        let processedTable = hybridRows.map((row, index) => {
            let hybridizationID = row[1];
            const hybridization = hybridizations.find((item) => {
                return hybridizationID === item.hybridizationID;
            });
            return [
                row[0],
                hybridizationID,
                hybridization ? (hybridization.ovaryName ? hybridization.ovaryName : 'N/A') : 'N/A',
                hybridization ? (hybridization.pollenName ? hybridization.pollenName : 'N/A') : 'N/A',
                row[2],
                row[3],
                row[4],
            ]
        });
        return processedTable
    }

    // Sample data for the table
    const HybridHeaders = [
        'ID',
        'HE-ID',
        'Mother Plant',
        'Father Plant',
        'Sow Date',
        'Germination Date',
        'Flowering Date',
        'Actions'
    ];

    return (
        <HybridizationsContext.Provider value={hybridizations}>
            <div className="container my-4">
                <h1>Hybrids</h1>
                <BGDataTable headers={HybridHeaders} rows={processTable(hybridRows, hybridizations)} editCallback={handleEditShow} deleteCallback={handleDeleteShow}></BGDataTable>

                <h2 className="mt-4">Add Hybrid</h2>
                <HybridsPageForm mode={"add"} preloadData={{}} submitCallback={handleAddSubmit} />
            </div>
            <Modal size='lg' show={editModalShow} onHide={handleEditClose}>
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
        </HybridizationsContext.Provider>
    );
};

export default HybridsPage;
