import express, { Request, Response } from 'express'
import imageRouter from './routes/image'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())
app.use('/image', imageRouter)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})