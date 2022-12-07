import { Attributes, Model, WhereOptions } from 'sequelize';
import paginate, { Options } from './plugins/paginate.plugin';

export class BaseModel<Attr extends {} = any, CAttr extends {} = Attr> extends Model<Attr, CAttr> {
  static paginate(filter: WhereOptions<Attributes<BaseModel>>, options: Options = {}) {
    return paginate.bind(this, filter, options);
  }
}
