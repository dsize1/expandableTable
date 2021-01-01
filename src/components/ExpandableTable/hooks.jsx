/*
 * @Author: your name
 * @Date: 2021-01-01 12:24:17
 * @LastEditTime: 2021-01-01 23:01:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \table\src\components\hooks.js
 */
import { useRef, useState, useEffect, useCallback } from 'react';
import { clearRef, getInitialData, collapseChlidren } from './utils';

export const useExpandable = (dataSource, expandable) => {

  const [expandableData, setExpandableData] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const expandedSet = useRef(null);
  const expandableMap = useRef(null);

  const clear = useCallback(() => {
    'sss';
    clearRef(expandedSet);
    clearRef(expandableMap);
  }, []);

  useEffect(() => {
    const { set, map, data } = getInitialData(dataSource, expandable);
    clear();
    expandedSet.current = set;
    expandableMap.current = map;
    setExpandableData(data);
    setExpandedRowKeys(Array.from(set));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, setExpandedRowKeys, setExpandableData]);

  const add = useCallback((key, index) => {
    expandedSet.current.add(key);
    setExpandedRowKeys(Array.from(expandedSet.current));
    const node = expandableMap.current.get(key);
    const children = node.children;
    const self = node.self;
    self.isExpand = true;

    setExpandableData((prevData) => {

      const data = [
        ...prevData.slice(0, index),
        self,
        ...children,
        ...prevData.slice(index + 1)
      ];
      return data;
    });
  }, [setExpandedRowKeys, setExpandableData]);

  const remove = useCallback((key, index) => {
    expandedSet.current.delete(key);
    setExpandedRowKeys(Array.from(expandedSet.current));

    const node = expandableMap.current.get(key);
    const children = node.children;
    const self = node.self;
    const length = collapseChlidren(children, expandedSet.current, expandableMap.current);
    self.isExpand = false;

    setExpandableData((prevData) => {
      const data = [
        ...prevData.slice(0, index),
        self,
        ...prevData.slice(index + 1 + length)
      ];
      return data;
    });
  }, [setExpandedRowKeys, setExpandableData]);

  const onExpand = useCallback(
    (expand, key, index) => {
      if (expand) {
        add(key, index)
      } else {
        remove(key, index)
      }
    },
    [add, remove]
  );

  useEffect(() => clear, [])

  return {
    expandableData,
    expandable: {
      expandedRowKeys,
      onExpand
    }
  }
};
