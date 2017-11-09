import { validateAction } from './validations';

import ApiCallerFactory from './api-caller/factory';

const apiMiddleware = ({ getState, dispatch }) => (next) => (action) => {
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

  const apiCaller = ApiCallerFactory.create(action, store);

  if(!apiCaller) {
    return next(action);
  }

  return apiCaller.call()
    .then(() => {
      /**@todo dispatch success*/
    })
    .catch((e) => {
      /**@todo dispatch error*/
      next({
        /**
         * @todo dispatch错误信息
         */
      })
    })
  ;
}

export default apiMiddleware;