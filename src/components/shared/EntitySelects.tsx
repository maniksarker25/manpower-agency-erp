import React from 'react';
import { useGetAgentOptionsQuery } from '../../features/agents/agentsApi';
import { useGetCandidatesQuery } from '../../features/candidates/candidatesApi';
import { useGetCountryOptionsQuery } from '../../features/countries/countriesApi';
import { CANDIDATE_STATUSES } from '../../constants/options';
import { OptionSelect, type SelectOption } from './OptionSelect';

interface BaseSelectProps {
  value?: string;
  onChange: (value: string) => void;
  allLabel?: string;
  id?: string;
  className?: string;
  ariaLabel?: string;
}

export function CountrySelect({ allLabel, ...props }: BaseSelectProps) {
  const { data, isLoading } = useGetCountryOptionsQuery();
  const options: SelectOption[] = (data ?? []).map((country) => ({
    value: country.name,
    label: country.name
  }));

  return (
    <OptionSelect
      {...props}
      options={options}
      loading={isLoading}
      allLabel={allLabel}
      placeholder="Select country" />);


}

export function AgentSelect({ allLabel, ...props }: BaseSelectProps) {
  const { data, isLoading } = useGetAgentOptionsQuery();
  const options: SelectOption[] = (data ?? []).map((agent) => ({ value: agent.id, label: agent.name }));

  return (
    <OptionSelect
      {...props}
      options={options}
      loading={isLoading}
      allLabel={allLabel}
      placeholder="Select agent" />);


}

export function CandidateStatusSelect({ allLabel, ...props }: BaseSelectProps) {
  return (
    <OptionSelect
      {...props}
      options={CANDIDATE_STATUSES}
      allLabel={allLabel}
      placeholder="Select status" />);


}

export function CandidateSelect({ allLabel, ...props }: BaseSelectProps) {
  const { data, isLoading } = useGetCandidatesQuery({ pageSize: 200, page: 1 });
  const options: SelectOption[] = (data?.items ?? []).map((candidate) => ({
    value: candidate.id,
    label: `${candidate.id} · ${candidate.fullName}`
  }));

  return (
    <OptionSelect
      {...props}
      options={options}
      loading={isLoading}
      allLabel={allLabel}
      placeholder="Select candidate" />);


}