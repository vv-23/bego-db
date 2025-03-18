import { Button, Form } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useContext } from 'react';
import { SpeciesNamesContext, TraitsContext } from '../context/BegoniaContext';

const SpeciesTraitsPageForm = ({ mode, preloadData, submitCallback, modalCallback }) => {
    const { register, getValues } = useForm();
    const speciesNames = useContext(SpeciesNamesContext);
    const traits = useContext(TraitsContext);
    console.log(`Preload\n${JSON.stringify(preloadData)}`);
    console.log(`Form Species Names\n${JSON.stringify(speciesNames)}`);
    console.log(`Traits:`); console.log(traits);

    if (!preloadData) {
        preloadData = {}
    }
    let isEdit = (mode == 'edit')

    let inputNames = {
        oldSpeciesID: (isEdit ? "oldSpeciesID" : "oldSpeciesID"),
        oldTraitID: (isEdit ? "oldTraitID" : "oldSpeciesID"),
        speciesID: (isEdit ? "editSpeciesID" : "speciesID"),
        traitID: (isEdit ? "editTraitID" : "traitID"),
    }

    function handleSubmit(e) {
        e.preventDefault();
        const oldSpeciesID = isEdit ? getValues(inputNames.oldSpeciesID) : null;
        const oldTraitID = isEdit ? getValues(inputNames.oldTraitID) : null;
        const speciesID = getValues(inputNames.speciesID);
        const traitID = getValues(inputNames.traitID);
        submitCallback({
            id: preloadData["ID"],
            oldSpeciesID: oldSpeciesID,
            oldTraitID: oldTraitID,
            speciesID: speciesID,
            traitID: traitID
        });
        if (modalCallback && (typeof modalCallback === "function"))
            modalCallback();
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Control type='hidden' {...register(inputNames.oldSpeciesID)} defaultValue={preloadData["Species ID"]}>
            </Form.Control>
            <Form.Control type='hidden' {...register(inputNames.oldTraitID)} defaultValue={preloadData["Trait ID"]}>
            </Form.Control>
            <Form.Group>
                <Form.Label>Species:</Form.Label>
                <Form.Select {...register(inputNames.speciesID)} defaultValue={preloadData["Species ID"]} required disabled={isEdit}>
                    <option value={null}>Select a species</option>
                    {
                        speciesNames.map((obj, index) => {
                            return <option value={obj['speciesID']} key={`${index}|${obj['speciesName']}`}>{obj['speciesName']}</option>
                        })
                    }
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label>Trait:</Form.Label>
                <Form.Select {...register(inputNames.traitID)} defaultValue={preloadData["Trait ID"]} required >
                    <option value={null}>Select a trait</option>
                    {
                        traits.map((obj, index) => {
                            return <option value={obj['traitID']} key={`${obj['traitName']}-${obj['traitValue']}`}>{`${obj['traitName']}: ${obj['traitValue']}`}</option>
                        })
                    }
                </Form.Select>
            </Form.Group>
            <Button variant="primary" type='submit'>
                Submit
            </Button>
        </Form>
    )
}

export default SpeciesTraitsPageForm;