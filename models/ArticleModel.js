import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Users from './UserModel.js';

const Article = db.define('articles', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
  },
  author: {
    type: Sequelize.STRING,
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  userId: {
    type: Sequelize.INTEGER,
    references: {
      model: Users,
      key: 'id',
    },
  },
});

// Define the association
Article.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'user',
});

export default Article;
