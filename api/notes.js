const express = require('express');
const db = require("../models/index");
const router  = express.Router();
const Note    = db.Note;
const bcrypt = require('bcrypt');

const generatePasswordHash = function(password){
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  return hash
}

const passwordMatch = function(password, hash){
  return bcrypt.compareSync(password, hash);
}

const formatNoteParams = function(noteParams){
  delete noteParams.confirmPassword
  noteParams.hasPassword  = noteParams.needPassword
  delete noteParams.needPassword
  return noteParams
}

const updateNote = function(note, noteUpdateParams, res){
  note.update(noteUpdateParams)
  .then(note=>{
    res.status(200).json(note)
  })
  .catch(err=>{
    res.status(422).json(err)
  })
}

const resetPassword = function(file, newPassword, res){
  let pwdHash = generatePasswordHash(newPassword)
  file.update({password: pwdHash})
  .then(file=>{
    res.status(200).json(file)
  })
}

router.get('/', (req, res, next) => {
  Note.findAll()
  .then(notes=>{
    res.status(200).json(notes)
  })
})

router.get('/detailsByUrlPath', (req, res, next) => {
  Note.findOne({
    where: {
      urlPath: req.query.urlPath
    }
  })
  .then(note=>{
    if(note){
      res.status(200).json(note)
    }else{
      res.status(404).json({errors: [{message: "Note not found"}]})
    }
  })
})

router.post('/',  (req, res,  next)=>{
  let noteParams  = req.body
  noteParams = formatNoteParams(noteParams)
  if (noteParams.hasPassword){
    noteParams.password = generatePasswordHash(noteParams.password)
  }
  Note.create(noteParams)
  .then(note=>{
    res.status(200).json(note)
  })
  .catch(err=>{
    res.status(422).json(err)
  })
})

router.put('/:id',  (req, res, next)  =>  {
  let noteUpdateParams = req.body
  Note.findOne({
    where: {
      id: req.params.id
    }
  })
  .then(note=>{
    if(note){
      updateNote(note, noteUpdateParams, res)
    }
    else{
      res.status(404).json({})
    }
  })
})

router.post('/verifyPassword',  (req, res,  next) =>  {
  let password = req.body.password
  let urlPath = req.body.urlPath
  Note.findOne({
    where: {
      urlPath: urlPath
    }
  })
  .then(note=>{
    if(note && passwordMatch(password, note.password)){
      res.status(200).json({})
    }else{
      res.status(401).json({})
    }
  })
})

router.post('/resetPassword', (req, res, next) => {
  let urlPath = req.body.urlPath
  let newPassword = req.body.newPassword
  let email = req.body.recoveryEmail
  Note.findOne({
    where: {
      urlPath: urlPath
    }
  })
  .then(note=>{
    if(note && note.hasPassword){
      if(note.recoveryEmail != email){
        res.status(422).json({message: "Email is invalid or not present for this note"})
      }else{
        resetPassword(note, newPassword, res)
      }
    }else{
      res.status(404).json({})
    }
  })
})

module.exports =  router