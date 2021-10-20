import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AppBar, Avatar, Button, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, CircularProgress, Paper, Toolbar, Typography } from '@mui/material';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saves = Object.keys(localStorage).filter(k => k.startsWith("AF_Save"));
    setLocalSaves(saves);
  }, [forceLoad]);

  const importFile = () => {
    var fileInput = document.getElementById("file-input");
    fileInput.dispatchEvent(new MouseEvent("click"));
    //const fileSystemHandles = window.showOpenFilePicker();
    //console.log(fileSystemHandles);
  }

  const loadSave = (save) => {
    setLoading(true);
    PersistenceService.load(dispatch, save, armyData => {
      router.push("/list");
      setLoading(false);
    })
  };

  const deleteSave = (name) => {
    PersistenceService.delete(name);
    setTimeout(() => setForceLoad(forceLoad + 1), 1);
  };

  const readSingleFile = (e) => {
    var file = e.target.files[0];
    if (!file)
      return;

    setLoading(true);

    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const json: string = event.target.result as string;

        PersistenceService.load(dispatch, JSON.parse(json), _ => {
          router.push("/list");
          // Save to local
          const saveName = file.name.replace(".json", "");
          // if it doesn't exist, or user confirms they are happy to overwrite
          if (!PersistenceService.checkExists(saveName) || confirm("List with this name already exists. Are you sure you'd like to overwrite it?")) {
            PersistenceService.saveImport(saveName, json);
          }

          setLoading(false);
        });
      }
      catch (e) {
        setLoading(false);
      }
    };

    reader.readAsText(file);
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
        <input type="file" id="file-input" style={{ display: "none" }} onChange={readSingleFile} />
        <div className="mx-auto" style={{ maxWidth: "480px" }}>
          <div className="is-flex is-justify-content-center p-4 my-4">
            <Button variant="contained" color="primary" onClick={() => importFile()}>
              <FileUploadOutlinedIcon /> <span className="ml-2">Upload A List File</span>
            </Button>
          </div>
          {loading && <div className="is-flex is-flex-direction-column is-align-items-center	">
            <CircularProgress />
            <p>Loading army data...</p>
          </div>}
          <p className="px-4 mb-2" style={{ fontWeight: 600 }}>Saved Lists</p>
          <Paper square elevation={0}>
            <List>
              {
                _.sortBy(localSaves.map(save => JSON.parse(localStorage[save])), save => save.modified).reverse().map(save => {
                  try {
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
                  }
                  catch (e) {
                    console.error(e);
                  }
                })
              }
            </List>
          </Paper>
        </div>

      </div>
    </>
  );
}
