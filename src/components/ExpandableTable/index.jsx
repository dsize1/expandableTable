import React, { Fragment, useMemo } from 'react';
import { Table, Pagination } from 'antd';
import _get from 'lodash/get';
import useExpandable from './hooks/useExpandable';
import usePagination from './hooks/usePagination';
import { getFinalData, getPagedData } from './utils';
import getData from './simuData';

const ExpandableTable = (props) => {
  const paginationProps = _get(props, 'pagination', {});
  const { dataSource, columns } = useMemo(() => {
    return getData();
  }, []);

  const {
    expandableData,
    expandableColumns,
    expandedRowKeys,
    onExpand,
    expandedSet,
    expandableMap,
    expandable
  } = useExpandable(dataSource, columns);

  const paginationOption = usePagination(paginationProps);

  const finalData = useMemo(
    () => {
      const finalData = getFinalData(
        expandableData,
        { map: expandableMap }
      );
      return finalData;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      expandableData,
      expandedRowKeys
    ]
  );

  const pagedData = useMemo(() => {
    const start = (paginationOption.current - 1) * paginationOption.pageSize;
    const paged = getPagedData(finalData, start, paginationOption.pageSize);
    return paged;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalData, paginationOption.current, paginationOption.pageSize])

  return (
    <Fragment>
      <Table
        columns={expandableColumns}
        dataSource={pagedData}
        rowKey="expandKey"
        pagination={false}
        expandable={expandable}
      />
      <Pagination {...paginationOption} total={expandableData.length} />
    </Fragment>
  );
};

export default ExpandableTable;