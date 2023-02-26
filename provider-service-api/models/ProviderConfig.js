import mongoose from "mongoose"
import { matchingAttributesSchema } from "./MatchingAttribute.js"

const Schema = mongoose.Schema

export const providerConfigSchema = new Schema({
    jobId: {
        type: Number,
        required: "Job Id is required."
    },
    matchingAttributes: [
        matchingAttributesSchema
    ],
    created_date: {
        type: Date,
        default: Date.now()
    }
})