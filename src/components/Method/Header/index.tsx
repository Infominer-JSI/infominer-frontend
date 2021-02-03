// import interfaces
import { IMethod, IMethodComponent } from "Interfaces";
// import modules
import React from "react";
import { formatMethodType } from "utils/format";
import DeleteButton from "components/DeleteButton";

// import styles and images
import styles from "./styles.module.scss";

export default function MethodHeader(props: IMethodComponent) {
  // get dataset information and set their state
  const { methodId, dataset } = props;
  // get dataset and subset metadata
  const { method } = dataset.getMethod(methodId) as IMethod;
  // format the number of documents
  const label = formatMethodType(method);
  return (
    <div className={styles.container}>
      <div className={styles.controllers}>
        <h1>{label}</h1>
        <div className={styles.buttons}>
          <DeleteButton dark={true} />
        </div>
      </div>
      <div className={styles.information}>
        <div className={styles.metadata}>
          <div></div>
        </div>
      </div>
    </div>
  );
}
