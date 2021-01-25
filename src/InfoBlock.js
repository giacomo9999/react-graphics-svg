import React from "react";
import styles from "./InfoBlock.module.scss";

const infoBlock = (props) => {
  return (
    <div className={styles.infoblock}>
      <h1 style={{ color: "#" + props.groupColor }}>{props.occGroup}</h1>
      <h3 style={{ color: "#" + props.segColor }}>{props.occSeg}</h3>
      <h3>{props.occTime}</h3>
    </div>
  );
};

export default infoBlock;
