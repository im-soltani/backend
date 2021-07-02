import { AuthenticationError } from "apollo-server-express";

export default {
    auth: (next, source, { roles }, { user }) => roles.includes(user.role) ? next() : new AuthenticationError("UnAuthorized")
};