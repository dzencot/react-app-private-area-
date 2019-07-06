import React, { Fragment } from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
// import cn from 'classnames';
import '../css/Authorization.css';
import * as actions from '../actions';

const mapStateToProps = state => {
  const { infoState } = state;
  return { infoState };
};

const actionCreators = {
  loadInfo: actions.loadInfo,
  updateInfo: actions.updateInfo,
  inputInfo: actions.inputInfo,
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

class Info extends React.Component {
  componentDidMount() {
    const { loadInfo } = this.props;
    loadInfo();
  }

  handleSubmit = (values) => {
    const { reset, updateInfo, infoState } = this.props;
    const { name, lastName, email, paymentInfo } = infoState;
    const { pass, oldPass } = values;
    updateInfo({
      name,
      lastName,
      email,
      pass,
      oldPass,
      paymentInfo,
    });
    reset();
  }

  onChangeInput = (name) => (event) => {
    const { inputInfo } = this.props;
    const value = event.target.value;
    inputInfo({ name, value });
  };

  renderModal() {
    // TODO: доделать модальное окно
    const { infoState } = this.props;
    const { status } = infoState;
    Modal.setAppElement('#container');

    return <Modal
      className="success-update"
      isOpen={status === 'successUpdate'}
      overlayClassName="success-update-overlay"
    >
      Данные обновлены
    </Modal>
  }

  render() {
    const { handleSubmit, infoState } = this.props;
    const { status, name, lastName, email, paymentInfo } = infoState;
    return (<div className="registration">
      <form onSubmit={handleSubmit(this.handleSubmit)}>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Имя</label>
          <div className="col-sm-2">
            <input defaultValue={name} onChange={this.onChangeInput('name')} name="name" type="text" required component="input" className="form-control" id="" placeholder="Имя" />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Фамилия</label>
          <div className="col-sm-2">
            <input defaultValue={lastName} onChange={this.onChangeInput('lastName')} name="lastName" type="text" required component="input" className="form-control" id="" placeholder="Фамилия" />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Емейл</label>
          <div className="col-sm-2">
            <input defaultValue={email} onChange={this.onChangeInput('email')} name="email" type="email" required component="input" className="form-control" id="" placeholder="Email" />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Новый пароль</label>
          <Field name="pass" type="password" component={renderField} className="form-control" placeholder="Password" validate={[ validatePassword ]} />
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Повторите новый пароль</label>
          <Field name="confirmPass" type="password" component={renderField} className="form-control" placeholder="Password" validate={[ validatePassword ]} />
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Введите старый пароль</label>
          <div className="col-sm-2">
            <Field name="oldPass" type="password" required component="input" className="form-control" placeholder="Password" />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">Платежные данные</label>
          <div className="col-sm-2">
            <input defaultValue={paymentInfo} onChange={this.onChangeInput('paymentInfo')} name="paymentInfo" type="text" component="input" className="form-control" placeholder="" />
          </div>
        </div>
        <div className="form-group row">
          <div className="col-sm-10">
            <button type="submit" disabled={status === 'requested'} className="btn btn-primary">Сохранить</button>
          </div>
        </div>
      </form>
      {this.renderModal()}
    </div>);
  }
}

const ConnectedInfo = connect(mapStateToProps, actionCreators)(Info);

export default reduxForm({
  form: 'newInfo',
})(ConnectedInfo);
