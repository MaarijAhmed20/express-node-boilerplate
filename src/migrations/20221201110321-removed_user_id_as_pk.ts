'use strict';

import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn("tokens", "user_id", {
      allowNull: false,
      primaryKey: false,
      type: DataTypes.INTEGER,
    })
  },

  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn("tokens", "user_id", {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
    })
  }
};
