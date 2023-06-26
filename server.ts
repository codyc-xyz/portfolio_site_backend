import express, { Request, Response } from 'express';
import multer from 'multer';
import { createHandler } from 'graphql-http/lib/use/express';
import schema from './src/schema';
import root from './src/resolvers';

const { Sequelize, DataTypes } = require(`sequelize`);
const dotenv = require(`dotenv`);
const sharp = require(`sharp`);
const fs = require(`fs`);
const path = require(`path`);
const cors = require(`cors`);
const Movie = require(`./src/types/MovieAttributes`);
const Director = require(`./src/types/DirectorAttributes`);
const Book = require(`./src/types/BookAttributes`);
const Excerpt = require(`./src/types/ExcerptAttributes`);
const Author = require(`./src/types/AuthorAttributes`);
const Project = require(`./src/types/ProjectAttributes`);

dotenv.config();
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

let dbUrl;
if (process.env.DATABASE_URL) {
  dbUrl = process.env.DATABASE_URL;
} else {
  dbUrl = process.env.DB_URL;
}

const db = new Sequelize(dbUrl, {
  dialect: 'postgres',
  protocol: 'postgres',
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false
  //   }
  // }
});

Project.init(
  {
    project_uid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    project_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_started: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    technologies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    project_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    github_project_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    github_ui_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: `project`, timestamps: false },
);

Excerpt.init(
  {
    excerpt_uid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    page_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    chapter: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    book_uid: {
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey: true,
    },
  },
  { sequelize: db, modelName: `excerpt`, timestamps: false },
);

Author.init(
  {
    author_uid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    author_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author_biography: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_author_born: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_author_deceased: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    author_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country_of_birth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: `author`, timestamps: false },
);

Book.init(
  {
    book_uid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    book_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    book_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_book_published: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    pages: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    book_subjects: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    book_cover_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    goodreads_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country_of_origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    author_uid: {
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey: true,
    },
  },
  { sequelize: db, modelName: `book`, timestamps: false },
);

Movie.init(
  {
    movie_uid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    movie_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    movie_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    length_in_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_movie_released: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    movie_genres: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    movie_poster: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    letterboxd_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    screenshot_links: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    country_of_origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content_warnings: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    director_uid: {
      type: DataTypes.STRING,
      allowNull: false,
      foreignKey: true,
    },
  },
  { sequelize: db, modelName: `movie`, timestamps: false },
);

Director.init(
  {
    director_uid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    director_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    director_biography: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_director_born: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_director_deceased: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    director_country_of_birth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    director_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: `director`, timestamps: false },
);

Movie.belongsTo(Director, { foreignKey: `director_uid` });
Director.hasMany(Movie, { foreignKey: `director_uid` });
Book.belongsTo(Author, { foreignKey: `author_uid` });
Author.hasMany(Book, { foreignKey: `author_uid` });
Book.hasMany(Excerpt, { foreignKey: `book_uid` });
Excerpt.belongsTo(Book, { foreignKey: `book_uid` });

app.all(
  `/graphql`,
  createHandler({
    schema,
    rootValue: root,
  }),
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
