import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import * as actions from '../actions';

const urlServer = 'http://localhost:8000';

const auth = handleActions({
  [actions.auth](state, { payload }) {
    const { login, pass } = payload;
    const data = { login, pass };
    console.log('auth');
    console.log(payload);
    fetch(`${urlServer}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => {
      console.log('response:');
      console.log(response);
    });
  },
  [actions.checkAuth](state, { payload }) {
    console.log(payload);
  },
  [actions.deauth](state, { payload }) {
    console.log(payload);
  },
}, '');

export default combineReducers({
  auth,
});
