const express = require('express');
const router = express.Router();

const {register,login,resetpassword, forgotpassword ,main,contact} = require('../controllers/auth')

router.route('/main').get(main)

router.route('/register').post(register);

router.route('/login').post(login);

router.route('/forgotpassword').post(forgotpassword);

router.route('/resetpassword/:resetToken').put(resetpassword);

router.route('/contact').post(contact);




module.exports = router; 