import { masterMajors, reMasMajors } from "./data";
// Single source of truth for the selectable majors. Note that the same major
// `id` maps to a different `name` for license vs master, so callers must use
// the list that matches their path (use `majorsFor(path)`).

export type Major = {
  id: string;
  name: string;
  language: string;
  total: string;
  firstInstallment: string;
};

export const licenseMajors: Major[] = [
  {
    id: "cs",
    name: "Computer Science - Computer Systems",
    language: "English/French",
    total: "550 000 DA",
    firstInstallment: "275 000 DA",
  },
  {
    id: "scs",
    name: "Computer Science - Security of Computer Systems",
    language: "English/French",
    total: "550 000 DA",
    firstInstallment: "275 000 DA",
  },
  {
    id: "ste",
    name: "Science & Technology - Electronics",
    language: "English/French",
    total: "550 000 DA",
    firstInstallment: "275 000 DA",
  },
  {
    id: "ebm",
    name: "Economics - Eco & Business Management",
    language: "English/French/Arabic",
    total: "485 000 DA",
    firstInstallment: "242 500 DA",
  },
  {
    id: "cse",
    name: "Commercial Sciences - E-commerce",
    language: "English/French/Arabic",
    total: "485 000 DA",
    firstInstallment: "242 500 DA",
  },
  {
    id: "cp",
    name: "Social Sciences - Clinical Psychology",
    language: "Arabic",
    total: "410 000 DA",
    firstInstallment: "205 000 DA",
  },
  {
    id: "lpl",
    name: "Law - Public Law",
    language: "Arabic",
    total: "400 000 DA",
    firstInstallment: "200 000 DA",
  },
  // Re-registration only, but kept here so `majorNameFor` can resolve it on
  // the review step (which shares one list per degree).
  {
    id: "fsa",
    name: "Financial Sciences and Accounting - Accounting",
    language: "French/Arabic",
    total: "485 000 DA",
    firstInstallment: "242 500 DA",
  },
];

// export const masterMajors: Major[] = [
//   {
//     id: "cs",
//     name: "Computer Science - Data Engineering and Web Technology",
//     language: "French",
//     total: "550 000 DA",
//     firstInstallment: "275 000 DA",
//   },
//   {
//     id: "scs",
//     name: "Computer Science - CyberSecurity",
//     language: "French",
//     total: "550 000 DA",
//     firstInstallment: "275 000 DA",
//   },
//   {
//     id: "ebm",
//     name: "Economic Science - Business Administration",
//     language: "French/Arabic",
//     total: "485 000 DA",
//     firstInstallment: "242 500 DA",
//   },
//   {
//     id: "cp",
//     name: "Education Science - Guidance and Orientation",
//     language: "Arabic",
//     total: "410 000 DA",
//     firstInstallment: "205 000 DA",
//   },
//   {
//     id: "pl",
//     name: "Law - Business Law",
//     language: "Arabic",
//     total: "400 000 DA",
//     firstInstallment: "200 000 DA",
//   },
// ];

// Majors whose selection requires the applicant to pick a language of study.
export const LANGUAGE_REQUIRED_MAJORS = ["cs", "scs", "ste"];

export type FormPath = "newLicense" | "newMaster" | "reLicense" | "reMaster";

export function majorsFor(path: FormPath): Major[] {
  if (path === "newLicense" || path === "reLicense") return licenseMajors;
  // Master re-registration offers two specialites that new registrations
  // don't, so it needs its own list (see `reMasMajors`).
  return path === "reMaster" ? reMasMajors : masterMajors;
}

// Resolves a major id to its display name for the given path, falling back to
// the raw id if it is not found in that path's list.
export function majorNameFor(path: FormPath, id: string): string {
  return majorsFor(path).find((m) => m.id === id)?.name ?? id;
}
