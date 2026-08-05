import { Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import MajorCard from "@/components/MajorCard";
import {
  SelectTrigger,
  Select,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Trophy } from "lucide-react";
import RankPanel from "@/components/RankPanel";
import { masterMajors } from "@/data/data";
import { Input } from "@/components/ui/input";

const MAX_CHOICES = 1;
const LANGUAGE_MAJORS = ["csd", "csc", "mba"];

const ReMasMajor = ({ form }: { form: any }) => {
  const selectedIds: string[] = form.watch("majors") ?? [];
  const atLimit = selectedIds.length >= MAX_CHOICES;
  const rankOf = (id: string) => selectedIds.indexOf(id) + 1;
  const ranked = selectedIds.map((id) => masterMajors.find((m) => m.id === id));
  const toggleMajor = (id: string) => {
    const prev: string[] = form.getValues("majors") ?? [];
    let next: string[];
    if (prev.includes(id)) next = prev.filter((x) => x !== id);
    else if (prev.length >= MAX_CHOICES) next = prev;
    else next = [...prev, id];
    form.setValue("majors", next, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col">
        <h3 className="text-[16px] font-medium text-primary-500">
          Choose Your Major
        </h3>
        <p className="text-sm text-slate-500 ">
          Select 2 majors in order of preference from highest to lowest, tap a
          card to select.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        {/* Student ID — re-registering students already have one. */}
        <Controller
          name="studentId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              className=" flex flex-col gap-1.5"
              data-invalid={fieldState.invalid}
            >
              <FieldLabel className="text-xs font-medium text-slate-500 gap-0">
                Student ID
                <span className="text-red-500 ml-0.5">*</span>
              </FieldLabel>

              <Input
                type="text"
                className="input"
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Enter your student ID"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {masterMajors.map((m) => (
            <MajorCard
              key={m.id}
              major={m}
              selectedRank={rankOf(m.id)}
              disabled={atLimit}
              onToggle={toggleMajor}
            />
          ))}
        </div>

        {form.formState.errors.majors && (
          <FieldError errors={[form.formState.errors.majors]} />
        )}

        {selectedIds.some((id) => LANGUAGE_MAJORS.includes(id)) && (
          <Controller
            name="language"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex-1">
                <FieldLabel className="text-xs font-medium text-slate-500 gap-0">
                  Language of Study
                  <span className="text-red-500 ml-0.5">*</span>
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    className="input"
                  >
                    <SelectValue
                      className="placeholder:text-slate-400"
                      placeholder="Select Language of Study"
                    />
                  </SelectTrigger>
                  <SelectContent className="p-3" position="item-aligned">
                    <SelectItem key="1" value="english - إنجليزية">
                      English
                    </SelectItem>
                    <SelectItem key="2" value="french - فرنسية">
                      French
                    </SelectItem>
                    <SelectItem key="3" value="arabic - العربية">
                      Arabic
                    </SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}
      </div>

      {/* ranking rail */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          <Trophy size={13} className="text-[#1e3c73]" />
          Your ranking
        </div>
        <RankPanel ranked={ranked} />
      </div>
    </div>
  );
};
export default ReMasMajor;
