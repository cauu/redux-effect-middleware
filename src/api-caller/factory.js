import { PARALLEL_API, CALL_API, CHAIN_API } from '../constants';

import ParallelApi from './parallel';
import CallApi from './call';
import ChainApi from './chain';

class ApiCallerFactory {
  static create(action, store, canDispatch) {
    if(!action) return;

    let callFunc = CallApi;

    if(action[CALL_API]) {
      callFunc = CallApi;
    } else if(action[CHAIN_API]) {
      callFunc = ChainApi;
    } else if(action[PARALLEL_API]) {
      callFunc = ParallelApi;
    } else {
      return null;
    }

    return new callFunc(action, store, canDispatch);
  }
}

export default ApiCallerFactory;