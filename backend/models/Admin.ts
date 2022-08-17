import { Model, DataTypes } from "sequelize";
import { sequelize } from "../utils/db";
import bcrypt from "bcryptjs";

interface AdminAttributes {
    admin_id?: number;
    username: string;
    password: string;
    name: string;
    position: string;
    profile_pic_type?: string;
    profile_pic_data?: ArrayBuffer;
    last_login?: Date;
    status?: string;
    validatePassword?: (password: string) => Promise<boolean>;
};

class Admin extends Model<AdminAttributes> {
    admin_id!: number;
    username!: string;
    password!: string;
    name!: string;
    position!: string;
    profile_pic_type!: string;
    profile_pic_data!: ArrayBuffer;
    last_login!: Date;
    status!: string;
    validatePassword!: (password: string) => Promise<boolean>;
};

Admin.init({
    admin_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            min: {
                args: [6],
                msg: "Your password need to be at least 6 characters"
            }
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profile_pic_type: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: undefined
    },
    profile_pic_data: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
        defaultValue: undefined
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: undefined
    },
    status: {
        type: DataTypes.ENUM("online", "offline"),
        allowNull: false,
        defaultValue: "offline"
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'admin'
});

Admin.beforeSave(async (admin, options) => {
    if (admin.previous('password') !== admin.password) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
    }
});

Admin.prototype.validatePassword = async function(password: string) {
    return await bcrypt.compare(password, this.password);
};

Admin.sync();

export default Admin;