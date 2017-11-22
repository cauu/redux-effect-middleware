import axios from 'axios';

class Http {
  static instance = null;

  defaultConfig = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': true
    },
    withCredentials: true,
    timeout: 5000,
  };

  axiosInstance = null;

  constructor() {
    if(!Http.instance) {
      this.axiosInstance = axios.create(this.defaultConfig);

      Http.instance = this;
    }

    return Http.instance;
  }

  __param(obj) {
  let str = [];

  for(let p in obj) {
    if(obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
    }
  }

    return str.join('&');
  }

  __concatUrl(url, data) {
    let concatStr = '?';
    let queryStr = this.__param(data);

    if(url.indexOf(concatStr) > -1) {
      concatStr = '&';
    }

    if(queryStr) {
      return url + concatStr + queryStr;
    }

    return url;
  }

  get({ url, query={}, config={} })  {
    return this.axiosInstance.get(this.__concatUrl(url, query), config);
  }

  post({ url, query={}, data={} }) {
    return this.axiosInstance.post(this.__concatUrl(url, query), data);
  }
}

export default Http;