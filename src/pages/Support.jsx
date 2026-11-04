import { Link } from "../app/router.jsx";
export default function Support() {
  return (
    <article className="tempo-info" aria-labelledby="tempo-support-title">
      <h1 id="tempo-support-title" className="sr-only">
        Support
      </h1>
      <div className="tempo-contact">
        <p>
          <strong>Email support</strong>
          <br />
          <a href="mailto:jordanoliver@thetemposports.com">
            jordanoliver@thetemposports.com
          </a>
        </p>
        <a
          className="tempo-button"
          href="mailto:jordanoliver@thetemposports.com?subject=Tempo%20Support"
        >
          Email support
        </a>
      </div>
      <h2>Report an app issue</h2>
      <p>
        Include your username, device, operating system, app version, and steps
        to reproduce the issue. Hide private information in screenshots.
      </p>
      <p>
        For incorrect scores or sports information, include the league, teams or
        athletes, game date, and screen.
      </p>
      <h2 id="account-access">Account access</h2>
      <p>
        Reset your password with <strong>Forgot Password</strong> in the app.
        Still locked out? Email your account email or username to support. Never
        send passwords, authentication tokens, or reset codes.
      </p>
      <h2>Report content or abusive behavior</h2>
      <p>
        Report the profile, post, comment, or message in the app. You can also
        email the username and relevant details with the subject{" "}
        <strong>Tempo Safety Report</strong>.
      </p>
      <p>
        Manage blocked accounts in <strong>Settings → Blocked Accounts</strong>.
        For immediate danger, contact your local emergency services.
      </p>
      <h2>Delete your account</h2>
      <p>
        Open <strong>Settings → Delete Account</strong> in the app and confirm
        with your password. If you cannot sign in, email support. We may need to
        verify account ownership.
      </p>
      <h2>Privacy requests</h2>
      <p>
        Email access, correction, deletion, or other privacy requests with the
        subject <strong>Tempo Privacy Request</strong>. See our{" "}
        <Link to="/privacy/">Privacy Policy</Link>.
      </p>
      <footer>
        <Link to="/privacy/">Privacy Policy</Link> · <Link to="/">Home</Link>
      </footer>
    </article>
  );
}
