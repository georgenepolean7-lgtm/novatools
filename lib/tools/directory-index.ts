// Generated Lightweight Tool Directory Index for Fast Search & Rendering
// Contains only minimal fields needed for Homepage & Search (15KB vs 520KB full registry)
import { ToolCategory } from "./tool-types";

export interface ToolDirectoryItem {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  shortDescription: string;
  keywords: string[];
  priority: number;
  isFeatured: boolean;
}

export const TOOL_DIRECTORY_ITEMS: ToolDirectoryItem[] = [
  {
    "id": "color-contrast-checker",
    "name": "WCAG Color Contrast Ratio Checker",
    "slug": "color-contrast-checker",
    "category": "accessibility",
    "shortDescription": "Check foreground and background color contrast ratios against WCAG 2.1 AA and AAA accessibility standards.",
    "keywords": [
      "color contrast checker",
      "wcag contrast checker",
      "check color contrast online",
      "wcag 2.1 aa aaa contrast",
      "accessible color ratio"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "html-image-alt-text-checker",
    "name": "Image Alt Text Accessibility & WCAG Auditor",
    "slug": "html-image-alt-text-checker",
    "category": "accessibility",
    "shortDescription": "Scan HTML markup for missing or empty <img> alt attributes to ensure screen reader accessibility.",
    "keywords": [
      "image alt text checker",
      "wcag alt text auditor",
      "check missing alt tags online",
      "screen reader image accessibility"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "aria-attribute-reference-validator",
    "name": "WAI-ARIA Attribute & Role Syntax Validator",
    "slug": "aria-attribute-reference-validator",
    "category": "accessibility",
    "shortDescription": "Inspect HTML elements for standard W3C WAI-ARIA 1.2 roles, aria-label, aria-expanded, and aria-hidden states.",
    "keywords": [
      "aria validator",
      "wai aria attribute checker",
      "check aria roles online",
      "aria-label syntax validator"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "touch-target-size-checker",
    "name": "Touch Target Size Checker (WCAG 2.5.5 / 48px)",
    "slug": "touch-target-size-checker",
    "category": "accessibility",
    "shortDescription": "Audit UI button and link dimensions against WCAG 2.5.5 (44x44px) and Google/Apple (48x48px) touch target rules.",
    "keywords": [
      "touch target size checker",
      "wcag 2.5.5 touch target",
      "48px tap target checker",
      "mobile button accessibility size"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "accessible-form-label-checker",
    "name": "Accessible Form Label & Input Auditor (WCAG 3.3.2)",
    "slug": "accessible-form-label-checker",
    "category": "accessibility",
    "shortDescription": "Audit form <input>, <select>, and <textarea> elements for accessible <label for='...'> or aria-label bindings.",
    "keywords": [
      "accessible form label checker",
      "wcag form input auditor",
      "check missing form labels",
      "screen reader form accessibility"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "heading-accessibility-hierarchy-checker",
    "name": "Heading Accessibility Hierarchy & Outline Auditor",
    "slug": "heading-accessibility-hierarchy-checker",
    "category": "accessibility",
    "shortDescription": "Audit HTML document heading structure for screen reader navigation, single H1 usage, and skipped levels.",
    "keywords": [
      "heading accessibility checker",
      "wcag heading hierarchy",
      "check h1 h2 h3 hierarchy",
      "screen reader document outline"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "loan-emi-calculator",
    "name": "Loan EMI Calculator",
    "slug": "loan-emi-calculator",
    "category": "calculators",
    "shortDescription": "Calculate exact monthly loan EMIs, interest payable, and total cost of home & car loans.",
    "keywords": [
      "emi calculator",
      "loan emi calculator",
      "home loan emi",
      "car loan calculator",
      "emi calculation online"
    ],
    "priority": 100,
    "isFeatured": true
  },
  {
    "id": "sip-calculator",
    "name": "SIP Investment & Wealth Calculator",
    "slug": "sip-calculator",
    "category": "calculators",
    "shortDescription": "Calculate future wealth growth and maturity returns from mutual fund Systematic Investment Plans (SIP).",
    "keywords": [
      "sip calculator",
      "mutual fund sip calculator",
      "systematic investment plan",
      "sip returns calculator"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "compound-interest-calculator",
    "name": "Compound Interest Calculator",
    "slug": "compound-interest-calculator",
    "category": "calculators",
    "shortDescription": "Calculate compound interest gains and final maturity balance with annual and monthly compounding.",
    "keywords": [
      "compound interest calculator",
      "calculate compound interest",
      "compound interest formula",
      "ci calculator"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "simple-interest-calculator",
    "name": "Simple Interest Calculator",
    "slug": "simple-interest-calculator",
    "category": "calculators",
    "shortDescription": "Calculate simple interest (SI) and total repayment amounts using A = P(1 + rt).",
    "keywords": [
      "simple interest calculator",
      "calculate simple interest",
      "si calculator",
      "simple interest formula"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "percentage-calculator",
    "name": "Percentage Calculator",
    "slug": "percentage-calculator",
    "category": "calculators",
    "shortDescription": "Calculate percentages (What is X% of Y, and X is what percent of Y) instantly.",
    "keywords": [
      "percentage calculator",
      "calculate percentage",
      "percent of number",
      "find percentage online"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "percentage-change-calculator",
    "name": "Percentage Change & Difference Calculator",
    "slug": "percentage-change-calculator",
    "category": "calculators",
    "shortDescription": "Calculate percentage increase or decrease between two numerical values.",
    "keywords": [
      "percentage change calculator",
      "percentage increase calculator",
      "percentage decrease",
      "percent difference"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "age-calculator",
    "name": "Age & Chronological Days Calculator",
    "slug": "age-calculator",
    "category": "calculators",
    "shortDescription": "Calculate exact chronological age in years, months, days, total weeks, and days lived.",
    "keywords": [
      "age calculator",
      "calculate age online",
      "how old am i",
      "chronological age calculator",
      "days lived calculator"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "date-difference-calculator",
    "name": "Date Difference & Duration Calculator",
    "slug": "date-difference-calculator",
    "category": "calculators",
    "shortDescription": "Calculate the exact number of days, weeks, and hours between two calendar dates.",
    "keywords": [
      "date difference calculator",
      "days between dates",
      "date duration calculator",
      "calculate days between two dates"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "bmi-calculator",
    "name": "BMI Calculator (Body Mass Index)",
    "slug": "bmi-calculator",
    "category": "calculators",
    "shortDescription": "Calculate Body Mass Index (BMI) and health category classification (Underweight, Normal, Overweight).",
    "keywords": [
      "bmi calculator",
      "body mass index calculator",
      "calculate bmi online",
      "bmi chart"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "discount-calculator",
    "name": "Shopping Discount & Savings Calculator",
    "slug": "discount-calculator",
    "category": "calculators",
    "shortDescription": "Calculate final sale price and total money saved during shopping and retail sales discounts.",
    "keywords": [
      "discount calculator",
      "calculate discount online",
      "sale price calculator",
      "shopping discount"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "sales-tax-calculator",
    "name": "Sales Tax & VAT Calculator",
    "slug": "sales-tax-calculator",
    "category": "calculators",
    "shortDescription": "Calculate sales tax, VAT, and total checkout prices for tax-exclusive and tax-inclusive items.",
    "keywords": [
      "sales tax calculator",
      "calculate sales tax",
      "vat calculator",
      "tax inclusive price"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "tip-calculator",
    "name": "Restaurant Tip & Bill Splitter Calculator",
    "slug": "tip-calculator",
    "category": "calculators",
    "shortDescription": "Calculate restaurant tips and split total bills evenly across dinner guests.",
    "keywords": [
      "tip calculator",
      "bill split calculator",
      "restaurant tip calculator",
      "split bill evenly"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "aspect-ratio-calculator",
    "name": "Aspect Ratio Calculator (Image & Video)",
    "slug": "aspect-ratio-calculator",
    "category": "calculators",
    "shortDescription": "Calculate proportionate dimensions and maintain aspect ratios (16:9, 4:3, 1:1) when resizing images.",
    "keywords": [
      "aspect ratio calculator",
      "image aspect ratio",
      "16:9 aspect ratio calculator",
      "screen ratio calculator"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "speed-distance-time-calculator",
    "name": "Speed, Distance & Time Calculator",
    "slug": "speed-distance-time-calculator",
    "category": "calculators",
    "shortDescription": "Solve for Speed (S = D/T), Distance (D = S × T), or Travel Time (T = D/S) instantly.",
    "keywords": [
      "speed distance time calculator",
      "calculate speed",
      "travel time calculator",
      "speed formula"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "fuel-cost-calculator",
    "name": "Fuel Cost & Mileage Trip Calculator",
    "slug": "fuel-cost-calculator",
    "category": "calculators",
    "shortDescription": "Estimate petrol/diesel trip expenses based on distance, vehicle mileage (km/L), and fuel prices.",
    "keywords": [
      "fuel cost calculator",
      "trip fuel calculator",
      "petrol cost calculator",
      "mileage cost calculator"
    ],
    "priority": 85,
    "isFeatured": true
  },
  {
    "id": "overtime-pay-calculator",
    "name": "Overtime Pay & Wage Calculator",
    "slug": "overtime-pay-calculator",
    "category": "calculators",
    "shortDescription": "Calculate overtime compensation at 1.5x (time-and-a-half) or 2.0x (double time) hourly rates.",
    "keywords": [
      "overtime calculator",
      "overtime pay calculator",
      "time and a half calculator",
      "calculate overtime wages"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "bmr-calculator",
    "name": "BMR Calculator (Basal Metabolic Rate)",
    "slug": "bmr-calculator",
    "category": "calculators",
    "shortDescription": "Calculate daily basal calories burned at rest using the Mifflin-St Jeor metabolic formula.",
    "keywords": [
      "bmr calculator",
      "basal metabolic rate calculator",
      "calculate bmr online",
      "calories burned at rest"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "calorie-deficit-calculator",
    "name": "Calorie Deficit & Fat Loss Calculator",
    "slug": "calorie-deficit-calculator",
    "category": "calculators",
    "shortDescription": "Calculate daily calorie intake targets and projected weekly fat loss rates.",
    "keywords": [
      "calorie deficit calculator",
      "weight loss calorie calculator",
      "calculate calorie deficit",
      "fat loss target"
    ],
    "priority": 85,
    "isFeatured": true
  },
  {
    "id": "salary-to-hourly-calculator",
    "name": "Salary to Hourly Wage Calculator",
    "slug": "salary-to-hourly-calculator",
    "category": "calculators",
    "shortDescription": "Convert annual gross salary into hourly, daily, weekly, and monthly pay rates.",
    "keywords": [
      "salary to hourly",
      "convert salary to hourly wage",
      "annual salary to hourly rate",
      "wage calculator"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "hourly-to-salary-calculator",
    "name": "Hourly to Salary Calculator",
    "slug": "hourly-to-salary-calculator",
    "category": "calculators",
    "shortDescription": "Convert hourly pay rates into equivalent weekly, monthly, and annual gross salaries.",
    "keywords": [
      "hourly to salary",
      "convert hourly rate to annual salary",
      "hourly wage to yearly",
      "salary converter"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "cagr-calculator",
    "name": "CAGR Calculator (Compound Annual Growth Rate)",
    "slug": "cagr-calculator",
    "category": "calculators",
    "shortDescription": "Calculate Compound Annual Growth Rate (CAGR) for stocks, mutual funds, and business revenues.",
    "keywords": [
      "cagr calculator",
      "compound annual growth rate",
      "calculate cagr online",
      "investment growth rate"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "inflation-calculator",
    "name": "Inflation & Purchasing Power Calculator",
    "slug": "inflation-calculator",
    "category": "calculators",
    "shortDescription": "Calculate future living costs and purchasing power erosion over time due to inflation rates.",
    "keywords": [
      "inflation calculator",
      "purchasing power calculator",
      "calculate inflation impact",
      "future value of money"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "markup-calculator",
    "name": "Price Markup Calculator",
    "slug": "markup-calculator",
    "category": "calculators",
    "shortDescription": "Calculate selling price, gross profit, and profit margin from cost price and markup percentage.",
    "keywords": [
      "markup calculator",
      "calculate markup",
      "cost price to selling price",
      "profit markup"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "margin-calculator",
    "name": "Gross Profit Margin Calculator",
    "slug": "margin-calculator",
    "category": "calculators",
    "shortDescription": "Calculate gross profit margin percentage and net revenue margins from revenue and cost of goods sold.",
    "keywords": [
      "margin calculator",
      "gross profit margin",
      "calculate profit margin",
      "revenue margin calculator"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "time-calculator",
    "name": "Time Duration & Addition Calculator",
    "slug": "time-calculator",
    "category": "calculators",
    "shortDescription": "Add or subtract hours, minutes, and seconds between two time durations.",
    "keywords": [
      "time calculator",
      "add time",
      "subtract time",
      "hours minutes seconds calculator",
      "time duration calculator"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "number-to-words-converter",
    "name": "Number to Words & Cheque Amount Converter",
    "slug": "number-to-words-converter",
    "category": "calculators",
    "shortDescription": "Convert numerical digits into English words formatted for bank cheques and financial invoices.",
    "keywords": [
      "number to words",
      "convert number to words online",
      "cheque amount in words",
      "numbers to words converter"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "length-unit-converter",
    "name": "Length & Distance Unit Converter",
    "slug": "length-unit-converter",
    "category": "calculators",
    "shortDescription": "Convert length units across Kilometers, Meters, Centimeters, Miles, Feet, and Inches.",
    "keywords": [
      "length converter",
      "meters to feet",
      "km to miles",
      "convert length online",
      "inches to cm"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "weight-unit-converter",
    "name": "Weight & Mass Unit Converter",
    "slug": "weight-unit-converter",
    "category": "calculators",
    "shortDescription": "Convert weights across Kilograms (kg), Grams (g), Pounds (lbs), Ounces (oz), and Milligrams.",
    "keywords": [
      "weight converter",
      "kg to lbs",
      "pounds to kg",
      "convert weight online",
      "grams to ounces"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "temperature-converter",
    "name": "Temperature Unit Converter",
    "slug": "temperature-converter",
    "category": "calculators",
    "shortDescription": "Convert temperatures between Celsius (°C), Fahrenheit (°F), and Kelvin (K).",
    "keywords": [
      "temperature converter",
      "celsius to fahrenheit",
      "fahrenheit to celsius",
      "c to f converter",
      "kelvin to celsius"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "digital-storage-converter",
    "name": "Digital Data Storage Converter",
    "slug": "digital-storage-converter",
    "category": "calculators",
    "shortDescription": "Convert digital data units across Bytes, Kilobytes (KB), Megabytes (MB), Gigabytes (GB), and Terabytes (TB).",
    "keywords": [
      "storage converter",
      "mb to gb",
      "gb to tb",
      "bytes to megabytes",
      "digital data converter"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "audio-file-bitrate-size-calculator",
    "name": "Audio File Size & Bitrate Calculator (WAV / MP3 / AAC)",
    "slug": "audio-file-bitrate-size-calculator",
    "category": "calculators",
    "shortDescription": "Calculate uncompressed WAV, 320kbps MP3, and AAC audio file sizes from sample rate, bit depth, channels, and duration.",
    "keywords": [
      "audio file size calculator",
      "calculate audio bitrate size",
      "wav file size calculator",
      "mp3 size estimator"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "audio-duration-to-samples-converter",
    "name": "Audio Duration to Samples & Video Frames Converter",
    "slug": "audio-duration-to-samples-converter",
    "category": "calculators",
    "shortDescription": "Convert audio duration (seconds) into digital sample counts (44.1kHz, 48kHz, 96kHz) and video frames (24fps, 30fps, 60fps).",
    "keywords": [
      "audio duration to samples",
      "calculate samples from seconds",
      "seconds to video frames converter",
      "48khz sample calculator"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "audio-bpm-tempo-delay-calculator",
    "name": "BPM Tempo to Delay Time & LFO Frequency Calculator",
    "slug": "audio-bpm-tempo-delay-calculator",
    "category": "calculators",
    "shortDescription": "Calculate delay times in milliseconds (1/4, 1/8, 1/16, triplet) and LFO frequencies in Hz for music production from BPM.",
    "keywords": [
      "bpm to delay calculator",
      "tempo to milliseconds",
      "bpm to ms delay time",
      "music production delay calculator"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "audio-metadata-inspector",
    "name": "Audio Format & Track Property Inspector",
    "slug": "audio-metadata-inspector",
    "category": "calculators",
    "shortDescription": "Inspect audio track duration, estimated bitrates, channel counts, and audio characteristics in-browser.",
    "keywords": [
      "audio metadata inspector",
      "inspect audio track online",
      "check audio bitrate duration",
      "audio properties viewer"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "world-clock-timezone-converter",
    "name": "World Clock & Global Timezone Converter",
    "slug": "world-clock-timezone-converter",
    "category": "calculators",
    "shortDescription": "Convert meeting times across major global timezones (IST, UTC, EST, PST, GMT, SGT, JST) with daylight saving awareness.",
    "keywords": [
      "timezone converter",
      "world clock meeting converter",
      "ist to est converter",
      "convert time across timezones online"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "business-hours-overlap-calculator",
    "name": "Business Hours International Overlap Calculator",
    "slug": "business-hours-overlap-calculator",
    "category": "calculators",
    "shortDescription": "Calculate common working hours overlap (9 AM - 6 PM) between two international cities for scheduling remote teams.",
    "keywords": [
      "business hours overlap calculator",
      "remote team meeting overlap",
      "find timezone overlap",
      "work hours overlap between cities"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "working-days-business-calculator",
    "name": "Working Business Days Calculator (Excluding Weekends)",
    "slug": "working-days-business-calculator",
    "category": "calculators",
    "shortDescription": "Calculate total working business days between two calendar dates, excluding Saturdays and Sundays.",
    "keywords": [
      "working days calculator",
      "calculate business days online",
      "working days between two dates",
      "exclude weekends calculator"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "week-number-iso-calculator",
    "name": "ISO 8601 Week Number & Day of Year Calculator",
    "slug": "week-number-iso-calculator",
    "category": "calculators",
    "shortDescription": "Calculate the official ISO 8601 calendar week number, day of year, leap year status, and days remaining.",
    "keywords": [
      "week number calculator",
      "iso 8601 week number",
      "what week of the year is it",
      "day of year calculator"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "roman-numerals-converter",
    "name": "Roman Numerals Converter (Numbers ↔ Roman)",
    "slug": "roman-numerals-converter",
    "category": "calculators",
    "shortDescription": "Convert decimal numbers (1-3999) to Roman Numerals (MMXXIV) and decode Roman Numerals back to numbers.",
    "keywords": [
      "roman numerals converter",
      "number to roman numerals",
      "roman to decimal",
      "roman numeral calculator online"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "water-intake-calculator",
    "name": "Daily Water Intake & Hydration Calculator",
    "slug": "water-intake-calculator",
    "category": "calculators",
    "shortDescription": "Calculate your recommended daily water intake in Liters and 250ml glasses based on body weight and exercise.",
    "keywords": [
      "water intake calculator",
      "daily water requirement calculator",
      "how much water should i drink",
      "hydration calculator online"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "json-to-csv",
    "name": "JSON to CSV Converter",
    "slug": "json-to-csv",
    "category": "data",
    "shortDescription": "Convert JSON arrays and objects to RFC 4180 CSV files with automatic header detection.",
    "keywords": [
      "json to csv",
      "convert json to csv online",
      "json to excel csv",
      "json to spreadsheet"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "csv-to-json",
    "name": "CSV to JSON Converter",
    "slug": "csv-to-json",
    "category": "data",
    "shortDescription": "Convert CSV and TSV spreadsheets into structured JSON arrays of objects with quotation support.",
    "keywords": [
      "csv to json",
      "convert csv to json online",
      "csv to json parser",
      "spreadsheet to json"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "csv-to-markdown-table",
    "name": "CSV to Markdown Table Converter",
    "slug": "csv-to-markdown-table",
    "category": "data",
    "shortDescription": "Convert CSV data into GitHub-flavored Markdown tables for documentation and README files.",
    "keywords": [
      "csv to markdown",
      "convert csv to markdown table",
      "github markdown table generator",
      "csv to md table"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "markdown-table-to-csv",
    "name": "Markdown Table to CSV Converter",
    "slug": "markdown-table-to-csv",
    "category": "data",
    "shortDescription": "Convert GitHub-flavored Markdown tables (| col |) back into standard CSV spreadsheets.",
    "keywords": [
      "markdown to csv",
      "convert markdown table to csv",
      "md table to csv online",
      "extract table from markdown"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "json-to-typescript-interfaces",
    "name": "JSON to TypeScript Interface Generator",
    "slug": "json-to-typescript-interfaces",
    "category": "data",
    "shortDescription": "Generate strongly-typed TypeScript interface definitions automatically from JSON API responses.",
    "keywords": [
      "json to typescript",
      "json to ts interface",
      "generate typescript from json",
      "typescript type generator"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "xml-formatter",
    "name": "XML Formatter & Beautifier",
    "slug": "xml-formatter",
    "category": "data",
    "shortDescription": "Format and indent XML and SVG files with clean tag hierarchies and tree visualization.",
    "keywords": [
      "xml formatter",
      "beautify xml",
      "format xml online",
      "xml indenter",
      "svg formatter"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "xml-validator",
    "name": "XML Syntax Validator & Linter",
    "slug": "xml-validator",
    "category": "data",
    "shortDescription": "Validate XML syntax and detect unclosed tags, malformed attributes, and parser errors.",
    "keywords": [
      "xml validator",
      "validate xml online",
      "xml syntax checker",
      "xml linter"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "xml-to-json",
    "name": "XML to JSON Converter",
    "slug": "xml-to-json",
    "category": "data",
    "shortDescription": "Convert XML data feeds and documents into structured JSON objects and arrays.",
    "keywords": [
      "xml to json",
      "convert xml to json online",
      "xml to json converter",
      "rss to json"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "json-to-xml",
    "name": "JSON to XML Converter",
    "slug": "json-to-xml",
    "category": "data",
    "shortDescription": "Convert JSON objects and arrays into well-formed XML documents with XML declaration headers.",
    "keywords": [
      "json to xml",
      "convert json to xml online",
      "json to xml converter",
      "json to soap xml"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "csv-column-extractor",
    "name": "CSV Column Extractor & Filter",
    "slug": "csv-column-extractor",
    "category": "data",
    "shortDescription": "Extract specific column names or column index numbers from large CSV spreadsheet files.",
    "keywords": [
      "csv column extractor",
      "extract columns from csv",
      "filter csv columns",
      "csv column selector"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "csv-delimiter-converter",
    "name": "CSV Delimiter Converter (Comma, Semicolon, Pipe, Tab)",
    "slug": "csv-delimiter-converter",
    "category": "data",
    "shortDescription": "Convert delimiters between Comma (,), Semicolon (;), Pipe (|), and Tab (\\\\t) in tabular data.",
    "keywords": [
      "csv delimiter converter",
      "change csv delimiter",
      "semicolon to comma csv",
      "pipe separated to csv"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "csv-to-sql-insert",
    "name": "CSV to SQL INSERT Statement Generator",
    "slug": "csv-to-sql-insert",
    "category": "data",
    "shortDescription": "Generate SQL INSERT INTO table (columns) VALUES (...) queries directly from CSV spreadsheet rows.",
    "keywords": [
      "csv to sql",
      "csv to sql insert",
      "convert csv to sql queries",
      "sql insert generator from csv"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "json-to-sql-insert",
    "name": "JSON to SQL INSERT Statement Generator",
    "slug": "json-to-sql-insert",
    "category": "data",
    "shortDescription": "Generate SQL INSERT queries from an array of JSON records for MySQL, PostgreSQL, and SQLite.",
    "keywords": [
      "json to sql",
      "json to sql insert",
      "convert json to sql queries",
      "json database insert"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "tsv-to-csv",
    "name": "TSV to CSV Converter (Tab to Comma)",
    "slug": "tsv-to-csv",
    "category": "data",
    "shortDescription": "Convert Tab-Separated Values (TSV) into Comma-Separated Values (CSV) with RFC 4180 escaping.",
    "keywords": [
      "tsv to csv",
      "convert tsv to csv online",
      "tab separated to csv",
      "tsv to excel csv"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "csv-to-tsv",
    "name": "CSV to TSV Converter (Comma to Tab)",
    "slug": "csv-to-tsv",
    "category": "data",
    "shortDescription": "Convert Comma-Separated Values (CSV) into Tab-Separated Values (TSV) for pasting into spreadsheets.",
    "keywords": [
      "csv to tsv",
      "convert csv to tsv online",
      "csv to tab separated",
      "csv to excel paste"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "json-flattener",
    "name": "JSON Flattener (Nested to Dot Notation)",
    "slug": "json-flattener",
    "category": "data",
    "shortDescription": "Flatten deeply nested JSON objects and arrays into single-level dot-notation key paths (e.g. user.address.city).",
    "keywords": [
      "json flattener",
      "flatten json online",
      "nested json to flat",
      "dot notation json"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "json-unflattener",
    "name": "JSON Unflattener (Dot Notation to Nested)",
    "slug": "json-unflattener",
    "category": "data",
    "shortDescription": "Reconstruct deeply nested JSON object hierarchies from flat dot-notation key paths.",
    "keywords": [
      "json unflattener",
      "unflatten json online",
      "dot notation to nested json",
      "expand flat json"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "json-key-sorter",
    "name": "JSON Key Sorter (Alphabetical Order)",
    "slug": "json-key-sorter",
    "category": "data",
    "shortDescription": "Sort all JSON object keys in alphabetical order recursively across all nested levels.",
    "keywords": [
      "json key sorter",
      "sort json keys alphabetically",
      "order json keys",
      "json alphabetizer"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "csv-row-filter",
    "name": "CSV Row Filter & Searcher",
    "slug": "csv-row-filter",
    "category": "data",
    "shortDescription": "Filter CSV spreadsheet rows matching search keywords, text patterns, or criteria while keeping headers.",
    "keywords": [
      "csv row filter",
      "filter csv rows online",
      "search csv data",
      "csv record filter"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "csv-duplicate-row-remover",
    "name": "CSV Duplicate Row Remover",
    "slug": "csv-duplicate-row-remover",
    "category": "data",
    "shortDescription": "Remove identical duplicate rows from CSV spreadsheets while preserving the header row.",
    "keywords": [
      "csv duplicate remover",
      "remove duplicate rows in csv",
      "deduplicate csv online",
      "clean csv duplicates"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "json-path-query",
    "name": "JSON Path Query & Selector Tool",
    "slug": "json-path-query",
    "category": "data",
    "shortDescription": "Extract specific values and subtrees from JSON using dot and bracket notation paths (e.g. data.users[0].name).",
    "keywords": [
      "json path query",
      "query json online",
      "json path selector",
      "extract json value"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "csv-to-html-table",
    "name": "CSV to HTML Table Converter",
    "slug": "csv-to-html-table",
    "category": "data",
    "shortDescription": "Convert CSV spreadsheets into clean HTML <table><thead><tbody> markup with semantic tags.",
    "keywords": [
      "csv to html table",
      "convert csv to html table",
      "csv to table html generator",
      "html table builder"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "html-table-to-csv",
    "name": "HTML Table to CSV Converter",
    "slug": "html-table-to-csv",
    "category": "data",
    "shortDescription": "Extract tabular data from raw HTML <table> markup and convert into downloadable CSV spreadsheets.",
    "keywords": [
      "html table to csv",
      "convert html table to csv",
      "extract table from html",
      "html table parser"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "json-data-statistics",
    "name": "JSON Dataset Statistics & Analyzer",
    "slug": "json-data-statistics",
    "category": "data",
    "shortDescription": "Compute count, sum, average, min, and max metrics across numeric fields in JSON dataset arrays.",
    "keywords": [
      "json statistics",
      "analyze json dataset",
      "json metrics calculator",
      "json data analyzer"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "csv-column-reorder",
    "name": "CSV Column Reorder & Swapper",
    "slug": "csv-column-reorder",
    "category": "data",
    "shortDescription": "Reorder, swap, or rearrange columns in CSV spreadsheet files using custom column index orders.",
    "keywords": [
      "csv column reorder",
      "rearrange csv columns",
      "swap csv columns",
      "reorder columns in csv"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "sql-to-json-converter",
    "name": "SQL INSERT to JSON Converter",
    "slug": "sql-to-json-converter",
    "category": "data",
    "shortDescription": "Convert SQL INSERT INTO statements and table dumps into a structured JSON array of objects.",
    "keywords": [
      "sql to json",
      "convert sql insert to json",
      "sql dump to json array",
      "database insert to json"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "json-formatter",
    "name": "JSON Formatter & Beautifier",
    "slug": "json-formatter",
    "category": "developer",
    "shortDescription": "Format, indent, and validate messy JSON data online with instant syntax tree view.",
    "keywords": [
      "json formatter",
      "beautify json",
      "json validator",
      "json pretty print",
      "format json online"
    ],
    "priority": 100,
    "isFeatured": true
  },
  {
    "id": "json-minifier",
    "name": "JSON Minifier & Compressor",
    "slug": "json-minifier",
    "category": "developer",
    "shortDescription": "Minify and compress JSON strings by stripping unnecessary whitespace and newlines.",
    "keywords": [
      "json minifier",
      "compress json",
      "minify json online",
      "strip json whitespace"
    ],
    "priority": 95,
    "isFeatured": false
  },
  {
    "id": "json-validator",
    "name": "JSON Syntax Validator",
    "slug": "json-validator",
    "category": "developer",
    "shortDescription": "Validate JSON syntax and detect parsing errors with line numbers.",
    "keywords": [
      "json validator",
      "check json syntax",
      "validate json online",
      "json lint"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "sql-formatter",
    "name": "SQL Formatter & Beautifier",
    "slug": "sql-formatter",
    "category": "developer",
    "shortDescription": "Format and indent complex SQL queries (SELECT, JOIN, WHERE) for maximum readability.",
    "keywords": [
      "sql formatter",
      "beautify sql",
      "format sql query",
      "sql beautifier online",
      "clean sql"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "jwt-decoder",
    "name": "JWT Token Decoder & Inspector",
    "slug": "jwt-decoder",
    "category": "developer",
    "shortDescription": "Decode JSON Web Tokens (JWT) to inspect header claims, payload data, and expiration dates.",
    "keywords": [
      "jwt decoder",
      "decode jwt",
      "jwt token inspector",
      "json web token decoder",
      "view jwt payload"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "base64-encoder",
    "name": "Base64 Text Encoder",
    "slug": "base64-encoder",
    "category": "developer",
    "shortDescription": "Encode plain text, UTF-8 strings, and special characters into Base64 format.",
    "keywords": [
      "base64 encoder",
      "text to base64",
      "encode base64 online",
      "base64 string converter"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "base64-decoder",
    "name": "Base64 Text Decoder",
    "slug": "base64-decoder",
    "category": "developer",
    "shortDescription": "Decode Base64 encoded strings back into clean, readable plain text.",
    "keywords": [
      "base64 decoder",
      "base64 to text",
      "decode base64 online",
      "base64 string decoder"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "url-encoder",
    "name": "URL Encoder",
    "slug": "url-encoder",
    "category": "developer",
    "shortDescription": "Encode special characters and query strings into percent-encoded URL formats.",
    "keywords": [
      "url encoder",
      "percent encoding",
      "encode url online",
      "url escape characters"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "url-decoder",
    "name": "URL Decoder",
    "slug": "url-decoder",
    "category": "developer",
    "shortDescription": "Decode percent-encoded (%20, %26) URLs back into normal human-readable text.",
    "keywords": [
      "url decoder",
      "decode url online",
      "percent decoding",
      "url unescape"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "uuid-generator",
    "name": "UUID v4 Generator",
    "slug": "uuid-generator",
    "category": "developer",
    "shortDescription": "Generate cryptographically secure random Version 4 UUIDs & GUIDs instantly.",
    "keywords": [
      "uuid generator",
      "uuid v4",
      "guid generator",
      "generate uuid online",
      "random uuid"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "hash-generator",
    "name": "SHA-256 & Hash Generator",
    "slug": "hash-generator",
    "category": "developer",
    "shortDescription": "Compute cryptographic hashes (SHA-256, SHA-512, SHA-1) for any text or string.",
    "keywords": [
      "sha256 generator",
      "hash generator",
      "sha-512 generator",
      "generate hash online",
      "sha1 online"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "regex-tester",
    "name": "Regex Tester & Debugger",
    "slug": "regex-tester",
    "category": "developer",
    "shortDescription": "Test regular expressions with real-time matching, flags, and match position offsets.",
    "keywords": [
      "regex tester",
      "test regex online",
      "regular expression debugger",
      "javascript regex test"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "unix-timestamp-converter",
    "name": "Unix Timestamp to Date Converter",
    "slug": "unix-timestamp-converter",
    "category": "developer",
    "shortDescription": "Convert Unix epoch timestamps (seconds & milliseconds) to human-readable UTC and local dates.",
    "keywords": [
      "unix timestamp converter",
      "epoch to date",
      "timestamp to human readable",
      "convert unix time"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "html-minifier",
    "name": "HTML Minifier & Compressor",
    "slug": "html-minifier",
    "category": "developer",
    "shortDescription": "Minify HTML markup by removing whitespace, comments, and redundant line breaks.",
    "keywords": [
      "html minifier",
      "compress html online",
      "minify html code",
      "html optimizer"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "css-minifier",
    "name": "CSS Minifier & Compressor",
    "slug": "css-minifier",
    "category": "developer",
    "shortDescription": "Compress CSS stylesheets by stripping comments, spaces, and duplicate semicolons.",
    "keywords": [
      "css minifier",
      "compress css online",
      "minify stylesheet",
      "css optimizer"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "hex-to-rgb-converter",
    "name": "Hex to RGB Color Converter",
    "slug": "hex-to-rgb-converter",
    "category": "developer",
    "shortDescription": "Convert 3-digit and 6-digit Hexadecimal color codes (#3B82F6) into RGB and RGBA values.",
    "keywords": [
      "hex to rgb",
      "convert hex to rgb online",
      "hex color to rgb",
      "css hex converter"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "rgb-to-hex-converter",
    "name": "RGB to Hex Color Converter",
    "slug": "rgb-to-hex-converter",
    "category": "developer",
    "shortDescription": "Convert RGB color values (59, 130, 246) into standard 6-digit CSS Hex color codes.",
    "keywords": [
      "rgb to hex",
      "convert rgb to hex online",
      "rgb color to hex",
      "css rgb converter"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "px-to-rem-converter",
    "name": "Pixel to REM Converter (CSS)",
    "slug": "px-to-rem-converter",
    "category": "developer",
    "shortDescription": "Convert pixel (px) values to relative root em (rem) units based on 16px root font size.",
    "keywords": [
      "px to rem",
      "pixel to rem converter",
      "convert px to rem online",
      "css rem calculator"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "html-entity-encoder",
    "name": "HTML Entity Encoder",
    "slug": "html-entity-encoder",
    "category": "developer",
    "shortDescription": "Convert special characters (<, >, &, \\",
    "keywords": [
      "html entity encoder",
      "escape html characters",
      "convert text to html entities",
      "html special characters"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "html-entity-decoder",
    "name": "HTML Entity Decoder",
    "slug": "html-entity-decoder",
    "category": "developer",
    "shortDescription": "Decode HTML entities (&lt;, &gt;, &amp;, &quot;) back into standard human-readable text characters.",
    "keywords": [
      "html entity decoder",
      "decode html entities online",
      "unescape html",
      "convert html entities to text"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "css-box-shadow-generator",
    "name": "CSS Box Shadow Generator",
    "slug": "css-box-shadow-generator",
    "category": "developer",
    "shortDescription": "Generate multi-layer CSS box shadows with live interactive visual preview sliders.",
    "keywords": [
      "css box shadow generator",
      "box shadow generator",
      "css shadow generator",
      "create box shadow"
    ],
    "priority": 85,
    "isFeatured": true
  },
  {
    "id": "css-gradient-generator",
    "name": "CSS Gradient Generator",
    "slug": "css-gradient-generator",
    "category": "developer",
    "shortDescription": "Create colorful linear and radial CSS gradients with live preview and custom angle controls.",
    "keywords": [
      "css gradient generator",
      "linear gradient generator",
      "radial gradient generator",
      "css gradient maker"
    ],
    "priority": 85,
    "isFeatured": true
  },
  {
    "id": "binary-to-decimal-converter",
    "name": "Binary to Decimal Converter",
    "slug": "binary-to-decimal-converter",
    "category": "developer",
    "shortDescription": "Convert binary numbers (base-2) into decimal (base-10), hexadecimal (base-16), and octal.",
    "keywords": [
      "binary to decimal",
      "convert binary to decimal online",
      "binary to hex",
      "base2 to base10"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "decimal-to-binary-converter",
    "name": "Decimal to Binary Converter",
    "slug": "decimal-to-binary-converter",
    "category": "developer",
    "shortDescription": "Convert standard decimal numbers into binary bits (8-bit, 16-bit, 32-bit formatted).",
    "keywords": [
      "decimal to binary",
      "convert decimal to binary online",
      "number to binary",
      "base10 to base2"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "ascii-to-hex-converter",
    "name": "ASCII to Hex Converter",
    "slug": "ascii-to-hex-converter",
    "category": "developer",
    "shortDescription": "Convert text characters and ASCII strings into hexadecimal byte representations.",
    "keywords": [
      "ascii to hex",
      "text to hex converter",
      "convert ascii to hex online",
      "string to hex bytes"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "hex-to-ascii-converter",
    "name": "Hex to ASCII Text Converter",
    "slug": "hex-to-ascii-converter",
    "category": "developer",
    "shortDescription": "Decode hexadecimal byte strings back into human-readable ASCII and UTF-8 text.",
    "keywords": [
      "hex to ascii",
      "hex to text converter",
      "decode hex to ascii online",
      "hex byte decoder"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "json-to-yaml",
    "name": "JSON to YAML Converter",
    "slug": "json-to-yaml",
    "category": "developer",
    "shortDescription": "Convert JSON configuration files into clean, readable YAML format instantly.",
    "keywords": [
      "json to yaml",
      "convert json to yaml online",
      "json to yml",
      "json yaml converter"
    ],
    "priority": 85,
    "isFeatured": true
  },
  {
    "id": "yaml-to-json",
    "name": "YAML to JSON Converter",
    "slug": "yaml-to-json",
    "category": "developer",
    "shortDescription": "Convert YAML files and configurations into standard, valid RFC 8259 JSON format.",
    "keywords": [
      "yaml to json",
      "convert yaml to json online",
      "yml to json",
      "yaml parser"
    ],
    "priority": 85,
    "isFeatured": true
  },
  {
    "id": "curl-to-fetch-converter",
    "name": "cURL to JavaScript Fetch Converter",
    "slug": "curl-to-fetch-converter",
    "category": "developer",
    "shortDescription": "Convert cURL terminal commands into ready-to-use JavaScript fetch() code snippets.",
    "keywords": [
      "curl to fetch",
      "curl to javascript",
      "convert curl to fetch online",
      "curl to js fetch"
    ],
    "priority": 85,
    "isFeatured": true
  },
  {
    "id": "text-diff-checker",
    "name": "Text & Code Diff Checker",
    "slug": "text-diff-checker",
    "category": "developer",
    "shortDescription": "Compare two text or code snippets line-by-line and inspect additions, removals, and modifications.",
    "keywords": [
      "text diff checker",
      "compare text online",
      "code diff tool",
      "diff checker online"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "cron-expression-descriptor",
    "name": "Cron Expression Parser & Human Schedule Explainer",
    "slug": "cron-expression-descriptor",
    "category": "developer",
    "shortDescription": "Parse standard 5-part and 6-part Cron expressions and convert them into plain English schedules.",
    "keywords": [
      "cron expression parser",
      "cron explainer online",
      "crontab descriptor",
      "cron to human readable",
      "cron schedule builder"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "env-file-validator-formatter",
    "name": ".env Environment File Validator & Formatter",
    "slug": "env-file-validator-formatter",
    "category": "developer",
    "shortDescription": "Validate .env configuration files, detect duplicate keys, syntax errors, and sort variables alphabetically.",
    "keywords": [
      "env file validator",
      "validate dot env file online",
      "format env file",
      "check env syntax online"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "package-json-semver-inspector",
    "name": "package.json Dependency & SemVer Inspector",
    "slug": "package-json-semver-inspector",
    "category": "developer",
    "shortDescription": "Inspect package.json dependencies, audit risky wildcard semver ranges (*, >=), and count devDependencies.",
    "keywords": [
      "package json inspector",
      "analyze package json online",
      "npm semver checker",
      "package json dependency audit"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "javascript-regex-string-escape",
    "name": "RegExp & JavaScript String Escape Utility",
    "slug": "javascript-regex-string-escape",
    "category": "developer",
    "shortDescription": "Escape special characters in strings (.*+?^${}()|[]\\\\) for safe use in new RegExp() and JS string literals.",
    "keywords": [
      "escape regex string",
      "javascript regex escape online",
      "escape special characters regex",
      "js string escape tool"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "code-indentation-converter",
    "name": "Code Indentation Converter (Spaces ↔ Tabs)",
    "slug": "code-indentation-converter",
    "category": "developer",
    "shortDescription": "Convert source code indentation between 2 spaces, 4 spaces, and hard Tabs (\\\\t) while trimming trailing whitespace.",
    "keywords": [
      "code indentation converter",
      "convert tabs to spaces",
      "convert spaces to tabs online",
      "fix code indentation"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "api-payload-size-calculator",
    "name": "API JSON Payload Size & Transfer Time Calculator",
    "slug": "api-payload-size-calculator",
    "category": "developer",
    "shortDescription": "Calculate exact UTF-8 byte sizes, Gzip/Brotli compressed estimates, and 3G/4G network transfer latency for API responses.",
    "keywords": [
      "api payload size calculator",
      "calculate json payload bytes",
      "gzip compression size estimator",
      "api response bandwidth calculator"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "gpa-calculator",
    "name": "College GPA & Semester Grade Calculator",
    "slug": "gpa-calculator",
    "category": "education",
    "shortDescription": "Calculate semester GPA and cumulative Grade Point Average across credit hours and letter grades.",
    "keywords": [
      "gpa calculator",
      "calculate gpa college",
      "semester gpa calculator",
      "cumulative gpa calculator",
      "grade point average"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "cgpa-to-percentage-converter",
    "name": "CGPA to Percentage Converter (CBSE / AICTE)",
    "slug": "cgpa-to-percentage-converter",
    "category": "education",
    "shortDescription": "Convert 10-point and 4-point CGPA scores to exact percentage marks using standard university formulas.",
    "keywords": [
      "cgpa to percentage",
      "convert cgpa to percent",
      "cbse cgpa converter",
      "aicte cgpa to percentage formula",
      "10 point cgpa to percent"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "citation-generator",
    "name": "Citation Generator (APA, MLA, Chicago)",
    "slug": "citation-generator",
    "category": "education",
    "shortDescription": "Generate formatted academic citations in APA 7th, MLA 8th, and Chicago styles for books and websites.",
    "keywords": [
      "citation generator",
      "apa citation generator",
      "mla citation generator",
      "chicago citation online",
      "academic reference generator"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "weighted-grade-calculator",
    "name": "Weighted Grade & Course Final Score Calculator",
    "slug": "weighted-grade-calculator",
    "category": "education",
    "shortDescription": "Calculate overall course percentage from weighted assignments, quizzes, projects, midterms, and finals.",
    "keywords": [
      "weighted grade calculator",
      "calculate course grade",
      "weighted average grade calculator",
      "college grade weighting"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "attendance-percentage-calculator",
    "name": "Student Attendance Percentage & Safe Bunk Calculator",
    "slug": "attendance-percentage-calculator",
    "category": "education",
    "shortDescription": "Calculate current attendance percentage, safe classes you can miss, or required consecutive attendance to reach 75%.",
    "keywords": [
      "attendance calculator",
      "safe bunk calculator",
      "calculate attendance percentage",
      "75 percent attendance calculator"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "exam-score-target-calculator",
    "name": "Final Exam Target Score Calculator",
    "slug": "exam-score-target-calculator",
    "category": "education",
    "shortDescription": "Calculate the exact score needed on your final exam to achieve your desired overall course grade.",
    "keywords": [
      "final exam calculator",
      "what score do i need on the final",
      "target grade calculator",
      "final grade calculator"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "study-time-planner-calculator",
    "name": "College Study Time Planner & Schedule Estimator",
    "slug": "study-time-planner-calculator",
    "category": "education",
    "shortDescription": "Estimate weekly and daily study hours based on semester credit units, course difficulty, and study days.",
    "keywords": [
      "study time calculator",
      "college study planner",
      "study hours per credit",
      "study schedule estimator"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "file-checksum-sha256",
    "name": "File Checksum & SHA-256 Verifier",
    "slug": "file-checksum-sha256",
    "category": "file",
    "shortDescription": "Calculate and verify cryptographic SHA-256, SHA-512, and MD5 checksums for any local file directly in your browser.",
    "keywords": [
      "file checksum",
      "sha256 file hash",
      "calculate file checksum online",
      "verify file integrity",
      "sha 512 file checker"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "file-metadata-inspector",
    "name": "File Metadata & Property Inspector",
    "slug": "file-metadata-inspector",
    "category": "file",
    "shortDescription": "Inspect exact byte sizes, MIME types, binary headers, and timestamps of local files in-browser.",
    "keywords": [
      "file metadata inspector",
      "view file properties online",
      "file size in bytes checker",
      "file mime type inspector"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "batch-file-renamer-preview",
    "name": "Batch File Renamer & Pattern Generator",
    "slug": "batch-file-renamer-preview",
    "category": "file",
    "shortDescription": "Preview batch renaming for photo lists and documents with sequential numbering (001, 002), prefixes, and find/replace.",
    "keywords": [
      "batch file renamer",
      "rename files online",
      "sequential file renaming tool",
      "bulk rename files generator"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "text-file-merger",
    "name": "Text & Log File Merger Tool",
    "slug": "text-file-merger",
    "category": "file",
    "shortDescription": "Combine multiple plain text files, code snippets, or server logs into a single consolidated file in-browser.",
    "keywords": [
      "text file merger",
      "combine text files online",
      "merge txt files",
      "merge log files online"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "text-file-splitter",
    "name": "Text & Log File Splitter Tool",
    "slug": "text-file-splitter",
    "category": "file",
    "shortDescription": "Split large text documents, CSV data, or log files by line count into manageable chunks in-browser.",
    "keywords": [
      "text file splitter",
      "split txt file online",
      "split large log file",
      "split csv by lines"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "duplicate-file-finder-by-hash",
    "name": "Duplicate File Finder & Hash Comparator",
    "slug": "duplicate-file-finder-by-hash",
    "category": "file",
    "shortDescription": "Detect identical duplicate files locally by calculating and comparing real-time SHA-256 cryptographic hashes.",
    "keywords": [
      "duplicate file finder",
      "compare files by hash online",
      "find duplicate files by sha256",
      "check identical files"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "file-extension-mime-detector",
    "name": "File Binary Signature & Magic Number Detector",
    "slug": "file-extension-mime-detector",
    "category": "file",
    "shortDescription": "Identify true file formats (PDF, PNG, JPG, ZIP, MP4, WebP) from raw binary header bytes (Magic Numbers).",
    "keywords": [
      "file magic number detector",
      "identify file type from binary header",
      "check true file format",
      "file signature detector"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "data-url-file-converter",
    "name": "File to Base64 Data URL Converter",
    "slug": "data-url-file-converter",
    "category": "file",
    "shortDescription": "Convert local images, fonts, and documents into Base64 Data URL schemes (`data:image/png;base64,...`) for web embedding.",
    "keywords": [
      "file to data url",
      "base64 data url converter",
      "convert image to data url online",
      "data uri generator"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "profit-margin-calculator",
    "name": "Profit Margin Calculator",
    "slug": "profit-margin-calculator",
    "category": "finance",
    "shortDescription": "Calculate gross profit margin percentage, markup percentage, and net profit from cost and selling price.",
    "keywords": [
      "profit margin calculator",
      "calculate profit margin",
      "markup calculator",
      "gross margin calculator",
      "ecommerce profit calculator"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "roi-calculator",
    "name": "ROI (Return on Investment) Calculator",
    "slug": "roi-calculator",
    "category": "finance",
    "shortDescription": "Calculate Return on Investment (ROI) percentage and annualized net returns on business and marketing campaigns.",
    "keywords": [
      "roi calculator",
      "return on investment calculator",
      "calculate roi online",
      "marketing roi calculator",
      "investment return percentage"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "break-even-calculator",
    "name": "Break-Even Point Calculator",
    "slug": "break-even-calculator",
    "category": "finance",
    "shortDescription": "Calculate unit sales and revenue required to cover fixed and variable business costs.",
    "keywords": [
      "break even calculator",
      "calculate break even point",
      "break even analysis",
      "break even units calculator"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "cash-flow-burn-rate-calculator",
    "name": "Startup Burn Rate & Runway Calculator",
    "slug": "cash-flow-burn-rate-calculator",
    "category": "finance",
    "shortDescription": "Calculate monthly gross burn, net burn, and business cash runway in months for startups and businesses.",
    "keywords": [
      "burn rate calculator",
      "startup runway calculator",
      "cash flow burn rate",
      "calculate business runway online"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "loan-amortization-schedule-calculator",
    "name": "Loan Amortization & Monthly EMI Calculator",
    "slug": "loan-amortization-schedule-calculator",
    "category": "finance",
    "shortDescription": "Calculate monthly loan EMI, total interest payable, and comprehensive loan amortization repayment metrics.",
    "keywords": [
      "loan amortization calculator",
      "loan schedule calculator",
      "calculate emi online",
      "loan interest breakdown"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "dividend-yield-calculator",
    "name": "Stock Dividend Yield & Annual Income Calculator",
    "slug": "dividend-yield-calculator",
    "category": "finance",
    "shortDescription": "Calculate annual dividend yield percentage, total annual dividend payout, and portfolio yield.",
    "keywords": [
      "dividend yield calculator",
      "calculate dividend yield",
      "stock dividend income calculator",
      "annual dividend yield"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "freelance-hourly-rate-calculator",
    "name": "Freelance Hourly Rate & Pricing Calculator",
    "slug": "freelance-hourly-rate-calculator",
    "category": "finance",
    "shortDescription": "Calculate your ideal hourly billing rate based on target annual income, billable hours, business expenses, and taxes.",
    "keywords": [
      "freelance rate calculator",
      "calculate hourly rate freelance",
      "consultant pricing calculator",
      "hourly rate for freelancer"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "savings-goal-planner-calculator",
    "name": "Savings Goal & Monthly Deposit Planner",
    "slug": "savings-goal-planner-calculator",
    "category": "finance",
    "shortDescription": "Calculate required monthly savings deposits to reach a specific financial target by a target future date.",
    "keywords": [
      "savings goal calculator",
      "monthly savings planner",
      "calculate savings target",
      "reach financial goal calculator"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "discount-percentage-calculator",
    "name": "Shopping Discount & Final Price Savings Calculator",
    "slug": "discount-percentage-calculator",
    "category": "finance",
    "shortDescription": "Calculate final discounted price, total money saved, and sales tax / GST for shopping sales and coupons.",
    "keywords": [
      "discount calculator",
      "calculate sale price online",
      "discount percentage calculator",
      "how much is 20 percent off"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "compress-image",
    "name": "Compress Image (JPG, PNG, WebP)",
    "slug": "compress-image",
    "category": "image",
    "shortDescription": "Compress and reduce image file sizes to exact target KB (20KB, 50KB, 100KB) without visual degradation.",
    "keywords": [
      "compress image",
      "reduce image size in kb",
      "compress photo to 50kb",
      "image compressor online free",
      "compress image 20kb"
    ],
    "priority": 100,
    "isFeatured": true
  },
  {
    "id": "image-resizer",
    "name": "Image Resizer (Pixels, CM, MM)",
    "slug": "image-resizer",
    "category": "image",
    "shortDescription": "Resize photo dimensions by exact pixels, millimeters, centimeters, or percentages with aspect ratio lock.",
    "keywords": [
      "image resizer",
      "resize image pixels",
      "resize photo online",
      "change image dimensions",
      "passport photo size in cm"
    ],
    "priority": 100,
    "isFeatured": true
  },
  {
    "id": "signature-resizer",
    "name": "Signature Resizer (20KB - 50KB)",
    "slug": "signature-resizer",
    "category": "image",
    "shortDescription": "Crop, resize, and compress signature images for government job forms, UPSC, SSC, and TNPSC exams.",
    "keywords": [
      "signature resizer",
      "resize signature 20kb",
      "upsc signature size",
      "ssc signature resizer",
      "crop signature online"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "jpg-to-png",
    "name": "JPG to PNG Converter",
    "slug": "jpg-to-png",
    "category": "image",
    "shortDescription": "Convert JPG images to lossless PNG format with transparent alpha channel support.",
    "keywords": [
      "jpg to png",
      "convert jpg to png online",
      "jpeg to png converter",
      "high quality png"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "png-to-jpg",
    "name": "PNG to JPG Converter",
    "slug": "png-to-jpg",
    "category": "image",
    "shortDescription": "Convert PNG images to lightweight JPG format with adjustable compression quality.",
    "keywords": [
      "png to jpg",
      "convert png to jpg online",
      "png to jpeg converter",
      "reduce png file size"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "webp-converter",
    "name": "WebP Converter (to JPG & PNG)",
    "slug": "webp-converter",
    "category": "image",
    "shortDescription": "Convert next-gen WebP images to JPG/PNG, or convert photos to WebP for 30%+ smaller file sizes.",
    "keywords": [
      "webp converter",
      "convert webp to jpg",
      "webp to png online",
      "jpg to webp converter",
      "modern image format"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "image-color-palette-extractor",
    "name": "Image Color Palette & Dominant Color Extractor",
    "slug": "image-color-palette-extractor",
    "category": "image",
    "shortDescription": "Extract dominant color swatches, complementary palettes, and HEX/RGB codes from any photo in-browser.",
    "keywords": [
      "image color palette extractor",
      "extract colors from image",
      "dominant color finder",
      "image hex color picker"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "image-grayscale-filter",
    "name": "Photo Grayscale & Black/White Filter Tool",
    "slug": "image-grayscale-filter",
    "category": "image",
    "shortDescription": "Apply clean black-and-white grayscale filters, adjust brightness and contrast, and download high-res photos.",
    "keywords": [
      "photo grayscale filter",
      "convert image to black and white online",
      "b&w photo maker",
      "image monochrome tool"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "image-blur-sharpen-tool",
    "name": "Image Blur & Gaussian Filter Tool",
    "slug": "image-blur-sharpen-tool",
    "category": "image",
    "shortDescription": "Apply customizable Gaussian blur to background images or sensitive photo areas in-browser.",
    "keywords": [
      "image blur tool",
      "blur photo online",
      "gaussian blur image",
      "blur background tool"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "image-rounded-corner-generator",
    "name": "Image Rounded Corner & Circle Crop Generator",
    "slug": "image-rounded-corner-generator",
    "category": "image",
    "shortDescription": "Add smooth border-radius rounded corners or circular avatar crops to images with transparent backgrounds.",
    "keywords": [
      "rounded corner image",
      "circle crop photo online",
      "add rounded corners to photo",
      "avatar circle crop"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "favicon-generator",
    "name": "Favicon & Apple Touch Icon Generator",
    "slug": "favicon-generator",
    "category": "image",
    "shortDescription": "Generate standard multi-resolution website favicons (16x16, 32x32, 180x180 Apple Touch Icon, 192x192 Android).",
    "keywords": [
      "favicon generator",
      "create favicon online",
      "apple touch icon generator",
      "android chrome icon generator"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "image-aspect-ratio-resizer",
    "name": "Social Media Image Aspect Ratio & Size Calculator",
    "slug": "image-aspect-ratio-resizer",
    "category": "image",
    "shortDescription": "Calculate exact image dimensions and crop ratios for Instagram (1:1, 4:5, 9:16), YouTube (16:9), and Facebook.",
    "keywords": [
      "social media image resizer",
      "instagram aspect ratio calculator",
      "youtube thumbnail size",
      "crop to 16:9 online"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "image-dpi-converter",
    "name": "Image DPI & Print Resolution Calculator (300 DPI)",
    "slug": "image-dpi-converter",
    "category": "image",
    "shortDescription": "Calculate physical print dimensions in inches and centimeters from pixel counts at 300 DPI, 150 DPI, 72 DPI.",
    "keywords": [
      "image dpi calculator",
      "pixels to inches calculator",
      "300 dpi print size calculator",
      "print resolution calculator"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "gst-calculator",
    "name": "GST Calculator (India)",
    "slug": "gst-calculator",
    "category": "india",
    "shortDescription": "Calculate GST tax amounts, CGST, SGST, and inclusive/exclusive invoice totals across 5%, 12%, 18%, 28% slabs.",
    "keywords": [
      "gst calculator",
      "calculate gst india",
      "gst tax calculator",
      "cgst sgst calculator",
      "gst reverse calculator"
    ],
    "priority": 100,
    "isFeatured": true
  },
  {
    "id": "income-tax-regime-comparator",
    "name": "Old vs New Tax Regime Comparator",
    "slug": "income-tax-regime-comparator",
    "category": "india",
    "shortDescription": "Compare income tax liability under Old and New Tax Regimes (FY 2024-25 / AY 2025-26) to maximize tax savings.",
    "keywords": [
      "old vs new tax regime",
      "income tax calculator india",
      "tax regime comparator",
      "new tax regime slabs 2024",
      "save income tax"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "gratuity-calculator",
    "name": "Gratuity Calculator (India)",
    "slug": "gratuity-calculator",
    "category": "india",
    "shortDescription": "Calculate gratuity payout for private and government employees according to the Payment of Gratuity Act 1972.",
    "keywords": [
      "gratuity calculator",
      "calculate gratuity india",
      "payment of gratuity act",
      "gratuity formula india",
      "retirement gratuity"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "ifsc-code-validator",
    "name": "IFSC Code Format Validator",
    "slug": "ifsc-code-validator",
    "category": "india",
    "shortDescription": "Validate Indian Financial System Code (IFSC) structure and parse bank & branch identifiers.",
    "keywords": [
      "ifsc code validator",
      "validate ifsc code",
      "check ifsc code format",
      "rbi ifsc validator"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "epf-calculator-india",
    "name": "EPF Maturity & Retirement Corpus Calculator (India)",
    "slug": "epf-calculator-india",
    "category": "india",
    "shortDescription": "Calculate Employees' Provident Fund (EPF) maturity corpus, employee & employer 12% contribution splits, and annual interest.",
    "keywords": [
      "epf calculator",
      "provident fund calculator india",
      "calculate pf maturity amount",
      "epf retirement corpus calculator"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "pan-card-format-validator",
    "name": "PAN Card Number Format Validator (India)",
    "slug": "pan-card-format-validator",
    "category": "india",
    "shortDescription": "Validate Indian PAN card format (AAAAA9999A) and identify entity type (Individual, Company, Firm, Trust).",
    "keywords": [
      "pan card validator",
      "validate pan number online",
      "check pan card format",
      "pan entity type checker"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "aadhaar-verhoeff-checksum-validator",
    "name": "Aadhaar Verhoeff Checksum & Format Validator",
    "slug": "aadhaar-verhoeff-checksum-validator",
    "category": "india",
    "shortDescription": "Validate 12-digit Indian Aadhaar number format using the mathematical Verhoeff checksum algorithm.",
    "keywords": [
      "aadhaar validator",
      "aadhaar verhoeff checksum",
      "validate aadhaar number online",
      "check aadhaar format"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "indian-currency-words-converter",
    "name": "Indian Rupee Number to Words Converter (Lakhs & Crores)",
    "slug": "indian-currency-words-converter",
    "category": "india",
    "shortDescription": "Convert numeric amounts into formal Indian Rupee text (Lakhs, Crores, Arab) for cheques, invoices, and legal receipts.",
    "keywords": [
      "number to words indian currency",
      "rupees to words converter",
      "lakhs crores to words",
      "cheque amount in words converter"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "pin-code-format-validator-india",
    "name": "Indian Postal PIN Code Validator & Region Identifier",
    "slug": "pin-code-format-validator-india",
    "category": "india",
    "shortDescription": "Validate 6-digit Indian Postal Index Numbers (PIN) and identify corresponding postal circle and regional zone.",
    "keywords": [
      "pin code validator india",
      "validate pincode online",
      "indian postal code checker",
      "pincode zone identifier"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "compress-pdf",
    "name": "Compress PDF",
    "slug": "compress-pdf",
    "category": "pdf",
    "shortDescription": "Reduce PDF file size while maintaining sharp text and visual clarity.",
    "keywords": [
      "compress pdf",
      "reduce pdf size",
      "pdf compressor online",
      "shrink pdf file",
      "compress pdf 100kb"
    ],
    "priority": 100,
    "isFeatured": true
  },
  {
    "id": "merge-pdf",
    "name": "Merge PDF",
    "slug": "merge-pdf",
    "category": "pdf",
    "shortDescription": "Combine multiple PDF documents into a single organized file with drag-and-drop page reordering.",
    "keywords": [
      "merge pdf",
      "combine pdf online",
      "join pdf files",
      "merge pdf free",
      "pdf combiner"
    ],
    "priority": 100,
    "isFeatured": true
  },
  {
    "id": "split-pdf",
    "name": "Split PDF",
    "slug": "split-pdf",
    "category": "pdf",
    "shortDescription": "Extract specific page ranges or split every page into individual PDF documents.",
    "keywords": [
      "split pdf",
      "separate pdf pages",
      "extract pdf pages online",
      "split pdf into single pages"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "pdf-password-protect",
    "name": "Protect PDF (Password & AES Encryption)",
    "slug": "pdf-password-protect",
    "category": "pdf",
    "shortDescription": "Encrypt PDF files with strong ISO-standard AES-256 password protection using WebAssembly.",
    "keywords": [
      "pdf password protect",
      "encrypt pdf online",
      "lock pdf with password",
      "aes 256 pdf encryption",
      "secure pdf"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "pdf-unlocker",
    "name": "Unlock PDF (Remove Password)",
    "slug": "pdf-unlocker",
    "category": "pdf",
    "shortDescription": "Decrypt and remove password restrictions from password-protected PDF files in-browser.",
    "keywords": [
      "unlock pdf",
      "remove pdf password",
      "decrypt pdf online",
      "remove password from pdf"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "pdf-page-numberer",
    "name": "PDF Page Numbering Tool",
    "slug": "pdf-page-numberer",
    "category": "pdf",
    "shortDescription": "Add customized page numbers ('Page X of Y') to headers or footers of PDF documents in-browser.",
    "keywords": [
      "pdf page numberer",
      "add page numbers to pdf",
      "number pdf pages online",
      "pdf pagination tool"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "pdf-metadata-viewer-editor",
    "name": "PDF Metadata Viewer & Tag Inspector",
    "slug": "pdf-metadata-viewer-editor",
    "category": "pdf",
    "shortDescription": "Inspect and edit PDF document properties, author, title, subject, creation date, and keywords.",
    "keywords": [
      "pdf metadata editor",
      "view pdf metadata online",
      "pdf properties viewer",
      "change pdf author title"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "pdf-grayscale-converter",
    "name": "PDF Grayscale & Black/White Converter",
    "slug": "pdf-grayscale-converter",
    "category": "pdf",
    "shortDescription": "Convert color PDF documents to 8-bit monochromatic grayscale for economical printing and file size reduction.",
    "keywords": [
      "pdf grayscale converter",
      "convert pdf to black and white",
      "b&w pdf converter",
      "reduce printer ink pdf"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "markdown-to-html-converter",
    "name": "Markdown to HTML Converter & Live Preview",
    "slug": "markdown-to-html-converter",
    "category": "pdf",
    "shortDescription": "Convert GitHub Flavored Markdown (headings, tables, code blocks, lists) into clean semantic HTML markup.",
    "keywords": [
      "markdown to html",
      "convert markdown to html online",
      "gfm to html converter",
      "markdown previewer"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "html-to-markdown-converter",
    "name": "HTML to Markdown Converter",
    "slug": "html-to-markdown-converter",
    "category": "pdf",
    "shortDescription": "Convert HTML source code and rich text back into clean, readable GitHub Flavored Markdown syntax.",
    "keywords": [
      "html to markdown",
      "convert html to md online",
      "html to gfm converter",
      "extract markdown from html"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "document-stats-counter",
    "name": "Document Word, Page & Reading Time Estimator",
    "slug": "document-stats-counter",
    "category": "pdf",
    "shortDescription": "Estimate standard printed pages (~300 words/page), reading time, speech duration, and character metrics.",
    "keywords": [
      "document page estimator",
      "words to pages calculator",
      "reading time calculator",
      "speech time estimator"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "password-generator",
    "name": "Strong Password Generator",
    "slug": "password-generator",
    "category": "privacy",
    "shortDescription": "Generate cryptographically secure, uncrackable random passwords with custom character sets and entropy scoring.",
    "keywords": [
      "password generator",
      "strong password generator",
      "random password generator",
      "secure password online",
      "generate uncrackable password"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "password-strength-checker",
    "name": "Password Strength & Entropy Meter",
    "slug": "password-strength-checker",
    "category": "privacy",
    "shortDescription": "Test password security, crack time estimation, and Shannon entropy bits safely in your browser.",
    "keywords": [
      "password strength checker",
      "test password strength online",
      "password entropy calculator",
      "how strong is my password"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "hmac-generator",
    "name": "HMAC Generator (SHA-256, SHA-512, SHA-384)",
    "slug": "hmac-generator",
    "category": "privacy",
    "shortDescription": "Generate Keyed-Hash Message Authentication Codes (HMAC) using Web Crypto SubtleCrypto API.",
    "keywords": [
      "hmac generator",
      "generate hmac online",
      "hmac sha256 calculator",
      "keyed hash message authentication code"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "uuid-validator-parser",
    "name": "UUID Validator & Parser",
    "slug": "uuid-validator-parser",
    "category": "privacy",
    "shortDescription": "Validate RFC 4122 UUID strings and extract version (v1, v4, v5), variant, and timestamp metadata.",
    "keywords": [
      "uuid validator",
      "validate uuid online",
      "uuid parser",
      "check uuid version"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "ipv4-subnet-calculator",
    "name": "IPv4 Subnet Calculator (CIDR)",
    "slug": "ipv4-subnet-calculator",
    "category": "privacy",
    "shortDescription": "Calculate network address, broadcast address, usable IP range, host count, and wildcard mask from CIDR.",
    "keywords": [
      "subnet calculator",
      "ipv4 subnet calculator",
      "cidr calculator",
      "ip range calculator",
      "network mask calculator"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "ipv4-address-converter",
    "name": "IPv4 Address Format Converter (Decimal, Hex, Binary)",
    "slug": "ipv4-address-converter",
    "category": "privacy",
    "shortDescription": "Convert IPv4 addresses between Dotted Decimal, Integer / Decimal, Hexadecimal, and 32-bit Binary notation.",
    "keywords": [
      "ipv4 converter",
      "ip to integer",
      "ip to hex",
      "ip to binary",
      "ip address format converter"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "ipv6-compress-expand",
    "name": "IPv6 Compress & Expand Tool",
    "slug": "ipv6-compress-expand",
    "category": "privacy",
    "shortDescription": "Expand abbreviated IPv6 addresses to full 32-digit format, and compress to canonical RFC 5952 '::' notation.",
    "keywords": [
      "ipv6 compress expand",
      "expand ipv6",
      "compress ipv6 online",
      "ipv6 canonical normalizer"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "ipv6-validator",
    "name": "IPv6 Address Syntax Validator",
    "slug": "ipv6-validator",
    "category": "privacy",
    "shortDescription": "Validate IPv6 syntax and detect address scope (Loopback, Link-Local, Global Unicast, ULA).",
    "keywords": [
      "ipv6 validator",
      "validate ipv6 address",
      "ipv6 syntax checker",
      "is valid ipv6"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "mac-address-lookup-validator",
    "name": "MAC Address Validator & Notation Converter",
    "slug": "mac-address-lookup-validator",
    "category": "privacy",
    "shortDescription": "Validate physical MAC addresses and convert across Colon (00:1A:...), Hyphen, and Cisco Dot notations.",
    "keywords": [
      "mac address validator",
      "convert mac address format",
      "mac address notation converter",
      "check mac address"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "user-agent-parser",
    "name": "User-Agent String Parser & Inspector",
    "slug": "user-agent-parser",
    "category": "privacy",
    "shortDescription": "Parse browser name, OS version, rendering engine, and device type from HTTP User-Agent strings.",
    "keywords": [
      "user agent parser",
      "parse user agent online",
      "ua parser",
      "what is my user agent",
      "detect browser from ua"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "http-status-code-checker",
    "name": "HTTP Status Code Checker & Lookup",
    "slug": "http-status-code-checker",
    "category": "privacy",
    "shortDescription": "Lookup RFC 9110 HTTP status codes (200, 301, 404, 500, 502) with meanings and troubleshooting tips.",
    "keywords": [
      "http status codes",
      "http code lookup",
      "404 not found meaning",
      "500 internal server error",
      "http status explanation"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "mime-type-lookup",
    "name": "MIME Content-Type Lookup & Checker",
    "slug": "mime-type-lookup",
    "category": "privacy",
    "shortDescription": "Lookup MIME content-types by file extension (.pdf, .webp, .wasm) or find file extensions from MIME strings.",
    "keywords": [
      "mime type lookup",
      "content type checker",
      "file extension to mime type",
      "iana mime types"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "base32-encoder",
    "name": "Base32 Text Encoder (RFC 4648)",
    "slug": "base32-encoder",
    "category": "privacy",
    "shortDescription": "Encode plain text into RFC 4648 Base32 uppercase strings used in 2FA/TOTP authenticator seeds.",
    "keywords": [
      "base32 encoder",
      "encode base32 online",
      "rfc 4648 base32",
      "totp base32 secret encoder"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "base32-decoder",
    "name": "Base32 Text Decoder (RFC 4648)",
    "slug": "base32-decoder",
    "category": "privacy",
    "shortDescription": "Decode RFC 4648 Base32 strings back into readable UTF-8 and ASCII plain text.",
    "keywords": [
      "base32 decoder",
      "decode base32 online",
      "base32 to text",
      "base32 string decoder"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "base58-encoder",
    "name": "Base58 Text Encoder (Bitcoin & IPFS)",
    "slug": "base58-encoder",
    "category": "privacy",
    "shortDescription": "Encode text into Base58 notation, omitting confusing visual characters (0, O, I, l).",
    "keywords": [
      "base58 encoder",
      "encode base58 online",
      "bitcoin base58 encoder",
      "ipfs base58"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "base58-decoder",
    "name": "Base58 Text Decoder (Bitcoin & IPFS)",
    "slug": "base58-decoder",
    "category": "privacy",
    "shortDescription": "Decode Bitcoin and IPFS Base58 alphanumeric strings back into readable UTF-8 text.",
    "keywords": [
      "base58 decoder",
      "decode base58 online",
      "base58 to text",
      "bitcoin base58 decoder"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "unicode-escape-encoder",
    "name": "Unicode Escape Sequence Encoder (\\\\uXXXX)",
    "slug": "unicode-escape-encoder",
    "category": "privacy",
    "shortDescription": "Convert Unicode, Tamil, and special characters into \\\\uXXXX hex escape sequences for JavaScript and JSON.",
    "keywords": [
      "unicode escape encoder",
      "convert text to unicode escape",
      "backslash u escape",
      "javascript unicode escape"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "unicode-escape-decoder",
    "name": "Unicode Escape Sequence Decoder (\\\\uXXXX to Text)",
    "slug": "unicode-escape-decoder",
    "category": "privacy",
    "shortDescription": "Decode \\\\uXXXX hexadecimal escape sequences back into readable Unicode, Tamil, and emoji characters.",
    "keywords": [
      "unicode escape decoder",
      "decode \\\\uXXXX online",
      "unicode hex to text",
      "unescape unicode"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "rot13-encoder-decoder",
    "name": "ROT13 Cipher & Decoder (Caesar Shift 13)",
    "slug": "rot13-encoder-decoder",
    "category": "privacy",
    "shortDescription": "Obfuscate and decode text using the classic ROT13 letter substitution cipher (13-position rotation).",
    "keywords": [
      "rot13 cipher",
      "rot13 decoder",
      "rot13 encoder online",
      "caesar cipher 13",
      "rot13 translator"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "crc32-checksum-calculator",
    "name": "CRC32 Checksum Calculator",
    "slug": "crc32-checksum-calculator",
    "category": "privacy",
    "shortDescription": "Calculate 32-bit Cyclic Redundancy Check (CRC32) checksums for data integrity verification.",
    "keywords": [
      "crc32 calculator",
      "calculate crc32 online",
      "crc32 checksum",
      "cyclic redundancy check"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "port-number-lookup",
    "name": "TCP/UDP Port Number Lookup & Reference",
    "slug": "port-number-lookup",
    "category": "privacy",
    "shortDescription": "Lookup standard TCP/UDP port numbers (80 HTTP, 443 HTTPS, 22 SSH, 3306 MySQL) and service protocols.",
    "keywords": [
      "port number lookup",
      "tcp port lookup",
      "udp port reference",
      "standard port numbers",
      "what port is 443"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "punycode-converter",
    "name": "Punycode Domain Name Converter (IDN to ASCII)",
    "slug": "punycode-converter",
    "category": "privacy",
    "shortDescription": "Convert internationalized domain names (IDN) with Unicode characters to ASCII Punycode (xn--...) and back.",
    "keywords": [
      "punycode converter",
      "idn to punycode",
      "convert punycode to unicode",
      "international domain name converter"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "md5-checksum-generator",
    "name": "MD5 Hash & Checksum Generator (Legacy)",
    "slug": "md5-checksum-generator",
    "category": "privacy",
    "shortDescription": "Compute 128-bit MD5 checksum hashes for file integrity checks and legacy checksum validation.",
    "keywords": [
      "md5 generator",
      "calculate md5 hash",
      "md5 checksum online",
      "generate md5"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "argon2-bcrypt-cost-calculator",
    "name": "Bcrypt & Argon2 Work Factor Estimator",
    "slug": "argon2-bcrypt-cost-calculator",
    "category": "privacy",
    "shortDescription": "Estimate key derivation execution times, iteration counts, and work factor costs for Bcrypt and Argon2 password hashing.",
    "keywords": [
      "bcrypt cost calculator",
      "argon2 work factor estimator",
      "bcrypt rounds time",
      "password hashing benchmark"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "hash-type-identifier",
    "name": "Hash Type Identifier & Detector",
    "slug": "hash-type-identifier",
    "category": "privacy",
    "shortDescription": "Identify unknown cryptographic hash types (MD5, SHA-256, Bcrypt, UUID, JWT) by character pattern analysis.",
    "keywords": [
      "hash identifier",
      "identify hash type online",
      "hash detector",
      "what type of hash is this"
    ],
    "priority": 85,
    "isFeatured": true
  },
  {
    "id": "sha3-hash-calculator",
    "name": "SHA-3 Hash Calculator (Keccak-256)",
    "slug": "sha3-hash-calculator",
    "category": "privacy",
    "shortDescription": "Calculate modern SHA-3 / Keccak-256 cryptographic message digests on text data.",
    "keywords": [
      "sha3 calculator",
      "sha3-256 hash generator",
      "keccak hash calculator",
      "sha3 online"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "qr-code-generator",
    "name": "QR Code Generator (URL, WiFi, Text)",
    "slug": "qr-code-generator",
    "category": "qr",
    "shortDescription": "Generate customizable, high-resolution QR codes for websites, WiFi logins, vCard contacts, and plain text.",
    "keywords": [
      "qr code generator",
      "create qr code online",
      "wifi qr code generator",
      "free qr code maker",
      "url to qr code"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "wifi-qr-code-generator",
    "name": "WiFi QR Code Generator",
    "slug": "wifi-qr-code-generator",
    "category": "qr",
    "shortDescription": "Create a QR code that allows guests to connect to your WiFi network instantly without typing passwords.",
    "keywords": [
      "wifi qr code generator",
      "connect to wifi qr code",
      "share wifi with qr code",
      "wifi password qr code"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "vcard-qr-code-generator",
    "name": "vCard Contact QR Code Generator",
    "slug": "vcard-qr-code-generator",
    "category": "qr",
    "shortDescription": "Generate standard vCard 3.0 contact QR codes with Name, Phone, Email, Company, and Website for business cards.",
    "keywords": [
      "vcard qr code generator",
      "contact qr code maker",
      "digital business card qr",
      "scan to save contact qr"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "email-qr-code-generator",
    "name": "Email (mailto) QR Code Generator",
    "slug": "email-qr-code-generator",
    "category": "qr",
    "shortDescription": "Generate scan-to-email QR codes with pre-filled recipient email, subject line, and message body.",
    "keywords": [
      "email qr code generator",
      "mailto qr code maker",
      "scan to email qr",
      "email inquiry qr code"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "sms-qr-code-generator",
    "name": "SMS Text Message QR Code Generator",
    "slug": "sms-qr-code-generator",
    "category": "qr",
    "shortDescription": "Generate scan-to-SMS QR codes with pre-filled phone number and ready-to-send text message.",
    "keywords": [
      "sms qr code generator",
      "scan to sms qr",
      "text message qr maker",
      "sms marketing qr code"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "barcode-code128-generator",
    "name": "Barcode Generator (Code 128 / Code 39)",
    "slug": "barcode-code128-generator",
    "category": "qr",
    "shortDescription": "Generate high-density 1D linear barcodes (Code 128 / Code 39) for product SKUs, inventory labels, and serial numbers.",
    "keywords": [
      "barcode generator",
      "code 128 barcode generator",
      "code 39 barcode online",
      "sku barcode generator",
      "inventory barcode maker"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "upi-qr-code-generator",
    "name": "UPI Payment QR Code Generator (India)",
    "slug": "upi-qr-code-generator",
    "category": "qr",
    "shortDescription": "Generate static and dynamic Indian UPI payment QR codes (`upi://pay`) for Google Pay, PhonePe, Paytm, and BHIM.",
    "keywords": [
      "upi qr code generator",
      "create upi qr online",
      "google pay qr generator",
      "phonepe qr maker",
      "paytm payment qr code"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "meta-tag-generator",
    "name": "Meta Tag Generator (SEO & OpenGraph)",
    "slug": "meta-tag-generator",
    "category": "seo",
    "shortDescription": "Generate standard HTML meta tags, OpenGraph cards, and Twitter summary cards for websites.",
    "keywords": [
      "meta tag generator",
      "opengraph generator",
      "seo meta tags",
      "generate meta tags online",
      "twitter card generator"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "robots-txt-generator",
    "name": "Robots.txt Generator",
    "slug": "robots-txt-generator",
    "category": "seo",
    "shortDescription": "Create standard RFC 9309 compliant robots.txt files with custom crawl directives and sitemap links.",
    "keywords": [
      "robots txt generator",
      "create robots txt online",
      "robots txt builder",
      "googlebot crawler rules"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "keyword-density-checker",
    "name": "Keyword Density Checker",
    "slug": "keyword-density-checker",
    "category": "seo",
    "shortDescription": "Calculate keyword frequency and percentage density to optimize content and avoid keyword stuffing.",
    "keywords": [
      "keyword density checker",
      "check keyword density online",
      "keyword frequency analyzer",
      "seo content density"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "serp-snippet-preview",
    "name": "Google SERP Snippet Preview Tool",
    "slug": "serp-snippet-preview",
    "category": "seo",
    "shortDescription": "Preview how your page title, meta description, and URL render in Google Desktop and Mobile search results.",
    "keywords": [
      "serp preview tool",
      "google search snippet preview",
      "serp simulator online",
      "meta title pixel width checker"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "open-graph-meta-generator",
    "name": "Open Graph & Twitter Card Generator",
    "slug": "open-graph-meta-generator",
    "category": "seo",
    "shortDescription": "Generate full Facebook OpenGraph (`og:image`, `og:title`) and Twitter summary large image card tags.",
    "keywords": [
      "open graph generator",
      "og meta tags generator",
      "twitter card generator",
      "facebook preview tags"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "schema-markup-generator",
    "name": "Schema Markup Generator (JSON-LD)",
    "slug": "schema-markup-generator",
    "category": "seo",
    "shortDescription": "Generate Google-recommended JSON-LD structured data for Articles, Organizations, FAQPages, and Products.",
    "keywords": [
      "schema markup generator",
      "json-ld generator",
      "structured data generator",
      "google rich snippets tool"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "hreflang-tag-generator",
    "name": "Hreflang Tag Generator for Multi-Language SEO",
    "slug": "hreflang-tag-generator",
    "category": "seo",
    "shortDescription": "Generate multi-regional and multi-language `<link rel='alternate' hreflang='...'>` tags with `x-default`.",
    "keywords": [
      "hreflang tag generator",
      "multi language seo tags",
      "hreflang builder online",
      "international seo tags"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "canonical-url-generator",
    "name": "Canonical URL Tag Generator & Normalizer",
    "slug": "canonical-url-generator",
    "category": "seo",
    "shortDescription": "Generate clean `<link rel='canonical'>` tags, normalize trailing slashes, and strip tracking parameters.",
    "keywords": [
      "canonical url generator",
      "canonical tag builder",
      "create canonical link",
      "fix duplicate content seo"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "heading-structure-analyzer",
    "name": "HTML Heading Structure Analyzer (H1-H6)",
    "slug": "heading-structure-analyzer",
    "category": "seo",
    "shortDescription": "Inspect HTML heading tags (H1, H2, H3) for hierarchy errors, multiple H1 tags, and missing levels.",
    "keywords": [
      "heading structure analyzer",
      "h1 tag checker",
      "check heading hierarchy online",
      "seo heading analyzer"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "tamil-image-to-text",
    "name": "Tamil Image to Text (OCR)",
    "slug": "tamil-image-to-text",
    "category": "tamil",
    "shortDescription": "Extract editable Tamil text from images, photos, and scanned documents using in-browser neural OCR.",
    "keywords": [
      "tamil image to text",
      "tamil ocr online",
      "extract tamil text from image",
      "photo to tamil text",
      "tamil font extractor"
    ],
    "priority": 100,
    "isFeatured": true
  },
  {
    "id": "bamini-to-unicode-converter",
    "name": "BAMINI to Tamil Unicode Converter",
    "slug": "bamini-to-unicode-converter",
    "category": "tamil",
    "shortDescription": "Convert legacy BAMINI font text into standard UTF-8 Tamil Unicode text for modern web and mobile.",
    "keywords": [
      "bamini to unicode",
      "convert bamini font to tamil unicode",
      "bamini converter online",
      "legacy tamil font converter"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "tanglish-to-tamil-transliteration",
    "name": "Tanglish to Tamil Transliteration",
    "slug": "tanglish-to-tamil-transliteration",
    "category": "tamil",
    "shortDescription": "Type Tamil words in English letters (Tanglish) and convert them instantly to Tamil script.",
    "keywords": [
      "tanglish to tamil",
      "english to tamil typing",
      "tamil transliteration online",
      "type tamil in english"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "tamil-character-counter",
    "name": "Tamil Character & Letter Classification Counter (உயிர், மெய், உயிர்மெய்)",
    "slug": "tamil-character-counter",
    "category": "tamil",
    "shortDescription": "Count and classify Tamil letters into Uyir (12), Mei (18), Uyir-Mei (216), and Ayutha (1) characters.",
    "keywords": [
      "tamil character counter",
      "count tamil letters online",
      "tamil uyir mei counter",
      "tamil alphabet counter"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "tamil-word-sentence-counter",
    "name": "Tamil Word, Sentence & Reading Speed Counter",
    "slug": "tamil-word-sentence-counter",
    "category": "tamil",
    "shortDescription": "Count Tamil words, sentences, paragraphs, and estimate Tamil reading and public speech duration.",
    "keywords": [
      "tamil word counter",
      "tamil sentence counter",
      "tamil reading speed calculator",
      "tamil speech time estimator"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "tamil-unicode-normalizer",
    "name": "Tamil Unicode Normalizer (NFC & Glitch Fixer)",
    "slug": "tamil-unicode-normalizer",
    "category": "tamil",
    "shortDescription": "Fix broken Tamil combining characters, eliminate zero-width joiner glitches, and standardize to Unicode NFC form.",
    "keywords": [
      "tamil unicode normalizer",
      "fix broken tamil text",
      "tamil nfc normalizer",
      "repair tamil font glitches"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "tamil-text-cleaner",
    "name": "Tamil Text Cleaner & English Character Stripper",
    "slug": "tamil-text-cleaner",
    "category": "tamil",
    "shortDescription": "Clean Tamil prose by stripping mixed English characters, removing excessive spaces, and regularizing punctuation.",
    "keywords": [
      "tamil text cleaner",
      "remove english from tamil text",
      "clean tamil prose",
      "tamil whitespace cleaner"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "tamil-unicode-codepoint-inspector",
    "name": "Tamil Unicode Code Point & Hex Inspector",
    "slug": "tamil-unicode-codepoint-inspector",
    "category": "tamil",
    "shortDescription": "Inspect underlying Unicode code points (U+0B80 - U+0BFF) and hex representations for Tamil characters.",
    "keywords": [
      "tamil unicode codepoints",
      "inspect tamil hex codes",
      "tamil unicode hex viewer",
      "tamil glyph codepoint lookup"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "tamil-case-formatter",
    "name": "Tamil Honorifics & Quotation Formatter",
    "slug": "tamil-case-formatter",
    "category": "tamil",
    "shortDescription": "Format standard Tamil honorific titles (Mr. -> திரு., Mrs. -> திருமதி.) and normalize quotation marks in Tamil text.",
    "keywords": [
      "tamil honorifics formatter",
      "format tamil titles",
      "tamil quotation marks fixer",
      "thiru thirumathi formatter"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "remove-duplicate-lines",
    "name": "Remove Duplicate Lines",
    "slug": "remove-duplicate-lines",
    "category": "text",
    "shortDescription": "Remove repetitive and duplicate lines from text files, lists, and code with instant deduplication.",
    "keywords": [
      "remove duplicate lines",
      "deduplicate list",
      "delete duplicate lines",
      "unique lines extractor"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "sort-lines",
    "name": "Sort Lines Alphabetically (A-Z / Z-A)",
    "slug": "sort-lines",
    "category": "text",
    "shortDescription": "Sort lines of text alphabetically in ascending (A to Z) or descending (Z to A) order.",
    "keywords": [
      "sort lines",
      "alphabetize text",
      "sort lines alphabetically",
      "sort a to z",
      "list sorter"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "word-frequency-counter",
    "name": "Word Frequency Counter & Analyzer",
    "slug": "word-frequency-counter",
    "category": "text",
    "shortDescription": "Analyze word frequency, find keyword density, and count repeated words in essays and articles.",
    "keywords": [
      "word frequency counter",
      "keyword density analyzer",
      "count word occurrences",
      "most frequent words"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "character-frequency-analyzer",
    "name": "Character Frequency & Vowel Analyzer",
    "slug": "character-frequency-analyzer",
    "category": "text",
    "shortDescription": "Count vowels, consonants, digits, punctuation, and Unicode graphemes in text.",
    "keywords": [
      "character frequency",
      "vowel counter",
      "consonant counter",
      "unicode character counter"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "reading-time-estimator",
    "name": "Reading Time & Speech Duration Estimator",
    "slug": "reading-time-estimator",
    "category": "text",
    "shortDescription": "Estimate silent reading time and speaking duration for articles, speeches, and presentations.",
    "keywords": [
      "reading time calculator",
      "speech duration calculator",
      "how long to read",
      "presentation speech timer"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "slug-generator",
    "name": "URL Slug Generator & Sanitizer",
    "slug": "slug-generator",
    "category": "text",
    "shortDescription": "Convert article titles and headlines into clean, URL-friendly, SEO-optimized kebab-case slugs.",
    "keywords": [
      "slug generator",
      "url slug generator",
      "create url slug",
      "seo slug sanitizer"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "text-reverser",
    "name": "Text Reverser (Characters, Words & Lines)",
    "slug": "text-reverser",
    "category": "text",
    "shortDescription": "Reverse character order (mirror text), reverse words, or reverse line sequences.",
    "keywords": [
      "text reverser",
      "reverse text online",
      "backward text generator",
      "reverse words"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "find-and-replace-text",
    "name": "Find and Replace Text (Regex & Whole Word)",
    "slug": "find-and-replace-text",
    "category": "text",
    "shortDescription": "Find and replace words, substrings, and regular expression patterns with case sensitivity and match count.",
    "keywords": [
      "find and replace text",
      "regex replace online",
      "replace words in text",
      "bulk text replacer"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "remove-empty-lines",
    "name": "Remove Empty & Blank Lines",
    "slug": "remove-empty-lines",
    "category": "text",
    "shortDescription": "Strip blank lines, whitespace-only rows, and extra newline gaps from code and documents.",
    "keywords": [
      "remove empty lines",
      "delete blank lines",
      "strip empty lines",
      "clean blank lines"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "prefix-suffix-lines",
    "name": "Add Prefix & Suffix to Lines",
    "slug": "prefix-suffix-lines",
    "category": "text",
    "shortDescription": "Add custom text, commas, quotes, bullets, or line numbers to the start and end of every line.",
    "keywords": [
      "add prefix suffix to lines",
      "line prefix tool",
      "append text to every line",
      "add line numbers"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "extract-emails",
    "name": "Email Address Extractor & Deduplicator",
    "slug": "extract-emails",
    "category": "text",
    "shortDescription": "Extract and deduplicate all valid email addresses from raw text dumps, emails, and web pages.",
    "keywords": [
      "extract emails",
      "email extractor online",
      "find emails in text",
      "email scraper tool"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "extract-urls",
    "name": "URL & Web Link Extractor",
    "slug": "extract-urls",
    "category": "text",
    "shortDescription": "Extract all HTTP/HTTPS links and website URLs from raw text, HTML code, and documents.",
    "keywords": [
      "extract urls",
      "url extractor online",
      "find links in text",
      "link scraper"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "extract-numbers",
    "name": "Number & Currency Extractor",
    "slug": "extract-numbers",
    "category": "text",
    "shortDescription": "Extract all numeric digits, decimals, and monetary figures from unstructured text files.",
    "keywords": [
      "extract numbers",
      "number extractor online",
      "find numbers in text",
      "extract digits"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "camelcase-converter",
    "name": "camelCase String Converter",
    "slug": "camelcase-converter",
    "category": "text",
    "shortDescription": "Convert strings and phrases into camelCase (e.g. 'helloWorld') for JavaScript and coding.",
    "keywords": [
      "camelcase converter",
      "convert to camelcase",
      "string to camelcase",
      "camelcase online"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "snake-case-converter",
    "name": "snake_case String Converter",
    "slug": "snake-case-converter",
    "category": "text",
    "shortDescription": "Convert text and phrases into snake_case (e.g. 'hello_world') for Python and SQL databases.",
    "keywords": [
      "snake case converter",
      "convert to snake_case",
      "string to snake case",
      "snake_case online"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "kebab-case-converter",
    "name": "kebab-case String Converter",
    "slug": "kebab-case-converter",
    "category": "text",
    "shortDescription": "Convert text into kebab-case (e.g. 'hello-world') for CSS classes, HTML attributes, and URLs.",
    "keywords": [
      "kebab case converter",
      "convert to kebab-case",
      "dash case converter",
      "kebab-case online"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "pascalcase-converter",
    "name": "PascalCase String Converter",
    "slug": "pascalcase-converter",
    "category": "text",
    "shortDescription": "Convert strings into PascalCase (e.g. 'HelloWorld') for React components, TypeScript types, and C# classes.",
    "keywords": [
      "pascalcase converter",
      "convert to pascalcase",
      "upper camel case",
      "pascal case online"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "title-case-converter",
    "name": "Title Case Converter (AP & Chicago Style)",
    "slug": "title-case-converter",
    "category": "text",
    "shortDescription": "Convert article headlines and book titles into formal Title Case, smartly lowercasing minor prepositions.",
    "keywords": [
      "title case converter",
      "headline capitalization",
      "chicago title case",
      "ap title case online"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "sentence-case-converter",
    "name": "Sentence Case Converter",
    "slug": "sentence-case-converter",
    "category": "text",
    "shortDescription": "Capitalize the first letter of each sentence following periods, exclamation points, and question marks.",
    "keywords": [
      "sentence case converter",
      "capitalize sentences",
      "sentence case online",
      "fix caps lock text"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "text-to-morse-code",
    "name": "Text to Morse Code Translator",
    "slug": "text-to-morse-code",
    "category": "text",
    "shortDescription": "Translate English letters and numbers into international Morse code dots (.) and dashes (-).",
    "keywords": [
      "text to morse code",
      "morse code translator",
      "encode morse code",
      "morse code generator"
    ],
    "priority": 85,
    "isFeatured": true
  },
  {
    "id": "morse-code-to-text",
    "name": "Morse Code to Text Decoder",
    "slug": "morse-code-to-text",
    "category": "text",
    "shortDescription": "Decode Morse code dots (.) and dashes (-) back into readable English text.",
    "keywords": [
      "morse code to text",
      "decode morse code",
      "morse code reader",
      "morse to english"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "text-to-binary",
    "name": "Text to Binary Code Converter",
    "slug": "text-to-binary",
    "category": "text",
    "shortDescription": "Convert plain text and Unicode characters into 8-bit binary numbers (0s and 1s).",
    "keywords": [
      "text to binary",
      "convert text to binary code",
      "english to binary",
      "binary generator"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "binary-to-text",
    "name": "Binary to Text Translator",
    "slug": "binary-to-text",
    "category": "text",
    "shortDescription": "Decode 8-bit binary byte streams (0s and 1s) back into readable English and UTF-8 text.",
    "keywords": [
      "binary to text",
      "decode binary code",
      "binary translator online",
      "binary to english"
    ],
    "priority": 90,
    "isFeatured": false
  },
  {
    "id": "nato-phonetic-alphabet",
    "name": "NATO Phonetic Alphabet Translator",
    "slug": "nato-phonetic-alphabet",
    "category": "text",
    "shortDescription": "Translate words and spellings into the international NATO phonetic alphabet (Alfa, Bravo, Charlie).",
    "keywords": [
      "nato phonetic alphabet",
      "phonetic alphabet translator",
      "military phonetic alphabet",
      "aviation spelling alphabet"
    ],
    "priority": 80,
    "isFeatured": false
  },
  {
    "id": "normalize-unicode-text",
    "name": "Unicode Text Normalizer (NFC, NFD, NFKC, NFKD)",
    "slug": "normalize-unicode-text",
    "category": "text",
    "shortDescription": "Normalize multi-script Unicode text across NFC, NFD, NFKC, and NFKD canonical and compatibility forms.",
    "keywords": [
      "unicode normalizer",
      "unicode nfc nfd",
      "normalize unicode text",
      "unicode compatibility normalizer"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "markdown-table-generator",
    "name": "Markdown Table Generator & GFM Grid Formatter",
    "slug": "markdown-table-generator",
    "category": "text",
    "shortDescription": "Generate clean GitHub Flavored Markdown (GFM) tables with custom columns, rows, and header alignments.",
    "keywords": [
      "markdown table generator",
      "create markdown table online",
      "gfm table generator",
      "markdown grid creator"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "cidr-calculator",
    "name": "CIDR Subnet Calculator (IPv4)",
    "slug": "cidr-calculator",
    "category": "webmaster",
    "shortDescription": "Calculate IPv4 subnet masks, total IP addresses, usable host ranges, and network classes from CIDR prefixes (/24, /16).",
    "keywords": [
      "cidr calculator",
      "ipv4 subnet calculator",
      "subnet mask calculator",
      "cidr to subnet mask",
      "network prefix calculator"
    ],
    "priority": 95,
    "isFeatured": true
  },
  {
    "id": "http-request-header-parser",
    "name": "HTTP Request Header Parser & Security Auditor",
    "slug": "http-request-header-parser",
    "category": "webmaster",
    "shortDescription": "Parse raw HTTP request and response headers into formatted JSON key-value pairs and audit security headers.",
    "keywords": [
      "http header parser",
      "parse http headers online",
      "http request header analyzer",
      "security header checker"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "htaccess-redirect-generator",
    "name": ".htaccess 301 Redirect Generator",
    "slug": "htaccess-redirect-generator",
    "category": "webmaster",
    "shortDescription": "Generate clean Apache .htaccess 301 permanent and 302 temporary URL redirection directives.",
    "keywords": [
      "htaccess redirect generator",
      "301 redirect generator",
      "apache redirect rule",
      "create htaccess 301 online"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "security-headers-generator",
    "name": "HTTP Security Headers Generator",
    "slug": "security-headers-generator",
    "category": "webmaster",
    "shortDescription": "Generate robust HTTP security headers (HSTS, CSP, X-Frame-Options, Permissions-Policy) for Nginx and Apache.",
    "keywords": [
      "security headers generator",
      "http security headers",
      "csp header generator",
      "hsts header generator",
      "x-frame-options"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "cache-control-generator",
    "name": "HTTP Cache-Control Header Generator",
    "slug": "cache-control-generator",
    "category": "webmaster",
    "shortDescription": "Configure optimal `Cache-Control`, `Expires`, and `ETag` headers for static assets, SSR pages, and APIs.",
    "keywords": [
      "cache control generator",
      "http caching headers",
      "stale while revalidate generator",
      "cache control header builder"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "nginx-reverse-proxy-generator",
    "name": "Nginx Reverse Proxy Config Generator",
    "slug": "nginx-reverse-proxy-generator",
    "category": "webmaster",
    "shortDescription": "Generate production-ready Nginx `server {}` and `location /` reverse proxy configuration blocks with WebSocket and SSL.",
    "keywords": [
      "nginx reverse proxy generator",
      "nginx config builder",
      "nginx proxy_pass config",
      "create nginx reverse proxy online"
    ],
    "priority": 90,
    "isFeatured": true
  },
  {
    "id": "cors-header-generator",
    "name": "CORS Header & Middleware Generator",
    "slug": "cors-header-generator",
    "category": "webmaster",
    "shortDescription": "Generate Cross-Origin Resource Sharing (CORS) headers and Express.js middleware for APIs.",
    "keywords": [
      "cors header generator",
      "cors middleware generator",
      "fix cors error online",
      "access control allow origin generator"
    ],
    "priority": 85,
    "isFeatured": false
  },
  {
    "id": "url-slug-parser-analyzer",
    "name": "URL Structure Parser & Query Analyzer",
    "slug": "url-slug-parser-analyzer",
    "category": "webmaster",
    "shortDescription": "Deconstruct URLs into protocol, subdomain, domain, port, path segments, and query parameters table.",
    "keywords": [
      "url parser",
      "parse url online",
      "query string parser",
      "url structure analyzer",
      "deconstruct url"
    ],
    "priority": 85,
    "isFeatured": false
  }
];

export function getToolDirectoryItems(): ToolDirectoryItem[] {
  return TOOL_DIRECTORY_ITEMS;
}
