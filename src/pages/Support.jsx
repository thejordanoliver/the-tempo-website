import { Link } from "../router.jsx";
export default function Support() {
  return (
    <article className="tempo-info" aria-labelledby="tempo-support-title">
      <header>
        <p className="tempo-brand">Tempo Sports</p>
        <h1 id="tempo-support-title">Help &amp; Support</h1>
        <p>
          Need help with Tempo? Contact us about account access, app issues,
          sports information, privacy, or safety concerns.
        </p>
      </header>
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
          Email Tempo Support
        </a>
      </div>
      <p>
        If the button does not open your email app, copy the address above into
        your preferred email service.
      </p>
      <h2>Report an app issue</h2>
      <p>
        Include your Tempo username, device model, operating-system version, app
        version, and the steps that caused the issue. Screenshots can help; hide
        personal information and private conversations that are not needed to
        explain the problem.
      </p>
      <p>
        For incorrect scores or sports information, include the sport, league,
        teams or athletes, game date, and the screen where you noticed it.
      </p>
      <h2 id="account-access">Account access</h2>
      <p>
        Use <strong>Forgot Password</strong> on the login screen to reset your
        password. If you still cannot sign in, email support with the account
        email or username. Never send your password, authentication tokens, or
        password-reset codes.
      </p>
      <h2>Report content or abusive behavior</h2>
      <p>
        Use the reporting option available on the relevant profile, post,
        comment, or message. You can also email us with the username, a
        description of the concern, and enough context to identify the content.
        Use the subject <strong>Tempo Safety Report</strong> for safety
        concerns.
      </p>
      <p>
        You can block accounts through the app and manage blocked accounts in{" "}
        <strong>Settings → Blocked Accounts</strong>. For immediate danger,
        contact your local emergency services.
      </p>
      <h2>Delete your account</h2>
      <p>
        In Tempo, open <strong>Settings → Delete Account</strong> and confirm
        using your current password. If you cannot access your account, email
        support for assistance. We may need to verify ownership before acting on
        an account request.
      </p>
      <h2>Privacy requests</h2>
      <p>
        For access, correction, deletion, or other privacy questions, email us
        with the subject <strong>Tempo Privacy Request</strong>. Read our{" "}
        <Link to="/privacy/">Privacy Policy</Link> for information about how the
        app handles data.
      </p>
      <footer>
        <Link to="/privacy/">Privacy Policy</Link> ·{" "}
        <Link to="/">Tempo Sports home</Link>
      </footer>
    </article>
  );
}
