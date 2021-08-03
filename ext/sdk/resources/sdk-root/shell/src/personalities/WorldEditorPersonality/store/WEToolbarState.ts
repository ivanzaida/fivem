import { makeAutoObservable } from "mobx";
import { registerInterruptingCommandBinding } from "../command-bindings";
import { WECommand, WECommandScope, WECommandType } from "../constants/commands";

export enum WETool {
  Patches,
  Additions,
  AddObject,
  StatusCenter,
  Environment,
  Properties,
  Settings,
}

export enum WEToolSide {
  LEFT_TOP = 'left_top',
  LEFT_BOTTOM = 'left_bottom',
  RIGHT = 'right',
}

export const TOOL_CONFIG: Record<WETool, { side: WEToolSide, command?: WECommandType }> = {
  [WETool.Patches]: { side: WEToolSide.LEFT_TOP, command: WECommand.TOOL_PATCHES_TOGGLE },
  [WETool.Additions]: { side: WEToolSide.LEFT_TOP, command: WECommand.TOOL_ADDITIONS_TOGGLE },
  [WETool.AddObject]: { side: WEToolSide.LEFT_TOP, command: WECommand.TOOL_ADD_OBJECT_TOGGLE },

  [WETool.Properties]: { side: WEToolSide.LEFT_BOTTOM },

  [WETool.Settings]: { side: WEToolSide.RIGHT },
  [WETool.Environment]: { side: WEToolSide.RIGHT, command: WECommand.TOOL_ENVIRONMENT_TOGGLE },
  [WETool.StatusCenter]: { side: WEToolSide.RIGHT },
};

export function getToolSide(tool: WETool): WEToolSide {
  return TOOL_CONFIG[tool].side;
}

export function getToolCommand(tool: WETool): WECommandType | void {
  return TOOL_CONFIG[tool].command;
}

export const WEToolbarState = new class WEToolbarState {
  private activeTool: Record<WEToolSide, WETool | null> = {
    [WEToolSide.LEFT_TOP]: null,
    [WEToolSide.LEFT_BOTTOM]: null,
    [WEToolSide.RIGHT]: null,
  };

  constructor() {
    makeAutoObservable(this);

    this.bindCommands();
  }

  private bindCommands() {
    registerInterruptingCommandBinding({
      command: WECommand.TOOL_PATCHES_TOGGLE,
      scope: WECommandScope.EDITOR,
      execute: () => this.toggleTool(WETool.Patches),
    }, {
      code: 'KeyQ',
      ctrl: true,
    });

    registerInterruptingCommandBinding({
      command: WECommand.TOOL_ADDITIONS_TOGGLE,
      scope: WECommandScope.EDITOR,
      execute: () => this.toggleTool(WETool.Additions),
    }, {
      code: 'KeyW',
      ctrl: true,
    });

    registerInterruptingCommandBinding({
      command: WECommand.TOOL_ADD_OBJECT_TOGGLE,
      scope: WECommandScope.EDITOR,
      execute: () => this.toggleTool(WETool.AddObject),
    }, {
      code: 'KeyA',
      ctrl: true,
    });

    registerInterruptingCommandBinding({
      command: WECommand.TOOL_ENVIRONMENT_TOGGLE,
      scope: WECommandScope.EDITOR,
      execute: () => this.toggleTool(WETool.Environment),
    }, {
      code: 'KeyE',
      ctrl: true,
    });
  }

  isSideActive(side: WEToolSide): boolean {
    return this.activeTool[side] !== null;
  }

  isToolOpen(tool: WETool): boolean {
    return this.activeTool[getToolSide(tool)] === tool;
  }

  openTool(tool: WETool) {
    this.activeTool[getToolSide(tool)] = tool;
  }

  closeTool(tool: WETool) {
    this.activeTool[getToolSide(tool)] = null;
  }

  toggleTool(tool: WETool) {
    if (this.isToolOpen(tool)) {
      this.closeTool(tool);
    } else {
      this.openTool(tool);
    }
  }
};
