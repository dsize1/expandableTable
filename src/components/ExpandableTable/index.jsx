import React, { useMemo, useCallback } from 'react';
import classNames from 'classnames';
import _throttle from 'lodash/throttle';
import { Table } from 'antd';
import { useExpandable } from './hooks';
import getData from './simuData';

const ExpandableTable = () => {

  const { dataSource, columns } = useMemo(() => {
    return getData();
  }, [])

  const {
    expandableData,
    expandable: { onExpand, expandedRowKeys }
  } = useExpandable(dataSource, columns);

  const onExpandClick = useCallback(
    _throttle(
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
      500,
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
                  onClick={onExpandClick}
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
  }, [columns, onExpandClick]);

  return (
    <Table columns={expandableColumns} dataSource={expandableData} rowKey="expandKey" pagination={false} />
  );
};

export default ExpandableTable;