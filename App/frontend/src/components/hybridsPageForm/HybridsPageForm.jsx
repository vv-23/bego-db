import { Button, Form } from 'react-bootstrap';
import { useForm } from "react-hook-form";

const HybridsPageForm = ({ mode, preloadData, submitCallback, modalCallback }) => {
    const { register, getValues } = useForm();
    console.log(`Preload\n${JSON.stringify(preloadData)}`)
    if (!preloadData) {
        preloadData = {}
    }
    let isEdit = (mode == 'edit')

    let inputNames = {
        hybdridizationID: (isEdit ? "editID" : "hybdridizationID"),
        sowDate: (isEdit ? "editSow" : "sowDate"),
        germinationDate: (isEdit ? "editGermination" : "germinationDate"),
        flowerDate: (isEdit ? "editFlower" : "flowerDate"),
    }

    function handleSubmit(e) {
        e.preventDefault();
        const hybdridizationID = getValues(inputNames.hybdridizationID);
        const sowDate = getValues(inputNames.sowDate);
        const germinationDate = getValues(inputNames.germinationDate);
        const flowerDate = getValues(inputNames.flowerDate);
        submitCallback({
            id: preloadData["ID"],
            hybdridizationID: hybdridizationID,
            sowDate: sowDate,
            germinationDate: germinationDate,
            flowerDate: flowerDate
        });
        modalCallback();
    }
    return (
        "hello!"
        // <Form onSubmit={handleSubmit}>
        //     <Form.Group>
        //         <Form.Label>Hybridization ID:</Form.Label>
        //         <Form.Control type='text' {...register(inputNames.name)} defaultValue={preloadData["Name"]} required />
        //     </Form.Group>
        //     <Form.Group>
        //         <Form.Label>Sow Date:</Form.Label>
        //         <Form.Control type='text' {...register(inputNames.subsection)} required defaultValue={preloadData["Subsection"]} />
        //     </Form.Group>
        //     <Form.Group>
        //         <Form.Label>Germination Date:</Form.Label>
        //         <Form.Control type='number'  {...register(inputNames.chromosomes)} required defaultValue={preloadData["Chromosome Count"]} />
        //     </Form.Group>
        //     <Form.Group>
        //         <Form.Label>Flower Date:</Form.Label>
        //         <Form.Control type='text'  {...register(inputNames.originCountry)} required defaultValue={preloadData["Origin Country"]} />
        //     </Form.Group>
        //     <Button variant="primary" type='submit'>
        //         Submit
        //     </Button>
        // </Form>
    )
}

export default HybridsPageForm;