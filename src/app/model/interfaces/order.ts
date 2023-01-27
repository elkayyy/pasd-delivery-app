import { PersonInfo } from './person';

export interface Order {
  id: string;
  profit: number | null;
  store_package: boolean;
  send_date: string;
  x_in_mm: number | null;
  y_in_mm: number | null;
  z_in_mm: number | null;
  is_breakable: boolean;
  is_perishable: boolean;
  sender_info: PersonInfo;
  receiver_info: PersonInfo;
}
