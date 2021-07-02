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

const wideSpecs = {
  headerStyle: styles.headerDark,
  cellStyle: styles.cellWithBorder,
  width: 350,
};
const specification = {
  customer_name1: {
    displayName: "LES MÉTIERS LES PLUS PRÉSENTS DANS LA CVTHÈQUE",
    ...wideSpecs,
  },
  customer_name2: {
    displayName: "LES MÉTIERS LES PLUS DEMANDÉS PAR LES ENTREPRISES",
    ...wideSpecs,
  },
  customer_name3: {
    displayName: "LES MÉTIERS LES PLUS FORMÉS PAR LES ÉCOLES",
    ...wideSpecs,
  },
};
const pipeline = (type) => {
  let filter = {
    offreType: type,
  };
  if (type === "JOB")
    return [
      { $match: filter },
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
  else
    return [
      { $match: filter },
      {
        $lookup: {
          from: "jobs",
          as: "job",
          localField: "jobs_ids",
          foreignField: "_id",
        },
      },
      { $unwind: "$job" },
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
function removeItem(array, item) {
  var i = array.length;

  while (i--) {
    if (array[i] === item) {
      array.splice(array.indexOf(item), 1);
    }
  }
}
async function jobsArray() {
  let jobs = [];
  var count = {};
  let finaljobArray = [];
  let total;
  const tmp = await CandidatModel.find({})
    .then((candidates) => {
      (candidates as any).map((candidate) => {
        if (candidate.jobs) jobs.push(...candidate.jobs);
      });
      total = jobs.length;
      jobs.forEach((number) => (count[number] = (count[number] || 0) + 1));
      jobs.map(async (val) => {
        finaljobArray.push({
          val:
            " ( " + ((count[val] * 100) / total).toFixed(2) + " % )  -" + val,
          occ: count[val],
        });

        removeItem(jobs, val);
      });
      finaljobArray.sort((a, b) => b.occ - a.occ);
      finaljobArray.filter((data, idx) => idx < 10);
    })
    .then(() => {
      return finaljobArray;
    });
  return Promise.resolve(tmp);
}

async function EcolejobsArray(type) {
  let jobs = [];
  var count = {};
  let finaljobArray = [];
  let total;
  const tmp = await OfferModel.aggregate([pipeline(type)])
    .then(async (ecoleOffers) => {
      ecoleOffers.map((offer) => {
        if (offer.job) jobs.push(offer.job.name);
      });
      total = jobs.length;
      jobs.forEach((number) => (count[number] = (count[number] || 0) + 1));
      removeItem(jobs, undefined);

      jobs.map(async (val) => {
        finaljobArray.push({
          val:
            " ( " + ((count[val] * 100) / total).toFixed(2) + " % )  -" + val,
          occ: count[val],
        });
        removeItem(jobs, val);
      });
      finaljobArray.sort((a, b) => b.occ - a.occ);
      finaljobArray.filter((data, idx) => idx < 10);
    })
    .then(() => {
      return finaljobArray;
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
      customer_name3: arr3[i] != undefined ? arr3[i].val : "",
    });
  }
  return Promise.resolve(toExportArray);
}

export default (_, __) =>
  new Promise(async (resolve, reject) => {
    const finaljobArray = await jobsArray();
    const finalEntrepriseArray = await EcolejobsArray("JOB");
    const finalEcoleArray = await EcolejobsArray("EDUCATION");
    const dataset = await convertArrays(
      finaljobArray,
      finalEntrepriseArray,
      finalEcoleArray
    );
    const xls = excel.buildExport([
      {
        name: "Métiers", // <- Specify sheet name (optional)
        specification: specification, // <- Report specification
        data: dataset, // <-- Report data
      },
    ]);
    const Url = await saveFile(xls);
    resolve(Url);
  });
