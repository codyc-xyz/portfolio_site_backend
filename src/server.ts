import express, { Request, Response } from 'express';
import multer from 'multer';
import { createHandler } from 'graphql-http/lib/use/express';
import schema from './schema';
import root from './resolvers';
const sharp = require(`sharp`);
const fs = require(`fs`);
const path = require(`path`);
const cors = require(`cors`);
import db from './db';  
import './models/DirectorAttributes'; 
import './models/MovieAttributes';
import './models/AuthorAttributes';
import './models/BookAttributes';
import './models/ExcerptAttributes';
import './associations'; 


const app = express();
var corsOptions = {
  origin: ['http://localhost:8000', 'https://codyc.xyz'],
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json());
const upload = multer({ dest: `uploads/` });

app.post(
  `/api/upload`,
  upload.single(`file`),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: `No file attached` });
    }
    return res
      .status(200)
      .json({ filename: req.file.filename, mimetype: req.file.mimetype });
  },
);

app.post(`/api/resize`, async (req: Request, res: Response) => {
  const { filename, width, height } = req.body;
  if (!filename || !width || !height) {
    return res.status(400).json({ error: `Invalid request parameters` });
  }

  const inputPath = path.join(__dirname, `/uploads/`, filename);
  const outputPath = path.join(__dirname, `/resized/`, filename);

  try {
    await sharp(inputPath)
      .resize(parseInt(width), parseInt(height))
      .toFile(outputPath);

    fs.readFile(outputPath, (err: Error, data: any) => {
      if (err) throw err;
      const base64String =
        `data:${req.file ? req.file.mimetype : `image/jpeg`};base64,` +
        data.toString(`base64`);
      res.status(200).json({ filename, base64String });

      fs.unlink(outputPath, (err: Error) => {
        if (err)
          console.log(`Failed to delete file ${outputPath}: ${err.message}`);
      });

      fs.unlink(inputPath, (err: Error) => {
        if (err)
          console.log(`Failed to delete file ${inputPath}: ${err.message}`);
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: `Failed to resize image` });
  }
});

app.all(
  `/graphql`,
  cors(corsOptions),
  createHandler({
    schema,
    rootValue: root,
  }),
);

const port = process.env.PORT || 3000;
db.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
