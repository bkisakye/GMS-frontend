import React from "react";


const Footer = () => {
  return (
    <footer className="footer bg-light text-dark py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5 className="font-weight-bold">About Us</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              scelerisque urna eu purus tincidunt, nec elementum erat consequat.
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className="font-weight-bold">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-dark">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-dark">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-dark">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-dark">
                  About
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5 className="font-weight-bold">Contact Us</h5>
            <address>
              1234 Street Name
              <br />
              City, State, 56789
              <br />
              Email:{" "}
              <a href="mailto:info@example.com" className="text-dark">
                info@example.com
              </a>
              <br />
              Phone: (123) 456-7890
            </address>
          </div>
        </div>
      </div>
      <div className="footer-bottom bg-dark text-white py-2">
        <div className="container text-center">
          <p className="mb-0">&copy; 2024 Your Company. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
