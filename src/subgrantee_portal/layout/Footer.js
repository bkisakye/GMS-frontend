import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class Footer extends Component {
  render() {
    return (
      <footer className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-text">
            © 2024{" "}
            <a href="/test" className="text-primary">
              Subgrants Management System
            </a>{" "}
            - Baylor Foundation
          </span>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a href="test" className="nav-link" target="_blank">
                <i className="icon-lifebuoy mr-2" /> Support
              </a>
            </li>
            <li className="nav-item">
              <a href="test" className="nav-link" target="_blank">
                <i className="icon-file-text2 mr-2" /> Docs
              </a>
            </li>
          </ul>
        </div>
      </footer>
    );
  }
}
