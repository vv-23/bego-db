import { Button, Form } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useContext } from 'react';
import { HybridsNamesContext, TraitsContext } from '../context/BegoniaContext';

const HybridTraitsPageForm = ({ mode, preloadData, submitCallback, modalCallback }) => {
    const { register, getValues } = useForm();
    const hybridsNames = useContext(HybridsNamesContext);
    const traits = useContext(TraitsContext);
    console.log(`Preload\n${JSON.stringify(preloadData)}`);
    console.log(`Form Hybrid Names\n${JSON.stringify(hybridsNames)}`);
    console.log(`Traits:`); console.log(traits);

    if (!preloadData) {
        preloadData = {}
    }
    let isEdit = (mode == 'edit')

    let inputNames = {
        oldHybridID: (isEdit ? "oldHybridID" : "oldHybridID"),
        oldTraitID: (isEdit ? "oldTraitID" : "oldHybridID"),
        hybridID: (isEdit ? "editHybridID" : "hybridID"),
        traitID: (isEdit ? "editTraitID" : "traitID"),
    }

    function handleSubmit(e) {
        e.preventDefault();
        const oldHybridID = isEdit ? getValues(inputNames.oldHybridID) : null;
        const oldTraitID = isEdit ? getValues(inputNames.oldTraitID) : null;
        const hybridID = getValues(inputNames.hybridID);
        const traitID = getValues(inputNames.traitID);
        submitCallback({
            id: preloadData["ID"],
            oldHybridID: oldHybridID,
            oldTraitID: oldTraitID,
            hybridID: hybridID,
            traitID: traitID
        });
        if (modalCallback && (typeof modalCallback === "function"))
            modalCallback();
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Control type='hidden' {...register(inputNames.oldHybridID)} defaultValue={preloadData["Hybrid ID"]}>
            </Form.Control>
            <Form.Control type='hidden' {...register(inputNames.oldTraitID)} defaultValue={preloadData["Trait ID"]}>
            </Form.Control>
            <Form.Group>
                <Form.Label>Hybrid:</Form.Label>
                <Form.Select {...register(inputNames.hybridID)} defaultValue={preloadData["Hybrid ID"]} required disabled={isEdit}>
                    <option value={null}>Select a hybrid</option>
                    {
                        hybridsNames.map((obj, index) => {
                            return <option value={obj['hybridID']} key={`${index}|${obj['hybridName']}`}>{obj['hybridName']}</option>
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

export default HybridTraitsPageForm;