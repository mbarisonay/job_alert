export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange?: string;
  aiScore: number;
  type?: string;
  postedAt?: string;
  description?: string;
  requirements?: string[];
  tags?: string[];
};
