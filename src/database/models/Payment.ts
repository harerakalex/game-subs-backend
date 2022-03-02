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
  BelongsTo,
} from 'sequelize-typescript';

import { IPayment } from './interfaces/payment.interface';
import { User } from './User';

@Table
export class Payment extends Model<Payment> implements IPayment {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @Column
  paymentId: number;

  @Column
  amount: number;

  @Column({
    type: DataType.ENUM,
    values: ['waiting', 'confirmed', 'failed'],
    defaultValue: 'waiting',
  })
  status: string;

  @CreatedAt
  @Column
  createdAt!: Date;

  @UpdatedAt
  @Column
  updatedAt!: Date;

  @BelongsTo(() => User)
  user: User;
}
