
// src/App.js
import React, { useEffect, useState } from 'react';
import DataTable from './components/DataTable';

const App = () => {
  const [data, setData] = useState([]);
  
  const columns = React.useMemo(
    () => [
      { id: 'id', header: 'ID', accessorKey: 'id' },
      { id: 'name', header: 'Name', accessorKey: 'name' },
      { id: 'category', header: 'Category', accessorKey: 'category' },
      { id: 'subcategory', header: 'Subcategory', accessorKey: 'subcategory' },
      { id: 'createdAt', header: 'Created At', accessorKey: 'createdAt' },
      { id: 'updatedAt', header: 'Updated At', accessorKey: 'updatedAt' },
      { id: 'price', header: 'Price', accessorKey: 'price' },
      { id: 'sale_price', header: 'Sale Price', accessorKey: 'sale_price' },
    ],
    []
  );

  useEffect(() => {
    fetch('/data.json')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error loading data:', error));
  }, []);

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default App;
