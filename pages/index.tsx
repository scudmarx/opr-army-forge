import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { setGameSystem } from '../data/armySlice'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AppBar, Button, IconButton, Menu, MenuItem, Paper, Toolbar, Typography } from '@mui/material';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useMediaQuery } from 'react-responsive';

export default function Home() {

  const dispatch = useDispatch();
  const router = useRouter();

  const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <>
      <div className="container">
        <div className="mx-auto p-4" style={{ maxWidth: "480px" }}>
          <h1 className="is-size-3 has-text-centered mb-4">Army Forge</h1>
          <div className="is-flex is-flex-direction-column p-4" style={(!isBigScreen ? { position: "fixed", bottom: "16px", left: "16px", right: "16px" } : null)}>
            <Button variant="contained" color="primary" className="mb-4" onClick={() => router.push("/gameSystem")}>
              <AddIcon /> <span className="ml-2">Create A New List</span>
            </Button>
            <Button variant="outlined" onClick={() => router.push("/load")}>
              <FileUploadOutlinedIcon /> <span className="ml-2">Import A List</span>
            </Button>
          </div>
        </div>

      </div>
    </>
  );
}
