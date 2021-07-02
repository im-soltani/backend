import { Types } from "mongoose";
var js2xmlparser = require("js2xmlparser");
import { existsSync, writeFileSync } from "fs";
import * as moment from "moment";
import * as shelljs from "shelljs";

import { OfferModel } from "../../../../models";

const pipeline = ({ _id, role, state }) => {
  let sort = {};
  sort = { createdAt: -1 };
  let filter = {
    state: "PUBLISHED",
  };
  return [
    {
      $match: filter,
    },
    {
      $lookup: {
        from: "entreprises",
        as: "entreprise",
        localField: "entreprise_id",
        foreignField: "_id",
      },
    },
    { $unwind: "$entreprise" },

    {
      $lookup: {
        from: "jobs",
        as: "job",
        localField: "job_id",
        foreignField: "_id",
      },
    },
    { $unwind: "$job" },
    {
      $lookup: {
        from: "softskills",
        as: "softskills_ff",
        localField: "softskills_ids",
        foreignField: "_id",
      },
    },
    { $sort: sort },
    { $limit: 9999 },
  ];
};
const saveFile = (_id, data) =>
  new Promise((resolve, reject) => {
    const filename = `Export_Meteojob_boostmyjob.xml`;
    try {
      const path = `uploads/xmls/${filename}`;
      if (!existsSync("uploads/xmls")) {
        shelljs.mkdir("-p", "uploads/xmls");
      }
      writeFileSync(path, data);
      resolve({ URL: `/media/xmls/${filename}` });
    } catch (e) {
      reject(e);
    }
  });

const AllPipeline = ({ _id, role, state }) => {
  let filter = {
    state: "PUBLISHED",
  };
  return [
    { $match: filter },
    {
      $lookup: {
        from: "entreprises",
        as: "entreprise",
        localField: "entreprise_id",
        foreignField: "_id",
      },
    },
    { $unwind: "$entreprise" },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "jobs",
        as: "job",
        localField: "job_id",
        foreignField: "_id",
      },
    },
    { $unwind: "$job" },
  ];
};
export default (
  _,
  { state },
  {
    user: {
      role,
      profile: { _id },
    },
  }
) =>
  OfferModel.aggregate([
    AllPipeline({
      _id,
      role,
      state,
    }),
  ]).then((totals) => {
    return OfferModel.aggregate([
      pipeline({
        _id,
        role,
        state,
      }),
    ]).then((offers) => {
      const promiseArray = offers.map(
        (val) =>
          new Promise((resolve, reject) => {
            const skillsTab = [];
            const DATA = [
              "Résistance à une forte charge de travail",
              "Capacité à apprendre",
            ];
            const RELATION = [
              "Engagement",
              "Motivation",
              "Intelligence émotionnelle",
              "Capacité d'intégration",
              "Empathie",
              "Relationnel",
            ];
            const CREATIVITY = ["Curiosité", "Créativité"];
            const INSTRUCTIONS = [
              "Autodiscipline",
              "Rigueur",
              "Application des consignes",
            ];
            const MANAGEMENT = [
              "Organisation",
              "Gestion du temps",
              "Management",
              "Résolution de problèmes",
              "Vision",
            ];
            let skills = val.softskills_ff.map((el) => {
              if (el.name == "Confiance en soi") {
                skillsTab.push("ORAL", "WRITTEN", "RELATION");
                return el.name;
              } else if (el.name == "Compétences analytiques") {
                skillsTab.push("DIGITS", "DATA");
                return el.name;
              } else if (DATA.includes(el.name)) {
                skillsTab.push("DATA");
                return el.name;
              } else if (RELATION.includes(el.name)) {
                skillsTab.push("RELATION");
                return el.name;
              } else if (CREATIVITY.includes(el.name)) {
                skillsTab.push("CREATIVITY");
                return el.name;
              } else if (INSTRUCTIONS.includes(el.name)) {
                skillsTab.push("INSTRUCTIONS");
                return el.name;
              } else if (MANAGEMENT.includes(el.name)) {
                skillsTab.push("MANAGEMENT");
                return el.name;
              }
            });
            let ss = [...new Set(skillsTab)].join();
            const objj = {
              reference: val.num,
              publicationDate: moment(val.publishedAt).format("YYYY-MM-DD"),
              expirationDate: moment(val.expiredAt).format("YYYY-MM-DD"),
              title: val.name,
              url: `https://boostmyjob.com/offre/${val.num}`,
              emails: val.entreprise.application_email,
              company: {
                id: val.entreprise.num,
                name: val.entreprise.name,
                description: val.entreprise.description,
                industry: "11",
                anonymous: false,
              },
              position: {
                jobs: val.job.name,
                description: val.description_poste,
                contractTypes:
                  (val.contract == "STAGE" && "TRAINING") ||
                  (val.contract == "FREELENCE" && "INDEPEDENT") ||
                  val.contract == "ALTERNANCE"
                    ? "ALTERNANCE"
                    : val.contract,
                workSchedules:
                  val.work_time == "FULL" ? "FULL_TIME" : "PART_TIME",
                travel: "UNDEFINED",
                telework: "UNDEFINED",
                location: {
                  town: val.city,
                },
                availability: {
                  preriod:
                    val.contract != "CDI" && val.dureeContract
                      ? val.dureeContract + " MONTH"
                      : "",
                },
                salary:
                  val.salary[0] == 0
                    ? {}
                    : {
                        min: val.salary[0],
                        max: val.salary[1],
                        period: "ANNUM",
                      },
              },
              profile: {
                experienceLevels:
                  (val.experience == "ONE" && "BEGINNER") ||
                  (val.experience == "TWO" && "ONE_TWO") ||
                  (val.experience == "THREE" && "THREE_FIVE") ||
                  (val.experience == "FOUR" && "SIX_TEN") ||
                  (val.experience == "FIVE" && "TEN_TWENTY") ||
                  (val.experience == "MORE_THAN_FIVE" && "TWENTY_AND_MORE"),
                degrees:
                  (val.etude == "ONE" && "BAC+1") ||
                  (val.etude == "TWO" && "BAC+2") ||
                  (val.etude == "THREE" && "BAC+3") ||
                  (val.etude == "FOUR" && "BAC+4") ||
                  (val.etude == "FIVE" && "BAC+5") ||
                  (val.etude == "MORE_THAN_FIVE" && "BAC+7"),
                languages: {
                  id: "FRENCH",
                  level: "FLUENT",
                },
                licences: "",
                softskills: ss,
                specializations: "",
                accreditations: "",
              },
            };
            return resolve(objj);
          })
      );
      Promise.all(promiseArray)
        .then((tempArray) => {
          const data = js2xmlparser.parse("offers", {
            offer: tempArray,
          });
          return saveFile(_id, data);
        })
        .then((url) => {
          return url;
        });
    });
  });
