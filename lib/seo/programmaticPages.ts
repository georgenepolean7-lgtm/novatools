export interface ProgrammaticPageData {
  slug: string;
  title: string;
  description: string;
  targetKB: number;
  badge: string;
  overview: string;
  portalUseCases: string[];
  dimensionsGuide: string;
  technicalTradeoffs: string;
  formatAdvice: string;
  stepGuide: { step: number; title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  relatedSlugs: string[];
}

export const programmaticPages: Record<string, ProgrammaticPageData[]> = {
  "compress-image": [
    {
      slug: "compress-image-to-100kb",
      title: "Compress Image to 100KB Online (Free & Private)",
      description: "Compress JPG, PNG, and WebP images to exactly 100KB or less without losing visual clarity. 100% in-browser processing for government portals, job applications, and web publishing.",
      targetKB: 100,
      badge: "Target: 100 KB",
      overview: "Compressing an image to 100KB strikes the optimal balance between sharp visual fidelity and lightweight file size. Most official recruitment portals (such as UPSC, SSC, state PSCs), university application systems, and corporate job forms enforce a strict 100KB ceiling for passport photos and scanned certificates.",
      portalUseCases: [
        "UPSC Civil Services / NDA / CDS Online Application Form photo uploads (typically requires 20KB - 100KB)",
        "SSC CGL, CHSL, and MTS candidate passport photograph uploads",
        "State Public Service Commissions (TNPSC, UPPSC, MPSC, KPSC) document submissions",
        "University exam registration and scholarship portals",
        "Web publishing and blog article thumbnails for rapid Core Web Vitals LCP loading",
      ],
      dimensionsGuide: "For a 100KB target size, the recommended pixel resolution is between 600×600 px (1:1 square passport style) and 1200×800 px (standard 3:2 or 4:3 photo). Attempting to compress a raw 48-megapixel mobile photo (8000×6000 px) directly into 100KB without downsampling will cause aggressive JPEG compression artifacts; resizing dimensions first ensures crisp sharpness.",
      technicalTradeoffs: "Nova Tools employs an iterative binary search canvas quantization algorithm. Rather than degrading quality uniformly, it optimizes discrete cosine transform (DCT) frequency tables and downsamples pixel dimensions incrementally until the output stream is within 90-100% of the 100KB target.",
      formatAdvice: "JPEG is the ideal format for photographic portraits and camera captures targeting 100KB. PNG is lossless and will result in much larger files for photos; if you upload a PNG, our engine converts it to an optimized JPEG stream for maximum detail retention.",
      stepGuide: [
        { step: 1, title: "Select or Drop Image", desc: "Choose your JPG, PNG, or WebP photo from your device. Your file is read locally and never uploaded to any server." },
        { step: 2, title: "Confirm Target (100 KB)", desc: "The target is automatically set to 100 KB. You can fine-tune the slider if your portal requires an exact lower limit." },
        { step: 3, title: "Compress & Download", desc: "Click Compress. Our canvas engine optimizes the file in milliseconds. Download the resulting photo ready for immediate upload." },
      ],
      faqs: [
        {
          question: "Why do government portals enforce a 100KB maximum file size?",
          answer: "Government servers receive millions of candidate submissions simultaneously. Restricting files to 100KB ensures database scalability, rapid form submissions over low-bandwidth mobile networks, and standardized PDF generation for admit cards.",
        },
        {
          question: "Will compressing my photo to 100KB make my face blurry?",
          answer: "No. For standard passport-sized dimensions (e.g. 3.5cm × 4.5cm or 413×531 px at 300 DPI), a 100KB JPEG contains plenty of data to retain crisp facial features, clear eye details, and sharp borders.",
        },
        {
          question: "Is it safe to compress sensitive personal photos and certificates here?",
          answer: "Yes, completely safe. Nova Tools processes all image encoding locally inside your web browser using HTML5 Canvas APIs. Your photo is never transmitted over the internet or saved on our servers.",
        },
        {
          question: "What if my compressed image is 92KB instead of exactly 100KB?",
          answer: "Portals check for maximum file size (i.e. 'less than or equal to 100KB'). An image that is 92KB is perfectly valid and compliant with any 100KB ceiling.",
        },
      ],
      relatedSlugs: ["compress-image-to-200kb", "compress-image-to-50kb", "compress-image-for-upsc", "compress-image-without-losing-quality"],
    },
    {
      slug: "compress-image-to-200kb",
      title: "Compress Image to 200KB Online (Free & Fast)",
      description: "Reduce image file size to 200KB while preserving rich colors and sharpness. Ideal for high-resolution document scans, resume photos, and web banners.",
      targetKB: 200,
      badge: "Target: 200 KB",
      overview: "A 200KB target file size is the sweet spot for high-resolution scanned documents, PDF attachments, property deed copies, and e-commerce product imagery where fine text or texture must remain pristine.",
      portalUseCases: [
        "Aadhaar card and PAN card scanned PDF/JPG attachments",
        "Banking KYC document verification portals (SBI, HDFC, ICICI)",
        "LinkedIn profile photos and portfolio headshots",
        "E-commerce product listings for Amazon and Shopify",
      ],
      dimensionsGuide: "Recommended dimensions for 200KB: 1200×1200 px to 1920×1080 px (Full HD). This provides ample pixel density for full-screen desktop viewing while remaining lightweight.",
      technicalTradeoffs: "200KB allows high JPEG quality settings (85-92%) with zero visible compression noise. Our engine retains subtle gradients and fine micro-contrast.",
      formatAdvice: "Use JPEG or WebP for optimal compression. WebP offers 25-30% better compression efficiency than standard JPEG at equivalent visual quality.",
      stepGuide: [
        { step: 1, title: "Upload Image", desc: "Select any high-resolution photo or scanned document." },
        { step: 2, title: "Verify 200KB Preset", desc: "Ensure the 200KB target preset is selected." },
        { step: 3, title: "Download", desc: "Obtain your optimized 200KB image with instant local processing." },
      ],
      faqs: [
        {
          question: "Can I compress scanned certificates to 200KB without losing text readability?",
          answer: "Yes. 200KB provides sufficient bandwidth for high-resolution document scans (up to 1600px wide), ensuring all text, seal stamps, and signatures remain 100% legible.",
        },
        {
          question: "Does this tool work on mobile phones?",
          answer: "Yes, Nova Tools works seamlessly in modern mobile browsers including Safari on iOS and Chrome on Android.",
        },
      ],
      relatedSlugs: ["compress-image-to-100kb", "compress-image-to-500kb", "compress-image-for-pan-card"],
    },
    {
      slug: "compress-image-to-500kb",
      title: "Compress Image to 500KB Online (High Quality)",
      description: "Compress large DSLR and smartphone photos to 500KB. Keep maximum resolution and color fidelity for presentations, portfolios, and email attachments.",
      targetKB: 500,
      badge: "Target: 500 KB",
      overview: "When you have 10MB+ raw camera files or high-megapixel mobile photos that exceed email attachment limits or CMS upload thresholds, compressing to 500KB reduces file weight by 95% while keeping imperceptible loss in visual clarity.",
      portalUseCases: [
        "Email attachment limits (Outlook, Gmail)",
        "WordPress and Squarespace hero image uploads",
        "Digital art portfolio and photography submissions",
        "Real estate listing photos and high-resolution brochures",
      ],
      dimensionsGuide: "Supports up to 2560×1440 px (2K Quad HD) or 2048×2048 px square imagery while staying strictly under 500KB.",
      technicalTradeoffs: "Retains 90%+ JPEG quantization tables and full chroma subsampling (4:4:4 or 4:2:2) for vibrant, accurate colors.",
      formatAdvice: "Suitable for both JPEG and WebP formats.",
      stepGuide: [
        { step: 1, title: "Choose High-Res Photo", desc: "Select large camera images (up to 20MB)." },
        { step: 2, title: "Process", desc: "Compress to the 500KB target size." },
        { step: 3, title: "Save", desc: "Download the compressed file instantly." },
      ],
      faqs: [
        {
          question: "Why compress to 500KB instead of 100KB?",
          answer: "500KB is ideal when displaying images on large 4K desktop screens where maximum detail and fine textures are required.",
        },
      ],
      relatedSlugs: ["compress-image-to-200kb", "compress-image-to-100kb", "compress-image-without-losing-quality"],
    },
    {
      slug: "compress-image-to-50kb",
      title: "Compress Image to 50KB Online (Instant & Secure)",
      description: "Reduce image file size to 50KB or below for online entrance exams, government recruitment, and state portal forms.",
      targetKB: 50,
      badge: "Target: 50 KB",
      overview: "A 50KB file size limit is commonly enforced by national entrance exams and government recruitment portals for candidate photographs and signature scans.",
      portalUseCases: [
        "NEET UG and JEE Main application candidate photos (typically 10KB - 50KB)",
        "IBPS PO and Clerk banking recruitment form uploads",
        "Railway Recruitment Board (RRB) online registrations",
        "State SSC and Police recruitment forms",
      ],
      dimensionsGuide: "Ideal pixel dimensions for 50KB: 300×400 px or 400×500 px. Resizing to these dimensions prevents harsh pixelation.",
      technicalTradeoffs: "Our engine performs intelligent downsampling to maintain clear face outlines and sharp contrast without artifact blur.",
      formatAdvice: "Always output as JPEG for 50KB compliance.",
      stepGuide: [
        { step: 1, title: "Select Photo", desc: "Pick your passport photo from your gallery or computer." },
        { step: 2, title: "Auto-Optimize", desc: "Target 50KB is selected automatically." },
        { step: 3, title: "Download", desc: "Save the verified file for your application." },
      ],
      faqs: [
        {
          question: "How do I ensure my 50KB photo is accepted by the exam portal?",
          answer: "Make sure the photo has a plain white background, even lighting, clear view of both ears, and falls strictly within the 10KB to 50KB range.",
        },
      ],
      relatedSlugs: ["compress-image-to-20kb", "compress-image-to-100kb", "compress-image-for-neet", "compress-image-for-jee"],
    },
    {
      slug: "compress-image-to-20kb",
      title: "Compress Image to 20KB Online (Signature & Thumbnail)",
      description: "Compress signatures and small candidate photos to 20KB or less for online government and exam forms.",
      targetKB: 20,
      badge: "Target: 20 KB",
      overview: "20KB is the strict maximum limit for scanned signatures and compact candidate icons across virtually all Indian national and state exam registration portals.",
      portalUseCases: [
        "Scanned signature uploads for UPSC, SSC, IBPS, and State PSCs",
        "NEET & JEE candidate signature verification",
        "Gate and CAT entrance exam signature scans (typically 4KB - 20KB)",
      ],
      dimensionsGuide: "Recommended dimensions: 200×100 px or 300×150 px for signatures. 200×230 px for small passport icons.",
      technicalTradeoffs: "High-contrast binarization and specialized canvas smoothing ensure fine pen strokes remain crisp and uninterrupted.",
      formatAdvice: "JPEG format with high background brightness ensures dark signature strokes on a pure white canvas.",
      stepGuide: [
        { step: 1, title: "Upload Scanned Signature", desc: "Select a photo or scan of your handwritten signature." },
        { step: 2, title: "Compress to 20KB", desc: "Our engine compresses the image to fit under 20KB." },
        { step: 3, title: "Download", desc: "Download and upload to your exam portal." },
      ],
      faqs: [
        {
          question: "Why was my signature rejected for being over 20KB?",
          answer: "Most portals have automated server validators that immediately reject files exceeding 20,480 bytes. Our tool ensures your output stays under this threshold.",
        },
      ],
      relatedSlugs: ["resize-signature-to-20kb", "compress-image-to-50kb", "compress-image-for-upsc"],
    },
    {
      slug: "compress-image-to-30kb",
      title: "Compress Image to 30KB Online",
      description: "Compress image file size to 30KB or less online. Fast, secure, and free in-browser compression.",
      targetKB: 30,
      badge: "Target: 30 KB",
      overview: "30KB is a common upper limit for scanned document thumbnails and candidate signatures on banking and government portals.",
      portalUseCases: [
        "State government application signatures and thumb impressions",
        "University scholarship identity cards",
        "Job application portal avatar photos",
      ],
      dimensionsGuide: "Ideal dimensions: 250×300 px.",
      technicalTradeoffs: "Carefully calibrated quantization curves maintain sharp edge definition.",
      formatAdvice: "JPEG format recommended.",
      stepGuide: [
        { step: 1, title: "Upload", desc: "Select your image file." },
        { step: 2, title: "Compress", desc: "Run the 30KB compression." },
        { step: 3, title: "Download", desc: "Save your optimized image." },
      ],
      faqs: [
        {
          question: "Will this tool keep my signature clear at 30KB?",
          answer: "Yes, the algorithm preserves dark ink strokes against the white background.",
        },
      ],
      relatedSlugs: ["compress-image-to-20kb", "compress-image-to-50kb", "resize-signature-to-20kb"],
    },
    {
      slug: "compress-image-for-upsc",
      title: "Compress Photo & Signature for UPSC Online Application",
      description: "Resize and compress photograph (20KB - 300KB) and signature (20KB - 300KB) according to official UPSC guidelines.",
      targetKB: 100,
      badge: "UPSC Compliant",
      overview: "The Union Public Service Commission (UPSC) mandates specific file size and dimension requirements for photograph and signature uploads in Civil Services, NDA, CDS, and CAPF applications.",
      portalUseCases: [
        "UPSC Civil Services Examination (CSE) Prelims & Mains registration",
        "UPSC NDA, NA, and CDS application forms",
        "UPSC Engineering Services (ESE) & Combined Geo-Scientist exams",
      ],
      dimensionsGuide: "UPSC Guidelines: Minimum 350×350 px, Maximum 1000×1000 px for photograph. Minimum 350×350 px for signature. File size must be between 20 KB and 300 KB.",
      technicalTradeoffs: "Optimized to produce a clean 80-100KB file that comfortably sits in the valid UPSC 20KB-300KB window.",
      formatAdvice: "Must be in JPG / JPEG format with RGB color profile.",
      stepGuide: [
        { step: 1, title: "Upload UPSC Photo", desc: "Select your formal passport-style photograph with white background." },
        { step: 2, title: "Optimize to UPSC Specs", desc: "Processes to ensure dimensions and file size match UPSC requirements." },
        { step: 3, title: "Download & Upload to UPSC", desc: "Save the compliant image and upload to upsc.gov.in." },
      ],
      faqs: [
        {
          question: "What are the latest UPSC photo guidelines?",
          answer: "The photograph must be recent (taken within 10 days of application), show 3/4th face view with clear ears, and have the candidate's name and date of photograph printed at the bottom.",
        },
      ],
      relatedSlugs: ["compress-image-to-100kb", "compress-image-to-20kb", "resize-signature-to-20kb"],
    },
    {
      slug: "compress-image-for-aadhaar",
      title: "Compress Image for Aadhaar Card Update Online",
      description: "Compress proof of identity and proof of address documents for UIDAI Aadhaar self-service update portal.",
      targetKB: 200,
      badge: "Aadhaar UIDAI Spec",
      overview: "The UIDAI Self Service Update Portal (SSUP) requires document proofs (Passport, PAN, Voter ID, Ration Card) to be under 2MB, with ideal crisp readability achieved at 200KB - 500KB.",
      portalUseCases: [
        "UIDAI myAadhaar name, address, and DOB update document uploads",
        "Aadhaar PVC card reprint document verification",
      ],
      dimensionsGuide: "Recommended dimensions: 1200×1600 px for full A4 document scans.",
      technicalTradeoffs: "Preserves small printed text and official seal watermarks.",
      formatAdvice: "JPEG or PDF format.",
      stepGuide: [
        { step: 1, title: "Select Document", desc: "Upload your ID proof scan or clear phone photograph." },
        { step: 2, title: "Compress for UIDAI", desc: "Optimizes document size to UIDAI standards." },
        { step: 3, title: "Download", desc: "Submit directly on the myaadhaar.uidai.gov.in portal." },
      ],
      faqs: [
        {
          question: "Will UIDAI reject a compressed document if the text is blurry?",
          answer: "Yes, UIDAI requires all text, dates, and names to be clearly legible. Our compressor ensures text remains sharp while shrinking the file size.",
        },
      ],
      relatedSlugs: ["compress-image-to-200kb", "compress-image-for-pan-card"],
    },
    {
      slug: "compress-image-for-pan-card",
      title: "Compress Photo & Signature for PAN Card Application (NSDL / UTIITSL)",
      description: "Resize and compress photograph and signature according to official NSDL Protean and UTIITSL PAN card portal rules.",
      targetKB: 50,
      badge: "NSDL / UTIITSL Spec",
      overview: "NSDL Protean and UTIITSL require applicant photos to be under 50KB (3.5cm × 2.5cm / 200 DPI) and signatures to be under 50KB (2cm × 4.5cm / 200 DPI).",
      portalUseCases: [
        "NSDL (Protean) New PAN Card Form 49A / 49AA",
        "UTIITSL PAN application and correction portal",
        "Instant e-PAN paperless verification",
      ],
      dimensionsGuide: "Photo: 213×213 px or 200 DPI. Signature: 400×200 px. File size under 50KB.",
      technicalTradeoffs: "Maintains official 200 DPI resolution requirements for clear biometric printing.",
      formatAdvice: "JPEG format strictly required by NSDL.",
      stepGuide: [
        { step: 1, title: "Choose Photo / Signature", desc: "Upload your PAN applicant photo or signature." },
        { step: 2, title: "Optimize", desc: "Engine formats dimensions and reduces size under 50KB." },
        { step: 3, title: "Download", desc: "Submit on the Protean or UTIITSL website." },
      ],
      faqs: [
        {
          question: "What size should PAN card signature be?",
          answer: "PAN card signature must be in JPEG format, under 50KB in size, and roughly 2cm high by 4.5cm wide.",
        },
      ],
      relatedSlugs: ["compress-image-to-50kb", "resize-signature-to-20kb", "compress-image-for-aadhaar"],
    },
    {
      slug: "compress-image-for-neet",
      title: "Compress Photo & Signature for NEET UG Exam Online",
      description: "Compress passport photo (10KB - 200KB), postcard photo, and signature for NTA NEET application.",
      targetKB: 100,
      badge: "NTA NEET Spec",
      overview: "The National Testing Agency (NTA) mandates exact specifications for NEET UG applicants: passport photograph (10KB to 200KB), postcard size photograph (10KB to 200KB), and signature (4KB to 30KB).",
      portalUseCases: [
        "NTA NEET UG online candidate registration",
        "NEET Admit Card photo verification",
      ],
      dimensionsGuide: "Passport photo: 3.5cm × 4.5cm (white background, 80% face coverage). Postcard photo: 4\" × 6\". Signature: 4KB - 30KB.",
      technicalTradeoffs: "Optimized for 80% facial coverage clarity and crisp white background contrast.",
      formatAdvice: "JPG / JPEG format only.",
      stepGuide: [
        { step: 1, title: "Select Photo", desc: "Upload your passport or postcard photo." },
        { step: 2, title: "Compress", desc: "Optimizes to NTA's exact 10KB - 200KB window." },
        { step: 3, title: "Download", desc: "Upload to neet.nta.nic.in." },
      ],
      faqs: [
        {
          question: "Does NEET require candidate name and date on the photograph?",
          answer: "Yes, NTA NEET guidelines advise that the photograph should clearly indicate the candidate's name and the date on which the photograph was taken.",
        },
      ],
      relatedSlugs: ["compress-image-to-100kb", "compress-image-for-jee", "compress-image-to-50kb"],
    },
    {
      slug: "compress-image-for-jee",
      title: "Compress Photo & Signature for JEE Main / Advanced",
      description: "Resize and compress photograph (10KB - 200KB) and signature (4KB - 30KB) for NTA JEE Main registration.",
      targetKB: 100,
      badge: "NTA JEE Spec",
      overview: "NTA JEE Main and IIT JEE Advanced online registration portals require photograph files between 10KB and 200KB, and signatures between 4KB and 30KB in clear JPEG format.",
      portalUseCases: [
        "NTA JEE Main Session 1 & 2 registrations",
        "JEE Advanced application portal",
      ],
      dimensionsGuide: "Passport photograph: 10KB - 200KB. Signature: 4KB - 30KB. Clear white background.",
      technicalTradeoffs: "Preserves facial features, ears, and sharp signature lines.",
      formatAdvice: "JPEG format.",
      stepGuide: [
        { step: 1, title: "Upload", desc: "Select your photo or signature." },
        { step: 2, title: "Process", desc: "Compress to JEE specifications." },
        { step: 3, title: "Save", desc: "Download and submit on jeemain.nta.nic.in." },
      ],
      faqs: [
        {
          question: "Can I use a colored background for JEE photo?",
          answer: "No, NTA guidelines state that the photograph must have a clear white background with 80% face coverage without spectacles/mask.",
        },
      ],
      relatedSlugs: ["compress-image-for-neet", "compress-image-to-100kb", "resize-signature-to-20kb"],
    },
    {
      slug: "compress-image-without-losing-quality",
      title: "Compress Image Without Losing Quality (Lossless & Perceptual)",
      description: "Compress images with near-lossless perceptual quality. Remove redundant metadata and optimize compression tables online.",
      targetKB: 200,
      badge: "Perceptual Lossless",
      overview: "Learn how perceptual lossless compression works by stripping invisible EXIF metadata, optimizing Huffman tables, and applying subtle chroma subsampling without degrading visible quality.",
      portalUseCases: [
        "Web designers optimizing website loading speeds for Google Core Web Vitals",
        "Digital photographers sharing high-resolution previews",
        "Email marketing newsletters requiring crisp graphics under 200KB",
      ],
      dimensionsGuide: "Retains original pixel dimensions while removing up to 70% of unnecessary byte weight.",
      technicalTradeoffs: "Uses high-precision DCT quantizers and eliminates color noise without blurring fine edges.",
      formatAdvice: "Supports JPG, PNG, and WebP.",
      stepGuide: [
        { step: 1, title: "Choose Image", desc: "Select any JPG, PNG, or WebP photo." },
        { step: 2, title: "Optimize", desc: "Our engine strips metadata and optimizes compression tables." },
        { step: 3, title: "Download", desc: "Save your lightweight, crystal-clear image." },
      ],
      faqs: [
        {
          question: "What is perceptual lossless compression?",
          answer: "Perceptual lossless compression removes data that the human eye cannot perceive (such as minute color variations in high-frequency patterns) while keeping all visible lines, textures, and details sharp.",
        },
      ],
      relatedSlugs: ["compress-image-to-200kb", "compress-image-to-500kb", "compress-image-to-100kb"],
    },
    {
      slug: "compress-image-for-tnpsc",
      title: "Compress Photo & Signature for TNPSC Online Application",
      description: "Resize and compress photograph (20KB - 50KB) and signature (10KB - 20KB) according to official TNPSC rules.",
      targetKB: 50,
      badge: "TNPSC Spec",
      overview: "Tamil Nadu Public Service Commission (TNPSC) mandates exact specifications for Group 1, Group 2, Group 4, and VAO applications: photo (20KB to 50KB, 200 DPI) and signature (10KB to 20KB, 200 DPI).",
      portalUseCases: [
        "TNPSC Group 4 and VAO candidate registration",
        "TNPSC Group 2 and Group 1 prelims registration",
        "TNPSC One Time Registration (OTR) profile photo update",
      ],
      dimensionsGuide: "Photo: 3.5cm × 4.5cm (20KB - 50KB). Signature: 1.5cm × 4.5cm (10KB - 20KB).",
      technicalTradeoffs: "Optimized for TNPSC's automated image validation scanner.",
      formatAdvice: "JPG / JPEG format only.",
      stepGuide: [
        { step: 1, title: "Upload Photo / Signature", desc: "Select your passport photo or signature scan." },
        { step: 2, title: "Compress for TNPSC", desc: "Auto-adjusts size to fit TNPSC limits." },
        { step: 3, title: "Download", desc: "Upload to tnpsc.gov.in." },
      ],
      faqs: [
        {
          question: "Does TNPSC require candidate name and date on the photo?",
          answer: "Yes, TNPSC guidelines mandate that the candidate's name and the date of taking the photograph must be printed at the bottom of the photo.",
        },
      ],
      relatedSlugs: ["compress-image-to-50kb", "resize-signature-to-20kb", "compress-image-for-upsc"],
    },
    {
      slug: "compress-image-for-passport",
      title: "Compress Passport Size Photo Online",
      description: "Compress and resize international and Indian passport size photos online for visa and official passport portals.",
      targetKB: 100,
      badge: "Passport Photo Spec",
      overview: "Passport Seva Kendra and international visa application systems require passport photographs meeting exact dimension (2\"×2\" or 3.5cm×4.5cm) and file size standards (under 100KB - 300KB).",
      portalUseCases: [
        "Passport Seva Online Portal (passportindia.gov.in)",
        "US Visa (DS-160) photo upload (2\"×2\", under 240KB)",
        "Schengen Visa and UK Visa online photo submissions",
      ],
      dimensionsGuide: "Indian Passport: 3.5cm × 4.5cm (under 100KB). US Visa: 600×600 px to 1200×1200 px (under 240KB).",
      technicalTradeoffs: "Preserves sharp facial contours and true skin tones.",
      formatAdvice: "JPEG format with RGB color space.",
      stepGuide: [
        { step: 1, title: "Upload Passport Photo", desc: "Choose your passport photo." },
        { step: 2, title: "Compress", desc: "Engine optimizes size under 100KB." },
        { step: 3, title: "Download", desc: "Save for your passport or visa portal." },
      ],
      faqs: [
        {
          question: "Can I wear eyeglasses in passport photos?",
          answer: "Most passport and visa authorities (including US, UK, and India) do not permit eyeglasses in official passport photos to prevent glare and reflections.",
        },
      ],
      relatedSlugs: ["compress-image-to-100kb", "compress-image-for-upsc", "compress-image-for-aadhaar"],
    },
  ],

  "signature-resizer": [
    {
      slug: "resize-signature-to-20kb",
      title: "Resize Signature to 20KB Online (Government & Exam Portals)",
      description: "Resize and compress signature images to exactly 20KB or less for UPSC, SSC, IBPS, and State PSC application forms.",
      targetKB: 20,
      badge: "Signature Spec: 20 KB",
      overview: "Online application forms for government recruitment and entrance examinations strictly require applicant signatures to be under 20KB in size. Our in-browser tool crops, enhances contrast, and compresses your signature to meet these strict requirements.",
      portalUseCases: [
        "UPSC, SSC CGL/CHSL, IBPS Bank PO/Clerk candidate signature uploads",
        "NEET UG, JEE Main, and GATE signature verification",
        "PAN Card (NSDL / UTIITSL) application signature upload",
      ],
      dimensionsGuide: "Ideal dimensions: 140×60 px to 300×150 px. File size strictly under 20KB (4KB - 20KB).",
      technicalTradeoffs: "Enhances black/blue ink contrast on white paper background while maintaining stroke clarity.",
      formatAdvice: "JPEG format.",
      stepGuide: [
        { step: 1, title: "Upload Signature", desc: "Take a photo of your signature on clean white paper." },
        { step: 2, title: "Optimize to 20KB", desc: "Our engine optimizes resolution and file size under 20KB." },
        { step: 3, title: "Download", desc: "Upload directly to your exam or government portal." },
      ],
      faqs: [
        {
          question: "Should I sign with blue or black ink?",
          answer: "Most recruitment portals (such as UPSC, SSC, and NSDL) prefer signatures signed with a black ink pen on clean white paper.",
        },
      ],
      relatedSlugs: ["compress-image-to-20kb", "passport-signature-resizer", "compress-image-for-upsc"],
    },
    {
      slug: "passport-signature-resizer",
      title: "Passport Signature Resizer Online",
      description: "Resize and format signatures for Indian Passport Seva and international visa portals.",
      targetKB: 20,
      badge: "Passport Signature Spec",
      overview: "Passport Seva Kendra portal requires applicant signatures to be in JPEG format, between 10KB and 20KB, and with dimensions of 4.5cm width by 1.5cm height.",
      portalUseCases: [
        "Passport Seva Online Form signature upload",
        "Minor child thumb impression upload",
      ],
      dimensionsGuide: "Recommended dimensions: 300×100 px (3:1 aspect ratio). File size under 20KB.",
      technicalTradeoffs: "Ensures pure white background and legible ink strokes.",
      formatAdvice: "JPEG format.",
      stepGuide: [
        { step: 1, title: "Select Signature", desc: "Upload signature photo." },
        { step: 2, title: "Format", desc: "Adjusts dimensions and size for Passport Seva." },
        { step: 3, title: "Save", desc: "Download the compliant image." },
      ],
      faqs: [
        {
          question: "Can I upload a signature with a shadow on the paper?",
          answer: "Shadows may cause rejection. Ensure your signature photo is taken in bright, even lighting or scanned directly.",
        },
      ],
      relatedSlugs: ["resize-signature-to-20kb", "compress-image-for-passport", "compress-image-to-20kb"],
    },
  ],

  "pdf-to-jpg": [
    {
      slug: "convert-pdf-to-jpg-online",
      title: "Convert PDF to JPG Online (Fast & Private)",
      description: "Extract and convert PDF pages into high-resolution JPG images in your browser without uploading files.",
      targetKB: 200,
      badge: "PDF to JPG",
      overview: "Convert multi-page PDF documents, scanned certificates, receipts, and invoices into standalone high-quality JPG image files directly on your device.",
      portalUseCases: [
        "Extracting certificate pages for portals that only accept JPG uploads",
        "Sharing invoice and receipt images on messaging apps",
        "Converting PDF slides into presentation images",
      ],
      dimensionsGuide: "Renders at 150 DPI to 300 DPI for crisp document text.",
      technicalTradeoffs: "Uses client-side PDF rendering canvas to output crisp JPEG streams.",
      formatAdvice: "Outputs high-quality JPEG images.",
      stepGuide: [
        { step: 1, title: "Select PDF", desc: "Choose your PDF document." },
        { step: 2, title: "Convert", desc: "Each page is rendered to a sharp JPG image." },
        { step: 3, title: "Download", desc: "Download individual JPG images." },
      ],
      faqs: [
        {
          question: "Are my confidential PDF documents uploaded to a server?",
          answer: "No. Nova Tools processes PDFs locally in your browser with WebAssembly / HTML5 canvas. Your document never leaves your device.",
        },
      ],
      relatedSlugs: ["compress-image-to-100kb", "compress-image-to-200kb"],
    },
  ],
};