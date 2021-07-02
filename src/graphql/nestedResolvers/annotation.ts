import { EntrepriseModel, UserModel } from "../../models";
import * as moment from "moment";
export default {
	id: _ => _._id,
	user: _ => UserModel.findById(_.user_id),
	entreprise: _ => EntrepriseModel.findById(_.entreprise_id),
	created: _ => moment(_.createdAt).locale("fr").fromNow()
};
