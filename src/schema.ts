const { buildSchema } = require(`graphql`);

const schema = buildSchema(`
  type Movie {
    movie_uid: String!
    movie_title: String!
    movie_description: String!
    length_in_minutes: Int!
    date_movie_released: String!
    movie_genres: [String!]!
    movie_poster: String!
    letterboxd_link: String!
    screenshot_links: [String!]!
    country_of_origin: String!
    content_warnings: [String!]
    director_uid: String!
    director: Director!
  }

  type Director {
    director_uid: String!
    director_name: String!
    director_biography: String!
    date_director_born: String!
    date_director_deceased: String
    director_country_of_birth: String!
    director_image: String!
    movies: [Movie!]!
  }
  type Book {
    book_uid: String!
    book_title: String!
    book_description: String!
    pages: Int!
    date_book_published: String!
    book_subjects: [String!]!
    book_cover_image: String!
    goodreads_link: String!
    isbn: String!
    country_of_origin: String!
    author_uid: String!
    author: Author!
    excerpts: [Excerpt]
  }
  type Author {
    author_uid: String!
    author_name: String!
    author_biography: String!
    date_author_born: String!
    date_author_deceased: String
    author_image: String!
    country_of_birth: String!
    books: [Book!]!
  }

  type Excerpt {
    excerpt_uid: String!
    text: String!
    page_number: Int!
    chapter: String
    section: String
    book_uid: String!
    book: Book!
  }

  type Project {
    project_uid: String!
    project_name: String!
    project_description: String!
    project_status: String!
    date_started: String!
    technologies: [String!]!
    project_image: String!
    project_size: String!
    project_link: String!
    github_project_link: String!
    github_ui_link: String
  }

  type Query {
    allDirectors: [Director!]!
    allMovies: [Movie!]!
    allBooks: [Book!]!
    allAuthors: [Author!]!
    allExcerpts: [Excerpt!]!
    allProjects: [Project!]!
  }
`);
export default schema;