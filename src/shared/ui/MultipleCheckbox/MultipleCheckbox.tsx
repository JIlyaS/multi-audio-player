import { useEffect, useRef, type FC } from 'react';
import { Form } from 'react-bootstrap';
import clsx from "clsx";

import styles from './MultipleCheckbox.module.css';
import { CheckState } from '@/shared/consts';

type CheckStateType = typeof CheckState[keyof typeof CheckState];

interface Props {
  state: CheckStateType;
  label?: string;
  className?: string;
  onChange: (next: CheckStateType) => void;
}

export const MultipleCheckbox: FC<Props> = ({ state, className, label, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = state === CheckState.INDETERMINATE;
    }
  }, [state]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {

    // if (evt.currentTarget.checked) {
    //     onSelectCurrentTrackPlaylistList(CheckState.CHECKED);
    // } else {
    //     onSelectCurrentTrackPlaylistList(CheckState.UNCHECKED);
    // }
    let nextState;
    if (state === CheckState.UNCHECKED) {
      nextState = CheckState.CHECKED;
    } else if (state === CheckState.CHECKED) {
      nextState = CheckState.INDETERMINATE;
    } else {
      nextState = CheckState.UNCHECKED;
    }
    onChange(nextState);
  };

  return (
    <Form.Check
      ref={inputRef}
      type="checkbox"
      className={clsx(styles.multipleCheckbox, className)}
      label={label}
      // Важно: checked = true только для состояний CHECKED и INDETERMINATE
      // Это нужно, чтобы клик по indeterminate-чекбоксу срабатывал корректно
      checked={state !== CheckState.UNCHECKED}
      onChange={handleChange}
    />
  );
};
