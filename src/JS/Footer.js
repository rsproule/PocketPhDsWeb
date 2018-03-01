import '../CSS/footer.css';

import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <div className="bottom">
        <footer className="footer">
          <br />

          <p>© Pocket PhDs, Inc.</p>

          <p>
            PRIVACY POLICY: The Company shall hold all Confidential Information
            in confidence in accordance with the terms of a signed agreement
            with the Client. The Company shall use Confidential Information
            solely for the purpose of distributing to Independent Contract
            Tutors to contact the Client for Tutoring Services. In this policy,
            “Confidential Information” means the Name of the Client, the Phone
            Number of the Client, and the Email Address of the Client.
          </p>

          <p>
            {' '}
            ​ REFUND POLICY: Pocket PhD's does not provide refunds for unlimited
            tutoring services.
          </p>
          <p>v1.0.30</p>
        </footer>
      </div>
    );
  }
}

export default Footer;
