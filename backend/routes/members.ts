import express from "express";
const membersRouter = express.Router();

// Load Middleware
import isAuthenticated from "../middleware/auth";

// Load Controllers
import { getMembers, addNewMember, updateMember, deleteMember } from "../controllers/members";

if (process.env.NODE_ENV === 'production') {
    membersRouter.route('/').get(isAuthenticated, getMembers).post(addNewMember);
    membersRouter.route('/:member_id').all(isAuthenticated).put(updateMember).delete(deleteMember);
} else {
    membersRouter.route('/').get(getMembers).post(addNewMember);
    membersRouter.route('/:member_id').put(updateMember).delete(deleteMember);
}

export default membersRouter;