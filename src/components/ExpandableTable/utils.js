import _get from 'lodash/get';
import _omit from 'lodash/omit';
import _isNil from 'lodash/isNil';


export const clearRef = (ref) => {
  if (ref.current) {
    ref.current.clear();
    ref.current = null;
  }
};

const getExpandKey = (prefix, current) => _isNil(prefix) ? String(current) : `${prefix}-${current}`;

export const getParentKey = (key) => {
  const keyList = key.split('-');
  if (keyList.length <= 1) return undefined;
  return keyList.slice(0, -1).join('-');
};

const traverseReducer = (result, item, index) => {
  const expandKey = getExpandKey(result.parentKey, index);
  const self = _omit(item, ['children']);
  const children = _get(item, 'children', []);
  const { data: childrenNode } = children.reduce(
    traverseReducer,
    { ..._omit(result, ['parentKey', 'data']), data: [], parentKey: expandKey }
  );
  self.expandKey = expandKey;
  self.expandable = children.length > 0;
  self.isExpand = false;
  const mapNode = {
    self,
    children: childrenNode
  };

  if (result.expandAll || result.defaultKeys.has(expandKey)) {
    result.set.add(expandKey);
    self.isExpand = true;
  }
  result.data.push(self);
  result.map.set(expandKey, mapNode);

  return result;
};

export const getInitialExpandableData = (dataSource, expandable) => {
  const expandAll = _get(expandable, 'defaultExpandAllRows', false);
  let defaultKeys = new Set(_get(expandable, 'defaultExpandedRowKeys', []));

  const { set, map, data } = dataSource.reduce(
    traverseReducer,
    { set: new Set(), map: new Map(), expandAll, defaultKeys, data: [], parentKey: undefined }
  );

  defaultKeys.clear();
  defaultKeys = null;
  return {
    set,
    map,
    data
  }
};

const traverseChildren = (result, self) => {
  const key = self.expandKey;
  const isExpand = self.isExpand;
  const expandable = self.expandable;

  if (isExpand && expandable) {
    const mapNode = result.map.get(key);
    const children = mapNode.children;

    children.reduce(
      traverseChildren,
      result
    );
    self.isExpand = false;
    result.set.delete(key);
  }

  return result;
};

export const collapseChlidren = (children, set, map) => {
  children.reduce(
    traverseChildren,
    { set, map }
  );
};

const getSortedData = (data, sorters) => {
  const sorted = sorters.reduce((result, sorter) => {
    if (!sorter.order) return result;
    return Array.from(result).sort((a, b) => {
      const sortDirections = sorter.order === 'ascend';
      if (sortDirections) {
        return sorter.func(a, b);
      }
      return sorter.func(b, a);
    });
  }, data);
  return sorted;
};

const getFinalDataReducer = (result, self) => {
  const key = self.expandKey;
  const isExpand = self.isExpand;
  result.finalData.push(self);
  if (isExpand) {
    const map = _get(result, 'conditions.map');
    const mapNode = map && map.get(key); 
    const sortedChildrenNode = getSortedData(
      _get(mapNode, 'children', []),
      _get(result, 'conditions.sorters')
    );
    sortedChildrenNode.reduce(
      getFinalDataReducer,
      result
    );
  }
  return result;
};

export const getFinalData = (data, conditions) => {
  // todo 过滤和排序
  const sorted = getSortedData(data, conditions.sorters);
  const { finalData } = sorted.reduce(
    getFinalDataReducer,
    { conditions, finalData: [] }
  );
  return finalData;
};

export const getPagedData = (data, start, size) => {
  const { paged } = data.reduce((result, item) => {
    const key = item.expandKey;
    const isCurrPaged = result.count < size && result.index >= start;
    if (!key.includes('-')) {
      if (isCurrPaged) {
        result.paged.push(item);
        result.count += 1;
      }
      result.index += 1;
    } else if (isCurrPaged) {
      result.paged.push(item);
    }
    return result;
  }, { paged: [], count: 0, index: 0 });
  return paged;
};

export const defaultSorterFunc = (dataIndex) => (a, b) => a[dataIndex] - b[dataIndex];
