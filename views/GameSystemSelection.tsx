import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { setGameSystem, setArmyFile } from '../data/armySlice'
import { BottomSheet } from "react-spring-bottom-sheet";
import 'react-spring-bottom-sheet/dist/style.css'

export default function GameSystemSelection() {
    const army = useSelector((state: RootState) => state.army);
    
    const dispatch = useDispatch();

    useEffect(() => {
        // TODO: Test only, add army selection
        fetch("definitions/army-files.json")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setArmyFile(data);
            });
    }, []);

    const selectGameSystem = (gameSystem: string) => {
        dispatch(setGameSystem(gameSystem));
    };

    return (
        <>
            <div className="container">
                <div className="card mx-auto mt-6" style={{ maxWidth: "480px" }}>
                    <div className="card-content">
                        <h3 className="is-size-4 has-text-centered mb-4">Select Game System</h3>
                        <div className="columns is-multiline">
                            {
                                // For each game system
                                ["gf", "gff", "aof", "aofs"].map(gameSystem => (
                                    <div key={gameSystem} className="column is-half">
                                        <img onClick={() => selectGameSystem(gameSystem)} src={`img/${gameSystem}_cover.jpg`} className="game-system-tile" />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}