"use client";

import Link from "next/link";
import { useAuth } from "@/app/lib/context/auth-context";
import { Button } from "@/components/ui/button";
import { deletePoll } from "@/app/lib/actions/poll-actions";

interface Poll {
  id: string;
  question: string;
  options: any[];
  user_id: string;
}

interface PollActionsProps {
  poll: Poll;
}

/**
 * PollActions - A card component that displays poll information and provides user actions
 *
 * This component serves as the primary interface for poll interaction in the application.
 * It renders a clickable card that navigates to the poll detail page, while also providing
 * authenticated users with edit/delete capabilities for polls they own.
 *
 * Key behaviors:
 * - Displays poll question and option count in a card layout
 * - Provides navigation to poll detail page via Next.js Link
 * - Shows edit/delete buttons only to poll owners (user.id === poll.user_id)
 * - Handles poll deletion with confirmation dialog and page refresh
 *
 * Context dependencies:
 * - Requires useAuth context to determine current user and ownership
 * - Connects to poll-actions for delete functionality
 * - Integrates with Next.js routing for navigation
 *
 * Assumptions:
 * - Poll object always has valid id, question, options array, and user_id
 * - useAuth context is properly initialized and provides user object
 * - deletePoll action handles server-side deletion and error cases
 * - User authentication state is reliable for ownership checks
 *
 * Edge cases handled:
 * - Unauthenticated users see read-only card without action buttons
 * - Non-owners see card but no edit/delete options
 * - Delete confirmation prevents accidental poll removal
 * - Window reload ensures UI reflects deletion (could be improved with state management)
 *
 * Component relationships:
 * - Used in poll listing pages to display multiple polls
 * - Links to PollDetail component via dynamic routing
 * - Likely used alongside PollEdit component for the edit flow
 * - Depends on shared Button and UI components for consistent styling
 */
export default function PollActions({ poll }: PollActionsProps) {
  const { user } = useAuth();
  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this poll?")) {
      await deletePoll(poll.id);
      window.location.reload();
    }
  };

  return (
    <div className="border rounded-md shadow-md hover:shadow-lg transition-shadow bg-white">
      <Link href={`/polls/${poll.id}`}>
        <div className="group p-4">
          <div className="h-full">
            <div>
              <h2 className="group-hover:text-blue-600 transition-colors font-bold text-lg">
                {poll.question}
              </h2>
              <p className="text-slate-500">{poll.options.length} options</p>
            </div>
          </div>
        </div>
      </Link>
      {user && user.id === poll.user_id && (
        <div className="flex gap-2 p-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/polls/${poll.id}/edit`}>Edit</Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}
