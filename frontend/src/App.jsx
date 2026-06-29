import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import Home from "./pages/Home/Home";
import AnnouncementDetails from "./pages/AnnouncementDetails";
import About from "./pages/About/About";
import Teachers from "./pages/Teachers/Teachers";
import TeacherProfile from "./pages/TeacherProfile/TeacherProfile";
import PublicationDetail from "./pages/TeacherProfile/PublicationDetail";
import Courses from "./pages/Courses/Courses";
import CourseDetail from "./pages/Courses/CourseDetail";
import Login from "./pages/Login";
import AddPublication from "./pages/AddPublication";
import EventsPage from "./pages/EventsPage";
import PublicationsPage from "./pages/PublicationsPage";
import CertificatesPage from "./pages/certificates/CertificatesPage";
import ResearchPage from "./pages/ResearchPage";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import TeacherRoute from "./components/TeacherRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTopButton from "./components/ScrollToTopButton";

import { adminRoutes } from "./routes/adminRoutes";
import SearchResultsPage from "./pages/SearchResultsPage";
import TeacherCourseForm from "./pages/TeacherProfile/TeacherCourseForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="announcement/:slug" element={<AnnouncementDetails />} />
          <Route path="about" element={<About />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="teachers/:id" element={<TeacherProfile />} />
          <Route
            path="teacher/courses/create"
            element={
              <ProtectedRoute>
                <TeacherRoute>
                  <TeacherCourseForm />
                </TeacherRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="teacher/courses/:id/edit"
            element={
              <ProtectedRoute>
                <TeacherRoute>
                  <TeacherCourseForm />
                </TeacherRoute>
              </ProtectedRoute>
            }
          />
          <Route path="courses" element={<Courses />} />
          <Route path="course_detail/:code" element={<CourseDetail />} />
          <Route path="publications/:id" element={<PublicationDetail />} />

          <Route path="events" element={<EventsPage />} />
          <Route path="publications" element={<PublicationsPage />} />
          <Route path="certificates" element={<CertificatesPage />} />
          <Route path="research" element={<ResearchPage />} />
          <Route path="login" element={<Login />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route
            path="password-reset/:uidb64/:token"
            element={<ResetPassword />}
          />
          <Route path="search" element={<SearchResultsPage />} />

          <Route
            path="add-publication"
            element={
              <ProtectedRoute>
                <TeacherRoute>
                  <AddPublication />
                </TeacherRoute>
              </ProtectedRoute>
            }
          />
        </Route>

        {adminRoutes}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ScrollToTopButton />
    </BrowserRouter>
  );
}

export default App;
