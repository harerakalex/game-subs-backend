import { IFindOptions } from '../database/models/interfaces/custom.interface';

export class PaginatorHelper {
  static defaultPaginationLimit = 8;
  static async getPaginationOptions(model: any, options: IPaginationOptions) {
    const {
      where = {},
      include = [],
      order = [],
      group = undefined,
      subQuery = false,
    } = options.defaultOptions || {};
    const count = await model.count({ where });
    const limit = options.limit || this.defaultPaginationLimit;
    const totalPages = Math.ceil(count / limit) || 1;
    const currentPage = PaginatorHelper.getValidPageNumber(
      options.page,
      totalPages,
    );
    const offset = (currentPage - 1) * limit;

    return {
      dbOptions: {
        where,
        include,
        order,
        offset,
        limit,
        group,
        subQuery,
      },
      meta: {
        totalPages,
        limit,
        count,
        page: currentPage,
      },
    };
  }

  static async getPaginated(model: any, options: IPaginationOptions) {
    const pageOptions = await PaginatorHelper.getPaginationOptions(
      model,
      options,
    );
    const result = await model.findAll(pageOptions.dbOptions);
    return new PagedResult(
      result.map((entry: any) => entry.get()),
      pageOptions.meta,
    );
  }

  static getValidPageNumber(page: number, totalPages: number) {
    let thePage = page || 1;
    thePage = thePage > totalPages ? totalPages : thePage <= 0 ? 1 : thePage;
    return thePage;
  }
}

export interface IPaginationOptions {
  defaultOptions?: IFindOptions;
  limit?: number;
  page?: number;
}

export class PagedResult {
  constructor(
    public readonly data: any[],
    public readonly pageMeta: {
      page: number;
      totalPages: number;
      limit: number;
      count: number;
    },
  ) {}
}
