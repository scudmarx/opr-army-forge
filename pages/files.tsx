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

        // Redirect to game selection screen if no army selected
        if (!army.gameSystem) {
            router.push("/", null, { shallow: true });
            return;
        }

        // List of "official" armies from AF
        fetch("definitions/army-files.json")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setArmyFiles(data);
            });

        // AF to Web Companion game type mapping
        const slug = (() => {
            switch (army.gameSystem) {
                case "gf": return "grimdark-future";
                case "gff": return "grimdark-future-firefight";
                case "aof": return "age-of-fantasy";
                case "aofs": return "age-of-fantasy-skirmish";
            }
        })();

        const loadCustomArmies = false;
        if (loadCustomArmies) {
            // Load custom data books from Web Companion
            fetch("https://opr-list-builder.herokuapp.com/api/army-books?gameSystemSlug=" + slug)
                .then((res) => res.json())
                .then((data) => {
                    const valid = data.filter(a => a.unitCount > 2);
                    setCustomArmies(valid);
                });
        }
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
    };

    const selectCustomList = (customArmy: any) => {
        // TODO: Web companion integration
    };

    return (
        <div className="container">
            <div className="card mx-auto mt-6" style={{ maxWidth: "480px" }}>
                <h3 className="is-size-4 has-text-centered mb-4">Select Army List</h3>

                {
                    !armyFiles ? null : armyFiles.filter(grp => grp.key === army.gameSystem)[0].items.map((file, index) => (
                        <Accordion key={index}
                            disableGutters
                            square
                            elevation={0}
                            variant="outlined"
                            expanded={expandedId === file.name}
                            onChange={() => setExpandedId(expandedId === file.name ? null : file.name)}>
                            <AccordionSummary onClick={() => selectArmy(file.path)}>
                                <div className="is-flex is-flex-grow-1 is-align-items-center">
                                    <div className="is-flex-grow-1" onClick={() => setExpandedId(file.name)}>
                                        <p className="mb-1" style={{ fontWeight: 600 }}>{file.name}</p>
                                        <div className="is-flex" style={{ fontSize: "14px", color: "#666" }}>
                                            by OnePageRules
                                        </div>
                                    </div>
                                    <IconButton color="primary" onClick={(e) => { e.stopPropagation(); selectArmy(file.path); }}>
                                        <RightIcon />
                                    </IconButton>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails style={{ flexDirection: "column" }}>
                                <p>Additional info...?</p>
                            </AccordionDetails>
                        </Accordion>
                        // <li key={index} className="mb-4">
                        //     <Button variant="contained" color="primary" onClick={() => selectArmy(file.path)}>
                        //         {file.name}
                        //     </Button>
                        // </li>
                    ))
                }

                {customArmies && <>
                    <h3>Custom Armies</h3>
                    {customArmies.map((customArmy, i) => (
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
                                    <IconButton color="primary" onClick={(e) => { e.stopPropagation(); selectCustomList(customArmy); }}>
                                        <RightIcon />
                                    </IconButton>
                                </div>
                            </AccordionSummary>
                            <AccordionDetails style={{ flexDirection: "column" }}>
                                <p>{customArmy.hint}</p>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </>
                }
            </div>
        </div>
    );
}