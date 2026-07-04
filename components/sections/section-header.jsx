import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function SectionHeader({
  eyebrow,
  title,
  gradientWord,
  description,
  align = 'center',
  className,
}) {
  // Render title, wrapping the gradientWord if present.
  const renderTitle = () => {
    if (!gradientWord) return title;
    const parts = title.split(gradientWord);
    return (
      <>
        {parts[0]}
        <span className="text-gradient">{gradientWord}</span>
        {parts.slice(1).join(gradientWord)}
      </>
    );
  };

  return (
    <div
      className={cn(
        'mx-auto max-w-2xl',
        align === 'center' ? 'text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <Badge
          variant="outline"
          className="mb-4 border-primary/30 bg-primary/5 text-primary"
        >
          {eyebrow}
        </Badge>
      )}
      <h2 className="font-[Space_Grotesk] text-4xl font-bold tracking-tight md:text-5xl">
        {renderTitle()}
      </h2>
      {description && (
        <p className="mt-4 text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
