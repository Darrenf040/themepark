import Header from "../components/header";
import "./home.css";

export default function Home() {
  return (
    <div className="home">
      <Header />
      <div className="hero-container">
        <div className="banner">
          <div className="scrolling-text">
            Welcome to the Themepark, where every corner is filled with thrills,
            magic, and excitement! whether you re seeking adrenaline-pumping
            rides, immersive experiences, or family-friendly fun, ThemePark has
            something for everyone.
          </div>
        </div>
      </div>
    </div>
  );
}
