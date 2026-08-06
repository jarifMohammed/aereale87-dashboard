import Link from "next/link";
import { BookOpen, ExternalLink, ArrowLeft } from "lucide-react";

export default function AuthorTermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-serif text-xl font-bold text-[#b79731]">
            <BookOpen className="size-6 text-[#cfaf45]" />
            <span>W.E. Books</span>
          </div>
          <Link
            href="/author-dashboard/books"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#b79731] transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 md:p-12">
          {/* Header */}
          <header className="border-b border-slate-100 pb-8 mb-8">
            <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              Legal & Compliance
            </span>
            <h1 className="mt-3 font-serif text-3xl font-bold text-slate-900 sm:text-4xl">
              Author Terms of Service
            </h1>
            <p className="mt-2 text-sm text-slate-500 font-medium">
              W.E. Books (The Wonder Emporium Inc.)
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
              <span>Last Updated: July 15, 2026</span>
              <span>•</span>
              <span>Effective Date: July 15, 2026</span>
            </div>
          </header>

          <div className="space-y-8 text-[15px] leading-7 text-slate-600">
            {/* Preamble */}
            <div className="bg-slate-50/50 rounded-xl border border-slate-100 p-6 text-[15px] italic text-slate-700">
              <p className="mb-4">
                These Author Terms of Service (&quot;Author Terms&quot;) are a
                legal agreement between you (&quot;Author,&quot;
                &quot;you,&quot; or &quot;your&quot;) and The Wonder Emporium
                Inc., d/b/a W.E. Books, a Texas limited liability company
                headquartered in Houston, Texas (&quot;W.E. Books,&quot;
                &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). These
                Author Terms govern your submission, distribution, and sale of
                manuscripts, eBooks, and audiobooks (collectively, &quot;Author
                Content&quot;) through the W.E. Books platform (the
                &quot;Platform&quot;).
              </p>
              <p>
                These Author Terms apply specifically to your relationship with
                us as a content-supplying author. They are separate from, and
                supplement, our general Customer Terms of Service and Privacy
                Policy, which also apply to your use of the Platform as a
                registered user. By creating an Author Account, submitting
                Author Content, or accepting placement in the Founding 100
                Authors Program, you agree to be bound by these Author Terms.
              </p>
            </div>

            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                1. Eligibility and Author Account
              </h2>
              <div className="space-y-4 pl-1">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    1.1 Who May Register
                  </h3>
                  <p>
                    You must be at least 18 years old (or the age of majority in
                    your jurisdiction) and legally able to enter into a binding
                    contract to register as an author. If you are submitting on
                    behalf of a company, estate, or publishing entity, you
                    represent that you have authority to bind that entity to
                    these Author Terms.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    1.2 Author Account Information
                  </h3>
                  <p>
                    You agree to provide accurate legal name, contact
                    information, and tax identification details as required
                    under Section 8. You are responsible for keeping this
                    information current — outdated banking or tax information
                    may delay or prevent royalty payments.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    1.3 One Author Account Per Rights Holder
                  </h3>
                  <p>
                    Each individual author or publishing entity should maintain
                    a single Author Account. If multiple pen names are used,
                    they should be managed under one account unless otherwise
                    agreed with us in writing.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                2. Author Tiers: Founding 100 vs. Standard Authors
              </h2>
              <p>
                W.E. Books offers two author participation tracks. The track you
                fall under determines your royalty rates and, in some cases,
                whether those rates can change over time.
              </p>
              <div className="space-y-4 pl-1">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    2.1 Founding 100 Authors Program
                  </h3>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    <li>
                      Limited to the <strong>first 100 authors</strong> who
                      complete registration, sign these Author Terms, and
                      successfully publish at least one qualifying title before
                      our public launch date (the &quot;Founding Window&quot;).
                    </li>
                    <li>
                      Founding 100 Authors receive{" "}
                      <strong>
                        permanently locked-in premium royalty rates
                      </strong>
                      , as set out in the Founding 100 Author Addendum provided
                      to you at signup. These locked rates apply to titles
                      published under your Founding 100 status for as long as
                      your account remains active and in good standing, and will
                      not be reduced by any future general rate changes under
                      Section 4.4.
                    </li>
                    <li>
                      Founding 100 status is tied to your individual Author
                      Account and is non-transferable. It does not apply to
                      accounts created after the Founding Window closes,
                      regardless of when a given title is uploaded.
                    </li>
                    <li>
                      We reserve the right to verify Founding 100 eligibility
                      (e.g., confirming your registration and qualifying title
                      were completed within the Founding Window) and to correct
                      any erroneous grants of Founding 100 status.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    2.2 Standard Authors
                  </h3>
                  <p>
                    Authors who register after the Founding Window closes are
                    Standard Authors. Standard Authors choose, at the time of
                    upload for each title, between:
                  </p>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    <li>
                      <strong>W.E. Books–Exclusive Distribution:</strong> Your
                      title is made available only through the W.E. Books
                      platform (not simultaneously listed on other retailers or
                      platforms by you). In exchange, you receive a higher
                      royalty rate than the Wide Distribution option.
                    </li>
                    <li>
                      <strong>Wide Distribution:</strong> Your title may also be
                      distributed by you through other retailers or platforms
                      outside W.E. Books. This flexibility comes with a lower
                      royalty rate on W.E. Books sales, reflecting the
                      non-exclusive nature of the arrangement.
                    </li>
                  </ul>
                  <p className="mt-2">
                    Current royalty percentages for each tier and distribution
                    path, for both digital and print formats, are set out in the
                    Royalty Schedule available in your Author Dashboard and are
                    incorporated into these Author Terms by reference.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    2.3 Changing Distribution Path
                  </h3>
                  <p>
                    Standard Authors may change a title&apos;s distribution path
                    (Exclusive vs. Wide) prospectively for future sales by
                    updating their selection in the Author Dashboard; changes do
                    not retroactively apply to royalties already earned or in
                    process.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                3. Content Submission and Formats
              </h2>
              <div className="space-y-4 pl-1">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    3.1 Supported Formats
                  </h3>
                  <p>
                    You may upload manuscripts for distribution in one or more
                    of the following formats:
                  </p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5">
                    <li>
                      <strong>eBook</strong> (digital, read via the WE Books
                      App);
                    </li>
                    <li>
                      <strong>Audiobook</strong> (digital, streamed or
                      downloaded via the WE Books App); and
                    </li>
                    <li>
                      <strong>Print</strong> (physical books produced on-demand
                      through our print fulfillment partner, described in
                      Section 5).
                    </li>
                  </ul>
                  <p className="mt-2">
                    Each format is uploaded and managed separately in the Author
                    Dashboard and may have independent pricing, availability,
                    and distribution-path settings.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    3.2 Content Requirements
                  </h3>
                  <p>You agree that all Author Content you submit:</p>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    <li>
                      Is your own original work, or you hold all necessary
                      rights, licenses, and permissions (including from
                      co-authors, translators, illustrators, narrators, or
                      estates) to publish and distribute it;
                    </li>
                    <li>
                      Does not infringe any copyright, trademark, right of
                      publicity, privacy right, or other intellectual property
                      or legal right of any third party;
                    </li>
                    <li>
                      Does not contain defamatory, obscene (under applicable
                      law), or unlawful material;
                    </li>
                    <li>
                      Complies with our content guidelines as published in the
                      Author Dashboard (which may prohibit or restrict certain
                      categories, such as content that infringes third-party IP,
                      is plagiarized, or is generated in violation of another
                      platform&apos;s terms); and
                    </li>
                    <li>
                      Accurately represents its genre, content warnings, and
                      age-appropriateness metadata as requested during upload.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    3.3 Metadata and Discoverability
                  </h3>
                  <p>
                    You are responsible for the accuracy of the title,
                    description, keywords/tags, categories, and cover art you
                    submit. We may adjust metadata formatting for platform
                    consistency but will not alter the substantive content of
                    your listing without notice.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    3.4 Review and Removal
                  </h3>
                  <p>
                    We may review submitted Author Content for compliance with
                    Section 3.2 and our content guidelines. We reserve the right
                    to reject, delay, or remove any title — including titles
                    already published — that we reasonably believe violates
                    these Author Terms, infringes third-party rights, or exposes
                    W.E. Books to legal risk. Where practical, we will notify
                    you of removal and the reason.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                4. Royalties and Pricing
              </h2>
              <div className="space-y-4 pl-1">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    4.1 Royalty Basis
                  </h3>
                  <p>
                    Royalties are calculated as a percentage of Net Revenue,
                    defined as:
                  </p>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    <li>
                      <strong>
                        For digital À La Carte purchases and
                        membership-supported reads/listens:
                      </strong>{" "}
                      the purchase price (or allocated membership revenue, per
                      Section 4.5) actually collected, less payment processing
                      fees and applicable taxes remitted on your behalf.
                    </li>
                    <li>
                      <strong>For Print titles:</strong> the purchase price
                      actually collected, less the print production cost charged
                      by our print fulfillment partner for that unit, less
                      payment processing fees and applicable taxes remitted on
                      your behalf.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    4.2 Print Fulfillment Through Lulu Press
                  </h3>
                  <p>
                    All Print-format titles are produced and fulfilled on a
                    print-on-demand basis through{" "}
                    <strong>Lulu Press, Inc. (&quot;Lulu&quot;)</strong>, our
                    third-party print fulfillment partner. You acknowledge and
                    agree that:
                  </p>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    <li>
                      Lulu&apos;s per-unit print production cost (which varies
                      by trim size, page count, binding, color, and the country
                      in which a given copy is printed and shipped) is deducted
                      from the sale price before your print royalty is
                      calculated;
                    </li>
                    <li>
                      Because Lulu&apos;s production costs differ by country,
                      your effective print royalty and the customer-facing
                      retail price for a given title may vary by region; the
                      Author Dashboard&apos;s pricing calculator reflects these
                      country-specific costs so you can see estimated royalties
                      per region before setting your price;
                    </li>
                    <li>
                      We apply a <strong>Protected Margin Pricing</strong>{" "}
                      methodology, meaning we set minimum retail price floors
                      for Print titles designed to ensure that W.E. Books&apos;
                      own margin is not eroded by fluctuations in Lulu&apos;s
                      production costs; this may mean we decline to publish a
                      Print edition at a price you request if it would fall
                      below the calculated floor for a given region;
                    </li>
                    <li>
                      W.E. Books is not responsible for Lulu&apos;s
                      manufacturing quality, shipping times, or fulfillment
                      errors, though we will assist in coordinating reasonable
                      corrections where possible; and
                    </li>
                    <li>
                      Availability of Print format for a given title may be
                      limited by Lulu&apos;s supported trim sizes, page counts,
                      and shipping regions.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    4.3 Setting Your Price
                  </h3>
                  <p>
                    You set the retail list price for each format and title
                    within any minimum/maximum bounds shown in the Author
                    Dashboard (including the Protected Margin Pricing floor for
                    Print titles). We may display converted/localized prices to
                    customers in different countries or currencies; your royalty
                    is calculated based on the Net Revenue actually collected in
                    each region, converted to U.S. dollars at the time of payout
                    using a commercially reasonable exchange rate.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    4.4 Rate Changes
                  </h3>
                  <p>
                    We may adjust the general royalty schedule for Standard
                    Authors prospectively, with at least 30 days&apos; notice
                    via email or Author Dashboard notice. Rate changes apply
                    only to sales occurring after the effective date of the
                    change and never apply retroactively. Founding 100
                    Authors&apos; locked-in rates are not affected by general
                    rate changes, as described in Section 2.1.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    4.5 Membership/Subscription Revenue Allocation
                  </h3>
                  <p>
                    For sales made through a reader&apos;s paid membership
                    rather than an à la carte purchase, your royalty is
                    calculated based on your title&apos;s share of total
                    qualifying reads/listens (or another reasonable allocation
                    methodology disclosed in the Author Dashboard) applied to
                    the pool of membership revenue for the relevant period, less
                    the deductions described in Section 4.1.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                5. Print Production Details
              </h2>
              <div className="space-y-4 pl-1">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    5.1 Lulu as Fulfillment Partner
                  </h3>
                  <p>
                    By selecting Print distribution for a title, you authorize
                    W.E. Books to submit your manuscript files and cover art to
                    Lulu for production and to enter into the necessary
                    print-on-demand arrangement on your behalf as part of the
                    W.E. Books Print program. You are not required to hold a
                    separate, direct account with Lulu.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    5.2 File Requirements
                  </h3>
                  <p>
                    Print titles must meet Lulu&apos;s technical file
                    specifications (trim size, bleed, resolution, file format)
                    as communicated through the Author Dashboard upload flow. We
                    may reject or request corrections to files that do not meet
                    these specifications.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    5.3 Returns and Printing Defects
                  </h3>
                  <p>
                    Customer returns or complaints regarding physical print
                    defects (misprints, binding errors, shipping damage) are
                    handled under our return policy in coordination with Lulu.
                    Print royalties are not paid on units that are returned,
                    refunded, or reprinted due to a defect.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                6. Payment Structure and Banking Information
              </h2>
              <div className="space-y-4 pl-1">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    6.1 Payment Method
                  </h3>
                  <p>
                    Author royalty payments are made via direct deposit (ACH) to
                    a U.S. checking or savings account that you provide in the
                    Author Dashboard. To receive payment, you must submit:
                  </p>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5">
                    <li>Your bank&apos;s routing number; and</li>
                    <li>
                      Your account number for the checking (or savings) account
                      where royalties should be deposited.
                    </li>
                  </ul>
                  <p className="mt-2">
                    You are solely responsible for the accuracy of this banking
                    information. Payments sent to an incorrect account due to
                    inaccurate information you provided will not be re-issued at
                    our expense.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    6.2 Payment Schedule and Minimum Threshold
                  </h3>
                  <p>
                    Royalties are calculated and paid on the schedule and
                    minimum payout threshold disclosed in the Author Dashboard
                    (for example, a monthly payout once accrued royalties exceed
                    a stated minimum). Amounts below the threshold roll over and
                    accumulate until the threshold is met.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    6.3 Currency
                  </h3>
                  <p>
                    Payouts are made in U.S. dollars. If you are located outside
                    the United States, you are responsible for any currency
                    conversion or international transfer arrangements and any
                    associated fees on your end, unless we expressly offer an
                    alternative payment method.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    6.4 Payment Errors
                  </h3>
                  <p>
                    If you believe a royalty payment is incorrect, you must
                    notify us at{" "}
                    <a
                      href="mailto:support@thewonderemporium.com"
                      className="font-semibold text-[#cfaf45] hover:underline"
                    >
                      support@thewonderemporium.com
                    </a>{" "}
                    within 90 days of the payment date. Claims made after this
                    period may not be eligible for correction.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    6.5 Right to Withhold
                  </h3>
                  <p>
                    We may withhold or delay payment where required by law
                    (including tax withholding under Section 8), where a payment
                    dispute is under investigation, where fraud or content
                    violations are suspected, or where your banking information
                    is incomplete or invalid.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                7. Statements and Reporting
              </h2>
              <p className="pl-1">
                We will make sales and royalty data available to you through the
                Author Dashboard, including unit sales, format, distribution
                path, and calculated royalty by title and period. You are
                responsible for reviewing this data and maintaining your own
                records for tax purposes.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                8. Tax Compliance
              </h2>
              <div className="space-y-4 pl-1">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    8.1 U.S. Persons — Form W-9
                  </h3>
                  <p>
                    If you are a U.S. person (as defined by the IRS) or U.S.
                    entity, you must submit a completed Form W-9 through the
                    Author Dashboard before your first royalty payment. We will
                    not release payment until a valid W-9 is on file.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    8.2 Form 1099-NEC
                  </h3>
                  <p>
                    If your royalty payments meet the applicable IRS reporting
                    threshold in a calendar year, we will issue you a Form
                    1099-NEC by the required deadline and file a corresponding
                    return with the IRS. You are responsible for reporting and
                    paying all applicable federal, state, and local taxes on
                    your royalty income.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    8.3 Non-U.S. Authors
                  </h3>
                  <p>
                    If you are not a U.S. person, you may be required to submit
                    an applicable IRS Form W-8 series form, and payments may be
                    subject to U.S. tax withholding at the statutory rate unless
                    a tax treaty benefit applies and is properly claimed. You
                    are responsible for your own tax obligations in your country
                    of residence.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    8.4 No Tax Advice
                  </h3>
                  <p>
                    W.E. Books does not provide tax advice. You should consult
                    your own tax professional regarding the treatment of royalty
                    income.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                9. Intellectual Property and License Grant
              </h2>
              <div className="space-y-4 pl-1">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    9.1 You Retain Ownership
                  </h3>
                  <p>
                    You retain all right, title, and interest (including
                    copyright) in and to your Author Content. Nothing in these
                     Author Terms transfers ownership of your work to W.E. Books.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    9.2 License You Grant to Us
                  </h3>
                  <p>
                    By submitting Author Content, you grant W.E. Books a
                    non-exclusive (or, if you select W.E. Books–Exclusive
                    Distribution under Section 2.2,
                    exclusive-as-to-W.E.-Books-platform-sales-only) worldwide
                    license to:
                  </p>
                  <ul className="mt-2 list-disc space-y-2 pl-5">
                    <li>
                      Reproduce, store, format-convert, and distribute your
                      Author Content in eBook, audiobook, and/or Print formats
                      through the Platform and our print fulfillment partner;
                    </li>
                    <li>
                      Display your title&apos;s metadata, cover art, and
                      marketing excerpts for promotional purposes on the
                      Platform, our marketing channels, and (with your separate
                      consent) third-party promotional placements; and
                    </li>
                    <li>
                      Apply reasonable digital rights management (DRM) or
                      access-control technology to protect your Author Content
                      from unauthorized copying, consistent with Section 6 of
                      our Customer Terms of Service.
                    </li>
                  </ul>
                  <p className="mt-2">
                    This license continues for as long as the applicable title
                    remains published on the Platform and terminates (subject to
                    Section 10.3) upon removal of the title or termination of
                    your Author Account.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    9.3 Your Warranties
                  </h3>
                  <p>
                    You represent and warrant that you own or control all rights
                    necessary to grant the license in Section 9.2, and that
                    doing so does not violate any other agreement you have
                    entered into (including any exclusivity commitment to
                    another platform, if you have selected W.E. Books–Exclusive
                    Distribution).
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                10. Term, Suspension, and Termination
              </h2>
              <div className="space-y-4 pl-1">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    10.1 Term
                  </h3>
                  <p>
                    Your Author Account remains active until terminated by you
                    or by us as described below.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    10.2 Termination by You
                  </h3>
                  <p>
                    You may withdraw a title or close your Author Account at any
                    time through the Author Dashboard or by written notice to{" "}
                    <a
                      href="mailto:support@thewonderemporium.com"
                      className="font-semibold text-[#cfaf45] hover:underline"
                    >
                      support@thewonderemporium.com
                    </a>
                    . Withdrawal removes the title from future sale but does not
                    affect royalties already earned on completed sales, nor
                    customers&apos; existing access to previously purchased
                    copies.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    10.3 Termination by Us
                  </h3>
                  <p>
                    We may suspend or terminate your Author Account, or remove
                    specific titles, if you materially breach these Author Terms
                    (including submitting infringing, fraudulent, or prohibited
                    content), if required by law, or if your account poses a
                    legal or security risk to the Platform or our users. Where
                    practical, we will provide notice and an opportunity to cure
                    before termination, except in cases of suspected fraud,
                    infringement claims, or legal necessity.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    10.4 Effect of Termination
                  </h3>
                  <p>
                    Upon termination, any accrued and unpaid royalties owed to
                    you (net of any amounts properly withheld) will be paid out
                    according to our normal payment schedule in Section 6.2,
                    provided your banking and tax information on file is valid.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 11 */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                11. Indemnification
              </h2>
              <p className="pl-1">
                You agree to indemnify, defend, and hold harmless The Wonder
                Emporium Inc. and its officers, employees, and agents from any
                claims, damages, losses, liabilities, and expenses (including
                reasonable attorneys&apos; fees) arising out of: (a) your Author
                Content, including any claim that it infringes or
                misappropriates a third party&apos;s rights; (b) your breach of
                these Author Terms; or (c) your violation of any applicable law
                in connection with your use of the Platform.
              </p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                12. Disclaimers and Limitation of Liability
              </h2>
              <div className="space-y-4 pl-1">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    12.1 No Guarantee of Sales
                  </h3>
                  <p>
                    We do not guarantee any minimum level of sales, royalty
                    income, visibility, or promotional placement for your Author
                    Content.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    12.2 Disclaimer
                  </h3>
                  <p className="font-mono text-xs tracking-wide text-slate-700 uppercase">
                    THE PLATFORM AND ALL RELATED SERVICES ARE PROVIDED &quot;AS
                    IS&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED,
                    INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
                    PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    12.3 Limitation of Liability
                  </h3>
                  <p className="font-mono text-xs tracking-wide text-slate-700 uppercase">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, W.E. BOOKS&apos;
                    TOTAL AGGREGATE LIABILITY TO YOU ARISING OUT OF OR RELATED
                    TO THESE AUTHOR TERMS WILL NOT EXCEED THE TOTAL ROYALTIES
                    PAID TO YOU IN THE 12 MONTHS PRECEDING THE CLAIM. W.E. BOOKS
                    WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL,
                    OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS OR LOST
                    ROYALTIES.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 13 */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                13. Changes to These Author Terms
              </h2>
              <p className="pl-1">
                We may update these Author Terms from time to time. Material
                changes will be communicated via email or Author Dashboard
                notice at least 30 days before taking effect, except where
                changes are required for legal compliance. Continued use of your
                Author Account after the effective date constitutes acceptance.
                As noted in Section 2.1 and Section 4.4, changes to the general
                royalty schedule do not override the locked rates guaranteed to
                Founding 100 Authors.
              </p>
            </section>

            {/* Section 14 */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                14. Dispute Resolution and Governing Law
              </h2>
              <div className="space-y-4 pl-1">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    14.1 Informal Resolution
                  </h3>
                  <p>
                    Before filing a claim, you agree to contact us at{" "}
                    <a
                      href="mailto:support@thewonderemporium.com"
                      className="font-semibold text-[#cfaf45] hover:underline"
                    >
                      support@thewonderemporium.com
                    </a>{" "}
                    to attempt informal resolution for at least 30 days.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    14.2 Binding Arbitration and Class Action Waiver
                  </h3>
                  <p>
                    Any dispute arising out of or relating to these Author Terms
                    will be resolved by binding individual arbitration
                    administered by AAA or JAMS (to be finalized with counsel),
                    rather than in court, except that either party may bring an
                    individual claim in small claims court where it qualifies.
                    You and W.E. Books agree that any proceeding will be
                    conducted only on an individual basis and not as a class,
                    consolidated, or representative action.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    14.3 Governing Law
                  </h3>
                  <p>
                    These Author Terms are governed by the laws of the State of
                    Texas, without regard to conflict-of-law principles, except
                    where preempted by federal law.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 15 */}
            <section className="space-y-4 border-t border-slate-100 pt-6">
              <h2 className="text-xl font-bold text-slate-900 border-l-4 border-[#cfaf45] pl-3">
                15. Miscellaneous
              </h2>
              <ul className="mt-2 list-disc space-y-2 pl-7">
                <li>
                  <strong>Entire Agreement:</strong> These Author Terms, the
                  Royalty Schedule, the Founding 100 Author Addendum (if
                  applicable), and our Customer Terms of Service and Privacy
                  Policy constitute the entire agreement between you and W.E.
                  Books regarding your role as an author on the Platform.
                </li>
                <li>
                  <strong>Severability:</strong> If any provision is found
                  unenforceable, the remaining provisions remain in effect.
                </li>
                <li>
                  <strong>Assignment:</strong> You may not assign these Author
                  Terms without our written consent. We may assign these Author
                  Terms in connection with a merger, acquisition, or sale of
                  assets.
                </li>
                <li>
                  <strong>Independent Contractor Status:</strong> Nothing in
                  these Author Terms creates an employment, partnership, or
                  joint venture relationship between you and W.E. Books. You are
                  an independent, self-published or independent author retaining
                  full ownership of your work.
                </li>
                <li>
                  <strong>Contact:</strong> Questions about these Author Terms
                  can be sent to{" "}
                  <a
                    href="mailto:support@thewonderemporium.com"
                    className="font-semibold text-[#cfaf45] hover:underline"
                  >
                    support@thewonderemporium.com
                  </a>
                  .
                </li>
              </ul>
            </section>

            {/* Drafting Note Box */}
            <div className="mt-8 border-l-4 border-amber-500 bg-amber-50/30 p-5 rounded-r-xl text-sm leading-6 text-slate-700">
              <p className="font-bold text-amber-800 uppercase tracking-wider text-xs mb-2">
                Legal Review & Drafting Note
              </p>
              <p>
                This document is a working draft prepared for The Wonder
                Emporium Inc. / W.E. Books and has not been reviewed by an
                attorney. Before publishing, please have Texas business and IP
                counsel review, in particular: (1) the exclusivity language in
                Section 2.2 and 9.2, to make sure &quot;W.E. Books–Exclusive
                Distribution&quot; is enforceable and clearly scoped; (2) the
                Lulu print cost pass-through and Protected Margin Pricing
                language in Sections 4.2 and 4.4, to confirm it matches your
                actual Lulu vendor agreement; (3) the tax withholding language
                in Section 8.3 for non-U.S. authors, which has specific IRS
                compliance requirements (Form W-8BEN, treaty claims); and (4)
                the arbitration clause in Section 14, for the same
                state-specific reasons flagged in your Customer Terms of
                Service.
              </p>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
