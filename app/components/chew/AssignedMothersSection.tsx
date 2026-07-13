"use client";

import { Users, Search, Filter } from "lucide-react";
import { FadeInUp } from "@/app/components/animations";
import { SectionHeading } from "@/app/components/ui/SectionHeading";
import { Container } from "@/app/components/ui/Container";
import { Card } from "@/app/components/ui/Card";

const mothers = [
  {
    name: "Amina Bello",
    age: 24,
    stage: "7 months pregnant",
    language: "Hausa",
    risk: "High",
    nextFollowUp: "Tomorrow",
  },
  {
    name: "Fatima Usman",
    age: 28,
    stage: "4 months pregnant",
    language: "Hausa",
    risk: "Low",
    nextFollowUp: "Next week",
  },
  {
    name: "Grace Okonkwo",
    age: 31,
    stage: "Postpartum (2 weeks)",
    language: "Igbo",
    risk: "Medium",
    nextFollowUp: "In 3 days",
  },
  {
    name: "Hauwa Adamu",
    age: 22,
    stage: "6 months pregnant",
    language: "Pidgin",
    risk: "Low",
    nextFollowUp: "Next week",
  },
  {
    name: "Blessing John",
    age: 26,
    stage: "Postpartum (6 weeks)",
    language: "English",
    risk: "Low",
    nextFollowUp: "In 2 weeks",
  },
];

export default function AssignedMothersSection() {
  return (
    <Container id="mothers" className="bg-background-soft">
      <FadeInUp>
        <SectionHeading
          badge="Mothers"
          title="Your Assigned Mothers"
          description="A complete view of every mother under your care, their pregnancy stage, and risk status."
        />
      </FadeInUp>

      <FadeInUp>
        <Card className="overflow-hidden">
          <div className="p-4 md:p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  5 Assigned Mothers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-background-soft transition-colors" aria-label="Search">
                  <Search className="w-4 h-4 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-background-soft transition-colors" aria-label="Filter">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 md:px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Stage
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                    Language
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Follow-up
                  </th>
                </tr>
              </thead>
              <tbody>
                {mothers.map((mother) => (
                  <tr
                    key={mother.name}
                    className="border-b border-border/50 last:border-0 hover:bg-background-soft/50 transition-colors"
                  >
                    <td className="px-4 md:px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {mother.name}
                        </p>
                        <p className="text-xs text-muted-foreground md:hidden">
                          {mother.stage}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground hidden md:table-cell">
                      {mother.stage}
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground hidden sm:table-cell">
                      {mother.language}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          mother.risk === "High"
                            ? "bg-red-50 text-red-600"
                            : mother.risk === "Medium"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-primary-light text-primary-dark"
                        }`}
                      >
                        {mother.risk}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground hidden md:table-cell">
                      {mother.nextFollowUp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </FadeInUp>
    </Container>
  );
}
