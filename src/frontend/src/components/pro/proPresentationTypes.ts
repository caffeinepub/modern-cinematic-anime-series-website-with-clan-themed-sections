export interface ProBlock {
  id: string;
  title: string;
  body: string;
}

export interface ProPresentationDocument {
  blocks: ProBlock[];
}
