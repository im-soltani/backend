"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    id: (_) => _._id,
    candidat_rate_value: (_, __, { user: { profile: { _id } } }) => {
        const rate = _.rate_average.find(rate => rate.candidat_id.toString() == _id.toString());
        return rate ? rate.value : null;
    },
    has_candidat_rate: (_, __, { user: { profile: { _id } } }) => _.rate_average.find(rate => rate.candidat_id.toString() == _id.toString()) != undefined,
    rates_count: (_) => _.rate_average.length,
    rate_average: (_) => _.rate_average.reduce((i, j) => i.value + j.value, 0),
    work_holidays: _ => _.work_holidays ? _.work_holidays : []
};
//# sourceMappingURL=entreprise.js.map