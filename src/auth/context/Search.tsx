'use client';

import React, { useContext, createContext, useState } from 'react';

const ContextProvider = createContext(null);

export const useSearch = () => {
  return useContext(ContextProvider);
};

const Search = ({ children }: any) => {
  const [search, setSearch] = useState({ doctor: '', clinic: '', spec: '', hmo: '' });
  const [triggerRef, setTriggerRef] = useState(false);

  // for queue to patient
  const [patientView, setPatientView] = useState(null);
  const [patientDone, setPatientDone] = useState(null);

  return (
    <ContextProvider.Provider
      value={{
        patientDone,
        setPatientDone,
        patientView,
        setPatientView,
        search,
        setSearch,
        triggerRef,
        setTriggerRef,
      }}
    >
      {children}
    </ContextProvider.Provider>
  );
};

export default Search;
