import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dogs')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dogs"!</div>
}
