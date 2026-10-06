import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { PageHeader } from '../../../components/common/PageHeader';
import { SectionCard } from '../../../components/common/SectionCard';
import { EmptyState, ErrorState, LoadingState } from '../../../components/common/States';
import { ActivityFeed } from '../../../components/shared/ActivityFeed';
import { useGetActivityQuery } from '../../activity-log/activityApi';

export function NotificationsPage() {
  const { data, isLoading, isError, refetch } = useGetActivityQuery({ page: 1, pageSize: 20 });

  return (
    <div className="space-y-5">
      <PageHeader
        title="Notifications"
        description="Updates from across your agency, newest first."
        actions={
        <Button variant="outline" asChild>
            <Link to="/activity-log">Full audit log</Link>
          </Button>
        } />
      

      {isError ?
      <Card>
          <ErrorState
          description="We couldn't load your notifications."
          onRetry={() => {
            void refetch();
          }} />
        
        </Card> :

      <SectionCard title="Recent updates" className="max-w-3xl">
          {isLoading ?
        <LoadingState rows={6} columns={2} /> :
        (data?.items.length ?? 0) === 0 ?
        <EmptyState
          title="You're all caught up"
          description="New candidate, payment and document activity will show up here."
          icon={BellIcon} /> :


        <ActivityFeed entries={data?.items ?? []} />
        }
        </SectionCard>
      }
    </div>);

}