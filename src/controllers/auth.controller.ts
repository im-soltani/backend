import * as moment from "moment";
import mailer from "../../common/mailer";
import {
  AdminModel,
  CandidatModel,
  EmailModel,
  EntrepriseModel,
  SessionModel,
  SettingsModel,
  UserModel,
} from "../models";
import { getNextSequenceValue } from "../models/counter.model";
import {
  AdminRegisterInput,
  CandidatRegisterInput,
  EntrepriseRegisterInput,
  UserLinkedInLoginInput,
  UserLoginInput,
} from "../models/input/auth.input";
import { UserRole } from "../tools/contants";
import Token from "../tools/token";

const getSettingsPublic = (req, res, next) => {
  return SettingsModel.findOne().then((settings) => {
    res.end(JSON.stringify(settings, null, 5));
  });
};

const register = (req, res, next, role) => {
  let inputType = null;
  let model = null;
  let ref = null;
  switch (role) {
    case UserRole.ADMIN:
      inputType = AdminRegisterInput;
      model = AdminModel;
      ref = "admins";
      break;
    case UserRole.CANDIDAT:
      inputType = CandidatRegisterInput;
      model = CandidatModel;
      ref = "candidats";
      break;
    case UserRole.ENTREPRISE:
      inputType = EntrepriseRegisterInput;
      model = EntrepriseModel;
      ref = "entreprises";
      break;
    case UserRole.ECOLE:
      inputType = EntrepriseRegisterInput;
      model = EntrepriseModel;
      ref = "entreprises";
      break;
  }
  req.checkBody(inputType);

  const errors = req.validationErrors();
  if (errors) {
    return res.status(422).json({
      status: 422,
      success: false,
      message: "Vérifiez que tous les champs sont fournis",
      token: null,
      id: null,
      updatedAt: null,
    });
  }

  const data = req.body;
  UserModel.findOne({ email: data.email })
    .then((resulta) => {
      if (resulta) {
        res.status(503).json({
          status: 503,
          success: false,
          message: "Un compte avec cet email existe déjà",
          token: null,
          id: null,
          updatedAt: null,
        });
      } else {
        const user = new UserModel({
          email: data.email,
          password: data.password,
          ref,
        });
        if (UserRole.CANDIDAT === role) {
          user
            .save()
            .then(async (result) => {
              const newUser = new model({
                ...data,
                uid: result._id,
                last_name: data.last_name,
                first_name: data.first_name,
                sexe: data.sexe,
                num: await getNextSequenceValue(ref),
              });
              newUser
                .save()
                .then((user) => {
                  CandidatModel.createMapping(function (err, mapping) {
                    if (err) {
                      console.log(err);
                    } else {
                      var stream = CandidatModel.synchronize();
                      var count = 0;

                      stream.on("data", function (err, doc) {
                        count++;
                      });
                      stream.on("close", function () {});
                      stream.on("error", function (err) {
                        console.log(err);
                      });
                    }
                  });
                  Token.generate({ id: result._id, role })
                    .then((token) => {
                      const session = new SessionModel({
                        uid: result._id,
                        token,
                      });
                      session
                        .save()
                        .then(() => {
                          mailer({
                            template: "inscription_candidat",
                            footer: true,
                            from: '"BoostMyJob"<contact@boostmyjob.com>',
                            to: req.body.email,
                            subject: "Inscription",
                            vars: {
                              first_name: data.last_name,
                              last_name: data.first_name,
                              email: req.body.email,
                              password: data.password,
                            },
                          });
                          res.status(200).json({
                            status: 200,
                            success: true,
                            message: "SignUp avec sucess",
                            token,
                            id: user._id,
                            updatedAt: user.updatedAt,
                          });
                        })
                        .catch(async (err) => {
                          await user.remove();
                          next(err);
                        });
                    })
                    .catch(async (err) => {
                      await user.remove();
                      next(err);
                    });
                })
                .catch(async (err) => {
                  await user.remove();
                  next(err);
                });
            })
            .catch(async (err) => {
              await user.remove();
              next(err);
            });
        } else {
          user
            .save()
            .then(async (result) => {
              EntrepriseModel.findOne({ company_id: data.company_id }).then(
                async (entre) => {
                  if (!entre) {
                    new EmailModel({
                      name: "Refus d'une candidature",
                      template:
                        "<p><br><span style=\"color: rgb(0,0,0);font-size: 14px;font-family: sans-serif;\"> Votre candidature numéro {{num}} pour l'offre nommée {{nom_offre}} numéro {{num_offre}} a été refusé par l'entreprise en question.   </span><br>&nbsp;</p>",
                      subject: "Refus d'une candidature",
                      entreprise_uid: result._id,
                    }).save();
                    const newUser = new model({
                      ...data,
                      uid: result._id,
                      name: data.name,
                      company_id: data.company_id,
                      tel: data.tel,
                      website: data.website,
                      country: data.country || "France",
                      city: data.city,
                      zip_code: data.zip_code,
                      application_email: data.application_email,
                      name_of_in_charge: data.name_of_in_charge,
                      address: data.address,
                      num: await getNextSequenceValue(ref),
                    });
                    newUser
                      .save()
                      .then((user) => {
                        Token.generate({ id: result._id, role })
                          .then((token) => {
                            EntrepriseModel.createMapping(function (
                              err,
                              mapping
                            ) {
                              if (err) {
                                console.log(err);
                              } else {
                                var stream = EntrepriseModel.synchronize();
                                var count = 0;

                                stream.on("data", function (err, doc) {
                                  count++;
                                });
                                stream.on("close", function () {});
                                stream.on("error", function (err) {
                                  console.log(err);
                                });
                              }
                            });
                            const session = new SessionModel({
                              uid: result._id,
                              token,
                            });
                            session
                              .save()
                              .then(() => {
                                /* mailer({
                                template: "inscription_entreprise",
                                footer: true,
                                from: '"BoostMyJob"<contact@boostmyjob.com>',
                                to: req.body.email,
                                subject: "Inscription",
                                vars: {
                                  email: data.email,
                                  password: data.password
                                }
                              }); */
                                res.status(200).json({
                                  status: 200,
                                  success: true,
                                  message: "SignUp avec sucess",
                                  token,
                                  id: user._id,
                                  updatedAt: user.updatedAt,
                                });
                              })
                              .catch((err) => next(err));
                          })
                          .catch((err) => next(err));
                      })
                      .catch((err) => next(err));
                  } else {
                    entre.uid.push(result._id);
                    (result as any).is_holder = false;
                    result.save();
                    entre.save().then((entreUpdate) =>
                      Token.generate({ id: result._id, role })
                        .then((token) => {
                          EntrepriseModel.createMapping(function (
                            err,
                            mapping
                          ) {
                            if (err) {
                              console.log(err);
                            } else {
                              var stream = EntrepriseModel.synchronize();
                              var count = 0;

                              stream.on("data", function (err, doc) {
                                count++;
                              });
                              stream.on("close", function () {});
                              stream.on("error", function (err) {
                                console.log(err);
                              });
                            }
                          });
                          const session = new SessionModel({
                            uid: result._id,
                            token,
                          });
                          session
                            .save()
                            .then(() => {
                              /* mailer({
                              template: "inscription_entreprise",
                              footer: true,
                              from: '"BoostMyJob"<contact@boostmyjob.com>',
                              to: req.body.email,
                              subject: "Inscription",
                              vars: {
                                email: data.email,
                                password: data.password
                              }
                            }); */
                              res.status(200).json({
                                status: 200,
                                success: true,
                                message: "SignUp avec sucess",
                                token,
                                id: entreUpdate._id,
                                updatedAt: entreUpdate.updatedAt,
                              });
                            })
                            .catch((err) => next(err));
                        })
                        .catch((err) => next(err))
                    );
                  }
                }
              );
            })
            .catch(async (err) => {
              await user.remove();
              next(err);
            });
        }
      }
    })
    .catch((err) => next(err));
};

const registerfromoutside = (req, res, next, role) => {
  let inputType = null;
  let model = null;
  let ref = null;
  switch (role) {
    case UserRole.ADMIN:
      inputType = AdminRegisterInput;
      model = AdminModel;
      ref = "admins";
      break;
    case UserRole.CANDIDAT:
      inputType = CandidatRegisterInput;
      model = CandidatModel;
      ref = "candidats";
      break;
    case UserRole.ENTREPRISE:
      inputType = EntrepriseRegisterInput;
      model = EntrepriseModel;
      ref = "entreprises";
      break;
  }
  req.checkBody(inputType);

  const errors = req.validationErrors();
  if (errors) {
    return res.status(422).json({
      status: 422,
      success: false,
      message: "Vérifiez que tous les champs sont fournis",
      token: null,
      id: null,
      updatedAt: null,
    });
  }

  const data = req.body;
  UserModel.findOne({ email: data.email })
    .then((resulta) => {
      if (resulta) {
        res.status(503).json({
          status: 503,
          success: false,
          message: "Un compte avec cet email existe déjà",
          token: null,
          id: null,
          updatedAt: null,
        });
      } else {
        const user = new UserModel({
          email: data.email,
          password: data.password,
          ref,
        });
        if (UserRole.CANDIDAT === role) {
          user
            .save()
            .then(async (result) => {
              const newUser = new model({
                ...data,
                uid: result._id,
                last_name: data.last_name,
                first_name: data.first_name,
                num: await getNextSequenceValue(ref),
              });
              newUser
                .save()
                .then((user) => {
                  CandidatModel.createMapping(function (err, mapping) {
                    if (err) {
                      console.log(err);
                    } else {
                      var stream = CandidatModel.synchronize();
                      var count = 0;

                      stream.on("data", function (err, doc) {
                        count++;
                      });
                      stream.on("close", function () {});
                      stream.on("error", function (err) {
                        console.log(err);
                      });
                    }
                  });
                  Token.generate({ id: result._id, role })
                    .then((token) => {
                      const session = new SessionModel({
                        uid: result._id,
                        token,
                      });
                      session
                        .save()
                        .then(() => {
                          /*  mailer({
                            template: "inscription_candidat",
                            footer: true,
                            from: '"BoostMyJob"<contact@boostmyjob.com>',
                            to: req.body.email,
                            subject: "Inscription",
                            vars: {
                              first_name: data.last_name,
                              last_name: data.first_name,
                              email: req.body.email,
                              password: data.password
                            }
                          }); */
                          res.status(200).json({
                            status: 200,
                            success: true,
                            message: "SignUp avec sucess",
                            token,
                            id: user._id,
                            updatedAt: user.updatedAt,
                          });
                        })
                        .catch((err) => next(err));
                    })
                    .catch((err) => next(err));
                })
                .catch((err) => next(err));
            })
            .catch(async (err) => {
              await user.remove();
              next(err);
            });
        } else {
          user
            .save()
            .then(async (result) => {
              EntrepriseModel.findOne({ company_id: data.company_id }).then(
                async (entre) => {
                  if (!entre) {
                    new EmailModel({
                      name: "Refus d'une candidature",
                      template:
                        "<p><br><span style=\"color: rgb(0,0,0);font-size: 14px;font-family: sans-serif;\"> Votre candidature numéro {{num}} pour l'offre nommée {{nom_offre}} numéro {{num_offre}} a été refusé par l'entreprise en question.   </span><br>&nbsp;</p>",
                      subject: "Refus d'une candidature",
                      entreprise_uid: result._id,
                    }).save();
                    const newUser = new model({
                      ...data,
                      uid: result._id,
                      name: data.name,
                      company_id: data.company_id,
                      tel: data.tel,
                      website: data.website,
                      country: data.country || "France",
                      city: data.city,
                      zip_code: data.zip_code,
                      application_email: data.application_email,
                      name_of_in_charge: data.name_of_in_charge,
                      address: data.address,
                      num: await getNextSequenceValue(ref),
                    });
                    newUser
                      .save()
                      .then((user) => {
                        EntrepriseModel.createMapping(function (err, mapping) {
                          if (err) {
                            console.log(err);
                          } else {
                            var stream = EntrepriseModel.synchronize();
                            var count = 0;

                            stream.on("data", function (err, doc) {
                              count++;
                            });
                            stream.on("close", function () {});
                            stream.on("error", function (err) {
                              console.log(err);
                            });
                          }
                        });
                        Token.generate({ id: result._id, role })
                          .then((token) => {
                            const session = new SessionModel({
                              uid: result._id,
                              token,
                            });
                            session
                              .save()
                              .then(() => {
                                /*   mailer({
                                template: "inscription_entreprise",
                                footer: true,
                                from: '"BoostMyJob"<contact@boostmyjob.com>',
                                to: req.body.email,
                                subject: "Inscription",
                                vars: {
                                  email: data.email,
                                  password: data.password
                                }
                              }); */
                                res.status(200).json({
                                  status: 200,
                                  success: true,
                                  message: "SignUp avec sucess",
                                  token,
                                  id: user._id,
                                  updatedAt: user.updatedAt,
                                });
                              })
                              .catch((err) => next(err));
                          })
                          .catch((err) => next(err));
                      })
                      .catch((err) => next(err));
                  } else {
                    (result as any).is_holder = false;
                    result.save();
                    entre.uid.push(result._id);
                    entre.save().then((entreUpdate) =>
                      Token.generate({ id: result._id, role })
                        .then((token) => {
                          EntrepriseModel.createMapping(function (
                            err,
                            mapping
                          ) {
                            if (err) {
                              console.log(err);
                            } else {
                              var stream = EntrepriseModel.synchronize();
                              var count = 0;

                              stream.on("data", function (err, doc) {
                                count++;
                              });
                              stream.on("close", function () {});
                              stream.on("error", function (err) {
                                console.log(err);
                              });
                            }
                          });
                          const session = new SessionModel({
                            uid: result._id,
                            token,
                          });
                          session
                            .save()
                            .then(() => {
                              /*   mailer({
                              template: "inscription_entreprise",
                              footer: true,
                              from: '"BoostMyJob"<contact@boostmyjob.com>',
                              to: req.body.email,
                              subject: "Inscription",
                              vars: {
                                email: data.email,
                                password: data.password
                              }
                            }); */
                              res.status(200).json({
                                status: 200,
                                success: true,
                                message: "SignUp avec sucess",
                                token,
                                id: entreUpdate._id,
                                updatedAt: entreUpdate.updatedAt,
                              });
                            })
                            .catch((err) => next(err));
                        })
                        .catch((err) => next(err))
                    );
                  }
                }
              );
            })
            .catch(async (err) => {
              await user.remove();
              next(err);
            });
        }
      }
    })
    .catch((err) => next(err));
};

const login = (req, res, next, role) => {
  const data = req.body;
  req.checkBody(UserLoginInput);
  const errors = req.validationErrors();
  if (errors) {
    return res.sendStatus(422);
  }
  let ref = null;
  switch (role) {
    case UserRole.ADMIN:
      ref = "admins";
      break;
    case UserRole.CANDIDAT:
      ref = "candidats";
      break;
    case UserRole.ENTREPRISE:
      ref = "entreprises";
      break;
  }
  const { email, password } = data;
  UserModel.findOne({ email, ref })
    .then((user) => {
      if (!user) {
        return res.end(
          JSON.stringify(
            {
              success: false,
              message: "Cet email n'existe pas dans le système",
            },
            null,
            5
          )
        );
      }

      if (!(user as any).isValidPassword(password)) {
        return res.end(
          JSON.stringify(
            { success: false, message: "Mot de passe incorrect" },
            null,
            5
          )
        );
      }
      if (ref === "candidats") {
        let demande = false;
        CandidatModel.findOne({ uid: user._id }).then((candidat) => {
          if (candidat) {
            if (
              candidat &&
              !candidat.sharedcv &&
              candidat.entreprises &&
              candidat.entreprises.length > 0
            ) {
              candidat.entreprises.map((entre) => {
                if (entre.sharedcv) demande = true;
              });
            }

            Token.generate({ id: user._id, role })
              .then((token) => {
                const session = new SessionModel({ uid: user._id, token });
                session
                  .save()
                  .then(() =>
                    res.end(
                      JSON.stringify(
                        {
                          success: true,
                          demande,
                          message: "Login avec sucess",
                          token,
                          id: user._id,
                        },
                        null,
                        5
                      )
                    )
                  )
                  .catch((err) => next(err));
                const updated = moment().format();
                UserModel.findById({ _id: user._id }).then((user) => {
                  if (!user) {
                    console.log("error : ");
                  }
                  (user as any).last_Login = updated;
                  return user.save();
                });
              })
              .catch((err) => next(err));
          }
        });
      } else {
        Token.generate({ id: user._id, role })
          .then((token) => {
            const session = new SessionModel({ uid: user._id, token });
            session
              .save()
              .then(() =>
                res.end(
                  JSON.stringify(
                    {
                      success: true,
                      message: "Login avec sucess",
                      token,
                      id: user._id,
                    },
                    null,
                    5
                  )
                )
              )
              .catch((err) => next(err));
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
};

const loginWithLinkedIn = (req, res, next, role) => {
  const data = req.body;
  req.checkBody(UserLinkedInLoginInput);
  const errors = req.validationErrors();
  if (errors) {
    return res.sendStatus(422);
  }
  let ref = null;
  switch (role) {
    case UserRole.ADMIN:
      ref = "admins";
      break;
    case UserRole.CANDIDAT:
      ref = "candidats";
      break;
    case UserRole.ENTREPRISE:
      ref = "entreprises";
      break;
  }
  const { email } = data;
  UserModel.findOne({ email, ref })
    .then((user) => {
      if (!user) {
        return res.end(
          JSON.stringify(
            {
              success: false,
              message: "Cet email n'existe pas dans le système",
            },
            null,
            5
          )
        );
      }
      Token.generate({ id: user._id, role })
        .then((token) => {
          const session = new SessionModel({ uid: user._id, token });
          session
            .save()
            .then(() =>
              res.end(
                JSON.stringify(
                  {
                    success: true,
                    message: "Login avec sucess",
                    token,
                    id: user._id,
                  },
                  null,
                  5
                )
              )
            )
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

const loginOutSide = (req, res, next, role) => {
  const data = req.body;
  req.checkBody(UserLoginInput);
  const errors = req.validationErrors();
  if (errors) {
    return res.sendStatus(422);
  }
  let ref = null;
  switch (role) {
    case UserRole.ADMIN:
      ref = "admins";
      break;
    case UserRole.CANDIDAT:
      ref = "candidats";
      break;
    case UserRole.ENTREPRISE:
      ref = "entreprises";
      break;
  }
  const { email, password } = data;
  UserModel.findOne({ email, ref })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          status: 404,
          success: false,
          updatedAt: null,
          message: "Cet email n'existe pas dans le système",
        });
      }
      if (
        (user as any).password.localeCompare(password.replace("$2y$", "$2a$"))
      ) {
        return res.status(503).json({
          status: 503,
          success: false,
          updatedAt: null,
          message: "Mot de passe incorrect",
        });
      }
      Token.generate({ id: user._id, role })
        .then((token) => {
          const session = new SessionModel({ uid: user._id, token });
          session
            .save()
            .then(() =>
              res.status(200).json({
                status: 200,
                success: true,
                message: "Login avec sucess",
                token,
                updatedAt: (user as any).updatedAt,
                id: user._id,
              })
            )
            .catch((err) => next(err));
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

const logout = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.sendStatus(401);
  }
  SessionModel.findOne({ token })
    .then((session) => {
      if (!session) {
        return res.sendStatus(200);
      }
      session
        .remove()
        .then(() => res.sendStatus(200))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

const checkToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.sendStatus(401);
  }
  SessionModel.findOne({ token })
    .then((session) => {
      if (!session) {
        return res.sendStatus(401);
      }
      Token.ensure(token)
        .then(() =>
          res.status(200).json({
            status: 200,
            success: true,
            id: (session as any).uid,
          })
        )
        .catch(() => res.sendStatus(401));
    })
    .catch((err) => next(err));
};

const sendResetCode = (ref) => (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.sendStatus(422);
  }
  UserModel.aggregate([
    { $match: { email } },
    {
      $lookup: {
        from: ref,
        as: "profile",
        localField: "_id",
        foreignField: "uid",
      },
    },
    { $unwind: "$profile" },
  ]).then(async (users) => {
    if (!users.length) {
      return res.end(JSON.stringify({ success: false }));
    }
    const user = users[0];
    const min = 100000;
    const max = 999999;
    const code = Math.floor(Math.random() * (max - min + 1) + min);
    await UserModel.update(
      { email },
      {
        $set: {
          reset_password_code: code,
          reset_password_expires: Date.now() + 60 * 60 * 1000,
        },
      }
    )
      .then(() => {
        const vars = {
          code,
          name:
            ref == "candidats" || ref == "admins"
              ? user.profile.first_name + " " + user.profile.last_name
              : user.profile.name,
        };
        mailer({
          template: "mdp_oublie",
          footer: true,
          from: '"BoostMyJob"<contact@boostmyjob.com>',
          to: email,
          subject: "Modification de mot de passe",
          vars,
        });

        res.end(
          JSON.stringify({
            success: true,
            user:
              ref == "candidats" || ref == "admins"
                ? {
                    first_name: (user as any).profile.first_name,
                    last_name: (user as any).profile.last_name,
                    email: (user as any).email,
                  }
                : {
                    name: (user as any).profile.name,
                    email: (user as any).email,
                  },
          })
        );
      })
      .catch((error) => next(error));
  });
};

const checkResetCode = (req, res, next) => {
  const { email, reset_password_code } = req.body;
  if (!email || !reset_password_code) {
    return res.sendStatus(422);
  }
  UserModel.findOne({ email }).then((user) => {
    if (!user) {
      return res.end(JSON.stringify({ success: false, field: "email" }));
    }
    if ((user as any).reset_password_code == reset_password_code) {
      const token = Buffer.from(Math.random().toString()).toString("base64");
      (user as any).reset_password_code = null;
      (user as any).reset_password_token = token;
      user
        .save()
        .then(() =>
          res.end(
            JSON.stringify({ success: true, reset_password_token: token })
          )
        )
        .catch((err) => next(err));
    } else {
      return res.end(
        JSON.stringify({ success: false, field: "reset_password_code" })
      );
    }
  });
};

const checkEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.sendStatus(422);
  }
  UserModel.findOne({ email }).then((user) => {
    if (!user) {
      return res.end(
        JSON.stringify({ success: true, message: "Cet email est disponible" })
      );
    } else {
      return res.end(
        JSON.stringify({
          success: false,
          message: "Cet email est déjà utilisé",
          user: user,
        })
      );
    }
  });
};

const resetPassword = (ref) => (req, res, next) => {
  const { email, password, reset_password_token } = req.body;
  if (!email || !password || !reset_password_token) {
    return res.sendStatus(422);
  }
  UserModel.aggregate([
    { $match: { email } },
    {
      $lookup: {
        from: ref,
        as: "profile",
        localField: "_id",
        foreignField: "uid",
      },
    },
    { $unwind: "$profile" },
  ])
    .then(async (users) => {
      if (!users.length) {
        return res.end(JSON.stringify({ success: false, field: "email" }));
      }
      const user = await UserModel.findOne({ email });
      if ((user as any).reset_password_token == reset_password_token) {
        if ((user as any).reset_password_expires < Date.now()) {
          return res.end(JSON.stringify({ success: false, field: "expired" }));
        }
        const hash = await (UserModel as any).hashPassword(password);
        (user as any).reset_password_token = null;
        (user as any).reset_password_expires = null;
        (user as any).password = hash;
        user
          .save()
          .then(() => {
            const vars =
              ref == "candidats" || ref == "admins"
                ? {
                    first_name: users[0].profile.first_name,
                    last_name: users[0].profile.last_name,
                  }
                : {};
            mailer({
              template:
                ref == "candidats" || ref == "admins"
                  ? "modification_mdp_candidat"
                  : "modification_mdp_entreprise",
              footer: true,
              from: '"BoostMyJob"<contact@boostmyjob.com>',
              to: email,
              subject: "Modification de mot de passe",
              vars,
            });
            res.end(JSON.stringify({ success: true }));
          })
          .catch((err) => next(err));
      } else {
        return res.end(JSON.stringify({ success: false, field: "token" }));
      }
    })
    .catch((err) => next(err));
};

const updateSociety = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.sendStatus(401);
  }

  SessionModel.findOne({ token })
    .then((session) => {
      if (!session) {
        return res.sendStatus(401);
      }
      EntrepriseModel.findOne({ uid: (session as any).uid }).then((society) => {
        if (!society) return res.sendStatus(401);
        else {
          (society as any).name = req.body.name;
          (society as any).tel = req.body.tel;
          (society as any).website = req.body.website;
          (society as any).address = req.body.address;
          (society as any).country = req.body.country;
          (society as any).city = req.body.city;
          (society as any).zip_code = req.body.zip_code;
          (society as any).name_of_in_charge = req.body.name_of_in_charge;
          (society as any).application_email = req.body.application_email;

          return society.save().then((entreprise) => {
            return res.end(
              JSON.stringify(
                {
                  success: true,
                  message: "Update avec sucess",
                  token,
                },
                null,
                5
              )
            );
          });
        }
      });
    })
    .catch((err) => next(err));
};

const updatePassword = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      status: 401,
      success: false,
      updatedAt: null,
      message: "Token not found",
      token: null,
    });
  }
  if ((req.body && !req.body.email) || (req.body && !req.body.password)) {
    return res.status(401).json({
      status: 401,
      success: false,
      updatedAt: null,
      message: "Email or password not provided",
      token: null,
    });
  }
  SessionModel.findOne({ token })
    .then((session) => {
      if (!session) {
        return res.status(401).json({
          status: 401,
          success: false,
          updatedAt: null,
          message: "Token invalid",
          token: null,
        });
      } else {
        UserModel.findOne({ _id: (session as any).uid }).then((user) => {
          if (!user)
            return res.status(404).json({
              status: 404,
              success: false,
              updatedAt: null,
              message: "User not found",
              token: null,
            });
          else {
            (user as any).password = req.body.password.replace("$2y$", "$2a$");
            return user.save().then(() => {
              return res.status(200).json({
                status: 200,
                success: true,
                updatedAt: (user as any).updatedAt,
                message: "Update avec sucess",
                token,
              });
            });
          }
        });
      }
    })
    .catch((err) => next(err));
};

const updatePasswordForced = (req, res, next) => {
  if ((req.body && !req.body.email) || (req.body && !req.body.password)) {
    return res.status(401).json({
      status: 401,
      success: false,
      updatedAt: null,
      message: "Email or password not provided",
      token: null,
    });
  }
  UserModel.findOne({ email: req.body.email })
    .then((user) => {
      if (!user)
        return res.status(404).json({
          status: 404,
          success: false,
          updatedAt: null,
          message: "User not found",
          token: null,
        });
      else {
        (user as any).password = req.body.password.replace("$2y$", "$2a$");
        return user.save().then(() => {
          return res.status(200).json({
            status: 200,
            success: true,
            updatedAt: (user as any).updatedAt,
            message: "Update avec sucess",
          });
        });
      }
    })
    .catch((err) => next(err));
};

export const AuthController = {
  register,
  login,
  updatePasswordForced,
  registerfromoutside,
  logout,
  checkToken,
  sendResetCode,
  checkResetCode,
  resetPassword,
  updateSociety,
  updatePassword,
  loginOutSide,
  loginWithLinkedIn,
  checkEmail,
  getSettingsPublic,
};
