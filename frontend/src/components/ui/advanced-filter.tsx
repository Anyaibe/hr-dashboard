import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { Checkbox } from "./checkbox";
import { Badge } from "./badge";
import { Filter, X } from "lucide-react";

export interface FilterOption {
  key: string;
  label: string;
  type: "select" | "multiselect" | "date" | "text" | "number";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface FilterValues {
  [key: string]: string | string[] | number | Date;
}

interface AdvancedFilterProps {
  filterOptions: FilterOption[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onReset: () => void;
}

export function AdvancedFilter({ filterOptions, values, onChange, onReset }: AdvancedFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localValues, setLocalValues] = useState<FilterValues>(values);

  const handleApply = () => {
    onChange(localValues);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalValues({});
    onReset();
    setIsOpen(false);
  };

  const updateValue = (key: string, value: any) => {
    setLocalValues(prev => ({ ...prev, [key]: value }));
  };

  const getActiveFiltersCount = () => {
    return Object.keys(values).filter(key => {
      const value = values[key];
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== "" && value !== null;
    }).length;
  };

  const getActiveFilterLabels = () => {
    return Object.entries(values)
      .filter(([key, value]) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== undefined && value !== "" && value !== null;
      })
      .map(([key, value]) => {
        const option = filterOptions.find(opt => opt.key === key);
        if (!option) return null;
        
        if (Array.isArray(value)) {
          return `${option.label}: ${value.length} selected`;
        }
        return `${option.label}: ${value}`;
      })
      .filter(Boolean);
  };

  const activeFiltersCount = getActiveFiltersCount();
  const activeFilterLabels = getActiveFilterLabels();

  const renderFilterInput = (option: FilterOption) => {
    const value = localValues[option.key];

    switch (option.type) {
      case "select":
        return (
          <Select 
            value={value as string || "all"} 
            onValueChange={(val) => updateValue(option.key, val === "all" ? "" : val)}
          >
            <SelectTrigger>
              <SelectValue placeholder={option.placeholder || `Select ${option.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {option.label}</SelectItem>
              {option.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multiselect":
        const selectedValues = (value as string[]) || [];
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-2">
              {option.options?.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${option.key}-${opt.value}`}
                    checked={selectedValues.includes(opt.value)}
                    onCheckedChange={(checked: boolean) => {
                      if (checked) {
                        updateValue(option.key, [...selectedValues, opt.value]);
                      } else {
                        updateValue(option.key, selectedValues.filter(v => v !== opt.value));
                      }
                    }}
                  />
                  <Label 
                    htmlFor={`${option.key}-${opt.value}`}
                    className="text-sm cursor-pointer"
                  >
                    {opt.label}
                  </Label>
                </div>
              ))}
            </div>
            {selectedValues.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedValues.map((val) => {
                  const optionLabel = option.options?.find(opt => opt.value === val)?.label || val;
                  return (
                    <Badge key={val} variant="secondary" className="text-xs">
                      {optionLabel}
                      <X 
                        className="h-3 w-3 ml-1 cursor-pointer"
                        onClick={() => updateValue(option.key, selectedValues.filter(v => v !== val))}
                      />
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        );

      case "text":
        return (
          <Input
            value={value as string || ""}
            onChange={(e) => updateValue(option.key, e.target.value)}
            placeholder={option.placeholder || `Enter ${option.label.toLowerCase()}`}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            value={value as number || ""}
            onChange={(e) => updateValue(option.key, e.target.value ? parseInt(e.target.value) : "")}
            placeholder={option.placeholder || `Enter ${option.label.toLowerCase()}`}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={value as string || ""}
            onChange={(e) => updateValue(option.key, e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Filter className="h-4 w-4" />
            {activeFiltersCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
            <DialogDescription>
              Apply advanced filters to refine your search results and find exactly what you're looking for.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filterOptions.map((option) => (
                <div key={option.key} className="space-y-2">
                  <Label htmlFor={option.key}>{option.label}</Label>
                  {renderFilterInput(option)}
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleReset}>
                Reset All
              </Button>
              <Button onClick={handleApply}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Filters Display */}
      {activeFilterLabels.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {activeFilterLabels.slice(0, 2).map((label, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {label}
            </Badge>
          ))}
          {activeFilterLabels.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{activeFilterLabels.length - 2} more
            </Badge>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}