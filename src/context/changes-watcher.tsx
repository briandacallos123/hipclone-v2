
'use client'
import React, { createContext, useContext, useState } from 'react';

const UnsavedChangesContext = createContext({});


export const useUnsavedChanges = () => {
    return useContext(UnsavedChangesContext);
  };

  
const ChangesWatcher = ({children}:any) => {
    const [isDirty, setIsDirty] = useState(false);

  return (
    <UnsavedChangesContext.Provider value={{ isDirty, setIsDirty }}>
      {children}
    </UnsavedChangesContext.Provider>
  );

}


export default ChangesWatcher