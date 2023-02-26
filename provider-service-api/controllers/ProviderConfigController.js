import mongoose, { mongo } from "mongoose"
import { providerConfigSchema } from "../models/ProviderConfig.js"

const ProviderConfig = mongoose.model("ProviderConfig", providerConfigSchema)

export const createProviderConfig = (req, res) => {
    let newProviderConfig = new ProviderConfig(req.body)
    newProviderConfig.save()
        .then(providerConfig => {
            res.send(providerConfig)
        })
        .catch(err => {
            res.status(400).json({
                message: err.toString()
            });
        })
};

export const updateProviderConfig = (req, res) => {
    ProviderConfig.findOneAndUpdate({ jobId: req.params.jobId }, req.body, { new: true, useFindAndModify: false }, (err, providerConfig) => {
        if (err) {
            res.status(400).json({
                message: err.toString()
            })
        } else {
            res.json({ message: "Successfully updated provider config." })
        }
    })
}

export const getProviderConfigByJobId = (req, res) => {
    ProviderConfig.find({ jobId: req.params.jobId }, (err, providerConfig) => {
        if (err) {
            res.status(400).json({
                message: err.toString()
            })
        } else {
            res.send(providerConfig)
        }
    })
}