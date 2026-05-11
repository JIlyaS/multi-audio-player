import { type FC } from "react";
import type { Placement } from "react-bootstrap/esm/types";
import OverlayTrigger, { type OverlayTriggerRenderProps } from "react-bootstrap/OverlayTrigger";
import Tooltip, { type TooltipProps } from "react-bootstrap/Tooltip";

interface Props {
  id?: string;
  title: string;
  showValue?: boolean;
  position?: Placement;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltipTarget?: any;
  children:
    | React.ReactElement
    | ((props: OverlayTriggerRenderProps) => React.ReactNode);
}

export const OverlayTooltip: FC<Props> = 
  ({ children, id = "default", title, showValue, tooltipTarget, position = "bottom" }) => {
    const renderTooltip = (props: TooltipProps) => (
      <Tooltip id={id} {...props}>
        {title}
      </Tooltip>
    );

    return (
      <OverlayTrigger
        placement={position}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        target={tooltipTarget?.current as any}
        show={showValue}
        delay={{ show: 150, hide: 300 }}
        overlay={renderTooltip}
      >
        {children}
      </OverlayTrigger>
    );
  };

export default OverlayTooltip;
