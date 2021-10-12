import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';
import { useMediaQuery } from 'react-responsive';

export default function Home() {

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
              <FolderOpenIcon /> <span className="ml-2">Open A List</span>
            </Button>
          </div>
        </div>

      </div>
    </>
  );
}
