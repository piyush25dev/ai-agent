
"use client";

import Link from "next/link";

export default function TermsAndConditions() {
  const sectionStyle = {
    marginBottom: "28px",
    lineHeight: 1.8,
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0b0b12",
      color: "#e8e6f0",
      padding: "60px 20px",
      fontFamily: "Arial, sans-serif",
    }}>
      <article style={{
        maxWidth: "850px",
        margin: "0 auto",
      }}>
        <Link href="/login" style={{
          color: "#b9a0ff",
          textDecoration: "none",
        }}>
          ← Back to Login
        </Link>

        <h1 style={{ fontSize: "38px", marginTop: "32px" }}>
          Terms and Conditions
        </h1>

        <p style={{ color: "#aaa5b8" }}>
          Last updated: October 21, 2026
        </p>

        <p style={sectionStyle}>
          Welcome to AI Agent. These Terms and Conditions govern your
          access to and use of the AI Agent application. By accessing
          or using the app, you agree to these terms. If you do not
          agree, please discontinue using the service.
        </p>

        <section style={sectionStyle}>
          <h2>1. Description of the Service</h2>
          <p>
            AI Agent is an AI-powered application that allows users to
            submit prompts, receive AI-generated responses, manage chat
            conversations, and use supported tools such as a calculator.
            Features may change as the application develops.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>2. Account and Authentication</h2>
          <p>
            You may need to sign in with Google to access certain
            features. You are responsible for maintaining control of
            your account and for activity performed through it.
          </p>
          <p>
            You agree to provide accurate information where requested
            and not to misuse another person's account or identity.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>3. Acceptable Use</h2>
          <p>You agree not to use AI Agent to:</p>
          <ul>
            <li>Violate applicable laws or regulations.</li>
            <li>Infringe another person's rights or intellectual property.</li>
            <li>Attempt unauthorized access to accounts or systems.</li>
            <li>Distribute malware or interfere with the service.</li>
            <li>Abuse, disrupt, or overload the application or its providers.</li>
            <li>Generate or distribute unlawful or harmful content.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2>4. AI-Generated Content</h2>
          <p>
            AI-generated responses can be inaccurate, incomplete,
            outdated, or misleading. You are responsible for reviewing
            and verifying responses before relying on them.
          </p>
          <p>
            AI Agent does not guarantee that responses are accurate,
            suitable for a particular purpose, or free from errors.
            Do not rely solely on AI responses for medical, legal,
            financial, safety-critical, or other high-impact decisions.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>5. Your Content</h2>
          <p>
            You retain whatever rights you have in the prompts and other
            content you submit. You grant us permission to process that
            content as reasonably necessary to operate the service,
            provide responses, store chat history, and maintain security.
          </p>
          <p>
            You are responsible for ensuring that you have the rights
            and permissions needed to submit your content.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>6. Third-Party Services</h2>
          <p>
            AI Agent may depend on third-party services, including
            Firebase, Google Authentication, and AI providers accessed
            through OpenRouter. Their availability, policies, and terms
            may affect your use of the application.
          </p>
          <p>
            Your use of third-party services may also be subject to
            their separate terms and privacy policies.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>7. Availability and Changes</h2>
          <p>
            We may modify, suspend, or discontinue features to maintain
            or improve the service. We do not guarantee uninterrupted
            availability, error-free operation, or permanent storage
            of chat history.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>8. Intellectual Property</h2>
          <p>
            The application's design, branding, and original software
            are owned by or licensed to their respective rights holders.
            These terms do not transfer ownership of the application
            to you. You may not copy, redistribute, or misuse protected
            parts of the service without appropriate permission.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>9. Disclaimer and Liability</h2>
          <p>
            To the extent permitted by applicable law, the service is
            provided on an "as is" and "as available" basis, without
            warranties that cannot lawfully be excluded.
          </p>
          <p>
            To the extent permitted by applicable law, we are not liable
            for indirect or consequential losses arising from use of
            the service. Nothing in these terms excludes liability
            that cannot legally be excluded.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>10. Suspension or Termination</h2>
          <p>
            Access may be suspended or terminated if you materially
            violate these terms, misuse the service, or if suspension
            is necessary for security or legal compliance.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>11. Changes to These Terms</h2>
          <p>
            We may revise these terms as the application evolves.
            Updated terms will be published on this page with a revised
            date. Continued use after changes take effect constitutes
            acceptance where permitted by applicable law.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>12. Governing Law</h2>
          <p>
            These terms are subject to applicable laws. The governing
            law and dispute-resolution provisions should be completed
            based on the operator's location and legal requirements.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>13. Contact</h2>
          <p>
            For questions about these terms, contact:
          </p>
          <p>
            Email: <strong>YOUR_SUPPORT_EMAIL@example.com</strong>
          </p>
          <p style={{ color: "#aaa5b8", fontSize: "13px" }}>
            Replace this placeholder with your actual support email.
          </p>
        </section>

        <footer style={{
          borderTop: "1px solid #302b3e",
          paddingTop: "24px",
          color: "#aaa5b8",
        }}>
          © {new Date().getFullYear()} AI Agent. All rights reserved.
          <div style={{ marginTop: "12px" }}>
            <Link href="/privacy" style={{ color: "#b9a0ff" }}>
              Privacy Policy
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}
