import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import _throttle from 'lodash/throttle';
import { clearRef, getInitialExpandableData, collapseChlidren } from '../utils';

const childrenColumnName = '__I_can_manage_it__';

const useExpandable = (
  dataSource,
  columns,
  expandable,
) => {

  const [expandableData, setExpandableData] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const expandedSet = useRef(null);
  const expandableMap = useRef(null);

  const clear = useCallback(() => {
    clearRef(expandedSet);
    clearRef(expandableMap);
  }, []);

  useEffect(() => {
    const { set, map, data } = getInitialExpandableData(dataSource, expandable);
    clear();
    expandedSet.current = set;
    expandableMap.current = map;
    setExpandableData(data);
    setExpandedRowKeys(Array.from(set));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, setExpandedRowKeys, setExpandableData]);

  const add = useCallback((key) => {
    const node = expandableMap.current.get(key);
    const self = node.self;
    self.isExpand = true;
    expandedSet.current.add(key);
    setExpandedRowKeys(Array.from(expandedSet.current));
  }, [setExpandedRowKeys]);

  const remove = useCallback((key) => {

    const node = expandableMap.current.get(key);
    const children = node.children;
    const self = node.self;
    collapseChlidren(children, expandedSet.current, expandableMap.current);
    self.isExpand = false;
    expandedSet.current.delete(key);
    setExpandedRowKeys(Array.from(expandedSet.current));

  }, [setExpandedRowKeys]);

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

  const onExpandClickMethod = useMemo(
    () => _throttle(
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        const classList = Array.from(event.target.classList);
        const { key, index, expand } = classList.reduce((result, cls) => {
          if (
            result.key === undefined &&
            cls.includes('table-expand-key')
          ) {
            result.key = cls.slice(17);
          }

          if (
            result.index === -1 &&
            cls.includes('table-expand-index')
          ) {
            result.index = Number(cls.slice(19));
          }
        
          result.expand = result.isExpand || cls === 'table-expand-close';

          return result;
        }, { key: undefined, index: -1, expand: false });
        if (key === undefined || index === -1) return;
        onExpand(expand, key, index);
      },
      200,
      { 'trailing': false }
    ),
    [onExpand]
  );

  const expandableColumns = useMemo(() => {
    const firstColumn = columns[0];
    const rawRender = firstColumn.render;
    const render = (text, record, index) => {
      const expandable = record.expandable;
      const expandKey = record.expandKey;
      const isExpand = record.isExpand;
      const level = expandKey.split('-').length;
      const marginLeft = (level - 1) * 12;
      const className = classNames([
        `table-expandable`,
        `table-expand-key-${expandKey}`,
        `table-expand-index-${index}`,
        `table-expand-${isExpand ? 'open' : 'close'}`
      ]);
      return (
        <div style={{ display: 'inline-flex', flexDirection: 'row' }} >
          {
            expandable ?
              (
                <span
                  onClick={onExpandClickMethod}
                  className={className}
                  style={{ cursor: 'pointer', width: 12, marginRight: 8, marginLeft }}
                >
                  { isExpand ? '关' : '开' }
                </span>
              ) :
              (<span style={{ width: 12, marginRight: 8, marginLeft }} />)
          }
          <span>{ rawRender ? rawRender(text, record, index) : text}</span>
        </div>
      );
    };
    return [{ ...firstColumn, render }, ...columns.slice(1)];
  }, [columns, onExpandClickMethod]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => clear, []);

  return {
    expandableData,
    expandableColumns,
    expandedRowKeys,
    onExpand,
    expandedSet: expandedSet.current,
    expandableMap: expandableMap.current,
    expandable: { childrenColumnName }
  }
};

export default useExpandable;
