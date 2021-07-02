const excel = require("node-excel-export");
var _ = require("lodash");
import { existsSync, writeFileSync } from "fs";
import * as shelljs from "shelljs";
import { CandidatModel, OfferModel } from "../../../../models";
const styles = {
  headerDark: {
    font: {
      sz: 10,
      bold: true,
      underline: true
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

const wideSpecs = {
  headerStyle: styles.headerDark,
  cellStyle: styles.cellWithBorder,
  width: 400
};
const specification = {
  customer_name1: {
    displayName: "Les compétences les plus présentes dans la CVthèque",
    ...wideSpecs
  },
  customer_name2: {
    displayName: "Les compétences les plus demandées par les entreprises",
    ...wideSpecs
  },
  customer_name3: {
    displayName: "Les compétences les plus proposées par les écoles",
    ...wideSpecs
  }
};
const pipeline = type => {
  let filter = {
    offreType: type
  };
  return [
    { $match: filter },
    {
      $lookup: {
        from: "competences",
        as: "competences",
        localField: "competences_ids",
        foreignField: "_id"
      }
    },
    { $unwind: "$competences" }
  ];
};
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
function removeItem(array, item) {
  var i = array.length;

  while (i--) {
    if (array[i] === item) {
      array.splice(array.indexOf(item), 1);
    }
  }
}
async function competenceArray() {
  let competences = [];
  var count = {};
  let finalcompetenceArray = [];
  const tmp = await CandidatModel.find({})
    .then(candidates => {
      (candidates as any).map(candidate => {
        if (candidate.competences) competences.push(...candidate.competences);
      });
      competences.forEach(number => (count[number] = (count[number] || 0) + 1));
      competences.map(async val => {
        finalcompetenceArray.push({ val, occ: count[val] });
        removeItem(competences, val);
      });
      finalcompetenceArray.sort((a, b) => b.occ - a.occ);
      finalcompetenceArray.filter((data, idx) => idx < 20);
    })
    .then(() => {
      return finalcompetenceArray;
    });
  return Promise.resolve(tmp);
}

async function EcolecompetencesArray(type) {
  let competences = [];
  var count = {};
  let finalcompetenceArray = [];
  const tmp = await OfferModel.aggregate([pipeline(type)])
    .then(async ecoleOffers => {
      ecoleOffers.map(offer => {
        if (offer.competences) competences.push(offer.competences.name);
      });
      competences.forEach(number => (count[number] = (count[number] || 0) + 1));
      competences.map(async val => {
        finalcompetenceArray.push({ val, occ: count[val] });
        removeItem(competences, val);
      });
      finalcompetenceArray.sort((a, b) => b.occ - a.occ);
      finalcompetenceArray.filter((data, idx) => idx < 10);
    })
    .then(() => {
      return finalcompetenceArray;
    });
  return Promise.resolve(tmp);
}

async function convertArrays(arr1, arr2, arr3) {
  let toExportArray = [];
  let ArrayLength = Math.max(arr1.length, arr2.length, arr3.length);
  for (let i = 0; i < ArrayLength; i++) {
    toExportArray.push({
      customer_name1: arr1[i] != undefined ? arr1[i].val : "",
      customer_name2: arr2[i] != undefined ? arr2[i].val : "",
      customer_name3: arr3[i] != undefined ? arr3[i].val : ""
    });
  }
  return Promise.resolve(toExportArray);
}
export default (_, __) =>
  new Promise(async (resolve, reject) => {
    const finalEcoleArray = await EcolecompetencesArray("EDUCATION");
    const finalEntrepriseArray = await EcolecompetencesArray("JOB");
    const finalcompetenceArray = await competenceArray();
    const dataset = await convertArrays(
      finalcompetenceArray,
      finalEntrepriseArray,
      finalEcoleArray
    );

    const xls = excel.buildExport([
      {
        name: "Compétences", // <- Specify sheet name (optional)
        specification: specification, // <- Report specification
        data: dataset // <-- Report data
      }
    ]);
    const Url = await saveFile(xls);
    resolve(Url);
  });