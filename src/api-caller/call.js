import ApiCaller from './base';
import { CALL_API } from '../constants';

class CallApi extends ApiCaller {
  constructor(...props) {
    super(...props);

    this.type = CALL_API;
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

export default CallApi;