import { ApplicationCommandData, ApplicationCommandDataResolvable } from "discord.js";

export interface registerCommandOption {
    guildId?: string;
    commands: ApplicationCommandDataResolvable[];
}