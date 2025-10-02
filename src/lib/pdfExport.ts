import jsPDF from 'jspdf';

export interface ShelterSpecs {
  name: string;
  description: string;
  category: string;
  deploymentTime: number;
  weatherRating: number;
  capacity: number;
  availability: string;
  deploymentDifficulty: string;
  features: string[];
  useCases?: string[];
  technicalSpecs?: {
    dimensions: string;
    weight: string;
    materials: string;
    power: string;
    climate: string;
    certifications: string;
  };
}

export const generateShelterPDF = (shelter: ShelterSpecs): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Weatherhaven', 20, yPosition);
  
  yPosition += 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Deployable Shelter Solutions', 20, yPosition);
  
  yPosition += 20;
  
  // Shelter Name
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(shelter.name, 20, yPosition);
  
  yPosition += 15;
  
  // Description
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const descriptionLines = doc.splitTextToSize(shelter.description, pageWidth - 40);
  doc.text(descriptionLines, 20, yPosition);
  yPosition += descriptionLines.length * 6 + 10;
  
  // Key Specifications
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Specifications', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Deployment Time: ${shelter.deploymentTime} hour${shelter.deploymentTime > 1 ? 's' : ''}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Capacity: ${shelter.capacity} personnel`, 20, yPosition);
  yPosition += 6;
  doc.text(`Weather Rating: ${'★'.repeat(shelter.weatherRating)}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Deployment Difficulty: ${shelter.deploymentDifficulty}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Availability: ${shelter.availability}`, 20, yPosition);
  yPosition += 15;
  
  // Technical Specifications
  if (shelter.technicalSpecs) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Technical Specifications', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dimensions: ${shelter.technicalSpecs.dimensions}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Weight: ${shelter.technicalSpecs.weight}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Materials: ${shelter.technicalSpecs.materials}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Power: ${shelter.technicalSpecs.power}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Climate Range: ${shelter.technicalSpecs.climate}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Certifications: ${shelter.technicalSpecs.certifications}`, 20, yPosition);
    yPosition += 15;
  }
  
  // Features
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Features', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  shelter.features.forEach(feature => {
    doc.text(`• ${feature}`, 20, yPosition);
    yPosition += 6;
  });
  yPosition += 10;
  
  // Use Cases
  if (shelter.useCases && shelter.useCases.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Use Cases', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    shelter.useCases.forEach(useCase => {
      doc.text(`• ${useCase}`, 20, yPosition);
      yPosition += 6;
    });
    yPosition += 10;
  }
  
  // Contact Information
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Contact Weatherhaven', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('For more information or to request a quote:', 20, yPosition);
  yPosition += 8;
  doc.text('Website: www.weatherhaven.com', 20, yPosition);
  yPosition += 6;
  doc.text('Email: sales@weatherhaven.com', 20, yPosition);
  yPosition += 6;
  doc.text('Phone: +1 (604) 888-8888', 20, yPosition);
  
  // Footer
  const footerY = pageHeight - 20;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, footerY);
  doc.text('© 2024 Weatherhaven. All rights reserved.', pageWidth - 80, footerY);
  
  // Save the PDF
  doc.save(`${shelter.name}-Specifications.pdf`);
};

export const generateComparisonPDF = (shelters: ShelterSpecs[]): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Weatherhaven', 20, yPosition);
  
  yPosition += 10;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text('Shelter Comparison Report', 20, yPosition);
  
  yPosition += 20;
  
  // Comparison Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Shelter Comparison', 20, yPosition);
  yPosition += 15;
  
  // Table headers
  const col1 = 20;
  const col2 = 80;
  const col3 = 140;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Specification', col1, yPosition);
  doc.text(shelters[0]?.name || 'TRECC', col2, yPosition);
  doc.text(shelters[1]?.name || 'HERCONN', col3, yPosition);
  yPosition += 8;
  
  // Table rows
  doc.setFont('helvetica', 'normal');
  const specs = [
    { label: 'Deployment Time', getValue: (s: ShelterSpecs) => `${s.deploymentTime} hour${s.deploymentTime > 1 ? 's' : ''}` },
    { label: 'Capacity', getValue: (s: ShelterSpecs) => `${s.capacity} personnel` },
    { label: 'Weather Rating', getValue: (s: ShelterSpecs) => '★'.repeat(s.weatherRating) },
    { label: 'Difficulty', getValue: (s: ShelterSpecs) => s.deploymentDifficulty },
    { label: 'Dimensions', getValue: (s: ShelterSpecs) => s.technicalSpecs?.dimensions || 'N/A' },
    { label: 'Weight', getValue: (s: ShelterSpecs) => s.technicalSpecs?.weight || 'N/A' },
    { label: 'Materials', getValue: (s: ShelterSpecs) => s.technicalSpecs?.materials || 'N/A' },
    { label: 'Power', getValue: (s: ShelterSpecs) => s.technicalSpecs?.power || 'N/A' },
    { label: 'Climate Range', getValue: (s: ShelterSpecs) => s.technicalSpecs?.climate || 'N/A' }
  ];
  
  specs.forEach(spec => {
    doc.text(spec.label, col1, yPosition);
    doc.text(spec.getValue(shelters[0]), col2, yPosition);
    doc.text(spec.getValue(shelters[1]), col3, yPosition);
    yPosition += 6;
  });
  
  yPosition += 20;
  
  // Contact Information
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Contact Weatherhaven', 20, yPosition);
  yPosition += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('For more information or to request a quote:', 20, yPosition);
  yPosition += 8;
  doc.text('Website: www.weatherhaven.com', 20, yPosition);
  yPosition += 6;
  doc.text('Email: sales@weatherhaven.com', 20, yPosition);
  yPosition += 6;
  doc.text('Phone: +1 (604) 888-8888', 20, yPosition);
  
  // Footer
  const footerY = pageHeight - 20;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, footerY);
  doc.text('© 2024 Weatherhaven. All rights reserved.', pageWidth - 80, footerY);
  
  // Save the PDF
  doc.save('Weatherhaven-Shelter-Comparison.pdf');
};
