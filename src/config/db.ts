import config from "./config";

export default {
    "development": {
        "username": config.db.username,
        "password": config.db.password,
        "database": config.db.database,
        "host": config.db.host,
        "port": config.db.port,
        "dialect": config.db.dialect
    },
    "test": {
        "username": config.db.username,
        "password": config.db.password,
        "database": config.db.database,
        "host": config.db.host,
        "port": config.db.port,
        "dialect": config.db.dialect
    },
    "production": {
        "username": config.db.username,
        "password": config.db.password,
        "database": config.db.database,
        "host": config.db.host,
        "port": config.db.port,
        "dialect": config.db.dialect
    }
}