import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";

interface NewsAttributes {
    news_id?: number;
    title: string;
    content: string;
    picture_type: string;
    picture_data: ArrayBuffer;
    author: string;
    created_at: Date;
};

class News extends Model<NewsAttributes> {
    news_id!: number;
    title!: string;
    content!: string;
    picture_type!: string;
    picture_data!: ArrayBuffer;
    author!: string;
    created_at!: Date;
};

News.init({
    news_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    picture_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    picture_data: {
        type: DataTypes.BLOB('long'),
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    tableName: 'news',
    modelName: 'news'
});

News.sync();

export default News;