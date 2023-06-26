import { Model, DataTypes } from 'sequelize';
import db from '../db';

export type MovieAttributes = {
  movie_uid: string;
  movie_title: string;
  movie_description: string;
  length_in_minutes: number;
  date_movie_released: Date;
  movie_genres: string[];
  movie_poster: string;
  letterboxd_link: string;
  screenshot_links: string[];
  country_of_origin: string;
  content_warnings: string[];
  director_uid: string;
};

export class Movie extends Model<MovieAttributes> {}

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
    },
  },
  { sequelize: db, modelName: `movie`, timestamps: false },
);

