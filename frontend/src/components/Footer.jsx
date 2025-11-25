import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-5 py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h3 className="mb-4">Informations</h3>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white-50 hover-white">
                  À propos
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white-50 hover-white">
                  Conditions générales
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white-50 hover-white">
                  Politique de confidentialité
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white-50 hover-white">
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-6">
            <h3 className="mb-4">Contacts</h3>
            <ul className="list-unstyled text-white-50">
              <li className="mb-2">Email: contact@livresgourmands.net</li>
              <li className="mb-2">Téléphone: +1 866-345-6053</li>
              <li className="mb-2">
                Adresse: 220 Av. Fairmount O, Montréal, QC H2T 2M7
              </li>
            </ul>
          </div>
        </div>
        <hr className="border-secondary" />
        <div className="text-center">
          <small className="text-white-50">
            © {new Date().getFullYear()} LivresGourmands.net - Tous droits
            réservés
          </small>
        </div>
      </div>
    </footer>
  );
}
