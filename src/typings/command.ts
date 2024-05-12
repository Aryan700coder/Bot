import ExtendedClient from "../structure/client";
import { ChatInputApplicationCommandData, CommandInteraction, SlashCommandBuilder } from "discord.js";

interface RunOptions {
    client: ExtendedClient;
    interaction: CommandInteraction;
}


type RunFunction = (options: RunOptions) => any;
export type CommandType = {
    cooldown?: number;
    devOnly?: boolean;
    run: RunFunction;
} & ChatInputApplicationCommandData;