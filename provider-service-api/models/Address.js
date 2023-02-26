import mongoose from "mongoose"

const Schema = mongoose.Schema

export const addressSchema = new Schema({
    address: {
        type: String,
        required: "Unit number and street name are required."
    },
    state: {
        type: String,
        required: "State is required."
    },
    city: {
        type: String,
        required: "City is required."
    },
    suburb: {
        type: String,
        required: "Suburb is required."
    },
    postCode: {
        type: Number,
        required: "PostCode is required."
    },
    country: {
        type: String,
        required: "Country is required."
    },
})