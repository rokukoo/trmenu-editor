"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Plugin, PluginComponentProps } from "@/types/plugin";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PluginPanelProps {
  plugins: Plugin[];
  pluginProps: PluginComponentProps;
}

export function PluginPanel({ plugins, pluginProps }: PluginPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePluginId, setActivePluginId] = useState<string | null>(
    plugins[0]?.id || null
  );

  const activePlugin = plugins.find((p) => p.id === activePluginId);

  return (
    <div className="flex h-full">
      {/* 插件面板内容 */}
      <div
        className={cn(
          "transition-all duration-300 border-l overflow-hidden shrink-0",
          isExpanded ? "w-72" : "w-0"
        )}
      >
        {isExpanded && activePlugin && (
          <div className="flex flex-col h-full w-72 bg-background/50 backdrop-blur-sm">
            {/* 插件头部 */}
            <div className="p-3 border-b shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0 shadow-sm">
                  <activePlugin.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-xs truncate">
                    {activePlugin.name}
                  </h3>
                  <p className="text-[10px] text-muted-foreground truncate leading-tight">
                    {activePlugin.description}
                  </p>
                </div>
              </div>
            </div>

            {/* 插件切换标签 */}
            <div className="flex gap-0.5 p-1.5 border-b overflow-x-auto shrink-0 bg-muted/30">
              {plugins.map((plugin) => (
                <TooltipProvider key={plugin.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          plugin.id === activePluginId ? "secondary" : "ghost"
                        }
                        size="sm"
                        className="h-7 gap-1.5 shrink-0 text-xs px-2"
                        onClick={() => setActivePluginId(plugin.id)}
                      >
                        <plugin.icon className="h-3 w-3" />
                        <span className="text-xs">{plugin.name}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      <p>{plugin.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            {/* 插件内容区 */}
            <div className="flex-1 overflow-hidden">
              <activePlugin.component {...pluginProps} />
            </div>
          </div>
        )}
      </div>

      {/* 切换按钮 */}
      <div className="flex flex-col border-l shrink-0 bg-background/30">
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none hover:bg-accent/50 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                  <div className="relative">
                    {activePlugin && (
                      <>
                        <activePlugin.icon className="h-3.5 w-3.5" />
                        <ChevronLeft className="h-2.5 w-2.5 absolute -right-0.5 -bottom-0.5 text-muted-foreground" />
                      </>
                    )}
                  </div>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">
              <p>{isExpanded ? "收起插件面板" : "展开插件面板"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator />

        {/* 快速切换插件按钮 */}
        {!isExpanded && (
          <ScrollArea className="flex-1">
            <div className="flex flex-col">
              {plugins.map((plugin) => (
                <TooltipProvider key={plugin.id} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={
                          plugin.id === activePluginId ? "secondary" : "ghost"
                        }
                        size="icon"
                        className="h-10 w-10 rounded-none hover:bg-accent/50 transition-colors"
                        onClick={() => {
                          setActivePluginId(plugin.id);
                          setIsExpanded(true);
                        }}
                      >
                        <plugin.icon className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="text-xs">
                      <div className="space-y-0.5">
                        <p className="font-medium">{plugin.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {plugin.description}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
