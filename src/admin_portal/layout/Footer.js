import React from 'react';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>About Us</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque urna eu purus tincidunt, nec elementum erat consequat.
            </p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">About</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <address>
              1234 Street Name<br />
              City, State, 56789<br />
              Email: <a href="mailto:info@example.com">info@example.com</a><br />
              Phone: (123) 456-7890
            </address>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Your Company. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
