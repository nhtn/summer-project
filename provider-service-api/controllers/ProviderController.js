import mongoose, { mongo } from "mongoose"
import { providerSchema } from "../models/Provider.js"

const Provider = mongoose.model("Provider", providerSchema)

export const getProvidersByRegionAndJobId = (req, res, next) => {
    Provider.find({
            $and: [{
                    "address.country": req.body.country
                },
                {
                    "jobIds": { $in: [req.body.jobId] }
                }
            ]
        },
        function(err, providers) {
            if (err) {
                res.status(400).json({
                    message: err.toString()
                })
            } else {
                res.send(providers)
            }
        });
}

export const getProviderById = (req, res) => {
    Provider.find({ _id: req.params.providerId }, (err, provider) => {
        if (err) {
            res.status(400).json({
                message: err.toString()
            })
        } else {
            res.send(provider)
        }
    })
}

export const createProvider = (req, res) => {
    let newProvider = new Provider(req.body)
    newProvider.save()
        .then(provider => {
            res.send(provider)
        })
        .catch(err => {
            res.status(400).json({
                message: err.toString()
            });
        })
};


export const updateJobsToProvider = (req, res) => {
    Provider.findOneAndUpdate({ _id: req.params.providerId }, req.body, { new: true, useFindAndModify: false }, (err, jobIds) => {
        if (err) {
            res.status(400).json({
                message: err.toString()
            })
        } else {
            res.send(jobIds)
        }
    })
}

export const updateProvider = (req, res) => {
    Provider.findOneAndUpdate({ _id: req.params.providerId }, req.body, { new: true, useFindAndModify: false }, (err, provider) => {
        if (err) {
            res.status(400).json({
                message: err.toString()
            })
        } else {
            res.json({ message: "Successfully updated provider." })
        }
    })
}

export const deleteProviderById = (req, res) => {
    Provider.remove({ _id: req.params.providerId }, (err, provider) => {
        if (err) {
            res.status(400).json({
                message: err.toString()
            })
        } else {
            res.json({ message: "Successfully deleted provider from records." })
        }
    })
}