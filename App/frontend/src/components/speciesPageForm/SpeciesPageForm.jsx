import { Button, Form } from 'react-bootstrap';
import { useForm } from "react-hook-form";

const SpeciesPageForm = ({ mode, preloadData, submitCallback, modalCallback }) => {
    const { register, getValues } = useForm();
    console.log(`Preload\n${JSON.stringify(preloadData)}`)
    if (!preloadData) {
        preloadData = {}
    }
    let isEdit = (mode == 'edit')

    let inputNames = {
        name: (isEdit ? "editName" : "name"),
        subsection: (isEdit ? "editSubsection" : "subsection"),
        chromosomes: (isEdit ? "editChromosomes" : "chromosomes"),
        originCountry: (isEdit ? "editOriginCountry" : "originCountry"),
    }

    function handleSubmit(e) {
        e.preventDefault();
        const name = getValues(inputNames.name);
        const subsection = getValues(inputNames.subsection);
        const chromosomes = getValues(inputNames.chromosomes);
        const originCountry = getValues(inputNames.originCountry);
        submitCallback({
            id: preloadData["ID"],
            name: name,
            subsection: subsection,
            chromosomes: chromosomes,
            originCountry: originCountry
        });
        modalCallback();
    }
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Name:</Form.Label>
                <Form.Control type='text' {...register(inputNames.name)} defaultValue={preloadData["Name"]} required />
            </Form.Group>
            <Form.Group>
                <Form.Label>Subsection:</Form.Label>
                <Form.Control type='text' {...register(inputNames.subsection)} required defaultValue={preloadData["Subsection"]} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Chromosome Count:</Form.Label>
                <Form.Control type='number'  {...register(inputNames.chromosomes)} required defaultValue={preloadData["Chromosome Count"]} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Origin Country:</Form.Label>
                <Form.Control type='text'  {...register(inputNames.originCountry)} required defaultValue={preloadData["Origin Country"]} />
            </Form.Group>
            <Button variant="primary" type='submit'>
                Submit
            </Button>
        </Form>
    )
}

export default SpeciesPageForm;