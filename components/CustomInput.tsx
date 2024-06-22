import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Control, FieldPath } from "react-hook-form";
import { z } from "zod";
import { authFormSchema } from "@/lib/utils";


// becoz we wanna use all of the field, so hard code 'sign-up' here
const formSchema = authFormSchema('sign-up'); 

interface CustomInput {
  control: Control<z.infer<typeof formSchema>>;
  // instead of specifying the type of "name" as string, it limits only can be the field name
  // that specific in authFormSchema, like 'email' || 'password'
  // but this is error-prone as field can be added or removed
  name: FieldPath<z.infer<typeof formSchema>>; // this way always know which exact fields do we have
  label: string;
  placeholder: string;
}

// Reusable Input field comp for user to input in form
const CustomInput = ({ control, name, label, placeholder }: CustomInput) => {
  return (
    <FormField
      control={control}
      // this name is mapping to formSchema and defaultValues, so name has to be same on both side
      name={name}
      render={({ field }) => (
        <div className="form-item">
          {/* FormLabel: field name that show to user */}
          <FormLabel className="form-label">{label}</FormLabel>

          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                type={name === "password" ? "password" : "text"}
                {...field}
              />
            </FormControl>

            {/* FormMessage: showing formSchema error msg if any */}
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
};

export default CustomInput;
