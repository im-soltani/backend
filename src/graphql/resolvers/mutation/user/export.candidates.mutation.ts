const excel = require("node-excel-export");
var _ = require("lodash");
import { existsSync, writeFileSync } from "fs";
import { Types } from "mongoose";
import * as shelljs from "shelljs";
import { CandidatModel, EntrepriseModel } from "../../../../models";

const etudeConst = [
  {
    id: 1,
    value: "ONE",
    label: "BAC+1"
  },
  {
    id: 2,
    value: "TWO",
    label: "BAC+2"
  },
  {
    id: 3,
    value: "THREE",
    label: "BAC+3"
  },
  {
    id: 4,
    value: "FOUR",
    label: "BAC+4"
  },
  {
    id: 5,
    value: "FIVE",
    label: "BAC+5"
  },
  {
    id: 6,
    value: "MORE_THAN_FIVE",
    label: "> BAC+5"
  }
];
const styles = {
  headerDark: {
    font: {
      sz: 10,
      bold: true,
      underline: false
    },
    alignment: {
      vertical: "center",
      horizontal: "center"
    },
    border: {
      bottom: { style: "medium" },
      right: { style: "medium" }
    }
  },
  cellWithBorder: {
    height: 300,
    border: {
      bottom: { style: "default" },
      right: { style: "default" }
    },
    alignment: {
      vertical: "center",
      horizontal: "left"
    }
  }
};

const wideSpecslG = {
  headerStyle: styles.headerDark,
  cellStyle: styles.cellWithBorder,
  width: 350
};
const wideSpecs = {
  headerStyle: styles.headerDark,
  cellStyle: styles.cellWithBorder,
  width: 200
};
const specification = {
  Nom: {
    displayName: "NOM",
    ...wideSpecslG
  },
  Prenom: {
    displayName: "PRÉNOM",
    ...wideSpecslG
  },
  email: {
    displayName: "EMAIL",
    ...wideSpecslG
  },
  partegé: {
    displayName: "CV PARTAGÉ",
    ...wideSpecs
  },
  partagé_par: {
    displayName: "CV PARTAGÉ PAR",
    ...wideSpecs
  },
  partagé_le: {
    displayName: "CV PARTAGÉ LE",
    ...wideSpecs
  },
  recherche: {
    displayName: "À L'ÉCOUTE DU MARCHÉ",
    ...wideSpecs
  },
  last_login: {
    displayName: "DATE DE DERNIÈRE CONNEXION",
    ...wideSpecs
  },
  métier: {
    displayName: "MÉTIER",
    ...wideSpecs
  },
  etude: {
    displayName: "NIVEAU D'ÉTUDE",
    ...wideSpecs
  },
  zip_code: {
    displayName: "CODE POSTALE",
    headerStyle: styles.headerDark,
    cellStyle: styles.cellWithBorder,
    width: 350
  }
};
const AllPipeline = () => [
  {
    $lookup: {
      from: "users",
      as: "profile",
      localField: "uid",
      foreignField: "_id"
    }
  },
  { $unwind: "$profile" }
];
const saveFile = data =>
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
    let data = arr1[i].entreprises[0]
      ? await EntrepriseModel.findOne({
          uid: { $in: [Types.ObjectId(arr1[i].entreprises[0].id)] }
        })
      : "";
    toExportArray.push({
      Nom: arr1[i] != undefined ? arr1[i].last_name : "",
      Prenom: arr1[i] != undefined ? arr1[i].first_name : "",
      email: arr1[i] != undefined ? arr1[i].profile.email : "",
      partegé: arr1[i].sharedcv == true ? "OUI" : "NON",
      recherche: arr1[i].profile.is_blocked == true ? "NON" : "OUI",
      last_login:
        arr1[i].profile.last_Login != undefined
          ? arr1[i].profile.last_Login
          : "",
      métier: arr1[i].jobs.length > 0 && arr1[i].jobs != [] ? arr1[i].jobs : "",
      etude:
        arr1[i].etude != undefined
          ? etudeConst.filter(exp => exp.value === arr1[i].etude)[0].label
          : "",
      zip_code:
        arr1[i].zip_code != undefined && arr1[i].zip_code != null
          ? arr1[i].zip_code
          : "",
      partagé_par:
        data != "" && data != null && data != undefined ? data._doc.name : "",
      partagé_le:
        arr1[i].entreprises != [] && arr1[i].entreprises.length > 0
          ? arr1[i].entreprises[0].createdAt
          : ""
    });
  }
  return Promise.resolve(toExportArray);
}
export default (_, __) =>
  new Promise(async (resolve, reject) => {
    CandidatModel.aggregate(AllPipeline()).then(async candidats => {
      const dataset = await convertArrays(candidats);
      const xls = excel.buildExport([
        {
          name: "Candidats", // <- Specify sheet name (optional)
          specification: specification, // <- Report specification
          data: dataset // <-- Report data
        }
      ]);
      const Url = await saveFile(xls);
      resolve(Url);
    });
  });