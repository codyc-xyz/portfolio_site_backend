import { Sequelize } from 'sequelize';
const dotenv = require(`dotenv`);
dotenv.config();

let dbUrl;
if (process.env.DATABASE_URL) {
  dbUrl = process.env.DATABASE_URL;
} else if (process.env.DB_URL) {
  dbUrl = process.env.DB_URL;
} else {
  throw new Error("No database URL was provided.");
}

const db = new Sequelize(dbUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

export default db;