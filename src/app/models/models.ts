export interface Entry {
  id: number;
  date: string;
  amount: number;
  reason: string;
  repeat: {};
  object?: string;
  deleted?: boolean;
  restored?: boolean;
  edited?: boolean;
}

export interface Debtor {
  entries: Entry[];
  name: string;
}

export interface Feedback {
  text: string;
  errorFeedback: boolean;
}
