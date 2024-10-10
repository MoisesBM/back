const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'moisesbuitrago201@gmail.com', 
    pass: 'vhuj ndov yuds pqrq'
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("El servidor de correo está listo y funcionando!d");
  }

});

module.exports = transporter;
