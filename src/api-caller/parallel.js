import ApiCaller from './base';
import { PARALLEL_API } from '../constants';

class ParallelApi extends ApiCaller {
  constructor(...props) {
    super(...props);

    this.type = PARALLEL_API;
  }

  call() {
    const { action, store } = this;
    const { dispatch } = store;
    const exec = (func) => func();

    const actionPromises = this._createPromiseChain().map(exec);

    return new Promise((resolve, reject) => {
      return Promise.all(actionPromises).then(resolve).catch(reject);
    });
  }
}

export default ParallelApi;