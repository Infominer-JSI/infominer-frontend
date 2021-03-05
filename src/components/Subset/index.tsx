// import interfaces
import { ISubset, IComponentSubset } from "Interfaces";
// import modules
import React from "react";

import SubsetHeader from "components/Subset/Header";
import Method from "components/Method";

// import utils
import Dataset from "utils/Dataset";

export default function Subset(props: IComponentSubset) {
  const { subsetId, dataset } = props;
  // get the subset metadata
  const subset = dataset.getSubset(subsetId) as ISubset;

  return (
    <React.Fragment>
      <SubsetHeader subsetId={subsetId} dataset={dataset as Dataset} />
      {subset.usedBy.map((methodId, idx) => (
        <Method key={idx} methodId={methodId} dataset={dataset} />
      ))}
    </React.Fragment>
  );
}
