import { Book } from './models/BookAttributes';
import { Excerpt } from './models/ExcerptAttributes';
import { Author } from './models/AuthorAttributes';
import { Movie } from './models/MovieAttributes';
import { Director } from './models/DirectorAttributes';



Movie.belongsTo(Director, { foreignKey: `director_uid` });
Director.hasMany(Movie, { foreignKey: `director_uid` });
Author.hasMany(Book, { foreignKey: `author_uid` });
Book.hasMany(Excerpt, { foreignKey: `book_uid` });
Book.belongsTo(Author, { foreignKey: `author_uid` });
Excerpt.belongsTo(Book, { foreignKey: `book_uid` });
