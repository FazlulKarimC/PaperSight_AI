interface SummaryContentViewerProps {
  summaryText: string;
}

export const SummaryContentViewer = ({ summaryText }: SummaryContentViewerProps) => {
  // Parse the markdown sections
  const sections = summaryText.split('\n# ').filter(Boolean);

  return (
    <div className="w-full space-y-8 text-foreground">
      {sections.map((section, index) => {
        const [title, ...points] = section.split('\n');
        return (
          <div key={index} className="space-y-4">
            <h2 className="text-xl font-semibold text-accent flex items-center gap-2">
              <span className="w-1 h-6 bg-accent rounded-full" />
              {title.trim()}
            </h2>
            <div className="space-y-2 pl-3 border-l border-border">
              {points
                .filter(point => point.trim().startsWith('•'))
                .map((point, pointIndex) => (
                  <div
                    key={pointIndex}
                    className="flex items-start text-sm leading-relaxed text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <div dangerouslySetInnerHTML={{ __html: point }} className="pl-1" />
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};