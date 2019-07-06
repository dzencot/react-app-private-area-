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
  [actions.authorizationRequest]() {
    return {};
  },
  [actions.loadServicesRequest](state) {
    return { ...state, status: 'request' };
  },
  [actions.loadServicesSuccess](state, { payload }) {
    const { currentPage, pages, services, offset } = payload;
    return { ...state, status: 'success',
      currentPage, pages, services, offset };
  },
  [actions.loadServicesFailure](state) {
    return { ...state, status: 'failure' };
  },
}, {});

const paymentsState = handleActions({
  [actions.authorizationRequest]() {
    return {};
  },
  [actions.loadPaymentsRequest](state) {
    return { ...state, status: 'request' };
  },
  [actions.loadPaymentsSuccess](state, { payload }) {
    const { currentPage, pages, payments, offset, balance } = payload;
    return { ...state, status: 'success',
      currentPage, pages, payments, offset, balance };
  },
  [actions.loadPaymentsFailure](state) {
    return { ...state, status: 'failure' };
  },
}, {});

const infoState = handleActions({
  [actions.authorizationRequest]() {
    return {};
  },
  [actions.inputInfo](state, { payload }) {
    const { name, value } = payload;
    return { ...state, [name]: value };
  },
  [actions.loadInfoRequest](state) {
    return { ...state, status: 'request' };
  },
  [actions.loadInfoSuccess](state, { payload }) {
    const { name, lastName, paymentInfo, email } = payload;
    return { ...state, status: 'success',
      name, lastName, paymentInfo, email };
  },
  [actions.loadInfoFailure](state) {
    return { ...state, status: 'failure' };
  },
  [actions.updateInfoRequest](state) {
    return { ...state, status: 'requestUpdate' };
  },
  [actions.updateInfoSuccess](state) {
    return { ...state, status: 'successUpdate' };
  },
  [actions.updateInfoFailure](state) {
    return { ...state, status: 'failureUpdate' };
  },
}, {});

const appState = handleActions({
  [actions.authorizationRequest]() {
    return {};
  },
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
    return { ...state, action: '', authorized: false };
  },
}, {});


export default combineReducers({
  authorizationState,
  registrationState,
  appState,
  servicesState,
  paymentsState,
  infoState,
  form: formReducer,
});
