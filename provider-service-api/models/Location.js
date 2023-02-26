import mongoose from "mongoose"

const Schema = mongoose.Schema

export const locationSchema = new Schema({
    lat: {
        type: Number,
        required: "Latitude is required."
    },
    lng: {
        type: Number,
        required: "Longitude is required."
    }
})