// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import PokemonList from './components/PokemonList/PokemonList';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './app.module.css';
import './app.css';

export function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <PokemonList />
      </main>
      <Footer />
    </div>
  );
}

export default App;
