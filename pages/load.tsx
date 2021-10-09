import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AppBar, Button, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Paper, Toolbar, Typography } from '@mui/material';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import { loadSavedList } from '../data/listSlice';

export default function Load() {

  const army = useSelector((state: RootState) => state.army);
  const dispatch = useDispatch();
  const router = useRouter();
  const [localSaves, setLocalSaves] = useState([]);

  useEffect(() => {
    const saves = Object.keys(localStorage).filter(k => k.startsWith("AF_Save"));
    setLocalSaves(saves);
  }, []);

  const loadSave = (key) => {
    const units = JSON.parse(localStorage[key]);
    // Load army
    // redirect?
    // Load saved units
    dispatch(loadSavedList(units));
  }

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
              onClick={() => router.back()}
            >
              <BackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Import A List
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
          <h4 className="is-size-4 has-text-centered mb-4">Saved Lists</h4>
          <List>
            {localSaves.map(key => (
              <ListItem key={key} disablePadding>
                <ListItemButton onClick={() => loadSave(key)}>
                  <ListItemText>{key.replace("AF_Save_", "")}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>

      </div>
    </>
  );
}
