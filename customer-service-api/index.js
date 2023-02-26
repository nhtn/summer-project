import express from 'express'
import swaggerUi from 'swagger-ui-express'
import Yaml from 'yamljs'
import config from 'config'
import {
    createCustomer,
    deleteCustomerById,
    getCustomerById,
    updateCustomer
} from "./controllers/CustomerController.js"
import mongoose from "mongoose"
import bodyParser from "body-parser"

const app = express()
const port = 3001
const swaggerDocument = Yaml.load('./swagger.yaml');
const mongoDb = config.get('mongoDb').connection;

mongoose.Promise = global.Promise
mongoose.set('strictQuery', true);
const dbConnection = mongoose.connect(`${mongoDb}/customersDb`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static("views"))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.route("/customers")
    .post(createCustomer)

app.route("/customers/:customerId")
    .get(getCustomerById)
    .put(updateCustomer)
    .delete(deleteCustomerById)

app.listen(port, () => {
    console.log(`Provider Service is listening on port: ${port}`)
})