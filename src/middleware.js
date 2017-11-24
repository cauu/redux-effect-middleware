import { validateAction } from './validations';
import { DISPATCH_ONCE, DISPATCH_EVERY } from './constants';

import { InvalidActionError } from './errors';

import ApiCallerFactory from './api-caller/factory';

const apiMiddleware = ({ debug=false }) => (store) => (next) => (action) => {
  /**
   * 1. validate action;
   * 2. create action promise;
   * 3. 如果action promise不存在 -> next(action)
   * 4. call action
   * 5. 错误处理
   */
  const { actionType } = action;

  const [ successType, errorType ] = actionType; 

  const validatedErros = validateAction(action);

  if(validatedErros.length) {
    debug && console.error(new InvalidActionError(validatedErros));

    return next({
      /**
       * @todo dispatch错误信息
       */
      type: errorType || InvalidActionError.name,
      payload: new InvalidActionError(validatedErros)
    });
  }

  const mode = action.mode || DISPATCH_EVERY;

  const canDispatch = mode === DISPATCH_ONCE ? false : true;

  const apiCaller = ApiCallerFactory.create(action, store, canDispatch);

  if(!apiCaller) {
    return next(action);
  }

  const { formatter=[], callback=[], hooker=[] } = action;

  const [ onEnter, onLeave ] = hooker;
  const [ successFormatter, errorFormatter ] = formatter;
  const [ successCb, errorCb ] = callback;

  onEnter && onEnter();

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