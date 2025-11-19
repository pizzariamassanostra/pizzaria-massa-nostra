import { RaffleStatus } from "../enum/raffle-status.enum";
import { CommonUser } from "./common-users.interface";

export interface Raffle {
  id: string;
  name: string;
  description: string;
  date_description?: string;
  medias_url: string[];
  prize_name: string;
  status: RaffleStatus;
  min_quantity: number;
  cover_url?: string;
  prize_number: number;
  gift_numbers: string[];
  gift_numbers_winners: string;
  available_numbers: number[];
  available_numbers_qtd: number;
  initial_numbers_qtd: number;
  price_number: number;
  created_at: Date;
  updated_at: Date;
  winner_common_user?: CommonUser;
}
