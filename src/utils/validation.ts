import { z } from 'zod';

export const formSchema = z.object({
  nameOrNickname: z
    .string()
    .min(1, '이름/닉네임을 입력해주세요.')
    .transform((val) => val.trim()),
  email: z
    .string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식을 입력해주세요.')
    .transform((val) => val.trim()),
  feExperience: z.string().min(1, 'FE 경력 연차를 선택해주세요.'),
  githubLink: z
    .string()
    .transform((val) => val?.trim() || '')
    .refine((val) => {
      if (!val) return true;
      return /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9]([a-zA-Z0-9-_])*[a-zA-Z0-9]\/?$/.test(
        val,
      );
    }, '올바른 GitHub 링크를 입력해주세요. (예: https://github.com/username)'),
});

export type FormData = z.infer<typeof formSchema>;
