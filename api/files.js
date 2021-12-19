const express = require('express')
const db = require("../models/index");
const fs = require('fs');
const fsPromises = require('fs').promises;
const mime = require('mime-types');
const bcrypt = require('bcrypt');
const Email = require('email-templates');

const router = express.Router()
const File = db.File;
const sequelize = db.sequelize;
const fileBasePath =  "/home/girikulkarni03/files";

const writeFile = function(file,  fileContent, t, res,  fileObj,  fileParams){
  let filePath = fileBasePath + fileParams.urlPath + "/" + file.originalname
  let folderPath = fileBasePath + fileParams.urlPath

  fsPromises.mkdir(folderPath, { recursive: true })
  .then(()=>{
    var writeStream = fs.createWriteStream(filePath);
    writeStream.write(fileContent,'base64');
    writeStream.end();
    t.commit()
    res.status(200).json(fileObj)
  })
  .catch(err=>{
    console.log(err)
    t.rollback()
    res.status(422).json({errors: [{message: "unable to create file"}]})
  });

}

const saveFile = function(file, fileParams, fileContent, t, res){
  if (fileParams.hasPassword){
    fileParams.password = generatePasswordHash(fileParams.password)
  }
  File.create(fileParams,{transaction: t})
  .then(fileObj=>{
    writeFile(file,  fileContent, t, res, fileObj,  fileParams)
  })
  .catch(err=>{
    console.log(err)
    t.rollback()
    res.status(422).json(err)
  })
}

const saveAndWriteFile = function(file, fileParams, fileContent, res){
  sequelize.transaction()
  .then(function(t){
    saveFile(file, fileParams, fileContent, t,  res)
  })
}

const generatePasswordHash = function(password){
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  return hash
}

const passwordMatch = function(password, hash){
  return bcrypt.compareSync(password, hash);
}

const updateDownloadCount = function(filePath){
  File.findOne({
    where: {
      filePath: filePath
    }
  })
  .then(file=>{
    if(file){
      file.increment('downloadCount',  {by: 1})
    }
  })
}

const sendPasswordRecoveryEmail = function(email){
  const emailObj = new Email({
    message: {
      to: email
    },
    send: true,
    transport: {
      jsonTransport: true
    }
  });
}

const resetPassword = function(file, newPassword, res){
  let pwdHash = generatePasswordHash(newPassword)
  file.update({password: pwdHash})
  .then(file=>{
    res.status(200).json(file)
  })
}

router.get('/', (req, res,  next) =>{
  File.findAll()
  .then(files=>{
    res.status(200).json(files)
  })
})

router.get('/download',  (req, res,  next) =>  {
  let filePath = req.query.filePath
  if(fs.existsSync(filePath)){
    let stat = fs.statSync(filePath)
    let content_type = mime.lookup(filePath)
    res.set({
      'Content-Type': content_type,
      'Content-Length': stat.size
    })
    updateDownloadCount(filePath)
    res.sendFile(filePath)
  }else{
    res.status(404).json({errors: [{message: "File not found"}]})
  }
})

router.get('/detailsByUrlPath', (req, res, next) => {
  File.findOne({
    where: {
      urlPath: req.query.urlPath
    }
  })
  .then(file => {
    if(file &&  fs.existsSync(file.filePath)){
      res.status(200).json(file)
    }else{
      res.status(404).json({errors: [{message: "File not found"}]})
    }
  })
})

router.post('/', (req, res,  next) => {
  let file = req.files[0]
  let fileContent = file.buffer
  let needPwd = req.body.needPassword
  let pwd  = req.body.password.trim()
  let confirmPwd  = req.body.confirmPassword.trim()
  let fileParams = {  title: req.body.title,  urlPath: req.body.urlPath,  filePath: fileBasePath + req.body.urlPath + "/" + file.originalname, recoveryEmail: req.body.recoveryEmail, canDelete: req.body.canDelete }

  if(needPwd){
    if(pwd != confirmPwd){
      res.status(422).json({message: "password does not match with confirm password"})
    }
    fileParams.hasPassword = needPwd
    fileParams.password = pwd
  }
  saveAndWriteFile(file, fileParams, fileContent, res)
})

router.post('/verifyPassword',  (req, res,  next) =>  {
  let password = req.body.password
  let urlPath = req.body.urlPath
  File.findOne({
    where: {
      urlPath: urlPath
    }
  })
  .then(file=>{
    if(file && passwordMatch(password, file.password)){
      res.status(200).json({})
    }else{
      res.status(401).json({})
    }
  })
})

router.delete('/:id',  (req, res,  next) =>  {
  File.findOne({
    where: {
      id: req.params.id
    }
  })
  .then(file=>{
    if(file && file.canDelete){
      file.destroy().
      then(status=>{
        fs.unlinkSync(file.filePath)
        res.status(200).json({})
      })
    }else{
      res.status(404).json({})
    }
  })
})

router.post('/resetPassword', (req, res, next) => {
  let urlPath = req.body.urlPath
  let newPassword = req.body.newPassword
  let email = req.body.recoveryEmail
  File.findOne({
    where: {
      urlPath: urlPath
    }
  })
  .then(file=>{
    if(file && file.hasPassword){
      if(file.recoveryEmail != email){
        res.status(422).json({message: "Email is invalid or not present for this file"})
      }else{
        resetPassword(file, newPassword, res)
      }
    }else{
      res.status(404).json({})
    }
  })
})

router.get('/sendPassword', (req, res, next)  => {
  let urlPath = req.query.urlPath
  File.findOne({
    urlPath: urlPath
  })
  .then(file=>{
    if(file && file.recoveryEmail){
      sendPasswordRecoveryEmail(file.recoveryEmail)
    }else{
      res.status(404).json({})
    }
  })
})

module.exports = router