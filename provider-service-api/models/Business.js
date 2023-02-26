import mongoose from "mongoose"

const Schema = mongoose.Schema

export const businessSchema = new Schema({
    abnNumber: {
        type: String,
        required: "ABN Number is required."
    },
    lineNumber: {
        type: String,
        required: "Phone number is required."
    },
    documents: {
        type: Array,
    }
})