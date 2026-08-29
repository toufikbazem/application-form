export const gender = [
  {
    id: "1",
    label: "male",
    value: "male - ذكر",
  },
  {
    id: "2",
    label: "female",
    value: "female - أنثى",
  },
];

export const familyStatus = [
  {
    id: "1",
    label: "single",
    value: "single - أعزب",
  },
  {
    id: "2",
    label: "Married",
    value: "married - متزوج",
  },
];

export const medicalCondition = [
  {
    id: "7",
    label: "Good Health",
    value: "Good Health - صحة جيدة",
  },
  {
    id: "1",
    label: "diabetes",
    value: "diabetes - سكري",
  },
  {
    id: "2",
    label: "Epilepsy",
    value: "Epilepsy - الصرع",
  },
  {
    id: "3",
    label: "asthma",
    value: "asthma - الربو",
  },
  {
    id: "4",
    label: "heart disease",
    value: "heart disease - أمراض القلب",
  },
  {
    id: "5",
    label: "Personality disorders",
    value: "Personality disorders - إضطربات الشخصية",
  },
  {
    id: "6",
    label: "Other",
    value: "Other - أخر",
  },
];

export const bacMajor = [
  {
    id: "1",
    label: "Experimental Sciences",
    value: "SE - علوم تجريبية",
  },
  {
    id: "2",
    label: "Management and Economics",
    value: "GE - تسيير وإقتصاد",
  },
  {
    id: "3",
    label: "Mathematics",
    value: "MA - رياضيات",
  },
  {
    id: "4",
    label: "Technical Mathematics",
    value: "TM - تقني رياضي",
  },
  {
    id: "5",
    label: "Arts and Philosophy",
    value: "Philo - أداب وفلسفة",
  },
  {
    id: "6",
    label: "Arts and Foreign Languages",
    value: "Langue - أداب ولغات أجنبية",
  },
  {
    id: "7",
    label: "Equivalence Certificate",
    value: "EQUIVALENCE - شهادة معادلة",
  },
];

export const hsType = [
  {
    id: "1",
    label: "Public",
    value: "public - حكومية",
  },
  {
    id: "2",
    label: "Private",
    value: "private - خاصة",
  },
  {
    id: "3",
    label: "Baccalaureate libre",
    value: "libre - حرة",
  },
  {
    id: "4",
    label: "BAC ONEFD",
    value: "BAC ONEFD",
  },
];

export const internMajors = [
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
];

export const externMajors = [
  {
    id: "cs",
    name: "Computer Science - Computer Systems",
    language: "English/French",
    total: "650 000 DA",
    firstInstallment: "325 000 DA",
  },
  {
    id: "scs",
    name: "Computer Science - Security of Computer Systems",
    language: "English/French",
    total: "650 000 DA",
    firstInstallment: "325 000 DA",
  },
  {
    id: "ste",
    name: "Science & Technology - Electronics",
    language: "English/French",
    total: "650 000 DA",
    firstInstallment: "325 000 DA",
  },
  {
    id: "ebm",
    name: "Economics - Eco & Business Management",
    language: "English/French/Arabic",
    total: "585 000 DA",
    firstInstallment: "292 500 DA",
  },
  {
    id: "cse",
    name: "Commercial Sciences - E-commerce",
    language: "English/French/Arabic",
    total: "585 000 DA",
    firstInstallment: "292 500 DA",
  },
  {
    id: "cp",
    name: "Social Sciences - Clinical Psychology",
    language: "Arabic",
    total: "510 000 DA",
    firstInstallment: "255 000 DA",
  },
  {
    id: "lpl",
    name: "Law - Public Law",
    language: "Arabic",
    total: "500 000 DA",
    firstInstallment: "250 000 DA",
  },
];

// License re-registration offers one extra specialite that is not open to new
// registrations, so those paths get their own lists.
const RE_LIC_EXTRA_INTERN = {
  id: "fsa",
  name: "Financial Sciences and Accounting - Accounting",
  language: "French/Arabic",
  total: "485 000 DA",
  firstInstallment: "242 500 DA",
};

const RE_LIC_EXTRA_EXTERN = {
  id: "fsa",
  name: "Financial Sciences and Accounting - Accounting",
  language: "French/Arabic",
  total: "585 000 DA",
  firstInstallment: "292 500 DA",
};

export const reLicInternMajors = [...internMajors, RE_LIC_EXTRA_INTERN];

export const reLicExternMajors = [...externMajors, RE_LIC_EXTRA_EXTERN];

export const masterMajors = [
  {
    id: "csd",
    name: "Computer Science - Data Engineering and Web Technology",
    language: "French",
    total: "525 000 DA",
    firstInstallment: "265 000 DA",
  },
  {
    id: "csc",
    name: "Computer Science - CyberSecurity",
    language: "French",
    total: "520 000 DA",
    firstInstallment: "265 000 DA",
  },

  {
    id: "mba",
    name: "Economic Science - Business Administration",
    language: "French/Arabic",
    total: "445 000 DA",
    firstInstallment: "225 500 DA",
  },
  {
    id: "esg",
    name: "Education Science - Guidance and Orientation",
    language: "Arabic",
    total: "385 000 DA",
    firstInstallment: "192 000 DA",
  },
  {
    id: "lbl",
    name: "Law - Business Law",
    language: "Arabic",
    total: "385 000 DA",
    firstInstallment: "192 000 DA",
  },
];

// Master re-registration offers two extra specialites that are not open to new
// registrations, so that path gets its own list.
const RE_MAS_EXTRA = [
  {
    id: "dgm",
    name: "Economic Sciences - Master of Digital Marketing",
    language: "French/Arabic",
    total: "445 000 DA",
    firstInstallment: "225 500 DA",
  },
  {
    id: "mcp",
    name: "Social Sciences - Master of Clinical Psychology",
    language: "Arabic",
    total: "385 000 DA",
    firstInstallment: "192 000 DA",
  },
];

export const reMasMajors = [...masterMajors, ...RE_MAS_EXTRA];

export const universityYear = [
  {
    id: "1",
    label: "1st year license",
    value: "1st year license - السنة الأولى ليسانس",
  },
  {
    id: "2",
    label: "2st year license",
    value: "2st year license - السنة الثانية ليسانس",
  },
  {
    id: "3",
    label: "3st year license",
    value: "3st year license - السنة الثالثة ليسانس",
  },
  {
    id: "4",
    label: "1st year master",
    value: "1st year master - السنة الأولى ماستر",
  },
  {
    id: "5",
    label: "2st year master",
    value: "2st year master - السنة الثانية ماستر",
  },
];
