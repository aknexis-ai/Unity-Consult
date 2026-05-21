import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Service } from "@/lib/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card glass">
      <div className="card-topline">{service.category}</div>
      <h3>{service.name}</h3>
      <p>{service.short}</p>
      <div className="meta-row">
        <span>{service.priceFrom}</span>
        <span>{service.delivery}</span>
      </div>
      <ul className="mini-list">
        {service.outcomes.slice(0, 3).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Link href={`/services/${service.slug}`} className="inline-link">
        Explore service
        <ArrowRight size={16} />
      </Link>
    </article>
  );
}
