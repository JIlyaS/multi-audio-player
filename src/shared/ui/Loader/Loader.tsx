import Spinner from "react-bootstrap/Spinner";

import styles from "./Loader.module.css";

export const Loader = () => {
  return <Spinner animation="grow" className={styles.loader} />;
};
