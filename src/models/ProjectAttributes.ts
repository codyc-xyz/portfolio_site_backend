import { Model, DataTypes } from 'sequelize';
import db from '../db';
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

export class Project extends Model<ProjectAttributes> {}

Project.init(
  {
    project_uid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    project_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_started: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    technologies: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    project_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    project_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    github_project_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    github_ui_link: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: `project`, timestamps: false },
);
