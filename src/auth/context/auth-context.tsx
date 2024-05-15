'use client';

import { createContext } from 'react';
//
import { NextAuthContextType } from '../types';

// ----------------------------------------------------------------------

export const AuthContext = createContext({} as NextAuthContextType);

