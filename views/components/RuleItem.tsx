import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

import { styled } from '@mui/material/styles';


export default function RuleItem({ label, description }) {

  const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'rgba(0,0,0,.6)',
      padding: "8px"
    },
  }));

  const bullet = /•|/;
  const descParts = description.split(bullet).map(part => (<p>{part}</p>));

  return (
    <CustomTooltip title={descParts} arrow enterTouchDelay={0}>
      <span style={{ textDecoration: "underline", textDecorationStyle: "dashed", textDecorationColor: "#666", textUnderlineOffset: "4px" }}>{label}</span>
    </CustomTooltip>
  );
}