const { Movie } = require(`./models/MovieAttributes`);
const { Director } = require(`./models/DirectorAttributes`);
const { Book } = require(`./models/BookAttributes`);
const { Excerpt } = require(`./models/ExcerptAttributes`);
const { Author } = require(`./models/AuthorAttributes`);
const { Project } = require(`./models/ProjectAttributes`);

const root = {
  allDirectors: async () => {
    try {
      const directors = await Director.findAll({
        include: [Movie],
        attributes: [
          `director_uid`,
          `director_name`,
          `director_biography`,
          `date_director_born`,
          `date_director_deceased`,
          `director_country_of_birth`,
          `director_image`,
        ],
        tableName: `director`,
      });
      return directors;
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Server Error`);
    }
  },
  Director: {
    movies: async (parent: { director_uid: string }) => {
      try {
        const movies = await Movie.findAll({
          where: { director_uid: parent.director_uid },
        });
        return movies;
      } catch (error) {
        console.error(error);
        throw new Error(`Internal Server Error`);
      }
    },
  },
  allMovies: async () => {
    try {
      const movies = await Movie.findAll({
        include: [Director],
        attributes: [
          `movie_uid`,
          `movie_title`,
          `movie_description`,
          `length_in_minutes`,
          `date_movie_released`,
          `movie_genres`,
          `movie_poster`,
          `letterboxd_link`,
          `screenshot_links`,
          `country_of_origin`,
          `content_warnings`,
          `director_uid`,
        ],
        tableName: `movie`,
      });
      return movies;
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Server Error`);
    }
  },
  allBooks: async () => {
    try {
      const books = await Book.findAll({
        include: [Author, Excerpt],
        attributes: [
          `book_uid`,
          `book_title`,
          `book_description`,
          `pages`,
          `date_book_published`,
          `book_subjects`,
          `book_cover_image`,
          `goodreads_link`,
          `isbn`,
          `country_of_origin`,
          `author_uid`,
        ],
        tableName: `book`,
      });
      return books;
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Server Error`);
    }
  },
  allAuthors: async () => {
    try {
      const authors = await Author.findAll({
        include: [Book],
        attributes: [
          `author_uid`,
          `author_name`,
          `author_biography`,
          `date_author_born`,
          `date_author_deceased`,
          `author_image`,
          `country_of_birth`,
        ],
        tableName: `author`,
      });
      return authors;
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Server Error`);
    }
  },
  Author: {
    books: async (parent: { author_uid: string }) => {
      try {
        const books = await Book.findAll({
          where: { author_uid: parent.author_uid },
        });
        return books;
      } catch (error) {
        console.error(error);
        throw new Error(`Internal Server Error`);
      }
    },
  },

  allExcerpts: async () => {
    try {
      const excerpts = await Excerpt.findAll({
        include: [Book],
        attributes: [
          `excerpt_uid`,
          `text`,
          `page_number`,
          `chapter`,
          `section`,
          `book_uid`,
        ],
        tableName: `excerpt`,
      });
      return excerpts;
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Server Error`);
    }
  },
  allProjects: async () => {
    try {
      const projects = await Project.findAll({
        attributes: [
          `project_uid`,
          `project_name`,
          `project_description`,
          `project_status`,
          `date_started`,
          `technologies`,
          `project_image`,
          `project_size`,
          `project_link`,
          `github_project_link`,
          `github_ui_link`,
        ],
        tableName: `projects`,
      });
      return projects;
    } catch (error) {
      console.error(error);
      throw new Error(`Internal Service Error`);
    }
  },
};

export default root;