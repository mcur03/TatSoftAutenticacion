import { EmailClient } from "@azure/communication-email";
import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.AZURE_CONNECTION_STRING || "";
const client = new EmailClient(connectionString);

const senderAddress = process.env.AZURE_SENDER_ADDRESS;
if (!senderAddress) {
  throw new Error("El remitente (AZURE_SENDER_ADDRESS) no está configurado.");
}


export const sendEmail = async (to: string, subject: string, code: string) => {
  console.log('entro a sendEmail');
  
  try {
    // Cargar y compilar la plantilla HTML
    const templatePath = path.join(__dirname, "../templates/verificationTemplate.html");
    const source = fs.readFileSync(templatePath, "utf-8");
    const template = Handlebars.compile(source);
    const html = template({ code });

    // Configurar el mensaje de correo electrónico
    const emailMessage = {
      senderAddress: process.env.AZURE_SENDER_ADDRESS || "",
      content: { subject, html },
      recipients: { to: [{ address: to }] },
    };

    try {
      // Enviar el correo
      const poller = await client.beginSend(emailMessage);
      await poller.pollUntilDone();
      console.log("Email enviado correctamente");
    } catch (error) {
      console.error("Error enviando correo en sendEmail:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw error;
  }
};
