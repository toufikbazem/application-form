// Major ids as used by the client, mapped to the field name that represents
// them in the PDF templates. The licence templates mostly name their fields
// after the major id (the exception being "ebm", whose field is "eco"), while
// the master templates spell the specialite out. Ids missing from the map fall
// back to the id itself.
const majorFieldName = {
  // licence
  cs: "cs",
  scs: "scs",
  ste: "ste",
  ebm: "eco",
  cse: "cse",
  cp: "cp",
  lpl: "lpl",
  fsa: "fsa",
  // master
  csd: "dataEng",
  csc: "cyberSec",
  mba: "mba",
  esg: "guidance",
  lbl: "businessLaw",
  // master, re-registration only
  dgm: "digitalMarketing",
  mcp: "clinicalPsych",
};

// Fill the Choosing Majors section: the study language checkbox and the
// ranked list of major preferences.
export const fillMajors = (data, { checkBox, markField }) => {
  const { majors, language } = data;

  language === "arabic - العربية" && checkBox("isArabic");
  language === "english - إنجليزية" && checkBox("isEnglish");
  language === "french - فرنسية" && checkBox("isFrench");

  // Majors are an ordered preference list (most preferred first). New
  // registrations rank their choices, so each major's 1-based rank goes in the
  // field named after it, e.g. majors = ["cs", "scs"] -> "cs" = 1, "scs" = 2.
  // Re-registrations pick a single major, which is simply ticked.
  if (data.type === "newRegistration") {
    majors.forEach((id, index) => {
      if (id == null) return;
      markField(majorFieldName[id] ?? id, String(index + 1));
    });
  } else if (majors[0] != null) {
    markField(majorFieldName[majors[0]] ?? majors[0], "X");
  }
};
