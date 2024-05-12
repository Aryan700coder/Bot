import { client } from "..";
import { Event } from "../structure/event";
export default new Event('ready', () => {
    console.log(`${client.user.username} is online!!`);
})