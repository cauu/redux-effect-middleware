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

  constructor(action, store) {
    this.action = action;
    this.store = store;
  }

  _createActionPromise(actionCreator, store) {
    const { dispatch } = store;

    return (prevBody) => {
      const action = actionCreator(prevBody);

      const validatedErrors = validateAction(action);

      if(validatedErrors.length) {
        return Promise.reject(new Error());
      }

      if(!!Factory.create(action, store)) {
        return Factory.create(action, store).call();
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
      } = action

      return new Promise((resolve, reject) => {
        new Http()[method.toLowerCase()]({ url, query, data })
          .then((resp) => {
            if(_.isFunction(afterSuccess)) {
              afterSuccess(resp, store);
            }

            successType && dispatch({
              type: successType,
              payload: Object.assign({}, resp, meta)
            });
            /**@todo dispatch event */
            resolve(resp);
          })
          .catch((error) => {
            if(_.isFunction(afterError)) {
              afterError(resp, store);
            }

            errorType && dispatch({
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