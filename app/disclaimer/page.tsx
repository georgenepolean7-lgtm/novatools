import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <section className="mx-auto max-w-4xl px-6 py-14">
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Disclaimer
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            Last updated: July 26, 2026
          </p>

          <div className="mt-8 space-y-8 leading-7 text-slate-600">
            <section>
              <h2 className="text-xl font-bold text-slate-900">
                General Information
              </h2>

              <p className="mt-3">
                Nova Tools provides online utilities for image, PDF,
                document conversion and text extraction tasks.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                File Processing Results
              </h2>

              <p className="mt-3">
                File size, image quality, PDF quality, dimensions and
                conversion results may vary depending on the original
                file and the settings selected by the user.
              </p>

              <p className="mt-3">
                Always check the processed file before submitting it to
                government portals, educational institutions, employers
                or other services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                OCR Accuracy
              </h2>

              <p className="mt-3">
                Text extraction and OCR results may contain incorrect,
                missing or misidentified characters. Accuracy can be
                affected by image quality, font style, language, layout,
                background and text size.
              </p>

              <p className="mt-3">
                Users should review and correct extracted text before
                relying on it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                PDF Compression
              </h2>

              <p className="mt-3">
                A requested PDF target size cannot always be reached
                without reducing visual quality. Nova Tools may preserve
                a larger file when stronger compression would make the
                document difficult to read.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                External Services
              </h2>

              <p className="mt-3">
                Nova Tools may use third-party libraries, analytics,
                advertising or other external services. Those services
                may have their own terms and privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Service Availability
              </h2>

              <p className="mt-3">
                We do not guarantee that every tool will always be
                available, error-free or compatible with every file,
                browser or device.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                Contact
              </h2>

              <p className="mt-3">
                If you find a problem with Nova Tools, you can contact
                Nova Code Tech using the contact information provided on
                the website.
              </p>
            </section>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}