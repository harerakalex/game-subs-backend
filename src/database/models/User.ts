import {
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  Unique,
  Model,
  HasMany,
} from 'sequelize-typescript';

import { IUser } from './interfaces/user.interfaces';
import { Advert } from './Advert';
import { Withdraw } from './Withdraw';
import { Payment } from './Payment';

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

  @Column
  referral: string;

  @Column
  subscription: number;

  @Column
  balance: number;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @HasMany(() => Payment)
  payments: Payment[];

  @HasMany(() => Advert)
  adverts: Advert[];

  @HasMany(() => Withdraw)
  withdraws: Withdraw[];
}
