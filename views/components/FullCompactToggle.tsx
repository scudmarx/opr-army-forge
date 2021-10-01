import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function FullCompactToggle({ expanded, onToggle }: { expanded: boolean, onToggle: () => void }) {
    return (
        <div className="is-flex px-4" style={{ alignItems: "center" }}>
            <p className="is-flex-grow-1" style={{ fontWeight: 600 }}>Units</p>
            <Button onClick={onToggle}>
                <MenuIcon />
                <span className="pl-2 full-compact-text">{expanded ? "Full" : "Compact"}</span>
            </Button>
        </div>
    );
}