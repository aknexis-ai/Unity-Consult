"use client";

import { useQuery } from "@tanstack/react-query";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { TeamMember } from "@/lib/api/types";

export default function AdminTeamPage() {
  const query = useQuery({ queryKey: ["team"], queryFn: liveApi.team });

  return (
    <QueryState<TeamMember>
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      emptyMessage="No team members found yet."
    >
      {(members) => (
        <section className="card">
          <h3>Team and RBAC</h3>
          <div className="card-grid">
            {members.map((member) => (
              <article key={member._id} className="card inset-card">
                <h4>{member.name}</h4>
                <p>{member.role}</p>
                <ul className="detail-list">
                  <li>Focus: {member.focus}</li>
                  <li>Status: {member.status}</li>
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}
    </QueryState>
  );
}
