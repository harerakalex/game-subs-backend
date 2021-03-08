export interface IUser {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}
