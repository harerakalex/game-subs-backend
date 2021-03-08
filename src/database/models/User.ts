import {
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  Unique,
  Model,
} from 'sequelize-typescript';

import { IUser } from './interfaces/user.interfaces';

@Table
export class User extends Model<User> implements IUser {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Unique
  @Column
  username: string;

  @Column
  email: string;

  @Column
  password: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
