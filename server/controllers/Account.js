const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
 res.render('login');
};

const signupPage = (req, res) => {
const req = request;
 const res = response;
 
 req.body.username = `${req.body.username}`;
 req.body.pass = `${req.body.pass}`;
 req.body.pass2 = `${req.body.pass2}`:
 
 if( !req.body.username || !req.body.pass || !req.bady.pass2) {
  return res.status(400).json({ error: 'RAWR! All fields are required' });
 }
 if(req.body.pass !== req.body.pass2){
  return res.status(400).json({error: 'RAWR! Passwords do not match' });
 }
 };
 
 const logout = (req, res) => {
 res.redirect('/');
 };
 
 const login = (request, response) => {
 };
 
 const signup = (request, response) => { 
 };
 
 module.exports.loginPage = loginPage;
 module.exports.login = login;
 module.exports.logout = logout;
 module.exports.signupPage = signupPage;
 module.exports.signup = signup;
