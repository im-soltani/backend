const mongoose = require("mongoose");
const mongoosastic = require("mongoosastic");
const elasticsearch = require("elasticsearch");
import { UserModel } from "./user.model";
import { OfferModel } from "./offer.model";
import { synchronize } from "./syncronize";
import * as moment from "moment";
const entrepriseSchema = new mongoose.Schema(
  {
    num: {
      type: Number,
      required: true,
      unique: true,
      es_indexed: true,
    },
    uid: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      es_indexed: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      es_indexed: true,
    },
    company_id: {
      type: String,
      required: false,
    },
    name_of_in_charge: {
      type: String,
      required: true,
      trim: true,
    },
    profile_pic_url: {
      type: String,
      es_indexed: true,
    },
    application_email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    effective: {
      type: Number,
      default: 0,
      required: true,
    },
    member_number: {
      type: String,
      default: "TOOLYNK" + Math.random() + new Date().toString(),
    },
    activity: {
      type: [String],
      es_indexed: true,
    },
    banner: {
      type: String,
      required: false,
    },
    tel: {
      type: String,
      required: true,
      es_indexed: true,
    },
    website: {
      type: String,
      trim: true,
      lowercase: true,
      es_indexed: true,
    },
    description: {
      type: String,
    },
    location: {
      type: {
        type: String,
        enum: "Point",
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    address: {
      type: String,
      required: true,
      trim: true,
      es_indexed: true,
    },
    country: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      es_indexed: true,
    },
    zip_code: {
      type: String,
    },
    address_2: {
      type: String,
      trim: true,
    },
    country_2: {
      type: String,
      trim: true,
    },
    city_2: {
      type: String,
      trim: true,
    },
    zip_code_2: {
      type: String,
    },
    ent_type: {
      type: String,
      required: true,
      default: "entreprises",
      es_indexed: true,
    },
    leader: {
      type: Boolean,
    },
    leaderUid: {
      type: mongoose.Schema.Types.ObjectId,
    },
    prenom: {
      type: String,
      trim: true,
    },
    youtubeLink: {
      type: String,
      trim: true,
      es_indexed: false,
    },
    linkedinLink: {
      type: String,
      trim: true,
      es_indexed: false,
    },
  },
  { timestamps: true, versionKey: false }
);

entrepriseSchema.index({ location: "2dsphere" });

var esClient = new elasticsearch.Client({
  host: false ? "http://localhost:9200" : "https://elastic.toolynk-lab.com",
});
entrepriseSchema.plugin(mongoosastic, {
  esClient: esClient,
  index: "boostmyjob",
  transform: function (doc) {
    UserModel.findOne({ _id: doc.uid, is_holder: true }).then((user) => {
      doc.blocked =
        !(user as any).is_blocked_by_admin && !(user as any).is_blocked;
    });

    return doc;
  },
});

const EntrepriseModel = mongoose.model("entreprises", entrepriseSchema);
synchronize(EntrepriseModel);
synchronize(OfferModel);

export { EntrepriseModel };
