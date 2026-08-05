import { BookOpen, GraduationCap, User, Users } from "lucide-react";
import { format } from "date-fns";
import { majorNameFor, type FormPath } from "@/data/majors";
import address from "@/data/addresses.json";

function ReviewItem({ k, v, full }: { k: string; v: any; full?: boolean }) {
  const value =
    v instanceof Date
      ? format(v, "PPP")
      : v && String(v).trim()
        ? String(v)
        : "—";
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <div className="text-[11px] uppercase tracking-wide text-slate-400">
        {k}
      </div>
      <div className="mt-0.5 text-sm text-slate-800">{value}</div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="flex items-center justify-between bg-slate-50 px-3.5 py-2.5">
        <span className="flex items-center gap-2 text-sm font-medium text-[#1e3c73]">
          {icon}
          {title}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 sm:gap-x-5 gap-y-2.5 px-3.5 py-3">
        {children}
      </div>
    </div>
  );
}

const Divider = () => (
  <span className="w-full h-0.5 bg-secondary rounded-full col-span-1 sm:col-span-2"></span>
);

function ReviewSubmit({ form, path }: { form: any; path: FormPath }) {
  const v = form.watch();
  const isBirthInAlgeria = v.birthCountry === "Algeria - الجزائر";
  const majors: string[] = v.majors ?? [];

  const isLicense = path === "newLicense" || path === "reLicense";
  const isNew = path === "newLicense" || path === "newMaster";

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col">
        <h3 className="text-[16px] font-medium text-primary-500">
          Review &amp; submit
        </h3>
        <p className="text-sm text-slate-500 ">
          Please confirm your details are correct before submitting.
        </p>
      </div>

      {/* Personal info — collected on every path */}
      <SectionCard icon={<User size={15} />} title="Personal info">
        <ReviewItem k="First name" v={v.firstName} />
        <ReviewItem k="Last name" v={v.lastName} />
        <ReviewItem k="First name (Latin)" v={v.firstNameLatin} />
        <ReviewItem k="Last name (Latin)" v={v.lastNameLatin} />
        <ReviewItem k="Gender" v={v.gender} />
        <ReviewItem k="Family status" v={v.familyStatus} />
        <ReviewItem k="Nationality" v={v.nationality} />
        {v.nationality === "Algerian - جزائري" && (
          <>
            <ReviewItem k="NIN" v={v.NIN} />
            <ReviewItem k="Date of expiration" v={v.dateOfExpiration} />
          </>
        )}
        <ReviewItem k="Date of Birth" v={v.dateOfBirth} />
        <Divider />
        <h3 className="col-span-1 sm:col-span-2 text-sm font-medium text-primary-500">
          Place of Birth
        </h3>
        <ReviewItem k="Country" v={v.birthCountry} full />
        {isBirthInAlgeria ? (
          <>
            <ReviewItem
              k="Willaya"
              v={
                address[parseInt(v.birthWillaya) - 1].nameFr +
                " - " +
                address[parseInt(v.birthWillaya) - 1].nameAr
              }
            />
            <ReviewItem k="Commune" v={v.birthCommune} />
          </>
        ) : (
          <ReviewItem k="Address" v={v.birthAddress} />
        )}
        <Divider />
        <h3 className="col-span-1 sm:col-span-2 text-sm font-medium text-primary-500">
          Residence Address
        </h3>
        <ReviewItem
          k="Willaya"
          v={
            address[parseInt(v.residenceWillaya) - 1].nameFr +
            " - " +
            address[parseInt(v.residenceWillaya) - 1].nameAr
          }
        />
        <ReviewItem k="Commune" v={v.residenceCommune} />
        <ReviewItem k="Address" v={v.residenceAddress} />
        <Divider />
        <ReviewItem k="Email" v={v.email} />
        <ReviewItem k="Phone Number 1" v={v.phoneNumber1} />
        <ReviewItem k="Phone Number 2" v={v.phoneNumber2} />
        {v.medicalCondition !== "Other - أخر" && (
          <ReviewItem k="Medical Condition" v={v.medicalCondition} />
        )}
        {v.medicalCondition === "Other - أخر" && (
          <ReviewItem
            k="Medical Condition (Other)"
            v={v.medicalConditionOther}
          />
        )}
      </SectionCard>

      {/* Academic info — only the "new" paths collect it. License gathers full
          baccalaureate + university details; master only the university. */}
      {isNew && (
        <SectionCard icon={<BookOpen size={15} />} title="Academic Info">
          {isLicense && (
            <>
              <h3 className="col-span-1 sm:col-span-2 text-sm font-medium text-primary-500">
                Baccalaureate Information
              </h3>
              <ReviewItem k="Register Number" v={v.baccalaureateSeries} />
              <ReviewItem k="Year" v={v.baccalaureateYear} />
              <ReviewItem k="Average" v={v.baccalaureateAverage} />
              <ReviewItem k="Major" v={v.baccalaureateMajor} />
              <ReviewItem k="Mathematics Mark" v={v.mathematicsMark} />
              <ReviewItem k="Physics Mark" v={v.physicsMark} />
              <ReviewItem k="High School Name" v={v.highSchoolName} />
              <ReviewItem k="High School Type" v={v.highSchoolType} />
              <Divider />
            </>
          )}
          {!isLicense && (
            <>
              <h3 className="col-span-1 sm:col-span-2 text-sm font-medium text-primary-500">
                License Information
              </h3>
              <ReviewItem k="University" v={v.licenseUniversity} />
              <ReviewItem k="Year" v={v.licenseYear} />
              <ReviewItem k="Major" v={v.licenseMajor} />
              <Divider />
            </>
          )}
          <h3 className="col-span-1 sm:col-span-2 text-sm font-medium text-primary-500">
            Current University Information
          </h3>
          <ReviewItem k="Current University" v={v.currentUniversity} />
          <ReviewItem k="University Year" v={v.currentUniversityYear} />
          <ReviewItem k="University Major" v={v.currentUniversityMajor} />
        </SectionCard>
      )}

      {/* Parental info — only the "new" paths collect it. License gathers
          father + mother + guardian; master only the guardian (with address). */}
      {isNew && (
        <SectionCard icon={<Users size={15} />} title="Parental Information">
          <h3 className="col-span-1 sm:col-span-2 text-sm font-medium text-primary-500">
            Father's Information
          </h3>
          <ReviewItem k="First Name" v={v.fatherFirstName} />
          <ReviewItem k="Occupation" v={v.fatherOccupation} />
          <ReviewItem k="Email" v={v.fatherEmail} />
          <ReviewItem k="Phone Number" v={v.fatherPhoneNumber} />
          <Divider />
          <h3 className="col-span-1 sm:col-span-2 text-sm font-medium text-primary-500">
            Mother's Information
          </h3>
          <ReviewItem k="First Name" v={v.motherFirstName} />
          <ReviewItem k="Last Name" v={v.motherLastName} />
          <ReviewItem k="Occupation" v={v.motherOccupation} />
          <Divider />
          <h3 className="col-span-1 sm:col-span-2 text-sm font-medium text-primary-500">
            Guardian's Information
          </h3>
          <ReviewItem
            k="Full Name of the Person Responsible for Paying Tuition Fees"
            v={v.guardianFullName}
          />
          <ReviewItem k="Relationship to Student" v={v.guardianRelationship} />
          {/* Guardian address is only collected on the master path. */}
          <ReviewItem k="Address" v={v.guardianAddress} />
          <ReviewItem k="Email" v={v.guardianEmail} />
          <ReviewItem k="Phone Number" v={v.guardianPhoneNumber} />
        </SectionCard>
      )}

      {/* Chosen majors — every path. New paths rank two; re paths pick one.
          The re paths also collect the student ID on this step. */}
      <SectionCard icon={<GraduationCap size={15} />} title="Chosen Majors">
        {!isNew && <ReviewItem k="Student ID" v={v.studentId} full />}
        {majors.length === 0 ? (
          <div className="text-sm text-slate-500">No majors selected.</div>
        ) : (
          majors.map((id, index) => (
            <div key={id} className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1e3c73] text-[11px] font-semibold text-white">
                {index + 1}
              </span>
              <span className="text-sm text-slate-800">
                <span className="font-medium">{majorNameFor(path, id)}</span>
              </span>
            </div>
          ))
        )}
        {v.language && <ReviewItem k="Language of Study" v={v.language} />}
      </SectionCard>
    </div>
  );
}

export default ReviewSubmit;
