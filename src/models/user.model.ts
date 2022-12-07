import { Sequelize, DataTypes, ModelStatic } from 'sequelize';
// import { compare } from 'bcryptjs';
import { Model } from 'sequelize';
import { ROLES } from '../config/roles';
import { BaseModel } from './base.model';

export interface UserAttributes {
  user_id: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  contactNo: string;
  role: ROLES;
}
export class User extends BaseModel<UserAttributes> {
  static associate(_: Record<string, ModelStatic<Model>>) {}
  static async isEmailTaken(email: string) {
    const user = await this.findOne({
      where: { email },
    });
    return !!user;
  }

  // isPasswordMatch = function (password: any) {
  //   const user:any = this as User;
  //   return compare(password, user.getDataValue('password'));
  // };
}


export default (sequelize: Sequelize) => {
  User.init(
    {
      user_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement : true,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('Admin', "User"),
        allowNull: true,
        defaultValue: 'User',
      },
      contactNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      underscored: true,
      tableName: 'users',
    }
  );

  return User;
};
