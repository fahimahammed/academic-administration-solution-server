--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: BloodGroup; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BloodGroup" AS ENUM (
    'A_POSITIVE',
    'A_NEGATIVE',
    'B_POSITIVE',
    'B_NEGATIVE',
    'AB_POSITIVE',
    'AB_NEGATIVE',
    'O_POSITIVE',
    'O_NEGATIVE'
);


ALTER TYPE public."BloodGroup" OWNER TO postgres;

--
-- Name: ExamType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ExamType" AS ENUM (
    'MIDTERM',
    'FINAL'
);


ALTER TYPE public."ExamType" OWNER TO postgres;

--
-- Name: Gender; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Gender" AS ENUM (
    'MALE',
    'FEMALE',
    'OTHERS'
);


ALTER TYPE public."Gender" OWNER TO postgres;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CASH',
    'ONLINE'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'PARTIAL_PAID',
    'FULL_PAID'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: SemesterRegistrationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."SemesterRegistrationStatus" AS ENUM (
    'UPCOMING',
    'ONGOING',
    'ENDED'
);


ALTER TYPE public."SemesterRegistrationStatus" OWNER TO postgres;

--
-- Name: StudentEnrolledCourseStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."StudentEnrolledCourseStatus" AS ENUM (
    'ONGOING',
    'COMPLETED',
    'WITHDRAWN',
    'FAILED'
);


ALTER TYPE public."StudentEnrolledCourseStatus" OWNER TO postgres;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserRole" AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'STUDENT',
    'FACULTY'
);


ALTER TYPE public."UserRole" OWNER TO postgres;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'DELETED'
);


ALTER TYPE public."UserStatus" OWNER TO postgres;

--
-- Name: WeekDays; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."WeekDays" AS ENUM (
    'SATURDAY',
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY'
);


ALTER TYPE public."WeekDays" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Name: academic_departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academic_departments (
    id text NOT NULL,
    title text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "academicFacultyId" text
);


ALTER TABLE public.academic_departments OWNER TO postgres;

--
-- Name: academic_faculties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academic_faculties (
    id text NOT NULL,
    title text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public.academic_faculties OWNER TO postgres;

--
-- Name: academic_semesters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.academic_semesters (
    id text NOT NULL,
    title text NOT NULL,
    code text NOT NULL,
    year integer NOT NULL,
    "startMonth" text NOT NULL,
    "endMonth" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "isCurrent" boolean DEFAULT false
);


ALTER TABLE public.academic_semesters OWNER TO postgres;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id text NOT NULL,
    "userId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "middleName" text,
    "dateOfBirth" text,
    gender public."Gender" NOT NULL,
    "bloodGroup" public."BloodGroup" NOT NULL,
    email text NOT NULL,
    "contactNo" text NOT NULL,
    "emergencyContactNo" text NOT NULL,
    "presentAddress" text NOT NULL,
    "permanentAddress" text NOT NULL,
    designation text NOT NULL,
    "profileImage" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: buildings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buildings (
    id text NOT NULL,
    title text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public.buildings OWNER TO postgres;

--
-- Name: course_faculties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_faculties (
    "courseId" text NOT NULL,
    "facultyId" text NOT NULL
);


ALTER TABLE public.course_faculties OWNER TO postgres;

--
-- Name: course_to_prerequisites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_to_prerequisites (
    "courseId" text NOT NULL,
    "prerequisiteId" text NOT NULL
);


ALTER TABLE public.course_to_prerequisites OWNER TO postgres;

--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id text NOT NULL,
    title text NOT NULL,
    code text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    credits integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: faculties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faculties (
    id text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "middleName" text,
    "profileImage" text,
    email text NOT NULL,
    "contactNo" text NOT NULL,
    designation text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "academicDepartmentId" text NOT NULL,
    "academicFacultyId" text NOT NULL,
    gender public."Gender" NOT NULL,
    "bloodGroup" public."BloodGroup" NOT NULL,
    "userId" text NOT NULL,
    "emergencyContactNo" text NOT NULL,
    "permanentAddress" text NOT NULL,
    "presentAddress" text NOT NULL,
    "dateOfBirth" text NOT NULL
);


ALTER TABLE public.faculties OWNER TO postgres;

--
-- Name: offered_course_class_schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offered_course_class_schedules (
    id text NOT NULL,
    "dayOfWeek" public."WeekDays" DEFAULT 'SATURDAY'::public."WeekDays" NOT NULL,
    "startTime" text NOT NULL,
    "endTime" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "offeredCourseSectionId" text NOT NULL,
    "roomId" text NOT NULL,
    "facultyId" text NOT NULL,
    "semesterRegistrationId" text NOT NULL
);


ALTER TABLE public.offered_course_class_schedules OWNER TO postgres;

--
-- Name: offered_course_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offered_course_sections (
    id text NOT NULL,
    "maxCapacity" integer NOT NULL,
    "currentlyEnrolledStudent" integer DEFAULT 0,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "offeredCourseId" text NOT NULL,
    title text NOT NULL,
    "semesterRegistrationId" text NOT NULL
);


ALTER TABLE public.offered_course_sections OWNER TO postgres;

--
-- Name: offered_courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offered_courses (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "courseId" text NOT NULL,
    "semesterRegistrationId" text NOT NULL,
    "academicDepartmentId" text NOT NULL
);


ALTER TABLE public.offered_courses OWNER TO postgres;

--
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    id text NOT NULL,
    "roomNumber" text NOT NULL,
    floor text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "buildingId" text NOT NULL
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- Name: semester_registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.semester_registrations (
    id text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "academicSemesterId" text NOT NULL,
    status public."SemesterRegistrationStatus" DEFAULT 'UPCOMING'::public."SemesterRegistrationStatus",
    "maxCredit" integer DEFAULT 0 NOT NULL,
    "minCredit" integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.semester_registrations OWNER TO postgres;

--
-- Name: student_academic_infos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_academic_infos (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "studentId" text NOT NULL,
    cgpa double precision DEFAULT 0,
    "totalCompletedCredit" integer DEFAULT 0
);


ALTER TABLE public.student_academic_infos OWNER TO postgres;

--
-- Name: student_enrolled_course_marks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_enrolled_course_marks (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "studentId" text NOT NULL,
    "studentEnrolledCourseId" text NOT NULL,
    "academicSemesterId" text NOT NULL,
    grade text,
    marks integer DEFAULT 0,
    "examType" public."ExamType" DEFAULT 'MIDTERM'::public."ExamType"
);


ALTER TABLE public.student_enrolled_course_marks OWNER TO postgres;

--
-- Name: student_enrolled_courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_enrolled_courses (
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "studentId" text NOT NULL,
    "courseId" text NOT NULL,
    "academicSemesterId" text NOT NULL,
    grade text,
    point double precision DEFAULT 0,
    status public."StudentEnrolledCourseStatus" DEFAULT 'ONGOING'::public."StudentEnrolledCourseStatus",
    id text NOT NULL,
    "totalMarks" integer DEFAULT 0
);


ALTER TABLE public.student_enrolled_courses OWNER TO postgres;

--
-- Name: student_semester_payment_histories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_semester_payment_histories (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "studentSemesterPaymentId" text NOT NULL,
    "transactionId" text NOT NULL,
    "dueAmount" integer DEFAULT 0 NOT NULL,
    "paidAmount" integer DEFAULT 0 NOT NULL,
    "paymentMethod" public."PaymentMethod" DEFAULT 'ONLINE'::public."PaymentMethod",
    "isPaid" boolean DEFAULT false
);


ALTER TABLE public.student_semester_payment_histories OWNER TO postgres;

--
-- Name: student_semester_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_semester_payments (
    id text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "studentId" text NOT NULL,
    "academicSemesterId" text NOT NULL,
    "fullPaymentAmount" integer DEFAULT 0,
    "partialPaymentAmount" integer DEFAULT 0,
    "totalPaidAmount" integer DEFAULT 0,
    "totalDueAmount" integer DEFAULT 0,
    "paymentStatus" public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus"
);


ALTER TABLE public.student_semester_payments OWNER TO postgres;

--
-- Name: student_semester_registration_courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_semester_registration_courses (
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "semesterRegistrationId" text NOT NULL,
    "studentId" text NOT NULL,
    "offeredCourseId" text NOT NULL,
    "offeredCourseSectionId" text NOT NULL
);


ALTER TABLE public.student_semester_registration_courses OWNER TO postgres;

--
-- Name: student_semester_registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_semester_registrations (
    id text NOT NULL,
    "isConfirmed" boolean DEFAULT false,
    "totalCreditsTaken" integer DEFAULT 0,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "semesterRegistrationId" text NOT NULL,
    "studentId" text NOT NULL
);


ALTER TABLE public.student_semester_registrations OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "middleName" text NOT NULL,
    "profileImage" text,
    email text NOT NULL,
    "contactNo" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    "academicSemesterId" text NOT NULL,
    "academicDepartmentId" text NOT NULL,
    "academicFacultyId" text NOT NULL,
    gender public."Gender" NOT NULL,
    "bloodGroup" public."BloodGroup" NOT NULL,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "userId" text NOT NULL,
    "fatherContactNo" text NOT NULL,
    "fatherName" text NOT NULL,
    "fatherOccupation" text NOT NULL,
    "localGuardianAddress" text NOT NULL,
    "localGuardianContactNo" text NOT NULL,
    "localGuardianName" text NOT NULL,
    "localGuardianOccupation" text NOT NULL,
    "motherContactNo" text NOT NULL,
    "motherName" text NOT NULL,
    "motherOccupation" text NOT NULL,
    "permanentAddress" text NOT NULL,
    "presentAddress" text NOT NULL,
    "dateOfBirth" text NOT NULL,
    "emergencyContactNo" text NOT NULL
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    "userId" text NOT NULL,
    role public."UserRole" DEFAULT 'STUDENT'::public."UserRole" NOT NULL,
    password text NOT NULL,
    "needsPasswordChange" boolean DEFAULT true NOT NULL,
    "passwordResetToken" text,
    "passwordResetTokenExpires" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: academic_departments academic_departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_departments
    ADD CONSTRAINT academic_departments_pkey PRIMARY KEY (id);


--
-- Name: academic_faculties academic_faculties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_faculties
    ADD CONSTRAINT academic_faculties_pkey PRIMARY KEY (id);


--
-- Name: academic_semesters academic_semesters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_semesters
    ADD CONSTRAINT academic_semesters_pkey PRIMARY KEY (id);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: buildings buildings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buildings
    ADD CONSTRAINT buildings_pkey PRIMARY KEY (id);


--
-- Name: course_faculties course_faculties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_faculties
    ADD CONSTRAINT course_faculties_pkey PRIMARY KEY ("courseId", "facultyId");


--
-- Name: course_to_prerequisites course_to_prerequisites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_to_prerequisites
    ADD CONSTRAINT course_to_prerequisites_pkey PRIMARY KEY ("courseId", "prerequisiteId");


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: faculties faculties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT faculties_pkey PRIMARY KEY (id);


--
-- Name: offered_course_class_schedules offered_course_class_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offered_course_class_schedules
    ADD CONSTRAINT offered_course_class_schedules_pkey PRIMARY KEY (id);


--
-- Name: offered_course_sections offered_course_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offered_course_sections
    ADD CONSTRAINT offered_course_sections_pkey PRIMARY KEY (id);


--
-- Name: offered_courses offered_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offered_courses
    ADD CONSTRAINT offered_courses_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: semester_registrations semester_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_registrations
    ADD CONSTRAINT semester_registrations_pkey PRIMARY KEY (id);


--
-- Name: student_academic_infos student_academic_infos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_academic_infos
    ADD CONSTRAINT student_academic_infos_pkey PRIMARY KEY (id);


--
-- Name: student_enrolled_course_marks student_enrolled_course_marks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_enrolled_course_marks
    ADD CONSTRAINT student_enrolled_course_marks_pkey PRIMARY KEY (id);


--
-- Name: student_enrolled_courses student_enrolled_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_enrolled_courses
    ADD CONSTRAINT student_enrolled_courses_pkey PRIMARY KEY (id);


--
-- Name: student_semester_payment_histories student_semester_payment_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_semester_payment_histories
    ADD CONSTRAINT student_semester_payment_histories_pkey PRIMARY KEY (id);


--
-- Name: student_semester_payments student_semester_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_semester_payments
    ADD CONSTRAINT student_semester_payments_pkey PRIMARY KEY (id);


--
-- Name: student_semester_registration_courses student_semester_registration_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_semester_registration_courses
    ADD CONSTRAINT student_semester_registration_courses_pkey PRIMARY KEY ("semesterRegistrationId", "studentId", "offeredCourseId");


--
-- Name: student_semester_registrations student_semester_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_semester_registrations
    ADD CONSTRAINT student_semester_registrations_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: academic_departments_title_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX academic_departments_title_key ON public.academic_departments USING btree (title);


--
-- Name: academic_faculties_title_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX academic_faculties_title_key ON public.academic_faculties USING btree (title);


--
-- Name: admins_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX admins_email_key ON public.admins USING btree (email);


--
-- Name: admins_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "admins_userId_key" ON public.admins USING btree ("userId");


--
-- Name: faculties_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "faculties_userId_key" ON public.faculties USING btree ("userId");


--
-- Name: student_semester_payment_histories_transactionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "student_semester_payment_histories_transactionId_key" ON public.student_semester_payment_histories USING btree ("transactionId");


--
-- Name: students_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX students_email_key ON public.students USING btree (email);


--
-- Name: students_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "students_userId_key" ON public.students USING btree ("userId");


--
-- Name: users_userId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_userId_key" ON public.users USING btree ("userId");


--
-- Name: academic_departments academic_departments_academicFacultyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.academic_departments
    ADD CONSTRAINT "academic_departments_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES public.academic_faculties(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: admins admins_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users("userId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: course_faculties course_faculties_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_faculties
    ADD CONSTRAINT "course_faculties_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: course_faculties course_faculties_facultyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_faculties
    ADD CONSTRAINT "course_faculties_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES public.faculties(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: course_to_prerequisites course_to_prerequisites_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_to_prerequisites
    ADD CONSTRAINT "course_to_prerequisites_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: course_to_prerequisites course_to_prerequisites_prerequisiteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_to_prerequisites
    ADD CONSTRAINT "course_to_prerequisites_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: faculties faculties_academicDepartmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT "faculties_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES public.academic_departments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: faculties faculties_academicFacultyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT "faculties_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES public.academic_faculties(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: faculties faculties_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculties
    ADD CONSTRAINT "faculties_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users("userId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: offered_course_class_schedules offered_course_class_schedules_facultyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offered_course_class_schedules
    ADD CONSTRAINT "offered_course_class_schedules_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES public.faculties(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: offered_course_class_schedules offered_course_class_schedules_offeredCourseSectionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offered_course_class_schedules
    ADD CONSTRAINT "offered_course_class_schedules_offeredCourseSectionId_fkey" FOREIGN KEY ("offeredCourseSectionId") REFERENCES public.offered_course_sections(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: offered_course_class_schedules offered_course_class_schedules_roomId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offered_course_class_schedules
    ADD CONSTRAINT "offered_course_class_schedules_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES public.rooms(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: offered_course_class_schedules offered_course_class_schedules_semesterRegistrationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offered_course_class_schedules
    ADD CONSTRAINT "offered_course_class_schedules_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES public.semester_registrations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: offered_course_sections offered_course_sections_offeredCourseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offered_course_sections
    ADD CONSTRAINT "offered_course_sections_offeredCourseId_fkey" FOREIGN KEY ("offeredCourseId") REFERENCES public.offered_courses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: offered_course_sections offered_course_sections_semesterRegistrationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offered_course_sections
    ADD CONSTRAINT "offered_course_sections_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES public.semester_registrations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: offered_courses offered_courses_academicDepartmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offered_courses
    ADD CONSTRAINT "offered_courses_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES public.academic_departments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: offered_courses offered_courses_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offered_courses
    ADD CONSTRAINT "offered_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: offered_courses offered_courses_semesterRegistrationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offered_courses
    ADD CONSTRAINT "offered_courses_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES public.semester_registrations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: rooms rooms_buildingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT "rooms_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES public.buildings(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: semester_registrations semester_registrations_academicSemesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.semester_registrations
    ADD CONSTRAINT "semester_registrations_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES public.academic_semesters(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_academic_infos student_academic_infos_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_academic_infos
    ADD CONSTRAINT "student_academic_infos_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_enrolled_course_marks student_enrolled_course_marks_academicSemesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_enrolled_course_marks
    ADD CONSTRAINT "student_enrolled_course_marks_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES public.academic_semesters(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_enrolled_course_marks student_enrolled_course_marks_studentEnrolledCourseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_enrolled_course_marks
    ADD CONSTRAINT "student_enrolled_course_marks_studentEnrolledCourseId_fkey" FOREIGN KEY ("studentEnrolledCourseId") REFERENCES public.student_enrolled_courses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_enrolled_course_marks student_enrolled_course_marks_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_enrolled_course_marks
    ADD CONSTRAINT "student_enrolled_course_marks_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_enrolled_courses student_enrolled_courses_academicSemesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_enrolled_courses
    ADD CONSTRAINT "student_enrolled_courses_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES public.academic_semesters(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_enrolled_courses student_enrolled_courses_courseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_enrolled_courses
    ADD CONSTRAINT "student_enrolled_courses_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES public.courses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_enrolled_courses student_enrolled_courses_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_enrolled_courses
    ADD CONSTRAINT "student_enrolled_courses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_semester_payment_histories student_semester_payment_histories_studentSemesterPaymentI_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_semester_payment_histories
    ADD CONSTRAINT "student_semester_payment_histories_studentSemesterPaymentI_fkey" FOREIGN KEY ("studentSemesterPaymentId") REFERENCES public.student_semester_payments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_semester_payments student_semester_payments_academicSemesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_semester_payments
    ADD CONSTRAINT "student_semester_payments_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES public.academic_semesters(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_semester_payments student_semester_payments_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_semester_payments
    ADD CONSTRAINT "student_semester_payments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_semester_registration_courses student_semester_registration_courses_offeredCourseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_semester_registration_courses
    ADD CONSTRAINT "student_semester_registration_courses_offeredCourseId_fkey" FOREIGN KEY ("offeredCourseId") REFERENCES public.offered_courses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_semester_registration_courses student_semester_registration_courses_offeredCourseSection_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_semester_registration_courses
    ADD CONSTRAINT "student_semester_registration_courses_offeredCourseSection_fkey" FOREIGN KEY ("offeredCourseSectionId") REFERENCES public.offered_course_sections(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_semester_registration_courses student_semester_registration_courses_semesterRegistration_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_semester_registration_courses
    ADD CONSTRAINT "student_semester_registration_courses_semesterRegistration_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES public.semester_registrations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_semester_registration_courses student_semester_registration_courses_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_semester_registration_courses
    ADD CONSTRAINT "student_semester_registration_courses_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_semester_registrations student_semester_registrations_semesterRegistrationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_semester_registrations
    ADD CONSTRAINT "student_semester_registrations_semesterRegistrationId_fkey" FOREIGN KEY ("semesterRegistrationId") REFERENCES public.semester_registrations(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: student_semester_registrations student_semester_registrations_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_semester_registrations
    ADD CONSTRAINT "student_semester_registrations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: students students_academicDepartmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "students_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES public.academic_departments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: students students_academicFacultyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "students_academicFacultyId_fkey" FOREIGN KEY ("academicFacultyId") REFERENCES public.academic_faculties(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: students students_academicSemesterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "students_academicSemesterId_fkey" FOREIGN KEY ("academicSemesterId") REFERENCES public.academic_semesters(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: students students_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT "students_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users("userId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

