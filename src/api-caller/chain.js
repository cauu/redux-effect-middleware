import ApiCaller from './base';
import { CHAIN_API } from '../constants';

class ChainApi extends ApiCaller {
  constructor(...props) {
    super(...props);

    this.type = CHAIN_API;
  }

  call() {
    const { action, store } = this;
    const { dispatch } = store;

    const actionPromises = this._createPromiseChain();

    return new Promise((resolve, reject) => {
      let overall = actionPromises.reduce((prev, curr) => {
        return prev.then(curr);
      }, Promise.resolve());

      overall.then(resolve).catch(reject);
    });
  }
}

export default ChainApi;