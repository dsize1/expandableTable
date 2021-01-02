/*
 * @Author: your name
 * @Date: 2021-01-01 11:44:19
 * @LastEditTime: 2021-01-01 22:27:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \table\src\components\simuDataSource.js
 */

const data = [
  {
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    name: 'Not Expandable',
    age: 29,
    address: 'Jiangsu No. 1 Lake Park',
    description: 'This not expandable',
  },
  {
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
  },
];

const cols = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'Description', dataIndex: 'description', key: 'description' }
];

const getData = () => {

  return {
    columns: cols,
    dataSource: [
      ...data.map(item => {
        return {
          ...item,
          children: data.map(item => ({ ...item, children: data.slice(0, 3).map(item => ({ ...item, children: data.slice(0, 2).map(item => ({ ...item, children: [] })) })) }))
        };
      }),
      ...data.map(item => {
        return {
          ...item,
          children: []
        };
      }),
      ...data.map(item => {
        return {
          ...item,
          children: []
        };
      }),
      ...data.map(item => {
        return {
          ...item,
          children: data.map(item => ({ ...item, children: data.slice(0, 3).map(item => ({ ...item, children: data.slice(0, 2).map(item => ({ ...item, children: [] })) })) }))
        };
      })
    ]
  }
}

export default getData;
