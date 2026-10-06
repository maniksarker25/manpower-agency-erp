import React, { useState } from 'react';
import { toast } from 'sonner';
import { PlusIcon, XIcon } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

interface OptionListEditorProps {
  label: string;
  values: string[];
  /** Values that other records depend on and therefore cannot be removed. */
  locked?: string[];
  placeholder?: string;
}

/**
 * Lets administrators manage a dropdown list. Changes are optimistic locally and
 * submitted to the settings endpoint once the backend is connected.
 */
export function OptionListEditor({ label, values, locked = [], placeholder }: OptionListEditorProps) {
  const [items, setItems] = useState(values);
  const [draft, setDraft] = useState('');

  const add = (event: React.FormEvent) => {
    event.preventDefault();
    const value = draft.trim();
    if (!value) return;
    if (items.some((item) => item.toLowerCase() === value.toLowerCase())) {
      toast.error('That value already exists');
      return;
    }
    setItems((current) => [...current, value]);
    setDraft('');
    toast.success(`${label} updated`, { description: `“${value}” added.` });
  };

  const remove = (value: string) => {
    setItems((current) => current.filter((item) => item !== value));
    toast.success(`${label} updated`, { description: `“${value}” removed.` });
  };

  return (
    <div className="space-y-4">
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isLocked = locked.includes(item);
          return (
            <li
              key={item}
              className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 py-1 pl-2.5 pr-1.5 text-[13px]">
              
              {item}
              {isLocked ?
              <span className="text-xs text-muted-foreground">system</span> :

              <button
                type="button"
                onClick={() => remove(item)}
                aria-label={`Remove ${item}`}
                className="rounded p-0.5 text-muted-foreground transition-colors duration-150 ease-out hover:bg-card hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                
                  <XIcon className="size-3.5" />
                </button>
              }
            </li>);

        })}
      </ul>

      <form className="flex gap-2" onSubmit={add}>
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={placeholder ?? `Add a new ${label.toLowerCase()} value`}
          aria-label={`Add ${label}`}
          className="max-w-xs" />
        
        <Button type="submit" variant="outline">
          <PlusIcon aria-hidden="true" />
          Add
        </Button>
      </form>
    </div>);

}