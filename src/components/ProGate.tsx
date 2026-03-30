import { ReactNode } from "react";

type ProGateProps = {
  isPaid: boolean;
  preview?: string;
  fullContent: string;
  onUpgrade: () => void;
};

export default function ProGate({
  isPaid,
  preview,
  fullContent,
  onUpgrade,
}: ProGateProps) {
  const contentToShow = isPaid
    ? fullContent
    : preview || fullContent.split("\n").slice(0, 15).join("\n");

  return (
    <div className="relative">
      <div className={`max-h-[500px] overflow-y-auto text-xs whitespace-pre-wrap font-mono ${!isPaid ? "overflow-hidden" : ""}`}>
        {contentToShow}
      </div>

      {!isPaid && (
        <>
          {/* Blur */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />

          {/* CTA */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-[#111827] border border-gray-800 px-6 py-5 rounded-xl text-center shadow-xl max-w-sm w-full">

              <div className="text-2xl mb-2">🚀🔒</div>

              <h3 className="text-sm font-semibold mb-1">
                Unlock Full Access
              </h3>

              <p className="text-xs text-gray-400 mb-4">
                Get full results, downloads & recruiter-ready formatting.
              </p>

              <button
                onClick={onUpgrade}
                className="bg-[#C9A84C] text-black font-semibold px-5 py-2 rounded-lg text-sm"
              >
                Upgrade to Pro
              </button>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
