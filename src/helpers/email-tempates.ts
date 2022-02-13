import AWS from "aws-sdk";

export const getEmailRegistrationParams = (
  name: string,
  email: string,
  token: string
): AWS.SES.SendEmailRequest => {
  return {
    Source: process.env.EMAIL_FROM!,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO!],
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Complete Your Registration",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
          <h1>Hello ${name}</h1>
          <p>Please verify your email address by clicking the link below:</p> 
          <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
        </body>
        </html>
      `,
        },
      },
    },
  };
};

export const getEmailForgotPassword = (
  name: string,
  email: string,
  token: string
): AWS.SES.SendEmailRequest => {
  return {
    Source: process.env.EMAIL_FROM!,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO!],
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: "Confirmation - Forgot Password",
      },
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
          <h1>Hello ${name}</h1>
          <p>Please confirm your request for resetting password by clicking the link below:</p> 
          <p>${process.env.CLIENT_URL}/auth/reset-password/${token}</p>
        </body>
        </html>
      `,
        },
      },
    },
  };
};
