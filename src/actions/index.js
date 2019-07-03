import { createAction } from 'redux-actions';

const urlServer = 'http://localhost:8000';
const headers = {
  'Content-Type': 'application/json',
};

export const authorizationRequest = createAction('AUTHORIZATION_REQUEST');
export const authorizationSuccess = createAction('AUTHORIZATION_SUCCESS');
export const authorizationFailure = createAction('AUTHORIZATION_FAILURE');

export const registrationStart = createAction('REGISTRATION_START');
export const registrationRequest = createAction('REGISTRATION_REQUEST');
export const registrationSuccess = createAction('REGISTRATION_SUCCESS');
export const registrationFailure = createAction('REGISTRATION_FAILURE');

export const authorization = user => async (dispatch) => {
  dispatch(authorizationRequest());
  const { login, pass } = user;
  const data = { login, pass };
  try {
    const response = await fetch(`${urlServer}/auth`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    }).then((response) => {
      return response.json();
    });
    const { status, result } = response;
    if (status === 1 && result === 'authorized') {
      dispatch(authorizationSuccess());
    } else {
      dispatch(authorizationFailure());
    }
  } catch (e) {
    dispatch(authorizationFailure());
    throw e;
  }
};

export const registration = data => async (dispatch) => {
  dispatch(registrationRequest());
  try {
    const response = await fetch(`${urlServer}/registration`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    }).then((response) => {
      return response.json();
    });
    const { status } = response;
    if (status === 1) {
      dispatch(registrationSuccess());
    } else {
      dispatch(registrationFailure());
    }
  } catch (e) {
    dispatch(registrationFailure());
    throw e;
  }
};
