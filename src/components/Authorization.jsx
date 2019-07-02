import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

const mapStateToProps = state => {
  const props = {
    appState: state.appState,
  };
  return props;
};

class Authorization extends React.Component {

  auth = () => {
    const { dispatch } = this.props;
    console.log('click');
    console.log(actions);
    dispatch(actions.auth({ login: 'ivan', pass: '1234' }));
  };

  render() {
    return (
      <button onClick={this.auth}>Войти</button>
    );
  }
}

export default connect(mapStateToProps)(Authorization);
