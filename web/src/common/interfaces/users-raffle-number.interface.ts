import { CommonUser } from "./common-users.interface";

export interface UsersRaffleNumber {
  id: string;
  common_user_id: string;
  common_user: CommonUser;
  raffle_id: string;
  number: number;
  payment_id: string;
  isWinner?: boolean;
  created_at: string;
}
