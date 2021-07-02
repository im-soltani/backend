const mongoose = require("mongoose");
import { EntrepriseModel } from "./entreprise.model";
import { JobModel } from "./job.model";
import { CompetenceModel } from "./competence.model";
import { SoftskillModel } from "./softskill.model";
import { FavoriteModel } from "./favorite.model";
import { UserModel } from "./user.model";
const mongoosastic = require("mongoosastic");
const elasticsearch = require("elasticsearch");
import { synchronize } from "./syncronize";
const OfferSchema = new mongoose.Schema(
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
    test_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      es_indexed: true,
    },
    name: {
      type: String,
      es_indexed: true,
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      es_indexed: true,
    },
    salary: {
      type: [Number],
      required: false,
      es_indexed: true,
    },
    salary_type: {
      type: String,
      es_indexed: true,
    },
    city: {
      type: String,
      es_indexed: true,
    },
    address: {
      type: String,
      es_indexed: true,
    },
    description_entreprise: {
      type: String,
      es_indexed: true,
    },
    description_poste: {
      type: String,
      es_indexed: true,
    },
    competence_description: {
      type: String,
      es_indexed: true,
    },
    banner: {
      type: String,
      required: false,
      es_indexed: true,
    },
    extra_file: {
      type: String,
      required: false,
      es_indexed: true,
    },
    competences_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      es_indexed: true,
    },
    jobs_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      es_indexed: true,
    },
    softskills_ids: {
      type: [mongoose.Schema.Types.ObjectId],
      es_indexed: true,
    },
    profile_type: {
      type: String,
      enum: [
        "JUNIOR",
        "SENIOR",
        "ARCHITECT",
        "BUSINESS_ANALYST",
        "PROJECT_MANAGER",
        "TEAM_LEADER",
      ],
      default: "JUNIOR",
      es_indexed: true,
    },
    contract: {
      type: String,
      enum: ["CDD", "STAGE", "CDI", "ALTERNANCE", "FREELENCE"],
      default: "CDD",
      es_indexed: true,
    },
    state: {
      type: String,
      enum: [
        "DRAFT",
        "ACTIF",
        "PUBLISHED",
        "ON_HOLD",
        "ARCHIVED",
        "DELETED",
        "ON_HOLD_BY_ADMIN",
      ],
      default: "DRAFT",
      es_indexed: true,
    },
    work_time: {
      type: String,
      enum: ["FULL", "HALF", "ANY"],
      default: "FULL",
      es_indexed: true,
    },
    experience: {
      type: String,
      enum: ["ONE", "TWO", "THREE", "FOUR", "FIVE", "MORE_THAN_FIVE"],
      default: "ONE",
      es_indexed: true,
    },
    etude: {
      type: String,
      enum: ["ONE", "TWO", "THREE", "FOUR", "FIVE", "MORE_THAN_FIVE"],
      default: "ONE",
      es_indexed: true,
    },
    startEducation: {
      type: Date,
      es_indexed: true,
    },
    endEducation: {
      type: Date,
      es_indexed: true,
    },
    startApply: {
      type: Date,
      es_indexed: true,
    },
    endApply: {
      type: Date,
      es_indexed: true,
    },
    startInternship: {
      type: Date,
      required: false,
      es_indexed: true,
    },
    endInternship: {
      type: Date,
      required: false,
      es_indexed: true,
    },
    typeFormation: {
      type: String,
      enum: ["Alternance", "Continue"],
      default: "Continue",
      es_indexed: true,
    },
    dureeFormation: {
      type: String,
      enum: ["TWO", "THREE", "FOUR", "FIVE"],
      default: "TWO",
      es_indexed: true,
    },
    expiredAt: {
      type: Date,
      es_indexed: true,
    },
    createdAt: {
      type: Date,
      es_indexed: true,
    },
    publishedAt: {
      type: Date,
      es_indexed: true,
    },
    offreType: {
      type: String,
      default: "JOB",
      es_indexed: true,
    },
    dureeContract: {
      type: Number,
      required: false,
      es_indexed: true,
    },
  },
  { timestamps: true, versionKey: false }
);
var esOffer = new elasticsearch.Client({
  host: false ? "http://localhost:9200" : "https://elastic.toolynk-lab.com",
});
OfferSchema.plugin(mongoosastic, {
  esClient: esOffer,
  index: "boostmyjob",
  transform: function (doc) {
    doc.competences = [];
    doc.jobs = [];
    doc.candidats = [];
    doc.softskills = [];
    EntrepriseModel.findById(doc.entreprise_id).then(async (entre) => {
      doc.entreprise = (entre as any).name;
      doc.entreprise_activity = (entre as any).activity;
      doc.entreprise_num = (entre as any).num;
      doc.entreprise_effective = (entre as any).effective;
      doc.entreprise_website = (entre as any).website;
      doc.entreprise_application_email = (entre as any).application_email;
      doc.entreprise_logo = (entre as any).profile_pic_url;
      doc.entreprise_city = (entre as any).city;
      doc.entreprise_address = (entre as any).address;
      await UserModel.findById(entre.uid[0]).then(async (user) => {
        doc.shown =
          !(user as any).is_blocked &&
          !(user as any).is_blocked_by_admin &&
          doc.state === "PUBLISHED";
      });
    });
    JobModel.findById(doc.job_id).then((job) => {
      doc.job = (job as any).name;
    });
    if (doc.competences_ids) {
      doc.competences_ids.map((comp) => {
        CompetenceModel.findById(comp).then((re) => {
          doc.competences.push((re as any).name);
        });
      });
    }
    if (doc.jobs_ids) {
      doc.jobs_ids.map((comp) => {
        JobModel.findById(comp).then((re) => {
          doc.jobs.push((re as any).name);
        });
      });
    }
    if (doc.softskills_ids) {
      doc.softskills_ids.map((comp) => {
        SoftskillModel.findById(comp).then((re) => {
          doc.softskills.push((re as any).name);
        });
      });
    }
    FavoriteModel.find({}).then((fav) => {
      fav.map((f) => doc.candidats.push(f as any));
    });
    return doc;
  },
});
const OfferModel = mongoose.model("offers", OfferSchema);
synchronize(OfferModel);

OfferModel.on("es-indexed", function (err, res) {
  if (err) throw err;
  console.log("here");
});

export { OfferModel };
