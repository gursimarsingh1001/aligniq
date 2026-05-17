import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

export type PlaceholderCard = {
  title: string;
  description: string;
};

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  cards: PlaceholderCard[];
};

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  cards
}: PlaceholderPageProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border bg-card p-5 shadow-subtle">
        <Badge variant="secondary">{eyebrow}</Badge>
        <div className="mt-4 max-w-3xl">
          <h1 className="text-2xl font-semibold tracking-normal text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </section>

      {cards.length > 0 ? (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Card key={card.title}>
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="muted">Planned workspace</Badge>
              </CardContent>
            </Card>
          ))}
        </section>
      ) : (
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">
              No placeholder content has been configured for this page yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


