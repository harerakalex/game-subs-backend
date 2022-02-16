import { Includeable, Order, WhereOptions } from 'sequelize';

export interface IFindOptions {
  where?: WhereOptions;
  include?: Includeable[];
  order?: Order;
  attributes?: string[];
  group?: string[];
  subQuery?: boolean;
  limit?: number;
}

export interface IGenerateTotken {
  id: number;
  uuid: string;
  firebaseUserId: string;
  role: string;
  status?: string;
}

export interface IUpdateOptions {
  where: WhereOptions;
  returning: boolean;
}
