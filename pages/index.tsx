import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { setGameSystem } from '../data/armySlice'
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {

  const army = useSelector((state: RootState) => state.army);
  const dispatch = useDispatch();
  const router = useRouter();

  // Web Companion test
  useEffect(() => {
    // fetch("https://opr-list-builder.herokuapp.com/api/army-books/lkq2s1575t962k3t")
    //   .then(res => res.json())
    //   .then(r => console.log(r));
    // fetch("https://opr-list-builder.herokuapp.com/api/army-books")
    //   .then(res => res.json())
    //   .then(r => console.log(r));
  }, []);

  const selectGameSystem = (gameSystem: string) => {
    dispatch(setGameSystem(gameSystem));
    router.push("/files");
  };

  return (
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
  );
}
