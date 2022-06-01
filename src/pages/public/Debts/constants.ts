import Contract from '@models/Contract';
import Payment from '@models/Payment';

export interface SearchContracts extends Contract {
  payments?: Payment[];
}
