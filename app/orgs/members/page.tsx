"use client";

import { useQuery } from "@tanstack/react-query";
import { orgsService } from "@/lib/services/orgs.service";
import { PageHeader } from "@/app/components/shared/PageHeader";
import { Stamp } from "@/app/components/shared/Stamp";
import { formatDate, initials } from "@/lib/utils/format";

export default function OrgsMembersPage() {
  const { data: members, isLoading } = useQuery({
    queryKey: ["orgs", "me", "members"],
    queryFn: orgsService.listMembers,
  });

  return (
    <div>
      <PageHeader
        eyebrow="People on the card"
        title="Members"
        titleAccent="."
        description="Everyone who works from this workspace — by role and where they are in verification."
        actions={
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink-faint">
            {members?.length ?? "—"} members
          </span>
        }
      />

      <div className="mt-8 border-2 border-line bg-paper rounded-lg shadow-paper overflow-hidden">
        {isLoading || !members ? (
        <div className="py-24 flex items-center justify-center">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint animate-pulse">
            Counting the roll…
          </span>
        </div>
      ) : members.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-ink-soft">
          No members yet. Invite a CHEW or supervisor from the Invite tab.
        </p>
        </div>
      ) : (
        <ul className="divide-y divide-line">
            {members.map((member) => (
              <li
                key={member.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-paper-deep/30 transition-colors"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-bone font-mono text-sm font-bold text-ink">
                  {initials(member.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">
                    {member.name ?? "Unnamed member"}
                  </p>
                  <p className="truncate text-xs text-ink-soft">
                    {member.email ?? member.phone ?? "no contact on file"}
                  </p>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                    {member.role}
                  </p>
                  <p className="text-xs text-ink-faint">{formatDate(member.createdAt)}</p>
                </div>
                <Stamp
                  text={member.verificationStatus}
                  tone={member.verificationStatus === "VERIFIED" ? "leaf" : "stamp"}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}