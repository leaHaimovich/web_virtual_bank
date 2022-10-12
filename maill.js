const nodemailer = require('nodemailer')
        var CLIENT_ID = '206917665386-8jtbqt8v2qnpbsuqq06b62gr4icq11h1.apps.googleusercontent.com'
        var CLEINT_SECRET = 'AIzaSyAHvjq7fKTjNtKovE53WsgL-BivEUrCFyQ';
        async function sendMail(){
            try{
                const transport = nodemailer.createTransport({
                    service: 'gmail',
                    auth: { 
                        type: 'OAuth2',
        user: 'yours authorised email address',
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        accessToken: '1//04Q171KGfB0tkCgYIARAAGAQSNwF-L9IrjoevkEw94l67J2fWOdkInAvtdcNK0MSL7GR5B8EXq57MvL_XaNA3Bknra1oFjOlN7ak',
      },
    });
 
    const mailOptions = {
      from: 'leahaimovich17@gmail.com>',
      to: 'leahaimovich17@gmail.com',
      subject: 'Hello from gmail using API',
      text: 'Hello from gmail email using API',
      html: '<h1>Hello from gmail email using API</h1>',
    };
 
    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}
 
sendMail()
  .then((result) => console.log('Email sent...', result))
  .catch((error) => console.log(error.message));