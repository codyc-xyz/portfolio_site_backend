import { Model, DataTypes } from 'sequelize';
import db from '../db';

export type DirectorAttributes = {
  director_uid: string;
  director_name: string;
  director_biography: string;
  date_director_born: Date;
  date_director_deceased: Date | null;
  director_country_of_birth: string;
  director_image: string;
};

export class Director extends Model<DirectorAttributes> {}

Director.init(
  {
    director_uid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    director_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    director_biography: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_director_born: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_director_deceased: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    director_country_of_birth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    director_image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: `director`, timestamps: false },
);

