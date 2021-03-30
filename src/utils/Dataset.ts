import { IDataset, ISubset, IMethod } from "Interfaces";

export default class Dataset {
  private dataset: IDataset;
  private subsets: { [key: number]: ISubset };
  private methods: { [key: number]: IMethod };

  constructor(dataset: IDataset, subsets: ISubset[], methods: IMethod[]) {
    // save the dataset
    this.dataset = dataset;
    // save the subsets
    this.subsets = subsets
      .map((subset) => ({ [subset.id]: subset }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {});
    // save the methods
    this.methods = methods
      .map((method) => ({ [method.id]: method }))
      .reduce((prev, curr) => ({ ...prev, ...curr }), {});
  }

  getDataset() {
    return this.dataset;
  }

  getSubset(id: number) {
    return id in this.subsets ? this.subsets[id] : null;
  }

  getSubsets(ids: number[]) {
    return ids.map((id) => this.getSubset(id));
  }

  deleteSubset(id: number) {
    delete this.subsets[id];
  }

  getMethod(id: number) {
    return id in this.methods ? this.methods[id] : null;
  }

  getMethods(ids: number[]) {
    return ids.map((id) => this.getMethod(id));
  }

  deleteMethod(id: number) {
    delete this.methods[id];
  }
}
