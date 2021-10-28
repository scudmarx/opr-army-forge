import styles from "../styles/Home.module.css";
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';

export default function Home() {

  const router = useRouter();

  return (
    <>
      <div className="container">
        <div className="mx-auto p-4" style={{ maxWidth: "480px" }}>
          <h1 className="is-size-3 has-text-centered mb-4">Army Forge</h1>
          <div className={styles.homeContainer + " is-flex is-flex-direction-column p-4"}>
            <Button variant="contained" color="primary" className="mb-4" onClick={() => router.push("/gameSystem")}>
              <AddIcon /> <span className="ml-2" style={{fontWeight:600}}>Create A New List</span>
            </Button>
            <Button variant="outlined" onClick={() => router.push("/load")}>
              <FolderOpenIcon /> <span className="ml-2" style={{fontWeight:600}}>Open A List</span>
            </Button>
          </div>
        </div>

      </div>
    </>
  );
}
