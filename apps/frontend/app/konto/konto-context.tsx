'use client';

import { createContext, useContext } from 'react';

export interface KontoData {
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  } | null;
  orders: any[];
  complaints: any[];
  loyalty: any;
  addresses: any[];
  favoriteProducts: any[];
}

const KontoContext = createContext<KontoData | null>(null);

export function KontoProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: KontoData;
}) {
  return (
    <KontoContext.Provider value={initialData}>
      {children}
    </KontoContext.Provider>
  );
}

export function useKontoData() {
  return useContext(KontoContext);
}
