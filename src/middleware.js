import { validateAction } from './validations';
import { DISPATCH_ONCE, DISPATCH_EVERY } from './constants';

import ApiCallerFactory from './api-caller/factory';

const apiMiddleware = (store) => (next) => (action) => {
  /**
   * 1. validate action;
   * 2. create action promise;
   * 3. 如果action promise不存在 -> next(action)
   * 4. call action
   * 5. 错误处理
   */

  const validatedErros = validateAction(action);

  if(validatedErros.length) {
    return next({
      /**
       * @todo dispatch错误信息
       */
    });
  }

  const mode = action.mode || DISPATCH_EVERY;

  const canDispatch = mode === DISPATCH_ONCE ? false : true;

  const apiCaller = ApiCallerFactory.create(action, store, canDispatch);

  if(!apiCaller) {
    return next(action);
  }

  const { actionType, formatter, callback } = action;

  const [ successType, errorType, loadingType ] = actionType; 
  const [ successFormatter, errorFormatter ] = formatter;
  const [ successCb, errorCb, loadingCb ] = callback;

  store.dispatch({
    type: loadingType
  });

  loadingCb && loadingCb();

  return apiCaller.call()
    .then((payload) => {
      /**@desc
       * 如果输出不满足output validation
       * throw new Error
       * */
      next({
        type: successType,
        payload: successFormatter(payload)
      });

      successCb && successCb(successFormatter(payload));
    })
    .catch((e) => {
      /**
       * @desc
       * dispatch error
       * 包括超时、500等错误
      */
      next({
        type: errorType,
        payload: errorFormatter(e)
      });

      errorCb && errorCb(errorFormatter(e));
    })
  ;
}

export default apiMiddleware;