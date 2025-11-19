import { PaymentStatus } from "../enum/payment-status.enum";
import { CommonUser } from "./common-users.interface";
import { UsersRaffleNumber } from "./users-raffle-number.interface";

export interface Payment {
  id: string;
  value: number;
  raffles_quantity: number;
  status: PaymentStatus;
  pix_code: string;
  pix_qr_code: string;
  raffle_id: string;
  common_user_id: string;
  paid_at: Date;
  expires_at: Date;
  commonUser: CommonUser;
  users_raffle_number: UsersRaffleNumber[];
  created_at: Date;
  updated_at: Date;
}
