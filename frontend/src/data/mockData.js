// Comprehensive mock dataset for PetHaven
// Serves as seed data and instant offline fallback for university presentation / viva

export const MOCK_USERS = [
  {
    id: 'user-1',
    name: 'Alex Morgan',
    email: 'adopter@pethaven.com',
    role: 'Adopter',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-5678',
    address: '42 Pine Hill Lane, Seattle, WA',
    bio: 'Animal lover seeking an energetic companion for outdoor hiking and weekend runs.',
    joinedDate: '2025-01-15'
  },
  {
    id: 'user-2',
    name: 'Sarah Jenkins',
    email: 'owner@pethaven.com',
    role: 'PetOwner',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 345-6789',
    address: '108 Evergreen Terrace, Portland, OR',
    bio: 'Proud pet parent of two rescue dogs and a British Shorthair cat.',
    joinedDate: '2024-11-20'
  },
  {
    id: 'user-3',
    name: 'Happy Paws Rescue (Michael Scott)',
    email: 'shelter@pethaven.com',
    role: 'ShelterManager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 456-7890',
    address: '742 Evergreen Animal Haven, Seattle, WA',
    bio: 'Dedicated shelter manager committed to giving vulnerable pets safe second homes.',
    joinedDate: '2023-06-10'
  },
  {
    id: 'user-4',
    name: 'Dr. Emily Stone, DVM',
    email: 'vet@pethaven.com',
    role: 'Veterinarian',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 567-8901',
    address: 'Greenwood Vet Care Center, 1200 4th Ave, Seattle, WA',
    bio: 'Board-certified veterinarian specializing in small animal wellness, surgery, and preventive care.',
    joinedDate: '2023-03-01'
  },
  {
    id: 'user-5',
    name: 'System Administrator',
    email: 'admin@pethaven.com',
    role: 'Administrator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 999-0000',
    address: 'PetHaven Central HQ, Seattle, WA',
    bio: 'Platform management and quality compliance lead.',
    joinedDate: '2022-01-01'
  }
];

export const MOCK_PETS = [
  {
    id: 'pet-1',
    name: 'Luna',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: '2 years',
    ageMonths: 24,
    gender: 'Female',
    size: 'Large',
    weightKg: 28.5,
    color: 'Golden',
    vaccinated: true,
    vaccinationStatus: 'Up to date',
    healthStatus: 'Excellent',
    spayedNeutered: true,
    microchipId: '985141002348911',
    adoptionFee: 150,
    status: 'Available', // Available, Pending, Adopted
    shelterId: 'shelter-1',
    shelterName: 'Happy Paws Rescue',
    shelterLocation: 'Seattle, WA',
    primaryImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Luna is a joyful, affectionate 2-year-old Golden Retriever who adores trail walks, swimming, and playing fetch. She gets along wonderfully with other dogs and is great with gentle kids.',
    temperament: ['Playful', 'Friendly', 'Affectionate', 'Intelligent', 'Kid-friendly'],
    featured: true,
    intakeDate: '2025-01-10'
  },
  {
    id: 'pet-2',
    name: 'Milo',
    species: 'Cat',
    breed: 'British Shorthair',
    age: '1 year',
    ageMonths: 12,
    gender: 'Male',
    size: 'Medium',
    weightKg: 4.8,
    color: 'Blue/Grey',
    vaccinated: true,
    vaccinationStatus: 'Up to date',
    healthStatus: 'Excellent',
    spayedNeutered: true,
    microchipId: '985141009871234',
    adoptionFee: 100,
    status: 'Available',
    shelterId: 'shelter-1',
    shelterName: 'Happy Paws Rescue',
    shelterLocation: 'Seattle, WA',
    primaryImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Milo is a calm, dignified British Shorthair with plush fur and copper eyes. He enjoys cozy window perches, laser toys, and gentle chin scratches.',
    temperament: ['Calm', 'Independent', 'Curious', 'Quiet'],
    featured: true,
    intakeDate: '2025-01-20'
  },
  {
    id: 'pet-3',
    name: 'Bella',
    species: 'Dog',
    breed: 'French Bulldog',
    age: '3 years',
    ageMonths: 36,
    gender: 'Female',
    size: 'Small',
    weightKg: 11.2,
    color: 'Cream / Fawn',
    vaccinated: true,
    vaccinationStatus: 'Up to date',
    healthStatus: 'Good',
    spayedNeutered: true,
    microchipId: '985141004561234',
    adoptionFee: 200,
    status: 'Available',
    shelterId: 'shelter-2',
    shelterName: 'Northwest Animal Sanctuary',
    shelterLocation: 'Bellevue, WA',
    primaryImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Bella is a sweet-tempered Frenchie who loves apartment lounging, short morning strolls, and cuddling on the sofa. Perfect for quiet homes.',
    temperament: ['Loving', 'Cuddle Bug', 'Low energy', 'Apartment-friendly'],
    featured: true,
    intakeDate: '2025-02-01'
  },
  {
    id: 'pet-4',
    name: 'Oliver',
    species: 'Cat',
    breed: 'Maine Coon Mix',
    age: '4 years',
    ageMonths: 48,
    gender: 'Male',
    size: 'Large',
    weightKg: 7.6,
    color: 'Tabby with White',
    vaccinated: true,
    vaccinationStatus: 'Up to date',
    healthStatus: 'Excellent',
    spayedNeutered: true,
    microchipId: '985141007788990',
    adoptionFee: 120,
    status: 'Pending',
    shelterId: 'shelter-1',
    shelterName: 'Happy Paws Rescue',
    shelterLocation: 'Seattle, WA',
    primaryImage: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Oliver is a gentle giant with luxurious floof and a sweet chirping meow. He gets along with cats and calm dogs.',
    temperament: ['Gentle', 'Fluffy', 'Social', 'Affectionate'],
    featured: false,
    intakeDate: '2025-01-05'
  },
  {
    id: 'pet-5',
    name: 'Rocky',
    species: 'Dog',
    breed: 'German Shepherd Mix',
    age: '1.5 years',
    ageMonths: 18,
    gender: 'Male',
    size: 'Large',
    weightKg: 31.0,
    color: 'Black & Tan',
    vaccinated: true,
    vaccinationStatus: 'Up to date',
    healthStatus: 'Excellent',
    spayedNeutered: true,
    microchipId: '985141001122334',
    adoptionFee: 150,
    status: 'Available',
    shelterId: 'shelter-2',
    shelterName: 'Northwest Animal Sanctuary',
    shelterLocation: 'Bellevue, WA',
    primaryImage: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Rocky is an active, highly trainable German Shepherd mix looking for a committed guardian who enjoys obedience training and outdoor adventures.',
    temperament: ['Energetic', 'Loyal', 'Protective', 'Eager to learn'],
    featured: true,
    intakeDate: '2025-01-25'
  },
  {
    id: 'pet-6',
    name: 'Barnaby',
    species: 'Rabbit',
    breed: 'Holland Lop',
    age: '8 months',
    ageMonths: 8,
    gender: 'Male',
    size: 'Small',
    weightKg: 1.8,
    color: 'Caramel & White',
    vaccinated: true,
    vaccinationStatus: 'Up to date',
    healthStatus: 'Excellent',
    spayedNeutered: true,
    microchipId: '985141006655443',
    adoptionFee: 50,
    status: 'Available',
    shelterId: 'shelter-1',
    shelterName: 'Happy Paws Rescue',
    shelterLocation: 'Seattle, WA',
    primaryImage: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Barnaby is an adorable Holland Lop with soft floppy ears. He is litterbox-trained, enjoys timothy hay treats, and loves exploring safely.',
    temperament: ['Gentle', 'Curious', 'Quiet', 'Litter-trained'],
    featured: false,
    intakeDate: '2025-02-05'
  },
  {
    id: 'pet-7',
    name: 'Kiwi',
    species: 'Bird',
    breed: 'Cockatiel',
    age: '2 years',
    ageMonths: 24,
    gender: 'Male',
    size: 'Small',
    weightKg: 0.1,
    color: 'Yellow Crest & Grey',
    vaccinated: true,
    vaccinationStatus: 'Up to date',
    healthStatus: 'Excellent',
    spayedNeutered: false,
    microchipId: '985141003344556',
    adoptionFee: 60,
    status: 'Available',
    shelterId: 'shelter-2',
    shelterName: 'Northwest Animal Sanctuary',
    shelterLocation: 'Bellevue, WA',
    primaryImage: 'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Kiwi can whistle melodious tunes and enjoys stepping onto your finger for head scritches. A cheerful companion for any home.',
    temperament: ['Whistler', 'Social', 'Bright', 'Playful'],
    featured: false,
    intakeDate: '2025-01-18'
  },
  {
    id: 'pet-8',
    name: 'Daisy',
    species: 'Dog',
    breed: 'Beagle',
    age: '4 years',
    ageMonths: 48,
    gender: 'Female',
    size: 'Medium',
    weightKg: 12.5,
    color: 'Tricolor',
    vaccinated: true,
    vaccinationStatus: 'Up to date',
    healthStatus: 'Good',
    spayedNeutered: true,
    microchipId: '985141009988112',
    adoptionFee: 140,
    status: 'Adopted',
    shelterId: 'shelter-1',
    shelterName: 'Happy Paws Rescue',
    shelterLocation: 'Seattle, WA',
    primaryImage: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&auto=format&fit=crop&q=80'
    ],
    description: 'Daisy is a gentle Beagle who loves sniffing in the garden and curling up by your feet. Successfully adopted into a loving family!',
    temperament: ['Gentle', 'Food-motivated', 'Sniffer', 'Affectionate'],
    featured: false,
    intakeDate: '2024-12-01'
  }
];

export const MOCK_SHELTERS = [
  {
    id: 'shelter-1',
    name: 'Happy Paws Rescue & Sanctuary',
    managerName: 'Michael Scott',
    email: 'shelter@pethaven.com',
    phone: '+1 (555) 456-7890',
    address: '742 Evergreen Animal Haven, Seattle, WA',
    capacity: 65,
    currentPets: 42,
    adoptionsThisYear: 128,
    verified: true,
    rating: 4.9,
    description: 'Non-profit animal rescue shelter dedicated to no-kill rehabilitation and joyful pet adoptions across the Pacific Northwest.'
  },
  {
    id: 'shelter-2',
    name: 'Northwest Animal Sanctuary',
    managerName: 'Eleanor Vance',
    email: 'info@nwanimalsanctuary.org',
    phone: '+1 (555) 789-0123',
    address: '890 Wildlife Way, Bellevue, WA',
    capacity: 80,
    currentPets: 56,
    adoptionsThisYear: 164,
    verified: true,
    rating: 4.8,
    description: 'Specializing in rescue, veterinary triage, behavioral rehabilitation, and community pet foster programs.'
  }
];

export const MOCK_VETS = [
  {
    id: 'vet-1',
    name: 'Dr. Emily Stone, DVM',
    email: 'vet@pethaven.com',
    clinicName: 'Greenwood Animal Wellness Center',
    specialization: 'Small Animal Wellness & Surgery',
    experienceYears: 11,
    rating: 4.95,
    reviewCount: 142,
    consultationFee: 75,
    address: '1200 4th Ave, Seattle, WA',
    phone: '+1 (555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    bio: 'Graduated from WSU College of Veterinary Medicine. Passionate about preventive wellness, stress-free handling, and dental care.',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM']
  },
  {
    id: 'vet-2',
    name: 'Dr. Marcus Vance, DVM',
    email: 'marcus@soundvets.org',
    clinicName: 'Soundview Veterinary Hospital',
    specialization: 'Canine Orthopedics & Internal Medicine',
    experienceYears: 16,
    rating: 4.88,
    reviewCount: 98,
    consultationFee: 85,
    address: '450 Puget Sound Blvd, Seattle, WA',
    phone: '+1 (555) 890-1234',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    bio: 'Extensive background in orthopedic reconstruction, emergency triage, and senior pet mobility therapy.',
    availableDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:30 AM', '11:00 AM', '02:00 PM', '03:30 PM']
  },
  {
    id: 'vet-3',
    name: 'Dr. Sophia Patel, DVM',
    email: 'sophia@felineandalley.com',
    clinicName: 'Urban Paws Feline & Exotic Clinic',
    specialization: 'Feline Medicine & Exotic Care',
    experienceYears: 8,
    rating: 4.92,
    reviewCount: 110,
    consultationFee: 70,
    address: '220 Broadway East, Seattle, WA',
    phone: '+1 (555) 901-2345',
    avatar: 'https://images.unsplash.com/photo-1594824813590-48924b174092?w=300&auto=format&fit=crop&q=80',
    bio: 'Dedicated advocate for feline-friendly medicine and small mammal care including rabbits, guinea pigs, and avian friends.',
    availableDays: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
    timeSlots: ['10:00 AM', '11:30 AM', '01:30 PM', '03:00 PM', '04:30 PM']
  }
];

export const MOCK_VACCINATIONS = [
  {
    id: 'vac-1',
    petId: 'pet-1',
    petName: 'Luna',
    petSpecies: 'Dog',
    vaccineName: 'Rabies 3-Year',
    givenDate: '2023-08-20',
    dueDate: '2026-08-20',
    batchNumber: 'RB-984210',
    clinic: 'Greenwood Animal Wellness Center',
    vetName: 'Dr. Emily Stone, DVM',
    status: 'Upcoming', // Upcoming, Completed, Overdue
    reminderNotes: 'Rabies vaccination booster scheduled in 5 days'
  },
  {
    id: 'vac-2',
    petId: 'pet-1',
    petName: 'Luna',
    petSpecies: 'Dog',
    vaccineName: 'DHPP (Distemper, Parvo)',
    givenDate: '2024-02-10',
    dueDate: '2025-02-10',
    batchNumber: 'DH-771234',
    clinic: 'Greenwood Animal Wellness Center',
    vetName: 'Dr. Emily Stone, DVM',
    status: 'Completed',
    reminderNotes: 'Completed during annual checkup'
  },
  {
    id: 'vac-3',
    petId: 'pet-1',
    petName: 'Luna',
    petSpecies: 'Dog',
    vaccineName: 'Bordetella (Kennel Cough)',
    givenDate: '2024-08-15',
    dueDate: '2025-02-15',
    batchNumber: 'BT-332114',
    clinic: 'Greenwood Animal Wellness Center',
    vetName: 'Dr. Emily Stone, DVM',
    status: 'Overdue',
    reminderNotes: 'Bordetella booster is overdue. Recommended for dog park visits.'
  },
  {
    id: 'vac-4',
    petId: 'pet-2',
    petName: 'Milo',
    petSpecies: 'Cat',
    vaccineName: 'FVRCP (Feline Viral Rhinotracheitis)',
    givenDate: '2024-06-12',
    dueDate: '2025-06-12',
    batchNumber: 'FV-882910',
    clinic: 'Urban Paws Feline Clinic',
    vetName: 'Dr. Sophia Patel, DVM',
    status: 'Completed',
    reminderNotes: 'Annual booster up to date'
  },
  {
    id: 'vac-5',
    petId: 'pet-2',
    petName: 'Milo',
    petSpecies: 'Cat',
    vaccineName: 'Rabies 1-Year',
    givenDate: '2024-06-12',
    dueDate: '2025-06-12',
    batchNumber: 'RB-102948',
    clinic: 'Urban Paws Feline Clinic',
    vetName: 'Dr. Sophia Patel, DVM',
    status: 'Completed',
    reminderNotes: 'Next booster due in June 2025'
  }
];

export const MOCK_APPOINTMENTS = [
  {
    id: 'apt-1',
    petId: 'pet-1',
    petName: 'Luna',
    ownerId: 'user-1',
    ownerName: 'Alex Morgan',
    vetId: 'vet-1',
    vetName: 'Dr. Emily Stone, DVM',
    clinicName: 'Greenwood Animal Wellness Center',
    date: '2026-08-20',
    time: '10:30 AM',
    reason: 'Annual Wellness & Rabies Booster',
    status: 'Confirmed', // Confirmed, Completed, Cancelled, Pending
    notes: 'Please bring prior vaccine documentation and fecal sample.'
  },
  {
    id: 'apt-2',
    petId: 'pet-2',
    petName: 'Milo',
    ownerId: 'user-2',
    ownerName: 'Sarah Jenkins',
    vetId: 'vet-3',
    vetName: 'Dr. Sophia Patel, DVM',
    clinicName: 'Urban Paws Feline Clinic',
    date: '2026-08-25',
    time: '02:00 PM',
    reason: 'Dental Examination & Tartar Cleaning',
    status: 'Confirmed',
    notes: 'Fasting from 8 AM required on day of dental.'
  },
  {
    id: 'apt-3',
    petId: 'pet-3',
    petName: 'Bella',
    ownerId: 'user-1',
    ownerName: 'Alex Morgan',
    vetId: 'vet-2',
    vetName: 'Dr. Marcus Vance, DVM',
    clinicName: 'Soundview Veterinary Hospital',
    date: '2026-07-14',
    time: '09:30 AM',
    reason: 'Allergy Evaluation & Skin Check',
    status: 'Completed',
    notes: 'Prescribed Apoquel and hypoallergenic shampoo regimen.'
  }
];

export const MOCK_ADOPTION_APPLICATIONS = [
  {
    id: 'app-1',
    petId: 'pet-1',
    petName: 'Luna',
    petBreed: 'Golden Retriever',
    petImage: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80',
    applicantId: 'user-1',
    applicantName: 'Alex Morgan',
    applicantEmail: 'adopter@pethaven.com',
    applicantPhone: '+1 (555) 234-5678',
    homeType: 'House with Fenced Yard',
    ownership: 'Own',
    familyMembers: 2,
    hasChildren: false,
    hasOtherPets: false,
    petExperience: 'Over 8 years with Labrador Retrievers',
    monthlyBudget: '$200 - $300',
    adoptionReason: 'Looking for a loyal adventure buddy for weekend hikes and daily morning runs.',
    status: 'Under Review', // Pending, Under Review, Approved, Rejected, Completed
    submittedDate: '2026-08-10',
    shelterNotes: 'Home inspection scheduled. High compatibility score.'
  },
  {
    id: 'app-2',
    petId: 'pet-2',
    petName: 'Milo',
    petBreed: 'British Shorthair',
    petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80',
    applicantId: 'user-2',
    applicantName: 'Sarah Jenkins',
    applicantEmail: 'owner@pethaven.com',
    applicantPhone: '+1 (555) 345-6789',
    homeType: 'Spacious Apartment',
    ownership: 'Rent (Pet-friendly)',
    familyMembers: 1,
    hasChildren: false,
    hasOtherPets: true,
    petExperience: 'Current cat owner for 5 years',
    monthlyBudget: '$150 - $250',
    adoptionReason: 'Want a peaceful companion for my existing friendly cat.',
    status: 'Approved',
    submittedDate: '2026-08-04',
    shelterNotes: 'Landlord approval verified. Ready for adoption finalization.'
  },
  {
    id: 'app-3',
    petId: 'pet-5',
    petName: 'Rocky',
    petBreed: 'German Shepherd Mix',
    petImage: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=200&auto=format&fit=crop&q=80',
    applicantId: 'user-6',
    applicantName: 'David Miller',
    applicantEmail: 'david.m@example.com',
    applicantPhone: '+1 (555) 678-9012',
    homeType: 'Townhouse',
    ownership: 'Rent',
    familyMembers: 3,
    hasChildren: true,
    hasOtherPets: false,
    petExperience: 'First-time large dog owner',
    monthlyBudget: '$100 - $150',
    adoptionReason: 'Family guard dog and companion.',
    status: 'Pending',
    submittedDate: '2026-08-14',
    shelterNotes: 'Reviewing experience level with high-drive shepherd breeds.'
  }
];

export const MOCK_HEALTH_PASSPORTS = {
  'pet-1': {
    petId: 'pet-1',
    petName: 'Luna',
    species: 'Canine',
    breed: 'Golden Retriever',
    dateOfBirth: '2024-02-14',
    gender: 'Female (Spayed)',
    microchipId: '985141002348911',
    bloodType: 'DEA 1.1 Negative',
    primaryVet: 'Dr. Emily Stone, DVM',
    allergies: ['Chicken meal (mild skin itch)', 'Pollen (seasonal)'],
    surgeries: [
      { date: '2024-09-10', procedure: 'Spay & Microchip Implantation', clinic: 'Greenwood Vet', surgeon: 'Dr. Stone' }
    ],
    dewormingSchedule: [
      { date: '2026-05-15', medication: 'Milbemax (Broad spectrum)', nextDue: '2026-08-15', status: 'Completed' },
      { date: '2026-08-15', medication: 'Milbemax', nextDue: '2026-11-15', status: 'Upcoming' }
    ],
    weightHistory: [
      { date: '2025-02-10', weightKg: 24.5 },
      { date: '2025-06-12', weightKg: 26.2 },
      { date: '2025-10-18', weightKg: 27.8 },
      { date: '2026-02-05', weightKg: 28.5 },
      { date: '2026-06-20', weightKg: 28.5 }
    ],
    medicalRecords: [
      {
        id: 'mr-1',
        date: '2026-02-05',
        title: 'Comprehensive Annual Wellness Exam',
        doctor: 'Dr. Emily Stone, DVM',
        diagnosis: 'Healthy adult canine. Ideal body condition score (5/9). Clean ears, heart normal (HR: 92bpm).',
        prescriptions: ['Heartgard Plus (Monthly)', 'NexGard Chewables (Monthly)'],
        notes: 'Advised maintaining 45 mins daily aerobic exercise.'
      },
      {
        id: 'mr-2',
        date: '2025-08-20',
        title: 'Ear Cytology & Clean',
        doctor: 'Dr. Emily Stone, DVM',
        diagnosis: 'Mild yeast otitis in right ear following lake swim.',
        prescriptions: ['Posatex Otic Drops (7 days)'],
        notes: 'Resolved on follow up.'
      }
    ],
    ownerHistory: [
      { ownerName: 'Happy Paws Rescue (Intake)', from: '2025-01-10', to: 'Present' }
    ]
  }
};

export const MOCK_LOST_FOUND = [
  {
    id: 'lf-1',
    type: 'Lost', // Lost, Found
    petName: 'Buster',
    species: 'Dog',
    breed: 'Beagle / Hound Mix',
    gender: 'Male',
    color: 'Tan & White with black saddle',
    lastSeenDate: '2026-08-13',
    lastSeenLocation: 'Green Lake Park near East Beach, Seattle, WA',
    reward: '$200',
    contactName: 'Jessica Taylor',
    contactPhone: '+1 (555) 777-8899',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80',
    description: 'Wearing a red reflective collar with brass tag. Very friendly but easily spooked by loud sirens. Please call immediately if seen!',
    status: 'Active'
  },
  {
    id: 'lf-2',
    type: 'Found',
    petName: 'Unknown (Sweet Calico)',
    species: 'Cat',
    breed: 'Domestic Shorthair',
    gender: 'Female',
    color: 'Calico (White, Orange, Black)',
    lastSeenDate: '2026-08-14',
    lastSeenLocation: 'Near 15th Ave & Pine St, Capitol Hill, Seattle',
    reward: null,
    contactName: 'Brian Davies',
    contactPhone: '+1 (555) 444-2211',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&auto=format&fit=crop&q=80',
    description: 'Found resting on front porch. Wearing no collar, very clean and friendly. Currently safe indoors at finder’s home. Taking to vet for microchip scan.',
    status: 'Active'
  },
  {
    id: 'lf-3',
    type: 'Lost',
    petName: 'Shadow',
    species: 'Cat',
    breed: 'Black Bombay Mix',
    gender: 'Male',
    color: 'Solid Black with green eyes',
    lastSeenDate: '2026-08-11',
    lastSeenLocation: 'Queen Anne Hill, 6th Ave W',
    reward: '$150',
    contactName: 'Claire Watson',
    contactPhone: '+1 (555) 888-3344',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
    description: 'Microchipped. Escaped through balcony door. Shy around strangers.',
    status: 'Active'
  }
];

export const MOCK_LEARNING_ARTICLES = [
  {
    id: 'learn-1',
    title: 'The Essential First 30 Days: New Puppy Transition Guide',
    category: 'Puppy Care',
    readTime: '6 min read',
    difficulty: 'Beginner',
    author: 'Dr. Emily Stone, DVM',
    date: '2026-07-28',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Step-by-step guidance on crate acclimation, potty training schedules, nutrition balance, and stress-free socialization.',
    content: `Welcoming a new puppy into your family is one of life’s greatest joys, but the first month establishes behavioral foundations that last a lifetime.

### Week 1: Safe Havens & Decompression
Keep the environment calm and predictable. Set up a cozy crate in a quiet corner with a warm blanket and safe chew toys. Avoid hosting large gatherings in the first week to allow your puppy to bond with core family members.

### Nutrition and Hydration
Feed a high-quality, age-appropriate puppy kibble divided into 3 equal meals daily. Ensure continuous access to clean, fresh water.

### Routine is Key
Establish fixed potty break times: immediately upon waking, 15 minutes after each meal, and before bedtime. Reward immediately with praise and a small healthy treat when they eliminate outside.`
  },
  {
    id: 'learn-2',
    title: 'Understanding Feline Body Language & Subtle Stress Signs',
    category: 'Cat Care',
    readTime: '5 min read',
    difficulty: 'Intermediate',
    author: 'Dr. Sophia Patel, DVM',
    date: '2026-08-02',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Learn to decode ear angles, tail swishes, slow blinks, and silent indicators of feline comfort versus hidden anxiety.',
    content: `Cats communicate primarily through nuanced postures, micro-movements, and vocal modulations.

### The Slow Blink of Trust
When a cat looks at you and slowly closes and opens its eyes, it is the feline equivalent of a warm hug. Returning a slow blink helps reassure nervous cats.

### The Tell-Tale Tail
- **High upright with question mark hook:** Happy, confident, inviting interaction.
- **Thumping or rapid twitching:** Overstimulated or agitated; pause petting immediately.
- **Tucked beneath body:** Fearful or submissive.`
  },
  {
    id: 'learn-3',
    title: 'Core vs. Non-Core Vaccines: What Every Pet Guardian Should Know',
    category: 'Vaccination',
    readTime: '8 min read',
    difficulty: 'Essential',
    author: 'Dr. Marcus Vance, DVM',
    date: '2026-08-08',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80',
    excerpt: 'A comprehensive medical breakdown of mandatory rabies, DHPP/FVRCP cores, lifestyle-specific bordetella, and Lyme protections.',
    content: `Vaccines prevent life-threatening viral infections by stimulating maternal and acquired antibodies.

### Canine Core Vaccines
- **Rabies:** Legally required in most regions to protect both pet and human public health.
- **DHPP:** Protects against Distemper, Infectious Hepatitis, Parvovirus, and Parainfluenza.

### Non-Core (Lifestyle Dependent)
- **Bordetella & Canine Flu:** Vital for pets attending dog daycare, boarding, or grooming salons.
- **Lyme Disease & Leptospirosis:** Essential for dogs living near wooded or marshy areas.`
  },
  {
    id: 'learn-4',
    title: 'Pet Nutrition Demystified: Wet vs. Dry & Calculating Daily Portions',
    category: 'Nutrition',
    readTime: '7 min read',
    difficulty: 'All Levels',
    author: 'PetHaven Veterinary Panel',
    date: '2026-08-12',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&auto=format&fit=crop&q=80',
    excerpt: 'How to calculate Resting Energy Requirements (RER), evaluate crude protein labels, and balance hydration with mixed feeding.',
    content: `Feeding your pet isn't just about scooping kibble into a bowl—it's precision fuel for longevity, joint resilience, and immune strength.

### Daily Calorie Formula
Resting Energy Requirement (RER) in kcal/day = 70 * (Body Weight in kg)^0.75.
Adjust for activity multipliers (1.6x for neutered adult dogs, 1.2x for indoor cats).`
  }
];

export const MOCK_COMMUNITY_POSTS = [
  {
    id: 'post-1',
    authorName: 'Alex Morgan',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    role: 'Adopter',
    petName: 'Luna',
    timeAgo: '2 hours ago',
    content: 'First weekend hike at Mount Si with our rescue pup! She conquered the switchbacks with so much joy and made five new dog friends at the summit. Adopt, don’t shop! 🐾❤️',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80',
    likes: 48,
    isLiked: false,
    comments: [
      { id: 'c-1', user: 'Dr. Emily Stone', text: 'She looks in peak physical condition! Keep up the great trail hydration.', timeAgo: '1 hour ago' },
      { id: 'c-2', user: 'Sarah Jenkins', text: 'Such an inspiring rescue story! Golden smiles are the best.', timeAgo: '45 mins ago' }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Happy Paws Rescue',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    role: 'ShelterManager',
    petName: 'Barnaby & Friends',
    timeAgo: '1 day ago',
    content: 'Weekend Adoption Fair announcement! We have 15 lovable cats, 8 playful puppies, and sweet rabbits looking for warm forever homes this Saturday from 11 AM - 4 PM. Pre-apply online to expedite adoption!',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
    likes: 92,
    isLiked: true,
    comments: [
      { id: 'c-3', user: 'Michael Chang', text: 'Will be there with my family!', timeAgo: '18 hours ago' }
    ]
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'user-1',
    title: 'Adoption Application Status Updated',
    message: 'Your adoption request for Luna is now Under Review by Happy Paws Rescue.',
    type: 'adoption',
    read: false,
    createdAt: '10 mins ago',
    link: '/adopter/applications'
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    title: 'Upcoming Vaccination Alert',
    message: 'Luna is due for Rabies 3-Year booster on August 20, 2026.',
    type: 'vaccination',
    read: false,
    createdAt: '2 hours ago',
    link: '/vaccinations'
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    title: 'Appointment Confirmed',
    message: 'Vet visit with Dr. Emily Stone confirmed for Aug 20 at 10:30 AM.',
    type: 'appointment',
    read: true,
    createdAt: '1 day ago',
    link: '/appointments'
  },
  {
    id: 'notif-4',
    userId: 'user-3',
    title: 'New Adoption Application Submitted',
    message: 'David Miller submitted an adoption application for Rocky (Shepherd Mix).',
    type: 'adoption',
    read: false,
    createdAt: '3 hours ago',
    link: '/shelter/adoptions'
  }
];

export const MOCK_ANALYTICS = {
  summary: {
    totalPets: 184,
    availablePets: 98,
    successfulAdoptions: 86,
    totalShelters: 14,
    totalVeterinarians: 32,
    totalUsers: 1420,
    activeAppointments: 46,
    vaccinationsCompleted: 512
  },
  monthlyAdoptions: [
    { month: 'Jan', adoptions: 18, inquiries: 45 },
    { month: 'Feb', adoptions: 24, inquiries: 60 },
    { month: 'Mar', adoptions: 31, inquiries: 78 },
    { month: 'Apr', adoptions: 28, inquiries: 65 },
    { month: 'May', adoptions: 38, inquiries: 89 },
    { month: 'Jun', adoptions: 42, inquiries: 104 },
    { month: 'Jul', adoptions: 49, inquiries: 120 },
    { month: 'Aug', adoptions: 54, inquiries: 135 }
  ],
  speciesDistribution: [
    { name: 'Dogs', value: 92, color: '#0d9488' },
    { name: 'Cats', value: 64, color: '#f59e0b' },
    { name: 'Rabbits', value: 16, color: '#8b5cf6' },
    { name: 'Birds', value: 12, color: '#ec4899' }
  ],
  shelterPerformance: [
    { name: 'Happy Paws', intake: 60, adopted: 48, rate: '80%' },
    { name: 'NW Sanctuary', intake: 80, adopted: 64, rate: '80%' },
    { name: 'Cascade Animals', intake: 45, adopted: 39, rate: '86%' },
    { name: 'Sound Pet Rescue', intake: 50, adopted: 41, rate: '82%' }
  ]
};
