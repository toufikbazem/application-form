import { z } from "zod";

/* -------------------------------------------------------------------------- */
/*  Per-step schemas                                                          */
/* -------------------------------------------------------------------------- */

// Allowed values for the welcome screen selection. Kept in sync with the
// buttons in WelcomePage and the routing in ApplicationForm.
export const DEGREE_VALUES = ["license", "master"] as const;
export const TYPE_VALUES = ["newRegistration", "reRegistration"] as const;

// Welcome screen: a degree level and a registration type must both be chosen
// before the applicant can start the form.
export const WelcomeSchema = z.object({
  degree: z.enum(DEGREE_VALUES, {
    error: "Please select a degree level.",
  }),
  type: z.enum(TYPE_VALUES, {
    error: "Please select a registration type.",
  }),
});

export type WelcomeErrors = {
  degree?: string;
  type?: string;
};

// Algerian nationality value used across the form (stored in arabic).
const ALGERIAN_NATIONALITY = "Algerian - جزائري";
const ALGERIA_COUNTRY = "Algeria - الجزائر";
// Medical condition value that prompts a free-text description.
const OTHER_MEDICAL_CONDITION = "Other - أخر";
// Major ids that require choosing a language of study (license).
const LANGUAGE_REQUIRED_MAJORS = ["cs", "scs", "ste", "ebm", "cse"];
// Major ids that require choosing a language of study (new master).
const NEW_MAS_LANGUAGE_REQUIRED_MAJORS = ["csd", "csc", "mba"];
// Major ids that require choosing a language of study (re master).
const RE_MAS_LANGUAGE_REQUIRED_MAJORS = ["csd", "csc", "mba"];

export const PersonalInfoSchema = z
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
    email: z
      .string()
      .email("Invalid email address.")
      .refine(
        (email) => !email.toLowerCase().endsWith("@icloud.com"),
        "iCloud email addresses are not allowed",
      ),
    phoneNumber1: z
      .string()
      .min(2, "Phone number is required.")
      .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number"),
    phoneNumber2: z
      .string()
      .min(2, "Phone number 2 is required.")
      .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number"),
    medicalCondition: z.string().min(2, "Medical Condition is required."),
    medicalConditionOther: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // When "Other" is selected the applicant must describe their condition.
    if (data.medicalCondition === OTHER_MEDICAL_CONDITION) {
      if (
        !data.medicalConditionOther ||
        data.medicalConditionOther.length < 2
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["medicalConditionOther"],
          message: "Please describe your medical condition.",
        });
      }
    }

    // Algerians must provide a NIN and its expiration date.
    if (data.nationality === ALGERIAN_NATIONALITY) {
      if (!data.NIN || data.NIN.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["NIN"],
          message: "NIN is required.",
        });
      }
      if (!data.dateOfExpiration) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dateOfExpiration"],
          message: "Date of Expiration is required.",
        });
      }
    }

    // Place of birth: inside Algeria -> willaya + commune; otherwise free address.
    if (data.birthCountry === ALGERIA_COUNTRY) {
      if (!data.birthWillaya) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["birthWillaya"],
          message: "Birth Willaya is required.",
        });
      }
      if (!data.birthCommune) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["birthCommune"],
          message: "Birth Commune is required.",
        });
      }
    } else if (data.birthCountry) {
      if (!data.birthAddress || data.birthAddress.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["birthAddress"],
          message: "Birth Address is required.",
        });
      }
    }
  });

// High school name is only required for public/private schools, not for
// baccalaureate libre or BAC ONEFD candidates.
const HIGH_SCHOOL_NAME_REQUIRED_TYPES = ["public - حكومية", "private - خاصة"];

// Equivalence Certificate holders did not sit the Algerian baccalaureate, so
// the bac-specific fields are not collected/required for them.
const EQUIVALENCE_BAC_MAJOR = "EQUIVALENCE - شهادة معادلة";

// Full academic step (license): baccalaureate details + optional university info.
export const LicAcademicInfoSchema = z
  .object({
    baccalaureateSeries: z.string().optional(),
    baccalaureateYear: z.string().optional(),
    baccalaureateAverage: z.string().optional(),
    baccalaureateMajor: z.string().min(1, "Baccalaureate Major is required."),
    mathematicsMark: z.string().optional(),
    physicsMark: z.string().optional(),
    highSchoolName: z.string().optional(),
    highSchoolType: z.string().optional(),
    currentUniversity: z.string().optional(),
    currentUniversityYear: z.string().optional(),
    currentUniversityMajor: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Equivalence Certificate: skip all bac-specific requirements.
    if (data.baccalaureateMajor !== EQUIVALENCE_BAC_MAJOR) {
      const requiredBacFields: [keyof typeof data, string][] = [
        ["baccalaureateSeries", "Baccalaureate Register Number is required."],
        ["baccalaureateYear", "Baccalaureate Year is required."],
        ["baccalaureateAverage", "Baccalaureate Average is required."],
        ["mathematicsMark", "Mathematics Mark is required."],
        ["physicsMark", "Physics Mark is required."],
        ["highSchoolType", "High School Type is required."],
      ];
      for (const [field, message] of requiredBacFields) {
        if (!data[field]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message,
          });
        }
      }

      if (
        HIGH_SCHOOL_NAME_REQUIRED_TYPES.includes(data.highSchoolType ?? "") &&
        !data.highSchoolName
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["highSchoolName"],
          message: "High School Name is required.",
        });
      }
    }
  });

// Slim academic step (master): license info + current university info.
export const MasAcademicInfoSchema = z.object({
  licenseUniversity: z.string().min(2, "License University is required."),
  licenseYear: z.string().min(1, "License Year is required."),
  licenseMajor: z.string().min(1, "License Major is required."),
  currentUniversity: z.string().optional(),
  currentUniversityYear: z.string().optional(),
  currentUniversityMajor: z.string().optional(),
});

// Major selection lives in form state as an array of major ids. New
// registrations require two ranked choices; re-registrations require one.
const makeLanguageRefine =
  (languageRequiredMajors: string[]) =>
  (data: { majors?: string[]; language?: string }, ctx: z.RefinementCtx) => {
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
export const NewMajorSchema = z
  .object({
    majors: z
      .array(z.string())
      .length(2, "Please select two majors.")
      .default([]),
    language: z.string().optional(),
  })
  .superRefine(languageRefine);

// New registration (master): exactly two majors; language required for some.
export const NewMasMajorSchema = z
  .object({
    majors: z
      .array(z.string())
      .length(2, "Please select two majors.")
      .default([]),
    language: z.string().optional(),
  })
  .superRefine(makeLanguageRefine(NEW_MAS_LANGUAGE_REQUIRED_MAJORS));

// Re-registration (license): exactly one major; language required for some.
export const ReLicMajorSchema = z
  .object({
    majors: z
      .array(z.string())
      .length(1, "Please select one major.")
      .default([]),
    language: z.string().optional(),
  })
  .superRefine(languageRefine);

// Re-registration (master): exactly one major; language required for some.
export const ReMasMajorSchema = z
  .object({
    majors: z
      .array(z.string())
      .length(1, "Please select one major.")
      .default([]),
    language: z.string().optional(),
  })
  .superRefine(makeLanguageRefine(RE_MAS_LANGUAGE_REQUIRED_MAJORS));

// Full parents step (license): father + mother + guardian.
export const LicParentsInfoSchema = z.object({
  fatherFirstName: z.string().min(1, "Father's First Name is required."),
  fatherOccupation: z.string().min(1, "Father's Occupation is required."),
  fatherPhoneNumber: z
    .string()
    .min(10, "Father's Phone Number is required.")
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number"),
  fatherEmail: z.literal("").or(
    z
      .string()
      .email("Invalid email address.")
      .refine(
        (email) => !email.toLowerCase().endsWith("@icloud.com"),
        "iCloud email addresses are not allowed",
      ),
  ),
  motherFirstName: z.string().min(1, "Mother's First Name is required."),
  motherLastName: z.string().min(1, "Mother's Last Name is required."),
  motherOccupation: z.string().min(1, "Mother's Occupation is required."),
  guardianFullName: z.string().min(1, "Guardian's Full Name is required."),
  guardianRelationship: z.string().min(1, "Relationship is required."),
  guardianAddress: z.string().min(1, "Guardian's Address is required."),
  guardianEmail: z
    .string()
    .email("Invalid email address.")
    .refine(
      (email) => !email.toLowerCase().endsWith("@icloud.com"),
      "iCloud email addresses are not allowed",
    ),
  guardianPhoneNumber: z
    .string()
    .min(10, "Guardian's Phone Number is required.")
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Enter a valid phone number"),
});

// Slim parents step (master): guardian only.
export const MasParentsInfoSchema = z.object({
  guardianFullName: z.string().min(1, "Guardian's Full Name is required."),
  guardianRelationship: z.string().min(1, "Relationship is required."),
  guardianAddress: z.string().min(1, "Guardian's Address is required."),
  guardianEmail: z.string().email("Invalid email address."),
  guardianPhoneNumber: z
    .string()
    .min(10, "Guardian's Phone Number is required."),
});

/* -------------------------------------------------------------------------- */
/*  Per-variant combined schemas                                              */
/* -------------------------------------------------------------------------- */

// `.and` is used so the conditional (refined) object schemas compose cleanly.
export const NewLicenseSchema = PersonalInfoSchema.and(LicAcademicInfoSchema)
  .and(NewMajorSchema)
  .and(LicParentsInfoSchema);

export const NewMasterSchema = PersonalInfoSchema.and(MasAcademicInfoSchema)
  .and(NewMasMajorSchema)
  .and(LicParentsInfoSchema);

export const ReLicenseSchema = PersonalInfoSchema.and(ReLicMajorSchema);

export const ReMasterSchema = PersonalInfoSchema.and(ReMasMajorSchema);

/* -------------------------------------------------------------------------- */
/*  Per-step field lists (used by form.trigger to validate one step)          */
/* -------------------------------------------------------------------------- */

const personalFields = [
  "firstName",
  "lastName",
  "firstNameLatin",
  "lastNameLatin",
  "gender",
  "familyStatus",
  "nationality",
  "NIN",
  "dateOfExpiration",
  "dateOfBirth",
  "birthCountry",
  "residenceWillaya",
  "residenceCommune",
  "residenceAddress",
  "email",
  "phoneNumber1",
  "phoneNumber2",
  "medicalCondition",
  "medicalConditionOther",
];

const licAcademicFields = [
  "baccalaureateSeries",
  "baccalaureateYear",
  "baccalaureateAverage",
  "baccalaureateMajor",
  "mathematicsMark",
  "physicsMark",
  "highSchoolName",
  "highSchoolType",
];

const masAcademicFields = [
  "licenseUniversity",
  "licenseYear",
  "licenseMajor",
  "currentUniversity",
  "currentUniversityYear",
  "currentUniversityMajor",
];

const masMajorFields = ["majors", "language"];
const licMajorFields = ["majors", "language"];

const licParentsFields = [
  "fatherFirstName",
  "fatherPhoneNumber",
  "fatherEmail",
  "fatherOccupation",
  "motherFirstName",
  "motherLastName",
  "motherOccupation",
  "guardianFullName",
  "guardianRelationship",
  "guardianAddress",
  "guardianEmail",
  "guardianPhoneNumber",
];

const masParentsFields = [
  "guardianFullName",
  "guardianRelationship",
  "guardianAddress",
  "guardianEmail",
  "guardianPhoneNumber",
];

// Maps each variant's step index -> the field names to validate for that step.
export const fieldsByStep: Record<string, string[][]> = {
  newLicense: [
    personalFields,
    licAcademicFields,
    licMajorFields,
    licParentsFields,
    [], // review
  ],
  newMaster: [
    personalFields,
    masAcademicFields,
    masMajorFields,
    licParentsFields,
    [], // review
  ],
  reLicense: [personalFields, licMajorFields, []],
  reMaster: [personalFields, masMajorFields, []],
};
