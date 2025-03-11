import { Button, Form } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const HybridsPageForm = ({ mode, preloadData, submitCallback, modalCallback }) => {
    const { register, getValues } = useForm();
    const [hybridizationOptions, setHybridizationOptions] = useState([]);

    console.log(`Preload\n${JSON.stringify(preloadData)}`)
    if (!preloadData) {
        preloadData = {}
    }

    let isEdit = (mode == 'edit')

    let inputNames = {
        hybridID: (isEdit ? "editID" : "hybridID"),
        hybridizationID: (isEdit ? "editID" : "hybridizationID"),
        sowDate: (isEdit ? "editSow" : "sowDate"),
        germinationDate: (isEdit ? "editGermination" : "germinationDate"),
        flowerDate: (isEdit ? "editFlower" : "flowerDate"),
    }

    //get hybridizations drop down
    useEffect(() => {
        const fetchHybridizationOptions = async () => {
            try {
                const response = await fetch("http://localhost:3300/hybrids/hybridizations");
                if (!response.ok) {
                    throw new Error("Failed to fetch hybridizations");
                }
                const data = await response.json();
                setHybridizationOptions(data);
            } catch (error) {
                console.error("Error fetching hybridizations:", error);
            }
        };
    
        fetchHybridizationOptions();
    }, []);

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
    return (
        <Form onSubmit={handleSubmit}>
        {/* hybridization options drop-down */}
            {isEdit && (
            <input 
                type="hidden" 
                {...register("hybridID")} 
                value={preloadData["hybridID"] || ""}
            />)} 

           <Form.Group>
                <Form.Label>Hybridization ID:</Form.Label>
                <Form.Control as ="select" {...register(inputNames.hybridizationID)}
                defaultValue={isEdit ? preloadData["hybridizationID"] : ""}
                required >
                    
                    <option value="">Select Hybridization</option>

                    {hybridizationOptions.map((option, index) => {
                        return (
                            <option 
                                key={option.hybridizationID ?? `hybrid-${index}`} 
                                value={option.hybridizationID || ""}>
                                {option.hybridCross	 || "Unnamed Hybrid"}
                            </option>
                        );})}

                </Form.Control>
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
                <Form.Control type='date'  {...register(inputNames.flowerDate)} defaultValue={preloadData["Flower Date"]} />
            </Form.Group>
            <Button variant="primary" type='submit'>
                Submit
            </Button>
        </Form>
    )
}

export default HybridsPageForm;