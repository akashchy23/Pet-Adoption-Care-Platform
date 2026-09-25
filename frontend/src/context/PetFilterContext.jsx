import React, { createContext, useContext, useState } from 'react';

const PetFilterContext = createContext(null);

export const PetFilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    search: '',
    species: 'All',
    size: 'All',
    gender: 'All',
    age: 'all',
    status: 'All',
    vaccinated: false,
    sortBy: 'featured'
  });

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      species: 'All',
      size: 'All',
      gender: 'All',
      age: 'all',
      status: 'All',
      vaccinated: false,
      sortBy: 'featured'
    });
  };

  return (
    <PetFilterContext.Provider value={{ filters, setFilters, updateFilter, resetFilters }}>
      {children}
    </PetFilterContext.Provider>
  );
};

export const usePetFilter = () => {
  const context = useContext(PetFilterContext);
  if (!context) {
    throw new Error('usePetFilter must be used within PetFilterProvider');
  }
  return context;
};
