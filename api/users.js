const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../models/index');
const User = db.User;

router.post('/',(req,res,next)=>{
  let password = bcrypt.hashSync(req.body.password,10);
  let user_params = { email: req.body.email, password: password };
  let user = User.build(user_params);
  user.save()
  .then(user=>{
    res.status(200).json(user);
  }).catch(error=>{
    res.status(422).json(error);
  })
});


router.post('/signIn',(req,res,next)=>{
  User.findOne({where: {email: req.body.email}})
  .then(user=>{
    let passwordMatch = bcrypt.compareSync(req.body.password,user.password);
    passwordMatch ? (res.status(200).json(user)) : (res.status(401).json({message: "Email or password is incorrect"}));
  })
  .catch(error=>{
    res.status(401).json({message: "Email or password is incorrect"});
  });
});

module.exports = router;