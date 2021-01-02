import { useState, useCallback } from 'react';
import _get from 'lodash/get';
import _omit from 'lodash/omit';

const defaultPageSizeOptions = [10, 20, 50];

const usePagination = (option) => {
  const defaultCurrent = _get(option, 'defaultCurrent', 1);
  const defaultPageSize = _get(option, 'defaultPageSize', 10);
  const pageSizeOptions = _get(option, 'pageSizeOptions', defaultPageSizeOptions);
  const [current, setCurrent] = useState(defaultCurrent);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const onChange = useCallback((nextPage, PageSize) => {
    setCurrent(nextPage);
  }, [setCurrent]);

  const onShowSizeChange = useCallback((current, size) => {
    setCurrent(1);
    setPageSize(size);
  }, [setCurrent, setPageSize]);

  return {
    ..._omit(option, ['total']),
    defaultCurrent,
    defaultPageSize,
    pageSizeOptions,
    current,
    pageSize,
    onChange,
    onShowSizeChange
  };
};

export default usePagination;
