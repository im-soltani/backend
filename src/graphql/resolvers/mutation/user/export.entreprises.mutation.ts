const excel = require("node-excel-export");
var _ = require("lodash");
import { existsSync, writeFileSync } from "fs";
import * as shelljs from "shelljs";
import { CandidatModel, EntrepriseModel, OfferModel } from "../../../../models";
const styles = {
  headerDark: {
    font: {
      sz: 10,
      bold: true,
      underline: false,
    },
    alignment: {
      vertical: "center",
      horizontal: "center",
    },
    border: {
      bottom: { style: "medium" },
      right: { style: "medium" },
    },
  },
  cellWithBorder: {
    height: 300,
    border: {
      bottom: { style: "default" },
      right: { style: "default" },
    },
    alignment: {
      vertical: "center",
      horizontal: "left",
    },
  },
};

const wideSpecslG = {
  headerStyle: styles.headerDark,
  cellStyle: styles.cellWithBorder,
  width: 350,
};
const wideSpecs = {
  headerStyle: styles.headerDark,
  cellStyle: styles.cellWithBorder,
  width: 200,
};
const specification = {
  Nom: {
    displayName: "NOM DE L'ENTREPRISE",
    ...wideSpecslG,
  },
  zip_code: {
    displayName: "CODE POSTAL",
    ...wideSpecs,
  },
  nb_Publish: {
    displayName: "NOMBRE D'OFFRES PUBLIÉES",
    ...wideSpecs,
  },
  nb_cv: {
    displayName: "NOMBRE DE CV PARTAGÉS",
    ...wideSpecs,
  },
};
const pipelineAll = () => [
  {
    $lookup: {
      from: "users",
      as: "profile",
      localField: "uid",
      foreignField: "_id",
    },
  },
  { $unwind: "$profile" },
  {
    $match: {
      $and: [{ "profile.ref": { $ne: "admins" } }, { ent_type: "entreprises" }],
    },
  },

  {
    $lookup: {
      from: "applications",
      as: "applications",
      localField: "_id",
      foreignField: "entreprise_id",
    },
  },
];
const saveFile = (data) =>
  new Promise((resolve, reject) => {
    const filename = `${Date.now()}.xlsx`;
    try {
      const path = `uploads/xmls/${filename}`;
      if (!existsSync("uploads/xmls")) {
        shelljs.mkdir("-p", "uploads/xmls");
      }
      writeFileSync(path, data, "binary");
      resolve(`/media/xmls/${filename}`);
    } catch (e) {
      reject(e);
    }
  });
async function convertArrays(arr1) {
  let toExportArray = [];
  let ArrayLength = Math.max(arr1.length);
  for (let i = 0; i < ArrayLength; i++) {
    toExportArray.push({
      Nom: arr1[i] != undefined ? arr1[i].name : "",
      zip_code: arr1[i] != undefined ? arr1[i].zip_code : "",
      nb_Publish: await OfferModel.count({
        entreprise_id: arr1[i]._id,
        state: "PUBLISHED",
        offreType: "JOB",
      }),
      nb_cv: await CandidatModel.count({
        entreprises: { $elemMatch: { id: arr1[i].profile._id } },
      }),
    });
  }
  return Promise.resolve(toExportArray);
}
const removeDuplicates = (originalArray, prop) => {
  var newArray = [];
  var lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
};
export default (_, __) =>
  new Promise(async (resolve, reject) => {
    EntrepriseModel.aggregate(pipelineAll()).then(async (entreprises) => {
      let data = removeDuplicates(entreprises, "num");
      const dataset = await convertArrays(data);
      const xls = excel.buildExport([
        {
          name: "Entreprises", // <- Specify sheet name (optional)
          specification: specification, // <- Report specification
          data: dataset, // <-- Report data
        },
      ]);
      const Url = await saveFile(xls);
      resolve(Url);
    });
  });
