import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  // TODO: userId should ideally be set automatically
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  // TODO: Figure out how to handle unions
  @IsNotEmpty()
  readonly type: 'payout' | 'spent' | 'earned';

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;
}
