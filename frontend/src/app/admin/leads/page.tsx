"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";
import type { Lead } from "@/lib/api/types";

const stages: Lead["stage"][] = ["new", "qualified", "proposal", "won"];

const stageLabels: Record<Lead["stage"], string> = {
  new: "New",
  qualified: "Qualified",
  proposal: "Proposal",
  won: "Won",
};

export default function AdminLeadsPage() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["leads"], queryFn: liveApi.leads });
  const stageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: Lead["stage"] }) => liveApi.updateLeadStage(id, stage),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  return (
    <QueryState<Lead>
      data={query.data}
      isLoading={query.isLoading}
      error={query.error}
      emptyMessage="No leads found yet. Create one through the booking or contact flow."
    >
      {(leads) => (
        <section className="leads-workspace">
          <div className="leads-workspace-header">
            <div>
              <p className="eyebrow">Sales Pipeline</p>
              <h2>Lead Command Board</h2>
            </div>
            <span className="lead-total-pill">{leads.length} total leads</span>
          </div>

          <div className="lead-kanban">
            {stages.map((stage) => {
              const stageLeads = leads.filter((lead) => lead.stage === stage);

              return (
                <section
                  key={stage}
                  className="lead-column"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const leadId = event.dataTransfer.getData("text/lead-id");

                    if (leadId) {
                      stageMutation.mutate({ id: leadId, stage });
                    }
                  }}
                >
                  <div className="lead-column-header">
                    <h3>{stageLabels[stage]}</h3>
                    <span>{stageLeads.length}</span>
                  </div>
                  <div className="lead-card-stack">
                    {stageLeads.length === 0 ? (
                      <p className="lead-empty-state">No leads in this stage yet.</p>
                    ) : (
                      stageLeads.map((lead) => (
                        <article
                          key={lead._id}
                          className="lead-card"
                          draggable
                          onDragStart={(event) => {
                            event.dataTransfer.setData("text/lead-id", lead._id);
                            event.dataTransfer.effectAllowed = "move";
                          }}
                        >
                          <div>
                            <h4>{lead.name}</h4>
                            <p>{lead.service}</p>
                          </div>
                          <label className="lead-stage-control">
                            Move stage
                            <select
                              value={lead.stage}
                              disabled={stageMutation.isPending}
                              onChange={(event) => {
                                stageMutation.mutate({
                                  id: lead._id,
                                  stage: event.target.value as Lead["stage"],
                                });
                              }}
                            >
                              {stages.map((stageOption) => (
                                <option key={stageOption} value={stageOption}>
                                  {stageLabels[stageOption]}
                                </option>
                              ))}
                            </select>
                          </label>
                          <div className="lead-meta-row">
                            <span>{lead.source ?? "Source pending"}</span>
                            <span>{lead.budget ?? "Budget pending"}</span>
                          </div>
                          <Link href={`/admin/leads/${lead._id}`} className="lead-card-link">
                            View lead
                          </Link>
                        </article>
                      ))
                    )}
                  </div>
                </section>
              );
            })}
          </div>
          {stageMutation.error ? <p className="field-error">{stageMutation.error.message}</p> : null}
        </section>
      )}
    </QueryState>
  );
}
