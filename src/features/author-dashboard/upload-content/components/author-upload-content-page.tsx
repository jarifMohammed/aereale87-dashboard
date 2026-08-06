"use client";

import { FormEvent, useEffect, useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, FileAudio, FileText, Save, Package, Calendar, Eye, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { BackendBook } from "../../books/types";

type FormatKey = "EBOOK" | "AUDIOBOOK" | "HARDCOVER" | "PAPERBACK";
type PrintFormatKey = Extract<FormatKey, "HARDCOVER" | "PAPERBACK">;

type EditBook = {
  title: string;
  description: string | null;
  isbn: string | null;
  category: string | null;
  tags: string[];
  language: string | null;
  ageGroup: string | null;
  formats: Array<{ formatType: FormatKey; listPrice: number; pageCount?: number; trimSize?: string }>;
  status: string;
  publicationDetails: string | null;
  printEdition?: any;
};

type BookTypeOption = { value: string; label: string; trimSku: string };
type SkuOption = { value: string; label?: string; sku: string; minPage?: number; maxPage?: number };

type SpecificationOptions = {
  bookTypes: BookTypeOption[];
  interiorColors: SkuOption[];
  printQualities: SkuOption[];
  bindings: { paperback: SkuOption[]; hardcover: SkuOption[] };
  paperTypes: SkuOption[];
  laminations: SkuOption[];
  linenColors: SkuOption[];
  foilColors: SkuOption[];
  printInsideCover: SkuOption[];
};

type AvailableSpecificationOptions = Omit<SpecificationOptions, "bindings"> & {
  bindings: SkuOption[];
  count?: number;
  valid?: boolean;
  validPageRange?: { minPage: number; maxPage: number } | null;
};

type MatchResult = {
  found: boolean;
  sku: string | null;
  minPage: number | null;
  maxPage: number | null;
  pricing: {
    basePriceUSD: number;
    perPagePriceUSD: number;
  } | null;
};

type PrintFileValidationResult = {
  valid: boolean;
  message?: string;
  podPackageId?: string;
  interiorPageCount?: number;
  coverDimensions?: { width: string; height: string; unit: string };
  files?: {
    interiorPdf?: { url: string };
    coverPdf?: { url: string };
  };
};

type PrintOptionsResponse = {
  paperback: Array<{ newSku: string }>;
  hardcover: Array<{ newSku: string }>;
  categories: {
    bookTypes: Array<{ value: string; label: string }>;
    paperbackBindings: Array<{ value: string; label: string }>;
    hardcoverBindings: Array<{ value: string; label: string }>;
  };
};

const formatLabels: Record<FormatKey, string> = {
  EBOOK: "eBook",
  AUDIOBOOK: "Audiobook",
  HARDCOVER: "Hardcover",
  PAPERBACK: "Paperback",
};

export function AuthorUploadContentPage({ accessToken, isFoundingAuthor }: { accessToken: string; isFoundingAuthor?: boolean }) {
  const router = useRouter();
  const bookId = useSearchParams().get("bookId");
  const [book, setBook] = useState<EditBook | null>(null);
  const [formats, setFormats] = useState<FormatKey[]>(["EBOOK"]);
  const [pending, setPending] = useState(false);
  const [specOptions, setSpecOptions] = useState<SpecificationOptions | null>(null);
  const [printOptions, setPrintOptions] = useState<PrintOptionsResponse | null>(null);
  const [matchedSpecs, setMatchedSpecs] = useState<Record<string, MatchResult>>({});
  const [fileValidationPending, setFileValidationPending] = useState<Record<string, boolean>>({});
  const [fileValidations, setFileValidations] = useState<Record<string, PrintFileValidationResult>>({});
  const [distributionPath, setDistributionPath] = useState<"exclusive" | "wide">("exclusive");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitType, setSubmitType] = useState<"save" | "publish">("save");

  useEffect(() => {
    if (!book?.publicationDetails) return;
    try {
      const details = JSON.parse(book.publicationDetails);
      if (details.distributionPath === "exclusive" || details.distributionPath === "wide") {
        setDistributionPath(details.distributionPath);
      }
    } catch {
      // Ignore
    }
  }, [book]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/print/specifications`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message);
        setSpecOptions(unwrapApiData<SpecificationOptions>(payload));
      })
      .catch((error: Error) => toast.error(error.message || "Unable to load print specifications."));
  }, [accessToken]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/print/options`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message);
        setPrintOptions(unwrapApiData<PrintOptionsResponse>(payload));
      })
      .catch((error: Error) =>
        toast.error(error.message || "Unable to load print option catalog."),
      );
  }, [accessToken]);

  useEffect(() => {
    if (!bookId) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message);
        setBook(payload.data);
        setFormats(payload.data.formats.map((format: { formatType: FormatKey }) => format.formatType));
      })
      .catch((error: Error) => toast.error(error.message || "Unable to load book."));
  }, [accessToken, bookId]);

  function toggleFormat(format: FormatKey) {
    setFormats((current) => (current.includes(format) ? current.filter((item) => item !== format) : [...current, format]));
  }

  const handleSpecMatch = useCallback((format: string, result: MatchResult) => {
    setMatchedSpecs((prev) => ({ ...prev, [format]: result }));
    setFileValidations((prev) => ({ ...prev, [format]: { valid: false, message: "Validate files after choosing print options." } }));
  }, []);

  async function validatePrintFiles(format: PrintFormatKey, button: HTMLButtonElement) {
    const form = button.form;
    if (!form) return;
    const source = new FormData(form);
    const interiorPdf = source.get("interiorPdf");
    const coverPdf = source.get("coverPdf");
    const match = matchedSpecs[format];
    if (!match?.sku) return toast.error("Choose a valid print configuration before validating files.");
    if (!(interiorPdf instanceof File) || !interiorPdf.size || !(coverPdf instanceof File) || !coverPdf.size) {
      return toast.error("Choose both Interior PDF and Cover PDF before validation.");
    }

    const body = new FormData();
    body.set("interiorPdf", interiorPdf);
    body.set("coverPdf", coverPdf);
    body.set("podPackageId", match.sku);
    body.set("pageCount", String(source.get(`${format}-pages`) || ""));

    setFileValidationPending((prev) => ({ ...prev, [format]: true }));
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/validate-print-files`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body,
    });
    const payload = await response.json();
    const data = unwrapApiData<PrintFileValidationResult>(payload);
    setFileValidationPending((prev) => ({ ...prev, [format]: false }));
    setFileValidations((prev) => ({ ...prev, [format]: data }));
    if (!response.ok || !data.valid) return toast.error(data.message || payload.message || "Print files did not validate.");
    toast.success("Print files validated.");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitType === "publish" && !agreedToTerms) {
      return toast.error("You must agree to the Terms and Conditions to publish.");
    }

    const source = new FormData(event.currentTarget);
    if (!formats.length) return toast.error("Select at least one book format.");
    const body = new FormData();
    ["title", "description", "isbn", "category", "language", "ageGroup"].forEach((key) => {
      const value = source.get(key);
      if (value) body.set(key, value);
    });
    body.set(
      "tags",
      JSON.stringify(
        String(source.get("tags") || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      ),
    );
    body.set(
      "formats",
      JSON.stringify(
        formats.map((formatType) => ({
          formatType,
          listPrice: Number(source.get(`${formatType}-price`) || 0),
          pageCount: ["HARDCOVER", "PAPERBACK"].includes(formatType) ? Number(source.get(`${formatType}-pages`) || 0) : undefined,
          trimSize: ["HARDCOVER", "PAPERBACK"].includes(formatType) ? String(source.get(`${formatType}-bookType`) || "US Trade") : undefined,
        })),
      ),
    );

    const fileFields = ["bookCover", "ebook", "audiobook", "interiorPdf", "coverPdf"] as const;
    fileFields.forEach((field) => {
      const file = source.get(field);
      if (file instanceof File && file.size > 0) body.set(field, file);
    });

    const printFormat = formats.find((format): format is PrintFormatKey => format === "HARDCOVER" || format === "PAPERBACK");
    const hasPrint = Boolean(printFormat);
    if (hasPrint) {
      const interiorPdf = source.get("interiorPdf");
      const coverPdf = source.get("coverPdf");
      if (!bookId && (!(interiorPdf instanceof File) || !interiorPdf.size || !(coverPdf instanceof File) || !coverPdf.size)) {
        return toast.error("Print editions require both interior and cover PDF files.");
      }
      const selectedPrintFormat = printFormat as PrintFormatKey;
      const matchResult = matchedSpecs[selectedPrintFormat];
      const fileValidation = fileValidations[selectedPrintFormat];
      if (!fileValidation?.valid) {
        return toast.error("Validate the interior and cover PDFs before saving.");
      }
      const paper = parsePaperSelection(String(source.get(`${selectedPrintFormat}-paperType`) || ""));
      body.set(
        "printEdition",
        JSON.stringify({
          enabled: true,
          bookType: String(source.get(`${selectedPrintFormat}-bookType`) || "US Trade"),
          trimSize: String(source.get(`${selectedPrintFormat}-bookType`) || "US Trade"),
          interiorColor: String(source.get(`${selectedPrintFormat}-interiorColor`) || "Black & White"),
          printQuality: String(source.get(`${selectedPrintFormat}-printQuality`) || "Standard"),
          bindingType: String(source.get(`${selectedPrintFormat}-binding`) || "Perfect"),
          paperType: paper.paperType,
          interiorPpi: paper.interiorPpi,
          coverFinish: String(source.get(`${selectedPrintFormat}-lamination`) || "Gloss"),
          linenColor: String(source.get(`${selectedPrintFormat}-linenColor`) || "X"),
          foilColor: String(source.get(`${selectedPrintFormat}-foilColor`) || "X"),
          printInsideCover: String(source.get(`${selectedPrintFormat}-printInsideCover`) || "No"),
          podPackageId: matchResult?.sku || "",
          authorProfit: 0,
          sellingPrice: Number(source.get(`${selectedPrintFormat}-price`) || 0),
        }),
      );
    }

    let authorPercentage = 0.50;
    if (isFoundingAuthor) {
      authorPercentage = 0.85;
    } else if (distributionPath === "exclusive") {
      authorPercentage = 0.70;
    } else {
      authorPercentage = 0.50;
    }
    body.set("authorEarnings", String(authorPercentage));

    body.set(
      "publicationDetails",
      JSON.stringify({
        publicationDate: String(source.get("publicationDate") || ""),
        totalPageCount: Number(source.get("totalPageCount") || 0),
        bookDimensions: String(source.get("bookDimensions") || ""),
        distributionPath,
      }),
    );

    setPending(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books${bookId ? `/${bookId}` : ""}`, {
      method: bookId ? "PUT" : "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      body,
    });
    const payload = await response.json();
    if (!response.ok) {
      setPending(false);
      return toast.error(payload.message || "Unable to save book.");
    }

    const savedBook = unwrapApiData<BackendBook>(payload);
    const actualBookId = bookId || savedBook?.id;

    if (submitType === "publish" && actualBookId) {
      const submitResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${actualBookId}/submit`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const submitPayload = await submitResponse.json();
      setPending(false);
      if (!submitResponse.ok) {
        return toast.error(submitPayload.message || "Book saved, but unable to submit for review.");
      }
      toast.success("Book successfully published and submitted for review.");
    } else {
      setPending(false);
      toast.success(bookId ? "Book updated." : "Draft book created.");
    }

    router.push("/author-dashboard/books");
    router.refresh();
  }

  const parsedPublicationDetails = useMemo(() => {
    if (!book?.publicationDetails) return null;
    try {
      return JSON.parse(book.publicationDetails) as {
        publicationDate?: string;
        totalPageCount?: number;
        bookDimensions?: string;
      };
    } catch {
      return null;
    }
  }, [book?.publicationDetails]);

  return (
    <form key={`${bookId || "new"}-${book?.title || "loading"}`} onSubmit={submit} className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#a88922]">Author workspace</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-950">{bookId ? "Edit book" : "List a new book"}</h1>
        <p className="mt-2 text-slate-500">Save the listing as a draft, then submit it for review from My Books.</p>
      </div>
      <div className="grid gap-6">
        <Card className="rounded-none bg-white">
          <CardContent className="space-y-5 p-5">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <BookOpen className="size-5" />
              Book information
            </h2>
            {printOptions ? (
              <div className="rounded-md border border-[#eadfbf] bg-[#fff9ea] p-4 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">Live print option catalog loaded</p>
                <p className="mt-1">
                  {printOptions.categories.bookTypes.length} book types,{" "}
                  {printOptions.paperback.length} paperback combinations, and{" "}
                  {printOptions.hardcover.length} hardcover combinations are available from the backend print options API.
                </p>
              </div>
            ) : null}
            <Field label="Book title" name="title" defaultValue={book?.title} required />
            <TextArea label="Description" name="description" defaultValue={book?.description || ""} required />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="ISBN (optional)" name="isbn" defaultValue={book?.isbn || ""} />
              <Field label="Category" name="category" defaultValue={book?.category || ""} required />
              <Field label="Language" name="language" defaultValue={book?.language || "English"} required />
              <Field label="Age group" name="ageGroup" defaultValue={book?.ageGroup || "Adult"} required />
            </div>
            <Field label="Tags (comma separated)" name="tags" defaultValue={book?.tags.join(", ")} />
            <FileField label="Book cover (used for all formats)" name="bookCover" accept="image/*" required={!bookId} />

            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="size-5 text-[#a88922]" />
                Publication Metadata
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Field
                  label="Publication Date"
                  name="publicationDate"
                  type="date"
                  defaultValue={parsedPublicationDetails?.publicationDate || ""}
                  required
                />
                <Field
                  label="Total Page Count"
                  name="totalPageCount"
                  type="number"
                  min="1"
                  defaultValue={parsedPublicationDetails?.totalPageCount || ""}
                  required
                />
                <Field
                  label="Book size / trim dimensions"
                  name="bookDimensions"
                  placeholder="e.g. 6 x 9 inches"
                  defaultValue={parsedPublicationDetails?.bookDimensions || ""}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="rounded-none bg-white">
        <CardContent className="space-y-5 p-5">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <FileText className="size-5" />
            Formats and pricing
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(formatLabels) as FormatKey[]).map((format) => (
              <label key={format} className="flex cursor-pointer items-center gap-2 border border-slate-200 p-3">
                <input type="checkbox" checked={formats.includes(format)} onChange={() => toggleFormat(format)} />
                {formatLabels[format]}
              </label>
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {formats.map((format) => (
              <div key={format} className="space-y-4 rounded border border-slate-200 p-5 bg-slate-50/50">
                <h3 className="font-bold text-lg text-slate-800">{formatLabels[format]} Details</h3>
                {format === "EBOOK" && <FileField label="eBook file (.pdf, .epub)" name="ebook" accept=".pdf,.epub" />}
                {format === "AUDIOBOOK" && <FileField label="Audiobook file" name="audiobook" accept="audio/*" />}
                {["HARDCOVER", "PAPERBACK"].includes(format) && (
                  <>
                    <p className="rounded bg-amber-50 p-3 text-sm text-amber-900 border border-amber-200">
                      Print editions require print-ready interior and cover PDF files.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FileField label="Interior PDF" name="interiorPdf" accept="application/pdf" />
                      <FileField label="Cover PDF" name="coverPdf" accept="application/pdf" />
                    </div>
                    <PrintSpecSelector format={format as PrintFormatKey} accessToken={accessToken} specOptions={specOptions} onMatch={handleSpecMatch} defaultPageCount={book?.formats.find((item) => item.formatType === format)?.pageCount} />
                    <div className="rounded border border-slate-200 bg-white p-4">
                      <button
                        type="button"
                        disabled={fileValidationPending[format]}
                        onClick={(event) => validatePrintFiles(format as PrintFormatKey, event.currentTarget)}
                        className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {fileValidationPending[format] ? "Validating..." : "Validate print files"}
                      </button>
                      {fileValidations[format]?.valid && (
                        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                          <p className="text-sm text-emerald-700 font-semibold flex items-center gap-1.5">
                            ✓ Files successfully validated by print partner.
                          </p>
                          <p className="text-xs text-slate-500">
                            Cover Size: {fileValidations[format].coverDimensions?.width} x {fileValidations[format].coverDimensions?.height} {fileValidations[format].coverDimensions?.unit}
                          </p>
                          <div className="flex gap-4 mt-2">
                            {fileValidations[format].files?.interiorPdf?.url && (
                              <a
                                href={fileValidations[format].files.interiorPdf.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#cfaf45] hover:underline"
                              >
                                <Eye className="size-3.5" />
                                Preview Interior PDF
                              </a>
                            )}
                            {fileValidations[format].files?.coverPdf?.url && (
                              <a
                                href={fileValidations[format].files.coverPdf.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#cfaf45] hover:underline"
                              >
                                <Eye className="size-3.5" />
                                Preview Cover PDF
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                      {fileValidations[format] && !fileValidations[format].valid && (
                        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                          <p className="text-sm text-red-700 font-semibold">
                            ✗ File validation failed
                          </p>
                          <p className="text-xs text-red-600">{fileValidations[format].message || "Files are not validated yet."}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
                <div className="grid gap-4 sm:grid-cols-2 items-end">
                  <Field label="List price (USD)" name={`${format}-price`} type="number" step="0.01" min="0" defaultValue={book?.formats.find((item) => item.formatType === format)?.listPrice ?? ""} required />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-none bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
        <CardHeader className="px-5 py-4 border-b border-[#e7e1d5]">
          <CardTitle className="flex items-center gap-2 text-[18px] font-bold text-[#23272e]">
            <Calculator className="size-5 text-[#cb9f10]" />
            Royalty Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <RoyaltyCalculator isFoundingAuthor={isFoundingAuthor} distributionPath={distributionPath} />
        </CardContent>
      </Card>
      <Card className="rounded-none bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
        <CardHeader className="px-5 py-4 border-b border-[#e7e1d5]">
          <CardTitle className="text-[18px] font-bold text-[#23272e]">
            Distribution Path <span className="text-[#d16b37]">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <DistributionPathCard
              title="WE Exclusive"
              percentage={isFoundingAuthor ? "85%" : "70% - 75%"}
              description="Maximum earnings. Your book is sold exclusively through the Wonder Emporium marketplace."
              selected={distributionPath === "exclusive"}
              onClick={() => setDistributionPath("exclusive")}
            />
            <DistributionPathCard
              title="Wide Distribution"
              percentage={isFoundingAuthor ? "85%" : "50% - 55%"}
              description="Expanded reach. Distribute to Amazon, Barnes & Noble, and independent bookstores globally."
              selected={distributionPath === "wide"}
              onClick={() => setDistributionPath("wide")}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)]">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="termsAgree"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 size-4 cursor-pointer accent-[#cfaf45]"
            />
            <label htmlFor="termsAgree" className="text-sm text-slate-600 cursor-pointer select-none">
              I agree to the{" "}
              <a
                href="/author-terms"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#cfaf45] hover:underline inline-flex items-center gap-0.5"
              >
                W.E. Books Terms and Conditions
                <ExternalLink className="size-3" />
              </a>{" "}
              and authorize W.E. Books to publish and distribute this book.
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          type="submit"
          onClick={() => setSubmitType("save")}
          disabled={pending || (book != null && !["DRAFT", "REJECTED"].includes(book.status))}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <Save className="size-4" />
          {pending && submitType === "save" ? "Saving..." : bookId ? "Save changes" : "Save as draft"}
        </button>
        <button
          type="submit"
          onClick={() => setSubmitType("publish")}
          disabled={pending || (book != null && !["DRAFT", "REJECTED"].includes(book.status))}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#cfaf45] px-6 font-semibold text-white hover:bg-[#b79731] disabled:opacity-50"
        >
          <Package className="size-4" />
          {pending && submitType === "publish" ? "Publishing..." : "Publish Book"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <input {...props} className="h-11 w-full border border-slate-300 bg-slate-50 px-3 outline-none focus:border-[#cfaf45]" />
    </label>
  );
}

function TextArea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <textarea {...props} rows={5} className="w-full border border-slate-300 bg-slate-50 p-3 outline-none focus:border-[#cfaf45]" />
    </label>
  );
}

function FileField({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
        <FileAudio className="size-4" />
        {label}
      </span>
      <input type="file" {...props} className="block w-full border border-dashed border-slate-300 bg-slate-50 p-3 text-sm" />
    </label>
  );
}

function PrintSpecSelector({
  format,
  accessToken,
  specOptions,
  onMatch,
  defaultPageCount,
}: {
  format: PrintFormatKey;
  accessToken: string;
  specOptions: SpecificationOptions | null;
  onMatch: (format: string, result: MatchResult) => void;
  defaultPageCount?: number;
}) {
  const [bookType, setBookType] = useState("");
  const [pageCount, setPageCount] = useState(defaultPageCount ? String(defaultPageCount) : "");
  const [availableOptions, setAvailableOptions] = useState<AvailableSpecificationOptions | null>(null);
  const [interiorColor, setInteriorColor] = useState("");
  const [printQuality, setPrintQuality] = useState("");
  const [binding, setBinding] = useState("");
  const [paperType, setPaperType] = useState("");
  const [lamination, setLamination] = useState("");
  const [linenColor, setLinenColor] = useState("X");
  const [foilColor, setFoilColor] = useState("X");
  const [printInsideCover, setPrintInsideCover] = useState("No");
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const availableBindings = useMemo(() => {
    if (availableOptions?.bindings?.length) return availableOptions.bindings;
    if (!specOptions?.bindings) return [];
    return format === "HARDCOVER" ? (specOptions.bindings.hardcover ?? []) : (specOptions.bindings.paperback ?? []);
  }, [availableOptions, specOptions, format]);

  const bookTypes = useMemo(() => specOptions?.bookTypes?.map((bt) => bt.value) ?? [], [specOptions]);
  const bookTypeLabels = useMemo(
    () => Object.fromEntries((specOptions?.bookTypes ?? []).map((bookType) => [bookType.value, bookType.label])),
    [specOptions],
  );
  const selectedBookType = bookType || bookTypes[0] || "";
  const interiorColors = availableOptions?.interiorColors?.map((c) => c.value) ?? [];
  const printQualities = availableOptions?.printQualities?.map((q) => q.value) ?? [];
  const paperTypes = availableOptions?.paperTypes?.map((p) => p.value) ?? [];
  const laminations = availableOptions?.laminations?.map((l) => l.value) ?? [];
  const linenColors = availableOptions?.linenColors?.map((c) => c.value) ?? [];
  const foilColors = availableOptions?.foilColors?.map((f) => f.value) ?? [];
  const printInsideCoverOptions = availableOptions?.printInsideCover?.map((f) => f.value) ?? [];

  useEffect(() => {
    if (!specOptions || !selectedBookType || !pageCount) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/print/specifications/available`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ format, bookType: selectedBookType, pageCount: Number(pageCount) }),
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message);
        const data = unwrapApiData<AvailableSpecificationOptions>(payload);
        setAvailableOptions(data);
        setInteriorColor(data.interiorColors?.[0]?.value || "");
        setPrintQuality(data.printQualities?.[0]?.value || "");
        setBinding(data.bindings?.[0]?.value || "");
        setPaperType(data.paperTypes?.[0]?.value || "");
        setLamination(data.laminations?.[0]?.value || "");
        setLinenColor("X");
        setFoilColor("X");
        setPrintInsideCover(data.printInsideCover?.[0]?.value || "No");
        setMatchResult(null);
      })
      .catch(() => setAvailableOptions(null));
  }, [specOptions, selectedBookType, pageCount, format, accessToken]);

  const isLinenWrap = binding === "Linen Wrap";

  const allSelectionsReady = selectedBookType && pageCount && interiorColor && printQuality && binding && paperType && lamination;

  useEffect(() => {
    if (!specOptions || !allSelectionsReady) return;

    const fetchMatch = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/print/match`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookType: selectedBookType,
            pageCount: Number(pageCount),
            interiorColor,
            printQuality,
            bind: binding,
            paperType,
            interiorPpi: parsePaperSelection(paperType).interiorPpi,
            lamination,
            linenColor,
            foilColor,
            printInsideCover,
          }),
        });
        const payload = await response.json();
        const data = unwrapApiData<MatchResult>(payload);
        if (response.ok && data) {
          setMatchResult(data);
          onMatch(format, data);
        }
      } catch {
        setMatchResult(null);
        onMatch(format, { found: false, sku: null, minPage: null, maxPage: null, pricing: null });
      }
    };

    fetchMatch();
  }, [specOptions, allSelectionsReady, selectedBookType, pageCount, interiorColor, printQuality, binding, paperType, lamination, linenColor, foilColor, printInsideCover, format, accessToken, onMatch]);

  if (!specOptions) {
    return (
      <div className="rounded border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-400">Loading print specifications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <SpecSelectField label="Book type / trim" name={`${format}-bookType`} options={bookTypes} labels={bookTypeLabels} value={selectedBookType} onChange={setBookType} />
        <Field label="Page count" name={`${format}-pages`} type="number" min="1" value={pageCount} onChange={(event) => setPageCount(event.target.value)} required />
      </div>

      {availableOptions?.valid === false && (
        <div className="rounded border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">No Lulu package supports this book type with {pageCount} pages. Change the page count or book type.</p>
        </div>
      )}

      {availableOptions?.validPageRange && (
        <div className="rounded border border-slate-200 bg-white p-3 text-sm text-slate-600">
          Valid package range for current selection: {availableOptions.validPageRange.minPage} - {availableOptions.validPageRange.maxPage} pages.
        </div>
      )}

      {availableOptions?.valid ? <div className="grid gap-4 sm:grid-cols-2">
        <SpecSelectField label="Interior color" name={`${format}-interiorColor`} options={interiorColors} value={interiorColor} onChange={setInteriorColor} />
        <SpecSelectField label="Print quality" name={`${format}-printQuality`} options={printQualities} value={printQuality} onChange={setPrintQuality} />
        <SpecSelectField label="Binding type" name={`${format}-binding`} options={availableBindings.map((b) => b.value)} labels={Object.fromEntries(availableBindings.map((b) => [b.value, b.label || b.value]))} value={binding} onChange={setBinding} />
        <SpecSelectField label="Paper type" name={`${format}-paperType`} options={paperTypes} value={paperType} onChange={setPaperType} />
        <SpecSelectField label="Cover finish" name={`${format}-lamination`} options={laminations} value={lamination} onChange={setLamination} />
        {isLinenWrap && (
          <SpecSelectField label="Linen color" name={`${format}-linenColor`} options={linenColors} value={linenColor} onChange={setLinenColor} />
        )}
        {isLinenWrap && (
          <SpecSelectField label="Foil color" name={`${format}-foilColor`} options={foilColors} value={foilColor} onChange={setFoilColor} />
        )}
        {!isLinenWrap && <input type="hidden" name={`${format}-linenColor`} value="X" />}
        {!isLinenWrap && <input type="hidden" name={`${format}-foilColor`} value="X" />}
        <SpecSelectField label="Print inside cover" name={`${format}-printInsideCover`} options={printInsideCoverOptions} value={printInsideCover} onChange={setPrintInsideCover} />
      </div> : <div className="rounded border border-slate-200 bg-white p-3 text-sm text-slate-500">Select a book type and page count to reveal valid Lulu options.</div>}

      {matchResult?.found && (
        <div className="rounded border-2 border-[#cfaf45] bg-amber-50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Package className="size-5 text-[#997b1e]" />
            <p className="text-sm font-bold text-[#997b1e]">Print Edition Summary</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">SKU (Pod Package ID)</p>
              <p className="font-mono text-base font-bold text-[#997b1e]">{matchResult.sku}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Manufacturing Cost</p>
              <p className="text-base font-bold text-slate-800">
                ${matchResult.pricing?.basePriceUSD.toFixed(2)} + (${matchResult.pricing?.perPagePriceUSD.toFixed(4)} per page)
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Page Range</p>
              <p className="text-sm text-slate-700">
                {matchResult.minPage} - {matchResult.maxPage} pages
              </p>
            </div>
          </div>
        </div>
      )}
      {matchResult && !matchResult.found && (
        <div className="rounded border border-red-200 bg-red-50 p-3">
          <p className="text-sm text-red-700">No matching configuration found. Please adjust your selections.</p>
        </div>
      )}
    </div>
  );
}

function SpecSelectField({
  label,
  name,
  options,
  labels,
  value,
  onChange,
}: {
  label: string;
  name: string;
  options: string[];
  labels?: Record<string, string>;
  value: string;
  onChange: (value: string) => void;
}) {
  if (!options.length) {
    return (
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-800">{label}</span>
        <div className="h-11 w-full border border-slate-200 bg-slate-100 px-3 flex items-center text-sm text-slate-400">
          No options available
        </div>
      </label>
    );
  }

  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <select
        name={name}
        value={options.includes(value) ? value : options[0]}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full border border-slate-300 bg-slate-50 px-3 outline-none focus:border-[#cfaf45]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels?.[option] || (option === "X" ? "None" : option)}
          </option>
        ))}
      </select>
    </label>
  );
}

function parsePaperSelection(value: string) {
  const [paperType, ppiPart] = value.split(" / ");
  const interiorPpi = Number(ppiPart?.replace(/\D/g, "")) || 0;
  return {
    paperType: paperType || "60# Uncoated White",
    interiorPpi,
  };
}

function unwrapApiData<T>(payload: unknown): T {
  const first = payload && typeof payload === "object" && "data" in payload ? (payload as { data?: unknown }).data : payload;
  return (first && typeof first === "object" && "data" in first ? (first as { data?: unknown }).data : first) as T;
}

function RoyaltyCalculator({
  isFoundingAuthor = false,
  distributionPath = "exclusive",
}: {
  isFoundingAuthor?: boolean;
  distributionPath?: "exclusive" | "wide";
}) {
  const [listingPrice, setListingPrice] = useState<string>("");
  const [selectedFormat, setSelectedFormat] = useState<"print" | "ebook" | "audiobook">("ebook");

  const price = parseFloat(listingPrice) || 0;

  let authorPercentage = 0.50;
  if (isFoundingAuthor) {
    authorPercentage = 0.85;
  } else if (distributionPath === "exclusive") {
    authorPercentage = selectedFormat === "print" ? 0.75 : 0.70;
  } else {
    authorPercentage = selectedFormat === "print" ? 0.55 : 0.50;
  }

  const adminPercentage = 1 - authorPercentage;
  const authorEarnings = price * authorPercentage;
  const adminEarnings = price * adminPercentage;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label htmlFor="listing-price" className="block text-sm font-medium text-slate-700">
              Book Listing Price (USD)
            </label>
            <Input
              id="listing-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={listingPrice}
              onChange={(e) => setListingPrice(e.target.value)}
              className="mt-1 bg-slate-50 focus-visible:ring-[#cb9f10]"
            />
          </div>
          <div>
            <span className="block text-sm font-medium text-slate-700 mb-1.5">Book Format</span>
            <div className="flex gap-2">
              {(["ebook", "audiobook", "print"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md border capitalize transition-all ${
                    selectedFormat === fmt
                      ? "border-[#cfaf45] bg-[#fffcf5] text-[#b79731]"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-lg bg-lime-50 p-5 border border-[#e8e0cc] flex flex-col justify-center">
          <div className="flex justify-between items-center border-b border-[#d5d2cb] pb-2 mb-2">
            <span className="text-sm font-medium text-slate-600">
              Your Cut ({Math.round(authorPercentage * 100)}%)
            </span>
            <span className="text-lg font-bold text-teal-950">${authorEarnings.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">
              Platform Fee ({Math.round(adminPercentage * 100)}%)
            </span>
            <span className="text-lg font-bold text-slate-700">${adminEarnings.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-sans">
          Official Royalty Schedule
        </span>
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs min-w-[400px]">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 font-sans">
              <tr>
                <th className="p-3">Author Tier</th>
                <th className="p-3 text-center">Print (Paperback & Hardback)</th>
                <th className="p-3 text-center">Ebook</th>
                <th className="p-3 text-center">Audiobook</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-600 font-sans">
              <tr className={`${isFoundingAuthor ? "bg-amber-50/70 font-semibold text-amber-900" : ""}`}>
                <td className="p-3 font-medium text-slate-900">Founder Authors</td>
                <td className={`p-3 text-center ${isFoundingAuthor && selectedFormat === "print" ? "bg-amber-100/50" : ""}`}>85%</td>
                <td className={`p-3 text-center ${isFoundingAuthor && selectedFormat === "ebook" ? "bg-amber-100/50" : ""}`}>85%</td>
                <td className={`p-3 text-center ${isFoundingAuthor && selectedFormat === "audiobook" ? "bg-amber-100/50" : ""}`}>85%</td>
              </tr>
              <tr className={`${(!isFoundingAuthor && distributionPath === "exclusive") ? "bg-amber-50/70 font-semibold text-amber-900" : ""}`}>
                <td className="p-3 font-medium text-slate-900">Exclusive Authors</td>
                <td className={`p-3 text-center ${!isFoundingAuthor && distributionPath === "exclusive" && selectedFormat === "print" ? "bg-amber-100/50" : ""}`}>75%</td>
                <td className={`p-3 text-center ${!isFoundingAuthor && distributionPath === "exclusive" && selectedFormat === "ebook" ? "bg-amber-100/50" : ""}`}>70%</td>
                <td className={`p-3 text-center ${!isFoundingAuthor && distributionPath === "exclusive" && selectedFormat === "audiobook" ? "bg-amber-100/50" : ""}`}>70%</td>
              </tr>
              <tr className={`${(!isFoundingAuthor && distributionPath === "wide") ? "bg-amber-50/70 font-semibold text-amber-900" : ""}`}>
                <td className="p-3 font-medium text-slate-900">Wide Authors</td>
                <td className={`p-3 text-center ${!isFoundingAuthor && distributionPath === "wide" && selectedFormat === "print" ? "bg-amber-100/50" : ""}`}>55%</td>
                <td className={`p-3 text-center ${!isFoundingAuthor && distributionPath === "wide" && selectedFormat === "ebook" ? "bg-amber-100/50" : ""}`}>50%</td>
                <td className={`p-3 text-center ${!isFoundingAuthor && distributionPath === "wide" && selectedFormat === "audiobook" ? "bg-amber-100/50" : ""}`}>50%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DistributionPathCard({
  title,
  percentage,
  description,
  selected,
  onClick,
}: {
  title: string;
  percentage: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer self-stretch bg-white p-5 inline-flex flex-col justify-start items-start gap-2 outline outline-2 outline-offset-[-2px] transition-all duration-200 ${
        selected ? "outline-[#cfaf45] bg-[#fffcf5]" : "outline-stone-300 hover:outline-[#cfaf45]/50"
      }`}
    >
      <div className="inline-flex w-full items-start justify-between">
        <div className="text-2xl font-semibold leading-7 text-neutral-800">
          {title}
        </div>
        <div className={`flex size-5 items-center justify-center rounded-full outline outline-2 outline-offset-[-2px] ${
          selected ? "outline-[#cfaf45]" : "outline-stone-200"
        }`}>
          <div className={`size-2.5 rounded-full bg-[#cfaf45] transition-all duration-200 ${selected ? "opacity-100" : "opacity-0"}`} />
        </div>
      </div>
      <div className="w-full">
        <div className="text-2xl font-bold leading-7 text-neutral-800">{percentage}</div>
      </div>
      <div className="w-full">
        <div className="text-base font-normal leading-5 text-neutral-500">
          {description}
        </div>
      </div>
    </div>
  );
}
