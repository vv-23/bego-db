import { Button, Form } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useContext } from 'react';
import { SpeciesNamesContext } from '../context/BegoniaContext';

const HybridizationsPageForm = ({ mode, preloadData, submitCallback, modalCallback }) => {
    const { register, getValues } = useForm();
    const speciesNames = useContext(SpeciesNamesContext)
    console.log(`Preload\n${JSON.stringify(preloadData)}`)
    console.log(`Form Species Names\n${JSON.stringify(speciesNames)}`)
    if (!preloadData) {
        preloadData = {}
    }
    let isEdit = (mode == 'edit')

    let inputNames = {
        date: (isEdit ? "editDate" : "date"),
        ovary: (isEdit ? "editOvary" : "ovary"),
        pollen: (isEdit ? "editPollen" : "pollen"),
        success: (isEdit ? "editSuccess" : "success"),
    }

    function matchSpeciesNameToID(speciesName) {
        const species = speciesNames.find(item => item.speciesName === speciesName);
        return species ? species.speciesID : null;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const date = getValues(inputNames.date);
        const ovary = getValues(inputNames.ovary);
        const pollen = getValues(inputNames.pollen);
        const success = getValues(inputNames.success);
        submitCallback({
            id: preloadData["ID"],
            date: date,
            ovary: ovary,
            pollen: pollen,
            success: success
        });
        if (modalCallback && (typeof modalCallback === "function"))
            modalCallback();
    }
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Date:</Form.Label>
                <Form.Control type='date' {...register(inputNames.date)} defaultValue={preloadData["Date"]} required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Mother species:</Form.Label>
                <Form.Select {...register(inputNames.ovary)} required defaultValue={matchSpeciesNameToID(preloadData["Mother sp."])}>
                    <option value={"NULL"}>N/A</option>
                    {
                        speciesNames.map((obj, index) => {
                            return <option value={obj['speciesID']} key={obj['speciesName']}>{obj['speciesName']}</option>
                        })
                    }
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label>Father species:</Form.Label>
                <Form.Select {...register(inputNames.pollen)} required defaultValue={matchSpeciesNameToID(preloadData["Father sp."])}>
                    <option value={"NULL"}>N/A</option>
                    {
                        speciesNames.map((obj, index) => {
                            return <option value={obj['speciesID']} key={obj['speciesName']}>{obj['speciesName']}</option>
                        })
                    }
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label>Success</Form.Label>
                <Form.Check type='checkbox' {...register(inputNames.success)} defaultChecked={(preloadData["Success"] ? true : false)}>
                </Form.Check>
            </Form.Group>
            <Button variant="primary" type='submit'>
                Submit
            </Button>
        </Form>
    )
}

export default HybridizationsPageForm;