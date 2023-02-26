import mongoose from "mongoose"

const Schema = mongoose.Schema

export const matchingAttributesSchema = new Schema({
    name: {
        type: String,
        required: "Attribute name is required."
    },
    operator: {
        type: String,
        required: "Operator is required."
    },
    path: {
        type: String,
        required: "Path is required."
    },
    value: {
        type: String,
        required: "Value is required."
    }
})