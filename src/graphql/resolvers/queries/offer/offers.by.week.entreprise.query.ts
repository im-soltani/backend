import { OfferModel, EntrepriseModel } from "../../../../models";
import * as moment from "moment";

export default (_, __, { user: { _id } }) =>
  EntrepriseModel.findOne({ uid: _id }).then(entreprise => {
    return OfferModel.find({ entreprise_id: entreprise._id }).then(offers => {
      let one = 0;
      let two = 0;
      let three = 0;
      let four = 0;
      let five = 0;
      let six = 0;
      let seven = 0;
      (offers as any).map(offer => {
        if (
          moment()
            .startOf("day")
            .diff(moment(offer.createdAt).startOf("day"), "days") === 0
        )
          one = one + 1;
        else if (
          moment()
            .startOf("day")
            .diff(moment(offer.createdAt).startOf("day"), "days") === 1
        )
          two = two + 1;
        else if (
          moment()
            .startOf("day")
            .diff(moment(offer.createdAt).startOf("day"), "days") === 2
        )
          three = three + 1;
        else if (
          moment()
            .startOf("day")
            .diff(moment(offer.createdAt).startOf("day"), "days") === 3
        )
          four = four + 1;
        else if (
          moment()
            .startOf("day")
            .diff(moment(offer.createdAt.startOf("day")), "days") === 4
        )
          five = five + 1;
        else if (
          moment()
            .startOf("day")
            .diff(moment(offer.createdAt).startOf("day"), "days") === 5
        )
          six = six + 1;
        else if (
          moment()
            .startOf("day")
            .diff(moment(offer.createdAt).startOf("day"), "days") === 6
        )
          seven = seven + 1;
      });
      return [one, two, three, four, five, six, seven];
    });
  });
