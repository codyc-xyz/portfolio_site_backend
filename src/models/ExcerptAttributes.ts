import { Model, DataTypes } from 'sequelize';
import db from '../db';

export type ExcerptAttributes = {
  excerpt_uid: string;
  text: string;
  page_number: number;
  chapter: string;
  section: string;
  book_uid: string;
};

export class Excerpt extends Model<ExcerptAttributes> {}

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
    },
  },
  { sequelize: db, modelName: `excerpt`, timestamps: false },
);


