import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="section bg-footer" style={{ backgroundColor: "#2C3E50" }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="">
              <h6 className="footer-heading text-uppercase text-white">
                About Us
              </h6>
              <ul className="list-unstyled footer-link mt-4" style={{ color: "#ECF0F1" }}>
                <li>
                  <a href="#" style={{ color: "#ECF0F1" }}>Company Info</a>
                </li>
                <li>
                  <a href="#" style={{ color: "#ECF0F1" }}>Careers</a>
                </li>
                <li>
                  <a href="#" style={{ color: "#ECF0F1" }}>Press</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="">
              <h6 className="footer-heading text-uppercase text-white">
                Support
              </h6>
              <ul className="list-unstyled footer-link mt-4" style={{ color: "#ECF0F1" }}>
                <li>
                  <a href="#" style={{ color: "#ECF0F1" }}>Help Center</a>
                </li>
                <li>
                  <a href="#" style={{ color: "#ECF0F1" }}>Contact Us</a>
                </li>
                <li>
                  <a href="#" style={{ color: "#ECF0F1" }}>FAQs</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="">
              <h6 className="footer-heading text-uppercase text-white">
                Contact
              </h6>
              <p className="contact-info mt-4" style={{ color: "#ECF0F1" }}>
                Need assistance? Reach out to us.
              </p>
              <p className="contact-info" style={{ color: "#ECF0F1" }}>+91 9999999999</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <p className="footer-alt mb-0 f-14" style={{ color: "#ECF0F1" }}>All Rights Reserved</p>
      </div>
    </footer>
  );
}

export default Footer;
