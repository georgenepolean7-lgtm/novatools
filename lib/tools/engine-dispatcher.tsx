import React from "react";
import { ToolDefinition } from "./tool-types";
import { DeveloperWidget } from "@/components/engines/DeveloperWidget";
import { CalculatorWidget } from "@/components/engines/CalculatorWidget";
import { IndiaWidget } from "@/components/engines/IndiaWidget";
import { TamilWidget } from "@/components/engines/TamilWidget";
import { DataWidget } from "@/components/engines/DataWidget";
import { SeoWidget } from "@/components/engines/SeoWidget";
import { WebmasterWidget } from "@/components/engines/WebmasterWidget";
import { FinanceWidget } from "@/components/engines/FinanceWidget";
import { EducationWidget } from "@/components/engines/EducationWidget";
import { A11yWidget } from "@/components/engines/A11yWidget";
import { PrivacyWidget } from "@/components/engines/PrivacyWidget";
import { SecurityWidget } from "@/components/engines/SecurityWidget";
import { TextWidget } from "@/components/engines/TextWidget";
import { QrWidget } from "@/components/engines/QrWidget";
import { FileWidget } from "@/components/engines/FileWidget";
import { PdfWidget } from "@/components/engines/PdfWidget";
import { ImageWidget } from "@/components/engines/ImageWidget";
import { AudioWidget } from "@/components/engines/AudioWidget";
import { TimeWidget } from "@/components/engines/TimeWidget";

export function renderToolWidget(tool: ToolDefinition): React.ReactNode {
  switch (tool.engineComponent) {
    case "developer":
      return <DeveloperWidget tool={tool} />;
    case "calculator":
      return <CalculatorWidget tool={tool} />;
    case "india":
      return <IndiaWidget tool={tool} />;
    case "tamil":
      return <TamilWidget tool={tool} />;
    case "data":
      return <DataWidget tool={tool} />;
    case "seo":
      return <SeoWidget tool={tool} />;
    case "webmaster":
      return <WebmasterWidget tool={tool} />;
    case "finance":
      return <FinanceWidget tool={tool} />;
    case "education":
      return <EducationWidget tool={tool} />;
    case "accessibility":
      return <A11yWidget tool={tool} />;
    case "privacy":
      return <PrivacyWidget tool={tool} />;
    case "security":
      return <SecurityWidget tool={tool} />;
    case "text":
      return <TextWidget tool={tool} />;
    case "qr":
      return <QrWidget tool={tool} />;
    case "file":
      return <FileWidget tool={tool} />;
    case "pdf":
      return <PdfWidget tool={tool} />;
    case "image":
      return <ImageWidget tool={tool} />;
    case "audio":
      return <AudioWidget tool={tool} />;
    case "time":
      return <TimeWidget tool={tool} />;
    default:
      return (
        <div className="p-8 text-center text-slate-400">
          Widget dispatcher initializing for {tool.name}...
        </div>
      );
  }
}
