import mongoose from "mongoose"

const Schema = mongoose.Schema

export const customerSchema = new Schema({
    firstName: {
        type: String,
        required: "First name is required."
    },
    lastName: {
        type: String,
        required: "Last name is required."
    },
    email: {
        type: String,
        required: "Email is required."
    },
    phoneNumber: {
        type: String,
        required: "Phone number is required."
    },
    created_date: {
        type: Date,
        default: Date.now()
    }
})