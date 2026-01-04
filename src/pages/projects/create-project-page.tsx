import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { CreateProjectForm } from '@/features/project/creation';

export function CreateProjectPage() {

  return (
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <CreateProjectForm />
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>About Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A project represents a specific software component, service, or
                database that you want to deploy and manage. Each project has
                its own deployment process.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
