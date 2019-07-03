import { combineReducers } from 'redux';
import { handleActions } from 'redux-actions';
import { reducer as formReducer } from 'redux-form';
import * as actions from '../actions';

const authorizationState = handleActions({
  [actions.authorizationSuccess]() {
    return 'success';
  },
  [actions.authorizationRequest]() {
    return 'requested';
  },
  [actions.authorizationFailure]() {
    return 'failed';
  },
}, 'none');

const registrationState = handleActions({
  [actions.registrationSuccess]() {
    return 'success';
  },
  [actions.registrationRequest]() {
    return 'requested';
  },
  [actions.registrationFailure]() {
    return 'failed';
  },
}, 'none');

const appState = handleActions({
  [actions.registrationStart](state) {
    return { ...state, action: 'registration' };
  },
  [actions.authorizationSuccess](state) {
    return { ...state, authorized: true, action: 'info' };
  },
  [actions.authorizationFailure](state) {
    return { ...state, authorized: false };
  },
}, '');


export default combineReducers({
  authorizationState,
  registrationState,
  appState,
  form: formReducer,
});
