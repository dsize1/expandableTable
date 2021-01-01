/*
 * @Author: your name
 * @Date: 2021-01-01 12:33:15
 * @LastEditTime: 2021-01-01 23:03:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \table\src\components\ExpandableTable\utils.js
 */
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
    result.data.push(self);
    childrenNode.forEach((child) => {
      result.data.push(child);
    })
  } else {
    result.data.push(self);
  }
  result.map.set(expandKey, mapNode);

  return result;
};

export const getInitialData = (dataSource, expandable) => {
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
  result.counter += 1;
  const key = self.expandKey;
  const isExpand = self.isExpand;
  const expandable = self.expandable;

  if (isExpand && expandable) {
    const mapNode = result.map.get(key);
    const children = mapNode.children;

    const { counter } = children.reduce(
      traverseChildren,
      { ...result, counter: 0 }
    );
    self.isExpand = false;
    result.set.delete(key);
    result.counter += counter;
  }

  return result;
};

export const collapseChlidren = (children, set, map) => {
  const { counter } = children.reduce(
    traverseChildren,
    { counter: 0, set, map }
  );
  return counter;
};
