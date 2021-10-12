import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AppBar, Button, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Paper, Toolbar, Typography } from '@mui/material';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import { loadSavedList } from '../data/listSlice';
import DataService from "../services/DataService";
import { load } from '../data/armySlice';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

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
    const save = JSON.parse(localStorage[key]);
    if (save.armyId) {
      DataService.getApiData(save.armyId, data => {
        dispatch(load(data));
        dispatch(loadSavedList(data.list));
        router.push("/list");
      });
    } else {
      DataService.getJsonData(save.armyFile, data => {
        dispatch(load(data));
        dispatch(loadSavedList(data.list));
        router.push("/list");
      });
    }
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
              Open A List
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
          <Button variant="contained" color="primary">
            <FileUploadOutlinedIcon /> <span className="ml-2">Import A List</span>
          </Button>
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
