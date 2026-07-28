import { z } from "zod";
import { ALL_ROLES } from "@/types/content";

export const roleEnum = z.enum(
  ALL_ROLES as [string, ...string[]],
);

export const blockCommonFieldsSchema = z.object({
  blockName: z.string().max(60).optional(),
  title: z.string().max(120).optional(),
  subtitle: z.string().max(160).optional(),
  description: z.string().max(2000).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  backgroundImageUrl: z.string().url().optional().or(z.literal("")),
  icon: z.string().max(40).optional(),
  buttonLabel: z.string().max(30).optional(),
  buttonUrl: z.string().max(500).optional(),
  linkTarget: z.enum(["_self", "_blank"]).optional(),
  align: z.enum(["left", "center", "right"]).optional(),
  width: z.enum(["narrow", "default", "wide", "full"]).optional(),
  spacing: z.enum(["none", "sm", "md", "lg", "xl"]).optional(),
  highlighted: z.boolean().optional(),
  visibilityRoles: z.array(roleEnum).min(1, "공개 대상을 1개 이상 선택해 주세요."),
  publishAt: z.string().nullable().optional(),
  expireAt: z.string().nullable().optional(),
  isActive: z.boolean(),
  extraClassName: z.string().max(300).optional(),
});

export const contentBlockSchema = z.object({
  id: z.string(),
  type: z.string(),
  order: z.number().int().min(0),
  fields: blockCommonFieldsSchema,
  data: z.record(z.string(), z.unknown()).optional(),
  hidden: z.boolean(),
});

export const embedInputSchema = z.object({
  url: z.string().min(1, "URL 또는 임베드 코드를 입력해 주세요."),
  title: z.string().min(1, "제목을 입력해 주세요.").max(120),
  description: z.string().max(500).optional(),
  visibilityRoles: z.array(roleEnum).min(1),
  rawEmbedCode: z.string().optional(),
});

export type EmbedInputValues = z.infer<typeof embedInputSchema>;

export const sessionBasicInfoSchema = z.object({
  courseId: z.string().min(1),
  week: z.number().int().min(1).max(52),
  title: z.string().min(2, "세션 제목을 입력해 주세요.").max(120),
  summary: z.string().max(200).optional(),
  description: z.string().max(4000).optional(),
  date: z.string().min(1, "강의 일자를 선택해 주세요."),
  startTime: z.string().min(1, "시작 시간을 선택해 주세요."),
  endTime: z.string().min(1, "종료 시간을 선택해 주세요."),
  location: z.string().max(120).optional(),
  onlineUrl: z.string().url().optional().or(z.literal("")),
  instructor: z.string().min(1, "강사를 선택해 주세요."),
  visibilityRoles: z.array(roleEnum).min(1),
});

export type SessionBasicInfoValues = z.infer<typeof sessionBasicInfoSchema>;
