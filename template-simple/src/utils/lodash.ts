// 这里重新导出 lodash 里面用到的所有函数

import capitalize from 'lodash/capitalize';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import isObject from 'lodash/isObject';
import omit from 'lodash/omit';

function get_wrap( ...args: any[] ): any
{
    // @ts-ignore
    const ret = get( ...args );
    return ret === null ? args.length === 3 ? args.at( -1 ) : ret : ret;
}

export { capitalize, cloneDeep, get_wrap as get, isNil as is_nil, isObject as is_object, omit };
