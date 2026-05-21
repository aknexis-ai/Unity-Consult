"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { QueryState } from "@/components/query-state";
import { liveApi } from "@/lib/api/resources";

type SettingRow = {
  key: "notifications" | "billingAlerts" | "weeklyDigest";
  label: string;
  detail: string;
};

const settingRows: SettingRow[] = [
  { key: "notifications", label: "Project notifications", detail: "Milestone, document, and message updates." },
  { key: "billingAlerts", label: "Billing alerts", detail: "Invoice, payment, and receipt notifications." },
  { key: "weeklyDigest", label: "Weekly digest", detail: "A weekly project and support summary." },
];

export default function PortalSettingsPage() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["settings", "me"], queryFn: liveApi.mySettings });
  const mutation = useMutation({
    mutationFn: liveApi.updateMySettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["settings", "me"] });
    },
  });

  return (
    <QueryState data={query.data ? [query.data] : undefined} isLoading={query.isLoading} error={query.error} emptyMessage="Settings are not available yet.">
      {([settings]) => (
        <section className="card">
          <h3>Account settings</h3>
          <div className="stack">
            {settingRows.map((row) => (
              <label key={row.key} className="settings-row">
                <span>
                  <strong>{row.label}</strong>
                  <small>{row.detail}</small>
                </span>
                <input
                  type="checkbox"
                  checked={Boolean(settings[row.key])}
                  onChange={(event) => mutation.mutate({ [row.key]: event.target.checked })}
                />
              </label>
            ))}
          </div>
          <div className="split-grid">
            <label>
              Locale
              <select value={settings.locale} onChange={(event) => mutation.mutate({ locale: event.target.value })}>
                <option value="en-IN">English (India)</option>
                <option value="en-US">English (US)</option>
              </select>
            </label>
            <label>
              Timezone
              <select value={settings.timezone} onChange={(event) => mutation.mutate({ timezone: event.target.value })}>
                <option value="Asia/Kolkata">Asia/Kolkata</option>
                <option value="UTC">UTC</option>
              </select>
            </label>
          </div>
          {mutation.error ? <p className="field-error">{mutation.error.message}</p> : null}
        </section>
      )}
    </QueryState>
  );
}
