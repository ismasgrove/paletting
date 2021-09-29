import express, { Request, Response, NextFunction } from 'express'
import multer from 'multer'

const router = express.Router()

const imageStorageEngine = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, './images')
    },
    filename: (_req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname)
    }
})

const allowedTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp'
]

const upload = multer({
    storage: imageStorageEngine,
    fileFilter: (_req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('File type is not allowed.'))
        }

        cb(null, true)
    }
})

router.post('/upload', upload.single('target'), (req: Request, res: Response) => {
    res.send('upload success')
})


router.get('/', (req: Request, res: Response) => {
    res.send('nothing')
})

export default router