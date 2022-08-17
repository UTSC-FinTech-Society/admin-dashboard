import passport from "passport";
import passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;
import Admin from "../models/Admin";

const initializeAuth = () => {

    passport.serializeUser((admin: any, done: any) => done(null, admin));
    passport.deserializeUser((admin: any, done: any) => done(null, admin));

    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const admin = await Admin.findOne({ where: { username: username } });

            if (!admin) return done(null, false, { message: 'Username does not exist' });

            if (!(await admin.validatePassword(password))) return done(null, false, { message: 'Your password is incorrect, please try again' });

            return done(null, { admin_id: admin.admin_id, username: admin.username, name: admin.name, position: admin.position, profile_pic_type: admin.profile_pic_type, profile_pic_data: admin.profile_pic_data, last_login: admin.last_login, status: admin.status });
        } catch (error) {
            return done(error);
        }
    }));
};

export default initializeAuth;