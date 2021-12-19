const express = require("express");
const router = express.Router();
const db = require("../models/index");
const Account = db.Account;
const Post = db.Post;
const Doctor = db.Doctor;
const Patient = db.Patient;
const Profile = db.Profile;
const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");

router.get("/", (req, res, next) => {
  // Account.findAll()
  // .then(accounts=>{
  //   res.status(200).json(accounts);
  // })
  // .catch(error=>{
  //   res.status(422).json(error);
  // })
  Doctor.findAll({
    include: [
      {
        model: Account,
        // on: {
        //   [Sequelize.Op.or]: [
        //     Sequelize.where( Sequelize.col("Doctor.id"), Sequelize.Op.eq, Sequelize.col("Account.doctorId")),
        //     Sequelize.where( Sequelize.col("Doctor.accNo"), Sequelize.Op.eq, Sequelize.col("Account.accNo"))
        //   ]
        // }
      },
    ],
    // order: Sequelize.fn('max', Sequelize.col('id')),
    // group: "id",
    // attributes: ["name",["COUNT(name)","COUNT"]],
    // group: "name"
  })
    .then((doctors) => {
      res.status(200).json(doctors);
    })
    .catch((error) => {
      res.status(422).json(error);
    });
});

router.post("/", (req, res, next) => {
  const doctor = Doctor.build(req.body);
  doctor
    .save()
    .then(() => res.sendStatus(201))
    .catch((err) => res.sendStatus(500));
  // const profile = Profile.build({ name: req.body.name });
  // sequelize.transaction(transaction=>{
  //   return Doctor.create(req.body, {
  //     include: [{
  //       model: Account,
  //       include: [{ model: Post, as: "articles" }]
  //     }],
  //     transaction
  //   })
  //   .then(async (doctorObj)=>{
  //     const doctor = await Doctor.findByPk(doctorObj.id,{transaction}); // if i dont pass transaction here it cant find record since transaction is not commited yet
  //     res.status(200).json(doctor);
  //   })
  // })
  // .catch(error=>res.status(422).json(error));
  // Promise.all([profile.save(), doctor.save()])
  // .then(async (result)=>{
  //   const doct = await profile.setDoctor(doctor);
  //   res.status(200).json(profile);
  // })
  // .catch(error=>res.status(422).json(error));
});

module.exports = router;
