import { Tooltip } from "@mui/material";

export default function RuleItem({ label, description }) {
    return (
        <Tooltip title={description} arrow>
            <span style={{ textDecoration: "underline", textDecorationStyle: "dashed", textDecorationColor: "#666" }}>{label}</span>
        </Tooltip>
    );
}