import 'dotenv/config'

BigInt.prototype.toJson = function () {
    return this.toString()
}

import express from 'express'
import cors from 'cors'
// import { PrismaClient } from '../generated/prisma/index.js'

const app = express()
// const prisma = new PrismaClient()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Server BeinBout Be is running perfectly'
    })
})

app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`)
})