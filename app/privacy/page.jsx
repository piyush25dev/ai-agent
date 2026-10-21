
"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>

        <p style={{ color: "#aaa5b8" }}>
          Last updated: October 21, 2026
        </p>

        <p style={sectionStyle}>
          This Privacy Policy explains how AI Agent ("we", "our", or
          "the app") collects, uses, stores, and protects information
          when you use our application. By using AI Agent, you agree
          to the practices described in this policy.
        </p>

        <section style={sectionStyle}>
          <h2>1. Information We Collect</h2>
          <p>
            We may collect the following information when you use
            AI Agent:
          </p>
          <ul>
            <li>
              <strong>Account information:</strong> Your name, email
              address, profile picture, and authentication identifier
              when you sign in using Google.
            </li>
            <li>
              <strong>Chat information:</strong> Prompts you submit,
              AI responses, chat titles, and conversation history
              saved in your account.
            </li>
            <li>
              <strong>Usage information:</strong> Technical information
              required to operate, secure, and troubleshoot the app.
              The information collected depends on the services enabled.
            </li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2>2. How We Use Your Information</h2>
          <p>We use information to:</p>
          <ul>
            <li>Authenticate you and manage your account.</li>
            <li>Generate AI responses to your prompts.</li>
            <li>Save and retrieve your chat history.</li>
            <li>Provide chat management and calculator features.</li>
            <li>Maintain security, fix errors, and improve reliability.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2>3. AI Services and Third Parties</h2>
          <p>
            Your prompts may be sent to our configured AI provider,
            such as OpenRouter, to generate responses. The provider
            may process this information according to its own privacy
            policy and applicable service settings.
          </p>
          <p>
            We also use Firebase services for authentication and
            database storage. Google may process information when you
            choose Google sign-in.
          </p>
          <p>
            We do not control the independent privacy practices of
            these third-party providers. Please review their policies
            before using the app.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>4. Data Storage and Security</h2>
          <p>
            Account information and chat history may be stored using
            Firebase services. We use reasonable measures to protect
            information, but no online service can guarantee absolute
            security.
          </p>
          <p>
            Do not submit passwords, financial account details,
            confidential business information, or other sensitive
            information in your prompts unless you understand the risks.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>5. Data Sharing</h2>
          <p>
            We do not sell your personal information. Information may
            be processed by service providers needed to operate the app,
            or disclosed when required by law or necessary to protect
            the security and rights of users and the service.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>6. Data Retention and Deletion</h2>
          <p>
            Your chat history may remain stored until you delete it or
            it is removed as part of account or data management.
            Deleting a chat in the app should remove its associated
            stored records according to the app's implementation.
          </p>
          <p>
            To request account or personal data deletion, contact us
            using the details below. Some information may need to be
            retained where required by law or for legitimate security
            purposes.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>7. Your Choices</h2>
          <p>
            You can choose whether to sign in, what prompts to submit,
            and which conversations to keep. You may stop using the
            service at any time and request deletion of your information.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>8. Children's Privacy</h2>
          <p>
            AI Agent is not intended for children who are not permitted
            to use the service under applicable law. We do not knowingly
            collect children's personal information in violation of
            applicable legal requirements.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy when the app or its data
            practices change. The revised policy will be published on
            this page with an updated revision date.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>10. Contact Us</h2>
          <p>
            For privacy questions or data deletion requests, contact:
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
            <Link href="/terms" style={{ color: "#b9a0ff" }}>
              Terms and Conditions
            </Link>
          </div>
        </footer>
      </article>
    </main>
  );
}
