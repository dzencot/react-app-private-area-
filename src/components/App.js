import React from 'react';
import { connect } from 'react-redux';

import '../css/App.css';

import Authorization from './Authorization';
import Registration from './Registration';
import Info from './Info';
import Sevices from './Services';
import Payments from './Payments';

import * as actions from '../actions';

const mapStateToProps = state => {
  const props = {
    appState: state.appState,
  };
  return props;
};

const actionCreators = {
  openPayments: actions.openPayments,
  openServices: actions.openServices,
  openInfo: actions.openInfo,
};

class App extends React.Component {

  getRender(action) {
    switch (action) {
      case 'info':
        return <Info />;
      case 'payments':
        return <Payments />;
      case 'services':
        return <Sevices />;
      default:
        return <Info />;
    }
  }

  render() {
    const { action, authorized } = this.props.appState
    const { openInfo, openServices, openPayments } = this.props;
    if (action === 'registration') {
      return <Registration />;
    }
    if (!authorized) {
      return (
        <Authorization />
      );
    }
    return (
      <div>
        <ul className="nav">
          <li className="nav-item">
            <a className={action === 'info' ? "disabled nav-link" : "nav-link"} onClick={() => openInfo()} href="#edit">Редактирование профиля</a>
          </li>
          <li className="nav-item">
            <a className={action === 'services' ? "disabled nav-link" : "nav-link"} onClick={() => openServices()} href="#services">Счета</a>
          </li>
          <li className="nav-item">
            <a className={action === 'payments' ? "disabled nav-link" : "nav-link"} onClick={() => openPayments()} href="#payments">История баланса</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/">Выход</a>
          </li>
        </ul>
        {this.getRender(action)}
      </div>
    );
  };
}

const ConnectedPayments = connect(mapStateToProps, actionCreators)(App);

export default ConnectedPayments;
