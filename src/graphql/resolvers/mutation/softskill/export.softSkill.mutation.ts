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
      underline: true,
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

const wideSpecs = {
  headerStyle: styles.headerDark,
  cellStyle: styles.cellWithBorder,
  width: 400,
};
const specification = {
  customer_name1: {
    displayName: "LES SOFTSKILLS LES PLUS PRÉSENTS DANS LA CVTHÈQUE",
    ...wideSpecs,
  },
  customer_name2: {
    displayName: "LES SOFTSKILLS LES PLUS DEMANDÉS PAR LES ENTREPRISES",
    ...wideSpecs,
  },
};
const AllPipeline = () => [
  {
    $lookup: {
      from: "users",
      as: "profile",
      localField: "uid",
      foreignField: "_id",
    },
  },
  { $unwind: "$profile" },
];
const pipeline = ({}) => {
  return [
    {
      $match: {
        offreType: "JOB",
      },
    },
    {
      $lookup: {
        from: "softskills",
        as: "softskills",
        localField: "softskills_ids",
        foreignField: "_id",
      },
    },
    { $unwind: "$softskills" },
  ];
};
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

async function softskillsArray() {
  let softskillsArr = [];
  var count = {};
  let finalcompetenceArray = [];
  let non_duplidated_data = [];
  const tmp = await CandidatModel.aggregate(AllPipeline()).then(
    async (candidats) => {
      candidats.map((candidate) => {
        if (candidate.softskills) {
          softskillsArr.push(...candidate.softskills);
        }
      });
      softskillsArr.forEach(
        (number) => (count[number] = (count[number] || 0) + 1)
      );
      softskillsArr.map(async (val) => {
        finalcompetenceArray.push({ val, occ: count[val] });
      });
      var non_duplidated_data = _.uniqBy(finalcompetenceArray, "val");
      non_duplidated_data.sort((a, b) => b.occ - a.occ);
      non_duplidated_data.filter((data, idx) => idx < 20);
      return Promise.resolve(non_duplidated_data);
    }
  );
  return Promise.resolve(tmp);
}
async function EntreprisesoftskillsArray() {
  let softskills = [];
  var count = {};
  let finalcompetenceArray = [];
  const tmp = await OfferModel.aggregate(pipeline({})).then(
    async (entrepriseOffers) => {
      entrepriseOffers.map((offer) => {
        if (offer.softskills) softskills.push(offer.softskills.name);
      });
      softskills.forEach(
        (number) => (count[number] = (count[number] || 0) + 1)
      );
      softskills.map(async (val) => {
        finalcompetenceArray.push({ val, occ: count[val] });
      });
      let non_duplidated_data = _.uniqBy(finalcompetenceArray, "val");
      non_duplidated_data.sort((a, b) => b.occ - a.occ);
      non_duplidated_data.filter((data, idx) => idx < 20);
      return Promise.resolve(non_duplidated_data);
    }
  );
  return Promise.resolve(tmp);
}

async function convertArrays(arr1, arr2) {
  let toExportArray = [];
  let ArrayLength = Math.max(arr1.length, arr2.length);
  for (let i = 0; i < ArrayLength; i++) {
    toExportArray.push({
      customer_name1: arr1[i] != undefined ? arr1[i].val : "",
      customer_name2: arr2[i] != undefined ? arr2[i].val : "",
    });
  }
  return Promise.resolve(toExportArray);
}
export default (_, __) =>
  new Promise(async (resolve, reject) => {
    const CVthèqueArray = await softskillsArray();
    const finalcompetenceArray = await EntreprisesoftskillsArray();
    const dataset = await convertArrays(CVthèqueArray, finalcompetenceArray);

    const xls = excel.buildExport([
      {
        name: "softskills", // <- Specify sheet name (optional)
        specification: specification, // <- Report specification
        data: dataset, // <-- Report data
      },
    ]);
    const Url = await saveFile(xls);
    resolve(Url);
  });
