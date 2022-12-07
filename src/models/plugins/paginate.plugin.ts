/* eslint-disable no-param-reassign */

import { Attributes, Model, Order, WhereOptions, Includeable } from 'sequelize';

export interface Options {
  order?: Order;
  limit?: number | string;
  page?: number | string;
  include?: Includeable | Includeable[];
}

const paginate = async function <M extends Model>(filter: WhereOptions<Attributes<M>>, options: Options) {
  const { order = [['createdAt', 'desc']], include = undefined } = options;
  const limit = options.limit && parseInt(`${options.limit}`, 10) > 0 ? parseInt(`${options.limit}`, 10) : 10;
  const page = options.page && parseInt(`${options.page}`, 10) > 0 ? parseInt(`${options.page}`, 10) : 1;
  const offset = (page - 1) * limit;

  let docsPromise = this.findAll({ where: filter, order, include, limit: limit, offset, raw: true, nest: true });
  const countPromise = this.count({ where: filter });

  return Promise.all([countPromise, docsPromise]).then((values) => {
    const [totalResults, results] = values;
    const totalPages = Math.ceil(totalResults / limit);
    const result = {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
    return Promise.resolve(result);
  });
};
export default paginate;
