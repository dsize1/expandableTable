import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import ExpandableTable from './components/ExpandableTable';
import FilterDropdown from './components/FilterDropDown';
import getData from './components/ExpandableTable/simuData';
import './App.css';
const { columns } = getData();
const dataSource = [
  {
    name: 'John Brown',
    age: 32,
    no: 12,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    name: 'Jim Green',
    age: 42,
    no: 12,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    name: 'Not Expandable',
    age: 29,
    no: 56,
    address: 'Jiangsu No. 1 Lake Park',
    description: 'This not expandable',
  },
  {
    name: 'Joe Black',
    age: 32,
    no: 4,
    address: 'Sidney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
  },
];
function App() {
  const searchInputRef = useRef(null);
  const [currentText, setCurrentText] = useState('');

  const getColumnSearchProps = useCallback((dataIndex, currentText) => ({
    filterDropdown: (props) => (
      <FilterDropdown
        { ...props }
        dataIndex={dataIndex}
        ref={searchInputRef}
        onOk={(txt) => setCurrentText(txt)}
        onReset={() => setCurrentText('')}
      />
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => console.log('ss', value, record),
      // record[dataIndex]
      //   ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      //   : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInputRef.current.focus(), 100);
      }
    },
    render: (text) => {
      console.log(currentText);
      return (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[currentText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      );
    }
  }), []);

  const _columns = useMemo(() => {
    const nameColumn = columns[0];
    columns[0] = { ...nameColumn, ...getColumnSearchProps(nameColumn.dataIndex, currentText) };
    return [...columns]; 
  }, [getColumnSearchProps, currentText]);

  return (
    <div className="app">
      <Table
        onScroll={() => console.log(1)}
        dataSource={dataSource}
        columns={_columns}
        scroll={{ y: 300 }}
      />
    </div>
  );
}

export default App;
