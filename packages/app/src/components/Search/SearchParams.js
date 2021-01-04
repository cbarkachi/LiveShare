// default data for filter elements
export const priceInit = {
  0: "$0",
  100: "$100+",
};

export const calenderItem = {
  separator: "-",
  format: "MM-DD-YYYY",
  locale: "en",
};

export const getSkill = {
  id: 1,
  name: "Skill Level",
  identifier: "skills",
  options: [
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ],
};

export const getTags = {
  id: 2,
  name: "Tags",
  identifier: "tags",
  options: [{ label: "Free Initial Consultation", value: "free-initial" }],
};
