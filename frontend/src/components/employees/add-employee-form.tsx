import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Employee, Department } from "../../lib/api";
import { Loader2, User, Briefcase, X } from "lucide-react";

interface AddEmployeeFormProps {
  onClose: () => void;
  onSubmit: (data: Partial<Employee>) => Promise<void>;
  departments: Department[];
}

export function AddEmployeeForm({ onClose, onSubmit, departments }: AddEmployeeFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    marital_status: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    emergency_contact_relationship: "",
    
    employee_id: "",
    role: "",
    department: "",
    employment_type: "full-time",
    work_location: "",
    manager: "",
    working_hours: "",
    salary: "",
    hire_date: "",
    contract_type: "",
    probation_period: "",
    additional_notes: "",
    status: "active"
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!formData.first_name || !formData.last_name || !formData.email) {
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      handleNext(e);
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender || undefined,
        date_of_birth: formData.date_of_birth || undefined,
        address: formData.street_address,
        role: formData.role,
        department: parseInt(formData.department),
        employment_type: formData.employment_type as 'full-time' | 'part-time' | 'contract',
        salary: formData.salary,
        hire_date: formData.hire_date,
        status: formData.status as 'active' | 'inactive' | 'terminated'
      });
    } catch (error) {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Add New Employee</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {/* Step 1 - Only black when currentStep === 1 */}
          <div className="flex items-center gap-2">
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-full"
              style={{
                backgroundColor: currentStep === 1 ? '#000000' : '#e5e7eb',
                color: currentStep === 1 ? '#ffffff' : '#6b7280'
              }}
            >
              <User className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className={`text-xs ${currentStep === 1 ? 'text-black font-medium' : 'text-gray-500'}`}>
                Step 1
              </div>
              <div className={`text-sm ${currentStep === 1 ? 'font-medium' : 'text-gray-500'}`}>
                Personal Info
              </div>
            </div>
          </div>
            
          {/* Connecting line - Black when reached Step 2 */}
          <div 
            className="h-[2px] w-24"
            style={{
              backgroundColor: currentStep >= 2 ? '#000000' : '#e5e7eb'
            }}
          ></div>
        
          {/* Step 2 - Only black when currentStep === 2 */}
          <div className="flex items-center gap-2">
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-full"
              style={{
                backgroundColor: currentStep === 2 ? '#000000' : '#e5e7eb',
                color: currentStep === 2 ? '#ffffff' : '#6b7280'
              }}
            >
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="text-left">
              <div className={`text-xs ${currentStep === 2 ? 'text-black font-medium' : 'text-gray-500'}`}>
                Step 2
              </div>
              <div className={`text-sm ${currentStep === 2 ? 'font-medium' : 'text-gray-500'}`}>
                Professional Info
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Basic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="first_name"
                      placeholder="Enter first name"
                      value={formData.first_name}
                      onChange={(e) => handleChange('first_name', e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last_name">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="last_name"
                      placeholder="Enter last name"
                      value={formData.last_name}
                      onChange={(e) => handleChange('last_name', e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      placeholder="Select date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleChange('date_of_birth', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">
                      Gender <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.gender} onValueChange={(val) => handleChange('gender', val)}>
                      <SelectTrigger id="gender" className="h-10">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marital_status">Marital Status</Label>
                  <Select value={formData.marital_status} onValueChange={(val) => handleChange('marital_status', val)}>
                    <SelectTrigger id="marital_status" className="h-10">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Address Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="street_address">
                    Street Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="street_address"
                    placeholder="Enter street address"
                    value={formData.street_address}
                    onChange={(e) => handleChange('street_address', e.target.value)}
                    className="h-10"
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="Enter state"
                      value={formData.state}
                      onChange={(e) => handleChange('state', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input
                      id="zip_code"
                      placeholder="Enter ZIP code"
                      value={formData.zip_code}
                      onChange={(e) => handleChange('zip_code', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={formData.country} onValueChange={(val) => handleChange('country', val)}>
                      <SelectTrigger id="country" className="h-10">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Emergency Contact</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name">Contact Name</Label>
                    <Input
                      id="emergency_contact_name"
                      placeholder="Enter contact name"
                      value={formData.emergency_contact_name}
                      onChange={(e) => handleChange('emergency_contact_name', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                    <Input
                      id="emergency_contact_phone"
                      placeholder="Enter contact phone"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => handleChange('emergency_contact_phone', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                    <Select value={formData.emergency_contact_relationship} onValueChange={(val) => handleChange('emergency_contact_relationship', val)}>
                      <SelectTrigger id="emergency_contact_relationship" className="h-10">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Employment Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Employment Details</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee_id">Employee ID</Label>
                    <Input
                      id="employee_id"
                      placeholder="Enter employee ID"
                      value={formData.employee_id}
                      onChange={(e) => handleChange('employee_id', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">
                      Department <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.department} onValueChange={(val) => handleChange('department', val)} required>
                      <SelectTrigger id="department" className="h-10">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">
                      Position/Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="role"
                      placeholder="Enter job title"
                      value={formData.role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employment_type">
                      Employment Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.employment_type} onValueChange={(val) => handleChange('employment_type', val)}>
                      <SelectTrigger id="employment_type" className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hire_date">
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hire_date"
                      type="date"
                      placeholder="Select start date"
                      value={formData.hire_date}
                      onChange={(e) => handleChange('hire_date', e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="work_location">
                      Work Location <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.work_location} onValueChange={(val) => handleChange('work_location', val)}>
                      <SelectTrigger id="work_location" className="h-10">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="manager">
                      Manager <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.manager} onValueChange={(val) => handleChange('manager', val)}>
                      <SelectTrigger id="manager" className="h-10">
                        <SelectValue placeholder="Select manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john-doe">John Doe</SelectItem>
                        <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="working_hours">Working Hours</Label>
                    <Select value={formData.working_hours} onValueChange={(val) => handleChange('working_hours', val)}>
                      <SelectTrigger id="working_hours" className="h-10">
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9-5">9:00 AM - 5:00 PM</SelectItem>
                        <SelectItem value="10-6">10:00 AM - 6:00 PM</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Compensation & Contract */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Compensation & Contract</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary">Annual Salary</Label>
                    <Input
                      id="salary"
                      type="number"
                      placeholder="Enter annual salary"
                      min="0"
                      step="1000"
                      value={formData.salary}
                      onChange={(e) => handleChange('salary', e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contract_type">Contract Type</Label>
                    <Select value={formData.contract_type} onValueChange={(val) => handleChange('contract_type', val)}>
                      <SelectTrigger id="contract_type" className="h-10">
                        <SelectValue placeholder="Select contract type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="permanent">Permanent</SelectItem>
                        <SelectItem value="fixed-term">Fixed-term</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="probation_period">Probation Period</Label>
                  <Select value={formData.probation_period} onValueChange={(val) => handleChange('probation_period', val)}>
                    <SelectTrigger id="probation_period" className="h-10">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-months">3 Months</SelectItem>
                      <SelectItem value="6-months">6 Months</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional_notes">Additional Notes</Label>
                  <Textarea
                    id="additional_notes"
                    placeholder="Enter any additional notes or comments..."
                    value={formData.additional_notes}
                    onChange={(e) => handleChange('additional_notes', e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={currentStep === 1 ? onClose : handleBack}
              disabled={loading}
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="!bg-black !text-white hover:!bg-black/90 disabled:!bg-black/70">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : currentStep === 1 ? (
                'Next'
              ) : (
                'Add Employee'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}