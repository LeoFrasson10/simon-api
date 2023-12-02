export enum TermTypeEnum {
  privacy = 'privacy',
  policy = 'policy',
  terms = 'terms',
  research = 'research',
}

export type CreateSpinTermDTO = {
  content: string;
  type: TermTypeEnum;
  version?: number;
  integrationId: string;
};
