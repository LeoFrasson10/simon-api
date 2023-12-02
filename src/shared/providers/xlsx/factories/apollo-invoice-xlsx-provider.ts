import { MakeDateProvider } from '@shared/providers/date';
import { ApolloInvoiceXLSXProvider } from '../implementations';
import { IApolloInvoiceXLSXProvider } from '../models';

export const makeApolloInvoicesXLSXProvider = (): IApolloInvoiceXLSXProvider =>
  new ApolloInvoiceXLSXProvider(MakeDateProvider.getProvider());
