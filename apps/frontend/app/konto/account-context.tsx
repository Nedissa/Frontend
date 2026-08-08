'use client';

import { createContext, useContext } from 'react';

export interface AccountData {
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

const AccountContext = createContext<AccountData | null>(null);

export function AccountProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: AccountData;
}) {
  return (
    <AccountContext.Provider value={initialData}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountData() {
  return useContext(AccountContext);
}
