import { createAction } from 'redux-actions';

const urlServer = 'http://localhost:8000';
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

let sessionKey;

export const authorizationRequest = createAction('AUTHORIZATION_REQUEST');
export const authorizationSuccess = createAction('AUTHORIZATION_SUCCESS');
export const authorizationFailure = createAction('AUTHORIZATION_FAILURE');

export const registrationStart = createAction('REGISTRATION_START');
export const registrationRequest = createAction('REGISTRATION_REQUEST');
export const registrationSuccess = createAction('REGISTRATION_SUCCESS');
export const registrationFailure = createAction('REGISTRATION_FAILURE');

export const openInfo = createAction('LOADINFO_START');
export const loadInfoRequest = createAction('LOADINFO_REQUEST');
export const loadInfoSuccess = createAction('LOADINFO_SUCCESS');
export const loadInfoFailure = createAction('LOADINFO_FAILURE');

export const inputInfo = createAction('INPUT_INFO');
export const updateInfoRequest = createAction('UPDATE_INFO_REQUEST');
export const updateInfoSuccess = createAction('UPDATE_INFO_SUCCESS');
export const updateInfoFailure = createAction('UPDATE_INFO_FAILURE');

export const openPayments = createAction('LOADPAYMENTS_START');
export const loadPaymentsRequest = createAction('LOADPAYMENTS_REQUEST');
export const loadPaymentsSuccess = createAction('LOADPAYMENTS_SUCCESS');
export const loadPaymentsFailure = createAction('LOADPAYMENTS_FAILURE');

export const openServices = createAction('LOADSERVICES_START');
export const loadServicesRequest = createAction('LOADSERVICES_REQUEST');
export const loadServicesSuccess = createAction('LOADSERVICES_SUCCESS');
export const loadServicesFailure = createAction('LOADSERVICES_FAILURE');

export const openPage = createAction('PAGE_OPEN')
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
    const { status, result, key } = response;
    if (status === 1 && result === 'authorized') {
      sessionKey = key;
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

export const loadInfo = () => async (dispatch) => {
  dispatch(loadInfoRequest());
  try {
    const response = await fetch(`${urlServer}/info?key=${sessionKey}`, {
      method: 'GET',
    }).then((response) => {
      return response.json();
    });
    const { status, data, result } = response;
    if (status === 1) {
      dispatch(loadInfoSuccess(data));
    } else {
      if (result === 'unathorized') {
        dispatch(authorizationFailure());
      }

      dispatch(loadInfoFailure());
    }
  } catch (e) {
    dispatch(loadInfoFailure());
    throw e;
  }
};

export const updateInfo = (data) => async (dispatch) => {
  dispatch(loadInfoRequest());
  try {
    const response = await fetch(`${urlServer}/info?key=${sessionKey}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    }).then((response) => {
      return response.json();
    });
    const { status, result } = response;
    if (status === 1) {
      if (result === 'unathorized') {
        dispatch(authorizationFailure());
      }
      dispatch(updateInfoSuccess());
    } else {
      dispatch(updateInfoFailure());
    }
  } catch (e) {
    dispatch(updateInfoFailure());
    throw e;
  }
};

export const loadPayments = (pageNum) => async (dispatch) => {
  const page = parseInt(pageNum);
  dispatch(loadPaymentsRequest());
  try {
    const response = await fetch(`${urlServer}/payments?page=${page}&key=${sessionKey}`, {
      method: 'GET',
    }).then((response) => {
      return response.json();
    });
    const { status, result, currentPage, pages, payments, offset, balance } = response;
    if (status === 1) {
      dispatch(loadPaymentsSuccess({ currentPage, pages, payments, offset, balance }));
    } else {
      if (result === 'unathorized') {
        dispatch(authorizationFailure());
      }
      dispatch(loadPaymentsFailure());
    }
  } catch (e) {
    dispatch(loadPaymentsFailure());
    throw e;
  }
};

export const loadServices = (pageNum) => async (dispatch) => {
  dispatch(loadServicesRequest());
  try {
    const page = parseInt(pageNum);
    const response = await fetch(`${urlServer}/services?page=${page}&key=${sessionKey}`, {
      method: 'GET',
    }).then((response) => {
      return response.json();
    });
    const { status, result, currentPage, pages, services, offset } = response;
    if (status === 1) {
      dispatch(loadServicesSuccess({ currentPage, pages, services, offset }));
      if (result === 'unathorized') {
        dispatch(authorizationFailure());
      }
    } else {
      dispatch(loadServicesFailure());
    }
  } catch (e) {
    dispatch(loadServicesFailure());
    throw e;
  }
};
