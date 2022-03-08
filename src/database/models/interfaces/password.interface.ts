export interface IPassword {
  id?: number;
  userId: number;
  used: boolean;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}
