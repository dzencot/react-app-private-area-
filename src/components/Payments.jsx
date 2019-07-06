import React from 'react';
import { connect } from 'react-redux';
import { Pagination } from 'react-bootstrap';
// import cn from 'classnames';
import '../css/Payments.css';
import * as actions from '../actions';

const mapStateToProps = state => {
  const { paymentsState } = state;
  return { paymentsState };
};

const actionCreators = {
  loadPayments: actions.loadPayments,
};

class Payments extends React.Component {
  componentDidMount() {
    const { loadPayments } = this.props;
    loadPayments(0);
  }

  renderPayment(payment, index) {
    return (
      <tr key={payment.id}>
        <th scope="row">{index + 1}</th>
        <td>{payment.type}</td>
        <td>{payment.price} руб.</td>
        <td>{payment.date}</td>
      </tr>
    );
  }

  onClickPage = (num) => {
    const { loadPayments } = this.props;
    loadPayments(num - 1);
  }

  renderPayments(payments, currentPage, pages, offset, balance) {
    const items = [];
    for (let i = 1; i <= pages; i += 1) {
      items.push(
        <Pagination.Item onClick={() => this.onClickPage(i)} key={i} size="sm" active={i === currentPage}>
          {i}
        </Pagination.Item>
      );
    }

    return (
      <div>
        <div className="balance">Текущий баланс: {balance}</div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Услуга</th>
              <th scope="col">Сумма</th>
              <th scope="col">Дата списания</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => this.renderPayment(payment, parseInt(index) + parseInt(offset)))}
          </tbody>
        </table>
        <div>
          <Pagination size="sm">
            {items}
          </Pagination>
        </div>
      </div>
    );
  }

  render() {
    const { currentPage, pages, payments, status, offset, balance } = this.props.paymentsState;
    const currentPayments = payments ? payments : [];
    if (status === 'success') {
      return this.renderPayments(currentPayments, parseInt(currentPage) + 1, pages, offset, balance);
    }
    return '';
  }
}

const ConnectedPayments = connect(mapStateToProps, actionCreators)(Payments);

export default ConnectedPayments;
