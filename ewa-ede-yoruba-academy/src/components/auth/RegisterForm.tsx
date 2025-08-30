'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ChevronRight, ChevronLeft, User, Mail, Lock, BookOpen, Phone, Calendar } from 'lucide-react';

const steps = [
  { id: 'Account', name: 'Account Information', icon: User },
  { id: 'Personal', name: 'Personal Details', icon: User },
  { id: 'Education', name: 'Education', icon: BookOpen },
  { id: 'Contact', name: 'Contact Information', icon: Phone },
  { id: 'Complete', name: 'Complete' }
];

export default function RegisterForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Account Information
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    
    // Personal Details
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    
    // Education
    educationLevel: '',
    institution: '',
    courseOfStudy: '',
    
    // Contact Information
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    
    // Terms
    termsAccepted: false,
    newsletter: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 0) {
      if (!formData.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Please select a gender';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) return;
    
    if (currentStep < steps.length - 2) {
      nextStep();
      return;
    }
    
    // Final validation before submission
    if (currentStep === steps.length - 2) {
      if (!formData.termsAccepted) {
        setErrors(prev => ({ ...prev, termsAccepted: 'You must accept the terms and conditions' }));
        return;
      }
      
      setIsLoading(true);
      
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            // Include other form data as needed
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }

        // Move to completion step
        setCurrentStep(steps.length - 1);
      } catch (error) {
        setErrors(prev => ({ ...prev, form: error instanceof Error ? error.message : 'Registration failed' }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Account Information
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
            <p className="text-sm text-gray-500">Enter your account details to get started</p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  I am a
                </label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      case 1: // Personal Details
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>
            <p className="text-sm text-gray-500">Tell us a bit about yourself</p>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  className={`block w-full border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  className={`block w-full border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    className={`block w-full pl-10 border ${errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>
                {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base ${errors.gender ? 'border-red-300' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                  <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                </select>
                {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
              </div>
            </div>
          </div>
        );
        
      case 2: // Education
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Education</h3>
            <p className="text-sm text-gray-500">Tell us about your education background</p>
            
            <div>
              <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1">
                Highest Education Level
              </label>
              <select
                id="educationLevel"
                name="educationLevel"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={formData.educationLevel}
                onChange={handleChange}
              >
                <option value="">Select education level</option>
                <option value="HIGH_SCHOOL">High School</option>
                <option value="ASSOCIATE">Associate Degree</option>
                <option value="BACHELORS">Bachelor&apos;s Degree</option>
                <option value="MASTERS">Master&apos;s Degree</option>
                <option value="PHD">PhD/Doctorate</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                Institution
              </label>
              <input
                type="text"
                name="institution"
                id="institution"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.institution}
                onChange={handleChange}
                placeholder="e.g. University of Lagos"
              />
            </div>
            
            <div>
              <label htmlFor="courseOfStudy" className="block text-sm font-medium text-gray-700 mb-1">
                Course of Study (Optional)
              </label>
              <input
                type="text"
                name="courseOfStudy"
                id="courseOfStudy"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.courseOfStudy}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
              />
            </div>
          </div>
        );
        
      case 3: // Contact Information
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            <p className="text-sm text-gray-500">How can we reach you?</p>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="+234 800 000 0000"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  id="state"
                  className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="">Select country</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="pt-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="termsAccepted"
                    name="termsAccepted"
                    type="checkbox"
                    checked={formData.termsAccepted as boolean}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="termsAccepted" className="font-medium text-gray-700">
                    I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a> and{' '}
                    <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                  </label>
                  {errors.termsAccepted && <p className="mt-1 text-sm text-red-600">{errors.termsAccepted}</p>}
                </div>
              </div>
              
              <div className="mt-2 flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    checked={formData.newsletter as boolean}
                    onChange={handleChange}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="newsletter" className="font-medium text-gray-700">
                    Subscribe to our newsletter for updates and promotions
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4: // Complete
        return (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Registration Complete!</h3>
            <p className="mt-2 text-sm text-gray-500">
              Thank you for registering with Ewa Ede Yoruba Academy. Your account has been created successfully.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Skip the completion step if we're not there yet
  if (currentStep === steps.length - 1 && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
          {renderStepContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-lg shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 text-center">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>

        {/* Progress Steps */}
        <nav aria-label="Progress">
          <ol className="flex items-center">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className={`${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
                {stepIdx < currentStep ? (
                  <div className="group flex flex-col items-center">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </span>
                    <span className="mt-2 text-xs font-medium text-gray-900">{step.name}</span>
                  </div>
                ) : stepIdx === currentStep ? (
                  <div className="flex flex-col items-center" aria-current="step">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-indigo-600 bg-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-600"></span>
                    </span>
                    <span className="mt-2 text-xs font-medium text-indigo-600">{step.name}</span>
                  </div>
                ) : (
                  <div className="group flex flex-col items-center">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-gray-300">
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent"></span>
                    </span>
                    <span className="mt-2 text-xs font-medium text-gray-500">{step.name}</span>
                  </div>
                )}
                
                {stepIdx < steps.length - 1 && (
                  <div className={`absolute top-4 left-1/2 -ml-2 mt-0.5 h-0.5 w-full ${stepIdx < currentStep ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Form Content */}
        <div className="mt-8">
          {errors.form && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errors.form}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}
            
            <div className="flex justify-between pt-6">
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ChevronLeft className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                  Back
                </button>
              )}
              
              <div className="ml-auto">
                {currentStep < steps.length - 2 ? (
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Next
                    <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
                  </button>
                ) : currentStep === steps.length - 2 ? (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </button>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
