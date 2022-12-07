import { DataTypes, ModelStatic, Sequelize } from 'sequelize';
import { Model } from 'sequelize';
import { tokenTypes } from '../config/tokens';
import { BaseModel } from './base.model';

export class Token extends BaseModel {
  static associate({ User }: Record<string, ModelStatic<Model>>) {
    this.belongsTo(User, { foreignKey: 'user_id' });
  }
}

 export type generatorFn =  (callback : (req : Request,res: Response) => string, content : string)  => string

export default (sequelize: Sequelize) => {
  Token.init(
    {
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        values: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
        allowNull: false,
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      blacklisted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    { sequelize, modelName: 'Token', tableName: 'tokens', underscored: true }
  );
  return Token;
};