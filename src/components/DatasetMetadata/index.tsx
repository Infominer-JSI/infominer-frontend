// import interfaces
import { IDataset } from "Interfaces";
// import modules
import React, { useState } from "react";
import { formatNumber, formatDate } from "utils/format";
import ButtonEdit from "components/ButtonEdit";
import ButtonDelete from "components/ButtonDelete";

// import styles and images
import styles from "./styles.module.scss";

export default function DatasetInfo(props: IDataset) {
  // get dataset information and set their state
  const { nDocuments, created } = props;
  const [name] = useState(props.name);

  // format values
  const createdDate = formatDate(new Date(created));
  const numberDocs = formatNumber(nDocuments as number);

  return (
    <div className={styles.container}>
      <div className={styles.controllers}>
        <h1>{name}</h1>
        <div className={styles.buttons}>
          <ButtonEdit />
          <ButtonDelete />
        </div>
      </div>
      <div className={styles.information}>
        <div className={styles.metadata}>
          <div>
            <b>No. Documents:</b> {numberDocs}
          </div>
          <div>
            <b>Created Date:</b> {createdDate}
          </div>
        </div>
      </div>
    </div>
  );
}
