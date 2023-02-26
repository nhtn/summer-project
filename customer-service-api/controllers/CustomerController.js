import mongoose, { mongo } from "mongoose"
import { customerSchema } from "../models/Customer.js"

const Customer = mongoose.model("Customer", customerSchema)

export const getCustomerById = (req, res) => {
    Customer.find({ _id: req.params.customerId }, (err, customer) => {
        if (err) {
            res.status(400).json({
                message: err.toString()
            })
        } else {
            res.send(customer)
        }
    })
}

export const createCustomer = (req, res) => {
    let newCustomer = new Customer(req.body)
    newCustomer.save()
        .then(customer => {
            res.send(customer)
        })
        .catch(err => {
            res.status(400).json({
                message: err.toString()
            })
        })
};

export const updateCustomer = (req, res) => {
    Customer.findOneAndUpdate({ _id: req.params.customerId }, req.body, { new: true, useFindAndModify: false }, (err, customer) => {
        if (err) {
            res.status(400).json({
                message: err.toString()
            })
        } else {
            res.json({ message: "Successfully updated customer." })
        }
    })
}

export const deleteCustomerById = (req, res) => {
    Customer.remove({ _id: req.params.customerId }, (err, customer) => {
        if (err) {
            res.status(400).json({
                message: err.toString()
            })
        } else {
            res.json({ message: "Successfully deleted customer from records." })
        }
    })
}