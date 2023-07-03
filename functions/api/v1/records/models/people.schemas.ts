import { z } from 'zod';
import type { SafeParseReturnType } from 'zod'

export const personSchema = z.object({
  document: z.string().min(11).max(14),
  stateRegistration: z.string().min(0).max(13).optional(),
  corporateName: z.string(),
  fantasyName: z.string(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  observation: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    complement: z.string().optional(),
    number: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    federativeUnit: z.string().min(0).max(2).optional(),
    zipCode: z.string().optional(),
  })
});

export type PersonType = z.infer<typeof personSchema>;

export const personSafeParse = (body: PersonType): SafeParseReturnType<PersonType, typeof body> => {
  return personSchema.safeParse(body);
}