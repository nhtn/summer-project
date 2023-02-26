import express from 'express'
import swaggerUi from 'swagger-ui-express'
import Yaml from 'yamljs'
import config from 'config'
import {
    getProvidersByRegionAndJobId,
    getProviderById,
    createProvider,
    updateJobsToProvider,
    deleteProviderById,
    updateProvider
} from "./controllers/ProviderController.js"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import {
    createProviderConfig,
    updateProviderConfig,
    getProviderConfigByJobId
} from './controllers/ProviderConfigController.js'

const app = express()
const port = 3000
const swaggerDocument = Yaml.load('./swagger.yaml');
const mongoDb = config.get('mongoDb').connection;

mongoose.Promise = global.Promise
mongoose.set('strictQuery', true);
const dbConnection = mongoose.connect(`${mongoDb}/providersDb`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static("views"))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.route("/providers")
    .post(createProvider)

app.route("/providers/search")
    .post(getProvidersByRegionAndJobId)

app.route("/providers/:providerId")
    .get(getProviderById)
    .post(updateProvider)
    .put(updateJobsToProvider)
    .delete(deleteProviderById)

app.route("/providers/config/create")
    .post(createProviderConfig)

app.route("/providers/config/:jobId")
    .put(updateProviderConfig)
    .get(getProviderConfigByJobId)

app.listen(port, () => {
    console.log(`Provider Service is listening on port: ${port}`)
})