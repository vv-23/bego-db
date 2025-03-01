import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import BGDataTable from '../components/datatable/BGDatatable';
import SpeciesPageForm from '../components/speciesPageForm/SpeciesPageForm';
import Modal from 'react-bootstrap/Modal';
import { Button } from 'react-bootstrap';
import { useForm } from "react-hook-form";


const SpeciesPage = () => {
    const [modalShow, setModalShow] = useState(false);

    const { register, getValues } = useForm();
    const [editFormInitialValues, setEditFormInitialValues] = useState({
        'ID': null,
        'Name': null,
        'Subsection': null,
        'Chromosome Count': null,
        'Origin Country': null,
    })

    const handleEditClose = () => setModalShow(false);
    const handleEditShow = (rowObject) => {
        console.log(`Row object\n${JSON.stringify(rowObject)}`);
        setEditFormInitialValues(rowObject)
        setModalShow(true);
    }

    const handleAddSubmit = (e) => {
        /*const name = getValues("name");
        const subsection = getValues("subsection");
        const chromosomes = getValues("chromosomes");
        const originCountry = getValues("originCountry");
        alert(`${name} | ${subsection} | ${chromosomes} | ${originCountry}`);*/
        //e.target.reset();
        alert(`${e.name} | ${e.subsection} | ${e.chromosomes} | ${e.originCountry}`);
    }

    const handleEditSubmit = (e) => {
        /*const name = getValues("editName");
        const subsection = getValues("editSubsection");
        const chromosomes = getValues("editChromosomes");
        const originCountry = getValues("editOriginCountry");*/
        alert(`${e.name} | ${e.subsection} | ${e.chromosomes} | ${e.originCountry}`);
        //e.target.reset();
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
    const speciesRows = [
        ['1', 'Begonia hitchcockii', 'Gobenia', '22', 'Ecuador'],
        ['2', 'Begonia pearcei', 'Petermannia', '24', 'Ecuador'],
        ['3', 'Begonia tenuissima', 'Petermannia', '20', 'Borneo'],
        ['4', 'Begonia decora', 'Platycentrum', '26', 'Malaysia'],
        ['5', 'Begonia dodsonii', 'Gobenia', '22', 'Ecuador'],
        ['6', 'Begonia lichenora', 'Platycentrum', '14', 'Borneo'],
        ['7', 'Begonia luzhaiensis', 'Coleocentrum', '20', 'China'],
    ];

    let idAcc = 7;

    // Form state for adding a new species
    const [formData, setFormData] = useState({
        name: '',
        subsection: '',
        chromosomeCount: '',
        originCountry: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('New species submitted:', formData);
        // Here you would typically send the data to your backend or update your state
        // Reset the form after submission
        setFormData({
            name: '',
            subsection: '',
            chromosomeCount: '',
            originCountry: ''
        });
    };

    return (
        <>
            <div className="container my-4">
                <h1>Species</h1>
                <BGDataTable headers={speciesHeaders} rows={speciesRows} editCallback={handleEditShow}></BGDataTable>

                <h2 className="mt-4">Add Species</h2>
                <SpeciesPageForm mode={"add"} preloadData={{}} submitCallback={handleAddSubmit}/>
            </div>
            <Modal show={modalShow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Species</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SpeciesPageForm mode={"edit"} preloadData={editFormInitialValues} submitCallback={handleEditSubmit}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SpeciesPage;
