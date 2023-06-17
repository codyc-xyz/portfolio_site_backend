import { Model } from 'sequelize';

type ProjectSize = 'Small' | 'Medium' | 'Large';

export type ProjectAttributes = {
  project_uid: string;
  project_name: string;
  project_description: string;
  project_status: string;
  date_started: Date;
  technologies: string[];
  project_image: string;
  project_size: ProjectSize;
  project_link: string;
  github_project_link: string;
  github_ui_link: string;
};

class MovieClass extends Model<ProjectAttributes> {}

module.exports = MovieClass;
