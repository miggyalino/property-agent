import { Transform } from 'class-transformer';
import { IsEmail, IsString, Length, MaxLength } from 'class-validator';
import { IsMobileNumber } from '../../common/validators/is-mobile-number.validator';

const trim = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class CreatePropertyAgentDto {
  @Transform(trim)
  @IsString()
  @Length(1, 100, { message: 'First name must be between 1 and 100 characters' })
  firstName!: string;

  @Transform(trim)
  @IsString()
  @Length(1, 100, { message: 'Last name must be between 1 and 100 characters' })
  lastName!: string;

  @Transform(trim)
  @IsEmail({}, { message: 'Please enter a valid email address' })
  @MaxLength(255, { message: 'Email must be less than 255 characters' })
  email!: string;

  @Transform(trim)
  @IsMobileNumber()
  mobileNumber!: string;
}
