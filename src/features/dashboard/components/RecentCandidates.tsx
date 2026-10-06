import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { EmptyState } from '../../../components/common/States';
import { formatDate } from '../../../utils/format';
import type { Candidate } from '../../../types/models';

export function RecentCandidates({ candidates }: {candidates: Candidate[];}) {
  if (candidates.length === 0) {
    return <EmptyState title="No candidates yet" description="New registrations will appear here." />;
  }

  return (
    <div className="thin-scroll -mx-5 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Candidate ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) =>
          <TableRow key={candidate.id} className="hover:bg-secondary/50">
              <TableCell className="num font-medium">{candidate.id}</TableCell>
              <TableCell className="whitespace-nowrap font-medium">{candidate.fullName}</TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">{candidate.country}</TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">{candidate.jobPosition}</TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">{candidate.agentName}</TableCell>
              <TableCell>
                <StatusBadge kind="candidate" value={candidate.status} />
              </TableCell>
              <TableCell className="num whitespace-nowrap text-muted-foreground">
                {formatDate(candidate.registrationDate)}
              </TableCell>
              <TableCell className="text-right">
                <Link
                to={`/candidates/${candidate.id}`}
                className="inline-flex items-center gap-1 rounded text-[13px] font-medium text-primary transition-colors duration-150 ease-out hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                
                  View
                  <ArrowUpRightIcon className="size-3.5" aria-hidden="true" />
                </Link>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>);

}