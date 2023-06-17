import { Model } from 'sequelize';
import { BookAttributes } from './BookAttributes';

export type AuthorAttributes = {
  author_uid: string;
  author_name: string;
  date_author_born: Date;
  date_author_deceased: Date;
  author_biography: string;
  author_image: string;
  country_of_birth: string;
  books: BookAttributes[];
};

class AuthorClass extends Model<AuthorAttributes> {}

module.exports = AuthorClass;
