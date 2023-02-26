import mongoose from "mongoose"

const Schema = mongoose.Schema

export const addressSchema = new Schema({
    street: {
        type: String,
        required: "Street is required."
    },
    postcode: {
        type: Number,
        required: "PostCode is required."
    },
    country: {
        type: String,
        required: "Country is required."
    },
})