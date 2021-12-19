'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    name: { 
      type: DataTypes.STRING,     
    },
    description: DataTypes.TEXT,
    metaInfo: DataTypes.JSONB,
    commentsCount: DataTypes.INTEGER
  },
  {    
    name: {
      singular: "post",
      plural: "posts"
    }
  });
  Post.associate = function(models) {
    Post.belongsTo(models.Account, { foreignKey: "accountId" });
    // associations can be defined here
  };
  Post.audit = true;
  return Post;
};