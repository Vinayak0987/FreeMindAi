import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DatasetPreview = ({ dataset }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);

  if (!dataset) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <Icon name="Table" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select a dataset to preview data</p>
        </div>
      </div>
    );
  }

  // Mock data based on dataset type
  const generateMockData = () => {
    if (dataset?.type === 'image') {
      return Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        filename: `image_${String(i + 1)?.padStart(4, '0')}.jpg`,
        size: `${Math.floor(Math.random() * 500 + 100)} KB`,
        dimensions: `${Math.floor(Math.random() * 800 + 400)}x${Math.floor(Math.random() * 600 + 300)}`,
        label: ['product', 'background', 'person', 'object']?.[Math.floor(Math.random() * 4)],
        confidence: (Math.random() * 0.3 + 0.7)?.toFixed(3)
      }));
    }

    if (dataset?.type === 'text') {
      return Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        text: [
          "This product exceeded my expectations. Great quality and fast shipping!",
          "Not satisfied with the purchase. The item was damaged upon arrival.",
          "Amazing customer service. They resolved my issue quickly and professionally.",
          "The product is okay but overpriced for what you get.",
          "Excellent quality and value. Would definitely recommend to others."
        ]?.[i % 5],
        sentiment: ['positive', 'negative', 'positive', 'neutral', 'positive']?.[i % 5],
        confidence: (Math.random() * 0.3 + 0.7)?.toFixed(3),
        word_count: Math.floor(Math.random() * 50 + 10),
        language: 'en'
      }));
    }

    // CSV data
    return Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      customer_id: `CUST_${String(i + 1)?.padStart(5, '0')}`,
      age: Math.floor(Math.random() * 50 + 18),
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      income: Math.floor(Math.random() * 80000 + 30000),
      purchase_amount: Math.floor(Math.random() * 1000 + 50),
      category: ['Electronics', 'Clothing', 'Home', 'Sports']?.[Math.floor(Math.random() * 4)],
      satisfaction: Math.floor(Math.random() * 5 + 1),
      churn: Math.random() > 0.7 ? 'Yes' : 'No',
      last_purchase: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)?.toISOString()?.split('T')?.[0]
    }));
  };

  const mockData = generateMockData();
  const columns = Object.keys(mockData?.[0] || {});

  const rowsPerPageOptions = [
    { value: 10, label: '10 rows' },
    { value: 25, label: '25 rows' },
    { value: 50, label: '50 rows' },
    { value: 100, label: '100 rows' }
  ];

  const totalPages = Math.ceil(mockData?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = mockData?.slice(startIndex, endIndex);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getColumnType = (column, value) => {
    if (typeof value === 'number') return 'numeric';
    if (value && value?.match(/^\d{4}-\d{2}-\d{2}$/)) return 'date';
    if (value && ['yes', 'no', 'true', 'false']?.includes(value?.toString()?.toLowerCase())) return 'boolean';
    return 'text';
  };

  const getColumnIcon = (type) => {
    switch (type) {
      case 'numeric': return 'Hash';
      case 'date': return 'Calendar';
      case 'boolean': return 'ToggleLeft';
      default: return 'Type';
    }
  };

  const formatCellValue = (value, type) => {
    if (value === null || value === undefined) return '-';
    if (type === 'numeric' && typeof value === 'number') {
      return value?.toLocaleString();
    }
    return value?.toString();
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <Input
            type="search"
            placeholder="Search in data..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-64"
          />
          <Select
            options={rowsPerPageOptions}
            value={rowsPerPage}
            onChange={setRowsPerPage}
            className="w-32"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" iconName="Filter">
            Filter
          </Button>
          <Button variant="outline" iconName="Download">
            Export
          </Button>
        </div>
      </div>
      {/* Data Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {columns?.map((column) => {
                  const sampleValue = mockData?.[0]?.[column];
                  const columnType = getColumnType(column, sampleValue);
                  
                  return (
                    <th
                      key={column}
                      className="px-4 py-3 text-left text-sm font-medium text-foreground cursor-pointer hover:bg-muted/70 transition-colors duration-150"
                      onClick={() => handleSort(column)}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon name={getColumnIcon(columnType)} size={14} className="text-muted-foreground" />
                        <span className="capitalize">{column?.replace(/_/g, ' ')}</span>
                        {sortColumn === column && (
                          <Icon 
                            name={sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                            size={14} 
                            className="text-primary"
                          />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {currentData?.map((row, index) => (
                <tr 
                  key={index} 
                  className="border-b border-border hover:bg-muted/30 transition-colors duration-150"
                >
                  {columns?.map((column) => {
                    const value = row?.[column];
                    const columnType = getColumnType(column, value);
                    
                    return (
                      <td key={column} className="px-4 py-3 text-sm text-foreground">
                        <div className="flex items-center space-x-2">
                          {dataset?.type === 'image' && column === 'filename' && (
                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                              <Icon name="Image" size={14} className="text-muted-foreground" />
                            </div>
                          )}
                          <span className={columnType === 'numeric' ? 'font-mono' : ''}>
                            {formatCellValue(value, columnType)}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, mockData?.length)} of {mockData?.length} entries
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              iconName="ChevronLeft"
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="text-muted-foreground">...</span>
                  <Button
                    variant={currentPage === totalPages ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              iconName="ChevronRight"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      {/* Column Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {columns?.slice(0, 6)?.map((column) => {
          const sampleValue = mockData?.[0]?.[column];
          const columnType = getColumnType(column, sampleValue);
          const uniqueValues = new Set(mockData.map(row => row[column]))?.size;
          const nullCount = mockData?.filter(row => !row?.[column])?.length;
          
          return (
            <div key={column} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-foreground capitalize">
                  {column?.replace(/_/g, ' ')}
                </h4>
                <Icon name={getColumnIcon(columnType)} size={16} className="text-muted-foreground" />
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className="capitalize">{columnType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unique:</span>
                  <span>{uniqueValues}</span>
                </div>
                <div className="flex justify-between">
                  <span>Missing:</span>
                  <span>{nullCount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DatasetPreview;