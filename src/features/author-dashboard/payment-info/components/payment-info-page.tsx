"use client";

import {
  CheckCircle,
  CreditCard,
  FileText,
  DollarSign,
  ArrowRight,
  Clock,
  AlertCircle,
  Banknote,
  ShieldCheck,
  RefreshCw,
  Send,
  Wallet,
} from "lucide-react";

type FlowStep = {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
};

type InfoCard = {
  icon: React.ReactNode;
  title: string;
  items: string[];
  accentColor: string;
};

const onboardingSteps: FlowStep[] = [
  {
    icon: <FileText className="size-6 text-white" />,
    title: "Complete Your Profile",
    description:
      "Fill in all required author details — name, bio, tax information, and contact info. This is required before any payout can be processed.",
    badge: "Step 1",
    badgeColor: "bg-[#cfaf45]",
  },
  {
    icon: <ShieldCheck className="size-6 text-white" />,
    title: "Submit Tax & ID Documents",
    description:
      "Upload your government-issued ID (front & back) and any applicable tax forms. Our team reviews and verifies your identity within 1–3 business days.",
    badge: "Step 2",
    badgeColor: "bg-[#66756d]",
  },
  {
    icon: <Wallet className="size-6 text-white" />,
    title: "Set Payout Preferences",
    description:
      "Choose your preferred payout method — Bank Transfer, PayPal, or Stripe. Add and confirm your banking details in the Payout Preferences section.",
    badge: "Step 3",
    badgeColor: "bg-[#cfaf45]",
  },
  {
    icon: <CheckCircle className="size-6 text-white" />,
    title: "Onboarding Approved",
    description:
      "Once your documents are verified and payout method is set, your account is fully activated. You can now earn royalties from your published works.",
    badge: "Step 4",
    badgeColor: "bg-[#24352f]",
  },
];

const paymentFlowSteps: FlowStep[] = [
  {
    icon: <DollarSign className="size-6 text-white" />,
    title: "Revenue Generated",
    description:
      "Readers purchase your books or subscribe to your content. Sales data is tracked in real-time in your Orders dashboard.",
    badge: "Trigger",
    badgeColor: "bg-[#66756d]",
  },
  {
    icon: <RefreshCw className="size-6 text-white" />,
    title: "Royalty Calculation",
    description:
      "At the end of each billing period, your earnings are calculated based on the agreed royalty rate (typically 70%). Platform fees are deducted.",
    badge: "Processing",
    badgeColor: "bg-[#cfaf45]",
  },
  {
    icon: <Send className="size-6 text-white" />,
    title: "Payout Request Created",
    description:
      "A payout request is automatically generated on the 1st of every month if your balance exceeds the minimum threshold ($25). You'll receive an email notification.",
    badge: "Auto",
    badgeColor: "bg-[#24352f]",
  },
  {
    icon: <Clock className="size-6 text-white" />,
    title: "Under Review",
    description:
      "Our finance team reviews the payout request to ensure compliance. This typically takes 1–2 business days.",
    badge: "Review",
    badgeColor: "bg-amber-500",
  },
  {
    icon: <Banknote className="size-6 text-white" />,
    title: "Payment Disbursed",
    description:
      "Once approved, payment is sent to your registered payout method. Bank transfers take 3–5 business days; PayPal & Stripe are instant.",
    badge: "Done",
    badgeColor: "bg-green-600",
  },
];

const infoCards: InfoCard[] = [
  {
    icon: <CreditCard className="size-5 text-[#66756d]" />,
    title: "Accepted Payout Methods",
    accentColor: "border-[#66756d]",
    items: [
      "Bank Transfer (ACH / SWIFT)",
      "PayPal",
      "Stripe Connected Account",
    ],
  },
  {
    icon: <Clock className="size-5 text-[#cfaf45]" />,
    title: "Payout Schedule",
    accentColor: "border-[#cfaf45]",
    items: [
      "Payouts processed on 1st of each month",
      "Minimum threshold: $25.00",
      "Bank: 3–5 business days to arrive",
      "PayPal / Stripe: Instant",
    ],
  },
  {
    icon: <AlertCircle className="size-5 text-red-500" />,
    title: "Important Notes",
    accentColor: "border-red-400",
    items: [
      "Tax documents must be verified first",
      "Unverified accounts cannot receive payouts",
      "Incorrect bank details cause payout failure",
      "Contact support for disputed transactions",
    ],
  },
];

function StepCard({ step, index, total }: { step: FlowStep; index: number; total: number }) {
  return (
    <div className="relative flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-full ${step.badgeColor}`}
        >
          {step.icon}
        </div>
        {index < total - 1 && (
          <div className="mt-2 h-full w-0.5 bg-gradient-to-b from-stone-300 to-transparent" />
        )}
      </div>
      <div className="flex-1 pb-8">
        <div className="mb-1 flex items-center gap-2">
          {step.badge && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${step.badgeColor}`}
            >
              {step.badge}
            </span>
          )}
          <h3 className="text-base font-bold text-neutral-800">{step.title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-neutral-600">{step.description}</p>
      </div>
    </div>
  );
}

function InfoCard({ card }: { card: InfoCard }) {
  return (
    <div
      className={`rounded-xl border-l-4 bg-white p-5 shadow-sm ring-1 ring-stone-200 ${card.accentColor}`}
    >
      <div className="mb-3 flex items-center gap-2">
        {card.icon}
        <h3 className="text-sm font-bold text-neutral-800">{card.title}</h3>
      </div>
      <ul className="space-y-2">
        {card.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
            <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-neutral-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PaymentInfoPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Page Header */}
      <div className="rounded-2xl bg-[#24352f] px-8 py-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#cfaf45]">
            <DollarSign className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">Payment Information & Flow</h1>
            <p className="mt-1 text-sm text-white/70">
              Understand how onboarding payments, royalties, and payout requests work on Wonder
              Emporium.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {infoCards.map((card, i) => (
          <InfoCard key={i} card={card} />
        ))}
      </div>

      {/* Onboarding Payment Flow */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <div className="mb-6 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#66756d]">
              <ShieldCheck className="size-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Author Onboarding Flow</h2>
              <p className="text-xs text-neutral-500">
                Steps required to activate your account for payouts
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-0">
          {onboardingSteps.map((step, i) => (
            <StepCard key={i} step={step} index={i} total={onboardingSteps.length} />
          ))}
        </div>
      </div>

      {/* Payment Request Flow */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <div className="mb-6 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#cfaf45]">
              <Banknote className="size-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Payment Request Flow</h2>
              <p className="text-xs text-neutral-500">
                How your royalties are processed and disbursed each month
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-0">
          {paymentFlowSteps.map((step, i) => (
            <StepCard key={i} step={step} index={i} total={paymentFlowSteps.length} />
          ))}
        </div>
      </div>

      {/* Support Banner */}
      <div className="flex items-center justify-between rounded-2xl bg-[#fcfbf7] px-6 py-5 ring-1 ring-stone-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="size-5 shrink-0 text-[#cfaf45]" />
          <div>
            <p className="text-sm font-semibold text-neutral-800">Need help with payments?</p>
            <p className="text-xs text-neutral-500">
              Our support team is available Mon–Fri, 9am–6pm EST.
            </p>
          </div>
        </div>
        <a
          href="mailto:support@wonderemporium.com"
          className="shrink-0 rounded-lg bg-[#24352f] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1a2620]"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
