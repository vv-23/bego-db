import { Button, Form } from 'react-bootstrap';
import { useForm } from "react-hook-form";

const TraitsPageForm = ({ mode, preloadData, submitCallback, modalCallback }) => {
    const { register, getValues } = useForm();
    console.log(`Preload\n${JSON.stringify(preloadData)}`)
    if (!preloadData) {
        preloadData = {}
    }
    let isEdit = (mode == 'edit')

    let inputNames = {
        name: (isEdit ? "editName" : "name"),
        value: (isEdit ? "editValue" : "value"),
    }

    function handleSubmit(e) {
        e.preventDefault();
        const name = getValues(inputNames.name);
        const value = getValues(inputNames.value);
        submitCallback({
            id: preloadData["ID"],
            traitName: name,
            traitValue: value,
        });
        if (modalCallback && (typeof modalCallback === "function"))
            modalCallback();
    }
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Name:</Form.Label>
                <Form.Control type='text' {...register(inputNames.name)} defaultValue={preloadData["Name"]} required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Value:</Form.Label>
                <Form.Control type='text' {...register(inputNames.value)} required defaultValue={preloadData["Value"]} />
            </Form.Group>
            <Button variant="primary" type='submit'>
                Submit
            </Button>
        </Form>
    )
}

export default TraitsPageForm;