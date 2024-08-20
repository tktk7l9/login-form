import { z } from "zod";

export const signupFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "ユーザー名は2文字以上で入力してください。" }),
  email: z
    .string()
    .email({ message: "メールアドレスの形式が正しくありません。" }),
  password: z
    .string()
    .min(10, { message: "パスワードは10文字以上で入力してください。" }),
});
