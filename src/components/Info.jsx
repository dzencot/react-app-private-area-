import React from 'react';
import { connect } from 'react-redux';
// import cn from 'classnames';
import '../css/Authorization.css';
import * as actions from '../actions';

const mapStateToProps = state => {
  const { infoState } = state;
  return { infoState };
};

const actionCreators = {
};

class Info extends React.Component {
  render() {
    return (
      <div>Info</div>
    );
  }
}

export default connect(mapStateToProps, actionCreators)(Info);

