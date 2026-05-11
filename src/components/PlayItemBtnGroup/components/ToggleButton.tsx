import type { FC, PropsWithChildren, Ref } from "react";
import React from "react";

import styles from "./ToggleButton.module.css";

interface IToggleButton extends PropsWithChildren {
  onClick: (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const ToggleButton: FC<IToggleButton> = React.forwardRef(({ children, onClick }, ref) => {
 return (
   <button
     ref={ref as Ref<HTMLButtonElement> | undefined}
     className={styles.toggleBtn}
     onClick={(evt) => {
       evt.preventDefault();
       onClick(evt);
     }}
   >
     {children}
   </button>
 );
});
