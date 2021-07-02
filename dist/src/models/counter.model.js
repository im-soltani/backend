"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const counterSchema = new mongoose_1.Schema({
    seq_name: {
        type: String,
        required: true
    },
    seq_value: {
        type: Number,
        required: true
    }
});
const CounterModel = mongoose_1.model("counters", counterSchema);
const getNextSequenceValue = (seq_name) => new Promise((resolve, reject) => {
    CounterModel.findOne({ seq_name })
        .then(counter => {
        if (counter) {
            counter.seq_value += 1;
            counter.save()
                .then(counter => resolve(counter.seq_value))
                .catch(error => reject(error));
        }
        else {
            const counter = new CounterModel({ seq_name, seq_value: 1001 });
            counter.save().then(counter => resolve(counter.seq_value));
        }
    })
        .catch(error => reject(error));
});
exports.getNextSequenceValue = getNextSequenceValue;
//# sourceMappingURL=counter.model.js.map