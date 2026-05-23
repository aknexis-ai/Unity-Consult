import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import type { Service } from "@/lib/services";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="service-visual-card" style={{ "--service-accent": service.accent } as React.CSSProperties}>
      <div className="service-card-media">
        <Image
          src={service.media.card}
          alt={service.media.alt}
          fill
          sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="service-card-body">
        <div className="card-topline">{service.category}</div>
        <h3>{service.name}</h3>
        <p>{service.short}</p>
        <div className="meta-row" style={{ marginBottom: "0.5rem" }}>
          <span>{service.priceFrom}</span>
          <span>{service.delivery}</span>
        </div>
        <ul className="mini-list" style={{ marginBottom: "0.75rem" }}>
          {service.outcomes.slice(0, 3).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link href={`/services/${service.slug}`} className="inline-link">
          Explore service
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
