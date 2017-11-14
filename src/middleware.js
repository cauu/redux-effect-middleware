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

  return apiCaller.call()
    .then((resp) => {
      /**@todo dispatch success*/
      console.log(resp);
      /**@todo 
       * 如果输出不满足output validation
       * throw new Error
       * */
    })
    .catch((e) => {
      /**
       * @todo
       * dispatch error
       * 包括超时、500等错误
      */
      console.log(e);

      next({
        /**
         * @todo dispatch错误信息
         */
      })
    })
    .finally(() => {
    })
  ;
}

export default apiMiddleware;