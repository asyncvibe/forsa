const bcrypt = require("bcrypt-nodejs");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  bcryptPassword: password => {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, null, null, (err, hash) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(hash);
        }
      });
    });
  },

  sendMail: data => {
    const msg = {
      to: data.to,
      from: data.from,
      subject: data.subject,
      html: data.html
    };
    sgMail.send(msg, (err, result) => {
      if (err) {
        return false;
      }
      if (result) return true;
    });
  },
  forgetPassword: (email, code, id) => {
  //  let url = 'http://localhost:4200'
    const msg = {
      to: email,
      from: 'novatoreweb@gmail.com',
      subject: "Forget Password",
     
      html: `<p>Please click on this link  <a href="${process.env.BASEURL}/forgetpassword?authToken=${code}&id=${id}" target="_blank">Please follow this link</a>  to change your password</p>`
    };
    sgMail.send(msg, (err, result) => {
      if (err) return false;
      return true;
    });
  }
};
