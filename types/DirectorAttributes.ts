import { Model } from 'sequelize';
import { MovieAttributes } from './MovieAttributes';

export type DirectorAttributes = {
  director_uid: string;
  director_name: string;
  director_biography: string;
  date_director_born: Date;
  date_director_deceased: Date | null;
  director_country_of_birth: string;
  director_image: string;
  movies: MovieAttributes[];
};

class DirectorClass extends Model<DirectorAttributes> {}

module.exports = DirectorClass;
