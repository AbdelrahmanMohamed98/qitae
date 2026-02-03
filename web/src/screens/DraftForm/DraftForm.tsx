import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import toast from 'react-hot-toast';
import { useAuth, useApi } from '../../state/hooks';
import { getSectors } from '@qitae/shared';
import { getVisibleSectorOptions, canAccessContent } from '../../services/contentService';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import { Text, Input, Textarea, Select } from '../../components/ui';
import type { DraftFormValues } from '../../types/DraftForm.types';
import { draftFormSchema, DRAFT_FORM_FIELDS } from './DraftForm.helper';

export default function DraftForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const api = useApi();
  const isEdit = Boolean(id);

  const allSectors = getSectors();
  const visibleSectors = session ? getVisibleSectorOptions(session, allSectors) : [];

  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [loadedValues, setLoadedValues] = useState<DraftFormValues | null>(null);

  const defaultInitialValues = useMemo<DraftFormValues>(
    () => ({
      title: '',
      body: '',
      sector: visibleSectors[0] ?? '',
    }),
    [visibleSectors]
  );

  useEffect(() => {
    if (!id || !session) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      const result = await api.getContentById(id);
      setLoading(false);
      if (cancelled) return;
      if (!result.success) {
        setError(result.error ?? 'Failed to load content');
        return;
      }
      const item = result.data!;
      if (!session || !canAccessContent(session, item)) {
        setError("You don't have access to this content.");
        return;
      }
      if (item.status !== 'draft') {
        setError('Only drafts can be edited.');
        return;
      }
      // Formik enableReinitialize will pick up values from setValues in parent;
      // we store them in state and pass as initialValues when loaded.
      setLoadedValues({ title: item.title, body: item.body, sector: item.sector });
    })();
    return () => {
      cancelled = true;
    };
  }, [id, session, api]);

  const effectiveInitialValues = loadedValues ?? defaultInitialValues;

  const handleSubmit = async (values: DraftFormValues) => {
    const payload = {
      title: values.title.trim(),
      body: values.body,
      sector: values.sector,
    };
    if (isEdit && id) {
      const result = await api.updateContent(id, payload);
      if (result.success) {
        toast.success('Draft updated.');
        navigate(`/content/${id}`, { replace: true });
      } else {
        toast.error(result.error ?? 'Failed to update.');
      }
    } else {
      const result = await api.createContent(payload);
      if (result.success) {
        toast.success('Draft created.');
        navigate(`/content/${result.data!.id}`, { replace: true });
      } else {
        toast.error(result.error ?? 'Failed to create.');
      }
    }
  };

  if (!session) return null;
  if (loading) return <LoadingState />;
  if (error && isEdit) {
    return (
      <div className="flex flex-col gap-4">
        <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-800">
          ← Back to list
        </Link>
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-4">
      <Link to={id ? `/content/${id}` : '/'} className="text-sm text-indigo-600 hover:text-indigo-800">
        ← Back
      </Link>
      <Text title3>{isEdit ? 'Edit draft' : 'New draft'}</Text>

      <Formik<DraftFormValues>
        enableReinitialize
        initialValues={effectiveInitialValues}
        validationSchema={draftFormSchema}
        validateOnBlur
        validateOnChange
        onSubmit={handleSubmit}
      >
        {({ errors, setFieldValue, submitCount, getFieldProps, isSubmitting, isValid }) => (
          <Form className="flex flex-col gap-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              {DRAFT_FORM_FIELDS.map((item) => (
                <div key={item.field} className="flex flex-col gap-1">
                  <label htmlFor={item.field} className="block">
                    <Text label className="inline">
                      {item.label}
                    </Text>
                    {item.required && (
                      <Text caption className="inline text-red-500"> *</Text>
                    )}
                  </label>
                  {item.type === 'text' && (
                    <Input
                      id={item.field}
                      type="text"
                      placeholder={item.placeholder}
                      autoComplete="off"
                      {...getFieldProps(item.field)}
                    />
                  )}
                  {item.type === 'textarea' && (
                    <Textarea
                      id={item.field}
                      rows={6}
                      placeholder={item.placeholder}
                      {...getFieldProps(item.field)}
                    />
                  )}
                  {item.type === 'select' && (
                    <Select
                      id={item.field}
                      placeholder={item.placeholder}
                      value={getFieldProps(item.field).value}
                      onChange={(e) => setFieldValue(item.field, e.target.value)}
                      onBlur={getFieldProps(item.field).onBlur}
                      options={visibleSectors.map((s) => ({ value: s, label: s }))}
                    />
                  )}
                  {submitCount > 0 && errors[item.field] && (
                    <Text error className="mt-1">
                      {errors[item.field]}
                    </Text>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="btn btn-primary"
              >
                {isSubmitting ? 'Saving…' : isEdit ? 'Update draft' : 'Create draft'}
              </button>
              <Link
                to={id ? `/content/${id}` : '/'}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
