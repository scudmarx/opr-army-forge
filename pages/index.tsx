import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { setGameSystem } from '../data/armySlice'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AppBar, IconButton, Menu, MenuItem, Paper, Toolbar, Typography } from '@mui/material';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';

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
  const boxShadow = "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)";

  return (
    <>
      <Paper elevation={2} color="primary" square>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <BackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Create a new list
            </Typography>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
            </IconButton>
          </Toolbar>
        </AppBar>
      </Paper>
      <div className="container">
        <div className="mx-auto p-4" style={{ maxWidth: "480px" }}>
          <h3 className="is-size-4 has-text-centered mb-4">Select Game System</h3>
          <div className="columns is-multiline is-mobile">
            {
              // For each game system
              ["gf", "gff", "aof", "aofs"].map(gameSystem => (
                <div key={gameSystem} className="column is-half">
                  <img onClick={() => selectGameSystem(gameSystem)} src={`img/${gameSystem}_cover.jpg`}
                    className="game-system-tile"
                    style={{ borderRadius: "4px", boxShadow }} />
                </div>
              ))
            }
          </div>
        </div>

      </div>
    </>
  );
}
