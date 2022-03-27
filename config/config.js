import dotenv from 'dotenv'
dotenv.config()
export default {
    'development': {
        'username': process.env.DB_DEV_USERNAME,
        'password': process.env.DB_DEV_PASS,
        'database': process.env.DB_DEV_DBNAME,
        'host': process.env.DB_HOST,
        'dialect': 'postgres',
    },
    'test': {
        'username': process.env.DB_TEST_USERNAME,
        'password': process.env.DB_TEST_PASS,
        'database': process.env.DB_TEST_DBNAME,
        'host': process.env.DB_HOST,
        'dialect': 'postgres',
    },
    'production': {
        'username': process.env.DB_PROD_USERNAME,
        'password': process.env.DB_PROD_PASS,
        'database': process.env.DB_PROD_DBNAME,
        'host': process.env.DB_HOST,
        'dialect': 'postgres',
    },
}
