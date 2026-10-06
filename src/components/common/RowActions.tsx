import React from "react";
import { MoreHorizontalIcon, BoxIcon } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
export interface RowAction {
  label: string;
  icon?: BoxIcon;
  onSelect: () => void;
  destructive?: boolean;
  separatorBefore?: boolean;
  disabled?: boolean;
}
export function RowActions({
  actions,
  label = 'Row actions'



}: {actions: RowAction[];label?: string;}) {
  return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={label} onClick={(event) => event.stopPropagation()}>
          <MoreHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={(event) => event.stopPropagation()}>
        {actions.map((action) => <React.Fragment key={action.label}>
            {action.separatorBefore ? <DropdownMenuSeparator /> : null}
            <DropdownMenuItem destructive={action.destructive} disabled={action.disabled} onSelect={() => action.onSelect()}>
              {action.icon ? <action.icon aria-hidden="true" /> : null}
              {action.label}
            </DropdownMenuItem>
          </React.Fragment>)}
      </DropdownMenuContent>
    </DropdownMenu>;
}