import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { load, setArmyFile } from '../data/armySlice'
import { useRouter } from 'next/router';
import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton } from "@mui/material";
import RightIcon from "@mui/icons-material/KeyboardArrowRight";

export default function Files() {

    const army = useSelector((state: RootState) => state.army);
    const [armyFiles, setArmyFiles] = useState(null);
    const [customArmies, setCustomArmies] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (!army?.gameSystem)
            router.replace("/");
        // TODO: Test only, add army selection
        fetch("definitions/army-files.json")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setArmyFiles(data);
            });

        const slug = (() => {
            switch (army.gameSystem) {
                case "gf": return "grimdark-future";
                case "gff": return "grimdark-future-firefight";
                case "aof": return "age-of-fantasy";
                case "aofs": return "age-of-fantasy-skirmish";
            }
        })();

        fetch("https://opr-list-builder.herokuapp.com/api/army-books?gameSystemSlug=" + slug)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                const valid = data.filter(a => a.unitCount > 2);
                console.log(valid);
                setCustomArmies(valid);
            });
    }, []);

    const selectArmy = (filePath: string) => {
        // TODO: Clear existing data

        // Set army file
        dispatch(setArmyFile(filePath));

        // Load army data
        fetch(filePath)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);

                dispatch(load(data));

                // TODO: Loading wheel view...?
                // Redirect to list builder once data is loaded
                router.push('/list');
            });
    }

    return (
        <div className="container">
            <div className="card mx-auto mt-6" style={{ maxWidth: "480px" }}>
                <div className="card-content">
                    <h3 className="is-size-4 has-text-centered mb-4">Select Army List</h3>
                    <ul>
                        {
                            !armyFiles ? null : armyFiles[army.gameSystem].map((file, index) => (
                                <li key={index} className="mb-4">
                                    <Button variant="contained" color="primary" onClick={() => selectArmy(file.path)}>
                                        {file.name}
                                    </Button>
                                </li>
                            ))
                        }
                    </ul>

                </div>
                {customArmies && customArmies.map((customArmy, i) => (
                    <Accordion key={customArmy.name}
                        disableGutters
                        square
                        elevation={0}
                        variant="outlined"
                        expanded={expandedId === customArmy.name}
                        onChange={() => setExpandedId(expandedId === customArmy.name ? null : customArmy.name)}>
                        <AccordionSummary>
                            <div className="is-flex is-flex-grow-1 is-align-items-center">
                                <div className="is-flex-grow-1" onClick={() => setExpandedId(customArmy.name)}>
                                    <p className="mb-1" style={{ fontWeight: 600 }}>{customArmy.name}</p>
                                    <div className="is-flex" style={{ fontSize: "14px", color: "#666" }}>
                                        by {customArmy.username}
                                        {/* <p>Qua {u.quality}</p>
                                            <p className="ml-2">Def {u.defense}</p> */}
                                    </div>
                                </div>
                                {/* <p className="mr-2">{u.cost}pts</p> */}
                                <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleSelection(u); }}>
                                    <RightIcon />
                                </IconButton>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails style={{ flexDirection: "column" }}>
                            <p>{customArmy.hint}</p>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        </div>
    );
}