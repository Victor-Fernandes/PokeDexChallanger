import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {

  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; {currentYear} Pokédex App - Desenvolvido com ❤️
        </p>
        <p className="credits">
          Dados fornecidos pela PokeAPI
        </p>
      </div>
    </footer>
  );
};

export default Footer;
