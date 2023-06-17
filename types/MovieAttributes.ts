import { Model } from 'sequelize';

export type MovieAttributes = {
  director: any;
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

class MovieClass extends Model<MovieAttributes> {}

module.exports = MovieClass;
