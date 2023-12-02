import { ChangeSputnikSupplier } from '../../usecases';

export const makeChangeSputnikSupplier = (): ChangeSputnikSupplier =>
  new ChangeSputnikSupplier();
