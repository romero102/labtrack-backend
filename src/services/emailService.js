import { Resend } from "resend";

console.log(
  "RESEND_API_KEY:",
  process.env.RESEND_API_KEY ? "Exists" : "Missing"
);

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (
  email,
  resetUrl
) => {
  const response = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Password Reset Request",
    html: `...`,
  });

  console.log("RESEND RESPONSE:", response);

  return response;
};

/*import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (
  email,
  resetUrl
) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset</h2>

        <p>
          We received a request to reset your password.
        </p>

        <a
          href="${resetUrl}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#2563eb;
            color:white;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Reset Password
        </a>

        <p>
          Or use this link:
        </p>

        <p>
          <a href="${resetUrl}">
            ${resetUrl}
          </a>
        </p>

        <p>
          This link expires in 15 minutes.
        </p>
      </div>
    `,
  });
};*/