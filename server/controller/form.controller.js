import { sheets } from "../index.js";
import addresses from "../data/addresses.json" with { type: "json" };
import { externMajors } from "../data/data.js";
import { generateLicensePdf } from "../services/pdf/licensePdf.js";
import { uploadForm } from "../utils/uploadForm.js";
import dotenv from "dotenv";
dotenv.config();

// Map a major id (e.g. "cs") to its display name. Falls back to the id when
// it isn't found so we never lose the raw value.
const majorIdToName = new Map(externMajors.map((m) => [m.id, m.name]));
const majorName = (id) => (id == null ? null : (majorIdToName.get(id) ?? id));

// Format a date value as "YYYY-MM-DD", returning "" for empty/invalid input so
// optional dates (e.g. dateOfExpiration) don't throw "Invalid time value".
//
// A date-only string ("2026-06-23") is the day the user actually picked, so it
// is returned as-is. Passing it through `new Date(...).toISOString()` would
// reinterpret it as UTC midnight and could shift the day, which is the bug we
// are guarding against; only full timestamps fall through to Date parsing.
const formatDate = (value) => {
  if (!value) return "";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
};

export const newRegistration = async (req, res) => {
  const validTypes = ["newRegistration", "reRegistration"];
  const validDegrees = ["license", "master"];
  if (
    !validTypes.includes(req.body?.type) ||
    !validDegrees.includes(req.body?.degree)
  ) {
    return res.status(400).json({
      success: false,
      error: "Unknown registration type or degree.",
    });
  }

  const {
    type,
    degree,

    // Personal Information
    firstName,
    lastName,
    firstNameLatin,
    lastNameLatin,
    gender,
    familyStatus,
    nationality,
    NIN,
    dateOfExpiration,
    dateOfBirth,
    birthCountry,
    birthWillaya,
    birthCommune,
    birthAddress,
    residenceWillaya,
    residenceCommune,
    residenceAddress,
    email,
    phoneNumber1,
    phoneNumber2,
    medicalCondition,
    medicalConditionOther,

    // Academic Background
    baccalaureateSeries,
    baccalaureateYear,
    baccalaureateAverage,
    baccalaureateMajor,
    mathematicsMark,
    physicsMark,
    highSchoolName,
    highSchoolType,
    currentUniversity,
    currentUniversityYear,
    currentUniversityMajor,
    licenseMajor,
    licenseUniversity,
    licenseYear,

    // Parents Information
    fatherFirstName,
    fatherOccupation,
    fatherPhoneNumber,
    fatherEmail,
    motherFirstName,
    motherLastName,
    motherOccupation,
    guardianFullName,
    guardianRelationship,
    guardianEmail,
    guardianPhoneNumber,
    guardianAddress,

    // Choosing Majors
    majors,
    language,
  } = req.body;

  let pdfUrl;

  try {
    if (type === "newRegistration" && degree === "license") {
      const pdfBytes = await generateLicensePdf(req.body);
      const fileBaseName = `${type}-${degree}-${lastNameLatin}-${firstNameLatin}`;
      pdfUrl = await uploadForm(pdfBytes, fileBaseName);
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SHEET_ID,
        range: "Sheet6!A:D",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [
            [
              "License - ليسانس",
              "New-Registration - تسجيل جديد",
              firstName,
              lastName,
              firstNameLatin,
              lastNameLatin,
              gender,
              familyStatus,
              nationality,
              NIN,
              formatDate(dateOfExpiration),
              formatDate(dateOfBirth),
              birthCountry,
              birthCountry === "Algeria - الجزائر"
                ? addresses[birthWillaya - 1].nameAr +
                  " - " +
                  addresses[birthWillaya - 1].nameFr
                : "",
              birthCountry === "Algeria - الجزائر" ? birthCommune : "",
              birthAddress,
              addresses[residenceWillaya - 1].nameAr +
                " " +
                "-" +
                " " +
                addresses[residenceWillaya - 1].nameFr,
              residenceCommune,
              residenceAddress,
              email,
              phoneNumber1,
              phoneNumber2,
              medicalCondition === "Other - أخر"
                ? medicalConditionOther
                : medicalCondition,
              baccalaureateSeries,
              baccalaureateYear,
              baccalaureateMajor,
              baccalaureateAverage,
              mathematicsMark,
              physicsMark,
              highSchoolName,
              highSchoolType,
              null,
              null,
              null,
              currentUniversity,
              currentUniversityYear,
              currentUniversityMajor,
              fatherFirstName,
              fatherOccupation,
              fatherEmail,
              fatherPhoneNumber,
              motherFirstName,
              motherLastName,
              motherOccupation,
              guardianFullName,
              guardianRelationship,
              guardianPhoneNumber,
              guardianEmail,
              guardianAddress,
              majorName(majors[0]),
              majorName(majors[1]),
              language,
              pdfUrl,
            ],
          ],
        },
      });
    }
    if (type === "reRegistration" && degree === "license") {
      const pdfBytes = await generateLicensePdf(req.body);
      const fileBaseName = `${type}-${degree}-${lastNameLatin}-${firstNameLatin}`;
      pdfUrl = await uploadForm(pdfBytes, fileBaseName);

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SHEET_ID,
        range: "Sheet6!A:D",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [
            [
              "License - ليسانس",
              "Re-Registration - إعادة تسجيل",
              firstName,
              lastName,
              firstNameLatin,
              lastNameLatin,
              gender,
              familyStatus,
              nationality,
              nationality === "Algerian - جزائري" ? NIN : null,
              nationality === "Algerian - جزائري"
                ? formatDate(dateOfExpiration)
                : null,
              formatDate(dateOfBirth),
              birthCountry,
              birthCountry === "Algeria - الجزائر"
                ? addresses[birthWillaya - 1].nameAr +
                  " - " +
                  addresses[birthWillaya - 1].nameFr
                : "",
              birthCountry === "Algeria - الجزائر" ? birthCommune : "",
              birthCountry === "Algeria - الجزائر" ? birthAddress : "",

              addresses[residenceWillaya - 1].nameAr +
                " - " +
                addresses[residenceWillaya - 1].nameFr,
              residenceCommune,
              residenceAddress,
              email,
              phoneNumber1,
              phoneNumber2,
              medicalCondition,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              majorName(majors[0]),
              null,
              language,
              pdfUrl,
            ],
          ],
        },
      });
    }
    if (type === "newRegistration" && degree === "master") {
      const pdfBytes = await generateLicensePdf(req.body);
      const fileBaseName = `${type}-${degree}-${lastNameLatin}-${firstNameLatin}`;
      pdfUrl = await uploadForm(pdfBytes, fileBaseName);

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SHEET_ID,
        range: "Sheet6!A:D",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [
            [
              "master - ماستر",
              "New-Registration - تسجيل جديد",
              firstName,
              lastName,
              firstNameLatin,
              lastNameLatin,
              gender,
              familyStatus,
              nationality,
              NIN,
              formatDate(dateOfExpiration),
              formatDate(dateOfBirth),
              birthCountry,
              birthCountry === "Algeria - الجزائر"
                ? addresses[birthWillaya - 1].nameAr +
                  " - " +
                  addresses[birthWillaya - 1].nameFr
                : "",
              birthCommune,
              birthAddress,
              addresses[residenceWillaya - 1].nameAr +
                " " +
                "-" +
                " " +
                addresses[residenceWillaya - 1].nameFr,
              residenceCommune,
              residenceAddress,
              email,
              phoneNumber1,
              phoneNumber2,
              medicalCondition,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              licenseMajor,
              licenseUniversity,
              licenseYear,
              currentUniversity,
              currentUniversityYear,
              currentUniversityMajor,
              fatherFirstName,
              fatherOccupation,
              fatherEmail,
              fatherPhoneNumber,
              motherFirstName,
              motherLastName,
              motherOccupation,
              guardianFullName,
              guardianRelationship,
              guardianEmail,
              guardianPhoneNumber,
              guardianAddress,
              majorName(majors[0]),
              majorName(majors[1]),
              language,
              pdfUrl,
            ],
          ],
        },
      });
    }
    if (type === "reRegistration" && degree === "master") {
      const pdfBytes = await generateLicensePdf(req.body);
      const fileBaseName = `${type}-${degree}-${lastNameLatin}-${firstNameLatin}`;
      pdfUrl = await uploadForm(pdfBytes, fileBaseName);

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SHEET_ID,
        range: "Sheet6!A:D",
        valueInputOption: "USER_ENTERED",
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [
            [
              "master - ماستر",
              "Re-Registration - إعادة تسجيل",
              firstName,
              lastName,
              firstNameLatin,
              lastNameLatin,
              gender,
              familyStatus,
              nationality,
              NIN,
              formatDate(dateOfExpiration),
              formatDate(dateOfBirth),
              birthCountry,
              birthCountry === "Algeria - الجزائر"
                ? addresses[birthWillaya - 1].nameAr +
                  " - " +
                  addresses[birthWillaya - 1].nameFr
                : "",
              birthCommune,
              birthAddress,
              addresses[residenceWillaya - 1].nameAr +
                " " +
                "-" +
                " " +
                addresses[residenceWillaya - 1].nameFr,
              residenceCommune,
              residenceAddress,
              email,
              phoneNumber1,
              phoneNumber2,
              medicalCondition,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              majorName(majors[0]),
              null,
              language,
              pdfUrl,
            ],
          ],
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Form submitted successfully.",
      formUrl: pdfUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
