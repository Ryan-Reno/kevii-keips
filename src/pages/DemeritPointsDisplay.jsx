import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";
import { formatDateTimeMix } from "../helper/functions";

const DemeritPointsDisplay = ({ demeritPoints, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="mt-5 w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Demerit Points
            <Skeleton className="h-8 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const { totalPoints = 0, demerits = [] } = demeritPoints || {};

  return (
    <Card className="mt-5 w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Demerit Points
          <Badge
            variant={
              totalPoints >= 3 && totalPoints < 5
                ? "caution"
                : totalPoints >= 5
                ? "destructive"
                : "secondary"
            }
            className="text-md px-3 py-2"
          >
            {totalPoints} Points
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {totalPoints >= 3 && (
          <Alert variant={totalPoints >= 5 ? "destructive" : "caution"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              You have accumulated {totalPoints} demerit points. Users with 5 or
              more points may face booking restrictions.
            </AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          {demerits?.map((demerit) => (
            <Card key={demerit._id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <p className="font-medium md:max-w-48 max-w-48">
                      {demerit.reason}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateTimeMix(demerit.checkedAt)}
                    </p>
                  </div>
                  <Badge variant="outline">+{demerit.points} Point</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

DemeritPointsDisplay.propTypes = {
  isLoading: PropTypes.bool,
  demeritPoints: PropTypes.shape({
    totalPoints: PropTypes.number,
    demeritsByReason: PropTypes.object,
    demerits: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        user: PropTypes.string,
        reason: PropTypes.string.isRequired,
        points: PropTypes.number.isRequired,
        checkedAt: PropTypes.string.isRequired,
        bookingId: PropTypes.string,
        checkInId: PropTypes.string,
        __v: PropTypes.number,
      })
    ),
  }),
};

DemeritPointsDisplay.defaultProps = {
  isLoading: false,
  demeritPoints: {
    totalPoints: 0,
    demeritsByReason: {},
    demerits: [],
  },
};

export default DemeritPointsDisplay;
