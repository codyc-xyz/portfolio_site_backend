import { Model } from 'sequelize';
import { ExcerptAttributes } from './ExcerptAttributes';

export type BookAttributes = {
  author: any;
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
  excerpts: ExcerptAttributes[];
};

class BookClass extends Model<BookAttributes> {}

module.exports = BookClass;
