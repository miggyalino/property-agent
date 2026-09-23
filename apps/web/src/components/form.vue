<script setup lang="ts">
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { usePropertyAgentForm } from '@/composables/usePropertyAgentForm';
import type { PropertyAgentInput } from '@/schemas/property-agent';

interface FormField {
  name: keyof PropertyAgentInput;
  label: string;
  type: 'text' | 'email' | 'tel';
  placeholder: string;
  description?: string;
}

const FORM_FIELDS: FormField[] = [
  { name: 'firstName', label: 'First Name', type: 'text', placeholder: 'John' },
  { name: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe' },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'john.doe@example.com',
    description: "We'll use this to contact the agent.",
  },
  {
    name: 'mobileNumber',
    label: 'Mobile Number',
    type: 'tel',
    placeholder: '+1 (555) 123-4567',
  },
];

const {
  values,
  fieldErrors,
  submitError,
  isSubmitting,
  isSuccess,
  clearFieldError,
  submit,
} = usePropertyAgentForm();

const messageId = (field: FormField) => `${field.name}-message`;

const describedBy = (field: FormField) =>
  fieldErrors.value[field.name] || field.description ? messageId(field) : undefined;
</script>

<template>
  <div class="bg-background flex min-h-screen items-center justify-center p-4">
    <Card class="w-full max-w-2xl border shadow-lg">
      <CardHeader>
        <CardTitle>Add Property Agent</CardTitle>
        <CardDescription>
          Enter the property agent's information below to add them to the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form novalidate @submit.prevent="submit">
          <FieldGroup>
            <div
              v-if="isSuccess"
              role="status"
              class="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800"
            >
              Property agent added successfully!
            </div>

            <div
              v-if="submitError"
              role="alert"
              class="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm"
            >
              {{ submitError }}
            </div>

            <Field
              v-for="field in FORM_FIELDS"
              :key="field.name"
              :data-invalid="Boolean(fieldErrors[field.name])"
            >
              <FieldLabel :for="field.name">{{ field.label }}</FieldLabel>
              <Input
                :id="field.name"
                v-model="values[field.name]"
                :type="field.type"
                :placeholder="field.placeholder"
                :aria-invalid="Boolean(fieldErrors[field.name])"
                :aria-describedby="describedBy(field)"
                required
                @input="clearFieldError(field.name)"
              />
              <FieldError v-if="fieldErrors[field.name]" :id="messageId(field)">
                {{ fieldErrors[field.name] }}
              </FieldError>
              <FieldDescription v-else-if="field.description" :id="messageId(field)">
                {{ field.description }}
              </FieldDescription>
            </Field>

            <Field>
              <Button type="submit" :disabled="isSubmitting">
                {{ isSubmitting ? 'Adding Agent...' : 'Add Property Agent' }}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
