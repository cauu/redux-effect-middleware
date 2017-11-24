import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { apiMiddleware, CALL_API, CHAIN_API, PARALLEL_API } from 'redux-effect-middleware';

const MOCK_API = 'http://localhost:3030/api/pokemon';

const initialState = {
  text: ''
};

const AppService = {
  actions: {
    getInitData: () => ({
      [CHAIN_API]: [
        () => ({
          method: 'get',
          url: MOCK_API,
          test: 'eerror'
        })
      ],
      actionType: ['INIT_SUCCESS', 'INIT_ERROR', 'LOADING'],
      formatter: [
        (resp) => {
          console.log(resp);
          return resp;
        },
        (error) => {
          console.log(error);
          return error;
        }
      ],
      callback: [
        () => {},
        () => {}
      ]
    })
  },
  reducer: (state=initialState, { type, payload }, ...rest) => {
    switch(type) {
      case 'INIT_SUCCESS':
        return state;
      case 'INIT_ERROR':
        return { 
          ...state,
          text: 'an error happend'
        };
      case 'LOADING':
        return {
          ...state,
          text: 'loading...'
        };
      default:
        return state;
    }
  },
};

const store = createStore(
  AppService.reducer,
  {},
  applyMiddleware(apiMiddleware({ debug: true }))
);

class App extends React.Component {
  static propTypes = {
    getInitData: PropTypes.func,
    text: PropTypes.string
  };

  constructor(props) {
    super(props);

    props.getInitData();
  }

  render() {
    const { text } = this.props;

    return (
      <div>
        { text }
      </div>
    );
  }
}

const ConnectedApp = connect(
  (state) => ({
    ...state
  }),
  { ...AppService.actions }
)(App);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>, 
document.getElementById('example1'));