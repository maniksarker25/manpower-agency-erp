import React from "react";
import { ActivityIcon, CreditCardIcon, FileTextIcon, GlobeIcon, LogInIcon, SettingsIcon, UserCogIcon, UsersIcon, BuildingIcon, BoxIcon } from "lucide-react";
import { ActivityEntry } from "../../types/models";
import { formatRelative } from "../../utils/format";
const MODULE_ICONS: Record<string, BoxIcon> = {
  Candidates: UsersIcon,
  Agents: BuildingIcon,
  Countries: GlobeIcon,
  Payments: CreditCardIcon,
  Documents: FileTextIcon,
  Users: UserCogIcon,
  Settings: SettingsIcon,
  Auth: LogInIcon
};
export function ActivityFeed({
  entries


}: {entries: ActivityEntry[];}) {
  return <ol className="space-y-4">
      {entries.map((entry) => {
      const Icon = MODULE_ICONS[entry.module] ?? ActivityIcon;
      return <li key={entry.id} className="flex gap-3">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary">
              <Icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium leading-snug text-foreground">
                {entry.action}
                {entry.record !== '—' ? <span className="num text-muted-foreground"> · {entry.record}</span> : null}
              </p>
              <p className="mt-0.5 truncate text-[13px] text-muted-foreground">{entry.details}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {entry.user} · {formatRelative(entry.timestamp)}
              </p>
            </div>
          </li>;
    })}
    </ol>;
}