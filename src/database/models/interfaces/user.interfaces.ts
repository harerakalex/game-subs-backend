export interface IUser {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  referral?: string;
  subscription?: number;
  balance?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
