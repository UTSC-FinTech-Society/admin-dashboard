import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.POSTGRESQL_URI!);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL has been successfully connected...");
    } catch(error) {
        console.log(`Unable to connect to PostgreSQL: ${error}`);
    }
};

export default connectDB;