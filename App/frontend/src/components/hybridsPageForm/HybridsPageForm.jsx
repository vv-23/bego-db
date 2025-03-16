import { Button, Form } from 'react-bootstrap';
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { HybridizationsContext, SpeciesNamesContext } from '../context/BegoniaContext';

const HybridsPageForm = ({ mode, preloadData, submitCallback, modalCallback }) => {
    const { register, getValues } = useForm();
    const hybridizations = useContext(HybridizationsContext);

    console.log(`Preload\n${JSON.stringify(preloadData)}`)
    if (!preloadData) {
        preloadData = {}
    }

    let isEdit = (mode == 'edit')

    let inputNames = {
        hybridID: (isEdit ? "editID" : "hybridID"),
        hybridizationID: (isEdit ? "editHybridizationID" : "hybridizationID"),
        sowDate: (isEdit ? "editSow" : "sowDate"),
        germinationDate: (isEdit ? "editGermination" : "germinationDate"),
        flowerDate: (isEdit ? "editFlower" : "flowerDate"),
    }

    function matchHybridizationNamesToID(hybridizationNames) {
        const species = hybridizationNames.find(item => item.speciesName === speciesName);
        return species ? species.speciesID : null;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const hybridID = getValues(inputNames.hybridID)
        const hybridizationID = getValues(inputNames.hybridizationID);
        const sowDate = getValues(inputNames.sowDate);
        const germinationDate = getValues(inputNames.germinationDate);
        const flowerDate = getValues(inputNames.flowerDate);
        submitCallback({
            hybridID: hybridID,
            hybridizationID: hybridizationID,
            sowDate: sowDate,
            germinationDate: germinationDate,
            flowerDate: flowerDate
        });
        modalCallback();
    }
    console.log(hybridizations);
    return (
        <Form onSubmit={handleSubmit}>
            {/* hybridization options drop-down */}
            {isEdit && (
                <input
                    type="hidden"
                    {...register(inputNames.hybridID)}
                    value={preloadData["ID"] || ""}
                />)}
             
            <Form.Group>
                <Form.Label>Hybridization ID:</Form.Label>
                <Form.Select {...register(inputNames.hybridizationID)} defaultValue={preloadData["HE-ID"]} required >

                    <option value={null}>Select Hybridization</option>

                    {hybridizations.map((obj, index) => {
                        return (
                            <option
                                key={obj.hybridizationID ?? `hybrid-${index}`}
                                value={obj.hybridizationID || ""}
                                >
                                {`${obj.hybridizationID} | ${obj.hybridizationDate} | ${obj.ovaryName} x ${obj.pollenName} | ${obj.success ? "Success" : "Failed"}`}
                            </option>
                        );
                    })}

                </Form.Select>
            </Form.Group>

            <Form.Group>
                <Form.Label>Sow Date:</Form.Label>
                <Form.Control type='date' {...register(inputNames.sowDate)} defaultValue={preloadData["Sow Date"]} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Germination Date:</Form.Label>
                <Form.Control type='date'  {...register(inputNames.germinationDate)} defaultValue={preloadData["Germination Date"]} />
            </Form.Group>
            <Form.Group>
                <Form.Label>Flower Date:</Form.Label>
                <Form.Control type='date'  {...register(inputNames.flowerDate)} defaultValue={preloadData["Flowering Date"]} />
            </Form.Group>
            <Button variant="primary" type='submit'>
                Submit
            </Button>
        </Form>
    )
}

export default HybridsPageForm;