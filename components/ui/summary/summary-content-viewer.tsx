interface SummaryContentViewerProps {
  summaryText: string;
}

export const SummaryContentViewer = ({ summaryText }: SummaryContentViewerProps) => {
  // Parse the markdown sections
  const sections = summaryText.split('\n# ').filter(Boolean);

  return (
    <div className="w-full space-y-6 text-gray-700">
      {sections.map((section, index) => {
        const [title, ...points] = section.split('\n');
        return (
          <div key={index} className="space-y-3">
            <h2 className="text-xl font-semibold text-pink-600">{title.trim()}</h2>
            <div className="space-y-2">
              {points
                .filter(point => point.trim().startsWith('•'))
                .map((point, pointIndex) => (
                  <div 
                    key={pointIndex} 
                    className="flex items-start text-sm leading-relaxed"
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