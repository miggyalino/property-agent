import { z } from 'zod';

const ALLOWED_MOBILE_CHARACTERS = /^[0-9+\-\s()]+$/;
const MIN_MOBILE_DIGITS = 10;
const MAX_MOBILE_DIGITS = 15;

const countDigits = (value: string) => value.replace(/\D/g, '').length;

export const propertyAgentSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(255, 'Email must be less than 255 characters')
    .pipe(z.email('Please enter a valid email address')),
  mobileNumber: z
    .string()
    .trim()
    .min(1, 'Mobile number is required')
    .regex(
      ALLOWED_MOBILE_CHARACTERS,
      'Mobile number can only contain digits, +, -, spaces, and parentheses',
    )
    .refine(
      (value) => countDigits(value) >= MIN_MOBILE_DIGITS,
      `Mobile number must have at least ${MIN_MOBILE_DIGITS} digits`,
    )
    .refine(
      (value) => countDigits(value) <= MAX_MOBILE_DIGITS,
      `Mobile number must have at most ${MAX_MOBILE_DIGITS} digits`,
    ),
});

export type PropertyAgentInput = z.input<typeof propertyAgentSchema>;
export type PropertyAgentPayload = z.output<typeof propertyAgentSchema>;
export type PropertyAgentFieldErrors = Partial<Record<keyof PropertyAgentInput, string>>;

export const createEmptyPropertyAgent = (): PropertyAgentInput => ({
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
});
