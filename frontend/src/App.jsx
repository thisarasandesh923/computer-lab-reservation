
import './App.css';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

function App() {
    return (
        <div>
            <Navbar />

            <main>
                <section className="hero-section">
                    <div className="hero-content">
                        <h1>Find Your Lab. Book Your Time.</h1>

                        <p>
                            Check laboratory availability,
                            choose a suitable time slot,
                            and make your reservation easily.
                        </p>

                        <button className="explore-btn">
                            Explore Labs
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default App;
