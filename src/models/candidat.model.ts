const mongoose = require("mongoose");
import { UserModel } from "./user.model";
const mongoosastic = require("mongoosastic");
const elasticsearch = require("elasticsearch");
import { synchronize } from "./syncronize";
const candidatSchema = new mongoose.Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      es_indexed: true,
    },
    num: {
      type: Number,
      required: true,
      unique: true,
      es_indexed: true,
    },
    note: {
      type: Number,
      es_indexed: true,
      default: 0,
    },
    first_name: {
      type: String,
      required: true,
      trim: true,
      es_indexed: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      es_indexed: true,
    },
    age: {
      type: Number,
      es_indexed: false,
    },
    sexe: {
      type: String,
      enum: ["Non renseigné", "Homme", "Femme"],
      default: "Non renseigné",
      es_indexed: false,
    },
    sharedby: {
      type: String,
      trim: true,
      dafault: "Mes CV",
      es_indexed: true,
    },
    profile_pic_url: {
      type: String,
      es_indexed: true,
    },
    cv: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      es_indexed: true,
    },
    cv_eng: {
      type: String,
      required: false,
      trim: true,
      lowercase: false,
      es_indexed: true,
    },
    jobs: {
      type: [String],
      es_indexed: true,
      default: [],
    },
    entreprises: {
      es_indexed: true,

      type: [
        {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            es_indexed: true,
          },
          mycv: {
            type: Boolean,
            required: true,
            es_indexed: true,
          },
          sharedcv: {
            type: Boolean,
            required: true,
            es_indexed: true,
          },
          recieved: {
            type: Boolean,
            required: true,
            es_indexed: true,
          },
          img_url: {
            type: String,
            default: "*",

            es_indexed: true,
          },
          rating: {
            type: Number,
            default: 1,
            es_indexed: true,
          },
          isFavoris: {
            type: Boolean,
            default: false,
            es_indexed: true,
          },
          createdAt: {
            type: Date,
            required: false,
            es_indexed: true,
          },
        },
      ],
      default: [],
    },
    sharedcv: {
      type: Boolean,
      default: false,
      es_indexed: true,
    },
    tel: {
      type: String,
      required: false,
      trim: true,
    },
    twitter: {
      type: String,
      required: false,
      trim: true,
    },
    siteweb: {
      type: String,
      required: false,
      trim: true,
    },
    linkedin: {
      type: String,
      required: false,
      trim: true,
    },
    cv_data: {
      type: String,
      required: false,
      trim: true,
      es_indexed: true,
    },
    cv_eng_data: {
      type: String,
      required: false,
      trim: true,
      es_indexed: true,
    },
    letter: {
      type: String,
      required: false,
      trim: true,
    },
    zip_code: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
      es_indexed: true,
    },
    city: {
      type: String,
      trim: true,
      es_indexed: true,
    },
    competences: {
      type: [String],
      es_indexed: true,
      default: [],
    },
    softskills: {
      type: [String],
      es_indexed: true,
      default: [],
    },
    contract: {
      type: String,
      enum: ["CDD", "STAGE", "CDI", "ALTERNANCE", "FREELENCE"],
      es_indexed: true,
    },
    experience: {
      type: String,
      enum: ["ONE", "TWO", "THREE", "FOUR", "FIVE", "MORE_THAN_FIVE"],
      es_indexed: true,
    },
    etude: {
      type: String,
      enum: ["ONE", "TWO", "THREE", "FOUR", "FIVE", "MORE_THAN_FIVE"],
      es_indexed: true,
    },
    disponibility: {
      type: Date,
      required: false,
      es_indexed: true,
    },
    salaire:{
      type: String,
      required: false,
      es_indexed: true,
    },
    createdAt: {
      type: Date,
      required: false,
      es_indexed: true,
    },
    sharedAt: {
      type: Date,
      required: false,
      es_indexed: true,
    },
  },
  { timestamps: true, versionKey: false }
);

var esClient = new elasticsearch.Client({
  host: false ? "http://localhost:9200" : "https://elastic.toolynk-lab.com",
});
candidatSchema.plugin(mongoosastic, {
  esClient: esClient,
  index: "boostmyjob",
  transform: function (doc) {
    UserModel.findById(doc.uid).then((user) => {
      doc.is_blocked = (user as any).is_blocked;
      doc.shared =
        !(user as any).is_blocked_by_admin &&
        !(user as any).is_blocked &&
        doc.sharedcv;
      doc.is_blocked_by_admin = (user as any).is_blocked_by_admin;
    });

    return doc;
  },
});

const CandidatModel = mongoose.model("candidats", candidatSchema);
synchronize(CandidatModel);

candidatSchema.on("es-indexed", function (err, res) {
  if (err) throw err;
  console.log("here");
});
/* candidatSchema.pre('remove', function(next) {
  ApplicationModel.deleteMany({candidat_id: this._id});
  FavoriteModel.deleteMany({clientcandidat_uid_id: this.uid});
  next();
}); */
export { CandidatModel };
