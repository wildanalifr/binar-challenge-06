'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class user_game_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_game_history.belongsTo(models.user_game, {
        foreignKey: 'id_user_game',
        as: 'user_history',
      })
    }
  }
  user_game_history.init(
    {
      point: DataTypes.INTEGER,
      total_play: DataTypes.INTEGER,
      id_user_game: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'user_game_history',
    }
  )
  return user_game_history
}
