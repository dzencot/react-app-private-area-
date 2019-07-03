import React from 'react';
import { connect } from 'react-redux';
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

  auth = (event) => {
    event.preventDefault();
    const { authorization } = this.props;
    authorization({ login: 'ivan', pass: '1234' });
  };

  registration = (event) => {
    event.preventDefault();
    const { registrationStart } = this.props;
    registrationStart();
  }

  render() {
    const { authorizationState } = this.props;
    return (
      <div className="authorization">
        <form className="authorization-form">
          <div className="form-group">
            <label>Email address</label>
            <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
          </div>
          <button disabled={authorizationState === 'requested'} type="submit" className="btn btn-primary" onClick={this.auth}>Submit</button>
          <button className="button-registration btn btn-link" onClick={this.registration}>Registration</button>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Authorization);
