import { Encounter } from "../../types";
import { designSummitEncounters } from "./encounter-data/design-summit";
import { techConnectEncounters } from "./encounter-data/tech-connect";
import { investorMeetEncounters } from "./encounter-data/investor-meet";
import { foundersBreakfastEncounters } from "./encounter-data/founders-breakfast";
import { retailFuturesEncounters } from "./encounter-data/retail-futures";
import { aiFounderForumEncounters } from "./encounter-data/ai-founder-forum";
import { operatorSalonEncounters } from "./encounter-data/operator-salon";

export const initialEncounters: Encounter[] = [
  ...designSummitEncounters,
  ...techConnectEncounters,
  ...investorMeetEncounters,
  ...foundersBreakfastEncounters,
  ...retailFuturesEncounters,
  ...aiFounderForumEncounters,
  ...operatorSalonEncounters,
];
