"use strict";
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const { isEqual, isEmpty } = require("lodash");
const db = {};

const hooks = [
  { name: "afterCreate", event: "create" },
  { name: "afterDestroy", event: "destroy" },
  { name: "afterUpdate", event: "update" },
];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

sequelize
  .authenticate()
  .then((res) => {
    console.log("DB CONNECTED SUCCESSFULLY");
  })
  .catch((err) => {
    console.log("DB ERROR has occured");
    console.log(err);
  });

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

const getDiff = (changedKeys, obj1, obj2, hookName) => {
  const diffObj = {};
  if (hookName === "afterDestroy") return diffObj;
  Object.keys(changedKeys).forEach((key) => {
    if (!isEqual(obj1[key], obj2[key])) diffObj[key] = [obj1[key], obj2[key]];
  });
  return diffObj;
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].audit) {
    db[modelName].hasMany(db["VersionHistory"], {
      constraints: false,
      foreignKey: "versionableId",
      scope: { versionableType: modelName.toLowerCase() },
    });
    db["VersionHistory"].belongsTo(db[modelName], {
      constraints: false,
      as: modelName.toLowerCase(),
      foreignKey: "versionableId",
    });

    hooks.forEach((hook) => {
      db[modelName].addHook(hook.name, (instance, options) => {
        try {
          const diff = getDiff(
            instance._changed,
            instance.dataValues,
            instance._previousDataValues,
            hook.name
          );
          if (!isEmpty(diff) || hook.name === "afterDestroy")
            instance.createVersionHistory({
              diff: diff,
              userId: options.userId,
              event: hook.event,
            });
        } catch (error) {
          console.log("ERRRORRRR", error);
        }
      });
    });
  }

  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
