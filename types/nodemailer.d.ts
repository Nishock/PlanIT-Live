declare module "nodemailer" {
  import SMTPTransport from "nodemailer/lib/smtp-transport"
  export interface Transporter<T = any> {
    sendMail(mailOptions: any): Promise<any>
  }
  export function createTransport(options: SMTPTransport.Options | string): Transporter
  export default {} as any
}
