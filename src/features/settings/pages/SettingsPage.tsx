import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Switch } from '../../../components/ui/misc';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { PageHeader } from '../../../components/common/PageHeader';
import { SectionCard } from '../../../components/common/SectionCard';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { FormField } from '../../../components/common/FormField';
import { OptionSelect } from '../../../components/shared/OptionSelect';
import {
  CANDIDATE_STATUSES,
  DOCUMENT_TYPES,
  JOB_POSITIONS,
  PAYMENT_TYPES,
  USER_ROLES } from
'../../../constants/options';
import { env } from '../../../config/env';
import { OptionListEditor } from '../components/OptionListEditor';

const ROLE_PERMISSIONS: Record<string, string> = {
  Admin: 'Full access to every module, users and settings.',
  Manager: 'Manage candidates, agents, payments and documents. No user management.',
  'Data Entry': 'Create and edit candidate records and upload documents.',
  Viewer: 'Read-only access to records and reports.'
};

const PREFERENCES = [
{ id: 'toasts', label: 'In-app confirmations', description: 'Show a toast after every create, update and delete.', defaultOn: true },
{ id: 'audit', label: 'Verbose audit logging', description: 'Record field-level changes in the activity log.', defaultOn: true },
{ id: 'weekly', label: 'Weekly summary email', description: 'Send a Monday digest of pipeline movement to admins.', defaultOn: false },
{ id: 'archive', label: 'Archive instead of delete', description: 'Deletions move records to an archive tab rather than removing rows.', defaultOn: true }];


export function SettingsPage() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>(
    Object.fromEntries(PREFERENCES.map((item) => [item.id, item.defaultOn]))
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        description="Configure dropdown values, roles and system behavior." />
      

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="statuses">Candidate Status</TabsTrigger>
          <TabsTrigger value="payment-types">Payment Types</TabsTrigger>
          <TabsTrigger value="document-types">Document Types</TabsTrigger>
          <TabsTrigger value="positions">Job Positions</TabsTrigger>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
          <TabsTrigger value="system">System Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <SectionCard title="Agency details" description="Shown on exports and printed reports." className="max-w-2xl">
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                toast.success('Settings saved successfully');
              }}>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="agency-name" label="Agency name">
                  <Input defaultValue={env.appName} />
                </FormField>
                <FormField id="agency-license" label="BMET license no.">
                  <Input defaultValue="RL-1284/2019" />
                </FormField>
                <FormField id="agency-currency" label="Reporting currency">
                  <OptionSelect value="USD" onChange={() => undefined} options={['USD', 'BDT', 'SAR', 'AED']} />
                </FormField>
                <FormField id="agency-timezone" label="Time zone">
                  <OptionSelect
                    value="Asia/Dhaka"
                    onChange={() => undefined}
                    options={['Asia/Dhaka', 'Asia/Riyadh', 'Asia/Dubai', 'UTC']} />
                  
                </FormField>
              </div>
              <div className="flex justify-end border-t border-border pt-4">
                <Button type="submit">Save changes</Button>
              </div>
            </form>
          </SectionCard>
        </TabsContent>

        <TabsContent value="statuses">
          <SectionCard
            title="Candidate statuses"
            description="Pipeline stages are fixed so reports and the status timeline stay consistent.">
            
            <div className="flex flex-wrap gap-2">
              {CANDIDATE_STATUSES.map((status) =>
              <StatusBadge key={status} kind="candidate" value={status} />
              )}
            </div>
            <p className="mt-4 text-[13px] text-muted-foreground">
              Status colors are defined centrally, so any change here applies everywhere in the application.
            </p>
          </SectionCard>
        </TabsContent>

        <TabsContent value="payment-types">
          <SectionCard title="Payment types" description="Available when recording a payment.">
            <OptionListEditor label="Payment type" values={PAYMENT_TYPES} locked={['Refund']} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="document-types">
          <SectionCard title="Document types" description="Categories used when uploading candidate files.">
            <OptionListEditor label="Document type" values={DOCUMENT_TYPES} locked={['Passport', 'NID', 'Other']} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="positions">
          <SectionCard title="Job positions" description="Offered roles selectable on the candidate form.">
            <OptionListEditor label="Job position" values={JOB_POSITIONS} />
          </SectionCard>
        </TabsContent>

        <TabsContent value="roles">
          <SectionCard title="User roles" description="What each role can do inside the ERP.">
            <ul className="divide-y divide-border">
              {USER_ROLES.map((role) =>
              <li key={role} className="flex flex-wrap items-start justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                  <StatusBadge kind="role" value={role} withDot={false} />
                  <p className="max-w-xl flex-1 text-[13px] text-muted-foreground">{ROLE_PERMISSIONS[role]}</p>
                </li>
              )}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="system">
          <SectionCard title="System preferences" description="Behavior that applies to the whole workspace.">
            <ul className="divide-y divide-border">
              {PREFERENCES.map((item) =>
              <li key={item.id} className="flex items-start justify-between gap-6 py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                  checked={preferences[item.id]}
                  onCheckedChange={(checked) => {
                    setPreferences((current) => ({ ...current, [item.id]: checked }));
                    toast.success(`${item.label} ${checked ? 'enabled' : 'disabled'}`);
                  }}
                  aria-label={item.label} />
                
                </li>
              )}
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>);

}