const mongoose = require("mongoose");
const mongoosastic = require("mongoosastic");
const elasticsearch = require("elasticsearch");
import { EntrepriseModel } from "./entreprise.model";
const ActualitéSchema = new mongoose.Schema(
  {
    num: {
      type: Number,
      required: true,
      unique: true,
      es_indexed: true,
    },
    entreprise_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      es_indexed: true,
    },
    title: {
      type: String,
      required: true,
      es_indexed: true,
    },
    description: {
      type: String,
      required: true,
      es_indexed: true,
    },
    lien: {
      type: String,
      es_indexed: true,
    },
    ent_type: {
      type: String,
      es_indexed: true,
    },
    startPublication: {
      type: Date,
      required: true,
      es_indexed: true,
    },
    endPublication: {
      type: Date,
      required: true,
      es_indexed: true,
    },
    eventDate: {
      type: Date,
      required: false,
      es_indexed: true,
    },
    visibleToCandidat: {
      type: Boolean,
      required: true,
      es_indexed: true,
      default: true,
    },
    visibleToAdherent: {
      type: Boolean,
      required: true,
      es_indexed: true,
      default: true,
    },
  },
  { timestamps: true, versionKey: false }
);
var esActualite = new elasticsearch.Client({
  host: false ? "http://localhost:9200" : "https://elastic.toolynk-lab.com",
});
ActualitéSchema.plugin(mongoosastic, {
  esClient: esActualite,
  index: "boostmyjob",
  transform: function (doc) {
    EntrepriseModel.findById(doc.entreprise_id).then(async (entre) => {
      doc.entreprise = (entre as any).name;
      doc.entreprise_activity = (entre as any).activity;
      doc.entreprise_num = (entre as any).num;
      doc.entreprise_effective = (entre as any).effective;
      doc.entreprise_website = (entre as any).website;
      doc.entreprise_application_email = (entre as any).application_email;
      doc.entreprise_logo = (entre as any).profile_pic_url;
      doc.entreprise_city = (entre as any).city;
    });
    return doc;
  },
});
const ActualiteModel = mongoose.model("actualité", ActualitéSchema);
ActualiteModel.createMapping(function (err, mapping) {
  if (err) {
    console.log("error creating mapping (you can safely ignore this)");
    console.log(err);
  } else {
    console.log("mapping created!");

    var stream = ActualiteModel.synchronize();
    var count = 0;

    stream.on("data", function (err, doc) {
      count++;
    });
    stream.on("close", function () {
      console.log("[ElasticSearch] Indexed " + count + " " + " documents!");
    });
    stream.on("error", function (err) {
      console.log("mongoosastic ERROR");
      console.log(err);
    });
  }
});

ActualiteModel.on("es-indexed", function (err, res) {
  if (err) throw err;
  console.log("here");
});

export { ActualiteModel };
