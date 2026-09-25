import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from '../layouts/MainLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Guard
import { ProtectedRoute } from './ProtectedRoute';
import { USER_ROLES } from '../utils/constants';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { PetListingPage } from '../pages/public/PetListingPage';
import { PetDetailPage } from '../pages/public/PetDetailPage';
import { PetHealthPassportPage } from '../pages/public/PetHealthPassportPage';
import { VetListingPage } from '../pages/public/VetListingPage';
import { VaccinationsPage } from '../pages/public/VaccinationsPage';
import { AppointmentsPage } from '../pages/public/AppointmentsPage';
import { AIRecommendationPage } from '../pages/public/AIRecommendationPage';
import { FoodRecommendationPage } from '../pages/public/FoodRecommendationPage';
import { LostFoundPage } from '../pages/public/LostFoundPage';
import { LearningHubPage } from '../pages/public/LearningHubPage';
import { ArticleDetailPage } from '../pages/public/ArticleDetailPage';
import { CommunityPage } from '../pages/public/CommunityPage';
import { AboutPage } from '../pages/public/AboutPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Auth Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';

// Adopter Pages
import { AdopterDashboard } from '../pages/adopter/AdopterDashboard';
import { AdopterFavoritesPage } from '../pages/adopter/AdopterFavoritesPage';
import { AdopterApplicationsPage } from '../pages/adopter/AdopterApplicationsPage';
import { AdopterAppointmentsPage } from '../pages/adopter/AdopterAppointmentsPage';
import { AdopterProfilePage } from '../pages/adopter/AdopterProfilePage';

// Owner Pages
import { OwnerDashboard } from '../pages/owner/OwnerDashboard';
import { OwnerPetsPage } from '../pages/owner/OwnerPetsPage';
import { OwnerVaccinationsPage } from '../pages/owner/OwnerVaccinationsPage';
import { OwnerAppointmentsPage } from '../pages/owner/OwnerAppointmentsPage';

// Shelter Pages
import { ShelterDashboard } from '../pages/shelter/ShelterDashboard';
import { ShelterPetsPage } from '../pages/shelter/ShelterPetsPage';
import { ShelterAdoptionsPage } from '../pages/shelter/ShelterAdoptionsPage';
import { ShelterVaccinationsPage } from '../pages/shelter/ShelterVaccinationsPage';
import { ShelterReportsPage } from '../pages/shelter/ShelterReportsPage';

// Veterinarian Pages
import { VetDashboard } from '../pages/veterinarian/VetDashboard';
import { VetAppointmentsPage } from '../pages/veterinarian/VetAppointmentsPage';
import { VetPatientsPage } from '../pages/veterinarian/VetPatientsPage';
import { VetMedicalRecordsPage } from '../pages/veterinarian/VetMedicalRecordsPage';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminSheltersPage } from '../pages/admin/AdminSheltersPage';
import { AdminVetsPage } from '../pages/admin/AdminVetsPage';
import { AdminPetsPage } from '../pages/admin/AdminPetsPage';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages in MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/pets" element={<PetListingPage />} />
        <Route path="/pets/:id" element={<PetDetailPage />} />
        <Route path="/pets/:id/health" element={<PetHealthPassportPage />} />
        <Route path="/passport" element={<PetHealthPassportPage />} />
        <Route path="/passport/:id" element={<PetHealthPassportPage />} />
        <Route path="/vets" element={<VetListingPage />} />
        <Route path="/vaccinations" element={<VaccinationsPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/recommendations" element={<AIRecommendationPage />} />
        <Route path="/food-recommendation" element={<FoodRecommendationPage />} />
        <Route path="/lost-found" element={<LostFoundPage />} />
        <Route path="/learning" element={<LearningHubPage />} />
        <Route path="/learning/:id" element={<ArticleDetailPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Auth Pages in AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<Navigate to="/" replace />} />
      </Route>

      {/* Adopter Role Protected Routes */}
      <Route
        path="/adopter"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADOPTER]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/adopter/dashboard" replace />} />
        <Route path="dashboard" element={<AdopterDashboard />} />
        <Route path="favorites" element={<AdopterFavoritesPage />} />
        <Route path="applications" element={<AdopterApplicationsPage />} />
        <Route path="appointments" element={<AdopterAppointmentsPage />} />
        <Route path="profile" element={<AdopterProfilePage />} />
      </Route>

      {/* Pet Owner Role Protected Routes */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.PET_OWNER]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="pets" element={<OwnerPetsPage />} />
        <Route path="vaccinations" element={<OwnerVaccinationsPage />} />
        <Route path="appointments" element={<OwnerAppointmentsPage />} />
      </Route>

      {/* Legacy Shelter routes redirected to Admin Dashboard & Sub-pages */}
      <Route path="/shelter">
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="pets" element={<Navigate to="/admin/pets" replace />} />
        <Route path="adoptions" element={<Navigate to="/admin/adoptions" replace />} />
        <Route path="vaccinations" element={<Navigate to="/admin/vaccinations" replace />} />
        <Route path="reports" element={<Navigate to="/admin/reports" replace />} />
      </Route>

      {/* Veterinarian Role Protected Routes */}
      <Route
        path="/veterinarian"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.VETERINARIAN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/veterinarian/dashboard" replace />} />
        <Route path="dashboard" element={<VetDashboard />} />
        <Route path="appointments" element={<VetAppointmentsPage />} />
        <Route path="patients" element={<VetPatientsPage />} />
        <Route path="medical-records" element={<VetMedicalRecordsPage />} />
      </Route>

      {/* Administrator & Shelter Management Unified Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[USER_ROLES.ADMINISTRATOR]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="pets" element={<AdminPetsPage />} />
        <Route path="adoptions" element={<ShelterAdoptionsPage />} />
        <Route path="vaccinations" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="shelters" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="veterinarians" element={<AdminVetsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
      </Route>
    </Routes>
  );
};
