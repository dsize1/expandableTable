import React, { Fragment, useMemo, useCallback } from 'react';
import { Table, Pagination } from 'antd';
import _get from 'lodash/get';
import _omit from 'lodash/omit';
import _isArray from 'lodash/isArray';
import _isFunction from 'lodash/isFunction';
import useExpandable from './hooks/useExpandable';
import usePagination from './hooks/usePagination';
import useSortable from './hooks/useSortable';
import { getFinalData, getPagedData } from './utils';

const omitKeys = ['pagination', 'expandable', 'onTableChange', 'rowKey', 'dataSource', 'columns', 'multipleSort'];

const ExpandableTable = (props) => {
  const tableProps = _omit(props, omitKeys);
  const paginationProp = _get(props, 'pagination', {});
  const dataSourceProp = _get(props, 'dataSource', []);
  const columnsProp = _get(props, 'columns', []);
  const onChangeProp = _get(props, 'onChange');
  const multipleSort = _get(props, 'multipleSort', false);

  const {
    expandableData,
    expandableColumns,
    expandedRowKeys,
    onExpand,
    expandedSet,
    expandableMap,
    expandable
  } = useExpandable(dataSourceProp, columnsProp);
  const { sortableColumns, sorters, onSort } = useSortable(expandableColumns, multipleSort);
  const paginationOption = usePagination(paginationProp);

  const finalData = useMemo(
    () => {
      const finalData = getFinalData(
        expandableData,
        { map: expandableMap, sorters }
      );
      return finalData;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      expandableData,
      expandedRowKeys,
      sorters
    ]
  );

  const pagedData = useMemo(() => {
    const start = (paginationOption.current - 1) * paginationOption.pageSize;
    const paged = getPagedData(finalData, start, paginationOption.pageSize);
    return paged;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalData, paginationOption.current, paginationOption.pageSize])

  const onTableChange = useCallback((_pagination, filters, sorter, extra) => {
    if (_isFunction(onChangeProp)) onChangeProp(_pagination, filters, sorter, extra);
    if (extra.action === 'sort') {
      if (_isArray(sorter)) {
        onSort(sorter);
      } else {
        onSort([sorter]);
      }
    } 
  }, [onSort, onChangeProp]);

  return (
    <Fragment>
      <Table
        {...tableProps}
        columns={sortableColumns}
        dataSource={pagedData}
        rowKey="expandKey"
        pagination={false}
        expandable={expandable}
        onChange={onTableChange}
      />
      <Pagination {...paginationOption} total={expandableData.length} />
    </Fragment>
  );
};

export default ExpandableTable;