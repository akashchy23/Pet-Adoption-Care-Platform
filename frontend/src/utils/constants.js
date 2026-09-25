// System Constants for Pet Adoption and Care Platform

export const USER_ROLES = {
  PET_OWNER: 'PetOwner',
  ADOPTER: 'Adopter',
  VETERINARIAN: 'Veterinarian',
  ADMINISTRATOR: 'Administrator',
  SHELTER_MANAGER: 'Administrator'
};

export const ROLE_LABELS = {
  PetOwner: 'Pet Owner',
  Adopter: 'Adopter',
  Veterinarian: 'Veterinarian',
  Administrator: 'Admin',
  ShelterManager: 'Admin'
};

export const ROLE_REDIRECT_PATHS = {
  PetOwner: '/owner/dashboard',
  Adopter: '/adopter/dashboard',
  Veterinarian: '/veterinarian/dashboard',
  Administrator: '/admin/dashboard',
  ShelterManager: '/admin/dashboard'
};

export const PET_SPECIES = [
  'All',
  'Dog',
  'Cat',
  'Rabbit',
  'Bird',
  'Other'
];

export const PET_SIZES = [
  'All',
  'Small',
  'Medium',
  'Large'
];

export const PET_GENDERS = [
  'All',
  'Male',
  'Female'
];

export const PET_AGES = [
  { label: 'All Ages', value: 'all' },
  { label: 'Puppy / Kitten (< 1 yr)', value: 'young' },
  { label: 'Young (1 - 3 yrs)', value: 'young-adult' },
  { label: 'Adult (3 - 7 yrs)', value: 'adult' },
  { label: 'Senior (7+ yrs)', value: 'senior' }
];

export const ADOPTION_STATUSES = {
  AVAILABLE: 'Available',
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  ADOPTED: 'Adopted'
};

export const VACCINATION_STATUSES = {
  UPCOMING: 'Upcoming',
  COMPLETED: 'Completed',
  OVERDUE: 'Overdue'
};

export const VET_SPECIALIZATIONS = [
  'All Specializations',
  'Small Animal Wellness & Surgery',
  'Canine Orthopedics & Internal Medicine',
  'Feline Medicine & Exotic Care',
  'Veterinary Dentistry',
  'Dermatology & Allergy Care'
];

export const LEARNING_CATEGORIES = [
  'All Categories',
  'Puppy Care',
  'Cat Care',
  'Grooming',
  'Vaccination',
  'Nutrition',
  'Training Tips'
];
