import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default class Footer extends Component {
  render() {
    return (
      <footer className="bg-white py-3 border-top">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6">
              <span className="text-muted">
                © 2024{" "}
                <a href="/test" className="text-primary text-decoration-none">
                  Subgrants Management System
                </a>{" "}
                - Baylor Foundation
              </span>
            </div>
            <div className="col-md-6">
              <ul className="nav justify-content-end">
                <li className="nav-item">
                  <a
                    href="test"
                    className="nav-link text-muted"
                    target="_blank"
                  >
                    <i className="bi bi-life-preserver me-2"></i>Support
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="test"
                    className="nav-link text-muted"
                    target="_blank"
                  >
                    <i className="bi bi-file-text me-2"></i>Docs
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
