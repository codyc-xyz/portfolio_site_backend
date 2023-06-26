import { Model, DataTypes } from 'sequelize';
import db from '../db';

export type BookAttributes = {
  book_uid: string;
  book_title: string;
  book_description: string;
  date_book_published: Date;
  pages: number;
  book_subjects: string[];
  isbn: string;
  book_cover_image: string;
  goodreads_link: string;
  country_of_origin: string;
  author_uid: string;
};

export class Book extends Model<BookAttributes> {}

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
    },
  },
  { sequelize: db, modelName: `book`, timestamps: false },
);

