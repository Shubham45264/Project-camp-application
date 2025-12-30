import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to Project Camp! We're very excited to have you on board.",
      action: {
        instructions: "To verify your email please click on the following button:",
        button: {
          color: "#22BC66",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const ForgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "You have received this email because a password reset request for your account was received.",
      action: {
        instructions: "Click the button below to reset your password:",
        button: {
          color: "#DC4D2F",
          text: "Reset your password",
          link: passwordResetUrl,
        },
      },
      outro: "If you did not request a password reset, no further action is required on your part.",
    },
  };
};

const sendEmail = async (options) => {
  // 1) Initialize mailgen instance
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Project Camp",
      link: process.env.CORS_ORIGIN || "http://localhost:8080",
    },
  });

  // 2) Generate the email body
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  // Check for credentials
  if (!process.env.MAILTRAP_SMTP_USER || !process.env.MAILTRAP_SMTP_PASS) {
    if (process.env.NODE_ENV !== "production") {
      console.log("\n=======================================================");
      console.log(`[MOCK EMAIL] To: ${options.email}`);
      console.log(`[SUBJECT] ${options.subject}`);
      // Debugging: Identify structure
      // console.log("Content Structure:", JSON.stringify(options.mailgenContent, null, 2));

      const link = options.mailgenContent?.body?.action?.button?.link || "Link not found";
      console.log(`[LINK] ${link}`);
      console.log("=======================================================\n");
      return { mockLink: link }; // Return Mock Link
    } else {
      throw new Error("SMTP Credentials missing in production");
    }
  }

  // 3) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  // 4) Define email options
  const mailOptions = {
    from: "support@projectcamp.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  // 5) Send email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email send failed:", error);
    // Fallback Mock in case of other errors (e.g. connection)
    if (process.env.NODE_ENV !== "production") {
      const link = options.mailgenContent?.body?.action?.button?.link;
      console.log(`[MOCK EMAIL FALLBACK] Link: ${link}`);
      return { mockLink: link };
    } else {
      throw error;
    }
  }
};

export { sendEmail, emailVerificationMailgenContent, ForgotPasswordMailgenContent };