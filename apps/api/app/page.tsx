import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Separator } from '@repo/design-system/components/ui/separator';

export default function ApiWelcomePage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Welcome to Zopio API
          </h1>
          <p className="text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Your powerful backend service is up and running
          </p>
        </div>

        <div className="w-full max-w-3xl grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>API Status</CardTitle>
                <Badge variant="success" className="bg-green-500">Online</Badge>
              </div>
              <CardDescription>
                Your API is operational and ready to handle requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Environment</span>
                    <span className="font-medium">{process.env.NODE_ENV}</span>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</span>
                    <span className="font-medium">1.0.0</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" asChild>
                <a href="/health" target="_blank" rel="noopener noreferrer">
                  Health Check
                </a>
              </Button>
              <Button asChild>
                <a href="/docs" target="_blank" rel="noopener noreferrer">
                  API Documentation
                </a>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Endpoints</CardTitle>
              <CardDescription>
                Quick access to important API endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center justify-between">
                  <span className="font-medium">/health</span>
                  <Badge>GET</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-medium">/webhooks</span>
                  <Badge>POST</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span className="font-medium">/cron</span>
                  <Badge>GET</Badge>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
