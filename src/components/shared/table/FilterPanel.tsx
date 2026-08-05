"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, Check, Filter } from "lucide-react";

export type FilterOption = {
  value: string;
  label: string;
};

export type MultiSelectFilter = {
  type: "multi";
  label: string;
  selected: string[];
  options: FilterOption[];
  onChange: (selected: string[]) => void;
};

export type SingleSelectFilter = {
  type: "single";
  label: string;
  selected: string | null;
  options: FilterOption[];
  onChange: (value: string | null) => void;
};

export type RangeFilter = {
  type: "range";
  label: string;
  min: number | "";
  max: number | "";
  onChange: (value: { min: number | ""; max: number | "" }) => void;
  placeholder?: string;
};

export type FilterItem = MultiSelectFilter | SingleSelectFilter | RangeFilter;

interface FilterPanelProps {
  items: FilterItem[];
  onApply: () => void;
  onClear?: () => void;
  title?: string;
}

const FilterPanel = ({ items, onApply, onClear, title = "Filters" }: FilterPanelProps) => {
  const [open, setOpen] = useState(false);
  const hasSelected = useMemo(
    () => items.some((item) => {
      if (item.type === "multi") return item.selected.length > 0;
      if (item.type === "single") return Boolean(item.selected);
      if (item.type === "range") return item.min !== "" || item.max !== "";
      return false;
    }),
    [items]
  );

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={<Button variant={hasSelected ? "secondary" : "outline"} size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          <span>{title}</span>
          <ArrowDown className="h-4 w-4" />
        </Button>} />
        <PopoverContent className="max-w-md gap-4">
          <PopoverTitle className="text-base font-semibold">{title}</PopoverTitle>
          <div className="space-y-4">
          {items.map((item) => {
            if (item.type === "multi") {
              return (
                <div key={item.label} className="space-y-2">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="grid max-h-48 gap-2 overflow-y-auto rounded-md border border-input bg-background p-2">
                    {item.options.map((option) => (
                      <label key={option.value} className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted">
                        <Checkbox checked={item.selected.includes(option.value)} onCheckedChange={(checked) => {
                          if (checked) {
                            item.onChange([...item.selected, option.value]);
                          } else {
                            item.onChange(item.selected.filter((value) => value !== option.value));
                          }
                        }} />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            }

            if (item.type === "single") {
              return (
                <div key={item.label} className="space-y-2">
                  <div className="text-sm font-medium">{item.label}</div>
                  <Select value={item.selected ?? ""} onValueChange={(value) => item.onChange(value || null)}>
                    <SelectTrigger className="w-full" size="sm">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {item.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            }

            return (
              <div key={item.label} className="space-y-2">
                <div className="text-sm font-medium">{item.label}</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Min</span>
                    <Input
                      type="number"
                      value={item.min === "" ? "" : String(item.min)}
                      onChange={(event) => {
                        const value = event.target.value === "" ? "" : Number(event.target.value);
                        item.onChange({ min: value, max: item.max });
                      }}
                      placeholder={item.placeholder ?? "Min"}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Max</span>
                    <Input
                      type="number"
                      value={item.max === "" ? "" : String(item.max)}
                      onChange={(event) => {
                        const value = event.target.value === "" ? "" : Number(event.target.value);
                        item.onChange({ min: item.min, max: value });
                      }}
                      placeholder={item.placeholder ?? "Max"}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              onApply();
              setOpen(false);
            }}
          >
            Apply Changes
          </Button>
        </div>
      </PopoverContent>
    </Popover>
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        onClear?.();
        setOpen(false);
      }}
      disabled={!hasSelected || !onClear}
    >
      Clear Filters
    </Button>
  </div>
  );
};

export default FilterPanel;
