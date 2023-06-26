import { Model } from 'sequelize';

export type ExcerptAttributes = {
  excerpt_uid: string;
  text: string;
  page_number: number;
  chapter: string;
  section: string;
  book_uid: string;
};

class ExcerptClass extends Model<ExcerptAttributes> {}

module.exports = ExcerptClass;
