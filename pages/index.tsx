import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';
import { style } from "@mui/system";

export default function Home() {

  const router = useRouter();

  return (
    <>
      <div className={styles.homeContainer + " container"}>
        <div className="mx-auto has-text-centered p-4" style={{ maxWidth: "480px", height: "100%", position: "relative" }}>
          <h1 className={styles.title} style={{ letterSpacing: "8px" }}>ARMY</h1>
          <div className={styles.logo + " mx-auto"}></div>
          <h1 className={styles.title}>
            FORGE
            <div className={styles.betaTag}></div>
          </h1>

          <div className={styles.buttonContainer + " is-flex is-flex-direction-column p-4"}>
            <Button variant="contained" color="primary" className="mb-4" onClick={() => router.push("/gameSystem")}>
              <AddIcon /> <span className="ml-2" style={{ fontWeight: 600 }}>Create A New List</span>
            </Button>
            <Button variant="outlined" color="info" onClick={() => router.push("/load")}>
              <FolderOpenIcon /> <span className="ml-2" style={{ fontWeight: 600 }}>Open A List</span>
            </Button>
          </div>
        </div>

      </div>
    </>
  );
}
