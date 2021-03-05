// import interfaces
import { IMethod, IComponentMethod, EMethodTypes } from "Interfaces";
// import modules
import React from "react";

import MethodAggregates from "components/Method/MethodAggregates";
import MethodKMeans from "components/Method/MethodKMeans";

export default function Method(props: IComponentMethod) {
  const { methodId, dataset } = props;
  // get the method parameters and use them to visualize the results
  const { method } = dataset.getMethod(methodId) as IMethod;

  let Component: any = null;
  switch (method) {
    case EMethodTypes.AGGREGATE:
      Component = MethodAggregates;
      break;
    case EMethodTypes.KMEANS_CLUSTERING:
      Component = MethodKMeans;
      break;
    default:
      break;
  }

  return Component ? <Component methodId={methodId} dataset={dataset} /> : null;
}
