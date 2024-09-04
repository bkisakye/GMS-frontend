import React, { Component } from 'react';
import { Outlet, Link } from 'react-router-dom';


export default class Sidemenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSubMenu: null,
      isSidebarOpen: false,
    };
  }

  toggleSubMenu = (index) => {
    this.setState((prevState) => ({
      activeSubMenu: prevState.activeSubMenu === index ? null : index,
    }));
  };

  toggleSidebar = () => {
    this.setState((prevState) => ({
      isSidebarOpen: !prevState.isSidebarOpen,
    }));
  };

  render() {
    const { activeSubMenu, isSidebarOpen } = this.state;

    return (
      <div>
        <div className={`sidebar sidebar-dark sidebar-main sidebar-expand-lg ${isSidebarOpen ? 'sidebar-expanded' : ''}`}>
          <div className="sidebar-mobile-toggler text-center">
            <button className="sidebar-mobile-main-toggle btn btn-light" onClick={this.toggleSidebar}>
              <i className={`icon-arrow-left8 ${isSidebarOpen ? 'open' : ''}`} />
            </button>
            Navigation
            <button className="sidebar-mobile-expand btn btn-light" onClick={this.toggleSidebar}>
              <i className={`icon-screen-full ${isSidebarOpen ? 'open' : ''}`} />
              <i className={`icon-screen-normal ${!isSidebarOpen ? 'open' : ''}`} />
            </button>
          </div>
          <div className="sidebar-content">
            <div className="card card-sidebar-mobile">
              <ul className="nav nav-sidebar" data-nav-type="accordion">
                <li className="nav-item">
                  <Link to="" className="nav-link active">
                    <i className="icon-home4" />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li className={`nav-item nav-item-submenu ${activeSubMenu === 1 ? 'nav-item-expanded' : ''}`}>
                  <a href="#" className="nav-link" onClick={() => this.toggleSubMenu(1)}>
                    <i className="icon-tree6" /> <span>Subgrantee Management</span>
                  </a>
                  <ul className={`nav nav-group-sub ${activeSubMenu === 1 ? 'd-block' : 'd-none'}`}>
                    <li className="nav-item">
                      <Link to="subgrantees_list" className="nav-link"><i className="icon-tree7" /> Subgrantee List</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="subgrantee-registration-request" className="nav-link"><i className="icon-tree7" /> Subgrantee Registration Request</Link>
                    </li>
                  </ul>
                </li>
                <li className={`nav-item nav-item-submenu ${activeSubMenu === 3 ? 'nav-item-expanded' : ''}`}>
                  <a href="#" className="nav-link" onClick={() => this.toggleSubMenu(3)}>
                    <i className="icon-calendar2" /> <span>Grants Management</span>
                  </a>
                  <ul className={`nav nav-group-sub ${activeSubMenu === 3 ? 'd-block' : 'd-none'}`}>
                    <li className='nav-item'><Link to="index" className='nav-link'><i className='icon-star' />Grants</Link></li>
                    <li className="nav-item"><Link to="applications_list" className="nav-link"><i className="icon-star" /> Applications</Link></li>
                    <li className='nav-item'><Link to="donors" className='nav-link'><i className='icon-start' />Donors</Link></li>
                    <li className='nav-item'><Link to="types" className='nav-link'><i className='icon-start' />Grant Types</Link></li>
                    <li className='nav-item'><Link to="closeout-requests" className='nav-link'><i className='icon-start' />Requests</Link></li>
                  </ul>
                </li>
                <li className={`nav-item nav-item-submenu ${activeSubMenu === 4 ? 'nav-item-expanded' : ''}`}>
                  <a href="#" className="nav-link" onClick={() => this.toggleSubMenu(4)}>
                    <i className="icon-briefcase3" /> <span>Reports</span>
                  </a>
                  <ul className={`nav nav-group-sub ${activeSubMenu === 4 ? 'd-block' : 'd-none'}`}>
                    <li className="nav-item"><a href="progress-reports" className="nav-link">Progress Reports</a></li>
                  </ul>
                </li>
                <li className={`nav-item nav-item-submenu ${activeSubMenu === 5 ? 'nav-item-expanded' : ''}`}>
                  <a href="#" className="nav-link" onClick={() => this.toggleSubMenu(5)}>
                    <i className="icon-medal-star" /> <span>Financials Management</span>
                  </a>
                  <ul className={`nav nav-group-sub ${activeSubMenu === 5 ? 'd-block' : 'd-none'}`}>
                    <li className='nav-item'><a href="grant-accounts" className='nav-link'>Grants Accounts</a></li>
                  </ul>
                </li>
                <li className={`nav-item nav-item-submenu ${activeSubMenu === 6 ? 'nav-item-expanded' : ''}`}>
                  <a href="#" className="nav-link" onClick={() => this.toggleSubMenu(6)}>
                    <i className="icon-gift" /> <span>Settings</span>
                  </a>
                  <ul className={`nav nav-group-sub ${activeSubMenu === 6 ? 'd-block' : 'd-none'}`}></ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
