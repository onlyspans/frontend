import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { CreateSpaceForm } from '@/features/space/creation';

export function CreateSpacePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <CreateSpaceForm />
      </div>

      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>About Spaces</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A space is a workspace that helps you organize your projects and
              resources. Each space can have its own team members, settings, and
              deployment configurations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
