import { createContext, useEffect, useState } from 'react';

function useData(url) {
    const [data, setData] = useState([]);
    useEffect(() => {
        if (url) {
            let ignore = false;
            fetch(url)
                .then(response => response.json())
                .then(json => {
                    if (!ignore) {
                        setData(json);
                    }
                });
            return () => {
                ignore = true;
            };
        }
    }, [url]);
    return data;
}

export const SpeciesNamesContext = createContext([]);

export function SpeciesNamesProvider({ children }) {
    //const speciesNames = useData(`${import.meta.env.VITE_API_URL}/species?fields=speciesID,speciesName`);

    const [speciesNames, setSpeciesNames] = useState([]);

    /*useEffect(async () => {
        async function fetchSpeciesNames() {
            const speciesNamesURL = `${import.meta.env.VITE_API_URL}/species?fields=speciesID,speciesName`;
            let response = await fetch(speciesNamesURL);
            let speciesNames = await response.json();
            console.log(`Species names\n${JSON.stringify(speciesNames)}`);
            setSpeciesNames(speciesNames);
        }
        fetchSpeciesNames();
    }, [])*/

    return (
        <SpeciesNamesContext.Provider value={speciesNames}>
            {children}
        </SpeciesNamesContext.Provider>
    )
}

export const HybridsNamesContext = createContext([]);

export const HybridizationsContext = createContext([]);

export function HybridizationsProvider({ children }) {
    //const hybridizations = useData(`${import.meta.env.VITE_API_URL}/hybridizations/pretty`);

    const [hybridizations, setHybridizations] = useState([]);

    /*useEffect(async () => {
        const hybridizationsURL = `${import.meta.env.VITE_API_URL}/hybridizations/pretty`;
        let response = await fetch(hybridizationsURL);
        let hybridizations = await response.json();
        console.log(`Hybridizations\n${JSON.stringify(hybridizations)}`);
        setHybridizations(hybridizations);
    }, []);*/

    return (
        <HybridizationsContext.Provider value={hybridizations}>
            {children}
        </HybridizationsContext.Provider>
    )
}

export const TraitsContext = createContext([]);

export function TraitsProvider({ children }) {
    //const traits = useData(`${import.meta.env.VITE_API_URL}/traits`);

    /*const [traits, setTraits] = useState([]);

    useEffect(async () => {
        const traitsURL = `${import.meta.env.VITE_API_URL}/traits`;
        let response = await fetch(traitsURL);
        let traits = await response.json();
        console.log(`Traits\n${JSON.stringify(traits)}`);
        setTraits(traits);
    }, [])*/

    return (
        <TraitsContext.Provider value={traits}>
            {children}
        </TraitsContext.Provider>
    )
}