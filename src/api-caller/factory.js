import { PARALLEL_API, CALL_API, CHAIN_API } from '../constants';

import ParallelApi from './parallel';
import CallApi from './call';
import ChainApi from './chain';

class ApiCallerFactory {
  static create(action, store) {
    if(!action) return;

    if(action[CALL_API]) {
      return new ParallelApi(action, store);
    } else if(action[CHAIN_API]) {
      return new ChainApi(action, store);
    } else if(action[PARALLEL_API]) {
      return new ParallelApi(action, store);
    }
  }
}

export default ApiCallerFactory;