// frontend/src/pages/CoursePage.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import ProfessorCoursePage from './ProfessorCoursePage';
import StudentCoursePage from './StudentCoursePage';

function CoursePage() {
    const { user } = useAuth();

    if (user.role === 'professor') {
        return <ProfessorCoursePage />;
    } else {
        return <StudentCoursePage />;
    }
}

export default CoursePage;