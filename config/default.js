var config = {
    database: {
        host: process.env.db_host,
        user: process.env.db_user,
        pass: process.env.db_pass,
        database: process.env.db_name
    },
    server: {
        port: process.env.PORT
    },
    aws: {
        secret: process.env.aws_key,
        id: process.env.aws_id
    },
    logging: {
        level: process.env.LOGGING_LEVEL
    }
};

module.exports = config;