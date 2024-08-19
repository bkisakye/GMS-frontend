import React, { Component } from 'react'

export default class Footer extends Component {
  render() {
    return (
      <div>
        <div className="navbar navbar-expand-lg navbar-light">
  <div className="text-center d-lg-none w-100">
    <button type="button" className="navbar-toggler dropdown-toggle" data-toggle="collapse" data-target="#navbar-footer">
      <i className="icon-unfold mr-2" />
      Footer
    </button>
  </div>
  <div className="navbar-collapse collapse" id="navbar-footer">
    <span className="navbar-text">
      © 2024 <a href="/test">Subgrants Managemnent System</a> - Baylor Foundation 
    </span>
    <ul className="navbar-nav ml-lg-auto">
      <li className="nav-item"><a href="test" className="navbar-nav-link" target="_blank"><i className="icon-lifebuoy mr-2" /> Support</a></li>
      <li className="nav-item"><a href="test" className="navbar-nav-link" target="_blank"><i className="icon-file-text2 mr-2" /> Docs</a></li>
    </ul>
  </div>
</div>

      </div>
    )
  }
}
