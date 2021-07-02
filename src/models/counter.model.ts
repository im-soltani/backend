import {model, Schema} from "mongoose";

const counterSchema = new Schema({
    seq_name: {
        type: String,
        required: true
    },
    seq_value: {
        type: Number,
        required: true
    }
});

const CounterModel = model("counters", counterSchema);

const getNextSequenceValue = (seq_name) => new Promise((resolve, reject) => {
    CounterModel.findOne({seq_name})
        .then(counter => {
            if (counter) {
                (counter as any).seq_value += 1;
                counter.save()
                    .then(counter => resolve((counter as any).seq_value))
                    .catch(error => reject(error));
            } else {
                const counter = new CounterModel({seq_name, seq_value: 1001});
                counter.save().then(counter => resolve((counter as any).seq_value));
            }
        })
        .catch(error => reject(error));
});

export {
    getNextSequenceValue
};