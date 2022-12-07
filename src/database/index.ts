import { readdirSync } from 'fs';
import path from 'path';

import { Sequelize } from 'sequelize';
import logger from '../config/logger';
import config from '../config/config';

export const sequelize = new Sequelize({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  username: config.db.username,
  dialect: 'postgres',
  password: config.db.password,
  logging: (sql) => {
    logger.debug(sql);
  },
});
const models = readdirSync(path.resolve(__dirname, '../models'), { withFileTypes: true })
  .filter((file) => file.name.split('.')[1] === 'model' && !file.name.includes('base') && file.isFile)
  .map((modelFile) => {
    const modelModule = require(path.resolve(__dirname, `../models/${modelFile.name}`));
    const model = modelModule.default(sequelize);
    return model;
  });

models.forEach((m) => {
  m.associate(sequelize.models);
});

readdirSync(path.resolve(__dirname, '../models/plugins'), { withFileTypes: true })
  .filter((f) => f.name.split('.')[1] === 'plugins' && f.isFile)
  .map((pluginFile) => {
    const plugin = require(path.resolve(__dirname, `../models/plugins/${pluginFile.name}`));
    models.forEach((m) => {
      plugin.default(m);
    });
  });
