import React from 'react';
import { connect } from 'react-redux';
import { Pagination } from 'react-bootstrap';
// import cn from 'classnames';
import '../css/Services.css';
import * as actions from '../actions';

const mapStateToProps = state => {
  const { servicesState } = state;
  return { servicesState };
};

const actionCreators = {
  loadServices: actions.loadServices,
};

class Services extends React.Component {
  componentDidMount() {
    const { loadServices } = this.props;
    loadServices(0);
  }

  renderPayment(service, index) {
    return (
      <tr key={service.id}>
        <th scope="row">{index + 1}</th>
        <td>{service.type}</td>
        <td>{service.price} руб.</td>
        <td>{service.status === 'paid' ? 'Оплачено' : 'Выставлен'}</td>
      </tr>
    );
  }

  onClickPage = (num) => {
    const { loadServices } = this.props;
    loadServices(num - 1);
  }

  renderServices(services, currentPage, pages, offset) {
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
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Вид услуги</th>
              <th scope="col">Сумма</th>
              <th scope="col">Статус заказа</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => this.renderPayment(service, parseInt(index) + parseInt(offset)))}
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
    const { currentPage, pages, services, status, offset } = this.props.servicesState;
    const currentServices = services ? services : [];
    if (status === 'success') {
      return this.renderServices(currentServices, parseInt(currentPage) + 1, pages, offset);
    }
    return '';
  }
}

const ConnectedServices = connect(mapStateToProps, actionCreators)(Services);

export default ConnectedServices;

