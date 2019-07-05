import React from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
// import cn from 'classnames';
import '../css/Authorization.css';
import * as actions from '../actions';

const mapStateToProps = state => {
  const { authorizationState } = state;
  return { authorizationState };
};

const actionCreators = {
  registrationStart: actions.registrationStart,
  authorization: actions.authorization,
};

class Authorization extends React.Component {

  handleSubmit = (values) => {
    const { reset, authorization } = this.props;
    const { email, password } = values;
    authorization({ login: email, pass: password });
    reset();
  };

  registration = (event) => {
    event.preventDefault();
    const { registrationStart } = this.props;
    registrationStart();
  }

  render() {
    const { handleSubmit, authorizationState } = this.props;
    return (
      <div className="authorization">
        <form className="authorization-form" onSubmit={handleSubmit(this.handleSubmit)}>
          <div className="form-group">
            <label>Email:</label>
            <Field name="email" component="input" type="email" className="form-control" id="inputEmail" required aria-describedby="emailHelp" placeholder="Enter email" />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <Field name="password" component="input" type="password" required className="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div>
          {authorizationState === 'failed' ?
            <div className="authorization-error">
              Неверный логин или пароль. Либо пользователь не активирован.
            </div> : ''}
          <button disabled={authorizationState === 'requested'} type="submit" className="btn btn-primary" onClick={this.auth}>Submit</button>
          <button className="button-registration btn btn-link" onClick={this.registration}>Registration</button>
        </form>
      </div>
    );
  }
}

const ConnectedAuthorization = connect(mapStateToProps, actionCreators)(Authorization);

export default reduxForm({
  form: 'newAuthorization',
})(ConnectedAuthorization);
