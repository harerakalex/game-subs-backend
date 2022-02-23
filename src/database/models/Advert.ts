import {
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  Model,
  ForeignKey,
} from 'sequelize-typescript';

import { IAdvert } from './interfaces/advert.interface';
import { User } from './User';

@Table
export class Advert extends Model<Advert> implements IAdvert {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @ForeignKey(() => User)
  @Column
  gameId: number;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
