import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";

interface EventAttributes {
    event_id?: number;
    name: string;
    description: string;
    register_deadline: Date;
    start_datetime: Date;
    end_datetime: Date;
    entry_fee?: number;
    location: string;
    poster_type: string;
    poster_data: ArrayBuffer; 
    signup_link?: string;
    created_at: Date;
};

class Event extends Model<EventAttributes> {
    event_id!: number;
    name!: string;
    description!: string;
    register_deadline!: Date;
    start_datetime!: Date;
    end_datetime!: Date;
    entry_fee!: number;
    location!: string;
    poster_type!: string;
    poster_data!: ArrayBuffer;
    signup_link!: string;
    created_at!: Date
};

Event.init({
    event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    register_deadline: {
        type: DataTypes.DATE,
        allowNull: false
    },
    start_datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    end_datetime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    entry_fee: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: undefined
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    poster_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    poster_data: {
        type: DataTypes.BLOB('long'),
        allowNull: false
    },
    signup_link: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: undefined
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'event'
});

Event.sync();

export default Event;