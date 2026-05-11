import type { FC, PropsWithChildren, Ref } from "react";
import React, { useState } from "react";

interface IDropdownMenu extends PropsWithChildren {
  className: string;
  style: React.CSSProperties;
  ["aria-labelledby"]: string;
}

export const DropdownMenu: FC<IDropdownMenu> = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value] = useState("");

    console.log("children", children);
    return (
      <div
        ref={ref as Ref<HTMLDivElement> | undefined}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (child: any) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);
