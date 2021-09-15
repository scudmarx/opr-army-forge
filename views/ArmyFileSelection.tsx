import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { setGameSystem, setArmyFile } from '../data/armySlice'
import { useRouter } from 'next/router';
import { Button } from "@material-ui/core";


export default function ArmyFileSelection() {
    const army = useSelector((state: RootState) => state.army);
    const [armyFiles, setArmyFiles] = useState(null);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        // TODO: Test only, add army selection
        fetch("definitions/army-files.json")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setArmyFiles(data);
            });
    }, []);

    const selectArmy = (filePath: string) => {
        dispatch(setArmyFile(filePath));
        router.push('/list');
    }

    return (
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
        </div>
    );
}