import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";

interface MemberAttributes {
    member_id?: number;
    first_name: string;
    last_name: string;
    student_number: number;
    email_address: string;
    year_of_study: string;
    program: string;
    campus: string;
    timestamp?: Date;
}

class Member extends Model<MemberAttributes> {
    member_id!: number;
    first_name!: string;
    last_name!: string;
    student_number!: number;
    email_address!: string;
    year_of_study!: string;
    program!: string;
    campus!: string;
    timestamp!: Date;
}

Member.init({
    member_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    student_number: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false
    },
    email_address: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Please fill in a valid email address!'
            }
        }
    },
    year_of_study: {
        type: DataTypes.ENUM('1st', '2nd', '3rd', '4th', '5th'),
        allowNull: false
    },
    program: {
        type: DataTypes.STRING,
        allowNull: false
    },
    campus: {
        type: DataTypes.ENUM('UTSC', 'UTSG', 'UTM'),
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'member'
});

Member.sync();

export default Member;