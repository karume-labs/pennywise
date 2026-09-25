declare module "react-native-get-sms-android" {
  export interface SmsMessage {
    _id: number;
    thread_id: number;
    address: string;
    person: number;
    date: number;
    date_sent: number;
    protocol: number;
    read: number;
    status: number;
    type: number;
    reply_path_present: number;
    subject: string;
    body: string;
    service_center: string;
    locked: number;
    error_code: number;
    seen: number;
  }

  export interface SmsFilter {
    box?: "inbox" | "sent" | "draft" | "outbox" | "failed" | "queued" | "";
    read?: 0 | 1;
    _id?: number;
    address?: string;
    body?: string;
    bodyRegex?: string;
    indexFrom?: number;
    maxCount?: number;
    minDate?: number;
    maxDate?: number;
  }

  const SmsAndroid: {
    list(
      filter: string,
      fail: (error: Error) => void,
      success: (count: number, smsList: string) => void,
    ): void;
  };

  export default SmsAndroid;
}
