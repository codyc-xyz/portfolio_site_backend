import { Model, DataTypes } from 'sequelize';
import db from '../db';

export type AuthorAttributes = {
  author_uid: string;
  author_name: string;
  date_author_born: Date;
  date_author_deceased: Date;
  author_biography: string;
  author_image: string;
  country_of_birth: string;
};

export class Author extends Model<AuthorAttributes> {}

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

