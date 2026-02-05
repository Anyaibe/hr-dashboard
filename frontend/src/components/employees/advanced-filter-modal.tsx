import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface AdvancedFilterModalProps {
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  departments: Array<{ id: number; name: string }>;
}

export interface FilterState {
  departments: string[];
  employmentTypes: string[];
  statuses: string[];
  gender: string;
}

export function AdvancedFilterModal({ onClose, onApply, departments }: AdvancedFilterModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    departments: [],
    employmentTypes: [],
    statuses: [],
    gender: "all"
  });

  const toggleArrayFilter = (category: 'departments' | 'employmentTypes' | 'statuses', value: string) => {
    setFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const handleReset = () => {
    setFilters({
      departments: [],
      employmentTypes: [],
      statuses: [],
      gender: "all"
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-xl !bg-white">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">Advanced Filters</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Apply advanced filters to refine your search results and find exactly what you're looking for.
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="h-8 w-8 -mt-2 -mr-2 hover:bg-gray-100"
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Department Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Department</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {departments.slice(0, 6).map((dept) => (
                <label
                  key={dept.id}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={filters.departments.includes(dept.id.toString())}
                    onChange={() => toggleArrayFilter('departments', dept.id.toString())}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{dept.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t"></div>

          {/* Employment Type Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Employment Type</h3>
            <div className="grid grid-cols-3 gap-x-8 gap-y-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.employmentTypes.includes('full-time')}
                  onChange={() => toggleArrayFilter('employmentTypes', 'full-time')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Full-time</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.employmentTypes.includes('part-time')}
                  onChange={() => toggleArrayFilter('employmentTypes', 'part-time')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Part-time</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.employmentTypes.includes('contract')}
                  onChange={() => toggleArrayFilter('employmentTypes', 'contract')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Contract</span>
              </label>
            </div>
          </div>

          <div className="border-t"></div>

          {/* Status Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Status</h3>
            <div className="grid grid-cols-3 gap-x-8 gap-y-3">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.statuses.includes('active')}
                  onChange={() => toggleArrayFilter('statuses', 'active')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.statuses.includes('inactive')}
                  onChange={() => toggleArrayFilter('statuses', 'inactive')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">Inactive</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.statuses.includes('on-leave')}
                  onChange={() => toggleArrayFilter('statuses', 'on-leave')}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">On Leave</span>
              </label>
            </div>
          </div>

          <div className="border-t"></div>

          {/* Gender Filter */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Gender</h3>
            <select
              value={filters.gender}
              onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
              className="w-full h-10 px-3 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t mt-6">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="px-6"
          >
            Reset All
          </Button>
          <Button 
            onClick={handleApply}
            className="!bg-black hover:bg-gray-800 text-white px-6"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}