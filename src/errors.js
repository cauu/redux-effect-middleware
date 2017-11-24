function ExtendableBuiltIn(cls){
  function buildIn(){
      cls.apply(this, arguments);
  }
  buildIn.prototype = Object.create(cls.prototype);
  buildIn.__proto__ = cls;

  return buildIn;
}

export class InvalidActionError extends ExtendableBuiltIn(Error) {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
  }
}

export class InternetError extends ExtendableBuiltIn(Error) {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
  }
}

export class UnknownError extends ExtendableBuiltIn(Error) {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    this.message = message;
  }
}

export class ErrorFactory {
  constructor(type='success', msg='') {
    if(type === 'login' || type === 'FAILED') {
      throw new LoginError(msg);
    } else if(type === 'error') {
      throw new UnknownError(msg);
    }
  }
}