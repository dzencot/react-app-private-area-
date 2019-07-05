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

const servicesState = handleActions({
  [actions.loadServicesRequest](state) {
    return { ...state, status: 'request' };
  },
  [actions.loadServicesSuccess](state, { payload }) {
    console.log('success services');
    console.log(payload);
    const { currentPage, pages, services, offset } = payload;
    return { ...state, status: 'success',
      currentPage, pages, services, offset };
  },
  [actions.loadServicesFailure](state) {
    return { ...state, status: 'failure' };
  },
}, {});

const paymentsState = handleActions({
  [actions.loadPaymentsRequest](state) {
    return { ...state, status: 'request' };
  },
  [actions.loadPaymentsSuccess](state, { payload }) {
    const { currentPage, pages, payments, offset } = payload;
    return { ...state, status: 'success',
      currentPage, pages, payments, offset };
  },
  [actions.loadPaymentsFailure](state) {
    return { ...state, status: 'failure' };
  },
}, {});

const appState = handleActions({
  [actions.registrationStart](state) {
    return { ...state, action: 'registration' };
  },
  [actions.openInfo](state) {
    return { ...state, action: 'info' };
  },
  [actions.openPayments](state) {
    return { ...state, action: 'payments' };
  },
  [actions.openServices](state) {
    return { ...state, action: 'services' };
  },
  [actions.authorizationSuccess](state) {
    return { ...state, authorized: true, action: 'payments' };
  },
  [actions.authorizationFailure](state) {
    return { ...state, authorized: false };
  },
}, {});


export default combineReducers({
  authorizationState,
  registrationState,
  appState,
  servicesState,
  paymentsState,
  form: formReducer,
});
