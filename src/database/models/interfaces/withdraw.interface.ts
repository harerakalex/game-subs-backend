export interface IWithdraw {
  id?: number;
  userId: number;
  amount: number;
  walletAddress: string;
  state: string;
  createdAt?: Date;
  updatedAt?: Date;
}
