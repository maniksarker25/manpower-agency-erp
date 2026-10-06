import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { apiErrorMessage } from '../../../app/store/api/baseApi';
import { Button } from '../../../components/ui/button';
import { Input, Textarea } from '../../../components/ui/input';
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
import { CandidateSelect } from '../../../components/shared/EntitySelects';
import { PAYMENT_METHODS, PAYMENT_STATUSES, PAYMENT_TYPES } from '../../../constants/options';
import { todayIso } from '../../../utils/format';
import type { Payment } from '../../../types/models';
import { useCreatePaymentMutation, useUpdatePaymentMutation } from '../paymentsApi';
import { paymentSchema, type PaymentFormValues } from '../payments.schema';

interface PaymentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
  defaultCandidateId?: string;
}

export function PaymentFormDialog({
  open,
  onOpenChange,
  payment,
  defaultCandidateId
}: PaymentFormDialogProps) {
  const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();
  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();

  const empty: PaymentFormValues = {
    candidateId: defaultCandidateId ?? '',
    paymentType: 'Service Charge',
    amount: 0,
    paymentDate: todayIso(),
    paymentMethod: 'Cash',
    status: 'Paid',
    remarks: ''
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<PaymentFormValues>({ resolver: zodResolver(paymentSchema), defaultValues: empty });

  useEffect(() => {
    if (!open) return;
    reset(
      payment ?
      {
        candidateId: payment.candidateId,
        paymentType: payment.paymentType,
        amount: payment.amount,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        status: payment.status,
        remarks: payment.remarks ?? ''
      } :
      empty
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment, open, reset, defaultCandidateId]);

  const onSubmit = async (values: PaymentFormValues) => {
    try {
      if (payment) {
        await updatePayment({ id: payment.id, data: values }).unwrap();
        toast.success('Payment updated successfully');
      } else {
        await createPayment(values).unwrap();
        toast.success('Payment recorded successfully');
      }
      onOpenChange(false);
    } catch (error) {
      toast.error('Could not save payment', { description: apiErrorMessage(error) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{payment ? 'Edit payment' : 'Record payment'}</DialogTitle>
            <DialogDescription>
              {payment ? <span className="num">{payment.id}</span> : 'Fees, commissions and refunds.'}
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FormField id="payment-candidate" label="Candidate" required error={errors.candidateId?.message}>
                <CandidateSelect
                  value={watch('candidateId') || undefined}
                  onChange={(value) => setValue('candidateId', value, { shouldValidate: true })} />
                
              </FormField>
            </div>
            <FormField id="payment-type" label="Payment type" required error={errors.paymentType?.message}>
              <OptionSelect
                value={watch('paymentType')}
                onChange={(value) => setValue('paymentType', value)}
                options={PAYMENT_TYPES} />
              
            </FormField>
            <FormField id="payment-amount" label="Amount" required error={errors.amount?.message}>
              <Input type="number" min={0} step={10} {...register('amount')} />
            </FormField>
            <FormField id="payment-date" label="Payment date" required error={errors.paymentDate?.message}>
              <Input type="date" {...register('paymentDate')} />
            </FormField>
            <FormField id="payment-method" label="Payment method" error={errors.paymentMethod?.message}>
              <OptionSelect
                value={watch('paymentMethod')}
                onChange={(value) => setValue('paymentMethod', value as PaymentFormValues['paymentMethod'])}
                options={PAYMENT_METHODS} />
              
            </FormField>
            <FormField id="payment-status" label="Status" error={errors.status?.message}>
              <OptionSelect
                value={watch('status')}
                onChange={(value) => setValue('status', value as PaymentFormValues['status'])}
                options={PAYMENT_STATUSES} />
              
            </FormField>
            <div className="sm:col-span-2">
              <FormField id="payment-remarks" label="Remarks" error={errors.remarks?.message}>
                <Textarea rows={3} placeholder="Receipt number, collection point…" {...register('remarks')} />
              </FormField>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isCreating || isUpdating}>
              {payment ? 'Save changes' : 'Record payment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);

}