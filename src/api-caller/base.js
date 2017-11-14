import _ from 'lodash';

import { DISPATCH_ONCE, DISPATCH_EVERY } from '../constants';
import { validateAction } from '../validations';
import Http from '../http';
import Factory from './factory';

/**
 * @class ApiCaller
 * @access private
 * @property
 * action: {
 *  url,
 *  method,
 *  query,
 *  data,
 *  successType,
 *  errorType,
 *  afterSuccess,
 *  afterError,
 *  payload -> meta
 * }
 */
export default class ApiCaller {
  action;
  store;
  type;
  canDispatch;

  constructor(action, store, canDispatch) {
    this.action = action;
    this.store = store;
    this.canDispatch = canDispatch;
  }

  _createPromiseChain() {
    const action = this.action[this.type];

    if(_.isArray(action)) {
      return action.map((creator) => this._createActionPromise(creator));
    }

    return [this._createActionPromise(action)];
  }

  _createActionPromise(actionCreator) {
    const { store, canDispatch } = this;
    const { dispatch } = store;

    return (prevBody) => {
      const action = _.isFunction(actionCreator) ? actionCreator(prevBody) : actionCreator;

      const validatedErrors = validateAction(action);

      if(validatedErrors.length) {
        return Promise.reject(new Error());
      }

      if(!!Factory.create(action, store, canDispatch)) {
        return Factory.create(action, store, canDispatch).call();
      }

      const {
        url,
        method,
        query,
        data,
        meta,
        successType,
        errorType,
        afterSuccess,
        afterError,
      } = action;

      return new Promise((resolve, reject) => {
        new Http()[method.toLowerCase()]({ url, query, data })
          .then((resp) => {
            if(_.isFunction(afterSuccess)) {
              afterSuccess(resp.data, store);
            }

            canDispatch && successType && dispatch({
              type: successType,
              payload: Object.assign({}, resp.data, meta)
            });

            /**@todo dispatch event */
            resolve(resp.data);
          })
          .catch((error) => {
            if(_.isFunction(afterError)) {
              afterError(resp.data, store);
            }

            canDispatch && errorType && dispatch({
              type: errorType,
              payload: error
            });
            /**@todo dispatch error */
            reject(error);
          })
        ;
      });
    };
  }

}