import { ServiceSticker } from "@/components/ServiceSticker";
import { business } from "@/config/business";

export function Price() {
  return (
    <section id="price" className="scroll-mt-28 px-4 py-10 sm:scroll-mt-24 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-12">
        <div className="max-w-md">
          <h2 className="font-display text-[clamp(1.35rem,3vw,2rem)] text-silver-100">
            Visiting charge
          </h2>
          <p className="mt-3 text-silver-500">
            Clear pricing before the technician arrives. Labour depends on the
            repair.
          </p>
        </div>

        <ServiceSticker
          title="Service visit"
          figure={`Rs ${business.visitingChargeInr}`}
          fields={[
            { label: "Visiting charge", value: `Rs ${business.visitingChargeInr}` },
            { label: "Labour", value: "Extra, based on the repair" },
          ]}
          footer={
            business.labourPolicyConfirmed ? business.labourPolicyLine : null
          }
        />
      </div>
      {business.labourPolicyConfirmed ? null : (
        <p className="mx-auto mt-6 max-w-6xl text-sm text-silver-500">
          Labour is extra, based on the repair.
        </p>
      )}
    </section>
  );
}
