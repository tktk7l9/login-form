import { loginFormSchema } from "@/app/features/auth/lib/formSchema";
import { supabase } from "@/app/features/auth/lib/supabaseClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

export const useLoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof loginFormSchema>> = async (
    data
  ) => {
    const { email, password } = data;
    // login
    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message);
        if (signInError.message.includes("Email not confirmed")) {
          setError("メールアドレスを確認してください。");
        }
        if (signInError.message.includes("Invalid login credentials")) {
          setError("そのようなユーザーは存在しません。");
        }
        return;
      }

      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return { form, onSubmit, error };
};
