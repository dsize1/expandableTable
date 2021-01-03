import React from 'react';
import ExpandableTable from './components/ExpandableTable';
import getData from './components/ExpandableTable/simuData';
import './App.css';
const { dataSource, columns } = getData();
function App() {
  return (
    <div className="app">
      <ExpandableTable dataSource={dataSource} columns={columns} />
    </div>
  );
}

export default App;
