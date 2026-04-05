type TaskDetailPageProps = {
  params: {
    id: string;
  };
};

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  return (
    <main style={{ padding: 24 }}>
      <h1>Task {params.id}</h1>
      <p>Task detail view scaffold. Wire to `/api/tasks/:id` and `/api/tasks/:id/events`.</p>
    </main>
  );
}
