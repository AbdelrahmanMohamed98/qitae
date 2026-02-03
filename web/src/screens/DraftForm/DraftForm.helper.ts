import * as Yup from 'yup';
import type { DraftFormValues } from '../../types/DraftForm.types';

export const MIN_BODY_LENGTH = 10;
export const DRAFT_FORM_FIELDS = [
    {
        field: 'title' as const,
        label: 'Title',
        placeholder: 'Content title',
        required: true,
        type: 'text' as const,
    },
    {
        field: 'body' as const,
        label: 'Body',
        placeholder: 'Content body (min 10 characters)',
        required: true,
        type: 'textarea' as const,
    },
    {
        field: 'sector' as const,
        label: 'Sector',
        placeholder: 'Select sector',
        required: true,
        type: 'select' as const,
    },
] as const;

export const draftFormSchema = Yup.object().shape({
    title: Yup.string()
        .required('Title is required')
        .transform((v) => v?.trim())
        .test('non-empty', 'Title is required', (v) => (v?.length ?? 0) > 0),
    body: Yup.string()
        .required('Body is required')
        .min(MIN_BODY_LENGTH, `Body must be at least ${MIN_BODY_LENGTH} characters`),
    sector: Yup.string().required('Sector is required'),
}) as Yup.ObjectSchema<DraftFormValues>;
