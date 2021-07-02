import { model, Schema } from "mongoose";

const AnnotationSchema = new Schema(
	{
		entreprise_id: {
			type: Schema.Types.ObjectId,
			required: true
		},
		user_id: {
			type: Schema.Types.ObjectId,
			required: true
		},
		candidate_id: {
			type: Schema.Types.ObjectId,
			required: true
		},
		commentaire: {
			type: String,
			required: true
		},
		createdAt: {
			type: String
		}
	},
	{ timestamps: true, versionKey: false }
);
export const AnnotationModel = model("annotation", AnnotationSchema);
