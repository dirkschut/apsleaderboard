import {
  boolean,
  foreignKey,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
  id: serial().primaryKey().notNull(),
  token: text(),
  expiry: timestamp(),
});

export const problems = pgTable("problems", {
  id: serial().primaryKey().notNull(),
  title: text(),
  description: text(),
  episode: integer(),
  solver: integer(),
});

export const votes = pgTable("votes", {
  id: serial().primaryKey().notNull(),
  problemId: integer("problem_id"),
  opposingProblemId: integer("opposing_problem_id"),
  sessionID: integer("session_id"),
  leftorright: boolean(),
  dateTimeVoted: timestamp("date_time_voted", { mode: "string" }).defaultNow(),
}, (table) => {
  return {
    votesProblemIdFkey: foreignKey({
      columns: [table.problemId],
      foreignColumns: [problems.id],
      name: "votes_problem_id_fkey",
    }),
    votesOpposingProblemIdFkey: foreignKey({
      columns: [table.opposingProblemId],
      foreignColumns: [problems.id],
      name: "votes_opposing_problem_id_fkey",
    }),
    votesSessionIdFkey: foreignKey({
      columns: [table.sessionID],
      foreignColumns: [sessions.id],
      name: "votes_session_id_fkey",
    }),
  };
});
