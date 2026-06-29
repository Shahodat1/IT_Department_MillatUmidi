import React from "react";
import { Route } from "react-router-dom";

import AdminLayout from "../layout/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import TeachersAdmin from "../pages/admin/TeachersAdmin";
import CoursesAdmin from "../pages/admin/CoursesAdmin";

import GalleryItemsAdmin from "../pages/admin/GalleryItemsAdmin";
import EventsAdmin from "../pages/admin/EventsAdmin";
import AnnouncementsAdmin from "../pages/admin/AnnouncementsAdmin";
import CertificatesAdmin from "../pages/admin/CertificatesAdmin";
import StudentsAdmin from "../pages/admin/StudentsAdmin";
import DepartmentsAdmin from "../pages/admin/DepartmentsAdmin";
import PartnersAdmin from "../pages/admin/PartnersAdmin";
import SemesterAdmin from "../pages/admin/SemesterAdmin";
import StatisticsAdmin from "../pages/admin/StatisticsAdmin";

import AuditLogsAdmin from "../pages/admin/AuditLogsAdmin";

import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";
import PublicationAdmin from "../pages/admin/PublicationAdmin";

export const adminRoutes = (
  <Route
    path="admin-dashboard"
    element={
      <ProtectedRoute>
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      </ProtectedRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="teachers" element={<TeachersAdmin />} />
    <Route path="students" element={<StudentsAdmin />} />
    <Route path="courses" element={<CoursesAdmin />} />

    <Route path="gallery-items" element={<GalleryItemsAdmin />} />
    <Route path="departments" element={<DepartmentsAdmin />} />
    <Route path="events" element={<EventsAdmin />} />
    <Route path="announcements" element={<AnnouncementsAdmin />} />
    <Route path="certificates" element={<CertificatesAdmin />} />
    <Route path="partners" element={<PartnersAdmin />} />
    <Route path="statistics" element={<StatisticsAdmin />} />
    <Route path="semesters" element={<SemesterAdmin />} />

    <Route path="audit-logs" element={<AuditLogsAdmin />} />
    <Route
      path="/admin-dashboard/publications"
      element={<PublicationAdmin />}
    />
  </Route>
);
