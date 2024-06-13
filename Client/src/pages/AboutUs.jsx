import React from 'react';

function AboutUs() {
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col text-center">
          <h1 className="mb-4">About Us</h1>
          <p>
            Welcome to Melon Magnets, your number one source for all things fridge magnets, thin badges, and pin badges. We're dedicated to providing you the very best of unique and creative magnets, with an emphasis on quality, affordability, and customer service.
          </p>
          <p>
            Melon Magnets has come a long way from its beginnings in Bengaluru, Karnataka. When we first started out, our passion for unique fridge magnets drove us to start our own business.
          </p>
          <p>
            We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
          </p>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col text-center">
          <h2>Contact Us</h2>
          <div className="mt-3">
            <strong>Email:</strong> <a href="mailto:hello@melonmagnets.com">hello@melonmagnets.com</a>
          </div>
          <div className="mt-3">
            <strong>Address:</strong> Vizbook, KPC Layout, Bengaluru, Karnataka, 560035
          </div>
          <div className="mt-3">
            <strong>Contact Number:</strong> <a href="tel:8618012964">8618012964</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
