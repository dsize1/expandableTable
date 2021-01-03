import { useState, useEffect, useRef, useCallback } from 'react';
import _get from 'lodash/get';
import _isFunction from 'lodash/isFunction';
import _clone from 'lodash/clone'; 
import { defaultSorterFunc } from '../utils';

const useSortable = (columns, multiple) => {
  const [sorters, setSorters] = useState([]);
  const [sortableColumns, setSortableColumns] = useState([]);
  const sortRef = useRef(null);

  useEffect(() => {
    const sorterList = [];
    sortRef.current = {};
    const maped = columns.map((prevCol) => {
      const col = _clone(prevCol);
      if (col.sorter) {
        let sorterFunc;
        if (_isFunction(col.sorter)) {
          sorterFunc = col.sorter;
        } else {
          sorterFunc = defaultSorterFunc(col.dataIndex);
        }
        sortRef.current[col.dataIndex] = sorterFunc;
        if (col.sortOrder) {
          if (multiple || sorterList.length === 0) {
            sorterList.push({
              field: col.dataIndex,
              order: col.sortOrder,
              func: sorterFunc
            });
          } else if (!multiple && sorterList.length > 0) {
            col.sortOrder = false;
          }
        }
        col.sorter = true;
      };
      return col;
    });
    setSorters(sorterList);
    setSortableColumns(maped);
  }, [columns, multiple, setSorters, setSortableColumns]);

  const onSort = useCallback((sortList) => {
    const nextColumns = sortableColumns.map((col) => _clone(col));
    if (!multiple && sortList.field !== _get(sorters, '[0].field')) {
      const columnIndex = nextColumns.findIndex((col) => col.dataIndex === _get(sorters, '[0].field'));
      if (columnIndex > -1) nextColumns[columnIndex].sortOrder = false;
    }
    const nextSorters = sortList
      .map(({ field, order }) => {
        const columnIndex = nextColumns.findIndex((col) => col.dataIndex === field);
        if (columnIndex > -1) nextColumns[columnIndex].sortOrder = order || false;
        return {
          field,
          order,
          func: sortRef.current[field]
        };
      })
      .filter(({ order }) => order);

    setSortableColumns(nextColumns);
    setSorters(nextSorters);
  }, [sorters, setSorters, sortableColumns, setSortableColumns, multiple]);

  return {
    sortableColumns,
    sorters,
    onSort
  };
};

export default useSortable;