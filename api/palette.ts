import { VercelRequest, VercelResponse } from '@vercel/node'
import mongoose from 'mongoose'
import Palette from '../src/models/palette'

const connect = () => {
    mongoose.connect(process.env.MONGODB_URI!,
        (error) => {
            if (error) console.log(error)
        })

    const connection = mongoose.connection

    connection.once("open", () => {
        console.log("MongoDB connection established.")
    })
    connection.on("error", (error) => {
        console.log(error)
    })

    return connection
}


export default (req: VercelRequest, res: VercelResponse) => {
    connect()

    if (req.method === "GET") {
        Palette.find()
            .then(palette => {
                res.status(200).json(palette)
            })
            .catch(error => res.status(500).json(error.message))
    } else if (req.method === "POST") {
        const newPalette = new Palette(req.body)
        newPalette.save()
            .then(newPalette => res.status(200).json(newPalette))
            .catch(error => res.status(500).json(error.message))
    }
    // else if (req.method === "DELETE") {
    // const { _id } = req.body
    // Palette.findByIdAndDelete(_id)
    // .then(deleted => res.status(200).json(deleted))
    // .catch(error => res.status(500).json(error.message))
    // } else if (req.method === "PUT") {
    // const { palette, count, _id } = req.body
    // Palette.findByIdAndUpdate(_id, { palette, count }, { returnOriginal: false })
    // .then(deleted => res.status(200).json(deleted))
    // .catch(error => res.status(500).json(error.message))
    // }
}