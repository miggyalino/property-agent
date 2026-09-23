import { ref } from 'vue';
import type { ZodError } from 'zod';
import { ApiError, createPropertyAgent } from '@/lib/api/property-agents';
import {
  createEmptyPropertyAgent,
  propertyAgentSchema,
  type PropertyAgentFieldErrors,
  type PropertyAgentInput,
} from '@/schemas/property-agent';

const UNEXPECTED_ERROR_MESSAGE = 'An unexpected error occurred. Please try again.';

const toFieldErrors = (error: ZodError<PropertyAgentInput>): PropertyAgentFieldErrors => {
  const fieldErrors: PropertyAgentFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0] as keyof PropertyAgentInput | undefined;

    if (field && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
};

export const usePropertyAgentForm = () => {
  const values = ref<PropertyAgentInput>(createEmptyPropertyAgent());
  const fieldErrors = ref<PropertyAgentFieldErrors>({});
  const submitError = ref('');
  const isSubmitting = ref(false);
  const isSuccess = ref(false);

  const clearFieldError = (field: keyof PropertyAgentInput) => {
    delete fieldErrors.value[field];
    isSuccess.value = false;
  };

  const submit = async () => {
    if (isSubmitting.value) {
      return;
    }

    submitError.value = '';
    isSuccess.value = false;

    const result = propertyAgentSchema.safeParse(values.value);

    if (!result.success) {
      fieldErrors.value = toFieldErrors(result.error);
      return;
    }

    fieldErrors.value = {};
    isSubmitting.value = true;

    try {
      await createPropertyAgent(result.data);
      values.value = createEmptyPropertyAgent();
      isSuccess.value = true;
    } catch (error) {
      submitError.value =
        error instanceof ApiError ? error.message : UNEXPECTED_ERROR_MESSAGE;
    } finally {
      isSubmitting.value = false;
    }
  };

  return {
    values,
    fieldErrors,
    submitError,
    isSubmitting,
    isSuccess,
    clearFieldError,
    submit,
  };
};
