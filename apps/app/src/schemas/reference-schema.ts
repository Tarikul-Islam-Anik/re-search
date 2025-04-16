import * as z from 'zod';

// DOI validation regex pattern
export const doiPattern = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
const replacePattern = /^https?:\/\/doi.org\//i;

export const referenceSchema = z.object({
  id: z.string(),
  doi: z
    .string()
    .trim()
    .refine((val) => val === '' || doiPattern.test(val), {
      message: 'Invalid DOI format. Example: 10.1038/s41586-021-03819-2',
    })
    .optional()
    .or(z.literal('')),
  title: z.string().trim().min(1, { message: 'Title is required' }),
  authors: z
    .string()
    .trim()
    .min(1, { message: 'At least one author is required' }),
  journal: z.string().trim().min(1, { message: 'Journal name is required' }),
  year: z
    .string()
    .trim()
    .min(1, { message: 'Publication year is required' })
    .regex(/^\d{4}$/, { message: 'Year must be a 4-digit number' }),
  volume: z.string().trim().optional().or(z.literal('')),
  issue: z.string().trim().optional().or(z.literal('')),
  pages: z.string().trim().optional().or(z.literal('')),
  url: z
    .string()
    .trim()
    .url({ message: 'Must be a valid URL' })
    .optional()
    .or(z.literal('')),
});

export const doiInputSchema = z.object({
  doi: z
    .string()
    .trim()
    .min(1, { message: 'DOI is required' })
    .refine((val) => doiPattern.test(val.replace(replacePattern, '')), {
      message: 'Invalid DOI format. Example: 10.1038/s41586-021-03819-2',
    }),
});

export type ReferenceFormValues = z.infer<typeof referenceSchema>;
export type DoiInputFormValues = z.infer<typeof doiInputSchema>;
