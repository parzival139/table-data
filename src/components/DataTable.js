// src/components/DataTable.js
import React, { useState, useCallback, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, ButtonGroup, TextField, Switch, FormControlLabel } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SidePanel from './SidePanel';
import FilterListIcon from '@mui/icons-material/FilterList';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SortIcon from '@mui/icons-material/Sort';
import GroupIcon from '@mui/icons-material/Group';

const DataTable = ({ columns, data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [columnVisibility, setColumnVisibility] = useState(
    columns.reduce((acc, col) => {
      acc[col.id] = true;
      return acc;
    }, {})
  );
  const [sortBy, setSortBy] = useState([]);

  // Memoize filtered data
  const filteredData = useMemo(() => {
    return data.filter(row =>
      Object.values(row).some(value => value?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm]);

  // Initialize React Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting: sortBy,
      columnVisibility
    },
    onSortingChange: setSortBy,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Get pagination details
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  // Generate page numbers and navigation buttons
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(
      Math.min(currentPage - Math.floor(maxPagesToShow / 2), pageCount - maxPagesToShow),
      0
    );
    const endPage = Math.min(startPage + maxPagesToShow, pageCount);

    if (currentPage > 0) {
      pages.push(
        <Button
          key="prev"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          style={{
            margin: '0 5px',
            minWidth: 'auto',
            padding: '0',
            border: '1px solid #d0d0d0',
            backgroundColor: 'transparent',
            color: 'black',
            borderRadius: '4px',
          }}
        >
          <ArrowBackIosNewIcon style={{ fontSize: 'small' }} />
        </Button>
      );
    }

    if (startPage > 0) {
      pages.push(
        <Button
          key={0}
          onClick={() => table.setPageIndex(0)}
          variant={currentPage === 0 ? 'contained' : 'outlined'}
          style={{
            margin: '0 5px',
            minWidth: 'auto',
            padding: '0 8px',
            color: 'black',
            borderColor: '#d0d0d0',
            borderRadius: '4px',
            backgroundColor: currentPage === 0 ? '#f0f0f0' : 'transparent',
          }}
        >
          1
        </Button>
      );
      if (startPage > 1) {
        pages.push(<span key="start-ellipsis" style={{ margin: '0 5px' }}>...</span>);
      }
    }

    for (let i = startPage; i < endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => table.setPageIndex(i)}
          variant={currentPage === i ? 'contained' : 'outlined'}
          style={{
            margin: '0 5px',
            minWidth: 'auto',
            padding: '0 8px',
            color: 'black',
            borderColor: '#d0d0d0',
            borderRadius: '4px',
            backgroundColor: currentPage === i ? '#f0f0f0' : 'transparent',
          }}
        >
          {i + 1}
        </Button>
      );
    }

    if (endPage < pageCount) {
      if (endPage < pageCount - 1) {
        pages.push(<span key="end-ellipsis" style={{ margin: '0 5px' }}>...</span>);
      }
      pages.push(
        <Button
          key={pageCount - 1}
          onClick={() => table.setPageIndex(pageCount - 1)}
          variant={currentPage === pageCount - 1 ? 'contained' : 'outlined'}
          style={{
            margin: '0 5px',
            minWidth: 'auto',
            padding: '0 8px',
            color: 'black',
            borderColor: '#d0d0d0',
            borderRadius: '4px',
            backgroundColor: currentPage === pageCount - 1 ? '#f0f0f0' : 'transparent',
          }}
        >
          {pageCount}
        </Button>
      );
    }

    if (currentPage < pageCount - 1) {
      pages.push(
        <Button
          key="next"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          style={{
            margin: '0 5px',
            minWidth: 'auto',
            padding: '0',
            border: '1px solid #d0d0d0',
            backgroundColor: 'transparent',
            color: 'black',
            borderRadius: '4px',
          }}
        >
          <ArrowForwardIosIcon style={{ fontSize: 'small' }} />
        </Button>
      );
    }

    return pages;
  }, [table, currentPage, pageCount]);

  // Handle feature button clicks
  const handleFeatureButtonClick = useCallback((feature) => {
    setActivePanel(feature);
    setIsSidePanelOpen(true);
  }, []);

  // Handle closing the side panel
  const handleCloseSidePanel = useCallback(() => {
    setIsSidePanelOpen(false);
    setActivePanel(null);
  }, []);

  // Handle toggle visibility of columns
  const handleToggleColumn = useCallback((columnId) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  }, []);

  // Handle clear sorting
  const handleClearSorting = useCallback(() => {
    setSortBy([]);
  }, []);

  // Apply column visibility
  const handleApplyVisibility = useCallback(() => {
    table.setColumnVisibility(columnVisibility);
  }, [columnVisibility, table]);

  // Handle sorting
  const handleSortChange = useCallback((columnId, direction) => {
    setSortBy([{ id: columnId, desc: direction === 'desc' }]);
  }, []);

  // Generate sorting panel content
  const sortingPanelContent = columns.map(column => (
    <Box key={column.id} display="flex" alignItems="center" justifyContent="space-between" padding={1}>
      <span>{column.header}</span>
      <Box>
        <Button onClick={() => handleSortChange(column.id, 'asc')}>
          <ArrowUpwardIcon style={{ fontSize: 'small', color: 'black' }} />
        </Button>
        <Button onClick={() => handleSortChange(column.id, 'desc')}>
          <ArrowDownwardIcon style={{ fontSize: 'small', color: 'black' }} />
        </Button>
      </Box>
    </Box>
  ));

  return (
    <div>
      <Box display="flex" justifyContent="flex-end" alignItems="center" padding={2} position="relative">
        <TextField
          variant="outlined"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: <Box onClick={() => setSearchTerm('')} style={{ cursor: 'pointer', padding: '0 10px' }}>×</Box>,
          }}
          style={{ marginRight: '10px', width: '300px' }}
        />
        <Button onClick={() => handleFeatureButtonClick('viewHideColumns')} style={{ minWidth: 0, color: 'black' }}>
          <VisibilityIcon />
        </Button>
        <Button onClick={() => handleFeatureButtonClick('sort')} style={{ minWidth: 0, color: 'black' }}>
          <SortIcon />
        </Button>
        <Button onClick={() => handleFeatureButtonClick('filter')} style={{ minWidth: 0, color: 'black' }}>
          <FilterListIcon />
        </Button>
        <Button onClick={() => handleFeatureButtonClick('group')} style={{ minWidth: 0, color: 'black' }}>
          <GroupIcon />
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <Box display="flex" flexDirection="column" alignItems="center" style={{ cursor: 'pointer' }}>
                      {header.column.getIsSorted() === 'asc' ? (
                        <ArrowUpwardIcon style={{ fontSize: 'small', color: 'black' }} />
                      ) : header.column.getIsSorted() === 'desc' ? (
                        <ArrowDownwardIcon style={{ fontSize: 'small', color: 'black' }} />
                      ) : (
                        <Box style={{ fontSize: 'small', color: 'black' }}>
                          <ArrowUpwardIcon />
                          <ArrowDownwardIcon />
                        </Box>
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Box display="flex" justifyContent="center" alignItems="center" padding={2}>
          <ButtonGroup variant="outlined" color="primary">
            {pageNumbers}
          </ButtonGroup>
        </Box>
      </TableContainer>

      <SidePanel isOpen={isSidePanelOpen} onClose={handleCloseSidePanel}>
        {activePanel === 'viewHideColumns' && (
          <Box>
            {columns.map(column => (
              <Box key={column.id} display="flex" alignItems="center" padding={1}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={columnVisibility[column.id]}
                      onChange={() => handleToggleColumn(column.id)}
                    />
                  }
                  label={column.header}
                />
              </Box>
            ))}
            <Box display="flex" justifyContent="center" padding={2}>
              <Button onClick={handleApplyVisibility} variant="contained" color="primary">
                Apply
              </Button>
            </Box>
          </Box>
        )}
        {activePanel === 'sort' && (
          <Box>
            {sortingPanelContent}
            <Box display="flex" justifyContent="center" padding={2}>
              <Button onClick={handleClearSorting} variant="contained" color="primary">
                Clear
              </Button>
            </Box>
          </Box>
        )}
        {activePanel === 'filter' && <div>Filter Content</div>}
        {activePanel === 'group' && <div>Group Content</div>}
      </SidePanel>
    </div>
  );
};

export default DataTable;

