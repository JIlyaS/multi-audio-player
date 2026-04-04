import type { FC } from "react";
import type { Placement } from "react-bootstrap/esm/types";
import OverlayTrigger, { type OverlayTriggerRenderProps } from "react-bootstrap/OverlayTrigger";
import Tooltip, { type TooltipProps } from "react-bootstrap/Tooltip";

interface Props {
    id?: string; 
    title: string;
    position?: Placement;
    children: React.ReactElement | ((props: OverlayTriggerRenderProps) => React.ReactNode);
}

export const OverlayTooltip: FC<Props> = ({ children, id = "default", title, position = "bottom" }) => {
  const renderTooltip = (props: TooltipProps) => (
    <Tooltip id={id} {...props}>
      {title}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement={position}
      delay={{ show: 150, hide: 300 }}
      overlay={renderTooltip}
    >
      {children}
    </OverlayTrigger>
  );
};

export default OverlayTooltip;
