import { signupFormSchema } from "@/app/features/auth/lib/formSchema";
import { supabase } from "@/app/features/auth/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { set, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export const useSignupForm = () => {
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof signupFormSchema>> = async (
    data
  ) => {
    const { username, email, password } = data;
    // signup
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      const { error: userError } = await supabase
        .from("User")
        .insert([{ id: data?.user?.id, username, email }]);

      if (userError) {
        console.error(userError.message);
        if (
          userError.message.includes(
            "duplicate key value violates unique constraint"
          )
        ) {
          setError("既に存在するユーザーです。");
        }
        return;
      }

      router.push("/auth/email-confirm");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return { form, onSubmit, error };
};
