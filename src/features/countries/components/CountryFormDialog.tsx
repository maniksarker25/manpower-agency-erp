import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { apiErrorMessage } from '../../../app/store/api/baseApi';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle } from
'../../../components/ui/dialog';
import { FormField } from '../../../components/common/FormField';
import { OptionSelect } from '../../../components/shared/OptionSelect';
import { RECORD_STATUSES } from '../../../constants/options';
import type { Country } from '../../../types/models';
import { useCreateCountryMutation, useUpdateCountryMutation } from '../countriesApi';
import { countrySchema, type CountryFormValues } from '../countries.schema';

interface CountryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  country: Country | null;
}

const EMPTY: CountryFormValues = { name: '', code: '', status: 'Active' };

export function CountryFormDialog({ open, onOpenChange, country }: CountryFormDialogProps) {
  const [createCountry, { isLoading: isCreating }] = useCreateCountryMutation();
  const [updateCountry, { isLoading: isUpdating }] = useUpdateCountryMutation();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CountryFormValues>({ resolver: zodResolver(countrySchema), defaultValues: EMPTY });

  useEffect(() => {
    if (!open) return;
    reset(country ? { name: country.name, code: country.code, status: country.status } : EMPTY);
  }, [country, open, reset]);

  const onSubmit = async (values: CountryFormValues) => {
    try {
      if (country) {
        await updateCountry({ id: country.id, data: values }).unwrap();
        toast.success('Country updated successfully');
      } else {
        await createCountry(values).unwrap();
        toast.success('Country added successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Could not save country', { description: apiErrorMessage(error) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{country ? 'Edit country' : 'Add country'}</DialogTitle>
            <DialogDescription>
              Countries marked active appear in candidate and report filters.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormField id="country-name" label="Country name" required error={errors.name?.message}>
              <Input placeholder="e.g. Saudi Arabia" {...register('name')} />
            </FormField>
            <FormField id="country-code" label="ISO code" required error={errors.code?.message} hint="Two or three letters.">
              <Input placeholder="SA" maxLength={3} className="uppercase" {...register('code')} />
            </FormField>
            <FormField id="country-status" label="Status" error={errors.status?.message}>
              <OptionSelect
                value={watch('status')}
                onChange={(value) => setValue('status', value as CountryFormValues['status'])}
                options={RECORD_STATUSES} />
              
            </FormField>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isCreating || isUpdating}>
              {country ? 'Save changes' : 'Add country'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}