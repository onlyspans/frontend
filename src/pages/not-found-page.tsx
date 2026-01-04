import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-8xl font-bold text-muted-foreground/20">404</div>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">Page Not Found</h1>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
          <Button asChild variant="default" size="lg">
            <Link to="/" className="flex items-center gap-2">
              <Home className="size-4" />
              Go Home
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
