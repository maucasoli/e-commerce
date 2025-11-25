import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-5 py-4 bg-light border-top">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h3>Informations</h3>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-decoration-none text-muted">
                  À propos
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-muted">
                  Conditions générales
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-muted">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-muted">
                  Mentions légales
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-6">
            <h3>Contacts</h3>
            <ul className="list-unstyled">
              <li className="text-muted">Email: contact@livresgourmands.net</li>
              <li className="text-muted">Téléphone: +1 866-345-6053</li>
              <li className="text-muted">
                Adresse: 220 Av. Fairmount O, Montréal, QC H2T 2M7
              </li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <small className="text-muted">
            © {new Date().getFullYear()} LivresGourmands.net - Tous droits
            réservés
          </small>
        </div>
      </div>
    </footer>
  );
}
