var config = {
    database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306
    },
    server: {
        port: process.env.PORT
    },
    logging: {
        level: process.env.LOGGING_LEVEL

    }
}

module.exports = config
