import type {
  Announcement,
  Assignment,
  ContentBlock,
  LearnerMentorMatch,
  MaterialItem,
  PageContent,
  SessionRecord,
  SessionTemplate,
  StaffMember,
} from "@/types/content";

let uid = 0;
const nextId = (prefix: string) => `${prefix}_${(++uid).toString(36)}`;

function block(
  type: ContentBlock["type"],
  order: number,
  fields: Partial<ContentBlock["fields"]> = {},
  data?: Record<string, unknown>,
): ContentBlock {
  return {
    id: nextId("blk"),
    type,
    order,
    hidden: false,
    data,
    fields: {
      visibilityRoles: [],
      isActive: true,
      align: "left",
      width: "default",
      spacing: "md",
      ...fields,
    },
  };
}

// ================= 메인 페이지 =================
const mainBlocks: ContentBlock[] = [
  block(
    "banner",
    0,
    {
      blockName: "메인 히어로 배너",
      title: "마케팅의 다음 챕터,\nCDP MAP에서 시작하세요",
      subtitle: "ETC마케팅본부 CDP · Marketing Assignment Program",
      description: "",
      buttonLabel: "지금 신청하기",
      buttonUrl: "https://forms.gle/awVLtckpMasscMAY7",
      linkTarget: "_blank",
      secondaryButtonLabel: "교육 소개 보기",
      secondaryButtonUrl: "/#intro",
      align: "center",
      highlighted: false,
      isActive: true,
      visibilityRoles: [],
    },
  ),

];

const aboutBlocks: ContentBlock[] = [
  block("heading", 0, { title: "교육 소개", isActive: true, visibilityRoles: [] }),
  block(
    "richtext",
    1,
    {
      description:
        "CDP MAP(Marketing Assignment Program)은 ETC마케팅본부 CDP 과정 중 OJT에 해당하는 마케팅 직무 입문 및 역량 강화 교육입니다.",
      isActive: true,
      visibilityRoles: [],
    },
  ),
];

const applyBlocks: ContentBlock[] = [
  block("heading", 0, { title: "신청 안내", isActive: true, visibilityRoles: [] }),
  block(
    "text",
    1,
    {
      description: "신청 후 운영진 검토를 거쳐 승인 여부가 안내됩니다.",
      isActive: true,
      visibilityRoles: [],
    },
  ),
  block(
    "button",
    2,
    {
      buttonLabel: "신청서 작성하기",
      buttonUrl: "#",
      align: "center",
      isActive: true,
      visibilityRoles: [],
    },
  ),
];

const faqBlocks: ContentBlock[] = [
  block("heading", 0, { title: "자주 묻는 질문", isActive: true, visibilityRoles: [] }),
  block(
    "faq",
    1,
    { isActive: true, visibilityRoles: [] },
    {
      items: [
        {
          q: "수강자와 청강자는 뭐가 다른가요?",
          a: "수강자는 멘토 매칭과 과제 협업을 포함한 전체 과정을, 청강자는 일정 확인과 자료 열람 중심으로 참여합니다.",
        },
        {
          q: "중도에 청강에서 수강으로 전환할 수 있나요?",
          a: "운영진 승인을 통해 전환이 가능합니다. 신청 안내 페이지를 참고해 주세요.",
        },
      ],
    },
  ),
];

const completionBlocks: ContentBlock[] = [
  block("heading", 0, { title: "수료 안내", isActive: true, visibilityRoles: [] }),
  block(
    "text",
    1,
    {
      description: "전체 세션의 80% 이상 출석하고 모든 과제를 완료하면 수료증이 발급됩니다.",
      isActive: true,
      visibilityRoles: [],
    },
  ),
];

// ================= 라운지 =================
const commonLoungeBlocks: ContentBlock[] = [
  block(
    "banner",
    0,
    {
      title: "환영합니다 👋",
      subtitle: "오늘도 CDP MAP과 함께 성장해요",
      isActive: true,
      visibilityRoles: [],
    },
  ),
  block(
    "cardGrid",
    1,
    { title: "무엇을 확인하고 싶으세요?", isActive: true, visibilityRoles: [] },
    {
      cards: [
        {
          title: "교육 소개",
          description: "CDP MAP이 어떤 프로그램인지 다시 확인해보세요.",
          buttonLabel: "보러가기",
          buttonUrl: "/about",
        },
        {
          title: "강의 일정",
          description: "회차별 날짜, 장소, 아젠다를 확인하세요.",
          buttonLabel: "일정 보기",
          buttonUrl: "/schedule",
        },
        {
          title: "강의 자료",
          description: "회차별 자료를 조회하고 다운로드하세요.",
          buttonLabel: "자료 보기",
          buttonUrl: "/materials",
        },
        {
          title: "실시간 피드백",
          description: "강의에 대한 의견을 바로 남겨보세요.",
          buttonLabel: "피드백 남기기",
          buttonUrl: "/feedback",
        },
      ],
    },
  ),
  block("recentNotices", 2, { title: "공지사항", isActive: true, visibilityRoles: [] }),
  block("schedule", 3, { title: "다가오는 일정", isActive: true, visibilityRoles: [] }),
  block("recentMaterials", 4, { title: "최근 자료", isActive: true, visibilityRoles: [] }),
];

const learnerLoungeBlocks: ContentBlock[] = [
  block(
    "progress",
    0,
    { title: "나의 수강 진행률", isActive: true, visibilityRoles: ["learner"] },
    { percent: 62, completedWeeks: 5, totalWeeks: 8 },
  ),
  block(
    "card",
    1,
    {
      title: "이번 주 과제",
      description: "3주차 캠페인 기획안 초안을 제출해 주세요.",
      buttonLabel: "과제 제출하러 가기",
      buttonUrl: "/learner/assignments",
      isActive: true,
      visibilityRoles: ["learner"],
    },
  ),
  block(
    "profileCard",
    2,
    { title: "담당 멘토", isActive: true, visibilityRoles: ["learner"] },
    { name: "김도윤 PM", team: "브랜드마케팅팀", intro: "3년차 그로스 마케터" },
  ),
];

const auditorLoungeBlocks: ContentBlock[] = [
  block(
    "card",
    0,
    {
      title: "청강자 안내",
      description: "청강자는 강의 일정 확인, 자료 열람, 피드백 참여를 이용할 수 있습니다.",
      isActive: true,
      visibilityRoles: ["auditor"],
    },
  ),
];

const mentorLoungeBlocks: ContentBlock[] = [
  block(
    "card",
    0,
    {
      title: "담당 수강자 4명",
      description: "이번 주 확인이 필요한 과제 제출물이 2건 있습니다.",
      buttonLabel: "멘토 대시보드로 이동",
      buttonUrl: "/mentor",
      isActive: true,
      visibilityRoles: ["mentor"],
    },
  ),
];

const instructorLoungeBlocks: ContentBlock[] = [
  block(
    "card",
    0,
    {
      title: "다음 강의: 4주차 - 퍼포먼스 마케팅 실습",
      description: "8월 12일(수) 14:00, 대회의실",
      isActive: true,
      visibilityRoles: ["instructor"],
    },
  ),
];

export const mockPages: PageContent[] = [
  {
    id: nextId("page"),
    slug: "main",
    title: "메인 페이지",
    pageType: "main",
    status: "published",
    draftBlocks: mainBlocks,
    publishedBlocks: mainBlocks,
    updatedBy: "박서연 운영자",
    updatedAt: "2026-07-20T09:00:00+09:00",
  },
  {
    id: nextId("page"),
    slug: "about",
    title: "교육 소개",
    pageType: "about",
    status: "published",
    draftBlocks: aboutBlocks,
    publishedBlocks: aboutBlocks,
    updatedBy: "박서연 운영자",
    updatedAt: "2026-07-18T09:00:00+09:00",
  },
  {
    id: nextId("page"),
    slug: "apply",
    title: "신청 안내",
    pageType: "apply",
    status: "published",
    draftBlocks: applyBlocks,
    publishedBlocks: applyBlocks,
    updatedBy: "이하준 운영자",
    updatedAt: "2026-07-15T09:00:00+09:00",
  },
  {
    id: nextId("page"),
    slug: "faq",
    title: "FAQ",
    pageType: "faq",
    status: "published",
    draftBlocks: faqBlocks,
    publishedBlocks: faqBlocks,
    updatedBy: "이하준 운영자",
    updatedAt: "2026-07-15T09:00:00+09:00",
  },
  {
    id: nextId("page"),
    slug: "completion",
    title: "수료 안내",
    pageType: "completion",
    status: "published",
    draftBlocks: completionBlocks,
    publishedBlocks: completionBlocks,
    updatedBy: "박서연 운영자",
    updatedAt: "2026-07-10T09:00:00+09:00",
  },
  {
    id: nextId("page"),
    slug: "lounge",
    title: "종합 라운지",
    pageType: "lounge_common",
    status: "published",
    draftBlocks: commonLoungeBlocks,
    publishedBlocks: commonLoungeBlocks,
    updatedBy: "박서연 운영자",
    updatedAt: "2026-07-20T09:00:00+09:00",
  },
  {
    id: nextId("page"),
    slug: "lounge-learner",
    title: "수강자 라운지",
    pageType: "lounge_learner",
    status: "published",
    draftBlocks: learnerLoungeBlocks,
    publishedBlocks: learnerLoungeBlocks,
    updatedBy: "박서연 운영자",
    updatedAt: "2026-07-20T09:00:00+09:00",
  },
  {
    id: nextId("page"),
    slug: "lounge-auditor",
    title: "청강자 라운지",
    pageType: "lounge_auditor",
    status: "published",
    draftBlocks: auditorLoungeBlocks,
    publishedBlocks: auditorLoungeBlocks,
    updatedBy: "이하준 운영자",
    updatedAt: "2026-07-19T09:00:00+09:00",
  },
  {
    id: nextId("page"),
    slug: "lounge-mentor",
    title: "멘토 라운지",
    pageType: "lounge_mentor",
    status: "published",
    draftBlocks: mentorLoungeBlocks,
    publishedBlocks: mentorLoungeBlocks,
    updatedBy: "박서연 운영자",
    updatedAt: "2026-07-19T09:00:00+09:00",
  },
  {
    id: nextId("page"),
    slug: "lounge-instructor",
    title: "강사 라운지",
    pageType: "lounge_instructor",
    status: "published",
    draftBlocks: instructorLoungeBlocks,
    publishedBlocks: instructorLoungeBlocks,
    updatedBy: "박서연 운영자",
    updatedAt: "2026-07-19T09:00:00+09:00",
  },
];

export const mockSessions: SessionRecord[] = [
  {
    id: nextId("sess"),
    courseId: "cdp-map-2026-2",
    week: 1,
    title: "PM의 역할, 학술기본, DATA Mining / Analysis",
    summary: "PM의 역할과 책임을 내재화하고, 기초 학술자료 분석 및 UBIST 활용법을 익힙니다.",
    description:
      "PM 직무수행을 위한 기본지식 및 학술자료 분석방법을 배우고, 시장분석 Tool 활용방법을 익힙니다.",
    objectives: [
      "PM의 역할과 책임에 대해 내재화한다",
      "PM 직무수행을 위한 기본지식 및 학술자료 분석방법을 배우고, 시장분석 Tool 활용방법을 익힌다",
    ],
    preparation: [],
    date: "2026-08-13",
    startTime: "08:30",
    endTime: "17:40",
    location: "본관 B1층 트러스트룸",
    instructor: "진재훈",
    status: "published",
    visibilityRoles: [],
    assignmentNote:
      "[사전과제] 도전품목 검증2년 초과 성공모델 또는 신규 처방명분(신제품) 재검증 위한 검증1단계 정리 → 멘토에게 제출 / [과제] 2회차 \"Planning Process & 분석기법 및 STP&4Pmix, 전략수립\" 관련 온라인 강의 사전학습",
    agenda: [
      { time: "08:30~09:30", minutes: "60'", title: "사전테스트 / 오리엔테이션", instructor: "진재훈" },
      { time: "09:30~10:30", minutes: "60'", title: "PM의 성과창출 프로세스", instructor: "서욱" },
      { time: "10:40~11:30", minutes: "50'", title: "우리 본부 PM 평가 맛보기", instructor: "박미경/김유신" },
      { time: "11:30~12:30", minutes: "60'", title: "점심식사", instructor: "-" },
      { time: "12:30~13:10", minutes: "40'", title: "기초자료 검색법 & 논문의 이해", instructor: "채연지" },
      { time: "13:10~13:50", minutes: "40'", title: "PM의 듀얼브레인, AI 실무 활용법", instructor: "황득경" },
      { time: "14:00~15:00", minutes: "60'", title: "UBIST 데이터의 이해와 활용사례", instructor: "마케팅기획팀 데이터파트" },
      { time: "15:10~16:10", minutes: "60'", title: "실전 UBIST 1 (기본)", instructor: "마케팅기획팀 데이터파트" },
      { time: "16:20~17:20", minutes: "60'", title: "실전 UBIST 2 (고급)", instructor: "마케팅기획팀 데이터파트" },
      { time: "17:20~17:40", minutes: "20'", title: "사후테스트 / WRAP-UP", instructor: "진재훈" },
    ],
    draftBlocks: [
      block("heading", 0, { title: "1회차 : PM의 역할, 학술기본, DATA Mining / Analysis", isActive: true, visibilityRoles: [] }),
      block(
        "richtext",
        1,
        {
          title: "교육 목표",
          description:
            "1) PM의 역할과 책임에 대해 내재화한다\n2) PM 직무수행을 위한 기본지식 및 학술자료 분석방법을 배우고, 시장분석 Tool 활용방법을 익힌다",
          isActive: true,
          visibilityRoles: [],
        },
      ),
      block(
        "fileDownload",
        2,
        { title: "1회차 오리엔테이션 자료", isActive: true, visibilityRoles: ["learner", "auditor"] },
        { fileName: "cdp-map-w1-orientation.pdf" },
      ),
    ],
    publishedBlocks: [],
    updatedAt: "2026-07-15T09:00:00+09:00",
  },
  {
    id: nextId("sess"),
    courseId: "cdp-map-2026-2",
    week: 2,
    title: "검증4단계 & 마케팅 전략수립",
    summary: "마케팅 전략수립 프로세스를 학습하고 검증4단계 프로세스를 내재화합니다.",
    description:
      "마케팅 전략수립 프로세스 및 이론에 대해 학습하고 활용할 수 있도록 하며, 검증4단계 프로세스를 내재화하고 현업에 대한 이해를 바탕으로 도전품목 전략수립을 구체화합니다.",
    objectives: [
      "마케팅 전략수립 프로세스 및 이론에 대해 학습하고 활용할 수 있도록 한다",
      "검증4단계 프로세스를 내재화하고, 현업에 대한 이해를 바탕으로 도전품목 전략수립을 구체화한다",
    ],
    preparation: [],
    date: "2026-08-20",
    startTime: "08:30",
    endTime: "17:40",
    location: "신관 B1층 베어홀",
    instructor: "진재훈",
    status: "published",
    visibilityRoles: [],
    assignmentNote:
      "[과제] 검증2단계(처방명분 튜닝, 사내/외 고수 자문) 및 타겟환자 예상매출 발표자료 준비 → 3회차 시 발표",
    agenda: [
      { time: "08:30~09:00", minutes: "30'", title: "사전테스트", instructor: "진재훈" },
      { time: "09:00~09:40", minutes: "40'", title: "검증4단계 총론 및 가속화 노하우", instructor: "김화산" },
      { time: "09:50~10:50", minutes: "60'", title: "처방명분 작성의 고찰", instructor: "김학준" },
      { time: "11:00~11:30", minutes: "30'", title: "AI 시대의 메디컬 Sales Forecast", instructor: "이영민" },
      { time: "11:30~12:20", minutes: "50'", title: "Brand Planning : 목표 & 전략수립", instructor: "배정현" },
      { time: "12:20~13:20", minutes: "60'", title: "점심식사", instructor: "-" },
      { time: "13:20~14:10", minutes: "50'", title: "MBO 및 성공모델 확산시스템의 이해", instructor: "오창헌" },
      { time: "14:10~14:50", minutes: "40'", title: "Projection A의 도출과정", instructor: "원성훈" },
      { time: "15:00~15:40", minutes: "40'", title: "검증 4단계 과정에서의 고민 해결 노하우", instructor: "TBD" },
      { time: "15:50~17:20", minutes: "90'", title: "검증2단계 멘토링", instructor: "멘토PM" },
      { time: "17:20~17:40", minutes: "20'", title: "사후테스트 / WRAP-UP", instructor: "진재훈" },
    ],
    draftBlocks: [
      block("heading", 0, { title: "2회차 : 검증4단계 & 마케팅 전략수립", isActive: true, visibilityRoles: [] }),
      block(
        "richtext",
        1,
        {
          title: "교육 목표",
          description:
            "1) 마케팅 전략수립 프로세스 및 이론에 대해 학습하고 활용할 수 있도록 한다\n2) 검증4단계 프로세스를 내재화하고, 현업에 대한 이해를 바탕으로 도전품목 전략수립을 구체화한다",
          isActive: true,
          visibilityRoles: [],
        },
      ),
    ],
    publishedBlocks: [],
    updatedAt: "2026-07-21T09:00:00+09:00",
  },
  {
    id: nextId("sess"),
    courseId: "cdp-map-2026-2",
    week: 3,
    title: "실무의 이해_마케팅 프로세스",
    summary: "제품개발 및 발매 프로세스를 이해하고 그 과정에서의 PM의 역할을 정리합니다.",
    description:
      "업무에 필요한 내/외부 배경지식을 학습하고 유관부서와의 협업 프로세스를 이해합니다.",
    objectives: [
      "제품개발 및 발매 프로세스를 이해하고 그 과정에서의 PM의 역할을 정리한다",
      "업무에 필요한 내/외부 배경지식을 학습하고 유관부서와의 협업 프로세스를 이해한다",
    ],
    preparation: [],
    date: "2026-08-27",
    startTime: "08:30",
    endTime: "17:50",
    location: "신관 B1층 베어홀",
    instructor: "진재훈",
    status: "published",
    visibilityRoles: [],
    assignmentNote: "2회차 과제(검증2단계 결과) 발표 및 사업부장/팀장 1차 평가가 이번 회차 초반에 진행됩니다.",
    agenda: [
      { time: "08:30~08:50", minutes: "20'", title: "사전테스트", instructor: "진재훈" },
      { time: "08:50~11:00", minutes: "130'", title: "과제(2단계 결과) 발표 및 1차 평가", instructor: "사업부장/팀장" },
      { time: "11:10~11:40", minutes: "30'", title: "1차 평가 복기 및 보완사항 정리", instructor: "-" },
      { time: "11:40~12:40", minutes: "60'", title: "점심식사", instructor: "-" },
      { time: "12:40~13:10", minutes: "30'", title: "PM으로서 알아야하는 CP기준", instructor: "지대웅" },
      { time: "13:20~14:00", minutes: "40'", title: "신제품 발매 프로세스의 A to Z", instructor: "이상곤" },
      { time: "14:10~14:50", minutes: "40'", title: "신제품 판촉자료 준비 프로세스", instructor: "윤지영" },
      { time: "14:50~15:30", minutes: "40'", title: "시판 후 임상연구의 활용방안", instructor: "김소희" },
      { time: "15:40~16:20", minutes: "40'", title: "유관부서 업무의 이해 (사업개발/신제품기획)", instructor: "임청하" },
      { time: "16:30~17:00", minutes: "30'", title: "판매계획에 따른 공급 프로세스", instructor: "TBD" },
      { time: "17:00~17:30", minutes: "30'", title: "PM 우수 전략 발표 공유 (1)", instructor: "TBD" },
      { time: "17:30~17:50", minutes: "20'", title: "사후테스트 / WRAP-UP", instructor: "진재훈" },
    ],
    draftBlocks: [
      block("heading", 0, { title: "3회차 : 실무의 이해_마케팅 프로세스", isActive: true, visibilityRoles: [] }),
      block(
        "richtext",
        1,
        {
          title: "교육 목표",
          description:
            "1) 제품개발 및 발매 프로세스를 이해하고 그 과정에서의 PM의 역할을 정리한다\n2) 업무에 필요한 내/외부 배경지식을 학습하고 유관부서와의 협업 프로세스를 이해한다",
          isActive: true,
          visibilityRoles: [],
        },
      ),
    ],
    publishedBlocks: [],
    updatedAt: "2026-07-22T09:00:00+09:00",
  },
  {
    id: nextId("sess"),
    courseId: "cdp-map-2026-2",
    week: 4,
    title: "성공모델 확산_도구의 혁신",
    summary: "도구의 혁신을 통한 성공모델 확산의 개념을 이해합니다.",
    description: "성공모델 확산에 대한 노하우를 배우고, 본인의 전략에 접목할 수 있도록 합니다.",
    objectives: [
      "도구의 혁신을 통한 성공모델 확산의 개념을 이해한다",
      "성공모델 확산에 대한 노하우를 배우고, 본인의 전략에 접목할 수 있도록 한다",
    ],
    preparation: [],
    date: "2026-09-03",
    startTime: "08:30",
    endTime: "18:00",
    location: "신관 B1층 베어홀",
    instructor: "진재훈",
    status: "published",
    visibilityRoles: [],
    assignmentNote: "[과제] 도전품목 최종전략 준비 → 5회차 시 발표",
    agenda: [
      { time: "08:30~09:00", minutes: "30'", title: "사전테스트", instructor: "진재훈" },
      { time: "09:00~09:30", minutes: "30'", title: "메일작성 Skill UP", instructor: "서동진" },
      { time: "09:30~10:10", minutes: "40'", title: "심포지엄 기획·운영의 차별화", instructor: "TBD" },
      { time: "10:20~11:00", minutes: "40'", title: "학회 관리 통한 KOL 고객단계 증진", instructor: "김혁" },
      { time: "11:00~12:00", minutes: "60'", title: "업무혁신을 이끄는 생성형AI 접목사례와 전략", instructor: "서로다" },
      { time: "12:00~13:00", minutes: "60'", title: "점심식사", instructor: "-" },
      { time: "13:00~13:40", minutes: "40'", title: "닥터빌 활용의 모든 것", instructor: "TBD" },
      { time: "13:40~15:10", minutes: "90'", title: "디지털 헬스케어 시장의 미래와 우리의 할일", instructor: "이대영" },
      { time: "15:20~15:50", minutes: "30'", title: "관계저축 이론과 AI 활용전략", instructor: "서욱" },
      { time: "15:50~16:20", minutes: "30'", title: "PM 우수 전략 발표 공유 (2)", instructor: "TBD" },
      { time: "16:30~17:40", minutes: "70'", title: "최종전략 멘토링", instructor: "멘토PM" },
      { time: "17:40~18:00", minutes: "20'", title: "사후테스트 / WRAP-UP", instructor: "진재훈" },
    ],
    draftBlocks: [
      block("heading", 0, { title: "4회차 : 성공모델 확산_도구의 혁신", isActive: true, visibilityRoles: [] }),
      block(
        "richtext",
        1,
        {
          title: "교육 목표",
          description:
            "1) 도구의 혁신을 통한 성공모델 확산의 개념을 이해한다\n2) 성공모델 확산에 대한 노하우를 배우고, 본인의 전략에 접목할 수 있도록 한다",
          isActive: true,
          visibilityRoles: [],
        },
      ),
    ],
    publishedBlocks: [],
    updatedAt: "2026-07-22T09:00:00+09:00",
  },
  {
    id: nextId("sess"),
    courseId: "cdp-map-2026-2",
    week: 5,
    title: "최종 전략발표",
    summary: "지금까지 학습한 내용을 바탕으로 도전품목 최종 전략 및 실행계획을 발표합니다.",
    description: "코칭을 통한 보완사항을 정리하고, 예비 구성원으로서 본부의 문화를 이해하고 소통하는 시간을 갖습니다.",
    objectives: [
      "지금까지 학습한 내용을 바탕으로 도전품목 최종 전략 및 실행계획을 발표하고 코칭을 통해 보완사항을 정리한다",
      "예비 구성원으로서 본부의 문화를 이해하고 소통하는 시간을 갖는다",
    ],
    preparation: [],
    date: "2026-09-10",
    startTime: "08:40",
    endTime: "16:20",
    location: "본관 B1층 트러스트룸",
    instructor: "진재훈",
    status: "published",
    visibilityRoles: [],
    agenda: [
      { time: "08:40~09:00", minutes: "20'", title: "오프닝", instructor: "진재훈" },
      { time: "09:00~12:30", minutes: "210'", title: "최종 전략 발표 및 평가", instructor: "사업부장/팀장" },
      { time: "12:30~13:30", minutes: "60'", title: "점심식사", instructor: "-" },
      { time: "13:30~14:20", minutes: "50'", title: "마케팅본부에서의 성장 경험", instructor: "김선더" },
      { time: "14:30~15:10", minutes: "40'", title: "마케팅본부에서의 경험담", instructor: "조병하" },
      { time: "15:10~15:50", minutes: "40'", title: "PM 토크콘서트", instructor: "박영준/멘토" },
      { time: "15:50~16:20", minutes: "30'", title: "클로징", instructor: "진재훈" },
    ],
    draftBlocks: [
      block("heading", 0, { title: "5회차 : 최종 전략발표", isActive: true, visibilityRoles: [] }),
      block(
        "richtext",
        1,
        {
          title: "교육 목표",
          description:
            "1) 지금까지 학습한 내용을 바탕으로 도전품목 최종 전략 및 실행계획을 발표하고 코칭을 통해 보완사항을 정리한다\n2) 예비 구성원으로서 본부의 문화를 이해하고 소통하는 시간을 갖는다",
          isActive: true,
          visibilityRoles: [],
        },
      ),
    ],
    publishedBlocks: [],
    updatedAt: "2026-07-22T09:00:00+09:00",
  },
];

// ================= 회차별 과제 =================
// 세션(회차)마다 1개의 과제를 매칭한다. 안내 문구는 세션의 assignmentNote를
// 우선 사용하고, 없으면 세션 제목을 바탕으로 기본 문구를 채운다.
export const mockAssignments: Assignment[] = mockSessions.map((session) => ({
  id: nextId("asg"),
  sessionId: session.id,
  week: session.week,
  title: `${session.week}회차 과제`,
  description:
    session.assignmentNote?.trim() ||
    `"${session.title}" 회차와 관련하여 배운 내용을 정리하고, 담당 도전품목에 어떻게 적용할지 작성해 주세요.`,
}));

// ================= 수강자-멘토 매칭 (도전품목 포함) =================
// Phase 1 데모 데이터. Phase 2에서는 운영진 CMS(구글시트 명단 확장 or 별도 매칭
// 화면)에서 입력한 값을 그대로 이 구조로 저장하면 된다.
export const mockLearnerMentorMatches: LearnerMentorMatch[] = [
  {
    learnerName: "김민준",
    mentorName: "김도윤 PM",
    challengeItem: "엔블로 신규 처방명분 확대",
  },
  {
    learnerName: "이서준",
    mentorName: "김도윤 PM",
    challengeItem: "펙수클루 지역별 처방 커버리지 확대",
  },
  {
    learnerName: "박하율",
    mentorName: "최윤아 PM",
    challengeItem: "마트레 종별 처방 확대",
  },
];

export const mockSessionTemplates: SessionTemplate[] = [
  {
    id: nextId("tpl"),
    name: "일반 강의형",
    description: "강의 소개 + 학습 목표 + 자료로 구성된 기본 템플릿",
    defaultBlocks: [
      { type: "heading", hidden: false, fields: { visibilityRoles: [], isActive: true, title: "세션 제목" } },
      { type: "richtext", hidden: false, fields: { visibilityRoles: [], isActive: true } },
      { type: "fileDownload", hidden: false, fields: { visibilityRoles: [], isActive: true } },
    ],
  },
  {
    id: nextId("tpl"),
    name: "실습형",
    description: "학습 목표 + 준비사항 + 실습 자료 + 질문 게시판",
    defaultBlocks: [
      { type: "heading", hidden: false, fields: { visibilityRoles: [], isActive: true } },
      { type: "accordion", hidden: false, fields: { visibilityRoles: [], isActive: true, title: "준비 사항" } },
      { type: "fileDownload", hidden: false, fields: { visibilityRoles: [], isActive: true } },
    ],
  },
  {
    id: nextId("tpl"),
    name: "특별 초청 강의형",
    description: "강사 소개를 강조하는 템플릿",
    defaultBlocks: [
      { type: "instructor", hidden: false, fields: { visibilityRoles: [], isActive: true } },
      { type: "richtext", hidden: false, fields: { visibilityRoles: [], isActive: true } },
    ],
  },
  {
    id: nextId("tpl"),
    name: "과제 발표형",
    description: "발표 자료 + 피드백 폼 중심 템플릿",
    defaultBlocks: [
      { type: "heading", hidden: false, fields: { visibilityRoles: [], isActive: true } },
      { type: "formEmbed", hidden: false, fields: { visibilityRoles: [], isActive: true } },
    ],
  },
  {
    id: nextId("tpl"),
    name: "온라인 강의형",
    description: "온라인 링크 + 영상 다시보기 중심 템플릿",
    defaultBlocks: [
      { type: "video", hidden: false, fields: { visibilityRoles: [], isActive: true } },
      { type: "richtext", hidden: false, fields: { visibilityRoles: [], isActive: true } },
    ],
  },
  {
    id: nextId("tpl"),
    name: "오프라인 워크숍형",
    description: "장소/준비물 안내 + 실습 자료 중심 템플릿",
    defaultBlocks: [
      { type: "heading", hidden: false, fields: { visibilityRoles: [], isActive: true } },
      { type: "accordion", hidden: false, fields: { visibilityRoles: [], isActive: true, title: "준비물" } },
    ],
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: nextId("ann"),
    title: "2026년 하반기 CDP MAP 2기 모집 안내",
    body: "8월 1일까지 신청서를 제출해 주세요. 서류 검토 후 개별 안내드립니다.",
    pinned: true,
    visibilityRoles: [],
    createdAt: "2026-07-18T09:00:00+09:00",
  },
  {
    id: nextId("ann"),
    title: "3주차 세션 장소 변경 안내",
    body: "8월 12일 세션은 온라인으로 진행됩니다. 참여 링크를 확인해 주세요.",
    pinned: false,
    visibilityRoles: ["learner", "auditor"],
    createdAt: "2026-07-21T09:00:00+09:00",
  },
];

export const mockMaterials: MaterialItem[] = [
  {
    id: nextId("mat"),
    title: "1회차 강의자료 다운로드 받기",
    description: "1회차 전체 강의 자료 모음",
    fileType: "pdf",
    sessionId: mockSessions[0].id,
    visibilityRoles: [],
    downloadAllowed: true,
    flipbookEnabled: false,
    fileUrl: "https://works.do/FQiGHsY",
    downloadUrl: "https://works.do/FQiGHsY",
  },
];

export const mockStaff: StaffMember[] = [
  {
    id: nextId("staff"),
    name: "박서연",
    email: "seoyeon.park@company.com",
    role: "super_admin",
    permissions: ["*"],
    scope: "all",
  },
  {
    id: nextId("staff"),
    name: "이하준",
    email: "hajun.lee@company.com",
    role: "operator",
    permissions: [
      "page.edit",
      "page.publish",
      "session.edit",
      "session.publish",
      "application.review",
    ],
    scope: "all",
  },
  {
    id: nextId("staff"),
    name: "최지우",
    email: "jiwoo.choi@company.com",
    role: "editor",
    permissions: ["page.edit", "session.edit"],
    scope: "course",
  },
];
