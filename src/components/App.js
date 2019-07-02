import React from 'react';
import { connect } from 'react-redux';

import '../css/App.css';

import Authorization from './Authorization';

const mapStateToProps = state => {
  const props = {
    appState: state.appState,
  };
  return props;
};

class App extends React.Component {
  checkAuthorization() {
    return false;
  }

  render() {
    if (!this.checkAuthorization()) {
      return (
        <Authorization />
      );
    }
  };
}

export default connect(mapStateToProps)(App);
