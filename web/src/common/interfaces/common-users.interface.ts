import { Payment } from "./payments.interface";
import { UsersRaffleNumber } from "./users-raffle-number.interface";

export interface CommonUser {
  id: string;
  name: string;
  phone: string;
  created_at: Date;
  raffles_numbers_bought: UsersRaffleNumber[];
  payments: Payment[];
  all_raffles_numbers_bought: number;
  updated_at: Date;
}
