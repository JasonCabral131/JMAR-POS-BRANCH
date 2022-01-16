import React from "react";

import "./footer.scss";

const Footer = (props) => {
  return (
    <div className="gpt3__footer section__padding">
      <div className="gpt3__footer-heading">
        <h1 className="gradient__text">
          Do you want to step in and Start you Future{" "}
        </h1>
      </div>
      <div className="gpt3__footer-btn">
        <p>Register Now</p>
      </div>
      <div className="gpt3__footer-links">
        <div className="gpt3__footer-links_div">
          <h4>Links</h4>
          <p
            onClick={() => {
              window.location.href =
                "https://www.facebook.com/Jarm-Grocery-Sale-Service-107363775176523";
            }}
          >
            Facebook
          </p>
          <p>Instragram</p>
        </div>
        <div className="gpt3__footer-links_div">
          <h4>Company</h4>
          <p>Terms & condition</p>
          <p>Privacy And Policy</p>
        </div>
        <div className="gpt3__footer-links_div">
          <h4>Get in Touch</h4>
          <p>248 San Antonio St. Dagami,Leyte</p>
          <p>09959524131</p>
          <p>jarm.grocery.sale.service@gmail.com</p>
        </div>
        <div className="gpt3__footer-links_div">
          <h4>Behind the Project</h4>
          <div className="gpt3__footer-link-project">
            <img
              alt="profile"
              src="https://scontent.fmnl4-5.fna.fbcdn.net/v/t39.30808-6/219787501_1711093425749577_3761514232438356850_n.jpg?_nc_cat=106&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=17s75PS9iIwAX8pPzDP&_nc_ht=scontent.fmnl4-5.fna&oh=413e69d7ded145f946c71ea6f16cc886&oe=61A185DE"
            />
            <p
              className="ml-2"
              onClick={() => {
                window.location.href = "https://www.facebook.com/jsoncabs/";
              }}
            >
              Jason P. Cabral
            </p>
          </div>
          <div className="gpt3__footer-link-project">
            <img
              alt="profile"
              src="https://scontent.fmnl4-2.fna.fbcdn.net/v/t1.18169-9/1380729_222990344529541_1242748563_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=730e14&_nc_ohc=9eQVWr06UKYAX83OunF&_nc_ht=scontent.fmnl4-2.fna&oh=171db9e69caa92155dae19606ad8e182&oe=61C16381"
            />
            <p
              className="ml-2"
              onClick={() => {
                window.location.href = "https://www.facebook.com/zxzKim";
              }}
            >
              Mark Kemm Asdilla
            </p>
          </div>
          <div className="gpt3__footer-link-project">
            <img
              alt="profile"
              src="https://scontent.fmnl4-6.fna.fbcdn.net/v/t39.30808-6/257189231_303646144963301_7202599614691907285_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=09cbfe&_nc_ohc=hNAGTNfhhU0AX-2QraY&tn=veekfiabsx1qeOIL&_nc_ht=scontent.fmnl4-6.fna&oh=815559715548a610232e2fc86b3c2ead&oe=61A1071E"
            />
            <p
              className="ml-2"
              onClick={() => {
                window.location.href =
                  "https://www.facebook.com/rena.aduana.73";
              }}
            >
              Rena Aduana
            </p>
          </div>
          <div className="gpt3__footer-link-project">
            <img
              alt="profile"
              src="https://scontent.fmnl4-2.fna.fbcdn.net/v/t1.6435-9/74269985_2532548843448105_5131148998479970304_n.jpg?_nc_cat=101&ccb=1-5&_nc_sid=8bfeb9&_nc_ohc=1z7MzCmA_gUAX-w81Ws&_nc_ht=scontent.fmnl4-2.fna&oh=4b2e87d59495b4c48dfd86c73d1e4118&oe=61C29F57"
            />
            <p
              className="ml-2"
              onClick={() => {
                window.location.href = "https://www.facebook.com/aldsome";
              }}
            >
              Mark Antony Tan
            </p>
          </div>
        </div>
      </div>
      <div className="gpt3__footer-copyright">
        <p>@ 2022 7-11-capstones-project. All rights reserved</p>
      </div>
    </div>
  );
};
export default Footer;
