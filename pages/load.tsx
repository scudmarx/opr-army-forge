import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AppBar, Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Menu, MenuItem, Paper, Toolbar, Typography } from '@mui/material';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import _ from "lodash";
import { Delete } from '@mui/icons-material';
import PersistenceService from '../services/PersistenceService';

export default function Load() {

  const dispatch = useDispatch();
  const router = useRouter();
  const [localSaves, setLocalSaves] = useState([]);
  const [forceLoad, setForceLoad] = useState(1);

  useEffect(() => {
    const saves = Object.keys(localStorage).filter(k => k.startsWith("AF_Save"));
    setLocalSaves(saves);
  }, [forceLoad]);

  const loadSave = (save) => {
    PersistenceService.load(dispatch, save, armyData => {
      router.push("/list");
    })
  };

  const deleteSave = (name) => {
    PersistenceService.delete(name);
    setTimeout(() => setForceLoad(forceLoad + 1), 1);
  };

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
        <div className="mx-auto" style={{ maxWidth: "480px" }}>
          <div className="is-flex is-justify-content-center p-4 my-4">
            <Button variant="contained" color="primary">
              <FileUploadOutlinedIcon /> <span className="ml-2">Upload A List File</span>
            </Button>
          </div>
          <p className="px-4 mb-2" style={{ fontWeight: 600 }}>Saved Lists</p>
          <Paper square elevation={0}>
            <List>
              {
                _.sortBy(localSaves.map(save => JSON.parse(localStorage[save])), save => save.modified).reverse().map(save => {
                  const modified = new Date(save.modified);
                  const points = save.listPoints;
                  const title = (
                    <>
                      <span style={{ fontWeight: 600 }}>{save.list.name}</span>
                      <span style={{ color: "#656565" }}> • {points}pts</span>
                    </>
                  );

                  const deleteButton = (
                    <IconButton onClick={() => deleteSave(save.list.name)}>
                      <Delete />
                    </IconButton>
                  );

                  return (
                    <ListItem key={save.list.name} disablePadding secondaryAction={deleteButton}>
                      <ListItemButton onClick={() => loadSave(save)}>
                        <ListItemAvatar>
                          <Avatar>

                          </Avatar>
                        </ListItemAvatar>
                        {/* <ArmyImage name={save.armyName} /> */}
                        <ListItemText primary={title} secondary={modified.toLocaleDateString()} />
                      </ListItemButton>
                    </ListItem>
                  );
                })
              }
            </List>
          </Paper>
        </div>

      </div>
    </>
  );
}
