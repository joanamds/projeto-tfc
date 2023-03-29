'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matches', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      homeTeamId: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'home_team_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'teams',
          key: 'id'
        }
      },
      awayTeamId: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'away_team_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        references: {
          model: 'teams',
          key: 'id'
        }
      },
      homeTeamGoals: {
        type: Sequelize.INTEGER,
        field: 'home_team_goals'
      },
      awayTeamGoals: {
        type: Sequelize.INTEGER,
        field: 'away_team_goals'
      },
      inProgress: {
        type: Sequelize.BOOLEAN,
        field: 'in_progress'
      }
    }, {
      underscored: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('matches')
  }
};
