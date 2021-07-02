"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mailer_1 = require("../../common/mailer");
const models_1 = require("../models");
const counter_model_1 = require("../models/counter.model");
const auth_input_1 = require("../models/input/auth.input");
const contants_1 = require("../tools/contants");
const token_1 = require("../tools/token");
const register = (req, res, next, role) => {
    let inputType = null;
    let model = null;
    let ref = null;
    switch (role) {
        case contants_1.UserRole.ADMIN:
            inputType = auth_input_1.AdminRegisterInput;
            model = models_1.AdminModel;
            ref = "admins";
            break;
        case contants_1.UserRole.CANDIDAT:
            inputType = auth_input_1.CandidatRegisterInput;
            model = models_1.CandidatModel;
            ref = "candidats";
            break;
        case contants_1.UserRole.ENTREPRISE:
            inputType = auth_input_1.EntrepriseRegisterInput;
            model = models_1.EntrepriseModel;
            ref = "entreprises";
            break;
    }
    req.checkBody(inputType);
    const errors = req.validationErrors();
    if (errors) {
        return res.sendStatus(422);
    }
    const data = req.body;
    models_1.UserModel.findOne({ email: data.email })
        .then(result => {
        if (result) {
            return res.sendStatus(409);
        }
        const user = new models_1.UserModel({ email: data.email, password: data.password, ref });
        user.save()
            .then((result) => __awaiter(this, void 0, void 0, function* () {
            const newUser = new model(Object.assign({}, data, { uid: result._id, num: yield counter_model_1.getNextSequenceValue(ref) }));
            newUser.save()
                .then(user => {
                token_1.default.generate({ id: result._id, role })
                    .then(token => {
                    const session = new models_1.SessionModel({ uid: result._id, token });
                    session.save()
                        .then(() => {
                        if (ref == "candidats") {
                            mailer_1.default({
                                template: "inscription_patient",
                                footer: true,
                                from: "contact@pharmaloop.fr",
                                to: req.body.email,
                                subject: "Inscription",
                                vars: {
                                    first_name: user.first_name,
                                    last_name: user.last_name
                                }
                            });
                        }
                        res.end(JSON.stringify({ token }, null, 5));
                    })
                        .catch(err => next(err));
                })
                    .catch(err => next(err));
            })
                .catch(err => next(err));
        }))
            .catch((err) => __awaiter(this, void 0, void 0, function* () {
            yield user.remove();
            next(err);
        }));
    })
        .catch(err => next(err));
};
const login = (req, res, next, role) => {
    const data = req.body;
    req.checkBody(auth_input_1.UserLoginInput);
    const errors = req.validationErrors();
    if (errors) {
        return res.sendStatus(422);
    }
    let ref = null;
    switch (role) {
        case contants_1.UserRole.ADMIN:
            ref = "admins";
            break;
        case contants_1.UserRole.CANDIDAT:
            ref = "candidats";
            break;
        case contants_1.UserRole.ENTREPRISE:
            ref = "entreprises";
            break;
    }
    const { email, password } = data;
    models_1.UserModel.findOne({ email, ref })
        .then(user => {
        if (!user) {
            return res.end(JSON.stringify({ success: false, fieldError: "email" }, null, 5));
        }
        if (!user.isValidPassword(password)) {
            return res.end(JSON.stringify({ success: false, fieldError: "password" }, null, 5));
        }
        token_1.default.generate({ id: user._id, role })
            .then(token => {
            const session = new models_1.SessionModel({ uid: user._id, token });
            session.save()
                .then(() => res.end(JSON.stringify({ success: true, token }, null, 5)))
                .catch(err => next(err));
        })
            .catch(err => next(err));
    })
        .catch(err => next(err));
};
const logout = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.sendStatus(401);
    }
    models_1.SessionModel.findOne({ token })
        .then(session => {
        if (!session) {
            return res.sendStatus(200);
        }
        session.remove()
            .then(() => res.sendStatus(200))
            .catch(err => next(err));
    })
        .catch(err => next(err));
};
const checkToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.sendStatus(401);
    }
    models_1.SessionModel.findOne({ token })
        .then(session => {
        if (!session) {
            return res.sendStatus(401);
        }
        token_1.default.ensure(token)
            .then(() => res.end())
            .catch(() => res.sendStatus(401));
    })
        .catch(err => next(err));
};
const sendResetCode = ref => (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.sendStatus(422);
    }
    models_1.UserModel.aggregate([
        { $match: { email } },
        { $lookup: { from: ref, as: "profile", localField: "_id", foreignField: "uid" } },
        { $unwind: "$profile" }
    ])
        .then((users) => __awaiter(this, void 0, void 0, function* () {
        if (!users.length) {
            return res.end(JSON.stringify({ success: false }));
        }
        const user = users[0];
        const min = 100000;
        const max = 999999;
        const code = Math.floor(Math.random() * (max - min + 1) + min);
        yield models_1.UserModel.update({ email }, {
            $set: {
                reset_password_code: code,
                reset_password_expires: Date.now() + 60 * 60 * 1000
            }
        }).then(() => {
            const vars = {
                code,
                name: ref == "candidats"
                    ? user.profile.first_name + " " + user.profile.last_name
                    : user.profile.name,
            };
            mailer_1.default({
                template: "mdp_oublie",
                footer: true,
                from: "contact@pharmaloop.fr",
                to: email,
                subject: "Modification de mot de passe",
                vars
            });
            res.end(JSON.stringify({
                success: true,
                user: ref == "candidats"
                    ? {
                        first_name: user.profile.first_name,
                        last_name: user.profile.last_name,
                        email: user.email,
                        profile_pic_url: user.profile_pic_url ? `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}${user.profile_pic_url}` : null
                    } : {
                    name: user.profile.name,
                    email: user.email,
                    profile_pic_url: `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}${user.profile_pic_url}`
                }
            }));
        }).catch(error => next(error));
    }));
};
const checkResetCode = (req, res, next) => {
    const { email, reset_password_code } = req.body;
    if (!email || !reset_password_code) {
        return res.sendStatus(422);
    }
    models_1.UserModel.findOne({ email }).then(user => {
        if (!user) {
            return res.end(JSON.stringify({ success: false, field: "email" }));
        }
        if (user.reset_password_code == reset_password_code) {
            const token = Buffer.from(Math.random().toString()).toString("base64");
            user.reset_password_code = null;
            user.reset_password_token = token;
            user.save()
                .then(() => res.end(JSON.stringify({ success: true, reset_password_token: token })))
                .catch(err => next(err));
        }
        else {
            return res.end(JSON.stringify({ success: false, field: "reset_password_code" }));
        }
    });
};
const resetPassword = ref => (req, res, next) => {
    const { email, password, reset_password_token } = req.body;
    if (!email || !password || !reset_password_token) {
        return res.sendStatus(422);
    }
    models_1.UserModel.aggregate([
        { $match: { email } },
        { $lookup: { from: ref, as: "profile", localField: "_id", foreignField: "uid" } },
        { $unwind: "$profile" }
    ])
        .then((users) => __awaiter(this, void 0, void 0, function* () {
        if (!users.length) {
            return res.end(JSON.stringify({ success: false, field: "email" }));
        }
        const user = yield models_1.UserModel.findOne({ email });
        if (user.reset_password_token == reset_password_token) {
            if (user.reset_password_expires < Date.now()) {
                return res.end(JSON.stringify({ success: false, field: "expired" }));
            }
            const hash = yield models_1.UserModel.hashPassword(password);
            user.reset_password_token = null;
            user.reset_password_expires = null;
            user.password = hash;
            user.save()
                .then(() => {
                const vars = ref == "candidats" ? {
                    first_name: users[0].profile.first_name,
                    last_name: users[0].profile.last_name
                } : {};
                mailer_1.default({
                    template: ref == "candidats" ? "modification_mdp_patient" : "modification_mdp_pharmacie",
                    footer: true,
                    from: "contact@pharmaloop.fr",
                    to: email,
                    subject: "Modification de mot de passe",
                    vars
                });
                res.end(JSON.stringify({ success: true }));
            })
                .catch(err => next(err));
        }
        else {
            return res.end(JSON.stringify({ success: false, field: "token" }));
        }
    }))
        .catch(err => next(err));
};
exports.AuthController = {
    register,
    login,
    logout,
    checkToken,
    sendResetCode,
    checkResetCode,
    resetPassword
};
//# sourceMappingURL=auth.controller.js.map