import { UserProfile } from "../../types";
import { localized } from "./shared";
export const currentUser: UserProfile = {
  avatarUrl: "https://i.pravatar.cc/160?img=68",
  firstName: localized("Maicon", "Maicon"),
  fullName: "Maicon Araujo",
  role: localized("Founder", "Fundador"),
  company: "Yuno",
  headline: localized(
    "Human networking, remembered later.",
    "Networking humano, lembrado depois.",
  ),
  interests: [
    localized("AI", "IA"),
    localized("Events", "Eventos"),
    localized("SaaS", "SaaS"),
    localized("iOS", "iOS"),
    localized("Community", "Comunidade"),
  ],
  socials: {
    email: "maicon@yuno.app",
    instagram: "maiconaraujo",
    linkedin: "maiconaraujo",
    telegram: "maiconaraujo",
    whatsapp: "+5511999992801",
    x: "maiconaraujo",
  },
  premium: true,
};
