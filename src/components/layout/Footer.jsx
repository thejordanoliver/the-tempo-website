import { Link } from "../../app/router.jsx";
export function Footer() {
  return (
    <footer className="site-footer">
      <span>TEMPO SPORTS</span>
      <Link to="/support/">Support</Link>
      <Link to="/privacy/">Privacy Policy</Link>
      <a href="mailto:jordanoliver@thetemposports.com">Contact</a>
    </footer>
  );
}
