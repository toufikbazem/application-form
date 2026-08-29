import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*  Server-side validation schemas                                            */
/*                                                                            */
/*  These mirror client/src/utils/Schema.ts and are the source of truth for   */
/*  what the API accepts. Keep the two in sync when fields change.            */
/* -------------------------------------------------------------------------- */

const ALGERIAN_NATIONALITY = "Algerian - جزائري";
const ALGERIA_COUNTRY = "Algeria - الجزائر";
const LANGUAGE_REQUIRED_MAJORS = ["cs", "scs", "ste", "ebm", "cse"];
// "fsa" is only offered to re-registering license students.
const RE_LIC_LANGUAGE_REQUIRED_MAJORS = [...LANGUAGE_REQUIRED_MAJORS, "fsa"];
const NEW_MAS_LANGUAGE_REQUIRED_MAJORS = ["csd", "csc", "mba"];
// "dgm" is only offered to re-registering master students.
const RE_MAS_LANGUAGE_REQUIRED_MAJORS = ["csd", "csc", "mba", "dgm"];
// High school name is only required for public/private schools.
const HIGH_SCHOOL_NAME_REQUIRED_TYPES = ["public - حكومية", "private - خاصة"];

const phoneRegex = /^(\+213|0)(5|6|7)[0-9]{8}$/;

// Re-registering students already hold a university-issued student ID. Only the
// re-registration variants collect it, so it lives on their major schemas.
const studentIdField = z
  .string()
  .trim()
  .min(4, "Student ID is required.")
  .max(20, "Student ID must be at most 20 characters.")
  .regex(/^[A-Za-z0-9-]+$/, "Enter a valid student ID.");

const optionalEmail = z
  .string()
  .email("Invalid email address.")
  .refine(
    (email) => !email.toLowerCase().endsWith("@icloud.com"),
    "iCloud email addresses are not allowed",
  );

/* ------------------------------- Personal -------------------------------- */

const PersonalInfoSchema = z
  .object({
    degree: z.string().optional(),
    type: z.string().optional(),
    firstName: z.string().min(2, "First Name is required."),
    lastName: z.string().min(2, "Last Name is required."),
    firstNameLatin: z.string().min(2, "First Name (Latin) is required."),
    lastNameLatin: z.string().min(2, "Last Name (Latin) is required."),
    gender: z.string().min(2, "Gender is required."),
    familyStatus: z.string().min(2, "Family Status is required."),
    nationality: z.string().min(2, "Nationality is required."),
    // NIN and dateOfExpiration are only required for Algerians; the
    // conditional requirement is enforced in the superRefine below.
    NIN: z.string().optional(),
    dateOfExpiration: z.union([z.string(), z.date()]).optional(),
    dateOfBirth: z
      .union([z.string(), z.date()])
      .refine((v) => v !== "" && v != null, "Date of Birth is required."),
    birthCountry: z.string().min(2, "Birth Country is required."),
    birthWillaya: z.string().optional(),
    birthCommune: z.string().optional(),
    birthAddress: z.string().optional(),
    residenceWillaya: z.string().min(1, "Residence Willaya is required."),
    residenceCommune: z.string().min(1, "Residence Commune is required."),
    residenceAddress: z.string().min(2, "Residence Address is required."),
    email: optionalEmail,
    phoneNumber1: z
      .string()
      .min(2, "Phone number is required.")
      .regex(phoneRegex, "Enter a valid phone number"),
    phoneNumber2: z
      .string()
      .min(2, "Phone number 2 is required.")
      .regex(phoneRegex, "Enter a valid phone number"),
    medicalCondition: z.string().min(2, "Medical Condition is required."),
  })
  .superRefine((data, ctx) => {
    // Algerians must provide a NIN and its expiration date.
    if (data.nationality === ALGERIAN_NATIONALITY) {
      if (!data.NIN || data.NIN.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["NIN"],
          message: "NIN is required.",
        });
      }
      if (!data.dateOfExpiration) {
        ctx.addIssue({
          code: "custom",
          path: ["dateOfExpiration"],
          message: "Date of Expiration is required.",
        });
      }
    }

    // Place of birth: inside Algeria -> willaya + commune; otherwise free address.
    if (data.birthCountry === ALGERIA_COUNTRY) {
      if (!data.birthWillaya) {
        ctx.addIssue({
          code: "custom",
          path: ["birthWillaya"],
          message: "Birth Willaya is required.",
        });
      }
      if (!data.birthCommune) {
        ctx.addIssue({
          code: "custom",
          path: ["birthCommune"],
          message: "Birth Commune is required.",
        });
      }
    } else if (data.birthCountry) {
      if (!data.birthAddress || data.birthAddress.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["birthAddress"],
          message: "Birth Address is required.",
        });
      }
    }
  });

/* ------------------------------- Academic -------------------------------- */

const LicAcademicInfoSchema = z
  .object({
    baccalaureateSeries: z
      .string()
      .min(1, "Baccalaureate Register Number is required."),
    baccalaureateYear: z.string().min(1, "Baccalaureate Year is required."),
    baccalaureateAverage: z
      .string()
      .min(1, "Baccalaureate Average is required."),
    baccalaureateMajor: z.string().min(1, "Baccalaureate Major is required."),
    mathematicsMark: z.string().min(1, "Mathematics Mark is required."),
    physicsMark: z.string().min(1, "Physics Mark is required."),
    highSchoolName: z.string().optional(),
    highSchoolType: z.string().min(1, "High School Type is required."),
    currentUniversity: z.string().optional(),
    currentUniversityYear: z.string().optional(),
    currentUniversityMajor: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      HIGH_SCHOOL_NAME_REQUIRED_TYPES.includes(data.highSchoolType) &&
      !data.highSchoolName
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["highSchoolName"],
        message: "High School Name is required.",
      });
    }
  });

const MasAcademicInfoSchema = z.object({
  currentUniversity: z.string().optional(),
  currentUniversityYear: z.string().optional(),
  currentUniversityMajor: z.string().optional(),
});

/* -------------------------------- Majors --------------------------------- */

const makeLanguageRefine = (languageRequiredMajors) => (data, ctx) => {
  const needsLanguage = (data.majors ?? []).some((id) =>
    languageRequiredMajors.includes(id),
  );
  if (needsLanguage && !data.language) {
    ctx.addIssue({
      code: "custom",
      path: ["language"],
      message: "Language of Study is required.",
    });
  }
};

const languageRefine = makeLanguageRefine(LANGUAGE_REQUIRED_MAJORS);

// New registration (license): exactly two majors; language required for some.
const NewMajorSchema = z
  .object({
    majors: z.array(z.string()).length(2, "Please select two majors."),
    language: z.string().optional(),
  })
  .superRefine(languageRefine);

// New registration (master): exactly two majors; language required for some.
const NewMasMajorSchema = z
  .object({
    majors: z.array(z.string()).length(2, "Please select two majors."),
    language: z.string().optional(),
  })
  .superRefine(makeLanguageRefine(NEW_MAS_LANGUAGE_REQUIRED_MAJORS));

// Re-registration (license): exactly one major; language required for some.
// The student ID is collected on this step too.
const ReLicMajorSchema = z
  .object({
    majors: z.array(z.string()).length(1, "Please select one major."),
    language: z.string().optional(),
    studentId: studentIdField,
  })
  .superRefine(makeLanguageRefine(RE_LIC_LANGUAGE_REQUIRED_MAJORS));

// Re-registration (master): exactly one major; language required for some.
// The student ID is collected on this step too.
const ReMasMajorSchema = z
  .object({
    majors: z.array(z.string()).length(1, "Please select one major."),
    language: z.string().optional(),
    studentId: studentIdField,
  })
  .superRefine(makeLanguageRefine(RE_MAS_LANGUAGE_REQUIRED_MAJORS));

/* -------------------------------- Parents -------------------------------- */

const LicParentsInfoSchema = z.object({
  fatherFirstName: z.string().min(1, "Father's First Name is required."),
  fatherOccupation: z.string().optional(),
  fatherPhoneNumber: z
    .string()
    .min(10, "Father's Phone Number is required.")
    .regex(phoneRegex, "Enter a valid phone number"),
  fatherEmail: z.literal("").or(optionalEmail),
  motherFirstName: z.string().min(1, "Mother's First Name is required."),
  motherLastName: z.string().min(1, "Mother's Last Name is required."),
  motherOccupation: z.string().optional(),
  guardianFullName: z.string().min(1, "Guardian's Full Name is required."),
  guardianRelationship: z.string().min(1, "Relationship is required."),
  guardianEmail: optionalEmail,
  guardianPhoneNumber: z
    .string()
    .min(10, "Guardian's Phone Number is required.")
    .regex(phoneRegex, "Enter a valid phone number"),
});

const MasParentsInfoSchema = z.object({
  guardianFullName: z.string().min(1, "Guardian's Full Name is required."),
  guardianRelationship: z.string().min(1, "Relationship is required."),
  guardianAddress: z.string().min(1, "Guardian's Address is required."),
  guardianEmail: z.string().email("Invalid email address."),
  guardianPhoneNumber: z
    .string()
    .min(10, "Guardian's Phone Number is required."),
});

/* -------------------------- Per-variant schemas -------------------------- */

const NewLicenseSchema = PersonalInfoSchema.and(LicAcademicInfoSchema)
  .and(NewMajorSchema)
  .and(LicParentsInfoSchema);

const NewMasterSchema = PersonalInfoSchema.and(MasAcademicInfoSchema)
  .and(NewMasMajorSchema)
  .and(MasParentsInfoSchema);

const ReLicenseSchema = PersonalInfoSchema.and(ReLicMajorSchema);

const ReMasterSchema = PersonalInfoSchema.and(ReMasMajorSchema);

/**
 * Resolves the schema for an incoming request from its `type` + `degree`.
 * Returns undefined when the combination is not recognised.
 */
export const schemaForVariant = (type, degree) => {
  const key = `${type}:${degree}`;
  return {
    "newRegistration:license": NewLicenseSchema,
    "newRegistration:master": NewMasterSchema,
    "reRegistration:license": ReLicenseSchema,
    "reRegistration:master": ReMasterSchema,
  }[key];
};
