/**
 * Command Registry
 * Registers and manages terminal commands
 */

export interface Command {
  name: string;
  description: string;
  usage?: string;
  aliases?: string[];
  execute: (args: string[]) => string | void;
}

class CommandRegistryClass {
  private commands = new Map<string, Command>();

  register(command: Command) {
    this.commands.set(command.name, command);
    
    // Register aliases
    command.aliases?.forEach(alias => {
      this.commands.set(alias, command);
    });
  }

  get(name: string): Command | undefined {
    return this.commands.get(name);
  }

  getAll(): Command[] {
    const uniqueCommands = new Set<Command>();
    this.commands.forEach(cmd => uniqueCommands.add(cmd));
    return Array.from(uniqueCommands);
  }

  has(name: string): boolean {
    return this.commands.has(name);
  }
}

export const CommandRegistry = new CommandRegistryClass();
