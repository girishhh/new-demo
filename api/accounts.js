const express = require('express');
const router = express.Router();
const db = require("../models/index");
const Post = db.Post;
const Account = db.Account;
const Sequelize = require('sequelize');

router.get('/',  (req,res,next)=>{
  Account.findAll()
  .then(accounts=>{
    res.status(200).json(accounts);
  })
  .catch(error=>{
    res.status(422).json(error);
  })
});

router.post('/',(req,res,next)=>{
  let account_params = {  name: req.body.accNo };
  let account = Account.build(account_params);
  account.save()
  .then(account=>{
    res.status(200).json(account)
  })
  .catch(error=>{
    res.status(422).json(error)
  })
});


module.exports = router;