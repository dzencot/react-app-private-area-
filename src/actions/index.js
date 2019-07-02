import { createAction } from 'redux-actions';

export const checkAuth = createAction('AUTH_CHECK');
export const auth = createAction('AUTHORIZATION');
export const deauth = createAction('DEATHORIZATION');

