export interface IPayment {
  id?: number;
  userId: number;
  paymentId: number;
  amount: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}
