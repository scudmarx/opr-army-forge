import { Button } from "@mui/material";
import ViewFullIcon from "../icons/view_full";
import ViewCompactIcon from "../icons/view_compact";

export default function FullCompactToggle({ expanded, onToggle }: { expanded: boolean, onToggle: () => void }) {
  return (
    <div className="is-flex px-4" style={{ alignItems: "center" }}>
      <p className="is-flex-grow-1" style={{ fontWeight: 600 }}>Units</p>
      <Button onClick={onToggle}>
        {expanded ? <ViewFullIcon /> : <ViewCompactIcon />}
        <span className="pl-1 full-compact-text">{expanded ? "Full" : "Compact"}</span>
      </Button>
    </div>
  );
}