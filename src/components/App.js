import React from 'react';
import { connect } from 'react-redux';

import '../css/App.css';

import Authorization from './Authorization';
import Registration from './Registration';
import Info from './Info';

const mapStateToProps = state => {
  const props = {
    appState: state.appState,
  };
  return props;
};

class App extends React.Component {

  getRender(action) {
    switch (action) {
      case 'info':
        return <Info />;
        break;
      default:
        return <Info />;
    }
  }

  render() {
    const { action, authorized } = this.props.appState
    if (action === 'registration') {
      return <Registration />;
    }
    if (!authorized) {
      return (
        <Authorization />
      );
    }
    return this.getRender(action);
  };
}

export default connect(mapStateToProps)(App);
