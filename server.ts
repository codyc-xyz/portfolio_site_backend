import express, { Request, Response } from 'express';
import multer from 'multer';

const { Sequelize, DataTypes } = require(`sequelize`);
const dotenv = require(`dotenv`);
const sharp = require(`sharp`);
const fs = require(`fs`);
const path = require(`path`);
const cors = require(`cors`);
const Movie = require(`./types/MovieAttributes`);
const Director = require(`./types/DirectorAttributes`);
const Book = require(`./types/BookAttributes`);
const Excerpt = require(`./types/ExcerptAttributes`);
const Author = require(`./types/AuthorAttributes`);
const Project = require(`./types/ProjectAttributes`);
import { createHandler } from 'graphql-http/lib/use/express';
const { buildSchema } = require(`graphql`);

dotenv.config();
const app = express();
var corsOptions = {
  origin: ['http://localhost:8000', 'https://main--jazzy-chimera-85d94c.netlify.app'],
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

const schema = buildSchema(`
  type Movie {
    movie_uid: String!
    movie_title: String!
    movie_description: String!
    length_in_minutes: Int!
    date_movie_released: String!
    movie_genres: [String!]!
    movie_poster: String!
    letterboxd_link: String!
    screenshot_links: [String!]!
    country_of_origin: String!
    content_warnings: [String!]
    director_uid: String!
    director: Director!
  }

  type Director {
    director_uid: String!
    director_name: String!
    director_biography: String!
    date_director_born: String!
    date_director_deceased: String
    director_country_of_birth: String!
    director_image: String!
    movies: [Movie!]!
  }
  type Book {
    book_uid: String!
    book_title: String!
    book_description: String!
    pages: Int!
    date_book_published: String!
    book_subjects: [String!]!
    book_cover_image: String!
    goodreads_link: String!
    isbn: String!
    country_of_origin: String!
    author_uid: String!
    author: Author!
    excerpts: [Excerpt]
  }
  type Author {
    author_uid: String!
    author_name: String!
    author_biography: String!
    date_author_born: String!
    date_author_deceased: String
    author_image: String!
    country_of_birth: String!
    books: [Book!]!
  }

  type Excerpt {
    excerpt_uid: String!
    text: String!
    page_number: Int!
    chapter: String
    section: String
    book_uid: String!
    book: Book!
  }

  type Project {
    project_uid: String!
    project_name: String!
    project_description: String!
    project_status: String!
    date_started: String!
    technologies: [String!]!
    project_image: String!
    project_size: String!
    project_link: String!
    github_project_link: String!
    github_ui_link: String
  }

  type Query {
    allDirectors: [Director!]!
    allMovies: [Movie!]!
    allBooks: [Book!]!
    allAuthors: [Author!]!
    allExcerpts: [Excerpt!]!
    allProjects: [Project!]!
  }
`);

const root = {
  allDirectors: async () => {
    try {
      const directors = await Director.findAll({
        include: [Movie],
        attributes: [
          `director_uid`,
          `director_name`,
          `director_biography`,
          `date_director_born`,
          `date_director_deceased`,
          `director_country_of_birth`,
          `director_image`,
        ],
        tableName: `director`,
      });
      return directors;
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Server Error`);
    }
  },
  Director: {
    movies: async (parent: { director_uid: string }) => {
      try {
        const movies = await Movie.findAll({
          where: { director_uid: parent.director_uid },
        });
        return movies;
      } catch (error) {
        console.error(error);
        throw new Error(`Internal Server Error`);
      }
    },
  },
  allMovies: async () => {
    try {
      const movies = await Movie.findAll({
        include: [Director],
        attributes: [
          `movie_uid`,
          `movie_title`,
          `movie_description`,
          `length_in_minutes`,
          `date_movie_released`,
          `movie_genres`,
          `movie_poster`,
          `letterboxd_link`,
          `screenshot_links`,
          `country_of_origin`,
          `content_warnings`,
          `director_uid`,
        ],
        tableName: `movie`,
      });
      return movies;
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Server Error`);
    }
  },
  allBooks: async () => {
    try {
      const books = await Book.findAll({
        include: [Author, Excerpt],
        attributes: [
          `book_uid`,
          `book_title`,
          `book_description`,
          `pages`,
          `date_book_published`,
          `book_subjects`,
          `book_cover_image`,
          `goodreads_link`,
          `isbn`,
          `country_of_origin`,
          `author_uid`,
        ],
        tableName: `book`,
      });
      return books;
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Server Error`);
    }
  },
  allAuthors: async () => {
    try {
      const authors = await Author.findAll({
        include: [Book],
        attributes: [
          `author_uid`,
          `author_name`,
          `author_biography`,
          `date_author_born`,
          `date_author_deceased`,
          `author_image`,
          `country_of_birth`,
        ],
        tableName: `author`,
      });
      return authors;
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Server Error`);
    }
  },
  Author: {
    books: async (parent: { author_uid: string }) => {
      try {
        const books = await Book.findAll({
          where: { author_uid: parent.author_uid },
        });
        return books;
      } catch (error) {
        console.error(error);
        throw new Error(`Internal Server Error`);
      }
    },
  },

  allExcerpts: async () => {
    try {
      const excerpts = await Excerpt.findAll({
        include: [Book],
        attributes: [
          `excerpt_uid`,
          `text`,
          `page_number`,
          `chapter`,
          `section`,
          `book_uid`,
        ],
        tableName: `excerpt`,
      });
      return excerpts;
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Server Error`);
    }
  },
  allProjects: async () => {
    try {
      const projects = await Project.findAll({
        attributes: [
          `project_uid`,
          `project_name`,
          `project_description`,
          `project_status`,
          `date_started`,
          `technologies`,
          `project_image`,
          `project_size`,
          `project_link`,
          `github_project_link`,
          `github_ui_link`,
        ],
        tableName: `projects`,
      });
      return projects;
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Service Error`);
    }
  },
};

let dbUrl;
if (process.env.DATABASE_URL) {
  dbUrl = process.env.DATABASE_URL;
} else {
  dbUrl = process.env.DB_URL;
}

const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
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
