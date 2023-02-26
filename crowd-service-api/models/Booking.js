import mongoose from "mongoose"
import { addressSchema } from "./Address.js"

const Schema = mongoose.Schema

export const bookingSchema = new Schema({
    from: {
        type: addressSchema
    },
    to: {
        type: addressSchema
    },
    jobId: {
        type: Number,
        required: "JobId is required."
    }
})