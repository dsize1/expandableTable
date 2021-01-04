import React, { useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const FilterDropdown = forwardRef((props, ref) => {
  const {
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    dataIndex,
    onOk,
    onReset
  } = props;
  const searchInputRef = useRef(null);
  const [searchText, setSearchText] = useState('');

  useImperativeHandle(ref, () => ({
    focus: () => {
      console.log(props);
      searchInputRef.current.focus();
    },
    value: () => searchText
  }));

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchText(value);
  }, [setSearchText]);

  const handleSearch = useCallback(() => {
    confirm();
    onOk(searchText);
  }, [onOk, confirm, searchText]);

  const handleReset = useCallback(() => {
    clearFilters();
    setSearchText('');
    onReset();
  }, [setSearchText, onReset, clearFilters]);

  return (
    <div style={{ padding: 8 }}>
      <Input
        ref={searchInputRef}
        placeholder={`Search ${dataIndex}`}
        value={searchText}
        onChange={handleSearchChange}
        onPressEnter={handleSearch}
        style={{ width: 188, marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={handleSearch}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button onClick={handleReset} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </Space>
    </div>
  );
});

export default FilterDropdown;
