import mongoose from "mongoose"
import { businessSchema } from "./Business.js"
import { addressSchema } from "./Address.js"
import { locationSchema } from "./Location.js"

const Schema = mongoose.Schema

export const providerSchema = new Schema({
    providerCode: {
        type: String,
        required: "Provider code is required."
    },
    providerName: {
        type: String,
        required: "Provider Name is required."
    },
    providerDescription: {
        type: String
    },
    companyName: {
        type: String,
        required: "Company name is required."
    },
    address: {
        type: addressSchema,
        required: "Address is required."
    },
    business: {
        type: businessSchema
    },
    jobIds: {
        type: Array
    },
    rating: {
        type: String
    },
    location: {
        type: locationSchema
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
})