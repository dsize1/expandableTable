import { useState, useCallback } from 'react';
import _get from 'lodash/get';
import _omit from 'lodash/omit';

const defaultPageSizeOptions = [10, 20, 50];

const usePagination = (option) => {
  const defaultCurrent = _get(option, 'defaultCurrent', 1);
  const defaultPageSize = _get(option, 'defaultPageSize', 50);
  const pageSizeOptions = _get(option, 'pageSizeOptions', defaultPageSizeOptions);
  const [current, setCurrent] = useState(defaultCurrent);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const onPageChange = useCallback((nextPage, pageSize) => {
    setCurrent(nextPage);
  }, [setCurrent]);

  const onPageSizeChange = useCallback((current, size) => {
    setCurrent(1);
    setPageSize(size);
  }, [setCurrent, setPageSize]);

  return {
    paginationOption: {
      ..._omit(option, ['total']),
      defaultCurrent,
      defaultPageSize,
      pageSizeOptions,
      current,
      pageSize
    },
    onPageChange,
    onPageSizeChange
  };
};

export default usePagination;
