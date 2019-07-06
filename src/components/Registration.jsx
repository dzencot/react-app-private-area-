import React, { Fragment } from 'react';
import { connect } from 'react-redux';
// import cn from 'classnames';
import '../css/Registration.css';
import { Field, reduxForm } from 'redux-form';
import * as actions from '../actions';

const mapStateToProps = state => {
  const { registrationState } = state;
  return { registrationState };
};

const actionCreators = {
  registration: actions.registration,
};

const validatePassword = (value, allValues) => {
  const { pass, confirmPass } = allValues;
  const result = pass !== confirmPass ? 'Пароли должны совпадать' : undefined;
  return result;
}

const renderField = ({ input, type, placeholder, meta }) => {
  return (
    <Fragment>
      <div className="col-sm-2">
        <input type={type} {...input} required component="input" className="form-control" id="" placeholder={placeholder} />
      </div>
      {meta.error && meta.touched &&
      <div className="registration-input-error">
        {meta.error}
      </div>}
    </Fragment>
  );
};

class Registration extends React.Component {
  handleSubmit = (values) => {
    const { reset, registration } = this.props;
    const { name, lastName, email, pass } = values;
    registration({ name, lastName, email, pass });
    reset();
  }

  render() {
    const { handleSubmit, registrationState } = this.props;
    const renderForm = () => {
      return (<div className="registration">
        <form onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Имя</label>
            <div className="col-sm-2">
              <Field name="name" type="text" required component="input" className="form-control" id="" placeholder="Имя" />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Фамилия</label>
            <div className="col-sm-2">
              <Field name="lastName" type="text" required component="input" className="form-control" id="" placeholder="Фамилия" />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Емейл</label>
            <div className="col-sm-2">
              <Field name="email" type="email" required component="input" className="form-control" id="" placeholder="Email" />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Пароль</label>
            <Field name="pass" type="password" required component={renderField} className="form-control" placeholder="Password" validate={[ validatePassword ]} />
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Повторите пароль</label>
            <Field name="confirmPass" type="password" required component={renderField} className="form-control" placeholder="Password" validate={[ validatePassword ]} />
          </div>
          <div className="form-group row">
            <div className="col-sm-10">
              <button type="submit" disabled={registrationState === 'requested'} className="btn btn-primary">Зарегестрироваться</button>
            </div>
          </div>
        </form>
      </div>);
    };

    const renderSuccess = () => {
      return (<div>На почту было отправлено письмо. Для завершения регистрации пройдите по ссылке в письме.</div>);
    };

    return registrationState === 'success' ? renderSuccess() : renderForm();
  }
}

const ConnectedRegistrationForm = connect(mapStateToProps, actionCreators)(Registration);

export default reduxForm({
  form: 'newRegistration',
})(ConnectedRegistrationForm);
