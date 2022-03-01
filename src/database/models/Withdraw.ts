import {
  Table,
  Column,
  PrimaryKey,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  Model,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';

import { IWithdraw } from './interfaces/withdraw.interface';
import { User } from './User';

@Table
export class Withdraw extends Model<Withdraw> implements IWithdraw {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  amount: number;

  @Column
  walletAddress: string;

  @Column({
    type: DataType.ENUM,
    values: ['paid', 'pending', 'failed'],
    defaultValue: 'pending',
  })
  state: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;
}
