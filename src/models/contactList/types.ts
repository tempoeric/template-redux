export interface ContactListState {
  customerData: IContactData | null;
  customerList: Array<IContactData> | null;
  isLoading: boolean;
  responseMessage: string | null;
}

export interface IContactData {
  id?: string;
  name: string;
  email: string;
  contactNumber: string;
}

export type ContainerState = ContactListState;
